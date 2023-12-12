/* eslint-disable react/jsx-pascal-case */
import classNames from 'classnames/bind';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '~/components/Button';
import styles from './SubOption.module.scss';
import * as Icons from '~/components/Icons';

const cs = classNames.bind(styles);

function SubOptions({ data, selection = {}, handleSelectOption, isWarning, open, handleOpen }) {
    const handleClickItem = function (e) {
        const btn = e.currentTarget.querySelector('button');
        btn.click();
    };

    return (
        <div className={cs('disc-item')} onClick={handleOpen}>
            <div
                className={cs('disc-item-header', {
                    warning: isWarning,
                })}
            >
                <div className={cs('disc-item-title')}>{data.name}</div>
                <div className="flex">
                    <div
                        className={cs('disc-item-status', {
                            selected: selection?.indexSelection !== -1,
                        })}
                    >
                        {selection?.indexSelection !== -1 ? 'Selected' : 'Required'}
                    </div>
                    <Icons.arrow
                        fill="rgb(233, 236, 239)"
                        className={cs('arrow-icon', {
                            up: !open,
                        })}
                    />
                </div>
            </div>
            <AnimatePresence>
                {open && (
                    <motion.div
                        className={cs('disc-item-options')}
                        initial={{ height: 0 }}
                        animate={{ height: 'fit-content' }}
                        exit={{ height: 0 }}
                        // transition={{ duration: 2, ease: 'linear' }}
                    >
                        {data.subOptions.map((subOption, subOptionIndex) => (
                            <div
                                onClick={handleClickItem}
                                key={subOptionIndex}
                                className={cs('disc-item-selection', {
                                    selected: selection.indexSelection === subOptionIndex,
                                })}
                            >
                                <Button
                                    animation
                                    type="icon"
                                    data-index={`btn-selection-${subOptionIndex}`}
                                    className={cs('disc-item-btn')}
                                    handleClick={() =>
                                        handleSelectOption(subOption.name, subOptionIndex, subOption.price)
                                    }
                                    icon={
                                        <AnimatePresence>
                                            <motion.div className={cs('disc-item-icon-outline')}>
                                                {selection.indexSelection === subOptionIndex && (
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SubOptions;
