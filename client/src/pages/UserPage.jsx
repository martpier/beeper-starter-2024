import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import Header from '../components/Header';
import BeepList from '../components/BeepList';
import styles from './UserPage.module.css';

function UserPage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth0();
  const apiFetch = useAuthenticatedFetch();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function fetchUserInfo() {
      const response = await apiFetch(`/user/${username}`);
      const data = await response.json();
      setUserInfo(data);
    }
    fetchUserInfo();
  }, [username]);

  async function handleFollow() {
    if (userInfo.followed) {
      await apiFetch(`/unfollow/${userInfo.viewedUser.id}`, { method: 'PUT' });
      setUserInfo({ ...userInfo, followed: false });
    } else {
      await apiFetch(`/follow/${userInfo.viewedUser.id}`, { method: 'PUT' });
      setUserInfo({ ...userInfo, followed: true });
    }
  }

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const isSelf = userInfo.viewedUser.id === currentUser?.id;

  return (
    <div>
      <Header />
      <div className={styles.user}>
        <img
          className={styles.viewedUserProfilePicture}
          src={userInfo.viewedUser.picture}
          alt="Profile pic"
        />
        <span className={styles.viewedUserUsername}>
          {userInfo.viewedUser.name}'s latest beeps
        </span>
        {!isSelf && (
          <button onClick={handleFollow} className={styles.followButton}>
            {userInfo.followed ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
      <BeepList beeps={userInfo.beeps} />
    </div>
  );
}

export default UserPage;
