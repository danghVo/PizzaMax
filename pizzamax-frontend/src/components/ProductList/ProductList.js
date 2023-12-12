import { cartSelector, cartThunk } from '~/store/cart';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import styles from './ProductList.module.scss';
import Button from '~/components/Button';
import images from '~/assets/images';
import * as Icons from '~/components/Icons';

const cs = classNames.bind(styles);

function ProductList({ products }) {
    const dispatch = useDispatch();
    const cartStatusId = useSelector(cartSelector.statusId);

    const handleIncreaseQuantity = (product) => {
        dispatch(cartThunk.increase(product));
    };

    const handleDecreaseQuantity = (product) => {
        if (product.detail.quantity === 1) {
            dispatch(cartThunk.removeFromCart(product));
        } else dispatch(cartThunk.decrease(product));
    };

    const handleDeleteProduct = (product) => {
        dispatch(cartThunk.removeFromCart(product));
    };

    return (
        <div className={cs('orders-list')}>
            {products.map((product, index) => (
                <div key={index} className={cs('product')}>
                    <img className={cs('product-img')} src={product.image} alt="" />
                    <div className={cs('product-quantity')}>{product.detail.quantity}</div>
                    {product.detail.saleOff && <div className={cs('product-saleOff')}>-{product.detail.saleOff}%</div>}
                    <div className={cs('product-content')}>
                        <div className={cs('product-title')}>{product.name}</div>
                        <div className={cs('product-des')}>{product.description}</div>
                        <div className={cs('product-discOptions')}>
                            {product.Selection.map((disc, index) => (
                                <div key={index} className={cs('product-disc')}>
                                    <div className={cs('product-disc-title')}>{disc.section}</div>

                                    <div className={cs('product-disc-selection')}>{disc.name}</div>
                                </div>
                            ))}
                        </div>

                        <div className={cs('product-disc-actions')}>
                            <div className={cs('product-disc-price')}>
                                {product.detail.saleOff && (
                                    <span className={cs('price-saleOff')}>
                                        {((product.detail.price * (100 - product.detail.saleOff)) / 100).toLocaleString(
                                            'vi-VN',
                                            {
                                                style: 'currency',
                                                currency: 'VND',
                                            },
                                        )}
                                    </span>
                                )}

                                <span className={cs('price')}>
                                    {product.detail.price.toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </span>
                            </div>

                            <div className={cs('product-disc-btns')}>
                                <div className={cs('product-disc-quantity')}>
                                    <Button
                                        hover
                                        className={cs('decrease-btn', {
                                            disable: cartStatusId > 1,
                                        })}
                                        theme="primary"
                                        type="icon"
                                        size="small"
                                        animation
                                        handleClick={() => handleDecreaseQuantity(product)}
                                        icon={<Icons.minus width="2rem" height="2rem" />}
                                    />
                                    <Button
                                        hover
                                        className={cs('increse-btn', {
                                            disable: cartStatusId > 1,
                                        })}
                                        theme="primary"
                                        type="icon"
                                        size="small"
                                        animation
                                        handleClick={() => handleIncreaseQuantity(product)}
                                        icon={<Icons.plus width="2rem" height="2rem" />}
                                    />
                                </div>
                                <Button
                                    className={cs('bin-btn', {
                                        disable: cartStatusId > 1,
                                    })}
                                    theme="blank"
                                    type="icon"
                                    size="small"
                                    handleClick={() => handleDeleteProduct(product)}
                                    icon={<img className={cs('bin-img')} src={images.bin} />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductList;
