import axios from "axios";
import styles from './docs.module.css';
import {useState, useEffect} from "react";

const code =
    `app.get('/keepmealive', async (req, res) => {
    return res.status(200).json({
        status: 'OK'
    });
}
`;
export default function Docs() {
    const [stats, setStats] = useState({
        usersCount: 0,
        urlsCount: 0,
    });
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/users-count`);
            setStats(res.data);
            console.log(res.data);
        }
        fetchData();
    }, [])
    return (
        <section className={styles.docs}>
            <h1>Users: {stats.usersCount} & Urls: {stats.urlsCount}</h1>
            <p>To efficiently utilise this service. We as Team KMA(Keep Me Alive) suggests you to follow these steps.</p>
            <p>Our Backend | KMA Server by default pings the user's urls provided by him for every 5mins | "*/5 * * * *", Via a <code>GET</code> request. </p>
            <p>So, To increase efficient use of this service. We would like you to follow this steps.</p>
            <article>
                <h5>&gt; Create an simple GET endpoint</h5>
                <code className={styles.code}>
                    <pre>{code}</pre>
                </code>
                <h5> &gt; Now, Add the specific url of these particular endpoint to not let your server spin-down due to inactivity.</h5>
            </article>
            <article className={styles.contributors}>
                <h3>Contributing</h3>
                <p>
                    We welcome contributions! Please check out our{" "}
                    <a href="https://github.com/nikhilcharan-dev/keepmealive/blob/main/readme.md">
                        README.md
                    </a>{" "}
                    for guidelines on how to get started.
                </p>
                <p>
                    Found an issue? Open a{" "}
                    <a href="https://github.com/nikhilcharan-dev/keepmealive/issues">
                        GitHub Issue
                    </a>{" "}
                    or submit a Pull Request 🚀
                </p>
            </article>
        </section>
    )
}