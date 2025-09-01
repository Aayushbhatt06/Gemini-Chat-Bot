import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatSection from "./Components/ChatSection";
import Login from "./components/Login"; // your login component
import Signup from "./components/Signup"; // your signup component
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute"; // your auth wrapper

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
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
  ]);

  return <RouterProvider router={router} />;
}

export default App;
