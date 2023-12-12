import classNames from 'classnames/bind';
import styles from './UserAction.module.scss';
import { useState, useLayoutEffect, useEffect } from 'react';

import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import ModalAuth from './ModalAuth';
import UserMenu from './UserMenu';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector, userSlice, userThunk } from '~/store/user';

const cs = classNames.bind(styles);

function UserAction({ user }) {
    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        dispatch(userThunk.getInforByToken());
    }, []);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        dispatch(userSlice.actions.renewApiStatus(''));
    };

    return (
        <>
            {user ? (
                <UserMenu handleCloseAuthModal={handleCloseModal} classNames={'user-menu'} user={user}></UserMenu>
            ) : (
                <>
                    <Button animation theme="default" icon={<Icons.user />} handleClick={handleOpenModal}>
                        Đăng ký / Đăng nhập
                    </Button>
                    {openModal && <ModalAuth handleCloseModal={handleCloseModal} />}
                </>
            )}
        </>
    );
}

export default UserAction;
