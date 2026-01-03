import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatSection from "./components/ChatSection";
import Login from "./components/Login"; // your login component
import Signup from "./components/Signup"; // your signup component
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute"; // your auth wrapper
import VerifyOtp from "./components/VerifyOtp";
import GeminiChatLanding from "./components/Landing";

function App() {
  const router = createBrowserRouter([
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <ChatSection />
        </ProtectedRoute>
      ),
      errorElement: <h1>404 - Page Not Found</h1>,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/verify-otp",
      element: <VerifyOtp />,
    },
    {
      path: "/",
      element: <GeminiChatLanding />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
