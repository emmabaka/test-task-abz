import clsx from "clsx";
import { User } from "../../interfaces/interfaces";
import { CHARS_TRIM_COUNT } from "../../constants/constants";
import sliceText from "../../utils/sliceText";
import coverPhoto from "/assets/svgs/photo-cover.svg";
import s from "./UserCard.module.scss";

const UserCard = ({
  user: { photo, position, name, email, phone },
}: {
  user: User;
}) => {
  const { isNameVisible, isEmailVisible } = {
    isNameVisible: name.length > CHARS_TRIM_COUNT,
    isEmailVisible: email.length > CHARS_TRIM_COUNT,
  };

  return (
    <li className={s.cardContainer}>
      <img
        className={s.userImg}
        src={photo}
        alt={name}
        width={70}
        height={70}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src = coverPhoto;
        }}
      />
      <p
        className={clsx(s.userInfo, s.userName, {
          [s.withTooltip]: isNameVisible,
        })}
      >
        {sliceText(name)}
        {isNameVisible && <span className={s.tooltip}>{name}</span>}
      </p>
      <p className={s.userInfo}>{position}</p>
      <p
        className={clsx(s.userInfo, s.userEmail, {
          [s.withTooltip]: isEmailVisible,
        })}
      >
        {sliceText(email)}
        {isEmailVisible && <span className={s.tooltip}>{email}</span>}
      </p>
      <p className={s.userInfo}>{phone}</p>
    </li>
  );
};
export default UserCard;
