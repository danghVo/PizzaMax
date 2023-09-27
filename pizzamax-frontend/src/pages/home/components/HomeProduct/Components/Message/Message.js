import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import classNames from 'classnames/bind';

import styles from '../../HomeProduct.module.scss';
import * as Icons from '~/components/Icons';
import Button from '~/components/Button';

const cs = classNames.bind({ styles });

function Message({ message, setMessage }) {
    const [mouseIn, setMouseIn] = useState(false);

    useEffect(() => {
        if (message) {
            const intervalCheck = setInterval(() => {
                if (!mouseIn) {
                    setMessage(false);
                }
            }, 1000);

            return () => clearInterval(intervalCheck);
        }
    }, [message, mouseIn]);

    const handleMouseLeave = () => {
        setMouseIn(false);
        setMessage(false);
    };

    const handleMouseIn = () => {
        setMouseIn(true);
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {message && (
                <motion.div
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseIn}
                    initial={{ opacity: 0, scale: 0.8, x: '-50%' }}
                    animate={{ opacity: 1, scale: 1, x: '-50%' }}
                    exit={{ opacity: 0, scale: 0.8, x: '-50%' }}
                    className={cs('message-wrapper')}
                >
                    <Button className={cs('message-btn')} icon={<Icons.checkBuy className={cs('message-icon')} />}>
                        Item added to the cart
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>,
        document.getElementById('modal'),
    );
}

export default Message;
