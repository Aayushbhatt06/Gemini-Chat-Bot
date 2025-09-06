import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND;
export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const verifyUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/verify/verifyToken`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) setUser(data.user);
        else localStorage.removeItem("authToken");
      } catch (err) {
        console.error("Token verification error:", err);
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
}
