import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { hookDebounce } from '~/hooks';
import useDebounce from '~/hooks/useDebounce';
import ButtonAnimation from './ButtonAnimation';
import { h } from 'vue';

const cs = classNames.bind(styles);

function Button({
    children,
    header,
    to,
    href,
    type = 'text',
    theme = 'primary',
    size = 'medium',
    shadow,
    icon,
    className,
    hover = false,
    animation: isAnimation = false,
    handleClick = () => {},
    ...passprop
}) {
    const [animation, setAnimation] = useState([]);
    const [animationEnd, setAnimationEnd] = useState(false);
    const [hold, setHold] = useState(false);

    const buttonRef = useRef();

    let Tag = 'button';

    const props = {
        ...passprop,
    };

    if (to) {
        Tag = 'link';
        props.to = to;
    }

    if (href) {
        Tag = 'a';
        props.href = href;
    }

    const classNames = cs('wrapper', {
        [type]: type,
        [theme]: theme,
        [className]: className,
        [size]: size,
        shadow,
        hover: hover,
    });

    useEffect(() => {
        if (animationEnd) {
            const handleAnimation = setTimeout(() => setAnimation([]), 1000);
            return () => clearTimeout(handleAnimation);
        }
    }, [animationEnd]);

    const handleMouseDown = (e) => {
        if (isAnimation) {
            const rect = buttonRef.current.getBoundingClientRect();

            let x = `${e.clientX - rect.left}px`;
            let y = `${e.clientY - rect.top}px`;
            let width = buttonRef.current.clientWidth * 2;
            let height = buttonRef.current.clientWidth * 2;

            if (type==='icon') {
                x = '50%';
                y = '50%';
                width = '100%';
                height = '100%';
            }
            setAnimationEnd(false);
            setAnimation((prev) => {
                return [
                    ...prev,
                    <ButtonAnimation key={prev.length} index={prev.length} x={x} y={y} width={width} height={height} />,
                ];
            });
        }
    };

    const handleMouseUp = (e) => {
        setAnimationEnd(true);
        handleClick();
    };

    const handleMouseLeave = () => {
        setAnimationEnd(true);
    };

    return (
        <Tag
            {...props}
            ref={buttonRef}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            className={classNames}
        >
            {icon && <span className={cs('icon-content')}>{icon}</span>}
            {type==='icon' ? (
                ''
            ) : (
                <span className={cs('content')}>
                    {header && <span className={cs('header')}>{header}</span>}
                    <span className={cs('title')}>{children}</span>
                </span>
            )}
            {isAnimation && (
                <span className={cs('animation')}>
                    <AnimatePresence>{animation}</AnimatePresence>
                </span>
            )}
        </Tag>
    );
}

export default Button;
