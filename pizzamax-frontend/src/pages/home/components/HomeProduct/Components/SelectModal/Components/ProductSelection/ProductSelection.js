import classNames from 'classnames/bind';
import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';
import * as Icons from '~/components/Icons';
import images from '~/assets/images';
import styles from '../../SelectModal.module.scss';

const cs = classNames.bind(styles);

function ProductSelection({ selection, product, handleChooseProduct }) {
    const [hover, setHover] = useState(null);
    const [click, setClick] = useState(null);

    useEffect(() => {
        if (click)
            setTimeout(() => {
                setClick(false);
            }, 2000);
    }, [click]);

    const handleClick = (product) => {
        setClick(true);
        setTimeout(() => {
            handleChooseProduct(product);
        }, 400);
    };

    let animate = { left: '-50%' };

    if (hover) {
        animate.left = '0';
    }

    if (click) {
        animate.left = '0';
        animate.width = '100%';
    }

    return (
        <div
            className={cs('product-item')}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => handleClick(product, true)}
        >
            <motion.div
                style={{
                    opacity: `${hover || click ? '1' : '0'}`,
                }}
                initial={{ left: '-50%' }}
                animate={animate}
                className={cs('product-item-animation')}
            >
                <div className={cs('animation-border')}>
                    <div
                        className={cs('animation-img', { click })}
                        style={{ backgroundImage: `url(${images.wave})` }}
                    ></div>
                </div>
            </motion.div>
            <div className={cs('selections')}>
                {product.Selection.map((select, selectIndex) => (
                    <div
                        className={cs('selection', {
                            colorWhite: hover || click,
                        })}
                        key={selectIndex}
                    >
                        <div className={cs('selection-section')}>{select.section}</div>
                        <div className={cs('selection-name')}>{select.name}</div>
                    </div>
                ))}
            </div>
            <div className={cs('product-item-arrow')}>
                <Icons.arrowRight width="4rem" height="4rem" fill={click ? 'white' : '#24282b'} />
            </div>
        </div>
    );
}

export default ProductSelection;
