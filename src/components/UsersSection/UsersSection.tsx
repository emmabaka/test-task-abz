import { Dispatch, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { TOAST_ERR_MESS } from "../../constants/constants";
import { User } from "../../interfaces/interfaces";
import fetchData from "../../api/fetchData";
import UserCard from "../UserCard/UserCard";
import s from "./UsersSection.module.scss";
import LazyLoad from "react-lazy-load";

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

  const notify = () => toast.error(TOAST_ERR_MESS);

  const getUsers = async (page = 1) => {
    setIsLoading(true);

    const { data } = (await fetchData(
      `users?page=${page}&count=6`,
      notify
    )) as AxiosResponse;

    const users = data.users;
    const currPage = data.page;
    const totalPages = data.total_pages;

    setUsers((prev) => {
      const isPrevUsers = users.some((currItem: User) =>
        prev.some((prevItem) => prevItem.id === currItem.id)
      );

      if (isPrevUsers) return prev;

      return [...prev, ...users];
    });

    setPage(currPage + 1);

    if (currPage === totalPages) setIsLastPage(true);

    setIsLoading(false);
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowMoreButtonClick = () => getUsers(page);

  return (
    <LazyLoad>
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
    </LazyLoad>
  );
};

export default UsersSection;
