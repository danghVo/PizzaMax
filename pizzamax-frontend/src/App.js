import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { publicRoutes } from '~/routes';
import * as layouts from './layouts';

function App() {
    return (
        <Router>
            <Routes>
                {publicRoutes.map((route, index) => {
                    const Layout = layouts.MainLayout;
                    const Page = route.component;

                    return (
                        <Route
                            path={route.path}
                            element={
                                <Layout>
                                    <Page />
                                </Layout>
                            }
                            key={index}
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
