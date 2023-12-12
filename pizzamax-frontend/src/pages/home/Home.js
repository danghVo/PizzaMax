import { useEffect } from 'react';

import Banner from './components/Banner';
import Content from './components/Content';

function Home() {
    useEffect(() => {
        window.scrollTo(0, 0);
    });

    return (
        <>
            <Banner />
            <Content />
        </>
    );
}

export default Home;
