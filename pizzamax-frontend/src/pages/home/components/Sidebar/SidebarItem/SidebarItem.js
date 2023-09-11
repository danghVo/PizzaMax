import classNames from 'classnames/bind';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import styles from '../Sidebar.module.scss';
import * as Icons from '~/components/Icons';

const cs = classNames.bind(styles);

function SideBarItem({ data, chosing, id, onClick }) {
    const [hover, setHover] = useState();

    const hoverVariant = {
        init: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
            borderRadius: '25px',
        },
        exit: {
            opacity: 0,
            borderRadius: '1px',
        },
    };

    return (
        <motion.div
            whileHover={hover && chosing!==id ? { padding: '6px 24px' } : {}}
            transition={{ duration: 0.2 }}
            initial={{ padding: '6px 0px' }}
            animate={chosing===id ? { padding: '10px 24px' } : { padding: '6px 0px' }}
            onClick={onClick}
            key={id}
            onHoverStart={() => setHover(true)}
            onHoverEnd={() => setHover(false)}
            className={cs('categories-item', { choose: chosing===id })}
        >
            <AnimatePresence>
                {((hover && chosing!==id) || chosing===id) && (
                    <motion.div
                        variants={hoverVariant}
                        initial="init"
                        animate={chosing===id || hover ? 'animate' : ''}
                        exit="exit"
                        className={cs('animation', { active: chosing===id })}
                    ></motion.div>
                )}
            </AnimatePresence>
            <div className={cs('content')}>{data}</div>
            {chosing===id && <Icons.arrowRight className={cs('categories-icon')} />}
        </motion.div>
    );
}

export default SideBarItem;
