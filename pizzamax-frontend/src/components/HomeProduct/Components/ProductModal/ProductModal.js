import classNames from 'classnames/bind';
import styles from '../../HomeProduct.module.scss';

import Modal from '~/components/Modal';
import { forwardRef, useState, useRef } from 'react';
import DiscOption from '~/components/DiscOption';
import * as Icons from '~/components/Icons';
import ActionButton from '~/components/Button/ActionButton/ActionButton';
import Button from '~/components/Button';
import { useDispatch } from 'react-redux';
import { cartThunk } from '~/store/cart';

const cs = classNames.bind(styles);

function ProductModal({ data, discount, handleCloseModal }, ref) {
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const discOptionRef = useRef(null);
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        const selection = discOptionRef.current.getSelection();

        if (selection) {
            dispatch(
                cartThunk.addToCart({
                    price,
                    name: data.name,
                    selection,
                    quantity: quantity,
                }),
            );

            handleCloseModal();
        }
    };

    return (
        <Modal className={cs('modal-wrapper')} onClose={handleCloseModal}>
            {discount && <div className={cs('modal-saleOff')}>-{discount}% OFF</div>}

            <div className={cs('modal-img-wrapper')}>
                <img src={data.image} className={cs('modal-img')} alt={data.name} />
                <div className={cs('modal-img-infor')}>
                    <h1 className={cs('modal-img-title')}>{data.name}</h1>
                    <p className={cs('modal-img-desc')}>{data.description}</p>
                </div>
            </div>

            <div className={cs('modal-disc-actions-wrapper')}>
                <div className={cs('modal-disc-wrapper')}>
                    <DiscOption ref={discOptionRef} handleSetPrice={setPrice} discOptions={data.discOptions} />
                </div>
                <div className={cs('modal-actions')}>
                    <div className={cs('modal-cart')}>
                        <ActionButton
                            className={{
                                increase: cs('increase-btn'),
                                decrease: cs('decrease-btn'),
                                wrapper: cs('product-cart'),
                            }}
                            handleDecrease={() => setQuantity((prev) => (prev === 1 ? handleCloseModal() : prev - 1))}
                            handleIncrease={() => setQuantity((prev) => prev + 1)}
                        >
                            <input onChange={() => {}} className={cs('modal-cart-quantity')} value={quantity} />
                        </ActionButton>
                    </div>

                    <div className={cs('modal-price')}>
                        {(data.price + price * quantity).toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                    </div>
                    <Button
                        className={cs('product-btn', 'modal-btn')}
                        hover
                        animation
                        handleClick={handleAddToCart}
                        theme="primary"
                        size="small"
                        icon={<Icons.cart width="1.8rem" height="1.8rem" />}
                    >
                        Thêm vào giỏ hàng
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default forwardRef(ProductModal);
