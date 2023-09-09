import classNames from 'classnames/bind';

import Header from '../Components/Header';
import Footer from '../Components/Footer';
import styles from './MainLayout.module.scss';

const cs = classNames.bind(styles);

function MainLayout({ children }) {
    return (
        <div>
            <Header />
            <div className={cs('body')}>{children}</div>
            <Footer />
        </div>
    );
}

export default MainLayout;
