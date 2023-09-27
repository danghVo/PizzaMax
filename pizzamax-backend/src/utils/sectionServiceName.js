module.exports = function sectionServiceName(sectionType) {
    switch (sectionType) {
        case 'flavor': {
            return require('../service/FlavorService');
        }
        case 'size': {
            return require('../service/SizeService');
        }
        case 'crust': {
            return require('../service/CrustService');
        }
        case 'drink': {
            return require('../service/DrinkService');
        }
        default: {
            throwError(404, 'Not found section type');
            return;
        }
    }
};
