import classNames from 'classnames/bind';

import styles from './Infro.module.scss';
import Address from './Components/Address';
import Price from './Components/Price';
import { useSelector } from 'react-redux';

const cs = classNames.bind(styles);

function Infor() {
    return (
        <div className={cs('wrapper')}>
            <Address />
            <Price />
        </div>
    );
}

export default Infor;
