import axios from "axios";
import {useEffect, useState} from "react";

import styles from './editUrl.module.css';

const EditUrl = ({ url, setUrls, setChanges, setEditUrlVisible, urlId }) => {
    const [newUrl, setNewUrl] = useState(url.address ?? '');
    const [duration, setDuration] = useState(url.pingFrequency);
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/authentication';
    }

    const validateURL = async (curUrl) => {
        try {
            const res = await axios.get(`https://${curUrl}`);
            return Math.floor(res.status / 100) === 2;
        } catch(err) {
            console.log(err);
            return false;
        }
    }

    useEffect(() => {
        (async () => setIsValid(await validateURL(newUrl)))();
    }, [newUrl]);

    const editUrl = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/url/edit-url`, {
                userId,
                urlIndex: urlId,
                urlAddress: newUrl,
                duration: duration,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
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
            setEditUrlVisible(prev => !prev)
        }
    }

    return (
        <section>
            <form className={styles.form} onSubmit={editUrl}>
                <div className={styles.edit}>
                    <input type="text" placeholder="Enter URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
                    <p className={styles.indicator}>{isValid ? "valid" : "in-valid"}</p>
                </div>
                <div className={styles.buttons}>
                    <button type="submit">Save Changes</button>
                    <button onClick={() => setEditUrlVisible(prev => !prev)}>Cancel</button>
                </div>
            </form>
        </section>
    )
}

export default EditUrl;
