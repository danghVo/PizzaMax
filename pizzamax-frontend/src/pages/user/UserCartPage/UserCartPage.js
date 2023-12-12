import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '~/store/user';
import { motion } from 'framer-motion';

import classNames from 'classnames/bind';

import styles from './UserCartPage.module.scss';
import CartView from '~/components/CartView';
import { cartSelector } from '~/store/cart';
import Button from '~/components/Button';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

const cs = classNames.bind(styles);

function UserInforPage() {
    const navigate = useNavigate();
    const [filter, setFilter] = useState(1);
    const [cartData, setCartData] = useState([]);

    const cartOfUser = useSelector(cartSelector.allCartsOfUser);

    useEffect(() => {
        if (filter) {
            setCartData(cartOfUser.filter((cart) => cart.statusId === filter && cart.products.length > 0));
        }
    }, [filter]);

    const ActionElement = ({ uuid }) => {
        const cart = cartOfUser.find((cart) => cart.uuid === uuid);
        return cart.statusId === 1 ? (
            <Button
                className={cs('checkout-btn')}
                size="small"
                handleClick={() => navigate('/cart/checkout')}
                anmation
                hover
            >
                Thanh toán
            </Button>
        ) : null;
    };

    return (
        <div className={cs('wrapper')}>
            <div className={cs('header')}>Đơn hàng của bạn</div>
            <div className={cs('inner')}>
                <div className={cs('sideBar')}>
                    <div className={cs('sideBar-inner')}>
                        <div className={cs('header')}>Trạng thái</div>
                        {[
                            { filter: 1, name: 'Đơn hàng chưa thanh toán' },
                            { filter: 2, name: 'Đơn hàng đang chờ' },
                            { filter: 3, name: 'Đơn hàng thành công' },
                            { filter: 4, name: 'Đơn hàng thất bại' },
                        ].map((item) => {
                            return (
                                <motion.div
                                    initial={{ padding: '12px 12px' }}
                                    animate={
                                        filter === item.filter ? { padding: '16px 12px' } : { padding: '12px 12px' }
                                    }
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
                </div>
                <div className={cs('cart-list-wrapper')}>
                    {cartData.length === 0 && <div className={cs('empty')}>Không có đơn hàng nào</div>}
                    <CartView ActionElement={ActionElement} cartData={cartData} />
                </div>
            </div>
        </div>
    );
}

export default UserInforPage;
