const { Product, Type, Crust, Size, Flavor, Drink, Discount } = require('../models');

const throwError = require('../utils/throwError');
const sectionServiceName = require('../utils/sectionServiceName');
const checkDiscountAvail = require('../utils/checkDiscountAvail');

const Service = require('./Service');
const TypeService = require('./TypeService');
const FlavorService = require('./FlavorService');
const SizeService = require('./SizeService');
const DrinkService = require('./DrinkService');
const CrustService = require('./CrustService');
const FavoriteService = require('./FavoriteService');
const S3Service = require('./S3Service');
const DiscountService = require('./DiscountService');

class ProductService extends Service {
    constructor() {
        super('ProductService', Product);
    }

    form(payload) {
        const product = {
            name: payload?.name,
            price: payload?.price,
        };

        Object.keys(product).forEach((key) => {
            product[key] || throwError(400, `Missing field: ${key}`);
        });

        return { ...product, description: payload?.description || '', signature: payload?.signature || false };
    }

    async checkRelationExist(data, relationService) {
        const dataExist = await relationService.find({ id: data });
        if (dataExist) return dataExist.id;
        else throwError(404, 'Not found ' + data);
    }

    async getAllProduct() {
        let products = await this.getAll([Type, Size, Flavor, Crust, Drink, Discount]);

        for await (const product of products) {
            product.image = await this.getImageProduct(product);
            const discount = await product.getDiscount();
            if (!checkDiscountAvail(discount)) {
                product.dataValues.Discount = undefined;
            }
        }

        return products;
    }

    async getImageProduct(product) {
        const imageName = product.getDataValue('image');
        const url = await S3Service.getImage(imageName);

        return url;
    }

    async createProduct({ type, discount, crust, flavor, size, drink, ...payload }, image) {
        const product = this.form(payload);
        let typeId = 12;
        let discountId = null;
        if (type) {
            typeId = await this.checkRelationExist(type, TypeService);
        }

        if (discount) {
            discountId = await this.checkRelationExist(discount, DiscountService);
        }

        const isExist = await this.find(product);
        if (isExist) {
            throwError(409, 'Product has already existed');
        } else {
            if (!image) throwError(409, 'Missing image');
            const imageName = await S3Service.saveImage(image);

            const newProduct = await this.model.create({
                ...product,
                typeId,
                discountId,
                image: imageName,
            });
            const productId = newProduct.dataValues.id;

            await CrustService.addSection(crust, { productId });
            await FlavorService.addSection(flavor, { productId });
            await SizeService.addSection(size, { productId });
            await DrinkService.addSection(drink, { productId });
        }
    }

    async updateProduct(productId, { type, discount, crust, flavor, size, drink, ...payload }, image) {
        const productExist = await this.find(productId);

        if (productExist) {
            const productId = productExist.dataValues.id;
            if (payload.description) {
                productExist.description = payload.description;
            }

            if (type) {
                productExist.typeId = await this.checkRelationExist(type, TypeService);
            }

            if (discount) {
                productExist.discountId = await this.checkRelationExist(discount, DiscountService);
            }

            if (image) {
                productExist.image = await S3Service.saveImage(image);
            }

            Object.keys(payload).forEach((key) => {
                if (productExist[key]) {
                    productExist[key] = payload[key];
                } else throwError(404, 'Not found ' + key);
            });
            await productExist.save();

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
