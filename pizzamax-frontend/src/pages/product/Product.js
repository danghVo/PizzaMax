import classNames from 'classnames/bind';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import styles from './Product.module.scss';
import ProductShow from './Components/ProductShow';
import Relation from './Components/Relation';
import { productsSelector } from '~/store/products';
import Navigation from '~/components/Navigation';

const cs = classNames.bind(styles);

function Product() {
    const [productsOfType, setProductsOfType] = useState({ products: [] });
    const { type, productName } = useParams();

    const products = useSelector(productsSelector.products);

    useEffect(() => {
        setProductsOfType(products.find((item) => item.type === type) || { products: [] });
    }, [products, type]);

    return (
        <div className={cs('wrapper')}>
            <div className={cs('product-show-wrapper')}>
                <Navigation />
                <ProductShow data={productsOfType.products.find((product) => product.name === productName)} />
            </div>
            <Relation
                type={type}
                products={productsOfType.products.filter((product) => product.name !== productName)}
            />
        </div>
    );
}

export default Product;
