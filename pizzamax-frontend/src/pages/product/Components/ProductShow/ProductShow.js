import classNames from 'classnames/bind';
import { useRef, useState } from 'react';

import styles from './ProductShow.module.scss';
import Image from '~/components/Image';
import ButtonLike from '~/components/Button/ButtonLike';
import ActionButton from '~/components/Button/ActionButton/ActionButton';
import Button from '~/components/Button';
import DiscOption from '~/components/DiscOption';
import * as Icons from '~/components/Icons';
import { useDispatch } from 'react-redux';
import { cartThunk } from '~/store/cart';
import { checkDiscountAvail } from '~/utils';

const cs = classNames.bind(styles);

function ProductShow({ data = {} }) {
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [allowZoom, setAllowZoom] = useState(false);

    const dispatch = useDispatch();

    const discOptionRef = useRef(null);

    let isDiscountAvailable;
    let saleOff;

    if (data?.Discount) {
        isDiscountAvailable = checkDiscountAvail(data.Discount);
        saleOff = isDiscountAvailable ? data.Discount.saleOff : 0;
    }

    const handleSetPrice = (price) => {
        setPrice(price);
    };

    const handleAddToCart = () => {
        let selection = {};
        if (data.discOptions.length > 0) {
            selection = discOptionRef.current.getSelection();
        }

        dispatch(
            cartThunk.addToCart({
                name: data.name,
                selection,
                quantity,
            }),
        );
    };

    return (
        <div className={cs('wrapper')}>
            {data.Discount && isDiscountAvailable && (
                <div className={cs('product-saleOff')}>-{data.Discount.saleOff}% OFF</div>
            )}

            <div>
                <Image src={data.image} allowZoom={allowZoom} className={cs('img')} />
                <div
                    className={cs('zoom-icon', {
                        active: allowZoom,
                    })}
                    onClick={() => setAllowZoom((prev) => !prev)}
                >
                    <Icons.magnifying />
                </div>
            </div>

            <div className={cs('content')}>
                <div className="flex flex-col">
                    <div className={cs('header')}>
                        <div className={cs('product-name')}>
                            <div className={cs('name')}>{data.name}</div>
                            <div className={cs('description')}>{data.description}</div>
                        </div>
                        <ButtonLike className={cs('like-btn')} productId={data.id} />
                    </div>
                    <DiscOption ref={discOptionRef} handleSetPrice={handleSetPrice} discOptions={data.discOptions} />
                </div>
                <div className={cs('action')}>
                    <ActionButton
                        handleIncrease={() => setQuantity((prev) => prev + 1)}
                        handleDecrease={() => setQuantity((prev) => (prev > 1 ? prev - 1 : prev))}
                        className={{
                            wrapper: cs('action-btn'),
                            increase: cs('quantity-btn'),
                            decrease: cs('quantity-btn'),
                        }}
                    >
                        <div className={cs('quantity')}>{quantity}</div>
                    </ActionButton>

                    <Button
                        size="small"
                        type="primary"
                        animation
                        hover
                        handleClick={handleAddToCart}
                        className={cs('addToCart-btn')}
                    >
                        <div className={cs('addToCart-content')}>
                            <span className={cs('price')}>
                                {(
                                    ((data.price || price) - ((data.price || price) * saleOff) / 100) *
                                    quantity
                                ).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })}
                            </span>
                            <span className={cs('text')}>Thêm vào giỏ hàng</span>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ProductShow;
