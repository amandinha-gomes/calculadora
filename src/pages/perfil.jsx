// import Menu from "../components/menu";
import React, { useState } from "react";
import perfil from "../img/perfil.svg"; 

const Perfil = () => {
    const [editando, setEditando] = useState(false);

    const handleEditar = (e) => {
        e.preventDefault();
        setEditando(true);
    };

    const handleVoltar = (e) => {
        e.preventDefault();
        setEditando(false);
    };

    const handleSalvar = (e) => {
        e.preventDefault();
        alert("Alterações salvas!");
        setEditando(false);
    };

    return (
        <div>
            <div className="perfil-section">
                <h2>Perfil</h2>
                <form className="section-perfil">
                    <div className="row-perfil">
                        <div>
                            <label>Nome</label>
                            <input type="text" placeholder="Nome completo" className="perfilll" />
                        </div>
                    </div>

                    <div className="row2-perfil">
                        <div>
                            <label>Número de Matrícula</label>
                            <input type="text" placeholder="00000" className="perfilll" />
                        </div>
                    </div>

                    <div className="salvar-perfil">
                        <label htmlFor="nome">E-mail</label>
                        <input type="text" placeholder="emailexemplo@email.com" />

                        <div>
                            <label>Senha</label>
                            <input type="text" placeholder="••••••" className="perfilll" />
                        </div>

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
