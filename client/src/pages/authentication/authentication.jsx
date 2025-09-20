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
    const [isRegistered, setIsRegistered] = useState(localStorage.getItem('isRegistered') || false);


    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            console.log('Registering user...', import.meta.env.VITE_BACKEND_URL);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, {
                username: user,
                email,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setIsRegistered(true);
            setUser('');
            setEmail('');
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    if(!isRegistered) return (
        <section >
            <h1 className={styles.brand}>Keep Me Alive !</h1>
            <p className={styles.moto}> - An Open Source Project</p>
            <form onSubmit={handleRegister} className={styles.form}>
                <input type="text" placeholder="Enter Username" onChange={(e) => setUser(e.target.value)} />
                <input type="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
                <div className={styles.buttons}>
                    <button type="submit" onClick={(e) => {
                        e.preventDefault();
                        setIsRegistered(true)
                    }
                    }>Already registered? SignIn</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </section>
    )

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, {
                usernameOrEmail: user,
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
            <h1 className={styles.brand}>Keep Me Alive !</h1>
            <p className={styles.moto}> - An Open Source Project</p>
            <form onSubmit={handleLogin} className={styles.form}>
                <input type="text" placeholder="Enter Username or Email" onChange={(e) => setUser(e.target.value)} />
                <div className={styles.buttons}>
                    <button type="submit">Submit</button>
                    <p onClick={() => setIsRegistered(false)}>Sign up!</p>
                </div>
            </form>
        </section>
    )

}

export default Authentication;