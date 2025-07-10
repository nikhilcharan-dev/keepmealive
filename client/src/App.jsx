import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import routes from './routes.jsx';
import "./App.css"

function App() {
    return (
        <Suspense fallback={null}>
            <RouterProvider router={ createBrowserRouter(routes) } />
        </Suspense>
    )
}

export default App;
