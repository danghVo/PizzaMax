import classNames from 'classnames/bind';
import styles from './InputOption.module.scss';
import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import Option from '../Option';
import Button from '~/components/Button';
import * as Icons from '~/components/Icons';
import Input from '~/components/Input';

const cs = classNames.bind(styles);

function InputOption({ placeholder, optionData = [], className, selecting, rules }, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const [isArrowUp, setIsArrowUp] = useState(false);
    const [isWrapperFocus, setIsWrapperFocus] = useState(false);
    const [inputText, setInputText] = useState(selecting.currentSelectForState || '');
    const [currentSelect, setCurrentSelect] = useState(selecting.currentSelectForState || '');
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
        if (isOpen) {
            setIsArrowUp(true);
            inputRef.current.focus();
            selectionRef.current.openOption();
            setIsWrapperFocus(true);
        } else {
            setIsArrowUp(false);
            inputRef.current.focus();
            selectionRef.current.closeOption();
        }
    }, [isOpen]);

    useEffect(() => {
        let localOption = optionData;
        if ((currentSelect !== inputText || currentSelect === '') && localOption.length > 0) {
            localOption = optionData.filter((item) => item.toLowerCase().includes(inputText.toLowerCase()));
        }

        setOptionCurrent(
            localOption.map((item, index) => (
                <div
                    className={cs('inputOption-item', { active: currentSelect === item })}
                    key={index}
                    onClick={handleClickOption}
                >
                    {item}
                </div>
            )),
        );
    }, [optionData]);

    useEffect(() => {
        selecting.handleSetOption(selecting.setSelectionToState, currentSelect);
    }, [currentSelect]);

    useEffect(() => {
        setInputText(selecting.currentSelectForState);
    }, [selecting.currentSelectForState]);

    const handleOpenOption = () => {
        setIsOpen(true);
        setIsWrapperFocus(true);
    };

    const handleClickArrow = (e) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else setIsOpen(true);
    };

    const handleInput = (e) => {
        setInputText(e.target.value);

        selectionRef.current.openOption(true);
    };

    const handleBlurInput = (e) => {
        if (currentSelect) setInputText(currentSelect);
    };

    const handleClickOption = (e) => {
        setIsArrowUp(false);
        inputRef.current.focus();
        const select = e.target.innerText;

        setInputText(select);
        setCurrentSelect(select);
    };

    const closeOption = () => {
        setIsArrowUp(false);
        setIsWrapperFocus(false);
        setIsOpen(false);
    };

    const wrapperClassName = cs('inputOption-wrapper', { focus: isWrapperFocus, [className]: className });

    return (
        <Option onClose={closeOption} ref={selectionRef} optionData={optionCurrent}>
            <div ref={wrapperRef} className={wrapperClassName} onClick={handleOpenOption}>
                <Input
                    ref={inputRef}
                    value={inputText}
                    onChange={handleInput}
                    onBlur={handleBlurInput}
                    rules={rules}
                    className={cs('inputOption-input')}
                    placeholder={placeholder}
                />
                <div className={cs('inputOption-fixclick-arrow')} onClick={handleClickArrow}>
                    <Button
                        animation
                        type="icon"
                        theme="default"
                        className={cs('inputOption-arrow-wrapper')}
                        icon={<Icons.arrow className={cs('inputOption-arrow', { 'arrow-up': isArrowUp })} />}
                    />
                </div>
            </div>
        </Option>
    );
}

export default forwardRef(InputOption);
