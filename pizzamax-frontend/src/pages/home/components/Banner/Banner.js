import classNames from 'classnames/bind';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { systemSelector } from '~/store/system';
import { useState } from 'react';

import styles from './Banner.module.scss';

const cs = classNames.bind(styles);

const imgVariant = {
    enter: {
        opacity: 0,
    },
    center: {
        opacity: 1,
    },
    exit: {
        opacity: 0.5,
    },
};

function Banner() {
    const [bannerShow, setBannerShow] = useState(0);
    const [prev, setPrev] = useState(0);

    const banners = useSelector(systemSelector.banner);

    const handleChangeBanner = (index) => {
        setPrev(bannerShow);
        setBannerShow(index);
    };

    return (
        <div className={cs('wrapper')}>
            <div className={cs('banner-container')}>
                <AnimatePresence initial={false}>
                    {banners.map(
                        (item, index) =>
                            item.image && (
                                <motion.img
                                    key={index}
                                    className={cs(
                                        'banner-item-img',
                                        { 'img-active': bannerShow === index },
                                        { 'img-prev': prev === index },
                                    )}
                                    variants={imgVariant}
                                    init="enter"
                                    animate={index === bannerShow ? 'center' : 'exit'}
                                    style={{ '--index': `-${index}` }}
                                    transition={{
                                        opacity: { duration: 0.2 },
                                    }}
                                    src={item.image}
                                />
                            ),
                    )}
                </AnimatePresence>
            </div>
            <div className={cs('banner-btns')}>
                {banners.map(
                    (item, index) =>
                        item.image && (
                            <div
                                key={index}
                                data-banner-id={index}
                                className={cs('banner-btn', { active: index === bannerShow })}
                                onClick={() => handleChangeBanner(index)}
                            ></div>
                        ),
                )}
            </div>
        </div>
    );
}

export default Banner;
