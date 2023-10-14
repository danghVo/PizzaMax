import classNames from 'classnames/bind';
import styles from './Modal.module.scss';
import ReactDOM from 'react-dom';
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';

import * as Icons from '../Icons';

const cs = classNames.bind(styles);

function Modal({ children, onClose, className, noCloseBtn, initial, animate, transition, exit }) {
    const overlayRef = useRef();
    const closeBtnRef = useRef();
    const body = document.querySelector('body');

    useEffect(() => {
        body.classList.add('hide-scroll');

        return () => body.classList.remove('hide-scroll');
    }, []);

    const wrapperClass = cs('wrapper', {
        [className]: className,
    });

    const animation = {
        initial: initial || { scale: 0.6, opacity: 0.5 },
        animate: animate || { scale: 1, opacity: 1 },
        transition: transition || { ease: 'linear', type: 'spring', duration: 1 },
        exit: exit,
    };

    const handleCloseModal = (e) => {
        if (e.target === overlayRef.current) {
            e.stopPropagation();
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <div className={cs('overlay')} ref={overlayRef} onMouseDown={handleCloseModal}>
            <motion.div className={wrapperClass} {...animation}>
                {!noCloseBtn && (
                    <span ref={closeBtnRef} className={cs('close')} onClick={onClose}>
                        <Icons.close />
                    </span>
                )}
                {children}
            </motion.div>
        </div>,
        document.getElementById('modal'),
    );
}

export default Modal;
