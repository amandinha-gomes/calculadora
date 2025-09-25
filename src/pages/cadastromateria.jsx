import React, { useState } from "react";
import materia from "../img/materia.svg";

const CadastroMateriaPrima = () => {
    const [file, setFile] = useState(null);
    const [materiaPrima, setMateriaPrima] = useState(""); // estado para matéria-prima

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = (e) => {
        e.preventDefault();

        if (file) {
            alert(`Arquivo $ {
                    file.name
                }
                enviado com sucesso !`);
        }

        else {
            alert("Selecione um arquivo XML primeiro.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Cadastro manual realizado com sucesso!");
    };

    // placeholder dinâmico dependendo da matéria-prima
    const getPlaceholder = () => {
        if (materiaPrima.toLowerCase() === "lata") {
            return "Quantos litros tem na lata";
        }
        if (materiaPrima.toLowerCase() === "rolo") {
            return "Quantos metros tem";
        }
        return "Ex: x5"; // padrão
    };

    return (<div className="cadastro-container-materia" >

        {/* Lado esquerdo */}
        <div className="form-side-materia" >

            { /* Upload XML */}
            <div className="upload-section-materia">
                <h2>Upload de Nota Fiscal</h2>
                <p> Faça upload do XML da nota fiscal para extrair automaticamente as matérias-primas. </p>
                <form onSubmit={handleUpload}>
                        <input
                            type="file"
                            accept=".xml"
                            onChange={handleFileChange}
                            className="materia"
                        />
                        <button type="submit" className="upload-btn-materia" > Fazer Upload </button>
                </form>
                {/* <form onSubmit={handleUpload}> <input type="file" accept=".xml" onChange={handleFileChange} className="materia" />
                    <button type="submit" className="upload-btn-materia" > Fazer Upload </button>
                </form> */}
            </div>

            {/* Cadastro manual */}
            <div className="manual-section-materia" >
                <h2>Cadastro Manual</h2>
                <form onSubmit={handleSubmit}>
                    <div className="row-materia">
                        <div>
                            <label>Matéria-Prima:</label>
                            <input
                                    type="text"
                                    placeholder="Ex: Cobre, Lata, Rolo..."
                                    className="materia-prima"
                                    value={materiaPrima}
                                    onChange={(e) => setMateriaPrima(e.target.value)}
                                />
                            {/* <input type="text" placeholder="Ex: Cobre" className="materia-prima" /> */}
                        </div>

                        <div>
                            <label>Unidade:</label>
                            {/* <select
                                    className="unidade-medida"
                                    value={unidade}
                                    onChange={(e) => setUnidade(e.target.value)}
                                >
                                    <option value="">Selecione</option>
                                    <option value="Kg">Kg</option>
                                    <option value="Litros">Litros</option>
                                    <option value="Metros">Metros</option>
                                    <option value="Unidade">Unidade</option>
                                    <option value="Centímetros">Centímetros</option>
                            </select> */}
                            <select className="unidade-medida">
                                <option>Selecione</option>
                                <option>Kg</option>
                                <option>Litros</option>
                                <option>Metros</option>
                                <option>Unidade</option>
                                <option>Centímetros</option>
                            </select>
                        </div>

                        <div>
                            <label>Quantidade:</label>
                            <input
                                    type="text"
                                    placeholder={getPlaceholder()}
                                    className="quantidade"
                                />
                            {/* <input type="text" placeholder="Ex: x5" className="quantidade" /> */}
                        </div>
                    </div>

                    <div className="row2-materia">
                        <div>
                            <label>Preço</label>
                            <input type="text" placeholder=" Ex: R$50,00" className="preco" />
                        </div>

                        <div>
                            <label>Nome do Fornecedor</label>
                            <input type="text" placeholder="Insira o nome do fornecedor" className="materia-prima" />
                        </div>

                        <div>
                            <label>Data de Emissão</label>
                            <input type="date" className="materia-prima2" />
                        </div>
                    </div>

                    <div className="salvar">
                        <label htmlFor="nome">CNPJ do fornecedor</label>
                        <input type="text" placeholder="XX.XXX.XXX/XXXX-XX" />
                        <button type="submit" className="salvar-materia" > Salvar </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Lado direito */}
        <div className="info-side-materia">
            <p> Faça upload do arquivo xml ou preencha os campos para cadastrar as matérias-primas manualmente.</p>
            <img src={materia} alt="Evolução de Custos" className="materia-img" />
        </div>
    </div>);
};

export default CadastroMateriaPrima;
