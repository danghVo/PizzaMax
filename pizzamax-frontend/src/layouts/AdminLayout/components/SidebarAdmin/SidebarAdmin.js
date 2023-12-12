import classNames from 'classnames/bind';
import { motion } from 'framer-motion';

import styles from './SidebarAdmin.module.scss';
import Button from '~/components/Button';
import * as Icons from '~/components/Icons';
import { useHref, useNavigate } from 'react-router';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { systemSelector } from '~/store/system';
import store from '~/store';

const cs = classNames.bind(styles);

const sidebarItemList = ['product', 'store', 'user', 'cart', 'banner', 'chart'];

function SidebarAdmin() {
    const [activePosition, setActivePosition] = useState({ prev: null, next: null });
    const path = useHref();
    const navigate = useNavigate();

    const orderInform = useSelector(systemSelector.orderInform);
    const orderInformMessage = useSelector(systemSelector.orderInformMessage);

    const handleClick = (e, value) => {
        const element = e.target;
        const nextPosition = element.getBoundingClientRect().top;
        setActivePosition({ prev: activePosition.next || nextPosition, next: nextPosition });

        navigate(`/admin/${value}`);
    };

    return (
        <div className={cs('sidebar-admin-wrapper')}>
            <motion.div
                className={cs('active')}
                initial={
                    activePosition.prev ? { top: activePosition.prev } : { opacity: 0, top: activePosition.next || 200 }
                }
                animate={activePosition.next ? { top: activePosition.next, opacity: 1 } : { opacity: 0, top: 200 }}
            />
            <div className={cs('sidebar-admin-item', 'home-item')}>
                <Button
                    className={cs('sidebar-admin-btn')}
                    animation
                    hover
                    handleClick={() => navigate('/')}
                    icon={<Icons.home />}
                    type="icon"
                />

                <div className={cs('bell-wrapper')}>
                    <Button className={cs('sidebar-admin-btn')} animation hover icon={<Icons.bell />} type="icon" />
                    <div className={cs('quantity')}>{orderInform}</div>

                    <div className={cs('message-list')}>
                        {orderInform > 0 ? (
                            orderInformMessage.map((value, index) => (
                                <div className={cs('message-item')} key={index}>
                                    {value}
                                </div>
                            ))
                        ) : (
                            <div className={cs('empty')}>Không có đơn hàng mới nào</div>
                        )}
                    </div>
                </div>
            </div>
            <div className={cs('sidebar-admin-list')}>
                {sidebarItemList.map((value, index) => {
                    const Icon = Icons[value];
                    return (
                        <div className={cs('sidebar-admin-item')} key={index}>
                            <Button
                                className={cs('sidebar-admin-btn')}
                                animation
                                hover
                                handleClick={(e) => handleClick(e, value)}
                                icon={<Icon />}
                                type="icon"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default SidebarAdmin;
