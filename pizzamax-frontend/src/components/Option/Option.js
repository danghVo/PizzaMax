import classNames from 'classnames/bind';
import styles from './Option.module.scss';
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const cs = classNames.bind(styles);

const emptyFunction = () => {};

function Selection(
    {
        optionData = [],
        customOptionWrapper,
        customOptionItem,
        customPosition,
        children,
        className,
        onClose = emptyFunction,
    },
    ref,
) {
    const [openOption, setOpenOption] = useState(false);
    const [isPlacementTop, setIsPlacementTop] = useState(false);

    const wrapperRef = useRef();
    const optionRef = useRef();

    useImperativeHandle(ref, () => ({
        closeOption() {
            setOpenOption(false);
        },

        openOption() {
            setOpenOption(true);
        },
    }));

    useEffect(() => {
        const distanceFromTopToOption = wrapperRef.current.getBoundingClientRect().top;

        const deviceHeight = window.innerHeight;
        const wrapperHeight = wrapperRef.current.offsetHeight;
        const distanceFromOptionToBottom = deviceHeight - distanceFromTopToOption - wrapperHeight;

        const optionListHeight = optionData.length * 34 + 16;

        setIsPlacementTop(distanceFromOptionToBottom < optionListHeight);

        document.addEventListener('mousedown', handleClickOutSide);

        return () => document.removeEventListener('mousedown', handleClickOutSide);
    });

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

    const handleCloseOption = () => {
        setOpenOption(false);
    };

    return (
        <div ref={wrapperRef} className={cs('wrapper', { [className]: className })}>
            {children}

            <div
                ref={optionRef}
                className={cs('options', {
                    placementTop: isPlacementTop && !customPosition,
                    [customOptionWrapper]: customOptionWrapper,
                    [customPosition]: customPosition,
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
                                        onClick={handleCloseOption}
                                    >
                                        {item}
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

export default forwardRef(Selection);
