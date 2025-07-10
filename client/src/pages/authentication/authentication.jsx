import axios from "axios";
import styles from './authentication.module.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Authentication = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistered, setIsRegistered] = useState(localStorage.getItem('isRegistered') || false);


    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            console.log('Registering user...', import.meta.env.VITE_BACKEND_URL);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, {
                username: user,
                email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setIsRegistered(true);
            setUser('');
            setEmail('');
            setPassword('');
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    if(!isRegistered) return (
        <section >
            <form onSubmit={handleRegister} className={styles.form}>
                <input type="text" placeholder="Enter Username" onChange={(e) => setUser(e.target.value)} />
                <input type="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" onClick={(e) => {
                    e.preventDefault();
                    setIsRegistered(true)
                }
                }>Already registered? signin</button>
                <button type="submit">Submit</button>
            </form>
        </section>
    )

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
                usernameOrEmail: user,
                password,
            })
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isRegistered', true);
            localStorage.setItem('userId', response.data.userData._id);
            localStorage.setItem('userData', JSON.stringify(response.data.userData));
            navigate('/');
        } catch(err) {
            console.log(err);
        }

    }


    return (
        <section >
            <form onSubmit={handleLogin} className={styles.form}>
                <input type="text" placeholder="Enter Username or Email" onChange={(e) => setUser(e.target.value)} />
                <input type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        </section>
    )

}

export default Authentication;