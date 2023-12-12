import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import styles from './UserMenu.module.scss';
import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import { userThunk } from '~/store/user';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const cs = classNames.bind(styles);

function UserMenu({ children, handleCloseAuthModal, user }) {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleLogOut = (e) => {
        e.stopPropagation();
        dispatch(userThunk.logOut());
        handleCloseAuthModal();
        navigate('/');
    };

    return (
        <>
            {user.isAdmin && (
                <Button
                    handleClick={() => {
                        navigate('/admin');
                    }}
                    className={cs('user-menu-admin')}
                    icon={<Icons.edit />}
                    animation
                    theme="default"
                >
                    Quản lý
                </Button>
            )}
            <Tippy
                interactive
                placement="bottom-end"
                // visible
                offset={[-10, 10]}
                render={(attrs) => (
                    <div className={cs('user-menu-wrapper')} tabIndex="-1" {...attrs}>
                        <div className={cs('user-menu-list')}>
                            <div onClick={() => navigate('/user/infor')} className={cs('user-menu-item')}>
                                <span className={cs('icon')}>
                                    <Icons.userInfor />
                                </span>
                                Thông tin cá nhân
                            </div>
                            <div onClick={() => navigate('/user/cart')} className={cs('user-menu-item')}>
                                <span className={cs('icon')}>
                                    <Icons.cart />
                                </span>
                                Đơn hàng của tôi
                            </div>
                            <div onClick={handleLogOut} className={cs('user-menu-item')}>
                                <span className={cs('icon')}>
                                    <Icons.logout />
                                </span>
                                Đăng xuất
                            </div>
                        </div>
                    </div>
                )}
            >
                <Button
                    className={cs('user-menu-button')}
                    animation
                    theme="default"
                    type="icon"
                    icon={<Icons.user />}
                ></Button>
            </Tippy>
        </>
    );
}

export default UserMenu;
