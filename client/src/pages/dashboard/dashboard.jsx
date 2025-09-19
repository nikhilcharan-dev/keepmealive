import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AddUrl from "./components/addUrl.jsx";
import EditUrl from "./components/editUrl.jsx";

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
    const [editUrlId, setEditUrlId] = useState(null);

    const navigate = useNavigate();

    const [duration, setDuration] = useState(15);

    if (!user) {
        window.location.href = "/authentication";
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/url/get-urls?id=${userId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                setUrls(response.data.urls || []);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch user data');
            }
        };
        fetchUserData();
    }, [changes]);

    const handleUrlDelete = async (url) => {
        setLoading(true);
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/url/delete-url`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        id: userId,
                        url
                    }
                }
            );
            alert('URL deleted successfully');
            setUrls(urls.filter(item => item.address !== url));
            setChanges(prev => prev + 1);
        } catch (err) {
            console.error(err);
            if (err.message === 'session expired') {
                alert('Session expired, please login again');
                handleLogout();
            }
            setError('Failed to delete URL');
        } finally {
            setLoading(false);
        }
    };

    const handleDurationChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/url/set-duration`,
                {
                    id: userId,
                    duration
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            alert('Duration updated successfully');
        } catch (err) {
            console.error(err);
            if (err.message === 'session expired') {
                alert('Session expired, please login again');
                handleLogout();
            }
            setError('Failed to update duration');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/authentication';
    };

    return (
        <section className={styles.dashboard}>
            <header className={styles.header}>
                <h1>Welcome, {user.username} ~</h1>
                <p>
                    Go through our <span onClick={() => navigate('/docs')} className={styles.link}>Docs</span> to further utilise this service for efficiency.
                </p>
            </header>

            <div className={styles.actions}>
                <h2>Your URLs: </h2>
                <div className={styles.actionButtons}>
                    <button className={styles.button} onClick={() => setAddUrlVisible(!addUrlVisible)}>Add URL</button>
                    <button className={styles.button} onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {addUrlVisible && (
                <AddUrl
                    setUrls={setUrls}
                    setChanges={setChanges}
                    setAddUrlVisible={setAddUrlVisible}
                />
            )}

            <div className={styles.urls}>
                {Array.isArray(urls) && urls.length > 0 ? (
                    urls.map((url, id) => (
                        <div key={id} className={styles.url}>
                            <p>🔗 Address {id + 1}: {url.address}</p>
                            <div className={styles.controls}>
                                <button
                                    className={styles.button}
                                    onClick={() => {
                                        setEditUrlVisible(!editUrlVisible);
                                        setEditUrlId(id);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className={`${styles.button} ${styles.delete}`}
                                    onClick={() => handleUrlDelete(url.address)}
                                >
                                    Delete
                                </button>
                            </div>
                            {editUrlId === id && editUrlVisible && (
                                <EditUrl
                                    url={url}
                                    setUrls={setUrls}
                                    setChanges={setChanges}
                                    setEditUrlVisible={setEditUrlVisible}
                                    urlId={id}
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <p className={styles.empty}>No URLs added yet. Try adding one!</p>
                )}
            </div>
        </section>
    );
};

export default Dashboard;
