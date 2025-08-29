import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatSection from "./Components/ChatSection";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ChatSection />,
      errorElement: <h1>404 - Page Not Found</h1>,
    },
  ]);

  return <RouterProvider router={router} />;
  // return (
  //   <>

  //   </>
  // );
}

export default App;
