import "./sidebar.css";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SidebarItem from "../SidebarItem";

const Sidebar = ({ active }) => {
    const closeSidebar = () => active(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access_token"); // apaga o token
        navigate("/login"); // redireciona para a tela de login
        closeSidebar(); // fecha a sidebar
    };

    return (
        <div className={`sidebar ${active ? "active" : ""}`}>
            <FaTimes className="close-icon" onClick={closeSidebar} />
            <div className="sidebar-content">
                <SidebarItem Text="Dashboard" to="/dashboard" onClick={closeSidebar} />
                <SidebarItem Text="Cadastrar Matéria-Prima" to="/cadastromateria" onClick={closeSidebar} />
                <SidebarItem Text="Cadastrar Produto" to="/cadastroproduto" onClick={closeSidebar} />
                <SidebarItem Text="Cadastrar Usuários" to="/cadastrouser" onClick={closeSidebar} />
                <SidebarItem Text="Perfil" to="/perfil" onClick={closeSidebar} />
                <SidebarItem Text="Sair" to="/" onClick={handleLogout} />
            </div>
        </div>
    );
};

export default Sidebar;
