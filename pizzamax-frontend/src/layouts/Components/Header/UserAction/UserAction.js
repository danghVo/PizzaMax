import classNames from 'classnames/bind';
import styles from './UserAction.module.scss';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';

import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import ModalAuth from './ModalAuth';
import UserMenu from './UserMenu';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector, userThunk } from '~/store/user';

const cs = classNames.bind(styles);

function UserAction() {
    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch();

    const user = useSelector(userSelector.user);

    useLayoutEffect(() => {
        // dispatch get user profile
        dispatch(userThunk.getInforByToken());
    }, []);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            {user && !openModal ? (
                <UserMenu classNames={'user-menu'} user={user}></UserMenu>
            ) : (
                <>
                    <Button animation theme="default" icon={<Icons.user />} handleClick={handleOpenModal}>
                        Sign In / Register
                    </Button>
                    {openModal && <ModalAuth handleCloseModal={handleCloseModal} />}
                </>
            )}
        </>
    );
}

export default UserAction;
