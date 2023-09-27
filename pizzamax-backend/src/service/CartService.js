const Service = require('./Service');
const { Cart, Detail, Product, Selection, Type, Status, Orderway, Address } = require('../models');

const throwError = require('../utils/throwError');
const DetailService = require('./DetailService');
const ProductService = require('./ProductService');
const SectionService = require('./SectionService');
const AddressService = require('./AddressService');

class CartService extends Service {
    constructor() {
        super('CartService', Cart);
    }

    async getCartOfUser(userId) {
        let carts = await this.model.findAll({
            where: { userId },
            include: [
                Orderway,
                Status,
                Address,
                {
                    model: Product,
                    include: [Type],
                    through: {
                        model: Detail,
                    },
                },
            ],
        });
        let currentCart;

        if (carts)
            for (const i in carts) {
                const products = carts[i].getDataValue('Products');
                for (const j in products) {
                    carts[i].Products[j].dataValues.Selection = await products[j]
                        .getDataValue('Detail')
                        .getSelections();

                    carts[i].Products[j].dataValues.image = await ProductService.getImageProduct(products[j]);
                }
            }

        const lastCartStatus = carts[carts.length - 1].getDataValue('statusId');
        if (carts && (lastCartStatus == 2 || lastCartStatus == 1)) {
            currentCart = carts[carts.length - 1];
        } else currentCart = this.model.create({ userId });

        return { carts, currentCart };
    }

    async getCart(cartUUID) {
        const cartExist = await this.find({ uuid: cartUUID });

        return cartExist || throwError(404, 'Cart not exist');
    }

    async addToCart(cart, payload) {
        const { name, quantity, selection } = payload;

        const product = await ProductService.find({ name });

        const checkDetail = await DetailService.checkDetailExist(product, cart, selection);

        if (checkDetail) {
            return throwError(409, 'Product is already in cart');
        }

        const detail = await Detail.create({
            quantity: quantity || 1,
            cartUUID: cart.getDataValue('uuid'),
            productId: product.getDataValue('id'),
        });

        for await (const item of selection) {
            const type = await SectionService.getSection(item.type, item.name, product);
            if (type) {
                await Selection.create({
                    detailUUID: detail.getDataValue('uuid'),
                    price: type.getDataValue('price'),
                    name: type.getDataValue('name'),
                    section: item.section,
                    type: item.type,
                });
            } else throwError(404, 'Not have this section');
        }
    }

    async removeFromCart(payload) {
        const detailUUID = payload.detailUUID;
        const detailExist = await DetailService.find({ uuid: detailUUID });

        if (detailExist) {
            await DetailService.delete({ uuid: detailUUID }, { include: [Selection] });
        } else {
            throwError(404, 'Detail not found');
        }
    }

    async updateProduct(payload) {
        const detailUUID = payload.detailUUID;
        const detailExist = await DetailService.find({ uuid: detailUUID });

        if (detailExist) {
            await DetailService.update({ uuid: detailUUID }, { quantity: payload.quantity });
        } else {
            throwError(404, 'Detail not found');
        }
    }

    async checkout(cart, payload) {
        const orderwayExist = await Orderway.findOne({ where: { name: payload.orderway } });
        const addressExist = await AddressService.find({ id: payload.addressId });
        const checkOutAt = Date.now();

        if (orderwayExist && addressExist) {
            await this.update(
                { uuid: cart.getDataValue('uuid') },
                {
                    orderwayId: orderwayExist.getDataValue('id'),
                    checkOutAt,
                    statusId: 2,
                    addressId: addressExist.getDataValue('id'),
                },
            );

            return orderwayExist.getDataValue('id') == 1
                ? 'Please come to get your order'
                : 'Waiting to get your order shipped';
        } else throwError(400, 'Wrong information');
    }
}

module.exports = new CartService();
