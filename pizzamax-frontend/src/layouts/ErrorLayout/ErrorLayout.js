import Header from '../Components/Header';

function ErrorLayout({ children }) {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
}

export default ErrorLayout;
