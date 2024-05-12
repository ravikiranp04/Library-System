import React from 'react';
import { useForm } from 'react-hook-form';
import { userLoginThunk } from '../../Redux/slices/userLoginSlice';
import './Signin.css';
import homeImage from '../images/home1.jpg';
import {useSelector,useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
function Signin() {
    let dispatch=useDispatch();
    let navigate=useNavigate();

    const { register, handleSubmit } = useForm();
    const {isPending,currentuser,errorStatus,errorMessage,loginStatus}=useSelector(state=>state.userLogin)
    function handleFormSubmit(userCred) {
        console.log(userCred);
        let actionObj=userLoginThunk(userCred);
        console.log(actionObj)
        dispatch(actionObj);
    }
    useEffect(()=>{
        if(loginStatus==true){
          if(currentuser.userType=='user'){
            navigate('/user-profile');
          }
          if(currentuser.userType=='staff'){
            navigate('/staff-profile');
          }
            
        }
      },[loginStatus])
    return (
        <div className='container d-flex justify-content-center align-items-center vh-100'>
            <div className="form-container">
            {errorMessage && <p className="text-danger">{errorMessage}</p>}

                <form onSubmit={handleSubmit(handleFormSubmit)} className='w-50'>
                    <div className="mb-3">
                        <label className="form-label sky-label">Sign in as</label>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" value="user" {...register('userType')} />
                            <label className="form-check-label sky-radio">User</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" value="staff" {...register('userType')} />
                            <label className="form-check-label sky-radio">Staff</label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label sky-label">Username</label>
                        <input type="text" className="form-control sky-input" {...register('username')} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label sky-label">Password</label>
                        <input type="password" className="form-control sky-input" {...register('password')} />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary sky-btn">Submit</button>
                    </div>
                </form>
            </div>
            <div className='image-container'>
                <img className="img-fluid" src={homeImage} alt='Img' />
            </div>
        </div>
    );
}

export default Signin;