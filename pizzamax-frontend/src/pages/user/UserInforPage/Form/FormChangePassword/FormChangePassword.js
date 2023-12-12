import classNames from 'classnames/bind';

import styles from './FormChangePassword.module.scss';
import Form from '~/components/Form';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { required, sameValue } from '~/rules';
import * as Icons from '~/components/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector, userSlice } from '~/store/user';
import { useEffect } from 'react';
import passwordRule from '~/rules/passwordRule';

const cs = classNames.bind(styles);

function FormChangePassword({ formData, handleCloseForm, submitForm, handleFormData }) {
    const formApiStatus = useSelector(userSelector.apiStatus);

    const dispatch = useDispatch();

    useEffect(() => {
        if (formApiStatus.status === 'success') {
            dispatch(userSlice.actions.renewApiStatus());
            handleCloseForm();
        }
    }, [formApiStatus]);

    const handleSubmit = () => {
        submitForm({ oldPassword: formData.oldPassword, newPassword: formData.newPassword });
    };

    return (
        <Form className={cs('form')} handlesubmit={handleSubmit}>
            <div className={cs('close')} onClick={handleCloseForm}>
                <Icons.close width="3rem" height="3rem" />
            </div>

            <div className={cs('form-title')}>Đổi mật khẩu</div>
            {formApiStatus.status === 'fail' && (
                <div className={cs('error-message')}>
                    <Icons.valid className={cs('valid-icon')} /> {formApiStatus.message}
                </div>
            )}

            <div className={cs('form-input-wrapper')}>
                <Input
                    label="Mật khẩu cũ"
                    value={formData.oldPassword}
                    rules={[required]}
                    type="password"
                    onChange={(e) =>
                        handleFormData((prev) => ({
                            ...prev,
                            oldPassword: e.target.value,
                        }))
                    }
                    className={cs('form-input')}
                />
            </div>
            <div className={cs('form-input-wrapper')}>
                <Input
                    label="Mật khẩu mới"
                    value={formData.newPassword}
                    rules={[required, passwordRule]}
                    type="password"
                    onChange={(e) =>
                        handleFormData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                        }))
                    }
                    className={cs('form-input')}
                />
            </div>
            <div className={cs('form-input-wrapper')}>
                <Input
                    label="Nhập lại mật khẩu mới"
                    value={formData.confirmPassword}
                    type="password"
                    rules={[required, sameValue(formData.newPassword, 'Mật khẩu nhập lại không khớp')]}
                    onChange={(e) =>
                        handleFormData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                        }))
                    }
                    className={cs('form-input')}
                />
            </div>

            <Button theme="primary" size="small" do="submit" animation hover className={cs('form-select-btn')}>
                Thay đổi
            </Button>
        </Form>
    );
}

export default FormChangePassword;
