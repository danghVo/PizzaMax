import classNames from 'classnames/bind';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import styles from './AdminBanner.module.scss';
import Table from '~/components/Table';
import * as Icons from '~/components/Icons';
import { addressSelector, addressSlice, addressThunk } from '~/store/address';
import Tippy from '@tippyjs/react';
import { systemSelector, systemThunk } from '~/store/system';
import FormBanner from './Form/FormBanner';

const cs = classNames.bind(styles);

const title = ['id', 'image', 'actions'];

function AdminBanner() {
    const [bannerSelected, setBannerSelected] = useState(null);
    const tableRef = useRef();

    const dispatch = useDispatch();
    const banners = useSelector(systemSelector.banner);

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
        [banners],
    );

    const handleDeleteItem = (e, itemId) => {
        e.stopPropagation();
        dispatch(systemThunk.removeBanner({ id: itemId }));
    };

    const handleChooseItem = (value) => {
        setBannerSelected(value);
    };

    const handleAddBanner = () => {
        setBannerSelected({
            image: '',
        });
    };

    return (
        <div className={cs('wrapper')}>
            <motion.div
                initial={{ width: '100%' }}
                animate={bannerSelected ? { width: '65%' } : { width: '100%' }}
                className={cs('inner')}
            >
                <div className={cs('header')}>
                    <span className={cs('text')}>Banner</span>
                </div>
                <div className={cs('filter-wrapper')}>
                    <div className={cs('add-btn-wrapper')}>
                        <div className={cs('add-btn')} onClick={handleAddBanner}>
                            Thêm mới banner
                        </div>
                    </div>
                </div>
                <div className={cs('table-wrapper')}>
                    <Table
                        ref={tableRef}
                        title={title}
                        data={banners}
                        ActionsElement={ActionsElement}
                        handlechooseItem={handleChooseItem}
                    />
                </div>
            </motion.div>

            {bannerSelected && (
                <FormBanner
                    handleCloseForm={() => {
                        setBannerSelected(null);
                        tableRef.current.clearSelected();
                    }}
                    dataSelected={bannerSelected}
                />
            )}
        </div>
    );
}

export default AdminBanner;
