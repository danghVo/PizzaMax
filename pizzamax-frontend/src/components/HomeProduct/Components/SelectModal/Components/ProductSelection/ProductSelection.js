import classNames from 'classnames/bind';
import { motion } from 'framer-motion';

import { useEffect, useState } from 'react';
import * as Icons from '~/components/Icons';
import images from '~/assets/images';
import styles from '../../SelectModal.module.scss';
import Button from '~/components/Button';
import { useDispatch } from 'react-redux';
import { cartThunk } from '~/store/cart';

const cs = classNames.bind(styles);

function ProductSelection({ product }) {
    const [hover, setHover] = useState(null);

    const dispatch = useDispatch();

    let animate = { left: '-50%' };

    if (hover) {
        animate.left = '0';
    }

    const Icon = product.detail.quantity === 1 ? Icons.garbage : Icons.minus;

    const handleQuantity = () => {
        if (product.detail.quantity === 1) {
            dispatch(cartThunk.removeFromCart(product));
        } else {
            dispatch(cartThunk.decrease(product));
        }
    };

    return (
        <div className={cs('product-item')} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            <motion.div
                style={{
                    opacity: `${hover ? '1' : '0'}`,
                }}
                initial={{ left: '-50%' }}
                animate={animate}
                className={cs('product-item-animation')}
            >
                <div className={cs('animation-border')}>
                    <div className={cs('animation-img')} style={{ backgroundImage: `url(${images.wave})` }}></div>
                </div>
            </motion.div>
            <div className={cs('selections')}>
                {product.Selection.map((select, selectIndex) => (
                    <div
                        className={cs('selection', {
                            colorWhite: hover,
                        })}
                        key={selectIndex}
                    >
                        <div className={cs('selection-section')}>{select.section}</div>
                        <div className={cs('selection-name')}>{select.name}</div>
                    </div>
                ))}
            </div>
            <div className={cs('product-item-action')}>
                <div className={cs('product-item-quantity')}>{product.detail.quantity}</div>
                <Button
                    animation
                    hover
                    type="icon"
                    size="small"
                    className={cs('product-item-garbage')}
                    handleClick={handleQuantity}
                    icon={<Icon width="2.2rem" height="2.2rem" fill={'#24282b'} />}
                />
            </div>
        </div>
    );
}

export default ProductSelection;
