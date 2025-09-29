// import Menu from "../components/menu";
import React, { useEffect, useState } from "react";
import perfil from "../img/perfil.svg";
import userEvent from "@testing-library/user-event";
import api from "../services/api";

const Perfil = () => {
    const [user, setUser] = useState({
        nome: "",
        matricula: "",
        email: ""
    });
    const [editando, setEditando] = useState(false);
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");

    // Puxa os dados do usuário ao carregar a página
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get("/auth/my-user"); // rota do back-end
                setUser({
                    matricula: response.data.matricula,
                    nome: response.data.nome,
                    email: response.data.email
                });
            } catch (error) {
                console.error("Erro ao carregar usuário:", error);
            }
        };
        fetchUser();
    }, []);

    const handleEditar = (e) => {
        e.preventDefault();
        setEditando(true);
    };

    const handleVoltar = (e) => {
        e.preventDefault();
        setEditando(false);
    };

    const handleSalvar = async (e) => {
        try {
            const payload = {
                ...user,
                senha_atual: senhaAtual || undefined,
                nova_senha: novaSenha || undefined
            };
            await api.put("/auth/editar", payload); // rota de edição do back-end
            alert("Alterações salvas!");
            setEditando(false);
            setSenhaAtual("");
            setNovaSenha("");
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            alert(error.response?.data?.detail || "Erro ao atualizar usuário");
        }
    };

    return (
        <div className="perfil-page">
            <div className="perfil-section">
                <h2>Perfil</h2>
                <form className="section-perfil">
                    {!editando ? (
                        <>
                        <div className="info">
                            <h3>Nome:</h3>
                            <p>{user.nome}</p>
                        </div>

                        <div className="info">
                            <h3>Matrícula:</h3>
                            <p>{user.matricula}</p>
                        </div>

                        <div className="info">
                            <h3>E-mail:</h3>
                            <p>{user.email}</p>
                        </div>
                        </>

                    ) : (
                        <>
                        <div className="row-perfil">
                                <div>
                                    <label>Nome</label>
                                    <input type="text" placeholder="Nome completo" className="perfilll" value={user.nome} onChange={(e) => setUser({ ...user, nome: e.target.value })} />
                                </div>
                            </div>

                            <div className="row-perfil">
                                <div>
                                    <label>Número de Matrícula</label>
                                    <input type="text" placeholder="00000" className="perfilll" value={user.matricula} onChange={(e) => setUser({ ...user, matricula: e.target.value })} />
                                </div>
                            </div>

                            <div className="row-perfil">
                                <div>
                                    <label>Email</label>
                                    <input type="text" placeholder="emailexemplo@email.com" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                                </div>
                            </div>

                            <div className="row-perfil">
                                <div>
                                    <label>Senha Atual</label>
                                    <input type="password" placeholder="••••••" className="perfilll" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />
                                </div>
                            </div>

                            <div className="row-perfil">
                                <div>
                                    <label>Nova Senha</label>
                                    <input type="password" placeholder="••••••" className="perfilll" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
                                </div>
                            </div>
                        </>
                    )}
                    <div className="salvar-perfil">

                        {/* Botões alternando */}
                        {!editando ? (
                            <button
                                className="salvar-btn-materia"
                                onClick={handleEditar}
                            >
                                Editar informações
                            </button>
                        ) : (
                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                <button
                                    className="btn-salvar"
                                    onClick={handleSalvar}
                                >
                                    Salvar Alterações
                                </button>
                                <button
                                    className="btn-voltar"
                                    onClick={handleVoltar}
                                >
                                    Voltar
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>

            <div className="side-perfil">
                <img src={perfil} alt="Perfil" className="perfil-img" />
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
