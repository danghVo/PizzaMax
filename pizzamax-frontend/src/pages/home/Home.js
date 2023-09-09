import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import Banner from './components/Banner';
import Content from './components/Content';

const cs = classNames.bind(styles);

function Home() {
    return (
        <>
            <Banner />
            <Content />

            <div className={cs('decrise-wrapper')}>
                <div className={cs('decrise-inner')}>
                    <h4 className={cs('decrise-header')}>Best Pizza in Delivery</h4>
                    <p className={cs('decrise-body')}>
                        Satisfy your cheesy cravings with the best pizza in Pakistan. Our pizzas are made fresh every
                        day and delivered fast to deliver the MAX experience. Order now on our web and app and get
                        exclusive discounts.
                    </p>
                </div>
            </div>
        </>
    );
}

export default Home;
