import Tippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import styles from '../UserAction.module.scss';

const cs = classNames.bind(styles);

function UserMenu({ user }) {
    return <Tippy render={(attrs) => <div {...attrs}>User Menu</div>}></Tippy>;
}

export default UserMenu;
