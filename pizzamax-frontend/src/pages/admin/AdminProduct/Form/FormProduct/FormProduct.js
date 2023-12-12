import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import styles from '../Form.module.scss';
import Form from '~/components/Form';
import Input from '~/components/Input';
import Button from '~/components/Button';
import Radio from '~/components/Radio/Radio';
import DiscOption from '../components/DiscOption';
import { productThunk, productsSelector, productsSlice } from '~/store/products';
import { InputOption } from '~/components/Option';
import * as Icons from '~/components/Icons';
import { required } from '~/rules';
import InputFile from '~/components/Input/InputFile';

const cs = classNames.bind(styles);

function FormProduct({ handleCloseForm, dataSelected: productSelected }) {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        price: 0,
        description: '',
        image: '',
        file: null,
        discount: '',
        signature: false,
        discOptions: {},
    });

    const dispatch = useDispatch();
    const formApiStatus = useSelector(productsSelector.formApiStatus);
    const allTypes = useSelector(productsSelector.rawTypes);
    const allDiscounts = useSelector(productsSelector.rawDiscounts);

    useEffect(() => {
        if (formApiStatus.status === 'success') {
            handleCloseForm();
            dispatch(productsSlice.actions.setApiStart(''));
        }
    }, [formApiStatus.status]);

    useEffect(() => {
        if (productSelected) {
            Object.keys(formData).forEach((key) => {
                if (key === 'discount') {
                    if (productSelected.discountId) {
                        formData[key] =
                            productSelected.Discount.saleOff + '% - ' + productSelected.Discount.startAt.split(' ')[0];
                    }
                } else if (key === 'discOptions' && productSelected[key].length > 0) {
                    formData[key] = {};
                    const types = productSelected[key].map((item) => {
                        formData.discOptions = {
                            ...formData.discOptions,
                            [item.type]: [],
                        };
                        return item.type;
                    });

                    types.forEach((type) => {
                        const typesOption = productSelected[key].filter((itemProduct) => itemProduct.type === type);

                        typesOption.forEach((option) => {
                            option.subOptions.forEach((subOption) => {
                                formData.discOptions[type].push({
                                    name: subOption.name,
                                    price: subOption.price,
                                    signature: subOption.signature,
                                    section: option.name,
                                });
                            });
                        });
                    });
                } else formData[key] = productSelected[key];
            });

            setFormData({ ...formData });
        }
    }, [productSelected]);

    const handleSetOption = (setSelectionToState, currentSelectForState) => {
        setSelectionToState(currentSelectForState);
    };

    const handleFocusPrice = (e) => {
        const inputEle = e.target;

        inputEle.value = formData.price;
    };

    const handleBlurPrice = (e) => {
        const inputEle = e.target;

        inputEle.value = parseInt(inputEle.value).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    };

    const handleSubmit = (formRef) => {
        if (!formData.file && !formData.image) return alert('Vui lòng nhập đầy đủ thông tin');

        const payload = {
            ...formData,
            ...formData.discOptions,
            id: productSelected.id,
            image: formData.file,
            discOptions: undefined,
            img: undefined,
            file: undefined,
            discountId: allDiscounts.find(
                (discount) => formData.discount === discount.saleOff + ' - ' + discount.startDay,
            )?.id,
        };

        if (payload?.id) {
            dispatch(productThunk.updateProduct(payload));
        } else dispatch(productThunk.addProduct(payload));

        dispatch(productsSlice.actions.setApiStart('loading'));
        formRef.current.scrollTop = 0;
    };

    return (
        <Form className={cs('form')} preventPressEnter handlesubmit={handleSubmit}>
            <div className={cs('close')} onClick={handleCloseForm}>
                <Icons.close width="3rem" height="3rem" />
            </div>
            <div className={cs('form-inner')}>
                <div className={cs('form-title')}>Sản Phẩm</div>
                {formApiStatus.errorMessage && (
                    <div className={cs('error-message')}>
                        <Icons.valid className={cs('valid-icon')} /> {formApiStatus.errorMessage}
                    </div>
                )}
                <div className={cs('form-input-wrapper')}>
                    <Input
                        label="Tên sản phẩm"
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
                    label="Loại sản phẩm"
                    optionData={allTypes.map((type) => type.name)}
                    selecting={{
                        currentSelectForState: formData.type,
                        handleSetOption,
                        setSelectionToState: (value) => setFormData((prev) => ({ ...prev, type: value })),
                    }}
                    rules={[required]}
                    className={cs('form-input-option')}
                />

                <InputOption
                    label="Giảm giá"
                    optionData={allDiscounts.map((discount) => discount.saleOff + ' - ' + discount.startDay)}
                    selecting={{
                        currentSelectForState: formData.discount,
                        handleSetOption,
                        setSelectionToState: (value) => setFormData((prev) => ({ ...prev, discount: value })),
                    }}
                    rules={[]}
                    className={cs('form-input-option')}
                />

                <div className={cs('form-input-wrapper')}>
                    <Input
                        label="Giá sản phẩm"
                        value={formData.price.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                        })}
                        rules={[required]}
                        onFocus={handleFocusPrice}
                        onBlur={handleBlurPrice}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                price: e.target.value,
                            }))
                        }
                        className={cs('form-input')}
                    />
                </div>

                <div className={cs('form-input-wrapper')}>
                    <Input
                        label="Mô tả sản phẩm"
                        value={formData.description}
                        textArea
                        rules={[]}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                        className={cs('form-input', 'long-text')}
                    />
                </div>

                <InputFile
                    label="Hình ảnh sản phẩm"
                    file={formData.image}
                    handleSetForm={(value) => setFormData((prev) => ({ ...prev, image: value.name, file: value }))}
                />
                <div className={cs('form-input-wrapper')}>
                    <Radio
                        title="Signature"
                        name="Signature"
                        selections={[
                            { label: 'Có', value: 1 },
                            { label: 'Không', value: 0 },
                        ]}
                        selected={formData.signature}
                        handleSelected={(value) => {
                            setFormData((prev) => ({ ...prev, signature: !!value }));
                        }}
                    />
                </div>
                <div className={cs('form-input-wrapper')}>
                    <DiscOption formData={formData} handleSetFormData={setFormData} />
                </div>
            </div>

            <Button size="small" do="submit" animation hover className={cs('submit-btn')}>
                Lưu
            </Button>
        </Form>
    );
}

export default FormProduct;
