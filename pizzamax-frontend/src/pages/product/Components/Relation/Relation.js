import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import styles from './Relation.module.scss';
import HomeProduct from '~/components/HomeProduct';
import Button from '~/components/Button';
import * as Icons from '~/components/Icons';

const cs = classNames.bind(styles);

function Relation({ type, products = [] }) {
    const [positionX, setPositionX] = useState({ current: 0, next: 0 });

    const handleScrollLeft = () => {
        setPositionX((prev) => ({
            current: prev.next,
            next: prev.next + 380,
        }));
    };

    const handleScrollRight = () => {
        setPositionX((prev) => ({
            ...prev,
            current: prev.next,
            next: prev.next - 380,
        }));
    };

    return (
        <>
            {products.length > 0 && (
                <div className={cs('wrapper')}>
                    <div className={cs('header')}>
                        <div className={cs('text')}>More of {type}</div>
                    </div>

                    <div className={cs('content')}>
                        {positionX.next !== 0 && (
                            <Button
                                className={cs('btn-arrow-left')}
                                icon={<Icons.arrowRight />}
                                type="icon"
                                animation
                                hover
                                handleClick={handleScrollLeft}
                                size="small"
                            />
                        )}

                        <div className={cs('product-list-wrapper')}>
                            <motion.div
                                className={cs('product-list-inner')}
                                style={{ width: `${380 * products.length}px` }}
                                initial={{ x: positionX.current }}
                                animate={{ x: positionX.next }}
                                transition={{ duration: 0.5 }}
                            >
                                {products.map((item, index) => (
                                    <div key={index} className={cs('product-item-wrapper')}>
                                        <HomeProduct data={item} />
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {products.length > 3 && positionX.next !== -((products.length % 3) * 380) && (
                            <Button
                                className={cs('btn-arrow-right')}
                                icon={<Icons.arrowRight />}
                                handleClick={handleScrollRight}
                                type="icon"
                                animation
                                hover
                                size="small"
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Relation;
