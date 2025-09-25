import { useState } from "react";
import Menu from "../components/menu";
import "../css/cadastroproduto.css";
// import mcm "../img/MCM006.webp"

const CadastroProdutoContent = () => {
    const [materiais, setMateriais] = useState([
        { materia: "", unidade: "", quantidade: "" }
    ]);
    const [cadastroFinalizado, setCadastroFinalizado] = useState(false);

    const addMateria = (e) => {
        e.preventDefault();
        setMateriais([...materiais, { materia: "", unidade: "", quantidade: "" }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setCadastroFinalizado(true); // muda para tela de sucesso
    };

    const resetForm = () => {
        setCadastroFinalizado(false);
        setMateriais([{ materia: "", unidade: "", quantidade: "" }]);
    };

    if (cadastroFinalizado) {
        return (
            <div className="success-container">
                <div className="left">
                    🎉 <strong>Parabéns!</strong>
                    <p>O seu produto foi cadastrado com sucesso.</p>
                </div>
                <div className="right">
                    ✅ <strong>Cadastro finalizado</strong>
                    <p>Você pode fechar esta janela ou cadastrar outro produto.</p>
                    <button className="cadastrar-btn" onClick={resetForm}>
                        Cadastrar outro produto
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h2>Cadastro de Produto</h2>
            <form onSubmit={handleSubmit}>
                
                <label htmlFor="nome">Nome do Produto:</label>
                <input type="text" id="nome" placeholder="Nome" className="produto" />

                {/* <label htmlFor="codigo">Código:</label>
                <input type="text" id="codigo" placeholder="Ex: 00345" className="codigo" />

                <label htmlFor="preco">Preço Unitário (R$):</label>
                <input type="text" id="preco" placeholder="Ex: $0,50" className="preco-prod" />

                <label htmlFor="usuario">Usuário Responsável:</label>
                <input type="text" id="usuario" placeholder="00000" className="usuario" /> */}

                {materiais.map((item, index) => (
                    <div className="row" key={index}>
                        <div>
                            <label>Matéria-Prima:</label>
                            <input
                                type="text"
                                placeholder="Ex: Cobre"
                                className="materia-prima-produto"
                            />
                        </div>

                        {/* <div>
                            <label>Matéria:</label>
                            <select className="unidade-medida-produto">
                                <option>Selecione</option>
                                <option>Cobre</option>
                                <option>Litros</option>
                                <option>Metros</option>
                                <option>Unidade</option>
                                <option>Centímetros</option>
                            </select>
                        </div> */}

                        <div>
                            <label>Quantidade:</label>
                            <input
                                type="text"
                                placeholder="Ex: x5"
                                className="quantidade"
                                id="quantidade-produto"
                            />
                        </div>

                        {index === materiais.length - 1 && (
                            <button
                                type="button"
                                className="add-btn"
                                onClick={addMateria}
                            >
                                +
                            </button>
                        )}
                    </div>
                ))}

                <button type="submit" className="salvar-produto">Salvar</button>
            </form>

        </div>
    );
};

const CadastroProduto = () => {
    return (
        <Menu>
            <CadastroProdutoContent />
        </Menu>
    );
};

export default CadastroProdutoContent;