import "./sidebar.css";
import { FaTimes } from "react-icons/fa";
import SidebarItem from "../SidebarItem";

const Sidebar = ({ active }) => {
    const closeSidebar = () => active(false);

    return (
        <div className={`sidebar ${active ? "active" : ""}`}>
            <FaTimes className="close-icon" onClick={closeSidebar} />
            <div className="sidebar-content">
                <SidebarItem Text="Dashboard" to="/dashboard" onClick={closeSidebar} />
                <SidebarItem Text="Cadastrar Matéria-Prima" to="/cadastromateria" onClick={closeSidebar} />
                <SidebarItem Text="Cadastrar Produto" to="/cadastroproduto" onClick={closeSidebar} />
                <SidebarItem Text="Cadastrar Usuários" to="/cadastrouser" onClick={closeSidebar} />
                <SidebarItem Text="Perfil" to="/perfil" onClick={closeSidebar} />
                <SidebarItem Text="Sair" to="/login" onClick={closeSidebar} />
                {/* <SidebarItem Text="Dashboard" />
                <SidebarItem Text="Cadastrar Matéria-Prima" />
                <SidebarItem Text="Cadastrar Produto" />
                <SidebarItem Text="Cadastrar Usuários" />
                <SidebarItem Text="Histórico" />
                <SidebarItem Text="Perfil" />
                <SidebarItem Text="Sair" /> */}
            </div>
        </div>
    );
};

export default Sidebar;
