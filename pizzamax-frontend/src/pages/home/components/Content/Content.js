import classNames from 'classnames/bind';
import { useDispatch, useSelector } from 'react-redux';

import Sidebar from '../Sidebar';
import HomeProduct from '~/components/HomeProduct';
import styles from './Content.module.scss';
import { productsSelector, productsSlice } from '~/store/products';
import Search from '~/components/Search';
import { useEffect, useMemo } from 'react';
import Filter from '~/components/Filter';
import { userSelector } from '~/store/user';
import { checkTypeAvail } from '~/utils';

const cs = classNames.bind(styles);

function Content() {
    const products = useSelector(productsSelector.productsShow);
    const typesDetail = useSelector(productsSelector.rawTypes);
    const favorite = useSelector(productsSelector.favorite);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(productsSlice.actions.resetFilter());
    }, [favorite]);

    const types = useMemo(() => {
        return products
            .filter((item) => {
                return item.products.some((product) => product.hide === false);
            })
            .map((item) => checkTypeAvail(item.type, typesDetail))
            .filter((item) => item !== '');
    }, [products]);

    const checkShowType = (item) => {
        return item.products.some((product) => product.hide === false);
    };

    const handleFitler = (filter) => {
        dispatch(productsSlice.actions.filterHome(filter));
    };

    return (
        <div id="Content" className={cs('wrapper')}>
            <Sidebar categories={types} />
            <div className={cs('wrapper-search-page')}>
                <div className={cs('action-product-wrapper')}>
                    <Filter
                        filterAction={handleFitler}
                        data={[
                            { name: 'Yêu thích', filters: [] },
                            { name: 'Đang giảm giá', filters: [] },
                        ]}
                        page="home"
                    />
                    <Search className={cs('search')} />
                </div>
                <div className={cs('product-list-wrapper')}>
                    {products.length > 0 && types.length > 0 ? (
                        products.map(
                            (item, index) =>
                                checkShowType(item) &&
                                types.includes(item.type) && (
                                    <div key={index} id={item.type}>
                                        <h3 className={cs('product-type')}>{item.type}</h3>
                                        <div className="grid-cols-3 grid -mx-4">
                                            {item.products.map((product, index) => (
                                                <HomeProduct key={index} data={product} />
                                            ))}
                                        </div>
                                    </div>
                                ),
                        )
                    ) : (
                        <div className={cs('empty')}>Không có sản phẩm</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Content;
