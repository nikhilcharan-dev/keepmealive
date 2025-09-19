import styles from './addUrl.module.css';
import {useEffect, useState} from "react";
import axios from "axios";

const AddUrl = ({ setUrls, setChanges, setAddUrlVisible }) => {
    const [url, setUrl] = useState("");
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);
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

    const addUrl = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log('UserId: ', userId);
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/url/add-url`, {
                userId,
                urlAddress: url,
                duration
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

    useEffect(() => {
        (async () => setIsValid(await validateURL(url)))();
    }, [url]);

    return (
        <section >
            <form className={styles.form} onSubmit={addUrl}>
                <div className={styles.main}>
                    <p>https:// </p><input type="text" placeholder="Enter URL" onChange={(e) => setUrl(e.target.value)} />
                    { url.length > 0 && <p className={styles.indicator}>{isValid ? "✅valid" : "❌in-valid"}</p> }
                </div>
                <div className={styles.buttons}>
                    <button type="submit">Add URL</button>
                    <button type='submit' onClick={() => setAddUrlVisible(prev => !prev)}>Cancel</button>
                </div>
            </form>
        </section>
    )
}

export default AddUrl;