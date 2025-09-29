import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/cadastromateria.css";
import "../css/cadastroproduto.css";
import "../css/cadastrouser.css";
import "../css/dashboard.css";
import "../css/perfil.css";
import "../css/login.module.css"


function Menu({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="wrapper">
            <button id="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? "Fechar Menu" : "Abrir Menu"}
            </button>

            <aside className={`sidebar ${sidebarOpen ? "" : "closed"}`}>
                <ul className="menu">
                    <li>
                        <Link to="/cadastroproduto">Cadastro Produto</Link>
                    </li>
                    <li>
                        <Link to="/perfil">Perfil</Link>
                    </li>
                    <li>
                        <Link to="/historico">Histórico</Link>
                    </li>
                </ul>
            </aside>

            <main className="main-content">{children}</main>
        </div>
    );
}

export default Menu;
