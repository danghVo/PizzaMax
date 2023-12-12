const Service = require('./Service');
const {
    Cart,
    Detail,
    Product,
    Selection,
    Type,
    Status,
    Orderway,
    Address,
    City,
    Discount,
    PaymentWay,
} = require('../models');

const DetailService = require('./DetailService');
const SectionService = require('./SectionService');
const ProductService = require('./ProductService');
const PaymentWayService = require('./PaymentWayService');
const AddressService = require('./AddressService');
const SelectionService = require('./SelectionService');
const UserService = require('./UserService');

const throwError = require('../utils/throwError');
const percentageOf = require('../utils/percentageOf');
const checkDiscountAvail = require('../utils/checkDiscountAvail');

const io = require('../socket');

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
                {
                    model: Address,
                    include: [City],
                },
                PaymentWay,
            ],
            order: [['createdAt', 'ASC']],
        });
        let currentCart;

        if (carts.length > 0) {
            for (const i in carts) {
                carts[i] = await this.getCartDetail(carts[i]);
            }
            const lastCartStatus = carts[carts.length - 1].statusId;
            if (carts && lastCartStatus == 1) {
                currentCart = carts.pop();

                return { carts, currentCart };
            } else return await this.createNewCart(userId);
        } else return await this.createNewCart(userId);
    }

    async createNewCart(userId) {
        let carts = await this.model.findAll({
            where: { userId },
            include: [
                Orderway,
                Status,
                {
                    model: Address,
                    include: [City],
                },
                PaymentWay,
            ],
            order: [['createdAt', 'ASC']],
        });

        for (const i in carts) {
            carts[i] = await this.getCartDetail(carts[i]);
        }

        let currentCart = await this.create({ userId });

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
        const products = await cart.getProducts({ include: [Type, Discount] });
        cart.dataValues.Products = products;

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

    async setCartToCartOfUser(user, cartData) {
        const { currentCart } = await this.getCartOfUser(user.id);

        for await (const product of cartData.products) {
            const { name, quantity, selection } = product.detail;
            const checkDetailExist = await DetailService.checkDetailExist(product, currentCart, selection);

            if (checkDetailExist) {
                await this.updateProduct(currentCart, checkDetailExist.uuid, {
                    quantity: quantity + checkDetailExist.quantity,
                });
            } else await this.addToCart(currentCart, { name, quantity, selection });
        }
    }

    async addToCart(cart, payload) {
        const { name, quantity, selection } = payload;

        const product = await ProductService.find({ name });
        if (!product) {
            throwError(404, 'Product not found');
        }

        const discount = await product.getDiscount();
        const saleOff = checkDiscountAvail(discount) ? discount.saleOff : null;

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
                } else {
                    await DetailService.delete({ uuid: detail.uuid });
                    await SelectionService.delete({ detailUUID: detail.uuid });
                    throwError(404, 'Not have this section');
                }
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

    async updateDeliveryCharge(cart, payload) {
        const distance = await AddressService.getDistance(payload.addressId);
        if (distance) {
            if (distance > 1) {
                const deliveryCharge = distance * 5000;
                await this.update(
                    { uuid: cart.uuid },
                    { deliveryCharge, total: parseInt(cart.subTotal) + deliveryCharge },
                );
            } else {
                await this.update(
                    { uuid: cart.uuid },
                    { deliveryCharge: 0, total: parseInt(cart.total) - parseInt(cart.deliveryCharge) },
                );
            }
        } else
            await this.update({ uuid: cart.uuid }, { deliveryCharge: 15000, total: parseInt(cart.subTotal) + 15000 });

        return await this.getCart(cart.uuid);
    }

    async checkout(cart, user, payload) {
        if (cart.statusId === 1) {
            const orderwayExist = await Orderway.findOne({ where: { id: payload.orderWayId } });
            const addressExist = await AddressService.find({ id: payload.addressId });
            const paymentWayExist = await PaymentWayService.find({ id: payload.paymentWayId });
            const checkOutAt = Date.now();

            if (orderwayExist && addressExist && paymentWayExist) {
                await this.update(
                    { uuid: cart.uuid },
                    {
                        orderwayId: orderwayExist.id,
                        checkOutAt: paymentWayExist.id === 2 ? checkOutAt : null,
                        statusId: 2,
                        addressId: addressExist.id,
                        paymentwayId: paymentWayExist.id,
                    },
                );
                io.emit('orderInform', `Có đơn hàng mới từ  ${user.name}`);
                return await this.getCart(cart.uuid);
            } else throwError(400, 'Thiếu thông tin');
        } else throwError(400, 'Wrong information');
    }

    async getAllCart() {
        const allCart = await this.getAll([
            Orderway,
            Status,
            {
                model: Address,
                include: [City],
            },
            PaymentWay,
        ]);

        const allCartDetail = [];
        for await (const cart of allCart) {
            const cartDetail = await this.getCartDetail(cart);

            allCartDetail.push(cartDetail);
        }

        return allCartDetail;
    }

    async updateCartStatus(cart, { statusId }) {
        if (cart.paymentwayId === 1 && statusId === 3) {
            let checkOutAt = Date.now();
            await this.update({ uuid: cart.uuid }, { statusId, checkOutAt });
        } else await this.update({ uuid: cart.uuid }, { statusId });
    }
}

module.exports = new CartService();
