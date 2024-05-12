import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
function Books() {
  const { currentuser } = useSelector((state) => state.userLogin);
  const [booksList, setBooksList] = useState([]);
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const location = useLocation();
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { hour12: true, year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  //------------------------Books Borrowed by the User-----------------------------------
  const getBooksofCurrentUser = async () => {
    try {
      console.log(currentuser)
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
      setErr('No Books Available');
    }
  };

  //--------------------------------Renewal Apply by the User------------------------------------------
  const renewalApplyUser=async(bookid)=>{
    if(window.confirm("Confirm Book Renewal")){
      let res= await axiosWithToken.put(`http://localhost:5000/user-api/renewal_user/${bookid}`)
      console.log(res)
      if(res.data.message='Renewal Successful'){
          navigate('/user-profile/mybooks')
          alert('Renewal Successful')
      }
      else{
        alert('Renewal Unsuccessful')
      }
    }
    
  }




  useEffect(() => {
    getBooksofCurrentUser();
  }, [currentuser,location]);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col">
          {err ? (
            <p className="display-1 text-danger text-center mt-5">{err}</p>
          ) : (
            <div className="row row-cols-1 row-cols-md-3 g-4 mt-5" >
              {booksList.map((book) => (
                <div className="col mb-4" key={book.bookId} style={{minWidth:"300px",maxHeight:"288px"}}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{book.title}</h5>
                      <p className="card-text"><strong>{book.author}</strong></p>
                      {
                        book.renewalCount==0?<button className="btn btn-warning" onClick={()=>renewalApplyUser(book.bookId)}>
                        <span>Renewal Left: {1-book.renewalCount}</span>
                      </button>: <button className="btn btn-danger" disabled>
                        <span>Renewal Left: 0</span>
                      </button>
                      }
                    </div>
                    <div className="card-footer">
                      <small className="text-muted w-100">
                        Borrowed on <strong>{book.dateofBorrow}</strong>
                      </small><br></br>
                      <small className="text-muted w-100">
                        Return By <strong>{book.returnDate}</strong>
                      </small>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Books;
