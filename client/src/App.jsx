import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import routes from './routes.jsx';

function App() {
    return (
        <Suspense fallback={null}>
            <RouterProvider router={ createBrowserRouter(routes) } />
        </Suspense>
    )
}

export default App;
