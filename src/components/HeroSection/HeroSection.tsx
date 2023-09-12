import s from './HeroSection.module.scss';

const HeroSection = () => {
  return (
    <section className={s.heroSection}>
      <div className={`${s.heroContainer} container`}>
        <h1 className={s.title}>Test assignment for front-end developer</h1>
        <p className={s.description}>
          What defines a good front-end developer is one that has skilled
          knowledge of HTML, CSS, JS with a vast understanding of User design
          thinking as they'll be building web interfaces with accessibility in
          mind. They should also be excited to learn, as the world of Front-End
          Development keeps evolving.
        </p>
        <a className={s.signUpButton} href='#sign-up'>
          Sign up
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
