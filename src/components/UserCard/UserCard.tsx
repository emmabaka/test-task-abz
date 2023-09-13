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
      <p className={`${s.userInfo} ${s.userName}`} title={name}>
        {sliceText(name)}
      </p>
      <p className={s.userInfo}>{sliceText(position)}</p>
      <p className={s.userInfo} title={email}>
        {sliceText(email)}
      </p>
      <p className={s.userInfo}>{phone}</p>
    </li>
  );
};
export default UserCard;
