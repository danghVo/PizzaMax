// Pages
import Home from '~/pages/home';
import Product from '~/pages/product';

export const publicRoutes = [
    { path: '/', component: Home },
    { path: '/product/:name', component: Product },
];

export const privateRoutes = [];
