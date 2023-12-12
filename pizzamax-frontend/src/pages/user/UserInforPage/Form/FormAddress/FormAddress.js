import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

import styles from './FormAddress.module.scss';
import Form from '~/components/Form';
import Input from '~/components/Input';
import Button from '~/components/Button';
import { InputOption } from '~/components/Option';
import * as Icons from '~/components/Icons';
import { required } from '~/rules';
import { districtService } from '~/services';
import { addressSelector, addressSlice, addressThunk } from '~/store/address';
import { userSelector, userSlice, userThunk } from '~/store/user';

const cs = classNames.bind(styles);

function FormAddress({ user, handleCloseForm, dataSelected: addressSelected }) {
    const [formData, setFormData] = useState({
        street: '',
        alley: '',
        district: '',
        houseNumber: '',
        ward: '',
        city: '',
    });
    const [districtOption, setDistrictOption] = useState([]);
    const fistRender = useRef(true);

    const dispatch = useDispatch();
    const formApiStatus = useSelector(userSelector.apiStatus);

    useEffect(() => {
        if (formApiStatus.status === 'success') {
            handleCloseForm();
            dispatch(userSlice.actions.renewApiStatus(''));
        }
    }, [formApiStatus.status]);

    useEffect(() => {
        if (addressSelected) {
            Object.keys(formData).forEach((key) => {
                formData[key] = addressSelected[key] || '';
            });

            setFormData({ ...formData });
        }
    }, [addressSelected]);

    useEffect(() => {
        if (formData.city) getDistrictOfCity(formData.city);
    }, [formData.city]);

    const handleSetOption = (setSelectionToState, currentSelectForState) => {
        setSelectionToState(currentSelectForState);
    };

    const getDistrictOfCity = async (selection) => {
        const districts = await districtService.getDistricts(selection);

        setDistrictOption(districts || []);

        if (!fistRender.current) {
            setFormData((prev) => ({ ...prev, district: '' }));
        }
    };

    const handleSubmit = (formRef) => {
        dispatch(userThunk.updateUserAddress({ ...formData, uuid: user.uuid, addressId: addressSelected.id }));
        formRef.current.scrollTop = 0;
    };

    return (
        <Form className={cs('form')} preventPressEnter handlesubmit={handleSubmit}>
            <div className={cs('close')} onClick={handleCloseForm}>
                <Icons.close width="3rem" height="3rem" />
            </div>
            <div className={cs('form-inner')}>
                <div className={cs('form-title')}>Địa chỉ </div>
                {formApiStatus.message && (
                    <div className={cs('error-message')}>
                        <Icons.valid className={cs('valid-icon')} /> {formApiStatus.message}
                    </div>
                )}
                <div className={cs('form-row')}>
                    <div className={cs('form-input-wrapper')}>
                        <Input
                            label="Số nhà"
                            value={formData.houseNumber}
                            rules={[required]}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    houseNumber: e.target.value,
                                }))
                            }
                            className={cs('form-input')}
                        />
                    </div>
                    <div className={cs('form-input-wrapper')}>
                        <Input
                            label="Đường"
                            value={formData.street}
                            rules={[required]}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    street: e.target.value,
                                }))
                            }
                            className={cs('form-input')}
                        />
                    </div>
                </div>
                <div className={cs('form-row')}>
                    <div className={cs('form-input-wrapper')}>
                        <Input
                            label="Hẻm"
                            value={formData.alley}
                            rules={[]}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    alley: e.target.value,
                                }))
                            }
                            className={cs('form-input')}
                        />
                    </div>
                    <div className={cs('form-input-wrapper')}>
                        <Input
                            label="Phường"
                            value={formData.ward}
                            rules={[]}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    ward: e.target.value,
                                }))
                            }
                            className={cs('form-input')}
                        />
                    </div>
                </div>
                <div className={cs('form-row')}>
                    <InputOption
                        label="Thành phố"
                        optionData={['Cần Thơ', 'Hồ Chí Minh']}
                        selecting={{
                            currentSelectForState: formData.city,
                            handleSetOption,
                            setSelectionToState: (value) => {
                                setFormData((prev) => ({ ...prev, city: value }));
                            },
                        }}
                        rules={[required]}
                        className={cs('form-input-option')}
                    />
                    <InputOption
                        label="Quận"
                        optionData={districtOption}
                        selecting={{
                            currentSelectForState: formData.district,
                            handleSetOption,
                            setSelectionToState: (value) => {
                                setFormData((prev) => ({ ...prev, district: value }));
                                fistRender.current = false;
                            },
                        }}
                        rules={[required]}
                        className={cs('form-input-option')}
                    />
                </div>
            </div>

            <Button size="small" do="submit" animation hover className={cs('submit-btn')}>
                Lưu
            </Button>
        </Form>
    );
}

export default FormAddress;
