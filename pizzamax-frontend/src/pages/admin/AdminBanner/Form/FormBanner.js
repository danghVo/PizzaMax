import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import styles from './FormBanner.module.scss';
import Form from '~/components/Form';
import Button from '~/components/Button';
import * as Icons from '~/components/Icons';
import { systemSelector, systemSlice, systemThunk } from '~/store/system';
import InputFile from '~/components/Input/InputFile/InputFile';

const cs = classNames.bind(styles);

function FormBanner({ handleCloseForm, dataSelected: bannerSelected }) {
    const [formData, setFormData] = useState({
        image: '',
        file: null,
    });

    const dispatch = useDispatch();
    const formApiStatus = useSelector(systemSelector.formApiStatus);

    useEffect(() => {
        if (formApiStatus.status === 'success') {
            handleCloseFormAndReset();
        }
    }, [formApiStatus.status]);

    useEffect(() => {
        if (bannerSelected) {
            setFormData({ ...formData, image: bannerSelected.image, file: bannerSelected.image });
        }
    }, [bannerSelected]);

    const handleSubmit = (formRef) => {
        if (!formData.file & !formData.image) return alert('Vui lòng nhập đầy đủ thông tin');

        const payload = {
            ...formData,
            id: bannerSelected.id,
            image: formData.file,
            file: undefined,
        };

        if (payload?.id) {
            dispatch(systemThunk.updateBanner(payload));
        } else dispatch(systemThunk.addBanner(payload));

        dispatch(systemSlice.actions.setApiStart('loading'));
        formRef.current.scrollTop = 0;
    };

    const handleCloseFormAndReset = () => {
        handleCloseForm();
        dispatch(systemSlice.actions.setApiStart(''));
    };

    return (
        <Form className={cs('form')} preventPressEnter handlesubmit={handleSubmit}>
            <div className={cs('close')} onClick={handleCloseFormAndReset}>
                <Icons.close width="3rem" height="3rem" />
            </div>
            <div className={cs('form-inner')}>
                <div className={cs('form-title')}>Banner</div>
                {formApiStatus.errorMessage && (
                    <div className={cs('error-message')}>
                        <Icons.valid className={cs('valid-icon')} /> {formApiStatus.errorMessage}
                    </div>
                )}
                <div className={cs('form-input-wrapper')}>
                    <InputFile
                        label="Hình ảnh Banner"
                        file={formData.image}
                        handleSetForm={(value) => setFormData((prev) => ({ ...prev, image: value.name, file: value }))}
                    />
                </div>
            </div>

            <Button size="small" do="submit" animation hover className={cs('submit-btn')}>
                Lưu
            </Button>
        </Form>
    );
}

export default FormBanner;
