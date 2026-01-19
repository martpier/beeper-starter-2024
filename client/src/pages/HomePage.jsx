import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';
import { apiCall } from '../api';
import Header from '../components/Header';
import BeepList from '../components/BeepList';
import styles from './HomePage.module.css';

function HomePage() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [beepList, setBeepList] = useState([]);

  useEffect(() => {
    async function fetchBeeps() {
      const response = await apiCall('/home', {}, getAccessTokenSilently);
      const data = await response.json();
      setBeepList(data);
    }
    fetchBeeps();
  }, [getAccessTokenSilently]);

  async function handleKeyUp(event) {
    if (event.code === 'Enter' && !event.shiftKey) {
      const textarea = event.target;
      let content = textarea.value;
      // Remove the newline character that was just added
      content = content.slice(0, content.length - 1);

      const response = await apiCall('/beep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      }, getAccessTokenSilently);

      const postedBeep = await response.json();
      textarea.value = '';
      setBeepList([postedBeep, ...beepList]);
    }
  }

  return (
    <div>
      <Header />
      <h1>Welcome {user?.name}!</h1>
      <textarea
        className={styles.textarea}
        onKeyUp={handleKeyUp}
      />
      <BeepList beeps={beepList} />
    </div>
  );
}

export default HomePage;
