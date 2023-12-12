import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useEffect } from 'react';

function MainLayout({ children }) {
    useEffect(() => {
        window.scroll({
            top: 0,
            left: 0,
        });
    });

    return (
        <div>
            <Header />
            <div>{children}</div>
            <Footer />
        </div>
    );
}

export default MainLayout;
