import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
      <Routes>
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Header />
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <Header />
              <Perfil />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastroproduto"
          element={
            <PrivateRoute>
              <Header />
              <CadastroProduto />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastromateria"
          element={
            <PrivateRoute>
              <Header />
              <CadastroMateria />
            </PrivateRoute>
          }
        />
        <Route
          path="/cadastrouser"
          element={
            <PrivateRoute>
              <Header />
              <CadastroUser />
            </PrivateRoute>
          }
        />
        {/* Rota pública de login */}
        <Route path="/login" element={<Login />} />

        {/* Rota coringa redirecionando para login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;