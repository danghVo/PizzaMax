import classNames from 'classnames/bind';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';

import Modal from '~/components/Modal';
import Button from '~/components/Button';
import headerStyles from '../Header.module.scss';
import modalStyles from './CartModal.module.scss';
import images from '~/assets/images';
import * as Icons from '~/components/Icons';
import { cartSlice, cartSelector } from '~/store/cart';

const headerCs = classNames.bind(headerStyles);
const modalCs = classNames.bind(modalStyles);

function Cart() {
    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch();

    const cart = useSelector(cartSelector.cart);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleIncreaseQuantity = (product) => {
        dispatch(cartSlice.actions.increment(product));
    };

    const handleDecreaseQuantity = (product) => {
        dispatch(cartSlice.actions.decrement(product));
    };

    const handleDeleteProduct = (product) => {
        dispatch(cartSlice.actions.removeFromCart(product));
    };

    return (
        <>
            <Button handleClick={handleOpenModal} animation shadow icon={<Icons.cart />}>
                <span className={headerCs('cart-quantity')}>{cart.quantity}</span>
                View Cart
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
                        <h3 className={modalCs('modal-title')}>Your Cart</h3>

                        <div className={modalCs('orders')}>
                            {cart.products.length > 0 ? (
                                <>
                                    <div className={modalCs('orders-list')}>
                                        {cart.products.map((product, index) => (
                                            <div key={index} className={modalCs('product')}>
                                                <img className={modalCs('product-img')} src={product.src} alt="" />
                                                <div className={modalCs('product-quantity')}>{product.quantity}</div>
                                                <div className={modalCs('product-content')}>
                                                    <div className={modalCs('product-title')}>{product.name}</div>
                                                    <div className={modalCs('product-des')}>{product.description}</div>
                                                    <div className={modalCs('product-discOptions')}>
                                                        {product.discOptions.map((disc, index) => (
                                                            <div key={index} className={modalCs('product-disc')}>
                                                                <div className={modalCs('product-disc-title')}>
                                                                    {disc.title}
                                                                </div>

                                                                <div className={modalCs('product-disc-selection')}>
                                                                    {disc.nameSelection}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className={modalCs('product-disc-actions')}>
                                                        <div className={modalCs('product-disc-temp-price')}>
                                                            {(product.price * product.quantity).toLocaleString(
                                                                'vi-VN',
                                                                {
                                                                    style: 'currency',
                                                                    currency: 'VND',
                                                                },
                                                            )}
                                                        </div>

                                                        <div className={modalCs('product-disc-btns')}>
                                                            <div className={modalCs('product-disc-quantity')}>
                                                                <Button
                                                                    hover
                                                                    className={modalCs('decrease-btn')}
                                                                    theme="primary"
                                                                    type="icon"
                                                                    size="small"
                                                                    animation
                                                                    handleClick={() => handleDecreaseQuantity(product)}
                                                                    icon={<Icons.minus width="2rem" height="2rem" />}
                                                                />
                                                                <Button
                                                                    hover
                                                                    className={modalCs('increse-btn')}
                                                                    theme="primary"
                                                                    type="icon"
                                                                    size="small"
                                                                    animation
                                                                    handleClick={() => handleIncreaseQuantity(product)}
                                                                    icon={<Icons.plus width="2rem" height="2rem" />}
                                                                />
                                                            </div>
                                                            <Button
                                                                className={modalCs('bin-btn')}
                                                                theme="blank"
                                                                type="icon"
                                                                size="small"
                                                                handleClick={() => handleDeleteProduct(product)}
                                                                icon={
                                                                    <img
                                                                        className={modalCs('bin-img')}
                                                                        src={images.bin}
                                                                    />
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={modalCs('orders-bill')}>
                                        <div className={modalCs('orders-bill-item')}>
                                            Subtotal:
                                            <span className={modalCs('orders-bill-money')}>
                                                {cart.subTotal.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </span>
                                        </div>
                                        <div className={modalCs('orders-bill-item')}>
                                            Delivery charges:
                                            <span className={modalCs('orders-bill-money')}>
                                                {cart.deliveryCharge.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </span>
                                        </div>
                                        <div className={modalCs('orders-bill-item', 'total')}>
                                            Grand total:
                                            <span className={modalCs('orders-bill-money')}>
                                                {cart.total.toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </span>
                                        </div>
                                        <Button size="small" className={modalCs('orders-checkout-btn')}>
                                            Checkout
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className={modalCs('empty-wrapper')}>
                                    <img className={modalCs('empty-img')} src={images.emptyCart} alt="empty-cart" />
                                    <p className={modalCs('message')}>Your cart is empty</p>
                                    <p className={modalCs('advice')}>Add an item and start making your order</p>
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
