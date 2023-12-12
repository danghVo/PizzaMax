import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';

import * as Icons from '../Icons';
import styles from './Image.module.scss';
import images from '~/assets/images';

const cs = classNames.bind(styles);

function Image({ src, allowZoom = false, ...props }) {
    const [loading, setLoading] = useState(true);
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });
    const [mouseIn, setMouseIn] = useState(false);

    const imgRef = useRef(null);

    const display = loading ? 'none' : 'block';

    const handleMouseMove = (e) => {
        const { top, left } = imgRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.pageX - left,
            y: e.pageY - top,
        });
    };

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
            <div
                className={cs('img-wrapper', {
                    allowZoom: allowZoom,
                })}
            >
                <img
                    ref={imgRef}
                    src={src}
                    style={{ display }}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setMouseIn(true)}
                    onMouseOut={() => setMouseIn(false)}
                    {...props}
                    onLoad={() => setLoading(false)}
                    alt=""
                />
                {allowZoom && mouseIn && (
                    <div
                        className={cs('zoom-wrapper')}
                        style={{
                            left: mousePosition.x + 50,
                            top: mousePosition.y - 100,
                        }}
                    >
                        <div
                            className={cs('zoom')}
                            style={{
                                left: (-mousePosition.x * 10) / 3 - 25,
                                top: (-mousePosition.y * 10) / 3 + 50,
                                backgroundImage: `url("${src}")`,
                            }}
                        ></div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Image;
