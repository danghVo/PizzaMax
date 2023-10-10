import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import styles from './HomeProduct.module.scss';
import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import Message from './Components/Message';
import { cartSlice, cartSelector, cartThunk } from '~/store/cart';
import { userThunk } from '~/store/user';
import Image from '~/components/Image';
import { checkDiscountAvail } from '~/utils';

const cs = classNames.bind(styles);

function HomeProduct({ data, favorite }) {
    const [openModal, setOpenModal] = useState(false);
    const [isMessage, setMessage] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState(data.price);
    const [warnings, setWarnings] = useState(
        data.discOptions.map(() => ({
            isWarning: false,
        })) || [],
    );

    const [selection, setSelection] = useState(
        data.discOptions?.map(() => ({ section: '', name: '', type: '', price: 0, indexSelection: -1 })) || null,
    );

    const dispatch = useDispatch();
    const cartStore = useSelector(cartSelector.cart);
    const productInStore = cartStore.products.find((item) => item.name === data.name) || null;

    let isDiscountAvailable = checkDiscountAvail(data.Discount);
    let saleOff = isDiscountAvailable ? data.Discount.saleOff : 0;

    useEffect(() => {
        if (productInStore) {
            setPrice(productInStore.detail.price);
            setQuantity(productInStore.detail.quantity);
            setSelection(
                productInStore.Selection.map((item) => {
                    let indexSelection;
                    data.discOptions.find((discOption) => {
                        if (discOption.type === item.type) {
                            indexSelection = discOption.subOptions.findIndex(
                                (subOption) => subOption.name === item.name,
                            );

                            return true;
                        }
                        return false;
                    });

                    return {
                        name: item.name,
                        price: item.price,
                        section: item.section,
                        type: item.price,
                        indexSelection,
                    };
                }),
            );
        } else {
            setQuantity(1);
            setPrice(data.price);
            setSelection(
                data.discOptions?.map(() => ({ section: '', name: '', type: '', price: 0, indexSelection: -1 })) ||
                    null,
            );
        }
    }, [productInStore]);

    useEffect(() => {
        if (!productInStore)
            setPrice(
                selection.reduce((accu, current) => (current.price ? accu + current.price : accu), data.price) *
                    quantity,
            );
    }, [selection]);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const checkSelectionChoosen = () => {
        return (
            selection.filter((item, index) => {
                if (item.indexSelection === -1) {
                    setWarnings((prev) =>
                        prev.map((warning, warningIndex) =>
                            warningIndex === index ? (warning.isWarning = true && warning) : warning,
                        ),
                    );
                    return true;
                }
                return false;
            }).length === 0
        );
    };

    const handleAddToCartModal = () => {
        if (productInStore) {
            setOpenModal(false);
            setMessage(true);
            return;
        }

        if (checkSelectionChoosen()) {
            handleCloseModal();
            setMessage(true);

            dispatch(
                cartThunk.addToCart({
                    name: data.name,
                    selection,
                    quantity: quantity,
                }),
            );
        }
    };

    const handleAddToCart = () => {
        if (data.discOptions.length > 0 && !openModal) {
            setOpenModal(true);
        } else {
            dispatch(
                cartThunk.addToCart({
                    name: data.name,
                    selection,
                    quantity: quantity,
                }),
            );
        }
    };

    const increaseQuantity = () => {
        if (data.discOptions.length > 0 && !openModal) {
            setOpenModal(true);
        } else dispatch(cartThunk.increase(productInStore));

        if (!openModal) setMessage(true);
    };

    const increaseQuantityModal = () => {
        if (!productInStore) {
            dispatch(
                cartThunk.addToCart({
                    name: data.name,
                    selection,
                    quantity: quantity + 1,
                }),
            );
        } else dispatch(cartThunk.increase(productInStore));
    };

    const decreaseQuantity = () => {
        if (quantity === 1) {
            if (productInStore) dispatch(cartThunk.removeFromCart(productInStore));

            if (openModal) setOpenModal(false);
        } else {
            dispatch(cartThunk.decrease(productInStore));
        }
    };

    const handelSelectOption = (subOption, section, type, selectionIndex, subOptionIndex) => {
        setWarnings((prev) => {
            prev[selectionIndex].isWarning = false;
            return [...prev];
        });

        setSelection((prev) => {
            prev[selectionIndex] = {
                section,
                type,
                price: subOption.price,
                name: subOption.name,
                indexSelection: subOptionIndex,
            };

            return [...prev];
        });
    };

    const handleFavorite = () => {
        const payload = {
            productId: data.id,
        };

        if (favorite) {
            dispatch(userThunk.removeFavor(payload));
        } else dispatch(userThunk.addFavor(payload));
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
                <input onChange={() => {}} className={cs('modal-cart-quantity')} value={quantity} />
            ) : (
                <div className={cs('product-cart-quantity')}>{quantity}</div>
            )}

            <Button
                hover
                className={cs('increse-btn')}
                theme="primary"
                type="icon"
                size="small"
                animation
                handleClick={openModal ? increaseQuantityModal : increaseQuantity}
                icon={<Icons.plus />}
            />
        </>
    );

    const addToCartBtn = (
        <Button
            className={cs('product-btn', { 'modal-btn': openModal })}
            hover
            animation
            handleClick={openModal ? handleAddToCartModal : handleAddToCart}
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
                    <Image className={cs('product-img')} src={data.image} alt="" />
                    {data.Discount && isDiscountAvailable && (
                        <div className={cs('product-saleOff')}>{data.Discount.saleOff}% OFF</div>
                    )}
                    <div className={cs('product-infor')}>
                        <div className={cs('product-content')}>
                            <h4 className={cs('product-name')}>{data.name}</h4>
                            <p className={cs('product-description')}>{data.description}</p>
                        </div>

                        <Button
                            className={cs('product-heart')}
                            icon={favorite ? <Icons.heartFull /> : <Icons.heart />}
                            type="icon"
                            theme="default"
                            handleClick={handleFavorite}
                        />
                    </div>

                    <div className={cs('product-price')}>
                        <span className={cs('price')}>
                            {price
                                ? price.toLocaleString('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND',
                                  })
                                : 'Choose to see detail price'}
                        </span>
                        {isDiscountAvailable && price && (
                            <span className={cs('price-saleOff')}>
                                {(price - (price * saleOff) / 100).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </span>
                        )}
                    </div>

                    {productInStore && quantity ? (
                        <div className={cs('product-cart')}>{actionsCartElement}</div>
                    ) : (
                        addToCartBtn
                    )}
                </div>
            </div>

            {!openModal && <Message isMessage={isMessage} setMessage={setMessage} />}

            {openModal && data.discOptions && (
                <Modal className={cs('modal-wrapper')} onClose={handleCloseModal}>
                    <div className={cs('modal-img-wrapper')}>
                        <img src={data.image} className={cs('modal-img')} alt={data.name} />
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
                                                        selected: selection[index].indexSelection !== -1,
                                                    })}
                                                >
                                                    {selection[index].indexSelection !== -1 ? 'Selected' : 'Required'}
                                                </div>
                                            </div>
                                            <div className={cs('disc-item-options')}>
                                                {item.subOptions.map((subOption, subOptionIndex) => (
                                                    <div
                                                        onClick={() =>
                                                            handelSelectOption(
                                                                subOption,
                                                                item.name,
                                                                item.type,
                                                                index,
                                                                subOptionIndex,
                                                            )
                                                        }
                                                        key={subOptionIndex}
                                                        className={cs('disc-item-selection')}
                                                    >
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
                                                        />
                                                        <div className={cs('disc-item-name')}>
                                                            {`${subOption.name} ${
                                                                subOption.signature ? '(Signature)' : ''
                                                            }`}
                                                        </div>
                                                        <div className={cs('disc-item-price')}>
                                                            {subOption.price !== 0
                                                                ? subOption.price.toLocaleString('vi-VN', {
                                                                      style: 'currency',
                                                                      currency: 'VND',
                                                                  })
                                                                : ''}
                                                        </div>
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
                                {price.toLocaleString('vi-VN', {
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
