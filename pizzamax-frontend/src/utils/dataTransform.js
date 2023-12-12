import checkDiscountAvail from './checkDiscountAvail';
import convertDate from './convertDate';

export const address = (data) => {
    return data.map((item) => {
        const address = item.address;

        return {
            id: address.id,
            address: addressToText(address),
        };
    });
};

const addressToText = (address) => {
    const alley = address.alley ? `Hẻm ${address.alley},` : '';
    return `${address.houseNumber}, ${alley} ${address.street} , ${address.district} , ${address.city}`;
};

export const currentAddress = (data) => {
    data = data.map((item) => {
        switch (item.types[0]) {
            case 'street_number': {
                item.type = 'houseNumber';
                break;
            }
            case 'route': {
                item.type = 'street';
                break;
            }
            case 'administrative_area_level_3': {
                item.type = 'ward';
                break;
            }
            case 'administrative_area_level_2': {
                item.type = 'district';
                item.long_name = 'Quận ' + item.long_name;
                break;
            }
            case 'administrative_area_level_1': {
                item.type = 'city';
                break;
            }
            default: {
            }
        }

        return item;
    });

    return data.reduce((accu, curr) => ({ ...accu, [curr.type]: curr.long_name }), {});
};

export const product = (data) => {
    const products = data.map((item) => ({
        ...item,
        discOptions: item.discOptions.map((disc) => ({
            ...disc,
            subOptions: disc.subOptions.sort((a, b) => a.price - b.price),
        })),
    }));

    return {
        products,
        rawData: data,
    };
};

export const favorite = (data) => {
    return data.map((item) => item.id);
};

export const cart = (data) => {
    return {
        ...data,
        products: data.products.sort((a, b) => Date.parse(a.detail.createdAt) - Date.parse(b.detail.createdAt)),
        orderWay: data.Orderway?.name,
        paymentWay: data.PaymentWay?.name,
        address: data.Address ? addressToText(data.Address) : null,
        checkOutAt: data.checkOutAt ? convertDate(data.checkOutAt) : null,
    };
};

export const filterCart = (data) => {
    const dataSort = data.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    return {
        rawData: dataSort,
        pending: dataSort.filter((item) => item.statusId === 2).map((cartItem) => cart(cartItem)),
        success: dataSort.filter((item) => item.statusId === 3).map((cartItem) => cart(cartItem)),
        fail: dataSort.filter((item) => item.statusId === 4).map((cartItem) => cart(cartItem)),
    };
};

export const user = (data) => {
    const carts = {
        carts: data.carts.carts.map((item) => cart(item)),
        currentCart: cart(data.carts.currentCart),
    };

    return {
        ...data,
        favorite: favorite(data.favorite),
        address: address(data.address),
        carts,
    };
};

export const type = (data) => {
    return data.map((item) => ({
        ...item,
        id: item.id,
        timeId: item.Time.id,
        timeName: item.Time.name,
    }));
};

export const detail = (data) => {
    return data.map((item) => ({
        ...item,
        Product: undefined,
        Cart: undefined,
        ...item.Product,
        statusId: item.Cart.statusId,
        total: item.price,
        checkOutAt: convertDate(item.Cart.checkOutAt),
        createdAt: convertDate(item.createdAt),
        updatedAt: convertDate(item.updatedAt),
    }));
};

export const discount = (data) => {
    return data.map((item) => {
        const [startDay, startTime] = item.startAt.split(' ');
        const [endDay, endTime] = item.endAt.split(' ');

        return {
            ...item,
            startTime,
            endTime,
            startDay,
            endDay,
            saleOff: item.saleOff + '%',
        };
    });
};
