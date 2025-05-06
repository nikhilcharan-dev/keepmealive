import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/navbar.jsx';
import Footer from '../footer/footer.jsx';

const Layout = () => {
    return (
        <>
            <Navbar />
                <main>
                    <Outlet />
                </main>
            <Footer />
        </>
    );
}

export default Layout;