import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiCall } from '../api';
import styles from './BeepView.module.css';

function BeepView({ beep: initialBeep }) {
  const [beep, setBeep] = useState(initialBeep);

  async function handleLike() {
    if (beep.liked) {
      await apiCall(`/api/unlike/${beep.id}`, { method: 'PUT' });
      setBeep({
        ...beep,
        liked: false,
        likeCount: beep.likeCount - 1,
      });
    } else {
      await apiCall(`/api/like/${beep.id}`, { method: 'PUT' });
      setBeep({
        ...beep,
        liked: true,
        likeCount: beep.likeCount + 1,
      });
    }
  }

  return (
    <div className={styles.beep}>
      <div className={styles.beepHeader}>
        <img
          src={beep.authorPicture}
          alt={`Profile picture of ${beep.authorName}`}
          className={styles.authorProfilePicture}
        />
        <div>
          <Link className={styles.author} to={`/user/${beep.authorName}`}>
            {beep.authorName}
          </Link>
          <span className={styles.createdAt}>
            &nbsp;- {new Date(beep.createdAt).toLocaleString()} -&nbsp;
          </span>
          <span className={`${styles.likes} ${beep.liked ? styles.liked : ''}`}>
            <span
              className={`${styles.likeCount} ${beep.liked ? styles.liked : ''}`}
              onClick={handleLike}
            >
              {beep.likeCount}
            </span>
            +
          </span>
        </div>
      </div>
      <div>{beep.content}</div>
    </div>
  );
}

export default BeepView;
