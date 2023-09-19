const throwError = require('../utils/throwError');
const { AuthService } = require('../service');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
require('dotenv').config();

class AuthController {
    constructor() {
        this.controllerName = 'AuthController';
    }

    async login(req, res, next) {
        try {
            const userValid = await AuthService.validUser(req.body);

            if (userValid) {
                res.locals.user = userValid;
                next();
            } else {
                throwError(401, 'wrong password');
            }
        } catch (error) {
            console.log(error);
            return res.send(error?.message || error);
        }
    }

    async createToken(req, res) {
        try {
            const user = { phoneNumber: req.body.phoneNumber, password: req.body.password };
            const accessToken = generateToken(
                user,
                user.phoneNumber == '0000000000' ? process.env.ADMIN_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
            );

            const refreshToken = generateToken(user, process.env.REFRESH_TOKEN_SECRET, '');

            await AuthService.setToken(user, { token: refreshToken });

            return res.json({
                accessToken,
                refreshToken,
                isAdmin: user.phoneNumber == '0000000000' && true,
                ...res.locals.user,
                password: undefined,
            });
        } catch (error) {
            console.log(error);
            return res.send(error?.message || error);
        }
    }

    async refreshToken(req, res) {
        try {
            const user = { phoneNumber: req.body.phoneNumber, password: req.body.password };
            const refreshToken = req.body.token;
            const userRefreshToken = await AuthService.getToken(user);

            if (!refreshToken) {
                throwError(401, 'Missing token');
            }

            if (userRefreshToken != refreshToken) {
                throwError(403, 'Dont have right to access');
            }

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error) => {
                if (error) throwError(403, 'Dont have right to access');
                const accessToken = generateToken(
                    user,
                    user.phoneNumber == '0000000000' ? process.env.ADMIN_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
                );

                return res.json({ accessToken });
            });
        } catch (error) {
            res.send(error.message || error);
        }
    }

    async deleteToken(req, res) {
        try {
            const user = { phoneNumber: req.body.phoneNumber, password: req.body.password };

            await AuthService.deleteToken(user);

            return res.send('Log out');
        } catch (error) {
            res.send(error.message || error);
        }
    }
}

module.exports = new AuthController();
