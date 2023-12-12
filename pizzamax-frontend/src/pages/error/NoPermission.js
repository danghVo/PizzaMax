import classNames from 'classnames/bind';

import styles from './Common.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userSelector } from '~/store/user';
import { useEffect } from 'react';

const cs = classNames.bind(styles);

function NoPermission() {
    const user = useSelector(userSelector.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.isAdmin) {
            navigate('/admin');
        }
    }, [user]);

    return (
        <div className={cs('wrapper')}>
            <div className={cs('header')}>Không Có Quyền Truy Cập</div>
            <div className={cs('body')}>Bạn không có quyền truy cập nội dung này.</div>
            <div className={cs('recommend')}>
                {user ? 'Hãy quay lại' : 'Hãy đăng nhập để xác thực hoặc quay lại'}
                <Link className={cs('link')} to="/">
                    trang chủ.
                </Link>
            </div>
        </div>
    );
}

export default NoPermission;
