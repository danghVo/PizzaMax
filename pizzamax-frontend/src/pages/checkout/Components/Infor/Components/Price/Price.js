import classNames from 'classnames/bind';
import { useState, useRef } from 'react';

import styles from './Price.module.scss';
import { useSelector } from 'react-redux';
import { cartSelector } from '~/store/cart';
import CommonTemplate from '../../../CommonTemplate';
import { addressSelector } from '~/store/address';
const cs = classNames.bind(styles);

function Price({}) {
    const priceInfor = useSelector(cartSelector.price);
    const currentOrderType = useSelector(addressSelector.orderType);

    return (
        <CommonTemplate className={cs('wrapper')} header={'Giá tiền'}>
            <div className={cs('price-item')}>
                Tổng tiền sản phẩm:
                <span className={cs('price')}>
                    {priceInfor.subTotal.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </span>
            </div>
            {currentOrderType === 2 && (
                <div className={cs('price-item')}>
                    Phí vận chuyển:
                    <span className={cs('price')}>
                        {priceInfor.deliveryCharge.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                    </span>
                </div>
            )}
            <div className={cs('price-item')}>
                Tổng cộng:
                <span className={cs('price')}>
                    {(currentOrderType === 1
                        ? priceInfor.subTotal
                        : priceInfor.subTotal + priceInfor.deliveryCharge
                    ).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}
                </span>
            </div>
        </CommonTemplate>
    );
}

export default Price;
