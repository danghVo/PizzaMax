import classNames from 'classnames/bind';
import { memo, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './AdminUser.module.scss';
import Table from '~/components/Table';
import Search from '~/components/Search';
import Filter from '~/components/Filter';
import ViewUser from '~/components/ViewUser';
import { userSelector, userSlice, userThunk } from '~/store/user';
import CartView from '~/components/CartView';
import Input from '~/components/Input';
import phoneNumberRule from '~/rules/phoneNumberRule';
import { required } from '~/rules';

const cs = classNames.bind(styles);

const title = ['name', 'phoneNumber', 'role'];

function AdminUser() {
    const [userSelected, setUserSelected] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [addAdmin, setaddAdmin] = useState(false);
    const tableRef = useRef();

    const dispatch = useDispatch();
    const userList = useSelector(userSelector.userList);

    useEffect(() => {
        dispatch(userThunk.getAllUser());
    }, []);

    const handleFilterByRole = (filters) => {
        dispatch(userSlice.actions.filterUserByRole(filters));
    };

    const handleAddAdmin = () => {
        if (addAdmin) {
            dispatch(userThunk.createAdmin({ phoneNumber }));
            setaddAdmin(false);
            setPhoneNumber('');
        } else setaddAdmin(true);
    };

    return (
        <div className={cs('wrapper')}>
            {userSelected ? (
                <ViewUser userSelected={userSelected} handleCloseView={() => setUserSelected(null)}>
                    <div className={cs('user-cart')}>
                        <div className={cs('header')}>Đơn hàng của người dùng</div>

                        {userSelected.carts.carts.length > 0 ? (
                            <CartView cartData={userSelected.carts.carts} />
                        ) : (
                            <div className={cs('empty')}>Người dùng chưa có đơn hàng </div>
                        )}
                    </div>
                </ViewUser>
            ) : (
                <div className={cs('inner')}>
                    <div className={cs('header')}>
                        <span className={cs('text')}>Người dùng</span>
                    </div>
                    <div className={cs('search-wrapper')}>
                        <Search searchFor={'user'} />
                    </div>
                    <div className={cs('filter-wrapper')}>
                        <Filter
                            data={[{ name: 'Role', filters: ['admin', 'user'] }]}
                            filterAction={handleFilterByRole}
                            page="user"
                        />

                        <div className={cs('add-btn-wrapper')}>
                            {addAdmin && (
                                <Input
                                    value={phoneNumber}
                                    label="Nhập tài khoản admin"
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    rules={[required, phoneNumberRule]}
                                    className={cs('input')}
                                />
                            )}
                            <div className={cs('add-btn')} onClick={handleAddAdmin}>
                                {addAdmin ? 'Lưu' : 'Thêm mới tài khoản admin'}
                            </div>
                        </div>
                    </div>
                    <div className={cs('table-wrapper')}>
                        <Table ref={tableRef} title={title} data={userList} handlechooseItem={setUserSelected} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(AdminUser);
