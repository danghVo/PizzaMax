import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';
import { LoadingModal } from '~/components/Modal';
import { userSelector } from '~/store/user';

function PrivateRoute({ children, path }) {
    const [loading, setLoading] = useState(true);
    const user = useSelector(userSelector.user);

    const isAuthorized = useMemo(() => {
        return user?.isAdmin;
    }, [user]);

    useEffect(() => {
        setLoading(false);
    }, [isAuthorized]);

    if (loading) {
        return <LoadingModal />;
    }
    if (isAuthorized) {
        return children;
    } else return <Navigate to="/NoPermission" replace={true} />;
}

export default PrivateRoute;
