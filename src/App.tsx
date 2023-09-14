import { useState } from 'react';
import { User } from './interfaces/interfaces';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import UsersSection from './components/UsersSection/UsersSection';
import SignUpSection from './components/SignUpSection/SignUpSection';
import { ToastContainer } from 'react-toastify';


function App() {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <>
      <Header />
      <HeroSection />
      <UsersSection users={users} setUsers={setUsers} />
      <SignUpSection setUsers={setUsers} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
