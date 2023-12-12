import classNames from 'classnames/bind';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import styles from './AdminStore.module.scss';
import Table from '~/components/Table';
import Search from '~/components/Search';
import Filter from '~/components/Filter';
import * as Icons from '~/components/Icons';
import { addressSelector, addressSlice, addressThunk } from '~/store/address';
import Tippy from '@tippyjs/react';
import FormAddress from './Form/FormAddress';

const cs = classNames.bind(styles);

const title = ['id', 'address', 'actions'];

function AdminStore() {
    const [addressSelected, setAddressSelected] = useState(null);
    const tableRef = useRef();

    const dispatch = useDispatch();
    const storeList = useSelector(addressSelector.shopAddressShow);
    const storeRawList = useSelector(addressSelector.shopAddressRaw);

    useEffect(() => {
        dispatch(addressThunk.getAllShopAddress());
    }, []);

    const ActionsElement = useCallback(
        ({ itemId }) => (
            <Tippy placement="bottom" interactive content="Xoá">
                <span onClick={(e) => handleDeleteItem(e, itemId)}>
                    <Icons.garbage width="2rem" height="2rem" />
                </span>
            </Tippy>
        ),
        [storeList],
    );

    const handleDeleteItem = (e, itemId) => {
        e.stopPropagation();
        dispatch(addressThunk.deleteShopAddress({ id: itemId }));
    };

    const handleChooseItem = (address) => {
        let addressRaw = null;
        if (address) {
            addressRaw = storeRawList.find((item) => item.addressId === address.id).address;
        }

        setAddressSelected(addressRaw);
    };

    const handleFilter = (filters) => {
        dispatch(addressSlice.actions.filterAddress(filters));
    };

    const handleAddAddress = () => {
        setAddressSelected({
            street: '',
            alley: '',
            district: '',
            houseNumber: '',
            ward: '',
            city: '',
        });
    };

    return (
        <div className={cs('wrapper')}>
            <motion.div
                initial={{ width: '100%' }}
                animate={addressSelected ? { width: '65%' } : { width: '100%' }}
                className={cs('inner')}
            >
                <div className={cs('header')}>
                    <span className={cs('text')}>Địa chỉ cửa hàng</span>
                </div>
                <div className={cs('search-wrapper')}>
                    <Search searchFor="address" />
                </div>
                <div className={cs('filter-wrapper')}>
                    <Filter
                        data={[{ name: 'City', filters: ['Cần Thơ', 'Hồ Chí Minh'] }]}
                        filterAction={handleFilter}
                        page="address"
                    />

                    <div className={cs('add-btn-wrapper')}>
                        <div className={cs('add-btn')} onClick={handleAddAddress}>
                            Thêm mới địa chỉ cửa hàng
                        </div>
                    </div>
                </div>
                <div className={cs('table-wrapper')}>
                    <Table
                        ref={tableRef}
                        title={title}
                        data={storeList}
                        ActionsElement={ActionsElement}
                        handlechooseItem={handleChooseItem}
                    />
                </div>
            </motion.div>

            {addressSelected && (
                <FormAddress
                    handleCloseForm={() => {
                        setAddressSelected(null);
                        tableRef.current.clearSelected();
                    }}
                    dataSelected={addressSelected}
                />
            )}
        </div>
    );
}

export default memo(AdminStore);
