export const address = (data) => {
    return data.map((item) => {
        const alley = item.alley ? `${item.alley} Alley,` : '';

        return `${item.houseNumber}, ${alley} ${item.street} , ${item.district} , ${item.city} City`;
    });
};

export const product = (data) => {
    return data.map((item) => ({
        ...item,
        discOptions: item.discOptions.map((disc) => ({
            ...disc,
            subOptions: disc.subOptions.sort((a, b) => a.price - b.price),
        })),
    }));
};

export const favorite = (data) => {
    return data.map((item) => item.id);
};

export const cart = (data) => ({
    ...data,
    products: data.products.sort((a, b) => Date.parse(a.detail.createdAt) - Date.parse(b.detail.createdAt)),
});

export const user = (data) => {
    return {
        ...data,
        favorite: favorite(data.favorite),
        address: address(data.address),
    };
};
