import styles from './footer.module.css';

const Footer = () => {

    return (
        <section className={styles.footer}>
            <p> @Keep Me Alive | Nikhil Charan | <a href='https://nixquest.me' rel={'noopener'}>nixquest.me</a></p>
        </section>
    )
}

export default Footer;