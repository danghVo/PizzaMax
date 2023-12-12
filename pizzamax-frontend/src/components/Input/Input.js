import classNames from 'classnames/bind';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';

import { useValid } from '~/hooks';
import styles from './Input.module.scss';
import { forwardRef } from 'react';

const cs = classNames.bind(styles);

function Input(
    { value = '', label = null, textArea = false, rules = [], arrow, onChange, isPhoneText = false, ...props },
    ref,
) {
    const checkedData = isPhoneText ? value.slice(3).split(' ').join('') : value;

    const [errMess, setErrMess] = useState('');
    const { message } = useValid(checkedData, rules);

    const firstRender = useRef(true);

    useEffect(() => {
        if (value !== '') {
            firstRender.current = false;
        }

        if (message && !firstRender.current) {
            setErrMess(message);
        } else setErrMess('');
    }, [message, value]);

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    };

    const handleOnChange = (e) => {
        onChange(e);
    };

    const InputTag = textArea ? 'textarea' : 'input';

    return (
        <div
            className={cs('input-wrapper', {
                isMessage: errMess,
            })}
        >
            {label && (
                <label className={cs('label')} htmlFor={label}>
                    {label}:{' '}
                </label>
            )}
            <div className={cs('input')}>
                <div className={cs('icon')}>{arrow}</div>
                <InputTag
                    id={label}
                    onKeyUp={handleKeyUp}
                    value={value}
                    ref={ref}
                    rule={rules.length > 0 ? '' : null}
                    onChange={handleOnChange}
                    {...props}
                />
            </div>
            {errMess && <div className={cs('input-message')}>{errMess}</div>}
        </div>
    );
}

export default forwardRef(Input);
