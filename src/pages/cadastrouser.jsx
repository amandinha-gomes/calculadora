// import Menu from "../components/menu";
import React, { useState } from "react";
import perfil from "../img/cad-user.svg"; 

const Perfil = () => {
    return (   
        <div className="cadastro-section">
            {/* Lado esquerdo */}
            <div className="side-cadastro">
                <img src={perfil} alt="Perfil" className="perfil-img" />
            </div>

            {/* Lado direito */}
            <div className="form-cadastro">
                <form>
                    <div className="row-cadastro">
                        <label>Nome</label>
                        <input type="text" placeholder="Nome completo" className="perfilll" />
                    </div>

                    <div className="row-cadastro">
                        <label>Número de Matrícula</label>
                        <input type="text" placeholder="00000" className="perfilll" />
                    </div>

                    <div className="row-cadastro">
                        <label>E-mail</label>
                        <input type="text" placeholder="emailexemplo@email.com" />
                    </div>

                    <div className="row-cadastro">
                        <label>Senha</label>
                        <input type="password" placeholder="••••••" className="perfilll" />
                    </div>

                        <button 
                            className="salvar-btn-cadastro"
                            
                        >
                            Cadastrar
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
