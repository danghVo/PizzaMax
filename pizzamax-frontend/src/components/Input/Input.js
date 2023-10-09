import classNames from 'classnames/bind';
import { useState } from 'react';

import { useValid } from '~/hooks';
import styles from './Input.module.scss';
import { forwardRef } from 'react';

const cs = classNames.bind(styles);

function Input({ value = '', rules = [], onChange, isPhoneText = false, ...props }, inputForwadRef) {
    const checkedData = isPhoneText ? value.slice(3).split(' ').join('') : value;

    const { valid, message } = useValid(checkedData, rules);

    return (
        <>
            <div className={cs('input-wrapper')}>
                <input
                    value={value}
                    ref={inputForwadRef}
                    rule={rules.length > 0 ? '' : null}
                    onChange={onChange}
                    {...props}
                />
                {message && <div className={cs('input-message')}>{message}</div>}
            </div>
        </>
    );
}

export default forwardRef(Input);
