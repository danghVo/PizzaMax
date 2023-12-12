import classNames from 'classnames/bind';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

import Modal from '~/components/Modal';
import Button from '~/components/Button';
import * as Icons from '~/components/Icons';
import headerStyles from '../Header.module.scss';
import modalStyles from './CartModal.module.scss';
import images from '~/assets/images';
import { cartSelector } from '~/store/cart';
import ProductList from '~/components/ProductList';
import { addressSelector } from '~/store/address';
const headerCs = classNames.bind(headerStyles);
const modalCs = classNames.bind(modalStyles);

function Cart({ user }) {
    const [openModal, setOpenModal] = useState(false);

    const cart = useSelector(cartSelector.cart);
    const currentOrderType = useSelector(addressSelector.orderType);
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    return (
        <>
            <Button handleClick={handleOpenModal} animation shadow icon={<Icons.cart />}>
                <span className={headerCs('cart-quantity')}>{cart.totalQuantity}</span>
                Giỏ Hàng
            </Button>
            <AnimatePresence>
                {openModal && (
                    <Modal
                        initial={{ x: 300 }}
                        animate={{ x: 0 }}
                        transition={{ ease: 'easeOut', duration: 0.25 }}
                        exit={{ x: 400 }}
                        className={modalCs('modal-wrapper')}
                        noCloseBtn
                        onClose={handleCloseModal}
                    >
                        <h3 className={modalCs('modal-title')}>Giỏ Hàng</h3>

                        <div className={modalCs('orders')}>
                            {cart.products.length > 0 ? (
                                <>
                                    <ProductList products={cart.products} />

                                    <div className={modalCs('orders-bill')}>
                                        <div className={modalCs('orders-bill-item')}>
                                            Tổng tiền hàng:
                                            <span className={modalCs('orders-bill-money')}>
                                                {cart.price.subTotal.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </span>
                                        </div>
                                        {currentOrderType === 2 && (
                                            <div className={modalCs('orders-bill-item')}>
                                                Phí giao hàng:
                                                <span className={modalCs('orders-bill-money')}>
                                                    {cart.price.deliveryCharge.toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                        <div className={modalCs('orders-bill-item', 'total')}>
                                            Tổng tiền:
                                            <span className={modalCs('orders-bill-money')}>
                                                {(currentOrderType === 1
                                                    ? cart.price.subTotal
                                                    : cart.price.subTotal + cart.price.deliveryCharge
                                                ).toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </span>
                                        </div>
                                        <Button
                                            size="small"
                                            animation
                                            hover
                                            link={cart.statusId === 1 && `/cart/checkout`}
                                            requireLogin={user ? false : true}
                                            handleClick={handleCloseModal}
                                            className={modalCs('orders-checkout-btn', {
                                                disable: cart.statusId > 1,
                                            })}
                                        >
                                            {cart.status}
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className={modalCs('empty-wrapper')}>
                                    <img className={modalCs('empty-img')} src={images.emptyCart} alt="empty-cart" />
                                    <p className={modalCs('message')}>Giỏ hàng của bạn đang trống</p>
                                    <p className={modalCs('advice')}>Hãy thêm sản phẩm vào giỏ hàng</p>
                                </div>
                            )}
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </>
    );
}

export default Cart;
