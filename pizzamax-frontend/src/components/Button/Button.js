import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

import ButtonAnimation from './ButtonAnimation';
import { userSelector } from '~/store/user';
import { useDispatch, useSelector } from 'react-redux';
import { systemSlice } from '~/store/system';

const cs = classNames.bind(styles);

function Button(
    {
        children,
        header,
        link,
        href,
        type = 'text',
        theme = 'primary',
        size = 'medium',
        shadow,
        icon,
        className,
        requireLogin = false,
        hover = false,
        animation: isAnimation = false,
        customAnimation,
        handleClick = () => {},
        ...passprop
    },
    ref,
) {
    const [animation, setAnimation] = useState([]);
    const [animationEnd, setAnimationEnd] = useState(false);
    const user = useSelector(userSelector.user);
    const dispatch = useDispatch();

    const buttonRef = useRef();

    useImperativeHandle(ref, () => buttonRef.current);

    let Tag = 'button';

    const props = {
        ...passprop,
    };

    if (link) {
        Tag = Link;
        props.to = link;
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

            if (type === 'icon') {
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
    };

    const handleClickBtn = (e) => {
        if (requireLogin && !user) {
            dispatch(systemSlice.actions.requireLogin(true));
        } else handleClick(e);
        // handleClick(e);
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
            onClick={handleClickBtn}
            className={classNames}
        >
            {icon && <span className={cs('icon-content')}>{icon}</span>}
            {type === 'icon' ? (
                ''
            ) : (
                <div className={cs('content')}>
                    {header && <span className={cs('header')}>{header}</span>}
                    <div className={cs('title')}>{children}</div>
                </div>
            )}
            {isAnimation && (
                <span className={cs('animation', { [customAnimation]: customAnimation })}>
                    <AnimatePresence>{animation}</AnimatePresence>
                </span>
            )}
        </Tag>
    );
}

export default forwardRef(Button);
