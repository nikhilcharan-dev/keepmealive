import { lazy } from "react";

const Home = lazy(() => import('./pages/dashboard/dashboard.jsx'));
const Authentication = lazy(() => import('./pages/authentication/authentication.jsx'));
const Layout = lazy(() => import('./assets/layout/layout.jsx'));

const routes = [
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '', element: Home
            }
        ]
    },
    {
        path: '/authentication',
        element: <Authentication />
    }
]

export default routes;