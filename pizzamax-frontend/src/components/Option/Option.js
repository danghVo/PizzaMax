import classNames from 'classnames/bind';
import styles from './Option.module.scss';
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const cs = classNames.bind(styles);

const emptyFunction = () => {};

function Option(
    {
        optionData = [],
        customOptionWrapper,
        customOptionItem,
        customPositionTop,
        customPositionBottom,
        children,
        className,
        onClose = emptyFunction,
        handleChooseOption = emptyFunction,
    },
    ref,
) {
    const [openOption, setOpenOption] = useState(false);
    const [isPlacementTop, setIsPlacementTop] = useState(false);

    const wrapperRef = useRef();
    const optionRef = useRef();

    useImperativeHandle(ref, () => ({
        isOpen: openOption,
        closeOption() {
            setOpenOption(false);
        },

        openOption() {
            setOpenOption(true);
        },
    }));

    useEffect(() => {
        if (openOption) {
            const distanceFromTopToOption = wrapperRef.current.getBoundingClientRect().top;

            const deviceHeight = window.innerHeight;
            const wrapperHeight = wrapperRef.current.offsetHeight;
            const distanceFromOptionToBottom = deviceHeight - distanceFromTopToOption - wrapperHeight;

            const optionListHeight = optionRef.current.offsetHeight;

            setIsPlacementTop(distanceFromOptionToBottom < optionListHeight);

            document.addEventListener('mousedown', handleClickOutSide);

            return () => document.removeEventListener('mousedown', handleClickOutSide);
        }
    }, [openOption]);

    const handleClickOutSide = (e) => {
        const selectZone = wrapperRef.current.getBoundingClientRect();
        const optionZone = optionRef.current.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (x < selectZone.left || x > selectZone.right || y > selectZone.bottom || y < selectZone.top)
            if (openOption) {
                if (x < optionZone.left || x > optionZone.right || y > optionZone.bottom || y < optionZone.top) {
                    setOpenOption(false);
                    onClose();
                }
            } else {
                setOpenOption(false);
                onClose();
            }
    };

    const handleClickOption = (item) => {
        handleChooseOption(item);
        setOpenOption(false);
    };

    return (
        <div ref={wrapperRef} className={cs('wrapper', { [className]: className })}>
            {children}

            <div
                ref={optionRef}
                className={cs('options', {
                    placementTop: isPlacementTop && !customPositionTop,
                    placementBottom: !isPlacementTop && !customPositionBottom,
                    [customOptionWrapper]: customOptionWrapper,
                    [customPositionTop]: isPlacementTop && customPositionTop,
                    [customPositionBottom]: !isPlacementTop && customPositionBottom,
                })}
            >
                {openOption && (
                    <div className={cs('scrollbar')}>
                        {optionData.length > 0 ? (
                            optionData.map((item, index) => {
                                return (
                                    <span
                                        key={index}
                                        className={cs('options-item', { [customOptionItem]: customOptionItem })}
                                        onClick={() => handleClickOption(item)}
                                    >
                                        <span className={cs('options-item-content')}>{item}</span>
                                    </span>
                                );
                            })
                        ) : (
                            <div className={cs('options-item', 'no-value')}>No options</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default forwardRef(Option);
