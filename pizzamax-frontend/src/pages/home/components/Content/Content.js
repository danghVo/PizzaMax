import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Sidebar from '../Sidebar';
import HomeProduct from '../HomeItem';
import styles from './Content.module.scss';
import * as Icons from '~/components/Icons';
import { productListSlice, fetchProductList, productListSelector } from '~/store/productList';

const cs = classNames.bind(styles);

function Content() {
    const [searchText, setSearchText] = useState('');

    const dispatch = useDispatch();

    const productList = useSelector(productListSelector.productList);

    useEffect(() => {
        dispatch(fetchProductList());
    }, []);

    useEffect(() => {
        dispatch(productListSlice.actions.searchProduct(searchText));
    }, [searchText]);

    const handleInput = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <div id="Content" className={cs('wrapper')}>
            <Sidebar categories={productList.map((item) => item.type)} />
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
                    {productList &&
                        productList.map((item, index) => (
                            <div key={index} id={item.type}>
                                <h3 className={cs('product-type')}>{item.type}</h3>
                                <div className="grid-cols-3 grid -mx-4">
                                    {item.products.map((product, index) => (
                                        <HomeProduct key={index} data={product} />
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
