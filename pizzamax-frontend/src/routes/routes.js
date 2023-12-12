// Pages
import Checkout from '~/pages/checkout';
import Home from '~/pages/home';
import Product from '~/pages/product';
import AdminBanner from '~/pages/admin/AdminBanner';
import { NoPermission } from '~/pages/error';
import { UserInforPage, UserCartPage } from '~/pages/user';
import { Admin, AdminProduct, AdminStore, AdminUser, AdminCart, AdminChart } from '~/pages/admin';

// Layout
import { FootlessLayout } from '~/layouts';
import AdminLayout from '~/layouts/AdminLayout';
import ErrorLayout from '~/layouts/ErrorLayout';

export const publicRoutes = [
    { path: '/', component: Home },
    { path: '/product/:type/:productName', component: Product },
    { path: '/cart/checkout', component: Checkout, Layout: FootlessLayout },
    { path: '/NoPermission', component: NoPermission, Layout: ErrorLayout },
    { path: '/user/infor', component: UserInforPage },
    { path: '/user/cart', component: UserCartPage },
];

export const privateRoutes = [
    {
        path: '/admin',
        component: Admin,
        Layout: AdminLayout,
        children: [
            { path: 'product', component: AdminProduct },
            { path: 'store', component: AdminStore },
            { path: 'user', component: AdminUser },
            { path: 'cart', component: AdminCart },
            { path: 'banner', component: AdminBanner },
            { path: 'chart', component: AdminChart },
        ],
    },
];
