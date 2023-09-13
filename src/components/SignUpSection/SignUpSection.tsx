import { Dispatch, useEffect, useState } from "react";
import fetchData from "../../api/fetchData";
import { User } from "../../interfaces/interfaces";
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

  const getUpdatedUsers = async () => {
    try {
      const res = await fetchData("users?page=1&count=6");
      const users = res.data.users;
      setUsers(users);
    } catch (e) {
      console.log(e);
    }
  };

  return (
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
  );
};

export default SignUpSection;
