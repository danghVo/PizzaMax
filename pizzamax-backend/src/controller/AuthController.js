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
                throwError(401, 'Sai mật khẩu');
            }
        } catch (error) {
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async createToken(req, res) {
        try {
            const user = res.locals.user;
            const accessToken = generateToken(
                { phoneNumber: user.phoneNumber, password: user.password, role: user.role },
                user.role == 'admin' ? process.env.ADMIN_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
            );

            const refreshToken = generateToken(
                { phoneNumber: user.phoneNumber, password: user.password, role: user.role },
                process.env.REFRESH_TOKEN_SECRET,
                '1d',
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
            return res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.cookies['token'];

            if (!refreshToken) {
                throwError(401, 'Missing token');
            }

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
                if (error) throwError(403, 'Session expired');

                const accessToken = generateToken(
                    { phoneNumber: decoded.phoneNumber, password: decoded.password, role: decoded.role },
                    decoded.role == 'admin' ? process.env.ADMIN_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
                );

                res.cookie(
                    'token',
                    { accessToken, refreshToken },
                    {
                        httpOnly: true,
                    },
                );
            });

            return res.send();
        } catch (error) {
            res.status(error.code || 500).send({ error: error.message || error });
        }
    }

    async deleteToken(req, res) {
        try {
            const { refreshToken } = req.cookies['token'];

            await AuthService.deleteToken(refreshToken);

            res.cookie('token', undefined);
            return res.send('Log out');
        } catch (error) {
            res.status(error.code || 500).send({ error: error.message || error });
        }
    }
}

module.exports = new AuthController();
