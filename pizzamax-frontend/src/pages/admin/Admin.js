import classNames from 'classnames/bind';
import { AnimatePresence, motion } from 'framer-motion';

import styles from './Admin.module.scss';
import Image from '~/components/Image';
import img from '~/assets/images';
import { useOutlet } from 'react-router';
import { useEffect } from 'react';
import { IOService } from '~/services';
import { useDispatch } from 'react-redux';
const cs = classNames.bind(styles);

function Admin() {
    const dispatch = useDispatch();

    useEffect(() => {
        // use my socket
        const socket = IOService.start();
        socket.orderInform(dispatch);
    });

    const Outlet = useOutlet();
    return Outlet ? (
        Outlet
    ) : (
        <div className={cs('wrapper')}>
            <motion.div
                className={cs('logo-wrapper')}
                initial={{ scale: 0 }}
                animate={{ scale: [1.2, 1.5, 1] }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 1 }}
            >
                <Image src={img.logo} className={cs('logo')} />
            </motion.div>
        </div>
    );
}

export default Admin;
