import classNames from 'classnames/bind';
import styles from './InputOption.module.scss';
import { useRef, useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';

import Option from '../Option';
import Button from '~/components/Button';
import * as Icons from '~/components/Icons';
import Input from '~/components/Input';

const cs = classNames.bind(styles);

function InputOption({ placeholder, label = null, optionData = [], className, selecting, rules }, ref) {
    const [isArrowUp, setIsArrowUp] = useState(false);
    const [isWrapperFocus, setIsWrapperFocus] = useState(false);
    const [inputText, setInputText] = useState(selecting.currentSelectForState || '');
    const [currentSelect, setCurrentSelect] = useState(selecting.currentSelectForState || null);
    const [optionCurrent, setOptionCurrent] = useState([]);

    const wrapperRef = useRef();
    const inputRef = useRef();

    useImperativeHandle(ref, () => ({
        clearOption() {
            setCurrentSelect('');
            setInputText('');
        },
    }));

    const selectionRef = useRef();

    useEffect(() => {
        handleSetOptionData(optionData);
    }, [optionData]);

    useEffect(() => {
        if (inputText !== selecting.currentSelectForState) {
            const searchText = new RegExp(`.*` + inputRef.current.value.toLowerCase() + '.*');
            const localOption = [];

            for (const string of optionData) {
                if (string.toLowerCase().match(searchText)) localOption.push(string);
            }

            handleSetOptionData(localOption.length > 0 ? localOption : optionData);
        }
    }, [inputText]);

    useEffect(() => {
        setInputText(selecting.currentSelectForState);
    }, [selecting.currentSelectForState]);

    const handleSetOptionData = (localOption) => {
        setOptionCurrent(
            localOption.map((item, index) => (
                <div
                    className={cs('inputOption-item', {
                        active: item === selecting.currentSelectForState,
                    })}
                    key={index}
                    onClick={() => handleClickOption(item, index)}
                >
                    {item}
                </div>
            )),
        );
    };

    const handleOpenOption = () => {
        selectionRef.current.openOption();
        setIsWrapperFocus(true);
        setIsArrowUp(true);
        inputRef.current.focus();

        handleSetOptionData(optionData);
    };

    const handleClickArrow = (e) => {
        e.stopPropagation();
        if (selectionRef.current.isOpen) {
            selectionRef.current.closeOption();
        } else {
            handleOpenOption();
        }
    };

    const handleInput = (e) => {
        setInputText(e.target.value);

        handleOpenOption();
        handleSetOptionData(optionData);
    };

    const handleBlurInput = (e) => {
        if (selecting.currentSelectForState) {
            setInputText(selecting.currentSelectForState);
        }
    };

    const handleClickOption = (item, index) => {
        setIsArrowUp(false);
        inputRef.current.focus();

        setInputText(item);
        setCurrentSelect(index);

        selecting.handleSetOption(selecting.setSelectionToState, item);
    };

    const closeOption = () => {
        setIsArrowUp(false);
        setIsWrapperFocus(false);
        selectionRef.current.closeOption();
    };

    const wrapperClassName = cs('inputOption-wrapper', { focus: isWrapperFocus, [className]: className });

    return (
        <Option
            onClose={closeOption}
            ref={selectionRef}
            customPositionTop={label && cs('custom-top-placement-top')}
            optionData={optionCurrent}
        >
            <div ref={wrapperRef} className={wrapperClassName} onClick={handleOpenOption}>
                <Input
                    label={label}
                    ref={inputRef}
                    value={inputText}
                    onChange={handleInput}
                    onBlur={handleBlurInput}
                    rules={rules}
                    arrow={
                        <Button
                            onClick={handleClickArrow}
                            animation
                            type="icon"
                            theme="default"
                            className={cs('inputOption-arrow-wrapper')}
                            icon={<Icons.arrow className={cs('inputOption-arrow', { 'arrow-up': isArrowUp })} />}
                        />
                    }
                    className={cs('inputOption-input')}
                    placeholder={placeholder}
                />
            </div>
        </Option>
    );
}

export default forwardRef(InputOption);
