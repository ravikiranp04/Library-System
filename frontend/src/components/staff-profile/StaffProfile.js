import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function StaffProfile() {
  const navigate = useNavigate();
  const location = useLocation(); // To get the current location
  const { currentuser } = useSelector((state) => state.userLogin);
  const [booksList, setBooksList] = useState([]);
  const [err, setErr] = useState('');
  const token = sessionStorage.getItem('token');
  const [searchTerm, setSearchTerm] = useState('');
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });
  let [visibleStatus, setVisibleStatus] = useState(true);

  function addition() {
    setVisibleStatus(true);
    navigate("/staff-profile/newbook"); // Use absolute path
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { hour12: true, year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  // Check if the current location is '/staff-profile/newbook'
  const isAddNewBookPage = location.pathname === '/staff-profile/newbook';
  const allotBookPage = location.pathname ==='/staff-profile'
  const getBooks = async () => {
    try {
      //console.log(currentuser)
      let res = await axiosWithToken.get(`http://localhost:5000/staff-api/display_books`);
      //console.log(res)
      if (res.data.message = 'Books are') {
        const formattedBooks = res.data.payload.map((book) => ({
          ...book,
          username: book.username,
          dateofBorrow: formatDate(book.dateofBorrow),
          returnDate: formatDate(book.returnDate)
        }));
        
        // Filter books by search term if it's not empty
        if (searchTerm.trim() !== '') {
          const filteredBooks = formattedBooks.filter(book => book.username.toLowerCase().includes(searchTerm.toLowerCase()));
          setBooksList(filteredBooks);
        } else {
          setBooksList(formattedBooks);
        }
      } else {
        setErr(res.data.message);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setErr('Error fetching books. Please try again later.');
    }
  };

  //------------Alloting a borrower----------
  const allotBook=async(bookid)=>{
      const borrower= prompt("Enter Username");
      if(borrower!=null && borrower.trim()!==' '){
        console.log(bookid)
        console.log(borrower)
        let res= await axiosWithToken.put(`http://localhost:5000/staff-api/borrow/${bookid}/${borrower}`) 
        console.log(res)
        if(res.data.message='Borrow Successful'){
           navigate('/staff-profile')
           alert('Borrow Successful')
           
        }
        else if(res.data.message='User Not Found'){
          alert('Unregistered User')
        }
        else{
          setErr(res.data.message)
        }
      }
  }


  //----------------------------------Returning A book---------------------------------------------
  const returnBook=async(bookid)=>{
    if(window.confirm("Confirm to Return Book")){
      let res = await axiosWithToken.put(`http://localhost:5000/staff-api/return/${bookid}`)
      console.log(res)
      if(res.data.message='Return Successful'){
        navigate('/staff-profile')
        alert("Book Returned")
      }
      else{
        alert("Return Unsuccessful")
      }
    }
  }


  //--------------------------------Apply Renewal For a book---------------------------
  const renewalApply=async(bookid)=>{
    if(window.confirm("Confirm Book Renewal")){
      let res= await axiosWithToken.put(`http://localhost:5000/staff-api/renewal_staff/${bookid}`)
      console.log(res)
      if(res.data.message='Renewal Successful'){
          navigate('/staff-profile')
          alert('Renewal Successful')
      }
      else{
        alert('Renewal Unsuccessful')
      }
    }
    
  }

  //----------------------Search bar Function---------------------
 
  const handleChange = (event)=>{
      setSearchTerm(event.target.value)
      event.preventDefault();
  }

  useEffect(() => {
    getBooks();
  }, [location,searchTerm]);

  return (
    <div>
      {isAddNewBookPage ? null : ( // Render buttons only if not on 'AddNewBook' page
        <div>
          <div><input
        type="text"
        className="form-control me-2"
        placeholder="Search by Username.."
        value={searchTerm}
        onChange={handleChange}
      /></div>
          <div className='d-flex justify-content-around'>
            <button onClick={addition}>ADD A BOOK</button>
          </div>
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
                            book.borrowStatus==false?<div className='d-flex justify-content-around'>
                              <button className="btn btn-success" disabled>
                            <span>Available</span>
                          </button>
                          <button className="btn btn-success" onClick={()=>allotBook(book.bookId)}>
                            <span>Allot Book</span>
                          </button>
                            </div>: <div className='d-flex justify-content-around'>
                              <button className="btn btn-success" disabled>
                            <span>Under Borrow</span>
                          </button>
                          <button className="btn btn-danger" onClick={()=>returnBook(book.bookId)}>
                            <span>Return Book</span>
                          </button>
                            </div>
                          
                          }
                        </div>
                        <div className="card-footer">
                          
                        {
                          book.borrowStatus==true? <div>
                            <div>
                            <small className="text-muted w-100">
                            Borrower: <strong>{book.username}</strong>
                          </small><br></br>
                          <small className="text-muted w-100">
                            Borrowed on <strong>{book.dateofBorrow}</strong>
                          </small><br></br>
                          <small className="text-muted w-100">
                            Return By <strong>{book.returnDate}</strong>
                          </small>
                          </div>
                          <div className='d-flex justify-content-around'>
                          {
                        book.renewalCount==0?<button className="btn btn-warning" disabled>
                        <span>Renewal Left: {1-book.renewalCount}</span>
                      </button>: <button className="btn btn-danger" disabled>
                        <span>Renewal Left: 0</span>
                      </button>
                      } 
                      <button className='btn btn-success' onClick={()=>renewalApply(book.bookId)}>Renewal</button>  
                      </div>
                          </div>:
                          <div>
                            <span>Click on Allot to borrow</span>
                          </div>
                        }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Outlet />
    </div>
  );
  
}

export default StaffProfile;
