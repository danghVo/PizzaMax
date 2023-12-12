import Header from '../Components/Header';

function FootlessLayout({ children }) {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
}

export default FootlessLayout;
