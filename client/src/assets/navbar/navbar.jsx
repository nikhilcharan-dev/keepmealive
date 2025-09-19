import styles from './navbar.module.css';

const Navbar = () => {

    return (
        <nav>
            <h1 className={styles.logo}>KeepMeAlive </h1>
            <ul>
                <li>Docs</li>
                <li>About </li>
                <li>Dashboard</li>
            </ul>
        </nav>
    )
}

export default Navbar;
