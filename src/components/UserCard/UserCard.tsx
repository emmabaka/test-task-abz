import { User } from '../../interfaces/interfaces';
import coverPhoto from '/assets/svgs/photo-cover.svg';
import s from './UserCard.module.scss';

const UserCard = ({
  user: { photo, position, name, email, phone },
}: {
  user: User;
}) => {
  function sliceSentence(sentence: string) {
    if (sentence.length <= 25) {
      return sentence;
    } else {
      return sentence.slice(0, 25) + '...';
    }
  }

  return (
    <li className={s.cardContainer}>
      <img
        className={s.userImg}
        src={photo || coverPhoto}
        alt={name}
        width={70}
        height={70}
        // https://frontend-test-assignment-api.abz.agency/images/placeholders/placeholder.png
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          currentTarget.src =  coverPhoto ;
        }}
      />
      <p className={`${s.userInfo} ${s.userName}`} title={name}>
        {sliceSentence(name)}
      </p>
      <p className={s.userInfo}>{position}</p>
      <p className={s.userInfo} title={email}>
        {sliceSentence(email)}
      </p>
      <p className={s.userInfo}>{phone}</p>
    </li>
  );
};
export default UserCard;
