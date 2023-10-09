import classNames from 'classnames/bind';
import modalStyles from '../UserAction.module.scss';
import { useState, useRef, useEffect } from 'react';

import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import Input from '~/components/Input';
import Form from '~/components/Form';
import { useDispatch, useSelector } from 'react-redux';
import { userThunk, userSelector, userSlice } from '~/store/user';

//Rule
import { required, password, minLength, phoneNumber, sameValue } from '~/rules';

const modalCs = classNames.bind(modalStyles);
const keysAllow = [
    'Tab',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'ArrowUp',
    'ArrowLeft',
    'ArrowDown',
    'ArrowRight',
    'Enter',
];

function ModalAuth({ handleCloseModal }) {
    const [userData, setUser] = useState({ phoneNumber: '', name: '', password: '' });
    const [errMessage, setErrMessage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    const switchForm = useRef(false);

    const dispatch = useDispatch();

    const apiStatus = useSelector(userSelector.apiStatus);

    useEffect(() => {
        setUser({ phoneNumber: '', name: '', password: '' });
        setErrMessage('');
    }, [isLogin]);

    useEffect(() => {
        if (apiStatus.status === 'success') {
            if (isLogin) {
                handleCloseModal();
            } else {
                setIsLogin(true);
            }
            dispatch(userSlice.actions.renewApiStatus());
        } else setErrMessage(apiStatus.message);
    });

    const handleInputPhone = (e) => {
        let textValue = e.target.value.slice(3).trim();
        if (textValue.length > 12) {
            return;
        }
        if (textValue.length > 0) {
            textValue = textValue.split(' ');
            let checkText = textValue.pop();

            if (checkText.length > 3) {
                checkText = checkText.split('');
                const newValue = ' ' + checkText.pop();
                checkText.push(newValue);
                checkText = checkText.join('');
            }

            textValue.push(checkText);

            textValue = ' ' + textValue.join(' ');
        }

        setUser((prev) => ({ ...prev, phoneNumber: textValue }));
    };

    const handleKeyPhoneInput = (e) => {
        if (e.keyCode == 8) {
            if (window.getSelection().toString() === '+84' + userData.phoneNumber) {
                e.preventDefault();
                const selection = window.getSelection();
                selection.removeAllRanges();

                const range = e.target.value.length;

                e.target.setSelectionRange(range, range);
            }
        } else if (!keysAllow.includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleSubmit = async () => {
        if (!loading) {
            setLoading(true);
            if (isLogin && !loading) {
                await dispatch(
                    userThunk.login({
                        ...userData,
                        phoneNumber: userData.phoneNumber.split(' ').join(''),
                    }),
                );
            } else {
                await dispatch(
                    userThunk.register({
                        ...userData,
                        phoneNumber: userData.phoneNumber.split(' ').join(''),
                    }),
                );
            }
            setLoading(false);
        }
    };

    const handleSubmitErr = () => {
        if (!switchForm.current) {
            setErrMessage('Please complete this form');
        } else switchForm.current = false;
    };

    const handleSwitchToLogIn = () => {
        if (!isLogin) {
            setIsLogin(true);
            switchForm.current = true;
        }
    };

    const handleSwitchToRegister = () => {
        if (isLogin) {
            setIsLogin(false);
            switchForm.current = true;
        }
    };

    const handleAsGuest = () => {
        handleCloseModal();
    };

    return (
        <Modal className={modalCs('user-modal')} onClose={handleCloseModal}>
            <p className={modalCs('title')}>Enter your information</p>
            {errMessage && (
                <p className={modalCs('valid')}>
                    <Icons.valid className={modalCs('valid-icon')} />
                    {errMessage}
                </p>
            )}
            <Form name={isLogin ? 'login' : 'register'} handlesubmit={handleSubmit} handleError={handleSubmitErr}>
                <div className={modalCs('content')}>
                    {!isLogin && (
                        <>
                            <label htmlFor="nickname" className={modalCs('advice')}>
                                What can we should call you ?
                            </label>
                            <Input
                                id="nickname"
                                className={modalCs('input-form')}
                                rules={[required]}
                                value={userData.name}
                                onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
                            />
                        </>
                    )}
                    <label htmlFor="phone-number" className={modalCs('advice')}>
                        Please enter your mobile number
                    </label>
                    <div className={modalCs('phone-number')}>
                        <div className={modalCs('flag-wrapper')}>
                            <img className={modalCs('flag')} src="https://flagcdn.com/w320/vn.png" alt="Viet Nam" />
                        </div>

                        <Input
                            id="phone-number"
                            className={modalCs('input-phone')}
                            value={'+84' + userData.phoneNumber}
                            rules={isLogin ? [required] : [required, phoneNumber]}
                            isPhoneText
                            onKeyDown={handleKeyPhoneInput}
                            onChange={handleInputPhone}
                        />
                    </div>

                    <label htmlFor="password" className={modalCs('advice')}>
                        Password:
                    </label>
                    <Input
                        id="password"
                        type="password"
                        className={modalCs('input-form')}
                        value={userData.password}
                        rules={isLogin ? [required] : [required, minLength(8), password]}
                        onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
                    />
                    {!isLogin && (
                        <>
                            <label htmlFor="confirm-password" className={modalCs('advice')}>
                                Confirm password:
                            </label>
                            <Input
                                id="confirm-password"
                                type="password"
                                className={modalCs('input-form')}
                                value={confirmPassword}
                                rules={[required, sameValue(userData.password)]}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </>
                    )}

                    <p className={modalCs('about')}>
                        This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                    </p>
                </div>

                <div className={modalCs('actions')}>
                    <div className={modalCs('authen-actions-btn')}>
                        <Button
                            animation
                            do={!isLogin ? 'submit' : ''}
                            handleClick={handleSwitchToRegister}
                            className={modalCs('actions-btn', 'log-in-btn')}
                            hover
                            theme={!isLogin ? 'primary' : 'default'}
                            size="small"
                        >
                            {loading && !isLogin ? <Icons.loading /> : 'Register'}
                        </Button>

                        <Button
                            animation
                            do={isLogin ? 'submit' : ''}
                            handleClick={handleSwitchToLogIn}
                            className={modalCs('actions-btn', 'log-in-btn')}
                            hover
                            theme={isLogin ? 'primary' : 'default'}
                            size="small"
                        >
                            {loading && isLogin ? <Icons.loading /> : 'Login'}
                        </Button>
                    </div>

                    <div className={modalCs('separate')}>
                        <div className={modalCs('line')}></div>
                        <span>OR</span>
                        <div className={modalCs('line')}></div>
                    </div>

                    <Button
                        animation
                        className={modalCs('actions-btn')}
                        handleClick={handleAsGuest}
                        theme="outline"
                        size="small"
                    >
                        Order as Guest
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}

export default ModalAuth;
