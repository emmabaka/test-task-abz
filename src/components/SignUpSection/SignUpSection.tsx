import { Dispatch, useEffect, useState } from "react";
import fetchData from "../../api/fetchData";
import { User } from "../../interfaces/interfaces";
import SignUpForm from "../SignUpForm/SignUpForm";
import s from "./SignUpSection.module.scss";

const SignUpSection = ({
  setUsers,
}: {
  setUsers: Dispatch<React.SetStateAction<User[]>>;
}) => {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (status === "201") {
      getUpdatedUsers();
    }
    setTimeout(() => setStatus(""), 3000);
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
    <section className={s.signUpSection}>
      <div className="container">
        <h2 className="title">Working with POST request</h2>
        {status === "201" ? (
        //   <SuccessSection />
        <p>success</p>
        ) : (
          <SignUpForm setStatus={setStatus} />
        )}
      </div>
    </section>
  );
};

export default SignUpSection;
