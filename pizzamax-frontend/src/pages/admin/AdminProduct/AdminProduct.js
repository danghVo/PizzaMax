import classNames from 'classnames/bind';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Tippy from '@tippyjs/react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './AdminProduct.module.scss';
import Search from '~/components/Search';
import Table from '~/components/Table';
import Filter from '~/components/Filter';
import { FormProduct, FormType, FormTime } from './Form';
import * as Icons from '~/components/Icons';
import store from '~/store';
import { productThunk, productsSelector, productsSlice } from '~/store/products';
import FormDiscount from './Form/FormDiscount';

const cs = classNames.bind(styles);

function AdminProduct() {
    const [dataSelected, setDataSelected] = useState(null);
    const [openViewList, setOpenViewList] = useState(false);
    const [currentView, setCurrentView] = useState({ name: 'product', view: 'sản phẩm' });

    const dispatch = useDispatch();

    const rawProducts = useSelector(productsSelector.rawProducts);
    const rawTypes = useSelector(productsSelector.rawTypes);
    const rawTimes = useSelector(productsSelector.rawTimes);
    const allTypes = productsSelector.getAllTypes(store.getState());
    const timesFilter = productsSelector.getTimesFilter(store.getState());
    const rawDiscounts = useSelector(productsSelector.rawDiscounts);

    const currentViewData = useMemo(() => {
        switch (currentView.name) {
            case 'product': {
                return {
                    titles: ['id', 'image', 'name', 'type', 'price', 'actions'],
                    dataTable: rawProducts,
                    filter: [
                        {
                            name: 'Type',
                            filters: allTypes,
                        },
                    ],
                    filterAction: (filters) => dispatch(productsSlice.actions.filterRawProduct(filters)),
                };
            }
            case 'type': {
                return {
                    titles: ['id', 'name', 'timeName', 'actions'],
                    dataTable: rawTypes,
                    filter: [
                        {
                            name: 'time',
                            filters: timesFilter,
                        },
                    ],
                    filterAction: (filters) => dispatch(productsSlice.actions.filterRawType(filters)),
                };
            }
            case 'time': {
                return {
                    titles: ['id', 'name', 'fromDay', 'toDay', 'fromTime', 'toTime', 'actions'],
                    dataTable: rawTimes,
                };
            }
            case 'discount': {
                return {
                    titles: ['id', 'saleOff', 'startDay', 'endDay', 'startTime', 'endTime', 'actions'],
                    dataTable: rawDiscounts,
                    filter: [
                        {
                            name: 'Thời hạn',
                            filters: ['Còn hạn', 'Hết hạn'],
                        },
                    ],
                    filterAction: (filters) => dispatch(productsSlice.actions.filterRawDiscount(filters)),
                };
            }
            default: {
            }
        }
    }, [currentView, rawProducts, rawTypes, rawTimes, allTypes, rawDiscounts]);

    const views = useRef([
        { name: 'product', view: 'sản phẩm' },
        { name: 'type', view: 'loại sản phẩm' },
        { name: 'time', view: 'thời gian' },
        { name: 'discount', view: 'khuyến mãi' },
    ]);

    const tableRef = useRef(null);

    useEffect(() => {
        if (currentView.name === 'product') dispatch(productThunk.fetchProducts());
        dispatch(productThunk.typesDetail());
        dispatch(productThunk.timesDetail());
        dispatch(productThunk.discountsDetail());
    }, [currentView.name]);

    const ActionsElement = useCallback(
        ({ dataItem, itemId }) => (
            <div className={cs('action-btn')} onClick={(e) => e.stopPropagation()}>
                {currentView.name === 'product' &&
                    (dataItem.hide ? (
                        <Tippy placement="bottom" interactive content="Hiện">
                            <span className={cs('gap')} onClick={() => handleToggleHideProduct(itemId)}>
                                <Icons.eyeSlash width="2rem" height="2rem" />
                            </span>
                        </Tippy>
                    ) : (
                        <Tippy placement="bottom" interactive content="Ẩn">
                            <span className={cs('gap')} onClick={() => handleToggleHideProduct(itemId)}>
                                <Icons.eye width="2rem" height="2rem" />
                            </span>
                        </Tippy>
                    ))}
                <Tippy placement="bottom" interactive content="Xoá">
                    <span onClick={() => handleDeleteItem(itemId)}>
                        <Icons.garbage width="2rem" height="2rem" />
                    </span>
                </Tippy>
            </div>
        ),
        [currentView],
    );

    const handleAddProduct = () => {
        handleCloseForm();
        if (currentView.name === 'product') {
            setDataSelected({
                name: '',
                type: '',
                price: 0,
                description: '',
                image: '',
                file: null,
                signature: false,
                discount: null,
                discOptions: {},
            });
        } else if (currentView.name === 'type') {
            setDataSelected({
                name: '',
                timeId: null,
                timeName: '',
            });
        } else
            setDataSelected({
                name: '',
                fromDay: '',
                toDay: '',
                fromTime: '',
                toTime: '',
            });
    };

    const handleToggleHideProduct = (productId) => {
        dispatch(productThunk.toggleHideProduct({ productId }));
    };

    const handleCloseForm = () => {
        console.log(1);
        tableRef.current.clearSelected();
        setDataSelected(null);
    };

    const handleDeleteItem = (itemId) => {
        if (currentView.name === 'product') {
            dispatch(productThunk.deleteProduct({ itemId }));
        } else if (currentView.name === 'type') {
            dispatch(productThunk.deleteType({ id: itemId }));
        } else if (currentView.name === 'time') dispatch(productThunk.deleteTime({ id: itemId }));
        else dispatch(productThunk.deleteDiscount({ id: itemId }));
    };

    const handleChooseView = (item) => {
        setCurrentView({ ...item });
        setOpenViewList(false);
        setDataSelected(null);
        tableRef.current.clearSelected();
    };

    return (
        <div className={cs('wrapper')}>
            <motion.div
                className={cs('products-show')}
                initial={{ width: '100%' }}
                animate={dataSelected ? { width: '65%' } : { width: '100%' }}
            >
                <div className={cs('header')}>
                    <Tippy placement="bottom" interactive content="Thay đổi view">
                        <span className={cs('eye')} onClick={() => setOpenViewList((prev) => !prev)}>
                            <Icons.eye />
                        </span>
                    </Tippy>
                    <span className={cs('text')}>
                        {currentView.view}

                        <AnimatePresence>
                            {openViewList && (
                                <motion.div
                                    className={cs('view-list')}
                                    initial={{ height: 0 }}
                                    animate={{ height: 'fit-content' }}
                                    exit={{ height: 0 }}
                                >
                                    {views.current.map((item, index) => (
                                        <div
                                            className={cs('view-item', {
                                                active: item.view === currentView.view,
                                            })}
                                            onClick={() => handleChooseView(item)}
                                            key={index}
                                        >
                                            {item.view}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </span>
                </div>
                <div className={cs('search-wrapper')}>
                    <Search searchFor={currentView.name} />
                </div>
                <div className={cs('filter-wrapper')}>
                    {currentViewData.filter && (
                        <Filter
                            data={currentViewData.filter}
                            page="product"
                            filterAction={currentViewData.filterAction}
                        />
                    )}

                    <div className={cs('add-btn-wrapper')}>
                        <div className={cs('add-btn')} onClick={handleAddProduct}>
                            Thêm mới {currentView.view}
                        </div>
                    </div>
                </div>
                <div className={cs('table-wrapper')}>
                    <Table
                        ref={tableRef}
                        title={currentViewData.titles}
                        ActionsElement={ActionsElement}
                        data={currentViewData.dataTable}
                        handlechooseItem={setDataSelected}
                    />
                </div>
            </motion.div>
            {dataSelected &&
                (currentView.name === 'product' ? (
                    <FormProduct allTypes={allTypes} handleCloseForm={handleCloseForm} dataSelected={dataSelected} />
                ) : currentView.name === 'type' ? (
                    <FormType timeFilters={timesFilter} handleCloseForm={handleCloseForm} dataSelected={dataSelected} />
                ) : currentView.name === 'time' ? (
                    <FormTime handleCloseForm={handleCloseForm} dataSelected={dataSelected} />
                ) : (
                    <FormDiscount handleCloseForm={handleCloseForm} dataSelected={dataSelected} />
                ))}
        </div>
    );
}

export default AdminProduct;
