const { User, Cart, City, Type, Address } = require('../models');
const throwError = require('../utils/throwError');
const Service = require('./Service');
const CartService = require('./CartService');
const S3Service = require('./S3Service');

class UserService extends Service {
    constructor() {
        super('UserService', User);
    }

    form(payload) {
        const user = {
            name: payload.name,
            phoneNumber: payload.phoneNumber,
            password: payload.password,
            avatar: 'noImage',
        };

        Object.keys(user).forEach((key) => {
            user[key] || throwError(400, `Thiếu ${key}`);
        });

        return user;
    }

    async setToken(phoneNumber, token) {
        return await this.update(phoneNumber, token);
    }

    async getToken(phoneNumber) {
        const user = await this.find(phoneNumber);

        return user.token;
    }

    async getUserInfor(user) {
        const favorite = await user.getProducts({ include: [Type] });
        const address = await user.getAddressUsers({
            include: [
                {
                    model: Address,
                    include: [City],
                },
            ],
        });
        let carts = await CartService.getCartOfUser(user.id);

        let image = 'noImage';
        if (user.avatar !== 'noImage') {
            image = await S3Service.getImage(user.avatar);
        }

        return {
            ...user.toJSON(),
            address,
            carts,
            favorite,
            avatar: image,
        };
    }

    async deleteToken(phoneNumber) {
        return await this.update(phoneNumber, { token: null });
    }

    async userExist(uuid) {
        const userExist = await this.find({ uuid });

        if (userExist) {
            return userExist;
        } else throwError(404, 'User not found');
    }

    async addAvatar(user, image) {
        let imageNameExist = '';
        if (user.avatar !== 'noImage') {
            imageNameExist = user.avatar;
        }
        const imageName = await S3Service.saveImage(image, imageNameExist);

        await this.update({ id: user.id }, { avatar: imageName });
    }

    async create(payload) {
        const newUser = this.form(payload);
        const user = await this.find({ phoneNumber: payload.phoneNumber });

        if (user) {
            return throwError(409, 'Số điện thoại đã tồn tại');
        }

        await this.model.create({ ...newUser, Carts: {} }, Cart);
    }

    async createAdmin(payload) {
        const user = await this.find({ phoneNumber: payload.phoneNumber });

        if (user) {
            return throwError(409, 'Số điện thoại đã tồn tại');
        }

        await this.model.create({
            phoneNumber: payload.phoneNumber,
            password: 'admin',
            name: 'admin',
            image: 'noImage',
            role: 'admin',
        });
    }

    async updateUser(user, payload) {
        if (payload.newPassword) {
            await this.changePassword(user, payload);
            return;
        } else
            await this.update(
                {
                    id: user.id,
                },
                { name: payload.name },
            );
    }

    async changePassword(user, payload) {
        if (user.password === payload.oldPassword)
            await this.update(
                {
                    id: user.id,
                },
                { password: payload.newPassword },
            );
        else throwError(400, 'Sai mật khẩu cũ');
    }

    async getAllUser() {
        const allUsers = await this.getAll();
        const userList = [];

        for await (const user of allUsers) {
            const userInfor = await this.getUserInfor(user);
            userList.push(userInfor);
        }

        return userList;
    }
}

module.exports = new UserService();
