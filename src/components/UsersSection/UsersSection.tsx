import { Dispatch, useEffect, useState } from 'react';
import axios from 'axios';
import UserCard from '../UserCard/UserCard';
import s from './UsersSection.module.scss';

interface User {
  email: string;
  id: number;
  name: string;
  phone: string;
  photo: string;
  position: string;
  position_id: number;
  registration_timestamp: number;
}

const UsersSection = ({
  users,
  setUsers,
}: {
  users: User[];
  setUsers: Dispatch<React.SetStateAction<User[]>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState('');
  const [isLastPage, setIsLastPage] = useState(false);

  console.log(isLastPage);

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUsers = async (
    link = 'https://frontend-test-assignment-api.abz.agency/api/v1/users?page=1&count=6'
  ) => {
    setIsLoading(true);
    try {
      const res = await axios.get(link);
      console.log(res.data);

      const users = res.data.users;
      setUsers((prev) => {
        const isPrevUsers = users.some((currItem: User) =>
          prev.some((prevItem) => prevItem.id === currItem.id)
        );

        if (isPrevUsers) return prev;

        return [...prev, ...users];
      });

      setNextPageUrl(res.data.links.next_url);

      if (res.data.page === res.data.total_pages) setIsLastPage(true);
    } catch (error) {
      console.log(error);
      //TODO: add error state
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMoreButtonClick = () => {
    getUsers(nextPageUrl);
  };

  return (
    <section className={s.usersSection}>
      <div className='container'>
        <h2 className='title'>Working with GET request</h2>
        <ul className={s.usersCardsWrap}>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </ul>
        {isLoading ? (
          <div className={s.loader}></div>
        ) : (
          !isLastPage && (
            <button
              className={`${s.showMoreButton} button`}
              onClick={handleShowMoreButtonClick}
            >
              Show more
            </button>
          )
        )}
      </div>
    </section>
  );
};

export default UsersSection;
