const { Product, Type, Crust, Size, Flavor, Drink, Discount, Time } = require('../models');

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
const DetailService = require('./DetailService');

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

    async checkRelationExist(data, field, relationService) {
        const dataExist = await relationService.find({ [field]: data });
        if (dataExist) return dataExist.id;
        else throwError(404, 'Not found ' + data);
    }

    async getAllProduct() {
        let products = await this.getAll([{ model: Type, include: [Time] }, Size, Flavor, Crust, Drink, Discount]);

        for await (const product of products) {
            product.image = await this.getImageProduct(product);
        }

        return products;
    }

    async getImageProduct(product) {
        const imageName = product.image;
        const url = await S3Service.getImage(imageName);

        return url;
    }

    async checkProductsOfTypeIsUse(typeId) {
        const productsOfType = await this.getAllBy({ typeId: typeId.id });

        for await (const product of productsOfType) {
            const isUse = await DetailService.checkProductIsUsed(product.id);
            if (isUse) {
                return throwError(409, 'Đang được sử dụng');
            }
        }
    }

    async createProduct({ type, discount, crust, flavor, size, drink, ...payload }, image) {
        const product = this.form(payload);
        let typeId = 12;
        let discountId = null;
        if (type) {
            typeId = await this.checkRelationExist(type, 'name', TypeService);
        }

        if (discount) {
            discountId = await this.checkRelationExist(discount, 'saleoff', DiscountService);
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

    async updateProduct(productId, { type, discount, crust, flavor, size, drink, description, ...payload }, image) {
        const productExist = await this.find(productId);

        if (productExist) {
            const productId = productExist.dataValues.id;
            if (description) {
                productExist.description = description;
            }

            if (type) {
                productExist.typeId = await this.checkRelationExist(type, 'name', TypeService);
            }

            if (discount) {
                productExist.discountId = await this.checkRelationExist(discount, 'saleoff', DiscountService);
            }

            if (image) {
                // productExist.image = await S3Service.saveImage(image);
            }

            Object.keys(payload).forEach((key) => {
                if (typeof productExist[key] !== 'undefined') {
                    productExist[key] = payload[key];
                } else throwError(404, 'Not found ' + key);
            });
            await productExist.save();

            await CrustService.updateSection(crust, { productId });
            await FlavorService.updateSection(flavor, { productId });
            await SizeService.updateSection(size, { productId });
            await DrinkService.updateSection(drink, { productId });
        } else throwError(404, 'Sản phẩm không tồn tại');
    }

    async deleteProduct(productId) {
        const productExist = await this.find(productId);

        const isProductUsed = await DetailService.checkProductIsUsed(productExist.id);

        if (isProductUsed) {
            return throwError(409, 'Đang được sử dụng');
        }

        if (productExist) {
            await S3Service.deleteImage(productExist.image);
            await CrustService.deleteRelation({ productId: productExist.id });
            await FlavorService.deleteRelation({ productId: productExist.id });
            await SizeService.deleteRelation({ productId: productExist.id });
            await DrinkService.deleteRelation({ productId: productExist.id });
            await this.delete(productId);
            return;
        } else throwError(404, 'Sản phẩm không tồn tại');
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
        } else throwError(404, 'Sản phẩm không tồn tại');
    }

    async removeFavor(user, productId) {
        const productExist = await this.find({ id: productId });
        if (productExist) {
            await FavoriteService.delete({ userId: user.getDataValue('id'), productId });
        } else throwError(404, 'Sản phẩm không tồn tại');
    }

    async toggleHideProduct(productId) {
        const productExist = await this.find({ id: productId });

        if (productExist) {
            await this.update({ id: productId }, { hide: !productExist.hide });
        } else throwError(404, 'Sản phẩm không tồn tại');
    }
}

module.exports = new ProductService();
