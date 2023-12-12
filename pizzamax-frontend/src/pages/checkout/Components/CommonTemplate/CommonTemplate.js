import classNames from 'classnames/bind';

import styles from './CommonTemplate.module.scss';

const cs = classNames.bind(styles);

function CommonTemplate({ children, header, className }) {
    return (
        <div className={`${cs('wrapper')} ${className}`}>
            <div className={cs('header')}>{header}</div>
            <div className={cs('body')}>{children}</div>
        </div>
    );
}

export default CommonTemplate;
