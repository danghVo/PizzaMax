import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Sidebar from '../Sidebar';
import HomeProduct from '../HomeProduct';
import styles from './Content.module.scss';
import * as Icons from '~/components/Icons';
import { useDebounce } from '~/hooks';
import { productsSlice, productThunk, productsSelector } from '~/store/products';
import { userSelector } from '~/store/user';

const cs = classNames.bind(styles);

function Content() {
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch();

    const products = useSelector(productsSelector.productsShow) || [];
    const favorites = useSelector(userSelector.favorites);

    const debounceSearch = useDebounce(searchText, 500);

    useEffect(() => {
        dispatch(productThunk.fetchProducts());
    }, []);

    useEffect(() => {
        dispatch(productsSlice.actions.searchProduct(debounceSearch || ''));
    }, [debounceSearch]);

    const handleInput = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div id="Content" className={cs('wrapper')}>
            <Sidebar categories={products.map((item) => item.type)} />
            <div className={cs('wrapper-search-page')}>
                <div className={cs('wrapper-search')}>
                    <div className={cs('inner-search')}>
                        <Icons.magnifying className={cs('search-icon')} />
                        <input
                            className={cs('search-input')}
                            placeholder="Search products here..."
                            value={searchText}
                            onChange={handleInput}
                        />
                    </div>
                </div>
                <div className={cs('product-list-wrapper')}>
                    {products &&
                        products.map((item, index) => (
                            <div key={index} id={item.type}>
                                <h3 className={cs('product-type')}>{item.type}</h3>
                                <div className="grid-cols-3 grid -mx-4">
                                    {item.products.map((product, index) => (
                                        <HomeProduct
                                            key={index}
                                            favorite={favorites.includes(product.id)}
                                            data={product}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Content;
