import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Form from '~/components/Form';
import styles from '../Form.module.scss';
import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { required } from '~/rules';
import { InputOption } from '~/components/Option';
import { productThunk, productsSelector, productsSlice } from '~/store/products';

const cs = classNames.bind(styles);

function FormType({ timeFilters, handleCloseForm, dataSelected: typeSelected }) {
    const [formData, setFormData] = useState({
        name: '',
        timeId: null,
        timeName: '',
    });

    const dispatch = useDispatch();
    const formApiStatus = useSelector(productsSelector.formApiStatus);
    const rawTimes = useSelector(productsSelector.rawTimes);

    useEffect(() => {
        if (formApiStatus.status === 'success') {
            handleCloseForm();
            dispatch(productsSlice.actions.setApiStart(''));
        }
    }, [formApiStatus.status]);

    useEffect(() => {
        if (typeSelected) {
            Object.keys(formData).forEach((key) => {
                formData[key] = typeSelected[key];
            });

            setFormData({ ...formData });
        }
    }, [typeSelected]);

    const handleSubmit = (formRef) => {
        if (typeSelected.id) {
            dispatch(
                productThunk.updateType({
                    ...formData,
                    id: typeSelected.id,
                }),
            );
        } else dispatch(productThunk.addType(formData));

        dispatch(productsSlice.actions.setApiStart('loading'));
        formRef.current.scrollTop = 0;
    };

    const handleSetOption = (setSelectionToState, currentSelectForState) => {
        setSelectionToState((prev) => ({
            ...prev,
            timeName: currentSelectForState,
            timeId: rawTimes.find((item) => currentSelectForState === item.name).id,
        }));
    };

    return (
        <Form className={cs('form')} preventPressEnter handlesubmit={handleSubmit}>
            <div className={cs('close')} onClick={handleCloseForm}>
                <Icons.close width="3rem" height="3rem" />
            </div>
            <div className={cs('form-inner')}>
                <div className={cs('form-title')}>Loại Sản Phẩm</div>
                {formApiStatus.errorMessage && (
                    <div className={cs('error-message')}>
                        <Icons.valid className={cs('valid-icon')} /> {formApiStatus.errorMessage}
                    </div>
                )}

                <div className={cs('form-input-wrapper')}>
                    <Input
                        label="Tên loại sản phẩm"
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
                    label="Thời gian bán"
                    optionData={timeFilters}
                    selecting={{
                        currentSelectForState: formData.timeName,
                        handleSetOption,
                        setSelectionToState: setFormData,
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

export default FormType;
