import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './Signup.css';
import homeImage from '../images/home1.jpg';

import {useNavigate, useSelector} from 'react-router-dom'
function Signup() {
    const { register, handleSubmit,formState:{errors} } = useForm();
    let [err,setError]=useState('')
    let navigate=useNavigate();
    async function handleFormSubmit(userobj) {
        if(userobj.userType=='user'){
            const res= await axios.post('http://localhost:5000/user-api/user',userobj)
            console.log(res)
            if(res.data.message=='User Created'){
              // navigate to sign
              navigate('/signin')
            }else{
                setError(res.data.message)
            }
          }
          if(userobj.userType=='staff'){
            const res= await axios.post('http://localhost:5000/staff-api/user',userobj)
            console.log(res)
            if(res.data.message=='staff Created'){
              // navigate to sign
              navigate('/signin')
            }else{
                setError(res.data.message)
            }
          }
    }

    return (
        <div className='container  d-flex justify-content-center align-items-center vh-100'>
            <div className="form-container">
                {/*user register err message */}
                {err.length!=0 && <p className='text-danger text-center'>{err}</p>}
                <form onSubmit={handleSubmit(handleFormSubmit)} className='w-50'>
                    <div className="mb-3">
                        <label className="form-label sky-label">Sign up as</label>
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
                        <label className="form-label sky-label">Email</label>
                        <input type="email" className="form-control sky-input" {...register('email')} />
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

export default Signup;