import classNames from 'classnames/bind';

import styles from './Navigation.module.scss';
import { useHref, useParams } from 'react-router';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const cs = classNames.bind(styles);

function Navigation() {
    const [currentLocation, setCurrentLocation] = useState([]);
    const currentPath = useHref();
    const params = useParams();

    useEffect(() => {
        const navigation = currentPath.split('/').map((path) => {
            switch (path) {
                case '': {
                    return {
                        name: 'Home',
                        to: '/',
                    };
                }
                case 'product': {
                    return {
                        name: params.productName,
                        to: currentPath,
                    };
                }
                case 'cart': {
                    return {
                        name: 'Cart',
                        to: currentPath,
                    };
                }
                default: {
                    return null;
                }
            }
        });

        setCurrentLocation(navigation);
    }, [currentPath]);

    return (
        <div className={cs('wrapper')}>
            {currentLocation.map(
                (item, index) =>
                    item && (
                        <Link className={cs('path-wrapper')} to={item.to} key={index}>
                            {index !== 0 && ' >'}{' '}
                            <span
                                className={cs('path', {
                                    current: item.to === currentPath,
                                })}
                            >
                                {item.name}
                            </span>
                        </Link>
                    ),
            )}
        </div>
    );
}

export default Navigation;
