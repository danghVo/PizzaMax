import classNames from 'classnames/bind';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import styles from './Filter.module.scss';
import * as Icons from '~/components/Icons';
import { productsSelector, productsSlice } from '~/store/products';
import Tippy from '@tippyjs/react';
import { userSlice } from '~/store/user';
import { addressSlice } from '~/store/address';

const cs = classNames.bind(styles);

function Filter({ data, filterAction, page }) {
    const [openData, setOpenData] = useState(false);
    const [dataSelected, setDataSelected] = useState(null);

    const dispatch = useDispatch();
    const productCurrentFilter = useSelector(productsSelector.currentFilter);
    const userCurrentFilter = useSelector((state) => state.user.currentFilter);
    const addressCurrentFilter = useSelector((state) => state.address.currentFilter);

    useEffect(() => {
        if (page === 'address' && addressCurrentFilter) {
            setOpenData(addressCurrentFilter.map(() => false));
            setDataSelected(addressCurrentFilter.map((item) => ({ name: item.name, selected: item.selected })));
        } else if (page === 'user' && userCurrentFilter) {
            setOpenData(userCurrentFilter.map(() => false));
            setDataSelected(userCurrentFilter.map((item) => ({ name: item.name, selected: item.selected })));
        } else if ((page === 'product' || page === 'home') && productCurrentFilter) {
            setOpenData(productCurrentFilter.map(() => false));
            setDataSelected(productCurrentFilter.map((item) => ({ name: item.name, selected: item.selected })));
        } else if (data) {
            setOpenData(data.map(() => false));
            setDataSelected(data.map((item) => ({ name: item.name, selected: null })));
        }
    }, [data, productCurrentFilter, userCurrentFilter, addressCurrentFilter]);

    const handleChooseFilter = (filterValue, filterIndex) => {
        const filters = [...dataSelected];
        filters[filterIndex].selected = filterValue;
        filterAction(filters);
    };

    const handleResetFilter = () => {
        if (page === 'product' || page === 'home') dispatch(productsSlice.actions.resetFilter());
        else if (page === 'user') dispatch(userSlice.actions.resetFilter());
        else if (page === 'address') dispatch(addressSlice.actions.resetFilter());
    };

    return (
        data && (
            <div className={cs('wrapper')}>
                <span className={cs('title')}>Lọc:</span>
                {data.map((item, index) => (
                    <motion.div
                        onHoverStart={() =>
                            setOpenData((prev) => {
                                prev[index] = true;
                                return [...prev];
                            })
                        }
                        onHoverEnd={() =>
                            setOpenData((prev) => {
                                prev[index] = false;
                                return [...prev];
                            })
                        }
                        className={cs('filter-item-wrapper', {
                            active: dataSelected && dataSelected[index].selected,
                        })}
                        key={index}
                    >
                        <div
                            className={cs('filter-item-name')}
                            onClick={() => item.filters.length === 0 && handleChooseFilter(item.name, index)}
                        >
                            {item.name}
                            {dataSelected &&
                                dataSelected[index].selected &&
                                dataSelected[index].selected !== item.name && (
                                    <span className={cs('data-selected')}>: {dataSelected[index].selected}</span>
                                )}
                        </div>

                        <AnimatePresence>
                            {openData[index] && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'fit-content' }}
                                    exit={{ height: 0 }}
                                    className={cs('filter-item-data')}
                                >
                                    {item.filters.map((filterValue, filterIndex) => (
                                        <div
                                            onClick={() => handleChooseFilter(filterValue, index)}
                                            className={cs('filter-item-value')}
                                            key={filterIndex}
                                        >
                                            {filterValue}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
                <Tippy content="Làm mới bộ lọc" placement="bottom" interactive>
                    <span onClick={handleResetFilter} className={cs('reset-filter')}>
                        <Icons.close fill="black" />
                    </span>
                </Tippy>
            </div>
        )
    );
}

export default Filter;
