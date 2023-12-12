const throwError = require('../utils/throwError');
const Controller = require('./Controller');
const { BannerService } = require('../service');

class BannerController extends Controller {
    constructor() {
        super('BannerController');
    }

    async getAll(req, res) {
        try {
            const banners = await BannerService.getAllBanner();

            return res.json(banners);
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async add(req, res, next) {
        try {
            const image = req.file;

            await BannerService.addBanner(image);

            const banners = await BannerService.getAllBanner();
            return res.json(banners);
            next();
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async update(req, res, next) {
        try {
            const bannerId = req.params.id;

            const image = req.file;

            await BannerService.updateBanner(bannerId, image);

            const banners = await BannerService.getAllBanner();

            if (banners) {
                res.json(banners);
                next();
            }
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async delete(req, res, next) {
        try {
            const bannerId = req.params.id;

            await BannerService.deleteBanner(bannerId);

            const banners = await BannerService.getAllBanner();

            if (banners) {
                res.json(banners);
                next();
            }
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }
}

module.exports = new BannerController();
