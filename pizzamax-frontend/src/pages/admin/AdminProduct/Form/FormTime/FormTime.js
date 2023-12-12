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

const cs = classNames.bind(styles);

const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeValue = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '0',
];

function FormTime({ handleCloseForm, dataSelected: timeSelected }) {
    const [formData, setFormData] = useState({
        name: '',
        fromDay: '',
        toDay: '',
        fromTime: '',
        toTime: '',
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
        if (dayName.indexOf(formData.toDay) < dayName.indexOf(formData.fromDay)) {
            setInValidMessage(`Ngày kết thúc bán phải lớn hơn ngày bắt đầu`);
        } else if (timeValue.indexOf(formData.toTime) < timeValue.indexOf(formData.fromTime)) {
            setInValidMessage(`Thời gian kết thúc phải lớn hơn thời gian bắt đầu`);
        } else setInValidMessage('');
    }, [formData]);

    useEffect(() => {
        if (timeSelected) {
            Object.keys(formData).forEach((key) => {
                formData[key] = timeSelected[key];
            });

            setFormData({ ...formData });
        }
    }, [timeSelected]);

    const handleSubmit = (formRef) => {
        if (!invalidMessage) {
            if (timeSelected.id) {
                dispatch(
                    productThunk.updateTime({
                        ...formData,
                        id: timeSelected.id,
                    }),
                );
            } else dispatch(productThunk.addTime(formData));
            dispatch(productsSlice.actions.setApiStart('loading'));
            formRef.current.scrollTop = 0;
        }
    };

    const handleSetOption = (setSelectionToState, currentSelectForState) => {
        setSelectionToState(currentSelectForState);
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
                <div className={cs('form-title')}>Thời gian</div>
                {(formApiStatus.errorMessage || invalidMessage) && (
                    <div className={cs('error-message')}>
                        <Icons.valid className={cs('valid-icon')} /> {formApiStatus.errorMessage || invalidMessage}
                    </div>
                )}

                <div className={cs('form-input-wrapper')}>
                    <Input
                        label="Tên thời gian"
                        value={formData.name}
                        rules={[required]}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        className={cs('form-input')}
                    />
                </div>

                <InputOption
                    label="Ngày bắt đầu bán"
                    optionData={dayName}
                    selecting={{
                        currentSelectForState: formData.fromDay,
                        handleSetOption,
                        setSelectionToState: (value) => setFormData((prev) => ({ ...prev, fromDay: value })),
                    }}
                    rules={[required]}
                    className={cs('form-input-option')}
                />

                <InputOption
                    label="Ngày kết thúc"
                    optionData={dayName}
                    selecting={{
                        currentSelectForState: formData.toDay,
                        handleSetOption,
                        setSelectionToState: (value) => setFormData((prev) => ({ ...prev, toDay: value })),
                    }}
                    rules={[required]}
                    className={cs('form-input-option')}
                />

                <InputOption
                    label="Thời gian bắt đầu bán"
                    optionData={timeValue}
                    selecting={{
                        currentSelectForState: formData.fromTime,
                        handleSetOption,
                        setSelectionToState: (value) => setFormData((prev) => ({ ...prev, fromTime: value })),
                    }}
                    rules={[required]}
                    className={cs('form-input-option')}
                />

                <InputOption
                    label="Thời gian kết thúc"
                    optionData={timeValue}
                    selecting={{
                        currentSelectForState: formData.toTime,
                        handleSetOption,
                        setSelectionToState: (value) => setFormData((prev) => ({ ...prev, toTime: value })),
                    }}
                    rules={[required]}
                    className={cs('form-input-option')}
                />
            </div>
            <Button size="small" do="submit" animation hover className={cs('submit-btn')}>
                Lưu
            </Button>
        </Form>
    );
}

export default FormTime;
