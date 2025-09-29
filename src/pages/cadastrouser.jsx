// import Menu from "../components/menu";
import React, { useState } from "react";
import perfil from "../img/cad-user.svg";
import api from "../services/api"

const Perfil = () => {
    const [nome, setNome] = useState("");
    const [matricula, setMatricula] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 0));

        try {
            const payload = {
                nome,
                matricula,
                email,
                senha
            };
            const response = await api.post("/auth/register", payload); // rota do back-end
            alert(`Usuário ${response.data.nome} cadastrado com sucesso!`);

            // Limpa o formulário
            setNome("");
            setMatricula("");
            setEmail("");
            setSenha("");

        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            alert(error.response?.data?.detail || "Erro ao cadastrar usuário");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cadastro-section">
            {/* Lado esquerdo */}
            <div className="side-cadastro">
                <img src={perfil} alt="Perfil" className="perfil-img" />
            </div>

            {/* Lado direito */}
            <div className="form-cadastro">
                <form onSubmit={handleSubmit}>
                    <div className="row-cadastro">
                        <label>Nome</label>
                        <input type="text" placeholder="Nome completo" className="perfilll" value={nome} onChange={(e) => setNome(e.target.value)} />
                    </div>

                    <div className="row-cadastro">
                        <label>Número de Matrícula</label>
                        <input type="text" placeholder="00000" className="perfilll" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
                    </div>

                    <div className="row-cadastro">
                        <label>E-mail</label>
                        <input type="text" placeholder="emailexemplo@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="row-cadastro">
                        <label>Senha</label>
                        <input type="password" placeholder="••••••" className="perfilll" value={senha} onChange={(e) => setSenha(e.target.value)} />
                    </div>

                    <button
                        type="submit"
                        className="salvar-btn-cadastro"
                        disabled={loading}
                    >
                        {loading ? "Cadastrando..." : "Cadastrar"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const PerfilContent = () => {
    // return (
    //     <Menu>
    //         <PerfilContent />
    //     </Menu>
    // );
};

export default Perfil;
