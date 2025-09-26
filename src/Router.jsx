import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Perfil from "./pages/perfil";
import CadastroProduto from "./pages/cadastroproduto";
import CadastroMateria from "./pages/cadastromateria";
import CadastroUser from "./pages/cadastrouser";
import Login from "./pages/login";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastroproduto"
          element={
            <PrivateRoute>
              <CadastroProduto />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastromateria"
          element={
            <PrivateRoute>
              <CadastroMateria />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastrouser"
          element={
            <PrivateRoute>
              <CadastroUser />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;