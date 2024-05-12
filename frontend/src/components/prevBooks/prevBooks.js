import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';


function prevBooks() {
    /*const { currentuser } = useSelector((state) => state.userLogin);
  const [booksList, setBooksList] = useState([]);
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { hour12: true, year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const getprevBooks = async () => {
    try {
      const res = await axiosWithToken.get(`http://localhost:5000/user-api/display_borrow/${currentuser.username}`);
      if (res.data.message === 'Borrowed Books are') {
        const formattedBooks = res.data.payload.map((book) => ({
          ...book,
          dateofBorrow: formatDate(book.dateofBorrow),
          returnDate: formatDate(book.returnDate)
        }));
        setBooksList(formattedBooks);
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setErr('Error fetching books. Please try again later.');
    }
  };

  useEffect(() => {
    getprevBooks();
  }, [currentuser]);*/

  return (
    <div>prevBooks</div>
  )
}

export default prevBooks