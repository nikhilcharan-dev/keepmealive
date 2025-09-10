import React, { useState, useEffect } from 'react';
import axios from "axios";


const AddUrl = React.lazy(() => import("./components/addUrl.jsx"));
const EditUrl = React.lazy(() => import("./components/editUrl.jsx"));

import styles from './dashboard.module.css';

const Dashboard = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')));
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId');
    const [changes, setChanges] = useState(0);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [addUrlVisible, setAddUrlVisible] = useState(false);
    const [editUrlVisible, setEditUrlVisible] = useState(false);

    const [duration, setDuration] = useState(15);

    if(!user) {
        window.location.href = "/authentication";
    }

    useEffect(() => {
        const UpdateUserData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/url/get-urls?id=${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                setUrls(response.data.urls);
            } catch(err) {
                console.error(err);
                setError('Failed to fetch user data');
            }
        }
        UpdateUserData();
    }, [changes]);

    const handleUrlDelete = async (url) => {
        setLoading(true);
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/url/delete-url`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    id: userId,
                    url
                }
            });
            console.log(response.data);
            alert('URL deleted successfully');
            setUrls(urls.filter(item => item !== url));
            setChanges(prev => prev + 1);
        } catch(err) {
            console.error(err);
            if(err.message === 'session expired') {
                alert('Session expired, please login again');
                handleLogout();
            }
            setError('Failed to delete URL');
        } finally {
            setLoading(false);
        }
    }

    const handleDurationChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/url/set-duration`, {
                id: userId,
                duration
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            alert('Duration updated successfully');
        } catch(err) {
            console.error(err);
            if(err.message === 'session expired') {
                alert('Session expired, please login again');
                handleLogout();
            }
            setError('Failed to update duration');
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/authentication';
    }

    return (
        <section>
            <h1>Dashboard</h1>
            <p>This is the dashboard page.</p>
            <p>Welcome to the dashboard!</p>

            <h2>User Details</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>


            <h2>URLs</h2>
            <button onClick={() => setAddUrlVisible(!addUrlVisible)}>Add URL</button>
            {addUrlVisible && <AddUrl setUrls={setUrls} setChanges={setChanges} setAddUrlVisible={setAddUrlVisible} />}
            {Array.isArray(urls) && urls.map((url, id) => (
                <div key={id}>
                    <p>Address: {url.address}</p>
                    <p>Status: {url.status}</p>
                    <button onClick={() => setEditUrlVisible(!editUrlVisible)}>Edit URL</button>
                    <button onClick={() => handleUrlDelete(url.address)} >Delete Url</button>
                    {editUrlVisible && <EditUrl url={url} setUrls={setUrls} setChanges={setChanges} setEditUrlVisible={setEditUrlVisible} urlId={id} />}
                </div>
            ))}

            <button onClick={handleLogout}>Logout</button>
        </section>
    )
}

export default Dashboard;
