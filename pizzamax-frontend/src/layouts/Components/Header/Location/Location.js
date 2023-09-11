import classNames from 'classnames/bind';
import headerStyles from '../Header.module.scss';
import modalStyles from './LocationModal.module.scss';
import { useState, useRef, useEffect } from 'react';

import * as Icons from '~/components/Icons';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import images from '~/assets/images';
import { InputOption } from '~/components/Option/';

const headerCs = classNames.bind(headerStyles);
const modalCs = classNames.bind(modalStyles);

const cityOption = [
    'Faisalabad',
    'Hyderabad',
    'Karachi',
    'Kharian',
    'Lahore',
    'Multan',
    'Rawalpindi',
    'Sialkot',
    'Wah cantt',
];

const areaOption = [
    ' New Rizvia Gulzary Hijri',
    ' Vanthali Memon Association',
    'A.F GARDEN SOCIETY ',
    'A1 COMPLEX',
    'Abbas Town',
    'Abdullah Gabol Goth',
    'Abdullah Haroon Road, Karachi',
    'Abdullah Shah Ghazi - Clifton',
    'ABDULLAH SHAH GHAZI GOTH',
    'Abid Town',
    'Ablaagh e Aama CHS',
    'Abul Hassan Isphahani Road',
    'Abuzar Ghaffari  C.H.S',
    'Abuzar Ghaffari Chs Phase 2',
    'Adamjee Nagar',
];

function Location() {
    const [openModal, setOpenModal] = useState(false);
    const [orderType, setOrderType] = useState(1);
    const [locationFirst, setLocationFirst] = useState('');
    const [locationSecond, setLocationSecond] = useState('');

    const cityOptionRef = useRef();
    const areaOptionRef = useRef();
    const branchOptionRef = useRef();
    const modalRef = useRef();

    const orderTypeStorage = window.localStorage.getItem('oderType');
    const locationFirstStorage = window.localStorage.getItem('locationFirst');
    const locationSecondStorage = window.localStorage.getItem('locationSecond');
    const locationUI = locationSecondStorage + ', ' + locationFirstStorage;

    useEffect(() => {
        if (orderTypeStorage) setOrderType(orderTypeStorage);
        if (locationFirstStorage) setLocationFirst(locationFirstStorage);
        if (locationSecondStorage) setLocationSecond(locationSecondStorage);
    }, []);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleChooseDelivery = () => {
        setOrderType(1);

        cityOptionRef.current?.clearOption();
        branchOptionRef.current?.clearOption();
    };

    const handleChoosePickUp = () => {
        setOrderType(2);

        cityOptionRef.current?.clearOption();
        areaOptionRef.current?.clearOption();
    };

    const handleSetOption = (callback, selection) => {
        callback(selection);
    };

    const handleClickSelectBtn = () => {
        window.localStorage.setItem('oderType', orderType);
        window.localStorage.setItem('locationFirst', locationFirst);
        window.localStorage.setItem('locationSecond', locationSecond);
        modalRef.current.closeModal();
    };

    return (
        <>
            <Button
                className={headerCs('location')}
                handleClick={(e) => setOpenModal(true)}
                theme="default"
                icon={<Icons.location />}
                header={orderTypeStorage===1 ? 'Deliver to' : 'Pick-up from'}
            >
                {locationUI ? <span>{locationUI}</span> : ''}
            </Button>

            {openModal && (
                <Modal ref={modalRef} className={modalCs('location-modal')} onClose={handleCloseModal}>
                    <div className={modalCs('modal-logo')}>
                        <img src={images.logo} alt="logo" />
                    </div>

                    <div className={modalCs('modal-type')}>
                        <p className={modalCs('title')}>Select your order type</p>

                        <div className={modalCs('actions')}>
                            <Button
                                animation
                                className={modalCs('actions-btn', { disable: orderType===2 })}
                                theme="primary"
                                size="small"
                                handleClick={handleChooseDelivery}
                            >
                                DELIVERY
                            </Button>

                            <Button
                                animation
                                className={modalCs('actions-btn', { disable: orderType===1 })}
                                theme="primary"
                                size="small"
                                handleClick={handleChoosePickUp}
                            >
                                PICK-UP
                            </Button>
                        </div>
                    </div>

                    <div className={modalCs('modal-location')}>
                        <p className={modalCs('title')}>
                            {orderType === 1
                                ? 'Please select your location'
                                : 'Which outlet would you like to pick-up from?'}
                        </p>

                        <Button
                            className={modalCs('modal-location-btn')}
                            icon={<Icons.locationModal />}
                            theme="default"
                        >
                            Use Current Location
                        </Button>
                    </div>

                    <div className={modalCs('modal-infor')}>
                        <InputOption
                            ref={cityOptionRef}
                            selecting={{ currentSelect: locationFirst, handleSetOption, callback: setLocationFirst }}
                            className={modalCs('infor-selection')}
                            placeholder="Select City / Region"
                            optionData={cityOption}
                        />

                        {orderType === 1 ? (
                            <InputOption
                                ref={areaOptionRef}
                                selecting={{
                                    currentSelect: locationSecond,
                                    handleSetOption,
                                    callback: setLocationSecond,
                                }}
                                className={modalCs('infor-selection')}
                                placeholder="Select Area / Sub Region"
                                optionData={areaOption}
                            />
                        ) : (
                            <InputOption
                                ref={branchOptionRef}
                                selecting={{
                                    currentSelect: locationSecond,
                                    handleSetOption,
                                    callback: setLocationSecond,
                                }}
                                className={modalCs('infor-selection')}
                                placeholder="Select Branch"
                                optionData={areaOption}
                            />
                        )}

                        <Button
                            theme="primary"
                            size="small"
                            animation
                            hover
                            handleClick={handleClickSelectBtn}
                            className={modalCs('modal-select-btn', { disable: !locationFirst || !locationSecond })}
                        >
                            Select
                        </Button>
                    </div>
                </Modal>
            )}
        </>
    );
}

export default Location;
