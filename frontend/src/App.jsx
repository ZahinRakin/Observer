import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import HomePage from "./pages/Home.page.jsx"
import SignInPage from './pages/SignIn.page.jsx';
import SignUpPage from './pages/SignUp.page.jsx';
import ErrorPage from './pages/Error.page.jsx';


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
    }
  ]);

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
