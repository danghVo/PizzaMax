import classNames from 'classnames/bind';
import headerStyles from '../Header.module.scss';
import modalStyles from './UserAction.module.scss';
import { useState, useRef, useEffect } from 'react';

import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { register, userSelector } from '~/store/user';

const headerCs = classNames.bind(headerStyles);

const modalCs = classNames.bind(modalStyles);

function UserAction() {
    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState({ phoneNumber: '', name: '', password: '' });
    const [valid, setIsValid] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    const phoneInputRef = useRef();
    const modalRef = useRef();

    const dispatch = useDispatch();

    const phoneStorage = window.localStorage.getItem('phoneNumber');
    const message = useSelector(userSelector.message);

    useEffect(() => {
        if (phoneStorage) setUser((prev) => ({ ...prev, phoneNumber: phoneStorage }));
    }, []);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleInputPhone = (e) => {
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

        setUser((prev) => ({ ...prev, phoneNumber: textValue }));
    };

    const handleKeyInput = (e) => {
        if (e.keyCode) {
            if (window.getSelection().toString() === '+84' + user.phoneNumber) {
                e.preventDefault();
                const selection = window.getSelection();
                selection.removeAllRanges();

                const range = phoneInputRef.current.value.length;

                phoneInputRef.current.setSelectionRange(range, range);
            }
        }
    };

    const handleLogIn = () => {
        if (isLogin) {
            const phoneCheck = user.phoneNumber.split(' ').join('');

            if (phoneCheck.length < 9 || phoneCheck.length > 11) {
                setIsValid('Mobile Number is invalid');
                return;
            }

            window.localStorage.setItem('phoneNumber', user.phoneNumber);
            modalRef.current.closeModal();
        } else {
            setIsLogin(true);
        }
    };

    const handleRegister = async () => {
        if (!isLogin) {
            dispatch(register(user));
        } else setIsLogin(false);
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
                    {(valid || message) && (
                        <p className={modalCs('valid')}>
                            <Icons.valid className={modalCs('valid-icon')} />
                            {valid || message}
                        </p>
                    )}
                    <div className={modalCs('content')}>
                        {!isLogin && (
                            <>
                                <label htmlFor="nickname" className={modalCs('advice')}>
                                    What can we should call you ?
                                </label>
                                <input
                                    id="nickname"
                                    className={modalCs('input-form')}
                                    name=""
                                    value={user.name}
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

                            <input
                                id="phone-number"
                                ref={phoneInputRef}
                                value={'+84' + user.phoneNumber}
                                onKeyDown={handleKeyInput}
                                onChange={handleInputPhone}
                            />
                        </div>

                        <label htmlFor="password" className={modalCs('advice')}>
                            Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={modalCs('input-form')}
                            value={user.password}
                            onChange={(e) => setUser((prev) => ({ ...prev, password: e.target.value }))}
                        />

                        <p className={modalCs('about')}>
                            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service
                            apply.
                        </p>
                    </div>

                    <div className={modalCs('actions')}>
                        <div className={modalCs('authen-actions-btn')}>
                            <Button
                                animation
                                handleClick={handleRegister}
                                className={modalCs('actions-btn', 'log-in-btn')}
                                hover
                                theme={!isLogin ? 'primary' : 'default'}
                                size="small"
                            >
                                Register
                            </Button>

                            <Button
                                animation
                                handleClick={handleLogIn}
                                className={modalCs('actions-btn', 'log-in-btn')}
                                hover
                                theme={isLogin ? 'primary' : 'default'}
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
