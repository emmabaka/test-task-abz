import { Dispatch, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import LazyLoad from "react-lazy-load";
import fetchData from "../../api/fetchData";
import { toast } from "react-toastify";
import { User } from "../../interfaces/interfaces";
import { TOAST_ERR_MESS } from "../../constants/constants";
import SignUpForm from "../SignUpForm/SignUpForm";
import success from "/assets/svgs/success-image.svg";
import s from "./SignUpSection.module.scss";

const SignUpSection = ({
  setUsers,
}: {
  setUsers: Dispatch<React.SetStateAction<User[]>>;
}) => {
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (status) {
      getUpdatedUsers();
    }
    setTimeout(() => setStatus(false), 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const notify = () => toast.error(TOAST_ERR_MESS);

  const getUpdatedUsers = async () => {
    const { data } = (await fetchData(
      "users?page=1&count=6",
      notify
    )) as AxiosResponse;
    const users = data.users;
    setUsers(users);
  };

  return (
    <LazyLoad height={781}>
      <section id="sign-up" className={s.signUpSection}>
        <div className="container">
          <h2 className="title">Working with POST request</h2>
          {status ? (
            <div className={s.successContainer}>
              <h2 className="title">User successfully registered</h2>
              <img className={s.successImg} src={success} alt="Success" />
            </div>
          ) : (
            <SignUpForm setStatus={setStatus} />
          )}
        </div>
      </section>
    </LazyLoad>
  );
};

export default SignUpSection;
