import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import * as Icons from '../Icons';
import styles from './Image.module.scss';

const cs = classNames.bind(styles);

function Image({ src, ...props }) {
    const [loading, setLoading] = useState(true);

    const display = loading ? 'none' : 'block';

    return (
        <>
            {loading && (
                <div className={`${cs('img-loading-wrapper')} ${props.className}`}>
                    <Icons.loading
                        stroke="black"
                        width="4rem"
                        height="4rem"
                        className={cs('img-loading')}
                    ></Icons.loading>
                </div>
            )}
            <img src={src} style={{ display }} {...props} onLoad={() => setLoading(false)} />
        </>
    );
}

export default Image;
