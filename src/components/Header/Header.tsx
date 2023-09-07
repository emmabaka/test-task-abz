import logo from '../../assets/svgs/logo.svg';
import s from './Header.module.scss';

const Header = () => {
  return (
    <header className={s.header}>
      <div className={`${s.headerContainer} container`}>
        <a className={s.logo} href='/'>
          <img src={logo} alt='Logo' width={104} height={26} />
        </a>
        <div className={s.buttonsWrapper}>
          <a className={`${s.headerButtons} button`} href='#users'>
            Users
          </a>
          <a className={`${s.headerButtons} button`} href='#'>
            Sign up
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
