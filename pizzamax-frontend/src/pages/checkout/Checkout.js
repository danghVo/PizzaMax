import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

import styles from './Checkout.module.scss';
import Order from './Components/Order';
import Infor from './Components/Infor';
import Payment from './Components/Payment';
import { cartSelector } from '~/store/cart';
import store from '~/store';

const cs = classNames.bind(styles);
function Checkout() {
    const currentCart = useSelector(cartSelector.cart);

    useEffect(() => {
        window.scrollTo(0, 0);
    });

    return (
        <div className={cs('wrapper')}>
            <div className={cs('heading')}>Thanh toán</div>

            <div className="flex space-x-10">
                <Order products={currentCart.products} />
                <div className="w-full">
                    <Infor />
                    <Payment />
                </div>
            </div>
        </div>
    );
}

export default Checkout;
