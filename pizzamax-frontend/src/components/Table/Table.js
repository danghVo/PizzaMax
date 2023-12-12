import classNames from 'classnames/bind';

import styles from './Table.module.scss';
import { useState } from 'react';
import { forwardRef } from 'react';
import { useImperativeHandle } from 'react';
import Image from '../Image';

const cs = classNames.bind(styles);

function Table({ title, ActionsElement, data, handlechooseItem = () => {} }, ref) {
    const [itemIndexSelected, setItemIndexSelected] = useState(null);

    useImperativeHandle(ref, () => ({
        clearSelected: () => {
            setItemIndexSelected(null);
        },
    }));

    const setGridTemplateColumn = () => {
        return title.map(() => 'auto').join(' ');
    };

    const handleClick = (itemIndex) => {
        if (itemIndex === itemIndexSelected) {
            handlechooseItem(null);
            setItemIndexSelected(null);
        } else {
            handlechooseItem(data[itemIndex]);
            setItemIndexSelected(itemIndex);
        }
    };

    return (
        <div className={cs('wrapper')}>
            <div className={cs('wrapper-inner')} style={{ gridTemplateColumns: setGridTemplateColumn() }}>
                {title.map((titleItem, index) => (
                    <div className={cs('col')} key={index}>
                        <div className={cs('title')}>{titleItem}</div>

                        {data.map((dataItem, dataItemIndex) => (
                            <div
                                className={cs('data', {
                                    selected: dataItemIndex === itemIndexSelected,
                                })}
                                onClick={() => handleClick(dataItemIndex)}
                                key={dataItemIndex}
                            >
                                {titleItem === 'actions' && <ActionsElement dataItem={dataItem} itemId={dataItem.id} />}
                                {titleItem === 'price' ? (
                                    dataItem['price'].toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })
                                ) : titleItem === 'id' ? (
                                    dataItemIndex + 1
                                ) : titleItem === 'image' ? (
                                    <Image src={dataItem[titleItem]} className={cs('image')} />
                                ) : (
                                    dataItem[titleItem]
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {data.length === 0 && <div className={cs('no-data')}>Không có dữ liệu</div>}
        </div>
    );
}

export default forwardRef(Table);
