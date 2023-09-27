const throwError = require('../utils/throwError');
const { AuthService, UserService } = require('../service');
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
            return res.status(error.status || 500).send(error.message || error);
        }
    }

    async createToken(req, res) {
        try {
            const user = res.locals.user;
            const accessToken = generateToken(
                { phoneNumber: user.phoneNumber, password: user.password },
                user.role == 'admin' ? process.env.ADMIN_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
            );

            const refreshToken = generateToken(
                { phoneNumber: user.phoneNumber, password: user.password },
                process.env.REFRESH_TOKEN_SECRET,
                '',
            );

            await AuthService.setToken(
                { phoneNumber: user.phoneNumber, password: user.password },
                { token: refreshToken },
            );

            res.cookie(
                'token',
                { accessToken, refreshToken },
                {
                    httpOnly: true,
                    // Secure: true,
                },
            );

            return res.json({
                isAdmin: user.role == 'admin' && true,
                ...res.locals.user,
                password: undefined,
            });
        } catch (error) {
            return res.status(error.status || 500).send(error.message || error);
        }
    }

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.cookies['token'];

            if (!refreshToken) {
                throwError(401, 'Missing token');
            }

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
                if (error) throwError(403, 'Dont have right to access');
                const accessToken = generateToken(
                    { phoneNumber: decoded.phoneNumber, password: decoded.password },
                    decoded.phoneNumber == '0000000000'
                        ? process.env.ADMIN_TOKEN_SECRET
                        : process.env.ACCESS_TOKEN_SECRET,
                );

                res.cookie(
                    'token',
                    { accessToken, refreshToken },
                    {
                        httpOnly: true,
                        // Secure: true,
                    },
                );
            });

            // return res.send();
        } catch (error) {
            res.status(error.status || 500).send(error.message || error);
        }
    }

    async deleteToken(req, res) {
        try {
            const user = { phoneNumber: req.body.phoneNumber, password: req.body.password };

            await AuthService.deleteToken(user);

            return res.send('Log out');
        } catch (error) {
            res.status(error.status || 500).send(error.message || error);
        }
    }
}

module.exports = new AuthController();
