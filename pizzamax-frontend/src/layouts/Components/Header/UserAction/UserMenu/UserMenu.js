import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import styles from './UserMenu.module.scss';
import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import { userThunk } from '~/store/user';
import { useDispatch } from 'react-redux';

const cs = classNames.bind(styles);

function UserMenu({ children, user }) {
    const dispatch = useDispatch();

    const handleLogOut = (e) => {
        e.stopPropagation();
        dispatch(userThunk.logOut());
    };

    return (
        <>
            <Tippy
                interactive
                placement="bottom-end"
                // visible
                offset={[-10, 10]}
                render={(attrs) => (
                    <div className={cs('user-menu-wrapper')} tabIndex="-1" {...attrs}>
                        <div className={cs('user-menu-list')}>
                            <div className={cs('user-menu-item')}>Profile</div>
                            <div className={cs('user-menu-item')}>My carts</div>
                            <div onClick={handleLogOut} className={cs('user-menu-item')}>
                                Log out
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
