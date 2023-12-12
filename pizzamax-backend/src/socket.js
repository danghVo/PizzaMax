const { Server } = require('socket.io');
const VNPayService = require('./service/VNPayService');
const { default: axios } = require('axios');
const io = new Server();

io.on('connection', (socket) => {
    socket.emit('success', true);

    socket.on('checkout', async ({ cart, user, ...checkOutPayload }) => {
        const payUrl = await VNPayService.checkOut(cart, user, checkOutPayload);

        socket.emit('payUrl', payUrl);
    });
});

// socket.on()

module.exports = io;
