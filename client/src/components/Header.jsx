import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  const { user, logout } = useAuth0();

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
