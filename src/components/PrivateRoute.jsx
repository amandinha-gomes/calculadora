import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("access_token");

    if (!token){
        return <Navigate to="/" />;
    }
    
    try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000; // em segundos
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem("access_token"); // limpa token inválido
      return <Navigate to="/" />;
    }
  } catch (err) {
    console.error("Token inválido:", err);
    localStorage.removeItem("access_token");
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;