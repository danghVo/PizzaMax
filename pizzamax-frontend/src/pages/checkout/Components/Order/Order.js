import classNames from 'classnames/bind';

import styles from './Order.module.scss';
import ProductList from '~/components/ProductList';
import CommonTemplate from '../CommonTemplate';

const cs = classNames.bind(styles);

function Order({ products }) {
    return (
        <CommonTemplate header={'Đơn hàng của bạn'}>
            <div className={cs('product-list-wrapper')}>
                <ProductList products={products} />
            </div>
        </CommonTemplate>
    );
}

export default Order;
