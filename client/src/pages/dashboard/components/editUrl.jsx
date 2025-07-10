import axios from "axios";
import { useState } from "react";

import styles from './editUrl.module.css';

const EditUrl = ({ url, setUrls, setChanges, setEditUrlVisible }) => {
    const [newUrl, setNewUrl] = useState(url);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/authentication';
    }

    const editUrl = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/url/edit-url`, {
                id: userId,
                url: newUrl,
                oldUrl: url
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            alert('URL updated successfully');
            setUrls(prev => prev.map(item => item === url ? newUrl : item));
            setChanges(prev => prev + 1);
            setEditUrlVisible(false);
        } catch(err) {
            console.error(err);
            if(err.message === 'session expired') {
                alert('Session expired, please login again');
                handleLogout();
            }
            setError('Failed to update URL');
        } finally {
            setLoading(false);
        }
    }

    return (
        <section >
            <form className={styles.form} onSubmit={editUrl}>
                <input type="text" placeholder="Enter URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
                <button type="submit">Edit URL</button>
            </form>
        </section>
    )
}

export default EditUrl;