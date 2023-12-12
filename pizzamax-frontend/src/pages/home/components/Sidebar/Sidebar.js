import classNames from 'classnames/bind';
import { useState, useRef, useEffect } from 'react';

import styles from './Sidebar.module.scss';
import SideBarItem from './SidebarItem/SidebarItem';

const cs = classNames.bind(styles);

function Sidebar({ categories }) {
    const [chosing, setChosing] = useState(0);
    const [inView, setInView] = useState(true);

    const wrapperRef = useRef();
    const titleRef = useRef();

    useEffect(() => {
        const handleStick = () => {
            const distanceTopOfTitle = titleRef.current.getBoundingClientRect().top;

            if (distanceTopOfTitle < 40) setInView(false);
            else setInView(true);
        };
        window.addEventListener('scroll', handleStick);

        return () => window.removeEventListener('scroll', handleStick);
    }, [inView]);

    const handleChooseCategorie = (item, index) => {
        setChosing(index);
        const productsOfType = document.getElementById(item);
        if (productsOfType) {
            const titleElement = productsOfType.getElementsByTagName('h3')[0];
            titleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            window.scrollTo(0, window.scrollY + 175);
        }
    };

    return (
        <div ref={wrapperRef} className={cs('wrapper')}>
            <div className={cs('inner')}>
                <h2 ref={titleRef} className={cs('title')}>
                    Loại sản phẩm
                </h2>

                <div className={cs('categorie-list', { stick: !inView })}>
                    {categories.map((item, index) => (
                        <SideBarItem
                            id={index}
                            setChosing={setChosing}
                            key={index}
                            data={item}
                            onClick={() => handleChooseCategorie(item, index)}
                            chosing={chosing}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
