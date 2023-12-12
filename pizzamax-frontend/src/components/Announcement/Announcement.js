import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import styles from './Announcement.module.scss';
import { systemSelector, systemSlice } from '~/store/system';
import * as Icons from '../Icons';

const cs = classNames.bind(styles);

function Announcement() {
    const [stop, setStop] = useState(false);
    const [disappear, setDisappear] = useState(true);

    const wrapperRef = useRef();
    const dispatch = useDispatch();

    const inform = useSelector(systemSelector.inform);

    const Icon = Icons[inform.type];

    useLayoutEffect(() => {
        if (!disappear) {
            const animation = setTimeout(() => {
                if (!stop) {
                    setDisappear(true);
                    dispatch(systemSlice.actions.setInform({ type: '', message: '' }));
                }
            }, 1000);

            return () => clearTimeout(animation);
        }
    }, [disappear, stop]);

    useEffect(() => {
        if (inform.message) {
            setDisappear(false);
        }
    }, [inform.message]);

    return (
        <AnimatePresence>
            {!disappear && inform.message && (
                <motion.div
                    ref={wrapperRef}
                    initial={{ x: '100px', opacity: 1 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 0, opacity: 0 }}
                    onMouseEnter={() => setStop(true)}
                    onMouseLeave={() => setStop(false)}
                    className={cs('wrapper', `${inform.type}`)}
                >
                    <Icon className={cs('icon')} width="2rem" height="2rem" />
                    <div className={cs('message')}>{inform.message}</div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Announcement;
