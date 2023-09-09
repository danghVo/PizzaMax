import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from './Button.module.scss';

const cs = classNames.bind(styles);

function ButtonAnimation({ x, y, width, height }) {
    const [leave, setLeave] = useState(false);
    const [tap, setTap] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            if (!tap) setLeave(true);
        }, 300);
    });

    const handleAnimationEnd = () => {
        setTap(false);
    };

    return (
        <div className={cs('animate-wrapper')} onMouseUp={handleAnimationEnd}>
            <span
                className={cs('animate-overlay', { 'animation-end': leave })}
                style={{
                    borderRadius: '100%',
                    top: y,
                    left: x,
                    width,
                    height,
                }}
            ></span>
        </div>
    );
}

export default ButtonAnimation;
