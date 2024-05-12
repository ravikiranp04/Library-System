import React from 'react';
import { useForm } from 'react-hook-form';
import {useSelector} from 'react-redux';
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
function AddNewBook() {
    const { register, handleSubmit } = useForm();
    let {currentuser}=useSelector((state)=>state.userLogin)
    let [err,setErr]=useState("");
  let navigate=useNavigate();
  let token=sessionStorage.getItem('token');

const axiosWithToken=axios.create({
    headers:{Authorization: `Bearer ${token}`}
})
    const handleFormSubmit=async(data)=>{
        data.bookId = Date.now()
        data.borrowStatus= false
        data.dateofBorrow=""
        data.returnDate=""
        data.username=""
        data.previousHistory=[]
        data.renewalCount=0
        data.status=true

        //http post request
        let res= await axiosWithToken.post('http://localhost:5000/staff-api/add-book',data)
        console.log('res ',res);
        if(res.data.message='Book Added'){
            navigate(`/staff-profile`)
        }
        else{
            setErr(res.data.message)
        }
    }

    return (
        <div className='container'>
            <div className='card'>
                <div className='card-body bg-light'>
                    <div className='card-title text-center'><h5>Book Details</h5></div>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className='mt-5'>
                        {/* title */}
                        <div className='mb-3 d-flex'>
                            <label className='form-label m-2'>Title</label>
                            <input type='text' {...register('title')} className='form-control' />
                        </div>
                        {/* author */}
                        <div className='mb-3 d-flex'>
                            <label className='form-label m-2'>Author</label>
                            <input type='text' {...register('author')} className='form-control' />
                        </div>
                        {/* subject */}
                        <div className='mb-3 d-flex'>
                            <label className='form-label m-2'>Subject</label>
                            <select id='mySelect' {...register('subject')} className='form-select'>
                                <option value='' disabled selected>Choose an option</option>
                                <option value='Programming'>Programming</option>
                                <option value='Web Development'>Web Development</option>
                            </select>
                        </div>
                        {/* available count */}
                        <div className='mb-3 text-center'>
                            <button type='submit' className='btn btn-primary'>Add Book</button>
                        </div>
                    </form>
                </div>
            </div>
     </div>
    );
}

export default AddNewBook;
