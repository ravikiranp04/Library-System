import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { resetState } from '../../Redux/slices/userLoginSlice';

function Header() {
    const dispatch = useDispatch();
    const { currentuser, loginStatus } = useSelector(state => state.userLogin);

    function logout() {
        // Remove token from browser storage
        sessionStorage.removeItem('token');
        // Reset state
        const actionObj = resetState();
        dispatch(actionObj);
    }

    return (
        <div className="navbar bg-light justify-content-between">
            <h1 className='ml-5'>ONLINE LIBRARY</h1>
            <ul className="nav justify-content-around">
                {loginStatus === false ? (
                    <>
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/signin" className="nav-link">Sign In</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/signup" className="nav-link">Sign Up</Link>
                        </li>
                    </>
                ) : (
                    <li className="nav-item">
                        <Link to="/signin" className="nav-link" onClick={logout}>
                            <span className='lead fs-3 text-warning m-4'>{currentuser.username}<sup className='text-white fs-2'>({currentuser.userType})</sup></span>
                            Sign Out
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default Header;
