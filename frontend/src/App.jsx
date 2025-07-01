import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from "./pages/Home.page.jsx"
import SignInPage from './pages/SignIn.page.jsx';
import SignUpPage from './pages/SignUp.page.jsx';
import ErrorPage from './pages/Error.page.jsx';
import AdminDashboard from './pages/AdminDashboard.page.jsx';
import CustomerDashboard from './pages/CustomerDashboard.page.jsx';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard.page.jsx';


function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />, 
      errorElement: <ErrorPage/>
    },{
      path: '/signin',
      element: <SignInPage/>,
      errorElement: <ErrorPage/>
    },{
      path: '/signup',
      element: <SignUpPage/>,
      errorElement: <ErrorPage/>
    },{
      path: '/admin-dashboard',
      element: <AdminDashboard/>,
      errorElement: <ErrorPage/>
    },{
      path: '/customer-dashboard',
      element: <CustomerDashboard/>,
      errorElement: <ErrorPage/>
    },{
      path: '/store-owner-dashboard',
      element: <StoreOwnerDashboard/>,
      errorElement: <ErrorPage/>
    }
  ]);

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
