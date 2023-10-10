const Service = require('./Service');
const { Cart, Detail, Product, Selection, Type, Status, Orderway, Address, Discount } = require('../models');

const throwError = require('../utils/throwError');
const DetailService = require('./DetailService');
const ProductService = require('./ProductService');
const SectionService = require('./SectionService');
const AddressService = require('./AddressService');
const product = require('../models/product');
const percentageOf = require('../utils/percentageOf');
const checkDiscountAvail = require('../utils/checkDiscountAvail');

class CartService extends Service {
    constructor() {
        super('CartService', Cart);
    }

    async updateCartPrice(cart, totalProductPrice, saleOff = 0) {
        const currentSubTotal = parseInt(cart.subTotal);
        const deliveryCharge = parseInt(cart.deliveryCharge);
        const newSubTotal = currentSubTotal + totalProductPrice - percentageOf(totalProductPrice, saleOff);
        const total = newSubTotal === 0 ? 0 : newSubTotal + deliveryCharge;

        await this.update({ uuid: cart.uuid }, { subTotal: newSubTotal, total });
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
                    include: [Type, Discount],
                    through: {
                        model: Detail,
                    },
                },
            ],
        });
        let currentCart;

        if (carts.length > 0) {
            for (const i in carts) {
                carts[i] = await this.getCartDetail(carts[i]);
            }
            const lastCartStatus = carts[carts.length - 1].statusId;
            if (carts && (lastCartStatus == 2 || lastCartStatus == 1)) {
                currentCart = carts[carts.length - 1];
            }
        } else currentCart = this.model.create({ userId });

        return { carts, currentCart };
    }

    async getCart(cartUUID) {
        const cartExist = await this.find(
            { uuid: cartUUID },
            {
                model: Product,
                include: [Type, Discount],
                through: {
                    model: Detail,
                },
            },
        );

        if (cartExist) {
            return await this.getCartDetail(cartExist);
        } else throwError(404, 'Cart not exist');
    }

    async getCartDetail(cart) {
        const products = cart.Products;

        for (const productIndex in products) {
            const detail = await products[productIndex].Detail;
            const selections = await detail.getSelections();
            cart.dataValues.Products[productIndex].dataValues.Selection = await selections;

            cart.dataValues.Products[productIndex].dataValues.image = await ProductService.getImageProduct(
                products[productIndex],
            );
        }

        return cart;
    }

    async addToCart(cart, payload) {
        const { name, quantity, selection } = payload;

        const product = await ProductService.find({ name });
        if (!product) {
            throwError(404, 'Product not found');
        }

        const checkDetail = await DetailService.checkDetailExist(product, cart, selection);
        const discount = await product.getDiscount();
        const saleOff = checkDiscountAvail(discount) ? discount.saleOff : null;

        if (checkDetail) {
            return throwError(409, 'Product is already in cart');
        }
        let totalProductPrice = parseInt(product.price);

        const detail = await Detail.create({
            quantity: quantity,
            cartUUID: cart.uuid,
            productId: product.id,
            saleOff: saleOff,
            price: '',
        });

        if (selection.length > 0)
            for await (const item of selection) {
                const type = await SectionService.getSection(item.type, item.name, product);
                if (type) {
                    totalProductPrice += parseInt(type.price);
                    await Selection.create({
                        detailUUID: detail.uuid,
                        price: type.price,
                        name: type.name,
                        section: item.section,
                        type: item.type,
                    });
                } else throwError(404, 'Not have this section');
            }

        await DetailService.update({ uuid: detail.uuid }, { price: totalProductPrice * parseInt(quantity) });

        await this.updateCartPrice(cart, totalProductPrice * quantity, saleOff);
        return await this.getCart(cart.uuid);
    }

    async removeFromCart(cart, detailUUID) {
        const detailExist = await DetailService.find({ uuid: detailUUID });

        if (detailExist) {
            await this.updateCartPrice(cart, -parseInt(detailExist.price), detailExist.saleOff);
            await DetailService.delete({ uuid: detailUUID }, Selection);

            return await this.getCart(cart.uuid);
        } else {
            throwError(404, 'Detail not found');
        }
    }

    async updateProduct(cart, detailUUID, payload) {
        const detailExist = await DetailService.find({ uuid: detailUUID });

        if (detailExist) {
            let pricePerOne = parseInt(detailExist.price) / parseInt(detailExist.quantity);
            await this.updateCartPrice(
                cart,
                pricePerOne * (payload.quantity - parseInt(detailExist.quantity)),
                detailExist.saleOff,
            );

            await DetailService.update(
                { uuid: detailUUID },
                { quantity: payload.quantity, price: pricePerOne * payload.quantity },
            );

            return await this.getCart(cart.uuid);
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
                { uuid: cart.uuid },
                {
                    orderwayId: orderwayExist.id,
                    checkOutAt,
                    statusId: 2,
                    addressId: addressExist.id,
                },
            );

            return orderwayExist.id == 1 ? 'Please come to get your order' : 'Waiting to get your order shipped';
        } else throwError(400, 'Wrong information');
    }
}

module.exports = new CartService();
