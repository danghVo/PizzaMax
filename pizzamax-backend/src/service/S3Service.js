require('dotenv').config();
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const randomBytes = require('../utils/randomCrypto');

class S3Service {
    constructor() {
        this.serviceName = 'S3Service';
        this.s3Client = new S3Client({
            region: process.env.BUCKET_REGION,
            credentials: {
                accessKeyId: process.env.BUCKET_ACCESS_KEY,
                secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
            },
        });
    }

    async saveImage(image, imageNameExist = null) {
        const imageName = imageNameExist || randomBytes();

        const inputObject = {
            Bucket: process.env.BUCKET_NAME,
            Key: imageName, //image name to save in s3
            Body: image.buffer, //image
            ContentType: image.mimetype,
        };

        const command = new PutObjectCommand(inputObject);

        await this.s3Client.send(command);

        return imageName;
    }

    async getImage(imageName) {
        const inputObject = {
            Bucket: process.env.BUCKET_NAME,
            Key: imageName,
        };

        const command = new GetObjectCommand(inputObject);
        const url = await getSignedUrl(this.s3Client, command);

        return url;
    }

    async deleteImage(imageName) {
        const inputObject = {
            Bucket: process.env.BUCKET_NAME,
            Key: imageName,
        };

        const command = new DeleteObjectCommand(inputObject);
        await this.s3Client.send(command);
    }
}

module.exports = new S3Service();
