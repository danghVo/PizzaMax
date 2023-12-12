import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';

import { privateRoutes, publicRoutes, PrivateRoute } from '~/routes';
import * as layouts from './layouts';
import Announcement from './components/Announcement';
import Initial from './components/Initial';
import React from 'react';

function App() {
    const renderRoute = (route, isPrivate = false, isChild = false) => {
        const PrivateComponent = isPrivate ? PrivateRoute : React.Fragment;
        return route.map((route, index) => {
            let Layout = route.Layout || layouts.MainLayout;
            if (isChild) {
                Layout = React.Fragment;
            }
            const Page = route.component;
            const element = (
                <>
                    <PrivateComponent>
                        <Layout>
                            <Page />
                        </Layout>
                    </PrivateComponent>
                </>
            );

            return (
                <Route path={route.path} element={element} key={route.path}>
                    {route.children && renderRoute(route.children, isPrivate, true)}
                </Route>
            );
        });
    };

    return (
        <>
            <Announcement />
            <Initial>
                <Router>
                    <Routes>
                        {renderRoute(publicRoutes)}
                        {renderRoute(privateRoutes, true)}
                    </Routes>
                </Router>
            </Initial>
        </>
    );
}

export default App;
