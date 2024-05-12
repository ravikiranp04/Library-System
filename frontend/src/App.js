import "./App.css";
import Home from './components/Home/Home';
import Signin from './components/Signin/Signin';
import Signup from "./components/Signup/Signup";
import RootLayout from "./RootLayout";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Changed import
import UserProfile from "./components/user-profile/UserProfile";
import StaffProfile from "./components/staff-profile/StaffProfile";
import Books from "./components/Books/Books";
import AddNewBook from "./components/add-new-book/AddNewBook";

function App() {

  let browserRouter = createBrowserRouter([
    {
      path: '',
      element: <RootLayout />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: '/signin',
          element: <Signin />,
        },
        {
          path: '/signup',
          element: <Signup />,
        },
        {
          path: '/user-profile',
          element: <UserProfile />,
          children: [
            {
              path: 'mybooks',
              element: <Books />, 
            },
            {
              path: 'prevbooks',
              element: <prevBooks />, 
            }
          ],
        },
        {
          path: '/staff-profile',
          element: <StaffProfile />,
          children: [
            {
              path: 'newbook', 
              element: <AddNewBook /> 
            }
          ],
        }
      ]
    }
  ]);
  

  return (
    <div>
      {/* <h2>library done</h2> */}
      <RouterProvider router={browserRouter}/>
    </div>
  );
}

export default App;
