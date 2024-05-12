import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooksList] = useState([]);
    const [err, setErr] = useState('');
    /*const books = [
        {
            id: 1,
            title: "The Great Gatsby",
            subject: "Classic Literature",
            author: "F. Scott Fitzgerald",
            category: "Fiction"
        },
        {
            id: 2,
            title: "To Kill a Mockingbird",
            subject: "Classic Literature",
            author: "Harper Lee",
            category: "Fiction"
        },
        {
            id: 3,
            title: "The Catcher in the Rye",
            subject: "Classic Literature",
            author: "J.D. Salinger",
            category: "Fiction"
        },
        {
            id: 4,
            title: "1984",
            subject: "Dystopian Fiction",
            author: "George Orwell",
            category: "Fiction"
        },
        {
            id: 5,
            title: "The Hobbit",
            subject: "Fantasy",
            author: "J.R.R. Tolkien",
            category: "Fiction"
        },
        {
            id: 6,
            title: "Pride and Prejudice",
            subject: "Classic Literature",
            author: "Jane Austen",
            category: "Fiction"
        },
        {
            id: 7,
            title: "Harry Potter and the Philosopher's Stone",
            subject: "Fantasy",
            author: "J.K. Rowling",
            category: "Fiction"
        },
        {
            id: 8,
            title: "The Lord of the Rings",
            subject: "Fantasy",
            author: "J.R.R. Tolkien",
            category: "Fiction"
        },
        {
            id: 9,
            title: "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe",
            subject: "Fantasy",
            author: "C.S. Lewis",
            category: "Fiction"
        },
        {
            id: 10,
            title: "Brave New World",
            subject: "Dystopian Fiction",
            author: "Aldous Huxley",
            category: "Fiction"
        }
      ];*/
      useEffect(()=>{
        getBooksList();
      },[])
      
    const getBooksList=async()=>{
        let res= await axios.get(`http://localhost:5000/staff-api/display_books`)
        if (res.data.message = 'Books are'){
            setBooksList(res.data.payload)
        }
        else{
            setErr(res.data.message)
        }
    }
    function BookCard({ book }) {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{book.title}</h5>
                    <p className="card-text">Author: {book.author}</p>
                    <p className="card-text">Subject: {book.subject}</p>
                </div>
            </div>
        );
    }

    // Filter books based on search query
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.subject.toLowerCase().includes(searchQuery.toLowerCase()) 
    )

    return (
        <div>
            <div className="m-5">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control mb-4"
                />
            </div>
            <div className="row">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map(book => (
                        <div className="col-md-4 mb-4" key={book.id}>
                            <BookCard book={book} />
                        </div>
                    ))
                ) : (
                    <div className="col">
                        {err ? (
                            <p className="text-danger">Error: {err}</p>
                        ) : (
                            <p>No books found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
