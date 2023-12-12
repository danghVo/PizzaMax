import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

import styles from './ViewUser.module.scss';
import Image from '~/components/Image';
import * as Icons from '~/components/Icons';
import Button from '../Button';
import InputFile from '../Input/InputFile';
import Input from '../Input';

const cs = classNames.bind(styles);

function ViewUser({ children, userSelected, handleCloseView, edit = false }) {
    const [inputName, setInputName] = useState(false);
    const inputFileRef = useRef(null);

    return (
        <motion.div
            initial={{ x: 200 }}
            animate={{ x: 1, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            className={cs('wrapper')}
        >
            <div className={cs('arrow-back')} onClick={handleCloseView}>
                <Icons.arrow fill="black" width="5rem" height="5rem" />
            </div>
            <div className={cs('user-infor')}>
                <div className={cs('avatar')}>
                    {userSelected.avatar === 'noImage' ? (
                        <div className={cs('no-image')}>
                            <Icons.user width="6rem" height="6rem" />
                        </div>
                    ) : (
                        <Image src={userSelected.avatar} className={cs('img')} />
                    )}
                    {edit && (
                        <span className={cs('plus-wrapper')}>
                            <Button
                                type="icon"
                                animation
                                handleClick={() => {
                                    inputFileRef.current.addFile();
                                }}
                                theme="default"
                                className={cs('plus-button')}
                                icon={<Icons.plus width="3.2rem" height="3.2rem" className={cs('plus-icon')} />}
                            />
                            <span style={{ display: 'none' }}>
                                <InputFile
                                    ref={inputFileRef}
                                    file={edit.editData.image}
                                    handleSetForm={edit.editAvatar}
                                />
                            </span>
                        </span>
                    )}
                </div>
                <div>
                    {userSelected.role && (
                        <div className={cs('infor')}>
                            Role: <span className={cs('infor-value')}>{userSelected.role}</span>
                        </div>
                    )}
                    <div className={cs('infor')}>
                        Tên người dùng:
                        {inputName ? (
                            <Input
                                value={edit.editData.name}
                                onChange={(e) => edit.editName(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' &&
                                    edit.submitValue({ name: edit.editData.name }) &&
                                    setInputName(false)
                                }
                                className={cs('infor-value')}
                            />
                        ) : (
                            <span className={cs('infor-value')}>
                                {userSelected.name}
                                {edit && (
                                    <span onClick={() => setInputName(true)}>
                                        <Icons.edit width="2rem" className={cs('icon')} />
                                    </span>
                                )}
                            </span>
                        )}
                    </div>
                    <div className={cs('infor')}>
                        Số điện thoại: <span className={cs('infor-value')}>{userSelected.phoneNumber}</span>
                    </div>
                    {edit && (
                        <div className={cs('infor')}>
                            <Button
                                size="small"
                                animation
                                handleClick={edit.openChangePass}
                                hover
                                className={cs('changepass-button')}
                            >
                                Đổi mật khẩu
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className={cs('user-detail')}>
                <div className={cs('user-address')}>
                    <div className={cs('header')}>Các địa chỉ của người dùng: </div>
                    <div className={cs('address-list')}>
                        <div className={cs('address-list-inner')}>
                            {userSelected.address.map((item, index) => (
                                <li className={cs('address-item')} key={index}>
                                    {item.address}
                                    {edit && (
                                        <span className={cs('icon-address')}>
                                            <span onClick={() => edit.editAddress(item)}>
                                                <Icons.edit width="2rem" height="2rem" className={cs('icon')} />
                                            </span>
                                            <span onClick={() => edit.deleteAddress(item)}>
                                                <Icons.garbage width="2rem" height="2rem" className={cs('icon')} />
                                            </span>
                                        </span>
                                    )}
                                </li>
                            ))}
                        </div>
                    </div>
                </div>
                {children}
            </div>
        </motion.div>
    );
}

export default ViewUser;
