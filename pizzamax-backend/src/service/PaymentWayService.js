const { PaymentWay } = require('../models');
const Service = require('./Service');

class PaymentWayService extends Service {
    constructor() {
        super('PaymentWayService', PaymentWay);
    }
}

module.exports = new PaymentWayService();
