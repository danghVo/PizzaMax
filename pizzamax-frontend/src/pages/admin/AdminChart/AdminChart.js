import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';

import styles from './AdminChart.module.scss';
import { cartSelector, cartThunk } from '~/store/cart';
import store from '~/store';
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
const cs = classNames.bind(styles);

function AdminChart() {
    const [filter, setFilter] = useState({ target: '', type: '' });
    const [dataChart, setDataChart] = useState([]);
    const [specialValue, setSpecialValue] = useState(null);
    const [chart, setChart] = useState(null);
    const [filterName, setFilterName] = useState('');

    const chartRef = useRef(null);

    const dispatch = useDispatch();

    const detailsData = cartSelector.detailData(store.getState());
    const cartSuccess = useSelector(cartSelector.cartSuccess);

    useEffect(() => {
        dispatch(cartThunk.getAllDetail());
        dispatch(cartThunk.getAllCart());
    }, []);

    useEffect(() => {
        let specialValue = null;
        let targetFilter = [];
        let field = null;
        const day = parseInt(new Date().getDate());
        let year = parseInt(new Date().getFullYear());
        let month = parseInt(new Date().getMonth()) + 1;

        switch (filter.target) {
            case 'Sản phẩm':
                targetFilter = detailsData.products;
                field = 'name';
                setChart('Line');
                specialValue = filterData(targetFilter, field);
                break;
            case 'Loại sản phẩm':
                targetFilter = detailsData.types;

                field = 'type';
                setChart('Line');
                specialValue = filterData(targetFilter, field);
                break;
            case 'Đơn hàng':
                setChart('Bar');
                setFilterName('');
                switch (filter.type) {
                    case 'Ngày':
                        if (cartSuccess.length > 0) {
                            setDataChart(
                                ['5', '4', '3', '2', '1', '0'].map((dayGap) => {
                                    let filterDay = day - dayGap;
                                    let month = parseInt(new Date().getMonth()) + 1;

                                    if (filterDay <= 0) {
                                        filterDay =
                                            new Date(new Date().getFullYear(), month - 1, 0).getDate() + filterDay;
                                        month = month - 1;
                                    }

                                    const cartSuccessInMonth = cartSuccess.filter((item) => {
                                        return item.checkOutAt.includes(`${filterDay}/${month}/${year}`);
                                    });
                                    const quantity = cartSuccessInMonth.length;
                                    const total = cartSuccessInMonth.reduce((accu, curr) => accu + curr.total, 0);

                                    if (specialValue === null || specialValue.total < total) {
                                        specialValue = {
                                            name: 'Ngày ' + filterDay + '/' + month + '/' + year,
                                            quantity,
                                            total,
                                        };
                                    }

                                    return {
                                        name: 'Ngày ' + filterDay + '/' + month + '/' + year,
                                        quantity,
                                        total,
                                    };
                                }),
                            );
                        }
                        break;
                    case 'Tháng':
                        if (cartSuccess.length > 0) {
                            setDataChart(
                                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((month) => {
                                    const cartSuccessInMonth = cartSuccess.filter((item) => {
                                        return item.checkOutAt.includes(`/${month}/${year}`);
                                    });
                                    const quantity = cartSuccessInMonth.length;
                                    const total = cartSuccessInMonth.reduce((accu, curr) => accu + curr.total, 0);

                                    if (specialValue === null || specialValue.total < total) {
                                        specialValue = { name: 'Tháng ' + month + '/' + year, quantity, total };
                                    }

                                    return {
                                        name: 'Tháng ' + month + '/' + year,
                                        quantity,
                                        total,
                                    };
                                }),
                            );
                        }
                        break;
                    case 'Năm':
                        if (cartSuccess.length > 0) {
                            setDataChart(
                                ['5', '4', '3', '2', '1', '0'].map((yearGap) => {
                                    const filterYear = (year - yearGap).toString();

                                    const cartSuccessYear = cartSuccess.filter((item) => {
                                        const itemYear = item.checkOutAt.split('/')[2];
                                        return itemYear === filterYear;
                                    });
                                    const quantity = cartSuccessYear.length;
                                    const total = cartSuccessYear.reduce((accu, curr) => accu + curr.total, 0);

                                    if (specialValue === null || specialValue.total < total) {
                                        specialValue = { name: 'Năm ' + filterYear, quantity, total };
                                    }

                                    return {
                                        name: 'Năm ' + filterYear,
                                        quantity,
                                        total,
                                    };
                                }),
                            );
                        }
                        break;
                    default:
                }
            default:
        }

        setSpecialValue(specialValue);
    }, [filter, cartSuccess, detailsData]);

    const filterData = (targetFilter, field) => {
        const day = parseInt(new Date().getDate());
        const month = parseInt(new Date().getMonth()) + 1;
        const year = parseInt(new Date().getFullYear());
        let specialValue = null;

        switch (filter.type) {
            case 'Ngày':
                if (detailsData.allDetails.length > 0) {
                    setFilterName(`Ngày ${day}/${month}/${year}`);
                    setDataChart(
                        targetFilter.map((product) => {
                            const productDetail = detailsData.allDetails.filter((item) => {
                                const cart = cartSuccess.find((cart) => cart.uuid === item.cartUUID);
                                if (cart === undefined) return false;

                                return (
                                    item[field] === product[field] &&
                                    cart.checkOutAt.includes(`${day}/${month}/${year}`)
                                );
                            });

                            const quantity = productDetail.reduce((accu, curr) => accu + curr.quantity, 0) || 0;
                            const total = productDetail.reduce((accu, curr) => accu + curr.total, 0) || 0;

                            if (specialValue === null || specialValue.quantity < quantity) {
                                specialValue = { name: product[field], quantity, total };
                            }

                            return {
                                name: product[field],
                                quantity,
                                total,
                            };
                        }),
                    );
                }
                break;
            case 'Tháng':
                if (detailsData.allDetails.length > 0) {
                    setFilterName(`Tháng ${month}/${year}`);

                    setDataChart(
                        targetFilter.map((product) => {
                            const productDetail = detailsData.allDetails.filter((item) => {
                                const cart = cartSuccess.find((cart) => cart.uuid === item.cartUUID);
                                if (cart === undefined) return false;

                                return item[field] === product[field] && cart.checkOutAt.includes(`${month}/${year}`);
                            });
                            const quantity = productDetail.reduce((accu, curr) => accu + curr.quantity, 0);
                            const total = productDetail.reduce((accu, curr) => accu + curr.total, 0);

                            if (specialValue === null || specialValue.quantity < quantity) {
                                specialValue = { name: product[field], quantity, total };
                            }

                            return {
                                name: product[field],
                                quantity,
                                total,
                            };
                        }),
                    );
                }
                break;
            case 'Năm':
                if (detailsData.allDetails.length > 0) {
                    setFilterName(`Năm ${year}`);
                    setDataChart(
                        targetFilter.map((product) => {
                            const productDetail = detailsData.allDetails.filter((item) => {
                                const cart = cartSuccess.find((cart) => cart.uuid === item.cartUUID);
                                if (cart === undefined) return false;

                                return item[field] === product[field] && cart.checkOutAt.includes(`${year}`);
                            });
                            const quantity = productDetail.reduce((accu, curr) => accu + curr.quantity, 0);
                            const total = productDetail.reduce((accu, curr) => accu + curr.total, 0);

                            if (specialValue === null || specialValue.quantity < quantity) {
                                specialValue = { name: product[field], quantity, total };
                            }

                            return {
                                name: product[field],
                                quantity,
                                total,
                            };
                        }),
                    );
                }
                break;
            default:
        }

        return specialValue;
    };

    return (
        <div className={cs('wrapper')}>
            <div className={cs('sideBar')}>
                <div className={cs('header')}>Thống kê</div>
                {[
                    { name: 'Đối tượng', filterType: 'target', subFilter: ['Sản phẩm', 'Loại sản phẩm', 'Đơn hàng'] },
                    { name: 'Loại thống kê', filterType: 'type', subFilter: ['Ngày', 'Tháng', 'Năm'] },
                ].map((item, index) => {
                    return (
                        <div key={index}>
                            <div className={cs('sideBar-item')}>{item.name}</div>
                            <div className={cs('sub-item-list')}>
                                {item.subFilter.map((subItem, subIndex) => {
                                    return (
                                        <motion.div
                                            className={cs('sideBar-sub-item', {
                                                active: filter.target === subItem || filter.type === subItem,
                                            })}
                                            key={subIndex}
                                            onClick={() =>
                                                setFilter((prev) => ({ ...prev, [item.filterType]: subItem }))
                                            }
                                            initial={{ padding: '12px 12px' }}
                                            animate={
                                                filter.target === subItem || filter.type === subItem
                                                    ? { padding: '16px 12px' }
                                                    : { padding: '12px 12px' }
                                            }
                                        >
                                            {subItem}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className={cs('chart-wrapper')} ref={chartRef}>
                {filter.target && filter.type ? (
                    chart && (
                        <>
                            {chart === 'Line' && (
                                <LineChart
                                    className={cs('chart')}
                                    width={chartRef.current ? chartRef.current.clientWidth - 200 : 0}
                                    height={chartRef.current ? chartRef.current.clientHeight - 100 : 0}
                                    data={dataChart}
                                    margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tickSize={8} />
                                    <YAxis
                                        tickSize={4}
                                        tickMargin={0}
                                        tickFormatter={(value) =>
                                            parseInt(value).toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value, name, props) => [
                                            <div className={cs('tool-tip')}>
                                                <div className={cs('item')}>
                                                    {name}:
                                                    <div className={cs('value')}>
                                                        {parseInt(value).toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        })}
                                                    </div>
                                                </div>
                                                <div className={cs('item', 'black')}>
                                                    Số lượng:{' '}
                                                    <div className={cs('value')}>{props.payload.quantity}</div>
                                                </div>
                                            </div>,
                                        ]}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="total" name="Tổng tiền " stroke="rgb(239, 55, 6)" />
                                </LineChart>
                            )}

                            {chart === 'Bar' && (
                                <BarChart
                                    // barGap={0}
                                    barSize={32}
                                    className={cs('chart')}
                                    width={chartRef.current ? chartRef.current.clientWidth - 200 : 0}
                                    height={chartRef.current ? chartRef.current.clientHeight - 100 : 0}
                                    data={dataChart}
                                    margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tickSize={8} />
                                    <YAxis
                                        tickSize={4}
                                        tickMargin={0}
                                        tickFormatter={(value) =>
                                            parseInt(value).toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND',
                                            })
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value, name, props) => [
                                            <div className={cs('tool-tip')}>
                                                <div className={cs('item')}>
                                                    {name}:
                                                    <div className={cs('value')}>
                                                        {parseInt(value).toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        })}
                                                    </div>
                                                </div>
                                                <div className={cs('item', 'black')}>
                                                    Số lượng:{' '}
                                                    <div className={cs('value')}>{props.payload.quantity}</div>
                                                </div>
                                            </div>,
                                        ]}
                                    />
                                    <Legend />
                                    <Bar dataKey="total" name="Tổng tiền " fill="rgb(239, 55, 6)" />
                                </BarChart>
                            )}

                            {specialValue && (
                                <div className={cs('special')}>
                                    <div className={cs('header')}>{filterName}</div>
                                    <div className={cs('header')}>Bán chạy nhất:</div>
                                    <div className={cs('body')}>
                                        <div className={cs('title')}>
                                            <span className={cs('value')}>{specialValue.name}</span>
                                        </div>
                                        <div className={cs('title')}>
                                            Số lượng: <span className={cs('value')}>{specialValue.quantity} </span>
                                        </div>
                                        <div className={cs('title')}>
                                            Tổng cộng:{' '}
                                            <span className={cs('value')}>
                                                {parseInt(specialValue.total).toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )
                ) : (
                    <div className={cs('empty')}>
                        Hãy chọn {!filter.target && 'đối tượng thống kê'}{' '}
                        {!filter.type && `${!filter.target ? ', ' : ''} loại thống kê`}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminChart;
