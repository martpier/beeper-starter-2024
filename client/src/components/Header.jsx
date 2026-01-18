import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Header.module.css';

function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return (
    <div className={styles.header}>
      <Link to="/home">🏠 Home</Link>
      <button onClick={handleLogout} className={styles.logout}>
        logout
      </button>
      <span> - </span>
      <img
        className={styles.profilePicture}
        src={user?.picture}
        alt={`${user?.name}'s profile`}
      />
    </div>
  );
}

export default Header;
