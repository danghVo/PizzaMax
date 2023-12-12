import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';

import styles from './UserInforPage.module.scss';
import ViewUser from '~/components/ViewUser';
import { addressSelector } from '~/store/address';
import { userSelector, userThunk } from '~/store/user';
import { FormAddress, FormChangePassword } from './Form';

const cs = classNames.bind(styles);

function UserInforPage() {
    const [formData, setFormData] = useState({
        image: 'noImage',
        file: null,
        name: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [addressSelected, setAddressSelected] = useState(null);
    const [changePassword, setChangePassword] = useState(false);

    const user = useSelector(userSelector.user);
    const userAddress = useSelector(addressSelector.userAddress);
    const userAddressRaw = useSelector(addressSelector.userAddressRaw);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user)
            setFormData({
                ...formData,
                image: user.avatar,
                name: user.name,
            });
    }, [user]);

    const navigate = useNavigate();

    const handleSelectAddress = (address) => {
        setAddressSelected(userAddressRaw.find((item) => item.addressId === address.id).address);
    };

    const edit = {
        editData: formData,
        editAddress: handleSelectAddress,
        editAvatar: (file) => {
            dispatch(userThunk.addAvatar({ file, uuid: user.uuid }));
        },
        deleteAddress: (address) => {
            dispatch(userThunk.deleteUserAddress({ addressId: address.id, uuid: user.uuid }));
        },
        editName: (value) => {
            setFormData((prev) => ({
                ...prev,
                name: value,
            }));
        },
        submitValue: (payload) => {
            dispatch(userThunk.updateUser({ ...payload, uuid: user.uuid }));
        },
        openChangePass: () => {
            setChangePassword(true);
        },
    };

    return (
        <div className={cs('wrapper')}>
            <ViewUser
                userSelected={{ ...user, address: userAddress }}
                edit={edit}
                handleCloseView={() => navigate('/')}
            >
                <div className={cs('form-wrapper')}>
                    {changePassword && (
                        <FormChangePassword
                            formData={formData}
                            handleFormData={setFormData}
                            submitForm={edit.submitValue}
                            handleCloseForm={() => {
                                setChangePassword(false);
                                setFormData({
                                    ...formData,
                                    oldPassword: '',
                                    newPassword: '',
                                    confirmPassword: '',
                                });
                            }}
                        />
                    )}
                    <AnimatePresence>
                        {addressSelected && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={cs('form-address')}
                            >
                                <FormAddress
                                    dataSelected={addressSelected}
                                    user={user}
                                    handleCloseForm={() => setAddressSelected(null)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </ViewUser>
        </div>
    );
}

export default UserInforPage;
