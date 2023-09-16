const { Product, Type, Crust, Size, Flavor, Drink } = require('../models');
const Service = require('./Service');
const throwError = require('../utils/throwError');
const TypeService = require('./TypeService');
const FlavorService = require('./FlavorService');
const SizeService = require('./SizeService');
const DrinkService = require('./DrinkService');
const CrustService = require('./CrustService');
const SectionService = require('./SectionService');

class ProductService extends Service {
    constructor() {
        super('ProductService', Product);
    }

    form(payload, mustFull = true) {
        const product = {
            name: payload?.name,
            price: payload?.price,
            image: payload?.image,
        };

        Object.keys(product).forEach((key) => {
            product[key] || (mustFull ? throwError(400, `Missing field: ${key}`) : delete product[key]);
        });

        return { ...product, description: payload?.description || '', signature: payload?.signature || false };
    }

    async getAllProduct() {
        let productList = await this.getAll([Type, Size, Flavor, Crust, Drink]);

        return productList;
    }

    async createProduct({ type, crust, flavor, size, drink, ...payload }) {
        const product = this.form(payload);
        const typeId = type ? await TypeService.find(type) : 12;

        const isExist = await this.find(product);
        if (isExist) {
            throwError(409, 'Product has already existed');
        } else {
            const newProduct = await this.model.create({
                ...product,
                typeId,
            });
            const productId = newProduct.dataValues.id;

            await CrustService.addSection(crust, { productId });
            await FlavorService.addSection(flavor, { productId });
            await SizeService.addSection(size, { productId });
            await DrinkService.addSection(drink, { productId });
        }
    }

    async updateProduct(productId, { type, crust, flavor, size, drink, ...payload }) {
        const product = this.form(payload, false);
        const productExist = await this.find(productId);

        if (productExist) {
            const productId = productExist.dataValues.id;

            const typeId = type ? await TypeService.find(type) : null;

            await this.update({ id: productId }, Object.assign({ ...product }, typeId && { typeId }));

            await CrustService.updateSection(crust, { productId });
            await FlavorService.updateSection(flavor, { productId });
            await SizeService.updateSection(size, { productId });
            await Drink.updateSection(drink, { productId });
        } else throwError(404, 'Product is not exist');
    }

    async deleteProduct(productId) {
        const productExist = await this.find(productId);

        if (productExist) {
            await this.delete(productId);
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

        switch (sectionType) {
            case 'flavor': {
                await FlavorService.deleteSectionByName(sectionName, productId);
                return;
            }
            case 'size': {
                await SizeService.deleteSectionByName(sectionName, productId);
                return;
            }
            case 'crust': {
                await CrustService.deleteSectionByName(sectionName, productId);
                return;
            }
            case 'drink': {
                await DrinkService.deleteSectionByName(sectionName, productId);
                return;
            }
            default: {
                throwError(404, 'Not found section type');
                return;
            }
        }
    }
}

module.exports = new ProductService();
