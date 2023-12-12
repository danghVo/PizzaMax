import classNames from 'classnames/bind';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './Address.module.scss';
import Option from '~/components/Option';
import Button from '~/components/Button';
import CommonTemplate from '~/pages/checkout/Components/CommonTemplate';
import * as Icons from '~/components/Icons';
import { addressSelector, addressSlice } from '~/store/address';
import { cartThunk } from '~/store/cart';
const cs = classNames.bind(styles);

const optionOrderType = ['Mua mang về', 'Giao hàng'];

function Address() {
    const [orderWay, setOrderWay] = useState('Your order way');
    const [address, setAddress] = useState('Address');
    const [optionAddress, setOptionAddress] = useState([]);

    const userAddress = useSelector(addressSelector.userAddress);
    const shopAddress = useSelector(addressSelector.shopAddress);
    const currentAddress = useSelector(addressSelector.currentAddress);
    const currentOrderType = useSelector(addressSelector.orderType);

    const dispatch = useDispatch();

    const orderWayOptionRef = useRef();
    const addressOptionRef = useRef();

    useEffect(() => {
        setOrderWay(optionOrderType[currentOrderType - 1]);
        setAddress(currentAddress[currentOrderType].address);
    }, [currentOrderType, currentAddress]);

    useEffect(() => {
        setOptionAddress(
            orderWay === 'Mua mang về'
                ? shopAddress.map((item) => item.address)
                : userAddress.map((item) => item.address),
        );
    }, [orderWay, userAddress, shopAddress]);

    useEffect(() => {
        if (address) {
            let locationExist;
            if (currentOrderType === 2) {
                locationExist = userAddress.find((item) => item.address === address);
            } else locationExist = shopAddress.find((item) => item.address === address);

            dispatch(
                addressSlice.actions.setCurrentAddress({
                    address: address,
                    id: locationExist ? locationExist.id : currentAddress[currentOrderType].id,
                    orderType: currentOrderType,
                }),
            );
        }
    }, [address]);

    useEffect(() => {
        if (currentOrderType === 2) {
            let addressExist = userAddress.find((item) => {
                return item.address === currentAddress[2].address;
            });

            if (addressExist) {
                dispatch(cartThunk.getDeliveryCharge(addressExist.id));
            }
        }
    }, [address, currentOrderType]);

    const handleChooseAddress = (item, setState) => {
        setState(item);
    };

    const handleChooseOrderType = (item, setState) => {
        setState(item);
        dispatch(addressSlice.actions.setOrderType({ orderType: item === 'Mua mang về' ? 1 : 2 }));
    };

    const handleToggleOption = (optionRef) => {
        if (optionRef.current.isOpen) {
            optionRef.current.closeOption();
        } else optionRef.current.openOption();
    };

    return (
        <CommonTemplate className={cs('wrapper')} header={'Địa chỉ'}>
            <div className={cs('orderWay')}>
                <div className={cs('title')}>Phương thức mua hàng:</div>

                <Option
                    ref={orderWayOptionRef}
                    customOptionWrapper={cs('option-wrapper')}
                    optionData={optionOrderType.map((orderTypeItem) => (
                        <div
                            onClick={() => handleChooseOrderType(orderTypeItem, setOrderWay)}
                            className={cs('option-item', { chosen: orderTypeItem === orderWay })}
                        >
                            {orderTypeItem}
                        </div>
                    ))}
                >
                    <div className={cs('option')} onClick={() => handleToggleOption(orderWayOptionRef)}>
                        <span className={cs('option-text')}>{orderWay}</span>
                        <Button
                            className={cs('arrow-btn')}
                            icon={<Icons.arrow className={cs('arrow-icon')} />}
                            type="icon"
                            theme="default"
                        />
                    </div>
                </Option>
            </div>

            <div className={cs('address')}>
                <div className={cs('title')}>Địa chỉ:</div>

                <Option
                    ref={addressOptionRef}
                    customOptionWrapper={cs('option-wrapper')}
                    optionData={optionAddress.map((addressItem) => (
                        <div
                            onClick={() => handleChooseAddress(addressItem, setAddress)}
                            className={cs('option-item', { chosen: addressItem === address })}
                        >
                            {addressItem}
                        </div>
                    ))}
                >
                    <div className={cs('option')} onClick={() => handleToggleOption(addressOptionRef)}>
                        <span className={cs('option-text')}>{address}</span>
                        <Button
                            className={cs('arrow-btn')}
                            icon={<Icons.arrow className={cs('arrow-icon')} />}
                            type="icon"
                            theme="default"
                        />
                    </div>
                    {!address && <div className={cs('required')}>Không được bỏ trống</div>}
                </Option>
            </div>
        </CommonTemplate>
    );
}

export default Address;
