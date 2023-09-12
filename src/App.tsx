import { useState } from 'react';
import { User } from './interfaces/interfaces';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import UsersSection from './components/UsersSection/UsersSection';
import SignUpSection from './components/SignUpSection/SignUpSection';


function App() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <>
      <Header />
      <HeroSection />
      <UsersSection users={users} setUsers={setUsers} />
      <SignUpSection setUsers={setUsers}/>
    </>
  );
}

export default App;
