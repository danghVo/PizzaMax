import classNames from 'classnames/bind';

import styles from './CartView.module.scss';
import Image from '../Image';
import { convertDate } from '~/utils';

const cs = classNames.bind(styles);

function CartView({ ActionElement, cartData }) {
    return (
        <div className={cs('wrapper')}>
            <div className={cs('inner')}>
                {cartData.map(
                    (cart, index) =>
                        cart.products.length > 0 && (
                            <div className={cs('cart')} key={index}>
                                <div className={cs('cart-product')}>
                                    {cart.products.map((product, subIndex) => (
                                        <div className={cs('cart-product-item')} key={subIndex}>
                                            <div className={cs('cart-product-item-image')}>
                                                <Image src={product.image} alt={product.name} />
                                            </div>
                                            <div className={cs('cart-product-infor-wrapper')}>
                                                <div className={cs('cart-product-infor-item')}>
                                                    <span className={cs('title')}>Tên:</span>
                                                    {product.name}
                                                </div>
                                                <div className={cs('cart-product-infor-item')}>
                                                    <span className={cs('title')}>Loại:</span>
                                                    {product.type}
                                                </div>
                                                <div className={cs('cart-product-infor-item')}>
                                                    <span className={cs('title')}>Đơn giá:</span>
                                                    {parseInt(
                                                        product.price || product.detail.price / product.detail.quantity,
                                                    ).toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </div>
                                                <div className={cs('cart-product-infor-item')}>
                                                    <span className={cs('title')}>Số lượng:</span>
                                                    {product.detail.quantity}
                                                </div>
                                                <div className={cs('cart-product-infor-item')}>
                                                    <span className={cs('title')}>Tổng Giá tiền:</span>
                                                    {parseInt(product.detail.price).toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={cs('cart-infor')}>
                                    <div className={cs('header')}>Chi tiết đơn hàng:</div>
                                    <div className={cs('cart-infor-item')}>
                                        <div className={cs('title')}>Trạng thái đơn hàng: </div>
                                        <div className={cs('value', 'uppercase')}>{cart.status}</div>
                                    </div>

                                    {cart.statusId !== 1 && (
                                        <>
                                            <div className={cs('cart-infor-item')}>
                                                <div className={cs('title')}>Địa chỉ: </div>
                                                <div className={cs('value')}>{cart.address}</div>
                                            </div>
                                            <div className={cs('cart-infor-item')}>
                                                <div className={cs('title')}>Phương thức mua hàng: </div>
                                                <div className={cs('value')}>{cart.orderWay}</div>
                                            </div>
                                            <div className={cs('cart-infor-item')}>
                                                <div className={cs('title')}>Phương thức thanh toán: </div>
                                                <div className={cs('value')}>{cart.paymentWay}</div>
                                            </div>
                                        </>
                                    )}
                                    <div className={cs('cart-infor-item')}>
                                        <div className={cs('title')}>Tổng tiền: </div>
                                        <div className={cs('value')}>
                                            {parseInt(cart.subTotal).toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })}
                                        </div>
                                    </div>

                                    {cart.statusId !== 1 && (
                                        <>
                                            {cart.deliveryCharge !== 0 && (
                                                <div className={cs('cart-infor-item')}>
                                                    <div className={cs('title')}>Tiền vận chuyển: </div>
                                                    <div className={cs('value')}>
                                                        {parseInt(cart.deliveryCharge).toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                            <div className={cs('cart-infor-item')}>
                                                <div className={cs('title')}>Tổng cộng: </div>
                                                <div className={cs('value')}>
                                                    {parseInt(cart.total).toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                </div>
                                            </div>
                                            <div className={cs('cart-infor-item')}>
                                                <div className={cs('title')}>Ngày thanh toán: </div>
                                                <div className={cs('value')}>{cart.checkOutAt}</div>
                                            </div>
                                        </>
                                    )}

                                    {ActionElement && <ActionElement uuid={cart.uuid} />}
                                </div>
                            </div>
                        ),
                )}
            </div>
        </div>
    );
}

export default CartView;
