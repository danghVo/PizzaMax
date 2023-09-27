const { Product, Type, Crust, Size, Flavor, Drink } = require('../models');

const throwError = require('../utils/throwError');
const sectionServiceName = require('../utils/sectionServiceName');

const Service = require('./Service');

const TypeService = require('./TypeService');
const FlavorService = require('./FlavorService');
const SizeService = require('./SizeService');
const DrinkService = require('./DrinkService');
const CrustService = require('./CrustService');
const FavoriteService = require('./FavoriteService');
const S3Service = require('./S3Service');

class ProductService extends Service {
    constructor() {
        super('ProductService', Product);
    }

    form(payload, mustFull = true) {
        const product = {
            name: payload?.name,
            price: payload?.price,
        };

        Object.keys(product).forEach((key) => {
            product[key] || (mustFull ? throwError(400, `Missing field: ${key}`) : delete product[key]);
        });

        return { ...product, description: payload?.description || '', signature: payload?.signature || false };
    }

    async getAllProduct() {
        let productList = await this.getAll([Type, Size, Flavor, Crust, Drink]);

        for await (const product of productList) {
            product.dataValues.image = await this.getImageProduct(product);
        }

        return productList;
    }

    async getImageProduct(product) {
        const imageName = product.getDataValue('image');
        const url = await S3Service.getImage(imageName);

        return url;
    }

    async createProduct({ type, crust, flavor, size, drink, ...payload }, image) {
        const product = this.form(payload);
        const typeId = type ? await TypeService.find(type) : 12;

        const isExist = await this.find(product);
        if (isExist) {
            throwError(409, 'Product has already existed');
        } else {
            if (!image) throwError(409, 'Missing image');
            const imageName = await S3Service.saveImage(image);

            const newProduct = await this.model.create({
                ...product,
                typeId,
                image: imageName,
            });
            const productId = newProduct.dataValues.id;

            await CrustService.addSection(crust, { productId });
            await FlavorService.addSection(flavor, { productId });
            await SizeService.addSection(size, { productId });
            await DrinkService.addSection(drink, { productId });
        }
    }

    async updateProduct(productId, { type, crust, flavor, size, drink, ...payload }, image) {
        const product = this.form(payload, false);
        const productExist = await this.find(productId);
        let imageName;

        if (productExist) {
            const productId = productExist.dataValues.id;
            product.description = !payload.description && productExist.getDataValue('description');

            const typeId = type ? await TypeService.find(type) : null;

            if (image) {
                imageName = await S3Service.saveImage(image);
            }

            await this.update(
                { id: productId },
                Object.assign({ ...product }, typeId && { typeId }, imageName && { image: imageName }),
            );

            await CrustService.updateSection(crust, { productId });
            await FlavorService.updateSection(flavor, { productId });
            await SizeService.updateSection(size, { productId });
            await DrinkService.updateSection(drink, { productId });
        } else throwError(404, 'Product is not exist');
    }

    async deleteProduct(productId) {
        const productExist = await this.find(productId);

        if (productExist) {
            await this.delete(productId);
            await S3Service.deleteImage(productExist.getDataValue('image'));
            await this.deleteRelation({ productId: productId.id });
            await this.deleteRelation({ productId: productId.id });
            await this.deleteRelation({ productId: productId.id });
            await this.deleteRelation({ productId: productId.id });
            return;
        } else throwError(404, 'Product doesnt exist');
    }

    async deleteSection(productId, payload) {
        const sectionName = payload.sectionName || throwError(400, 'Missing section name');
        const sectionType = payload.sectionType || throwError(400, 'Missing section type');

        await sectionServiceName(sectionType).deleteSectionByName(sectionName, productId);
    }

    async addFavor(user, productId) {
        const productExist = await this.find({ id: productId });

        if (productExist) {
            await FavoriteService.create({ userId: user.getDataValue('id'), productId });
        } else throwError(404, 'Product not exist');
    }

    async removeFavor(user, productId) {
        const productExist = await this.find({ id: productId });

        if (productExist) {
            await FavoriteService.delete({ userId: user.getDataValue('id'), productId });
        } else throwError(404, 'Product not exist');
    }
}

module.exports = new ProductService();
