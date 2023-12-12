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
import { systemSlice } from '~/store/system';
import { user } from '~/utils/dataTransform';

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
    const [userDataLogin, setUserLogin] = useState({ phoneNumber: '', password: '' });
    const [userDataRegister, setUserDataRegister] = useState({
        phoneNumber: '',
        name: '',
        password: '',
        confirmPassword: '',
    });
    const [errMessage, setErrMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const switchForm = useRef(false);

    const dispatch = useDispatch();

    const apiStatus = useSelector(userSelector.apiStatus);

    const inputPhoneRef = useRef(null);

    const userData = isLogin ? userDataLogin : userDataRegister;

    useEffect(() => {
        setUserLogin({ phoneNumber: '', name: '', password: '', confirmPassword: '' });
        setUserDataRegister({ phoneNumber: '', name: '', password: '', confirmPassword: '' });
        setErrMessage('');
    }, [isLogin]);

    useEffect(() => {
        if (apiStatus.status === 'success') {
            if (isLogin) {
                handleCloseModal();
            } else {
                dispatch(systemSlice.actions.setInform({ message: 'Đăng ký thành công', type: 'success' }));
                setIsLogin(true);
            }
            dispatch(userSlice.actions.renewApiStatus());
        } else {
            setErrMessage(apiStatus.message);
        }
    }, [apiStatus]);

    useEffect(() => {
        if (errMessage) {
            inputPhoneRef.current.focus();
        }
    }, [errMessage]);

    const handleInputPhone = (e) => {
        let textValue = e.target.value.slice(3).trim();
        if (textValue.length > 12) {
            return;
        }
        if (userData.phoneNumber.length === 0) {
            const countPerThree = textValue.length / 3;
            textValue = textValue.split('');
            for (let i = 1; i <= countPerThree; i++) {
                textValue[i * 3 - 1] += ' ';
            }
            textValue = ' ' + textValue.join('');
        } else if (textValue.length > 0) {
            textValue = textValue.split(' ');
            let checkText = textValue.pop();

            if (checkText.length > 3) {
                checkText = checkText.split('');
                const newValue = ' ' + checkText.pop();
                checkText = checkText.join('') + newValue;
            }

            textValue.push(checkText);

            textValue = ' ' + textValue.join(' ');
        }

        if (isLogin) {
            setUserLogin((prev) => ({ ...prev, phoneNumber: textValue }));
        } else setUserDataRegister((prev) => ({ ...prev, phoneNumber: textValue }));
    };

    const handleKeyPhoneInput = (e) => {
        if (e.keyCode === 8) {
            if (window.getSelection().toString() === '+84' + userData.phoneNumber) {
                e.preventDefault();
                const selection = window.getSelection();
                selection.removeAllRanges();

                const range = e.target.value.length;

                e.target.setSelectionRange(range, range);
            }
        } else if (!keysAllow.includes(e.key) && e.key !== 'Control' && e.key !== 'v') {
            e.preventDefault();
        }
    };

    const handleSubmit = async () => {
        if (!loading) {
            setLoading(true);
            if (isLogin && !loading) {
                dispatch(
                    userThunk.login({
                        password: userData.password,
                        phoneNumber: userData.phoneNumber.split(' ').join(''),
                    }),
                );
            } else {
                dispatch(
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

    const handleCommonInput = (field, userDataInput) => {
        if (isLogin) {
            setUserLogin((prev) => ({ ...prev, [field]: userDataInput }));
        } else setUserDataRegister((prev) => ({ ...prev, [field]: userDataInput }));
    };

    return (
        <Modal className={modalCs('user-modal')} onClose={handleCloseModal}>
            <p className={modalCs('title')}>Hãy nhập thông tin của bạn</p>
            {errMessage && (
                <p className={modalCs('valid')}>
                    <Icons.valid className={modalCs('valid-icon')} />
                    {errMessage}
                </p>
            )}
            <Form
                name={isLogin ? 'login' : 'register'}
                className={modalCs('form-wrapper')}
                handlesubmit={handleSubmit}
                handleError={handleSubmitErr}
            >
                <div className={modalCs('content')}>
                    {!isLogin && (
                        <>
                            <label htmlFor="nickname" className={modalCs('advice')}>
                                Chúng tôi nên gọi bạn như thế nào ?
                            </label>
                            <Input
                                id="nickname"
                                className={modalCs('input-form')}
                                rules={[required]}
                                value={userData.name}
                                autoFocus
                                onChange={(e) => setUserDataRegister((prev) => ({ ...prev, name: e.target.value }))}
                            />
                        </>
                    )}
                    <label htmlFor="phone-number" className={modalCs('advice')}>
                        Hãy nhập số điện thoại:
                    </label>
                    <div className={modalCs('phone-number')}>
                        <div className={modalCs('flag-wrapper')}>
                            <img className={modalCs('flag')} src="https://flagcdn.com/w320/vn.png" alt="Viet Nam" />
                        </div>

                        <Input
                            ref={inputPhoneRef}
                            id="phone-number"
                            className={modalCs('input-phone')}
                            value={'+84' + userData.phoneNumber}
                            rules={isLogin ? [] : [required, phoneNumber]}
                            isPhoneText
                            autoFocus
                            onKeyDown={handleKeyPhoneInput}
                            onChange={handleInputPhone}
                        />
                    </div>

                    <label htmlFor="password" className={modalCs('advice')}>
                        Mật khẩu:
                    </label>
                    <Input
                        id="password"
                        type="password"
                        className={modalCs('input-form')}
                        value={userData.password}
                        rules={isLogin ? [] : [required, minLength(8), password]}
                        onChange={(e) => handleCommonInput('password', e.target.value)}
                    />
                    {!isLogin && (
                        <>
                            <label htmlFor="confirm-password" className={modalCs('advice')}>
                                Nhập lại mật khẩu:
                            </label>
                            <Input
                                id="confirm-password"
                                type="password"
                                className={modalCs('input-form')}
                                value={userData.confirmPassword}
                                rules={[required, sameValue(userData.password, 'Mật khẩu nhập lại không khớp')]}
                                onChange={(e) =>
                                    setUserDataRegister((prev) => ({ ...prev, confirmPassword: e.target.value }))
                                }
                            />
                        </>
                    )}
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
                            {loading && !isLogin ? <Icons.loading /> : 'Đăng ký'}
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
                            {loading && isLogin ? <Icons.loading /> : 'Đăng nhập'}
                        </Button>
                    </div>
                </div>
            </Form>
        </Modal>
    );
}

export default ModalAuth;
