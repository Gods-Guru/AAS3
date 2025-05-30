import '../styles/Footer.scss'

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} AutoLux. All rights reserved.</p>
        </footer>
    );
};

export default Footer;