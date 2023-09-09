import classNames from 'classnames/bind';
import { useState } from 'react';

import styles from './Footer.module.scss';
import images from '~/assets/images';

const cs = classNames.bind(styles);

function Footer() {
    return (
        <div className={cs('footer-wrapper')}>
            <div className={cs('footer-inner')}>
                <div>
                    <div className="flex justify-between">
                        <div className="flex">
                            <div className={cs('footer-infor-img')}>
                                <img src={images.logo} alt="" />
                            </div>

                            <div className={cs('footer-contact')}>
                                <div className={cs('footer-contact-item')}>
                                    <h5 className={cs('title')}>PHONE</h5>
                                    <p className={cs('content')}>0868070738</p>
                                </div>
                                <div className={cs('footer-contact-item')}>
                                    <h5 className={cs('title')}>EMAIL</h5>
                                    <p className={cs('content')}>vob2014721@student.ctu.edu.vn</p>
                                </div>
                                <div className={cs('footer-contact-item')}>
                                    <h5 className={cs('title')}>ADDRESS</h5>
                                    <p className={cs('content')}>
                                        Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ, Vietnam
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className={cs('footer-open-time', 'footer-contact-item')}>
                                <h5 className={cs('title')}>OPEN TIME</h5>
                                <p className={cs('content')}>Monday - Sunday: 11:00 AM - 04:00 AM</p>
                            </div>

                            <div className={cs('footer-network', 'footer-contact-item')}>
                                <h5 className={cs('title')}>FOLLOW US:</h5>
                                <a href="https://www.facebook.com/dang.vo.199" target="_blank">
                                    <img src={images.facebookLogo} className={cs('footer-network-icon')} alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cs('footer-copyright')}>© 2023 Powered by B2014721.</div>
            </div>
        </div>
    );
}

export default Footer;
