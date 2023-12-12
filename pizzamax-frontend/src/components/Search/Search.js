import classNames from 'classnames/bind';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import styles from './Search.module.scss';
import { useDebounce } from '~/hooks';
import * as Icons from '~/components/Icons';
import { productsSlice } from '~/store/products';
import { userSlice } from '~/store/user';
import { addressSlice } from '~/store/address';

const cs = classNames.bind(styles);

function Search({ className, searchFor = 'product' }) {
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch();

    const debounceSearch = useDebounce(searchText, 500);

    useEffect(() => {
        if (searchFor === 'product') {
            dispatch(productsSlice.actions.searchProduct(debounceSearch || ''));
        } else if (searchFor === 'type') {
            dispatch(productsSlice.actions.searchType(debounceSearch || ''));
        } else if (searchFor === 'time') {
            dispatch(productsSlice.actions.searchTime(debounceSearch || ''));
        } else if (searchFor === 'user') {
            dispatch(userSlice.actions.searchUser(debounceSearch || ''));
        } else if (searchFor === 'address') {
            dispatch(addressSlice.actions.searchAddress(debounceSearch || ''));
        }
    }, [debounceSearch]);

    const handleInput = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div className={[cs('wrapper-search'), className].join(' ')}>
            <div className={cs('inner-search')}>
                <Icons.magnifying className={cs('search-icon')} />
                <input
                    className={cs('search-input')}
                    placeholder={`Tìm kiếm ${searchFor}...`}
                    value={searchText}
                    onChange={handleInput}
                />
            </div>
        </div>
    );
}

export default Search;
