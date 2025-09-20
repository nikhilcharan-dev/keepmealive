import styles from './navbar.module.css';
import {useNavigate} from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav>
            <h1 className={styles.logo}>KeepMeAlive </h1>
            <ul>
                <li onClick={() => navigate('/docs')}>Docs</li>
                <li onClick={() => navigate('/')}>Dashboard</li>
            </ul>
        </nav>
    )
}

export default Navbar;
