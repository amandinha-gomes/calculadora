import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Perfil from "./pages/perfil";
import CadastroProduto from "./pages/cadastroproduto";
import CadastroMateria from "./pages/cadastromateria";
import CadastroUser from "./pages/cadastrouser";
import Login from "./pages/login";
import Header from "./components/Header";

const Router = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/cadastroproduto" element={<CadastroProduto />} />
                <Route path="/cadastromateria" element={<CadastroMateria />} />
                <Route path="/cadastrouser" element={<CadastroUser />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
};

export default Router;

// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Dashboard from "./pages/dashboard";
// import Perfil from "./pages/perfil";
// import CadastroProduto from "./pages/cadastroproduto";
// import CadastroMateria from "./pages/cadastromateria";
// import CadastroUser from "./pages/cadastrouser";
// import HistoricoNotas from "./pages/historiconotas";
// import Login from "./pages/login";
// import Menu from "./components/menu";

// const Router = () => {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 {/* Login sem sidebar */}
//                 <Route path="/login" element={<Login />} />

//                 {/* Rotas com sidebar */}
//                 <Route
//                     path="/*"
//                     element={
//                         <Menu>
//                             <Routes>
//                                 <Route path="/dashboard" element={<Dashboard />} />
//                                 <Route path="/perfil" element={<Perfil />} />
//                                 <Route path="/cadastroproduto" element={<CadastroProduto />} />
//                                 <Route path="/cadastromateria" element={<CadastroMateria />} />
//                                 <Route path="/cadastrouser" element={<CadastroUser />} />
//                                 <Route path="/historico" element={<HistoricoNotas />} />
//                                 <Route path="*" element={<Dashboard />} />
//                             </Routes>
//                         </Menu>
//                     }
//                 />
//             </Routes>
//         </BrowserRouter>
//     );
// };

// export default Router;

