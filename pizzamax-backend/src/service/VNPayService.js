const Service = require('./Service');
const throwError = require('../utils/throwError');
const { default: axios } = require('axios');
const dateFormat = require('../utils/dateFormat');
const sortObject = require('../utils/sortObject');
const querystring = require('qs');
require('dotenv').config();

class VNPayService extends Service {
    constructor() {
        super('VNPayService');
    }

    async checkOut(cart, user, checkOutPayload) {
        this.checkOutPayload = checkOutPayload;
        this.cart = cart;
        this.user = user;
        const total =
            checkOutPayload.orderWayId === 1 ? cart.price.subTotal : cart.price.subTotal + cart.price.deliveryCharge;
        var ipAddr = '127.0.0.1:4000';

        var tmnCode = process.env.VNP_TMN_CODE;
        var secretKey = process.env.VNP_SECRET_KEY;
        var vnpUrl = process.env.VNP_PAY_URL;
        var returnUrl = process.env.VNP_RETURN_URL;

        var date = new Date();

        var createDate = dateFormat(date, 'yyyymmddHHmmss');
        var orderId = dateFormat(date, 'HHmmss');
        var amount = total;
        var bankCode = 'NCB';

        var orderInfo = 'Nội dung thanh toán';
        var locale = 'vn';

        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require('crypto');
        var hmac = crypto.createHmac('sha512', secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        return vnpUrl;
    }

    async checkResult(CartService) {
        var vnp_Params = query;
        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        var secretKey = process.env.VNP_SECRET_KEY;
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require('crypto');
        var hmac = crypto.createHmac('sha512', secretKey);
        var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

        if (secureHash === signed) {
            var orderId = vnp_Params['vnp_TxnRef'];
            var rspCode = vnp_Params['vnp_ResponseCode'];
            //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi

            // Cart
            if (rspCode === '00') {
                const cart = await CartService.checkout(this.cart, this.checkOutPayload);
                return { status: true, cart };
            } else return { status: false };
        } else {
            return { status: false };
        }
    }
}

module.exports = new VNPayService();
