import { createAsyncThunk } from '@reduxjs/toolkit';

import { productService } from '~/services';

export const fetchProducts = createAsyncThunk('productss/fetchProducts', async () => {
    const res = await productService.getAll();

    const types = res.reduce((accu, curr) => (accu.includes(curr.type) ? [...accu] : [...accu, curr.type]), []);

    const products = types.map((type) => {
        let products = res.filter((item) => item.type === type);

        return {
            type,
            products,
        };
    });

    console.log(products);

    return products;
});
