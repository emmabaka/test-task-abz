import { Dispatch, useEffect, useState } from "react";
import { User } from "../../interfaces/interfaces";
import fetchData from "../../api/fetchData";
import UserCard from "../UserCard/UserCard";
import s from "./UsersSection.module.scss";

const UsersSection = ({
  users,
  setUsers,
}: {
  users: User[];
  setUsers: Dispatch<React.SetStateAction<User[]>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await fetchData(`users?page=${page}&count=6`);

      const users = res.data.users;
      const currPage = res.data.page;
      const totalPages = res.data.total_pages;

      setUsers((prev) => {
        const isPrevUsers = users.some((currItem: User) =>
          prev.some((prevItem) => prevItem.id === currItem.id)
        );

        if (isPrevUsers) return prev;

        return [...prev, ...users];
      });

      setPage(currPage + 1);

      if (currPage === totalPages) setIsLastPage(true);
    } catch (error) {
      console.log(error);
      //TODO: add error state
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMoreButtonClick = () => {
    getUsers(page);
  };

  return (
    <section id="users" className={s.usersSection}>
      <div className="container">
        <h2 className="title">Working with GET request</h2>
        <ul className={s.usersCardsWrap}>
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </ul>
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          !isLastPage && (
            <button
              className={s.showMoreButton}
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
