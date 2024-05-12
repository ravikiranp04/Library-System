import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function UserProfile() {
  const navigate = useNavigate();
  const [buttonsVisible, setButtonsVisible] = useState(true);

  function booksDisplay() {
    navigate("/user-profile/mybooks");
    // Hide the buttons after navigation
    setButtonsVisible(false);
  }
  function prevBooksDisplay(){
    navigate("/user-profile/prevbooks")
    setButtonsVisible(false)
  }

  return (
    <div>
      <div className='h-100 mx-auto' >
        {buttonsVisible && (
          <>
            <button className="m-3" onClick={booksDisplay}>My books</button>
        
            <button className="m-3" onClick={prevBooksDisplay}>Previous Books</button>
          
          </>
        )}
      </div>
      <Outlet />
    </div>
  );
}

export default UserProfile;
