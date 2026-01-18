import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiCall } from '../api';
import Header from '../components/Header';
import BeepList from '../components/BeepList';
import styles from './UserPage.module.css';

function UserPage() {
  const { username } = useParams();
  const { user: currentUser, getAccessTokenSilently } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function fetchUserInfo() {
      const response = await apiCall(`/api/user/${username}`, {}, getAccessTokenSilently);
      const data = await response.json();
      setUserInfo(data);
    }
    fetchUserInfo();
  }, [username, getAccessTokenSilently]);

  async function handleFollow() {
    if (userInfo.followed) {
      await apiCall(`/api/unfollow/${userInfo.viewedUser.id}`, { method: 'PUT' }, getAccessTokenSilently);
      setUserInfo({ ...userInfo, followed: false });
    } else {
      await apiCall(`/api/follow/${userInfo.viewedUser.id}`, { method: 'PUT' }, getAccessTokenSilently);
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
