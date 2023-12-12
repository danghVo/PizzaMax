import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import styles from './Waiting.module.scss';

const cs = classNames.bind(styles);

function Waiting() {
    const [dotUp, setDotUp] = useState(0);
    const arrOfDot = [1, 2, 3, 4, 5, 6];

    useEffect(() => {
        const handleAnimtion = setInterval(() => {
            setDotUp((prev) => {
                if (prev === arrOfDot.length) {
                    return 0;
                } else return prev + 1;
            });
        }, 300);

        return () => clearInterval(handleAnimtion);
    }, []);

    return (
        <div className={cs('wrapper')}>
            {arrOfDot.map((item, index) => (
                <motion.div
                    key={index}
                    className={cs('dot')}
                    initial={{ y: 0 }}
                    animate={dotUp === index ? { y: -10 } : {}}
                ></motion.div>
            ))}
        </div>
    );
}

export default Waiting;
