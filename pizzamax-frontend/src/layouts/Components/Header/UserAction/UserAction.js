import classNames from 'classnames/bind';
import headerStyles from '../Header.module.scss';
import modalStyles from './UserAction.module.scss';
import { useState, useRef, useEffect } from 'react';

import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import Option from '~/components/Option';
import * as flagService from '~/services/flagService';
import { json } from 'react-router';

const headerCs = classNames.bind(headerStyles);

const modalCs = classNames.bind(modalStyles);

function UserAction() {
    const [openModal, setOpenModal] = useState(false);
    const [phoneText, setPhoneText] = useState('');
    const [valid, setIsValid] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const phoneInputRef = useRef();
    const modalRef = useRef();

    const phoneStorage = window.localStorage.getItem('phoneNumber');

    useEffect(() => {
        if (phoneStorage) setPhoneText(phoneStorage);
    }, []);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleInput = (e) => {
        let textValue = e.target.value.slice(3).trim();
        if (textValue.length > 14) {
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

        setPhoneText(textValue);
    };

    const handleKeyInput = (e) => {
        if (e.keyCode) {
            if (window.getSelection().toString() === '+84' + phoneText) {
                e.preventDefault();
                const selection = window.getSelection();
                selection.removeAllRanges();

                const range = phoneInputRef.current.value.length;

                phoneInputRef.current.setSelectionRange(range, range);
            }
        }
    };

    const handleLogIn = () => {
        const phoneCheck = phoneText.split(' ').join('');

        if (phoneCheck.length < 9 || phoneCheck.length > 11) {
            setIsValid('Mobile Number is invalid');
            return;
        }

        window.localStorage.setItem('phoneNumber', phoneText);
        modalRef.current.closeModal();
    };

    const handleAsGuest = () => {
        modalRef.current.closeModal();
    };

    return (
        <>
            <Button animation theme="default" icon={<Icons.user />} handleClick={handleOpenModal}>
                Sign In / Register
            </Button>

            {openModal && (
                <Modal ref={modalRef} className={modalCs('user-modal')} onClose={handleCloseModal}>
                    <p className={modalCs('title')}>Enter your information</p>
                    {valid && (
                        <p className={modalCs('valid')}>
                            <Icons.valid className={modalCs('valid-icon')} />
                            {valid}
                        </p>
                    )}
                    <div className={modalCs('content')}>
                        {!isLogin && (
                            <>
                                <label htmlFor="nickname" className={modalCs('advice')}>
                                    What can we call you ?
                                </label>
                                <input id="nickname" className={modalCs('input-form')} name="" />
                            </>
                        )}
                        <label htmlFor="username" className={modalCs('advice')}>
                            Username:
                        </label>
                        <input id="username" className={modalCs('input-form')} name="" />
                        <label htmlFor="password" className={modalCs('advice')}>
                            Password:
                        </label>
                        <input id="password" type="password" className={modalCs('input-form')} name="" />

                        {!isLogin && (
                            <>
                                <label htmlFor="phone-number" className={modalCs('advice')}>
                                    Please confirm your country code and enter your mobile number
                                </label>
                                <div className={modalCs('phone-number')}>
                                    <div className={modalCs('flag-wrapper')}>
                                        <img
                                            className={modalCs('flag')}
                                            src="https://flagcdn.com/w320/vn.png"
                                            alt="Viet Nam"
                                        />
                                    </div>

                                    <input
                                        id="phone-number"
                                        ref={phoneInputRef}
                                        value={'+84' + phoneText}
                                        onKeyDown={handleKeyInput}
                                        onChange={handleInput}
                                    />
                                </div>
                            </>
                        )}

                        <p className={modalCs('about')}>
                            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service
                            apply.
                        </p>
                    </div>

                    <div className={modalCs('actions')}>
                        <div className={modalCs('authen-actions-btn')}>
                            <Button
                                animation
                                handleClick={handleLogIn}
                                className={modalCs('actions-btn', 'log-in-btn')}
                                hover
                                theme="primary"
                                size="small"
                            >
                                Register
                            </Button>

                            <Button
                                animation
                                handleClick={handleLogIn}
                                className={modalCs('actions-btn', 'log-in-btn')}
                                hover
                                theme="primary"
                                size="small"
                            >
                                Login
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
                </Modal>
            )}
        </>
    );
}

export default UserAction;
