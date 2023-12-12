import classNames from 'classnames/bind';

import styles from './AdminLayout.module.scss';
import SidebarAdmin from './components/SidebarAdmin';

const cs = classNames.bind(styles);

function AdminLayout({ children }) {
    return (
        <div className={cs('wrapper')}>
            <SidebarAdmin />
            {children}
        </div>
    );
}

export default AdminLayout;
