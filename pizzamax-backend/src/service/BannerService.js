const { Banner } = require('../models');

const Service = require('./Service');
const S3Service = require('./S3Service');
const throwError = require('../utils/throwError');

class BannerService extends Service {
    constructor() {
        super('BannerService', Banner);
    }

    async getAllBanner() {
        const banners = await this.getAll();

        for await (const banner of banners) {
            const imgName = banner.image;
            const url = await S3Service.getImage(imgName);
            banner.image = url || '';
        }

        return banners;
    }

    async addBanner(image) {
        const imgName = await S3Service.saveImage(image);

        await this.create({ image: imgName });
    }

    async updateBanner(bannerId, image) {
        const bannerExist = await this.find({ id: bannerId });

        if (bannerExist) {
            await S3Service.saveImage(image, bannerExist.image);
        } else throwError(404, 'Không tìm thấy banner');
    }

    async deleteBanner(bannerId) {
        const bannerExist = await this.find({ id: bannerId });

        if (bannerExist) {
            await this.delete({ id: bannerId });
            await S3Service.deleteImage(bannerExist.image);
        } else throwError(404, 'Không tìm thấy banner');
    }
}

module.exports = new BannerService();
