import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Header.module.css';

function Header() {
  const { user } = useAuth();

  return (
    <div className={styles.header}>
      <Link to="/home">🏠 Home</Link>
      <a href="/logout" className={styles.logout}>logout - </a>
      <img
        className={styles.profilePicture}
        src={user?.picture}
        alt={`${user?.name}'s profile`}
      />
    </div>
  );
}

export default Header;
