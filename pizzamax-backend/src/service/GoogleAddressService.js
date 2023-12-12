const { default: axios } = require('axios');
const throwError = require('../utils/throwError');

require('dotenv').config();

class GoogleAddressService {
    constructor() {
        this.serviceName = 'GoogleAddressService';
        this.apiKey = process.env.GOOGLE_API_KEY;
    }

    async validAddress(address) {}

    async convertLatLngToAddress(lat, lng) {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                latlng: `${lat},${lng}`,
                language: 'vi',
                key: this.apiKey,
            },
        });

        const results = response.data.results;
        if (results.length > 0) {
            const address = results[0].address_components;
            return address;
        } else throwError(404, 'Có lỗi xảy ra. Hãy nhập thủ công');
    }

    async distanceMaxtrix(userAddress, storeAddress) {
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                destinations: userAddress,
                origins: storeAddress,
                key: this.apiKey,
            },
        });

        const results = response.data;

        return results.rows;
    }
}

module.exports = new GoogleAddressService();
