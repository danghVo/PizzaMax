const throwError = require('../utils/throwError');
const Controller = require('./Controller');
const { ProductService } = require('../service');

class ProductController extends Controller {
    constructor() {
        super('ProductController');
    }

    async getAll(req, res) {
        try {
            const productList = await ProductService.getAllProduct();

            if (productList) return res.json(productList);
            else throwError(404, 'Nothing to show');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async get(req, res) {
        try {
            const productId = { id: req.params.id };

            if (!productId.id) throwError(400, 'Product must be provided');

            const product = await ProductService.getProduct(productId);

            return res.json(product);
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async create(req, res) {
        try {
            await ProductService.createProduct(req.body);

            return res.send('Product was created successfuly');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async update(req, res) {
        try {
            const productId = { id: req.params.id };

            await ProductService.updateProduct(productId, req.body);

            return res.send('Product was updated successfully');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async delete(req, res) {
        try {
            const productId = { id: req.params.id } || throwError(400, 'Missing product id');

            await ProductService.deleteProduct(productId);

            return res.send('Product was deleted successfully');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }

    async deleteSectionByName(req, res) {
        try {
            const productId = req.params.id || throwError(400, 'Missing product id');

            await ProductService.deleteSection(productId, req.body);

            return res.send('Product Section was deleted successfully');
        } catch (error) {
            return res.send(error?.message || error);
        }
    }
}

module.exports = new ProductController();
