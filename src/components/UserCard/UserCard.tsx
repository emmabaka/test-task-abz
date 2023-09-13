import { User } from "../../interfaces/interfaces";
import sliceText from "../../utils/sliceText";
import coverPhoto from "/assets/svgs/photo-cover.svg";
import s from "./UserCard.module.scss";

const UserCard = ({
  user: { photo, position, name, email, phone },
}: {
  user: User;
}) => {
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
      <p className={`${s.userInfo} ${s.userName}`}>
        {sliceText(name)}
        {name.length > 25 && <span className={s.tooltip}>{name}</span>}
      </p>
      <p className={s.userInfo}>{sliceText(position)}</p>
      <p className={`${s.userInfo} ${s.userEmail}`}>
        {sliceText(email)}
        {email.length > 25 && <span className={s.tooltip}>{email}</span>}
      </p>
      <p className={s.userInfo}>{phone}</p>
    </li>
  );
};
export default UserCard;
