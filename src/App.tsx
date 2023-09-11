import { useState } from 'react';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import UsersSection from './components/UsersSection/UsersSection';
import { User } from './interfaces/interfaces';

function App() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <>
      <Header />
      <HeroSection />
      <UsersSection users={users} setUsers={setUsers} />
    </>
  );
}

export default App;
