import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';

import styles from './AdminCart.module.scss';
import { cartSelector, cartThunk } from '~/store/cart';
import CartView from '~/components/CartView';
import Button from '~/components/Button';
import * as Icons from '~/components/Icons';

const cs = classNames.bind(styles);

function AdminCart() {
    const [filter, setFilter] = useState('pending');

    const dispatch = useDispatch();

    const allCarts = useSelector(cartSelector.allCarts);

    useEffect(() => {
        dispatch(cartThunk.getAllCart());
    }, []);

    const handleUpdateCartStatus = (uuid, statusId) => {
        dispatch(cartThunk.updateCartStatus({ ...uuid, statusId }));
    };

    const ActionElement = (uuid) => (
        <div className={cs('action-btn')}>
            <Button
                icon={<Icons.close width="2rem" height="2rem" />}
                className={cs('btn', 'fail')}
                animation
                customAnimation={cs('btn-animation')}
                handleClick={() => handleUpdateCartStatus(uuid, 4)}
            >
                Hủy đơn hàng
            </Button>
            <Button
                icon={<Icons.check width="2rem" height="2rem" />}
                className={cs('btn', 'success')}
                animation
                customAnimation={cs('btn-animation')}
                handleClick={() => handleUpdateCartStatus(uuid, 3)}
            >
                Hoàn thành
            </Button>
        </div>
    );

    return (
        <div className={cs('wrapper')}>
            <div className={cs('sideBar')}>
                <div className={cs('header')}>Trạng thái</div>
                {[
                    { filter: 'pending', name: 'Đơn hàng đang chờ' },
                    { filter: 'success', name: 'Đơn thành thành công' },
                    { filter: 'fail', name: 'Đơn hàng thất bại' },
                ].map((item) => {
                    return (
                        <motion.div
                            initial={{ padding: '12px 12px' }}
                            animate={filter === item.filter ? { padding: '16px 12px' } : { padding: '12px 12px' }}
                            onClick={() => setFilter(item.filter)}
                            className={cs('sideBar-item', {
                                active: filter === item.filter,
                            })}
                            key={item.name}
                        >
                            {item.name}
                        </motion.div>
                    );
                })}
            </div>
            <div className={cs('cart-list')}>
                <CartView
                    cartData={allCarts[filter]}
                    ActionElement={filter === 'pending' ? ActionElement : () => null}
                ></CartView>
            </div>
        </div>
    );
}

export default AdminCart;
