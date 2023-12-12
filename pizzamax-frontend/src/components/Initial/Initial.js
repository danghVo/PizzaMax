import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IOService } from '~/services';
import { productThunk } from '~/store/products';
import { systemSlice, systemThunk } from '~/store/system';
import { userSelector, userThunk } from '~/store/user';

function Initial({ children }) {
    const user = useSelector(userSelector.user);
    const dispatch = useDispatch();
    const reFetch = useSelector((state) => state.system.reFetch);

    useEffect(() => {
        fetchData();
        dispatch(systemSlice.actions.reFetch(false));
    }, [reFetch]);

    useEffect(() => {
        const socket = IOService.start();
        socket.reFetch(dispatch);
        fetchData();
    }, []);

    const fetchData = () => {
        // if (!user || (user && user.role === 'admin')) {
        //     return;
        // }
        dispatch(productThunk.fetchProducts());
        dispatch(systemThunk.getBanner());
        dispatch(productThunk.typesDetail());
        if (user) {
            dispatch(userThunk.getInforByToken());
        }
    };

    return children;
}

export default Initial;
