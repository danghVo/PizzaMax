import classNames from 'classnames/bind';

import styles from './Payment.module.scss';
import CommonTemplate from '../CommonTemplate';
import Button from '~/components/Button';
import * as Icons from '~/components/Icons';
import Option from '~/components/Option';
import { useRef, useState } from 'react';
import { IOService } from '~/services';
import { useDispatch, useSelector } from 'react-redux';
import { cartSelector, cartThunk } from '~/store/cart';
import { addressSelector } from '~/store/address';
import store from '~/store';
import { userSelector } from '~/store/user';

const cs = classNames.bind(styles);

function Payment() {
    const [paymentSelection, setPaymentSelection] = useState('Tiền mặt');
    const currentAddressId = useSelector(addressSelector.currentAddressId);
    const currentOrderType = useSelector(addressSelector.orderType);
    const cart = useSelector(cartSelector.cart);
    const user = useSelector(userSelector.user);
    console.log(user);

    const dispatch = useDispatch();
    const paymentOptionRef = useRef();

    const handleChooseOption = (item) => {
        setPaymentSelection(item);
        paymentOptionRef.current.closeOption();
    };

    const handleOpenOption = () => {
        if (paymentOptionRef.current.isOpen) {
            paymentOptionRef.current.closeOption();
        } else paymentOptionRef.current.openOption();
    };

    const handleCheckout = () => {
        const payload = {
            cart,
            user,
            addressId: currentAddressId,
            orderWayId: currentOrderType,
            paymentWayId: paymentSelection === 'Online' ? 2 : 1,
        };

        if (paymentSelection === 'Online') {
            const socket = IOService.start();

            socket.checkout(payload, dispatch);
        } else dispatch(cartThunk.checkout(payload));
    };

    return (
        <>
            <CommonTemplate header="Phương thức thanh toán" className={cs('wrapper')}>
                <div className={cs('title')}>Phương thức thanh toán:</div>
                <Option
                    optionData={['Tiền mặt', 'Online'].map((item) => (
                        <div
                            onClick={() => handleChooseOption(item)}
                            className={cs('option-item', { chosen: item === paymentSelection })}
                        >
                            {item}
                        </div>
                    ))}
                    customOptionWrapper={cs('option-wrapper')}
                    ref={paymentOptionRef}
                >
                    <div className={cs('option')} onClick={handleOpenOption}>
                        {paymentSelection}
                        <Button
                            className={cs('arrow-btn')}
                            icon={<Icons.arrow className={cs('arrow-icon')} />}
                            type="icon"
                            theme="default"
                        />
                    </div>
                </Option>

                <Button size="small" animation hover handleClick={handleCheckout} className={cs('checkout-btn')}>
                    Thanh toán
                </Button>
            </CommonTemplate>
        </>
    );
}

export default Payment;
