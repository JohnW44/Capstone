import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import LandingPage from '../components/LandingPage/LandingPage';
import UserPage from '../components/UserPage/UserPage';
import Layout from './Layout';
import HelpRequestDetail from '../components/HelpRequestDetail/HelpRequestDetail';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "user",
        element: <UserPage />
      },
      {
        path: "help-requests/:requestId",
        element: <HelpRequestDetail />
      }
    ],
  },
]);