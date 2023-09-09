import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import images from '~/assets/images';
import Location from './Location';
import UserAction from './UserAction';
import Cart from './Cart';

const cs = classNames.bind(styles);

function Header() {
    const [isScrollThrough, setIsScrollThrough] = useState();

    useEffect(() => {
        window.addEventListener('scroll', handleScrollFixed);

        return () => window.removeEventListener('srcoll', handleScrollFixed);
    });

    const handleScrollFixed = () => {
        if (window.scrollY > 100) {
            setIsScrollThrough(true);
        } else {
            setIsScrollThrough(false);
        }
    };

    return (
        <div className={cs('wrapper', { scroll: isScrollThrough })}>
            <div className={cs('inner')}>
                <Link className={cs('logo')} to={'/'}>
                    <img src={images.logo} alt="Logo" />
                </Link>

                <Location />

                <div className={cs('actions')}>
                    <UserAction />
                    <Cart />
                </div>
            </div>
        </div>
    );
}

export default Header;
