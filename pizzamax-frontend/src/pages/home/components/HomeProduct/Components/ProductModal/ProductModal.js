import classNames from 'classnames/bind';
import styles from '../../HomeProduct.module.scss';
import { AnimatePresence, motion } from 'framer-motion';

import Button from '~/components/Button';
import Modal from '~/components/Modal';
import { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
const cs = classNames.bind(styles);

function ProductModal({ children, data, selection, discount, handleSelection, handleCloseModal }, ref) {
    const [warnings, setWarnings] = useState(
        data.discOptions.map(() => ({
            isWarning: false,
        })) || [],
    );

    useImperativeHandle(ref, () => ({
        checkSelectionChoosen() {
            return (
                Object.entries(selection).filter((item, index) => {
                    if (item.indexSelection === -1) {
                        setWarnings((prev) =>
                            prev.map((warning, warningIndex) =>
                                warningIndex === index ? (warning.isWarning = true && warning) : warning,
                            ),
                        );
                        return true;
                    }
                    return false;
                }).length === 0
            );
        },
    }));

    const handelSelectOption = (subOption, section, type, selectionIndex, subOptionIndex) => {
        setWarnings((prev) => {
            prev[selectionIndex].isWarning = false;
            return [...prev];
        });

        handleSelection((prev) => {
            prev[section] = {
                type,
                price: subOption.price,
                name: subOption.name,
                indexSelection: subOptionIndex,
            };

            return { ...prev };
        });
    };

    return (
        <Modal className={cs('modal-wrapper')} onClose={handleCloseModal}>
            {discount && <div className={cs('modal-saleOff')}>-{discount}% OFF</div>}

            <div className={cs('modal-img-wrapper')}>
                <img src={data.image} className={cs('modal-img')} alt={data.name} />
                <div className={cs('modal-img-infor')}>
                    <h1 className={cs('modal-img-title')}>{data.name}</h1>
                    <p className={cs('modal-img-desc')}>{data.description}</p>
                </div>
            </div>

            <div className={cs('modal-disc-actions-wrapper')}>
                <div className={cs('modal-disc-wrapper')}>
                    <div className={cs('modal-disc-inner')}>
                        {data.discOptions.map((item, index) => {
                            return (
                                <div key={index} className={cs('modal-disc-item')}>
                                    <div
                                        className={cs('disc-item-header', {
                                            warning: warnings[index].isWarning,
                                        })}
                                    >
                                        <div className={cs('disc-item-title')}>{item.name}</div>
                                        <div
                                            className={cs('disc-item-status', {
                                                selected: selection[item.name].indexSelection !== -1,
                                            })}
                                        >
                                            {selection[item.name].indexSelection !== -1 ? 'Selected' : 'Required'}
                                        </div>
                                    </div>
                                    <div className={cs('disc-item-options')}>
                                        {item.subOptions.map((subOption, subOptionIndex) => (
                                            <div
                                                onClick={() =>
                                                    handelSelectOption(
                                                        subOption,
                                                        item.name,
                                                        item.type,
                                                        index,
                                                        subOptionIndex,
                                                    )
                                                }
                                                key={subOptionIndex}
                                                className={cs('disc-item-selection')}
                                            >
                                                <Button
                                                    animation
                                                    type="icon"
                                                    className={cs('disc-item-btn')}
                                                    icon={
                                                        <AnimatePresence>
                                                            <motion.div className={cs('disc-item-icon-outline')}>
                                                                {selection[item.name].indexSelection ==
                                                                    subOptionIndex && (
                                                                    <motion.div
                                                                        key={subOptionIndex}
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 0.8 }}
                                                                        exit={{ scale: 0 }}
                                                                        className={cs('disc-item-icon-inner')}
                                                                    ></motion.div>
                                                                )}
                                                            </motion.div>
                                                        </AnimatePresence>
                                                    }
                                                    theme="outline"
                                                />
                                                <div className={cs('disc-item-name')}>
                                                    {`${subOption.name} ${subOption.signature ? '(Signature)' : ''}`}
                                                </div>
                                                <div className={cs('disc-item-price')}>
                                                    {subOption.price !== 0
                                                        ? subOption.price.toLocaleString('vi-VN', {
                                                              style: 'currency',
                                                              currency: 'VND',
                                                          })
                                                        : ''}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {children}
            </div>
        </Modal>
    );
}

export default forwardRef(ProductModal);
