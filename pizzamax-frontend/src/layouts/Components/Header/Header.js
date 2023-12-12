import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import images from '~/assets/images';
import Location from './Location';
import UserAction from './UserAction';
import Cart from './Cart';
import { useSelector } from 'react-redux';
import { userSelector } from '~/store/user';

const cs = classNames.bind(styles);

function Header() {
    const [isScrollThrough, setIsScrollThrough] = useState();

    const user = useSelector(userSelector.user);

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

                <Location user={user} />

                <div className={cs('actions')}>
                    <UserAction user={user} />
                    <Cart user={user} />
                </div>
            </div>
        </div>
    );
}

export default Header;
