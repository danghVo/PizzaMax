import classNames from 'classnames/bind';
import styles from './Modal.module.scss';
import ReactDOM from 'react-dom';
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';

import * as Icons from '../Icons';

const cs = classNames.bind(styles);

function Modal({ children, onClose, className, noCloseBtn, initial, animate, transition, exit }, modalRef) {
    const overlayRef = useRef();
    const closeBtnRef = useRef();
    const body = document.querySelector('body');

    useImperativeHandle(modalRef, () => ({
        closeModal,
    }));

    useEffect(() => {
        body.classList.add('hide-scroll');
    }, []);

    const wrapperClass = cs('wrapper', {
        [className]: className,
    });

    const animation = {
        initial: initial || { scale: 0.5 },
        animate: animate || { scale: 1 },
        transition: transition || { ease: 'linear', duration: 0.4 },
        exit: exit,
    };

    const handleCloseModal = (e) => {
        if (e.target == overlayRef.current) {
            e.stopPropagation();
            closeModal();
        }
    };

    const closeModal = () => {
        onClose();
        body.classList.remove('hide-scroll');
    };

    return ReactDOM.createPortal(
        <div className={cs('overlay')} ref={overlayRef} onClick={handleCloseModal}>
            <motion.div className={wrapperClass} {...animation}>
                {!noCloseBtn && (
                    <span ref={closeBtnRef} className={cs('close')} onClick={closeModal}>
                        <Icons.close />
                    </span>
                )}
                {children}
            </motion.div>
        </div>,
        document.getElementById('modal'),
    );
}

export default forwardRef(Modal);
