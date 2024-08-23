import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { ImFilm } from "react-icons/im";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiCloseLargeFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/UserContext';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const active = (currentPath) => location.pathname === currentPath;

  const handleMenuClick = () => {
    setOpenMenu(!openMenu);
  }

  const handleLogout = () => {
    axios.get('http://localhost:3001/user/logout').then(response => {
      if (response.data.status) {
        setUser(null);
        navigate('/login')
      }
    }).catch(err => {
      console.error(err);
    })
  };

  return (
    <>
      <div className="md:hidden flex justify-between">
        <div className='flex items-center space-x-6 sm:space-x-3 py-2 pl-4'>
          <span className='text-4xl mr-5'><ImFilm /></span>
        </div>
        <div className='flex flex-col items-center space-x-6 sm:space-x-3 py-2 pl-4'>
          {openMenu ? (
            <>
              <span onClick={handleMenuClick} className='relative text-3xl mr-5'><RiCloseLargeFill /></span>
              <div className='absolute right-0 mt-[2rem] bg-white p-5 rounded-lg w-[35%]'>
                <ul>
                  <li>
                    <Link to="/" onClick={handleMenuClick} className={`text-sm sm:text-md md:text-lg lg:text-xl font-bold hover:text-gray-800 ${active('/') ? 'text-blue-500 hover:text-blue-900 underline' : 'text-gray-500'}`}>Home</Link>
                  </li>
                  <li>
                    <Link to="/watchlist" onClick={handleMenuClick} className={`text-sm sm:text-md md:text-lg lg:text-xl font-bold hover:text-gray-800 ${active('/watchlist') ? 'text-blue-500 hover:text-blue-900 underline' : 'text-gray-500'}`}>Watchlist</Link>
                  </li>
                  {user ?
                    <li>
                      <div onClick={handleLogout} className='text-sm sm:text-md md:text-lg lg:text-xl font-bold text-gray-500 hover:text-gray-800 cursor-pointer'>Signout</div>
                    </li> :
                    <ul>
                      <li>
                        <Link to="/login" onClick={handleMenuClick} className={`text-sm sm:text-md md:text-lg lg:text-xl font-bold hover:text-gray-800 ${active('/login') ? 'text-blue-500 hover:text-blue-900 underline' : 'text-gray-500'}`}>Login</Link>
                      </li>
                      <li>
                        <Link to="/signup" onClick={handleMenuClick} className={`text-sm sm:text-md md:text-lg lg:text-xl font-bold hover:text-gray-800 ${active('/signup') ? 'text-blue-500 hover:text-blue-900 underline' : 'text-gray-500'}`}>Sign up</Link>
                      </li>
                    </ul>
                  }
                </ul>
              </div>
            </>
          ) : (
            <span onClick={handleMenuClick} className='text-3xl mr-5'><GiHamburgerMenu /></span>
          )}
        </div>
      </div>
      <div className="hidden md:flex justify-between">
        <div className='flex items-center space-x-6 sm:space-x-3 py-2 pl-4'>
          <span className='text-4xl mr-5'><ImFilm /></span>
          <Link to="/" className={`text-sm sm:text-sm md:text-lg lg:text-xl font-bold hover:text-gray-800 ${active('/') ? 'text-blue-500 hover:text-blue-900 underline' : 'text-gray-500'}`}>Home</Link>
          <Link to="/watchlist" className={`text-sm sm:text-sm md:text-lg lg:text-xl font-bold hover:text-gray-800 ${active('/watchlist') ? 'text-blue-500 hover:text-blue-900 underline' : 'text-gray-500'}`}>Watchlist</Link>
        </div>
        {user ? (
          <div className='flex items-center space-x-6 sm:space-x-3 py-2 pr-7'>
            {/* <div className='text-sm sm:text-sm md:text-lg lg:text-xl font-bold text-gray-500 hover:text-gray-800 cursor-pointer'>{user}</div> */}
            <div onClick={handleLogout} className='text-sm sm:text-sm md:text-lg lg:text-xl font-bold text-gray-500 hover:text-gray-800 cursor-pointer'>Signout</div>
          </div>
        ) : (
          <div className='flex items-center space-x-6 sm:space-x-3 py-2 pr-7'>
            <Link to="/login" className={`text-sm sm:text-sm md:text-lg lg:text-xl font-bold hover:text-gray-800 ${active('/login') ? 'text-blue-500 hover:text-blue-900 underline' : 'text-gray-500'}`}>Login</Link>
            <Link to="/signup" className={`text-sm sm:text-sm md:text-lg lg:text-xl font-bold hover:text-gray-800 ${active('/signup') ? 'text-blue-500 hover:text-blue-900 underline' : 'text-gray-500'}`}>Sign up</Link>
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar