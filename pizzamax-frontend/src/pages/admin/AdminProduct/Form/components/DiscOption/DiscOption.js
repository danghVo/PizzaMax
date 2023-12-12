import classNames from 'classnames/bind';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import Input from '~/components/Input';
import styles from './DiscOption.module.scss';
import { required } from '~/rules';
import Radio from '~/components/Radio/Radio';
import * as Icons from '~/components/Icons';
import ConfirmDeleteModal from '~/components/Modal/ConfirmDeleteModal';

const cs = classNames.bind(styles);

function DiscOption({ formData, handleSetFormData }) {
    const [openSubs, setOpenSubs] = useState(Object.keys(formData.discOptions).map(() => false));
    const [warningAnimation, setWarningAnimation] = useState(false);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState({
        open: false,
        onYes: null,
    });
    const [addType, setAddType] = useState({
        avail: ['size', 'crust', 'flavor', 'drink'].filter(
            (item) => formData && typeof formData.discOptions[item] === 'undefined',
        ),
        isAddType: false,
        isOpenOption: false,
        selectType: '',
        openLast: false,
    });

    const newOptionForm = useMemo(
        () => ({
            name: '',
            section: '',
            price: 0,
            signature: false,
            focus: true,
        }),
        [],
    );

    useEffect(() => {
        setAddType((prev) => ({
            avail: ['size', 'crust', 'flavor', 'drink'].filter(
                (item) => formData && typeof formData.discOptions[item] === 'undefined',
            ),
            isAddType: false,
            isOpenOption: false,
            selectType: '',
            openLast: false,
        }));
    }, [formData]);

    const handleFocusPrice = (e, price) => {
        const inputEle = e.target;

        inputEle.value = price;
    };

    const handleBlurPrice = (e) => {
        const inputEle = e.target;

        inputEle.value = parseInt(inputEle.value).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    };

    const handleInputPrice = (e, type, subOptionIndex) => {
        handleInput(e.target.value, type, subOptionIndex, 'price');
    };

    const handleSelectSubOption = (type, subOptionIndex, value) => {
        handleSetFormData((prev) => {
            prev.discOptions[type][subOptionIndex].signature = !!value;

            return { ...prev };
        });
    };

    const handleInput = (value, type, subOptionIndex, inputKey) => {
        handleSetFormData((prev) => {
            prev.discOptions[type][subOptionIndex][inputKey] = value;
            prev.discOptions[type][subOptionIndex].focus = false;

            return { ...prev };
        });
    };

    const handleInputSection = (e, type, subOptionIndex) => {
        handleInput(e.target.value, type, subOptionIndex, 'section');
    };

    const handleInputName = (e, type, subOptionIndex) => {
        handleInput(e.target.value, type, subOptionIndex, 'name');
    };

    const hanldeDeleteType = (type) => {
        handleSetFormData((prev) => {
            delete prev.discOptions[type];

            return {
                ...prev,
            };
        });
    };

    const handleDeleteOption = (type, subOptionIndex) => {
        handleSetFormData((prev) => {
            prev.discOptions[type] = prev.discOptions[type].filter((item, index) => index !== subOptionIndex);
            if (prev.discOptions[type].length === 0) {
                delete prev.discOptions[type];
            }

            return { ...prev };
        });
    };

    const handleAddOption = (type, index) => {
        handleSetFormData((prev) => {
            prev.discOptions[type].push({
                ...newOptionForm,
                section: `Choose Your ${type.charAt(0).toUpperCase() + type.substring(1)}`,
            });

            return { ...prev };
        });

        setOpenSubs((prev) => {
            prev[index] = true;
            return [...prev];
        });
    };

    const handleRequireInput = (e, subOption, subOptionIndex) => {
        const check = Object.keys(subOption).filter((value) => subOption[value] === '');

        if (check.length > 0) {
            e.target.focus();
            e.target.classList.add(cs('require'));
            setWarningAnimation(subOptionIndex);
        }
    };

    const handleAddNewType = () => {
        setOpenSubs((prev) => prev.map(() => false));
        setAddType((prev) => ({ ...prev, isAddType: true, isOpenOption: true }));
    };

    const handleSelectNewType = (selected) => {
        setAddType((prev) => ({ ...prev, selectType: selected, isOpenOption: false }));
    };

    const hanldeBlurAddType = (e) => {
        if (!addType.isOpenOption) {
            setAddType((prev) => ({ ...prev, isOpenOption: false }));
        }
    };

    const handleConfirmAddType = () => {
        handleSetFormData((prev) => {
            const type = addType.selectType;
            const discOptions = JSON.parse(JSON.stringify(prev.discOptions));

            discOptions[type] = [
                {
                    ...newOptionForm,
                    section: `Choose Your ${type.charAt(0).toUpperCase() + type.substring(1)}`,
                },
            ];

            return { ...prev, discOptions };
        });
        setAddType((prev) => ({ ...prev, isAddType: false }));
    };

    return (
        <div
            className={cs('wrapper', {
                'margin-bottom-add-type': addType.isAddType,
            })}
        >
            <div className={cs('disc-option-header')}>
                Disc Option
                {addType.avail.length > 0 && (
                    <Tippy content="Thêm loại lựa chọn" placement="bottom" interactive>
                        <span onClick={handleAddNewType}>
                            <Icons.plus width="2.4rem" height="2.4rem" fill="black" />
                        </span>
                    </Tippy>
                )}
            </div>

            {Object.keys(formData.discOptions).map((type, index) => (
                <div className={cs('disc-option-wrapper')} key={index}>
                    <div className={cs('disc-title')}>
                        <span
                            className={cs('type')}
                            onClick={() =>
                                setOpenSubs((prev) => {
                                    prev[index] = !prev[index];
                                    return [...prev];
                                })
                            }
                        >
                            {type}
                            {formData.discOptions[type].length > 1 && (
                                <span className={cs('arrow')}>
                                    <Icons.arrow
                                        width="2rem"
                                        height="2rem"
                                        fill="black"
                                        className={cs('icon', {
                                            down: openSubs[index],
                                        })}
                                    />
                                </span>
                            )}
                        </span>

                        <div className={cs('action-icons')}>
                            <Tippy content="Thêm lựa chọn" placement="bottom" interactive>
                                <div
                                    className={cs('sub-option-delete-icon')}
                                    onClick={() => handleAddOption(type, index)}
                                >
                                    <Icons.plus width="2rem" height="2rem" fill="black" />
                                </div>
                            </Tippy>
                            <Tippy content="Xóa loại lựa chọn" placement="bottom" interactive>
                                <div
                                    className={cs('sub-option-delete-icon')}
                                    onClick={() => {
                                        setConfirmDeleteModal({
                                            open: true,
                                            onYes: () => hanldeDeleteType(type),
                                        });
                                    }}
                                >
                                    <Icons.close width="2rem" height="2rem" fill="black" />
                                </div>
                            </Tippy>
                        </div>
                    </div>
                    <AnimatePresence>
                        {(openSubs[index] || formData.discOptions[type].length <= 1) && (
                            <motion.div
                                initial={{ height: 0, top: 0 }}
                                animate={{ height: 'fit-content', top: 0 }}
                                exit={{ height: 0, top: 0 }}
                                className={cs('disc-selection')}
                            >
                                {formData.discOptions[type].map((subOption, subOptionIndex) => (
                                    <div
                                        key={subOptionIndex}
                                        onBlur={(e) => handleRequireInput(e, subOption, subOptionIndex)}
                                        onChange={(e) => {
                                            const ele = e.target;
                                            if (ele.classList.contains(cs('require')))
                                                ele.classList.remove(cs('require'));
                                        }}
                                        className={cs('sub-option-wrapper', {
                                            warningAnimation: warningAnimation === subOptionIndex,
                                        })}
                                    >
                                        <div className={cs('sub-option-section')}>
                                            <Input
                                                value={subOption.section}
                                                rules={[required]}
                                                onChange={(e) => handleInputSection(e, type, subOptionIndex)}
                                                className={cs('sub-option-input')}
                                            />

                                            <Tippy content="Xóa lựa chọn" placement="bottom" interactive>
                                                <div
                                                    className={cs('sub-option-delete-icon')}
                                                    onClick={() =>
                                                        setConfirmDeleteModal({
                                                            open: true,
                                                            onYes: () => handleDeleteOption(type, subOptionIndex),
                                                        })
                                                    }
                                                >
                                                    <Icons.close width="2rem" height="2rem" />
                                                </div>
                                            </Tippy>
                                        </div>
                                        <div className={cs('sub-option-header')}>
                                            <div className={cs('sub-option-name')}>
                                                <Input
                                                    value={subOption.name}
                                                    rules={[required]}
                                                    autoFocus={subOption?.focus}
                                                    onChange={(e) => handleInputName(e, type, subOptionIndex)}
                                                    className={cs('sub-option-input')}
                                                />
                                            </div>
                                            <div className={cs('sub-option-price')}>
                                                <Input
                                                    value={subOption.price.toLocaleString('vi-VN', {
                                                        style: 'currency',
                                                        currency: 'VND',
                                                    })}
                                                    rules={[required]}
                                                    onFocus={(e) =>
                                                        handleFocusPrice(e, subOption.price, type, subOptionIndex)
                                                    }
                                                    onBlur={handleBlurPrice}
                                                    onChange={(e) => handleInputPrice(e, type, subOptionIndex)}
                                                    className={cs('sub-option-input-price')}
                                                />
                                            </div>
                                        </div>
                                        <Radio
                                            className={cs('sub-option-signature')}
                                            title="Signature"
                                            name={'Signature-' + index + subOptionIndex}
                                            selections={[
                                                { label: 'Có', value: 1 },
                                                { label: 'Không', value: 0 },
                                            ]}
                                            selected={subOption.signature}
                                            handleSelected={(value) =>
                                                handleSelectSubOption(type, subOptionIndex, value)
                                            }
                                        />
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
            {addType.isAddType && (
                <div className={cs('disc-option-wrapper')}>
                    <div className={cs('input-option-add-type')} onBlur={hanldeBlurAddType}>
                        <input
                            className={cs('input')}
                            autoFocus
                            onFocus={() => setAddType((prev) => ({ ...prev, isOpenOption: true }))}
                            value={addType.selectType}
                            onChange={() => {}}
                        />
                        <motion.div className={cs('options')}>
                            {addType.isOpenOption &&
                                addType.avail.map((item, index) => (
                                    <div
                                        className={cs('options-item', {
                                            selected: addType.selectType === item,
                                        })}
                                        onClick={() => handleSelectNewType(item)}
                                        key={index}
                                    >
                                        {item}
                                    </div>
                                ))}
                        </motion.div>
                        <div className={cs('arrow')}>
                            <Icons.arrow width="2rem" height="2rem" fill="black" className={cs('icon')} />
                        </div>
                    </div>
                    <Tippy content="Xác nhận" placement="bottom" interactive>
                        <div className={cs('confirm')} onClick={handleConfirmAddType}>
                            <Icons.check className={cs('icon')} />
                        </div>
                    </Tippy>
                </div>
            )}

            {confirmDeleteModal.open && (
                <ConfirmDeleteModal
                    onYes={confirmDeleteModal.onYes}
                    handleCloseModal={() => setConfirmDeleteModal((prev) => ({ ...prev, open: false }))}
                />
            )}
        </div>
    );
}

export default DiscOption;
