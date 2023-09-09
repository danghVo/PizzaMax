import classNames from 'classnames/bind';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

import styles from './HomeProduct.module.scss';
import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import { cartSlice, cartSelector } from '~/store/cart';

const cs = classNames.bind(styles);

function HomeProduct({ data }) {
    const [openModal, setOpenModal] = useState(false);
    const [openCartSection, setOpenCartSection] = useState(false);
    const [message, setMessage] = useState(false);
    const [warnings, setWarnings] = useState(
        data.discOptions.map(() => ({
            isWarning: false,
        })) || [],
    );
    const [mouseIn, setMouseIn] = useState(false);

    const modalRef = useRef();

    const dispatch = useDispatch();
    const cartStore = useSelector(cartSelector.currentProducts);
    const product = cartStore.find((item) => item.name == data.name) || {};
    const selection =
        product.discOptions ||
        data.discOptions?.map((item) => ({ title: item.title, nameSelection: '', indexSelection: -1 })) ||
        [];

    useEffect(() => {
        if (message) {
            const intervalCheck = setInterval(() => {
                if (!mouseIn) {
                    setMessage(false);
                }
            }, 1000);

            return () => clearInterval(intervalCheck);
        }
    }, [message, mouseIn]);

    const handleCloseModal = () => {
        if (selection.find((item) => item.indexSelection == -1)) {
            decreaseQuantity();
        }
        setOpenModal(false);
    };

    const handleAddToCart = () => {
        if (openModal) {
            if (
                selection.filter((item, index) => {
                    if (item.indexSelection == -1) {
                        setWarnings((prev) =>
                            prev.map((warning, warningIndex) =>
                                warningIndex == index ? (warning.isWarning = true && warning) : warning,
                            ),
                        );
                        return true;
                    }
                    return false;
                }).length == 0
            ) {
                modalRef.current.closeModal();
                setMessage(true);
                return;
            }
        }
        if (data.discOptions.length > 0 && !openModal) {
            setOpenModal(true);
        }

        setOpenCartSection(true);

        dispatch(
            cartSlice.actions.addToCart({
                ...data,
                discOptions: selection,
                quantity: product.quantity || 1,
            }),
        );
    };

    const increaseQuantity = () => {
        if (data.discOptions.length > 0 && !openModal) {
            setOpenModal(true);
            if (product.quantity) return;
        }

        dispatch(cartSlice.actions.increment(product));

        if (!openModal) setMessage(true);
    };

    const decreaseQuantity = () => {
        if (product.quantity == 1) {
            if (openModal) setOpenModal(false);
            setOpenCartSection(false);
        }

        dispatch(cartSlice.actions.decrement(product));
    };

    const handleMouseLeave = () => {
        setMouseIn(false);
        setMessage(false);
    };

    const handleMouseIn = () => {
        setMouseIn(true);
    };

    const handelSelectOption = (subOption, title, selectionIndex, subOptionIndex) => {
        setWarnings((prev) => {
            prev[selectionIndex].isWarning = false;
            return [...prev];
        });
        dispatch(
            cartSlice.actions.chooseSelection({
                name: product.name,
                indexOption: selectionIndex,
                selection: {
                    title,
                    nameSelection: subOption.name,
                    indexSelection: subOptionIndex,
                },
            }),
        );
    };

    const actionsCartElement = (
        <>
            <Button
                hover
                className={cs('decrease-btn')}
                theme="primary"
                type="icon"
                size="small"
                animation
                handleClick={decreaseQuantity}
                icon={<Icons.minus />}
            />

            {openModal ? (
                <input onChange={() => {}} className={cs('modal-cart-quantity')} value={product.quantity} />
            ) : (
                <div className={cs('product-cart-quantity')}>{product.quantity}</div>
            )}

            <Button
                hover
                className={cs('increse-btn')}
                theme="primary"
                type="icon"
                size="small"
                animation
                handleClick={increaseQuantity}
                icon={<Icons.plus />}
            />
        </>
    );

    const addToCartBtn = (
        <Button
            className={cs('product-btn', { 'modal-btn': openModal })}
            hover
            animation
            handleClick={handleAddToCart}
            theme="primary"
            size="small"
            icon={!openModal && <Icons.cart width="1.8rem" height="1.8rem" />}
        >
            {openModal ? 'Add To Cart' : 'ADD TO CART'}
        </Button>
    );

    return (
        <>
            <div className={cs('product-wrapper')}>
                <div className={cs('product-inner')}>
                    <img className={cs('product-img')} src={data.src} alt="" />
                    {data.saleOff && <div className={cs('product-saleOff')}>{data.saleOff} OFF</div>}
                    <div className={cs('product-infor')}>
                        <div className={cs('product-content')}>
                            <h4 className={cs('product-name')}>{data.name}</h4>
                            <p className={cs('product-description')}>{data.description}</p>
                        </div>

                        <Button className={cs('product-heart')} icon={<Icons.heart />} type="icon" theme="default" />
                    </div>

                    <div className={cs('product-price')}>
                        {data.price.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                    </div>

                    {openCartSection && product.quantity ? (
                        <div className={cs('product-cart')}>{actionsCartElement}</div>
                    ) : (
                        addToCartBtn
                    )}
                </div>
            </div>

            {!openModal &&
                ReactDOM.createPortal(
                    <AnimatePresence>
                        {message && (
                            <motion.div
                                onMouseLeave={handleMouseLeave}
                                onMouseEnter={handleMouseIn}
                                initial={{ opacity: 0, scale: 0.8, x: '-50%' }}
                                animate={{ opacity: 1, scale: 1, x: '-50%' }}
                                exit={{ opacity: 0, scale: 0.8, x: '-50%' }}
                                className={cs('message-wrapper')}
                            >
                                <Button
                                    className={cs('message-btn')}
                                    icon={<Icons.checkBuy className={cs('message-icon')} />}
                                >
                                    Item added to the cart
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.getElementById('modal'),
                )}

            {openModal && data.discOptions && (
                <Modal ref={modalRef} className={cs('modal-wrapper')} onClose={handleCloseModal}>
                    <div className={cs('modal-img-wrapper')}>
                        <img src={data.src} className={cs('modal-img')} alt={data.name} />
                        <div className={cs('modal-img-infor')}>
                            <h1 className={cs('modal-img-title')}>{data.name}</h1>
                            <p className={cs('modal-img-desc')}>{data.description}</p>
                        </div>
                    </div>

                    <div className={cs('modal-disc-actions-wrapper')}>
                        <div className={cs('modal-disc-wrapper')}>
                            <div className={cs('modal-disc-inner')}>
                                {data.discOptions.map((item, index) => {
                                    return (
                                        <div key={index} className={cs('modal-disc-item')}>
                                            <div
                                                className={cs('disc-item-header', {
                                                    warning: warnings[index].isWarning,
                                                })}
                                            >
                                                <div className={cs('disc-item-title')}>{item.name}</div>
                                                <div
                                                    className={cs('disc-item-status', {
                                                        selected: selection[index].indexSelection != -1,
                                                    })}
                                                >
                                                    {selection[index].indexSelection != -1 ? 'Selected' : 'Required'}
                                                </div>
                                            </div>
                                            <div className={cs('disc-item-options')}>
                                                {item.subOptions.map((subOption, subOptionIndex) => (
                                                    <div key={subOptionIndex} className={cs('disc-item-selection')}>
                                                        <Button
                                                            animation
                                                            type="icon"
                                                            className={cs('disc-item-btn')}
                                                            icon={
                                                                <AnimatePresence>
                                                                    <motion.div
                                                                        className={cs('disc-item-icon-outline')}
                                                                    >
                                                                        {selection[index].indexSelection ==
                                                                            subOptionIndex && (
                                                                            <motion.div
                                                                                key={subOptionIndex}
                                                                                initial={{ scale: 0 }}
                                                                                animate={{ scale: 0.8 }}
                                                                                exit={{ scale: 0 }}
                                                                                className={cs('disc-item-icon-inner')}
                                                                            ></motion.div>
                                                                        )}
                                                                    </motion.div>
                                                                </AnimatePresence>
                                                            }
                                                            theme="outline"
                                                            onClick={() =>
                                                                handelSelectOption(
                                                                    subOption,
                                                                    item.name,
                                                                    index,
                                                                    subOptionIndex,
                                                                )
                                                            }
                                                        />
                                                        {`${subOption.name} ${
                                                            subOption.signature ? '(Signatures)' : ''
                                                        }`}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className={cs('modal-actions')}>
                            <div className={cs('modal-cart')}>{actionsCartElement}</div>

                            <div className={cs('modal-price')}>
                                {(product.price * product.quantity).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </div>

                            {addToCartBtn}
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}

export default HomeProduct;
