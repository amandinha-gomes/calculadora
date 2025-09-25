import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './header.css';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../Sidebar';

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation(); // pega a rota atual

  const showSidebar = () => setSidebar(!sidebar);

  // Não renderiza o Header na página de login
  if (location.pathname === "/login") return null;

  // Define a cor do ícone dependendo da rota
  const iconColor = location.pathname === "/cadastrouser" ? "red" : "black";

  return (
    <div className="header-container">
      <FaBars onClick={showSidebar} color={iconColor} size={24} />
      {sidebar && <Sidebar active={setSidebar} />}
    </div>
  );
};

export default Header;
