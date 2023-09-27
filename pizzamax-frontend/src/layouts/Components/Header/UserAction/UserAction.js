import classNames from 'classnames/bind';
import modalStyles from './UserAction.module.scss';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';

import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import ModalAuth from './ModalAuth';
import UserMenu from './UserMenu';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector, userFetch } from '~/store/user';

const modalCs = classNames.bind(modalStyles);

function UserAction() {
    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch();

    const user = useSelector(userSelector.user);
    console.log(user);

    useLayoutEffect(() => {
        // dispatch get user profile
        dispatch(userFetch.getInforByToken());
    }, []);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
            {user ? (
                <Button animation theme="default" icon={<Icons.user />}>
                    <UserMenu user={user}></UserMenu>
                </Button>
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
