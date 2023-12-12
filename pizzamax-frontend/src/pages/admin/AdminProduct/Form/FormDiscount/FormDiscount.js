import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Form from '~/components/Form';
import styles from '../Form.module.scss';
import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { daySelectingRule, required } from '~/rules';
import { InputOption } from '~/components/Option';
import { productThunk, productsSelector, productsSlice } from '~/store/products';
import maxValueRule from '~/rules/maxValueRule';

const cs = classNames.bind(styles);

function FormTime({ handleCloseForm, dataSelected: discountSeleted }) {
    const [formData, setFormData] = useState({
        saleOff: '',
        startDay: Date.now().toLocaleString('vi-VN', { timeZone: 'UTC' }),
        endDay: '',
        startTime: '',
        endTime: '',
    });
    const [invalidMessage, setInValidMessage] = useState('');

    const dispatch = useDispatch();
    const formApiStatus = useSelector(productsSelector.formApiStatus);

    useEffect(() => {
        if (formApiStatus.status === 'success') {
            handleCloseForm();
            dispatch(productsSlice.actions.setApiStart(''));
        }
    }, [formApiStatus.status]);

    useEffect(() => {
        const currentDate = new Date(Date.now());
        if (Date.parse(formData.startDay) < currentDate.toLocaleDateString()) {
            setInValidMessage(`Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại`);
        } else if (formData.endDay < formData.startDay) {
            setInValidMessage(`Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu`);
        } else if (formData.endTime < formData.startTime) {
            setInValidMessage(`Thời gian kết thúc phải lớn hơn thời gian bắt đầu`);
        } else setInValidMessage('');
    }, [formData]);

    useEffect(() => {
        if (discountSeleted) {
            Object.keys(formData).forEach((key) => {
                formData[key] = discountSeleted[key];
            });

            setFormData({ ...formData });
        }
    }, [discountSeleted]);

    const handleSubmit = (formRef) => {
        if (!invalidMessage) {
            const payload = {
                saleOff: formData.saleOff.slice(0, 2),
                startAt: formData.startDay + ' ' + formData.startTime + ':00',
                endAt: formData.endDay + ' ' + formData.endTime + ':00',
            };

            if (discountSeleted.id) {
                dispatch(
                    productThunk.updateDiscount({
                        ...payload,
                        id: discountSeleted.id,
                    }),
                );
            } else dispatch(productThunk.addDiscount(payload));
            dispatch(productsSlice.actions.setApiStart('loading'));
            formRef.current.scrollTop = 0;
        }
    };

    return (
        <Form className={cs('form')} preventPressEnter handlesubmit={handleSubmit}>
            <div
                className={cs('close')}
                onClick={() => {
                    handleCloseForm();
                    dispatch(productsSlice.actions.setApiStart(''));
                }}
            >
                <Icons.close width="3rem" height="3rem" />
            </div>
            <div className={cs('form-inner')}>
                <div className={cs('form-title')}>Khuyến mãi</div>
                {(formApiStatus.errorMessage || invalidMessage) && (
                    <div className={cs('error-message')}>
                        <Icons.valid className={cs('valid-icon')} /> {formApiStatus.errorMessage || invalidMessage}
                    </div>
                )}

                <div className={cs('form-input-wrapper')}>
                    <Input
                        label="Giảm %"
                        value={formData.saleOff}
                        rules={[required, maxValueRule(100)]}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                saleOff: e.target.value,
                            }))
                        }
                        className={cs('form-input')}
                    />
                </div>

                <div className={cs('form-input-wrapper')}>
                    <Input
                        label="Ngày bắt đầu"
                        value={formData.startDay}
                        type="date"
                        rules={[required]}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                startDay: e.target.value,
                            }))
                        }
                        className={cs('form-input')}
                    />
                </div>

                <div className={cs('form-input-wrapper')}>
                    <Input
                        label="Ngày kết thúc"
                        value={formData.endDay}
                        type="date"
                        rules={[required]}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                endDay: e.target.value,
                            }))
                        }
                        className={cs('form-input')}
                    />
                </div>

                <div className={cs('form-input-wrapper')}>
                    <Input
                        label="Thời gian bắt đầu"
                        value={formData.startTime}
                        type="time"
                        rules={[required]}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                startTime: e.target.value,
                            }))
                        }
                        className={cs('form-input')}
                    />
                </div>

                <div className={cs('form-input-wrapper')}>
                    <Input
                        label="Thời gian kết thúc"
                        value={formData.endTime}
                        type="time"
                        rules={[required]}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                endTime: e.target.value,
                            }))
                        }
                        className={cs('form-input')}
                    />
                </div>
            </div>
            <Button size="small" do="submit" animation hover className={cs('submit-btn')}>
                Lưu
            </Button>
        </Form>
    );
}

export default FormTime;
