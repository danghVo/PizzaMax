const {
    Product,
    Type,
    Crust,
    Size,
    Flavor,
    Drink,
    ProductCrust,
    ProductFlavor,
    ProductSize,
    ProductDrink,
} = require('../models');
const Service = require('./Service');
const throwError = require('../utils/throwError');
const SectionService = require('./SectionService');

class ProductService extends Service {
    constructor() {
        super('ProductService');
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

    async findTypeId(typeName) {
        const type = await this.find(Type, { name: typeName });
        return type.dataValues?.id || throwError(404, 'Type is not exist');
    }

    async getAllProduct() {
        let productList = await this.getAll(Product, [
            {
                model: Type,
            },
            {
                model: Size,
            },
            {
                model: Crust,
            },
            {
                model: Flavor,
            },
            {
                model: Drink,
            },
        ]);

        return productList;
    }

    async createProduct({ type, crust, flavor, size, drink, ...payload }) {
        const product = this.form(payload);
        const typeId = type ? await this.findTypeId(type) : 12;

        const isExist = await this.find(Product, product);
        if (isExist) {
            throwError(409, 'Product has already existed');
        } else {
            const newProduct = await Product.create({
                ...product,
                typeId,
            });
            const productId = newProduct.dataValues.id;

            await SectionService.addSection(Crust, ProductCrust, crust, { productId });
            await SectionService.addSection(Flavor, ProductFlavor, flavor, { productId });
            await SectionService.addSection(Size, ProductSize, size, { productId });
            await SectionService.addSection(Drink, ProductDrink, drink, { productId });
        }
    }

    async updateProduct(productId, { type, crust, flavor, size, drink, ...payload }) {
        const product = this.form(payload, false);
        const productExist = await this.find(Product, productId);

        if (productExist) {
            const productId = productExist.dataValues.id;

            const typeId = type ? await this.findTypeId(type) : null;

            await this.update(Product, { id: productId }, Object.assign({ ...product }, typeId && { typeId }));

            await SectionService.updateSection(Crust, ProductCrust, crust, { productId });
            await SectionService.updateSection(Flavor, ProductFlavor, flavor, { productId });
            await SectionService.updateSection(Size, ProductSize, size, { productId });
            await SectionService.updateSection(Drink, ProductDrink, drink, { productId });
        } else throwError(404, 'Product is not exist');
    }

    async deleteProduct(productId) {
        const productExist = await this.find(Product, productId);

        if (productExist) {
            await this.delete(Product, productId);
            await this.delete(ProductSize, { productId: productId.id });
            await this.delete(ProductFlavor, { productId: productId.id });
            await this.delete(ProductCrust, { productId: productId.id });
            await this.delete(ProductDrink, { productId: productId.id });
            return;
        } else throwError(404, 'Product doesnt exist');
    }

    async deleteSection(productId, payload) {
        const sectionName = payload.sectionName || throwError(400, 'Missing section name');
        const sectionType = payload.sectionType || throwError(400, 'Missing section type');
        const model =
            (sectionType == 'crust' && ProductCrust) ||
            (sectionType == 'flavor' && ProductFlavor) ||
            (sectionType == 'size' && ProductSize) ||
            throwError(400, 'Unknow section type');

        await SectionService.deleteSectionByName(sectionName, productId, model);
    }
}

module.exports = new ProductService();
