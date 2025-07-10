import styles from './addUrl.module.css';
import { useState } from "react";
import axios from "axios";

const AddUrl = ({ setUrls, setChanges, setAddUrlVisible }) => {
    const [url, setUrl] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/authentication';
    }

    const addUrl = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('UserId: ', userId);
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/url/add-url`, {
                id: userId,
                url
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setUrl(url);
            setChanges(prev => prev + 1);
            alert('URL added successfully');
            setAddUrlVisible(false);
        } catch(err) {
            console.error(err.error);
            if(err.message === 'session expired') {
                alert('Session expired, please login again');
                handleLogout();
            }
            setError('Failed to add URL');
        } finally {
            setLoading(false);
        }
    }

    return (
        <section >
            <form className={styles.form} onSubmit={addUrl}>
                <input type="text" placeholder="Enter URL" onChange={(e) => setUrl(e.target.value)} />
                <button type="submit">Add URL</button>
            </form>
        </section>
    )
}

export default AddUrl;