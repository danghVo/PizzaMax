const throwError = require('../utils/throwError');
const Controller = require('./Controller');
const { ProductService, S3Service } = require('../service');

class ProductController extends Controller {
    constructor() {
        super('ProductController');
    }

    async getAll(req, res) {
        try {
            const productList = await ProductService.getAllProduct();

            if (productList) {
                return res.json(productList);
            } else throwError(404, 'Nothing to show');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async get(req, res) {
        try {
            const productId = { id: req.params.id };

            if (!productId.id) throwError(400, 'Product must be provided');

            const product = await ProductService.getProduct(productId);

            return res.json(product);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async create(req, res) {
        try {
            const image = req.file;

            await ProductService.createProduct(req.body, image);

            return res.send('Product was created successfuly');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async update(req, res) {
        try {
            const productId = { id: req.params.id };
            const image = req.file;

            await ProductService.updateProduct(productId, req.body, image);

            return res.send('Product was updated successfully');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async delete(req, res) {
        try {
            const productId = { id: req.params.id } || throwError(400, 'Missing product id');

            await ProductService.deleteProduct(productId);

            return res.send('Product was deleted successfully');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async deleteSectionByName(req, res) {
        try {
            const productId = req.params.id || throwError(400, 'Missing product id');

            await ProductService.deleteSection(productId, req.body);

            return res.send('Product Section was deleted successfully');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async addFavor(req, res) {
        try {
            const user = res.locals.user;
            const productId = req.params.productId;

            await ProductService.addFavor(user, productId);

            return res.send('Add favorite product successfully');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async removeFavor(req, res) {
        try {
            const user = res.locals.user;
            const productId = req.params.productId;

            await ProductService.removeFavor(user, productId);

            return res.send('Revmove favorite product successfully');
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }
}

module.exports = new ProductController();
