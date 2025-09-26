import React, { useState } from "react";
import { useRef } from "react";
import materia from "../img/materia.svg";
import api from "../services/api";

const CadastroMateriaPrima = () => {
    const [file, setFile] = useState(null);
    const [materiaPrima, setMateriaPrima] = useState("");
    const [unidade, setUnidade] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [preco, setPreco] = useState("");
    const [fornecedorNome, setFornecedorNome] = useState("");
    const [fornecedorCNPJ, setFornecedorCNPJ] = useState("");
    const [dataEmissao, setDataEmissao] = useState("");

    const [itensPendentes, setItensPendentes] = useState([]);
    const [notaNum, setNotaNum] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Upload de XML
    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Selecione um arquivo XML primeiro.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            console.log("Enviando XML...");
            const response = await api.post("/materia/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert(response.data.message);

            // Limpa estado e input de arquivo
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const data = error.response.data;
                setItensPendentes(data.itens_pendentes);
                setNotaNum(data.num_nfe);
                setShowModal(true);
            } else {
                console.error(error);
                alert(error.response?.data?.detail || "Erro ao processar o XML.");
            }
        }
    };

    // Finalizar cadastro de itens pendentes
    const handleFinalizarPendentes = async () => {
        try {
            const response = await api.post("/materia/upload/finalizar", {
                num_nfe: notaNum,
                itens_pendentes: itensPendentes,
            });

            alert(response.data.message);
            setShowModal(false);
            setItensPendentes([]);
            setNotaNum(null);
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.detail || "Erro ao finalizar itens pendentes"
            );
        }
    };

    // Placeholder dinâmico
    const getPlaceholder = () => {
        if (!materia) return "Informe a quantidade (LITROS, METROS, KG) presente na embalagem";
        const normalized = materiaPrima.trim().toUpperCase();

        if (normalized === "LATA")
            return "Informe quantos litros tem na lata";
        if (normalized === "ROLO") return "Informe quantos metros tem o rolo";
        return "Informe a quantidade (LITROS, METROS, KG) presente na embalagem";
    };

    // Cadastro Manual chamando a API
    const handleSubmitManual = async (e) => {
        e.preventDefault();

        if (
            !materiaPrima ||
            !unidade ||
            !quantidade ||
            !preco ||
            !fornecedorNome ||
            !fornecedorCNPJ ||
            !dataEmissao
        ) {
            return alert("Preencha todos os campos antes de salvar!");
        }

        try {
            const response = await api.post("/materia/cadastrar", {
                nome: materiaPrima,
                unidade_medida: unidade,
                quantidade,
                preco_atual: preco,
                fornecedor_nome: fornecedorNome,
                fornecedor_cnpj: fornecedorCNPJ,
                data_compra: dataEmissao,
            });

            alert(response.data.message || "Cadastro manual realizado com sucesso!");

            // Limpar formulário
            setMateriaPrima("");
            setUnidade("");
            setQuantidade("");
            setPreco("");
            setFornecedorNome("");
            setFornecedorCNPJ("");
            setDataEmissao("");
        } catch (error) {
            console.error("Erro ao cadastrar manualmente:", error);
            alert(error.response?.data?.detail || "Erro ao cadastrar manualmente.");
        }
    };

    return (
        <div className="cadastro-container-materia">
            {/* Lado esquerdo */}
            <div className="form-side-materia">
                {/* Upload XML */}
                <div className="upload-section-materia">
                    <h2>Upload de Nota Fiscal</h2>
                    <p>
                        {" "}
                        Faça upload do XML da nota fiscal para extrair automaticamente as
                        matérias-primas.{" "}
                    </p>
                    <form onSubmit={handleUpload}>
                        <input
                            type="file"
                            accept=".xml"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="materia"
                        />
                        <button type="submit" className="upload-btn-materia">
                            {" "}
                            Fazer Upload{" "}
                        </button>
                    </form>
                </div>

                {/* Cadastro manual */}
                <div className="manual-section-materia">
                    <h2>Cadastro Manual</h2>
                    <form onSubmit={handleSubmitManual}>
                        <div className="row-materia">
                            <div>
                                <label>Matéria-Prima:</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Fio de Cobre, Verniz, Cadarço..."
                                    className="materia-prima"
                                    value={materiaPrima}
                                    onChange={(e) => setMateriaPrima(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Unidade:</label>
                                <select
                                    className="unidade-medida"
                                    value={unidade}
                                    onChange={(e) => setUnidade(e.target.value)}
                                >
                                    <option value="">Selecione</option>
                                    <option value="Kg">Kg</option>
                                    <option value="Litros">Litros</option>
                                    <option value="Metros">Metros</option>
                                    <option value="Unidade">Unidade</option>
                                </select>
                            </div>

                            <div>
                                <label>Quantidade:</label>
                                <input
                                    type="text"
                                    placeholder={getPlaceholder()}
                                    className="quantidade"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="row2-materia">
                            <div>
                                <label>Preço Unitário</label>
                                <input
                                    type="text"
                                    placeholder=" Ex: R$8.00"
                                    className="preco"
                                    value={preco}
                                    onChange={(e) => setPreco(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Nome do Fornecedor</label>
                                <input
                                    type="text"
                                    placeholder="Insira o nome do fornecedor"
                                    className="materia-prima"
                                    value={fornecedorNome}
                                    onChange={(e) => setFornecedorNome(e.target.value)}
                                />
                            </div>

                            <div>
                                <label>Data de Emissão</label>
                                <input
                                    type="date"
                                    className="materia-prima2"
                                    value={dataEmissao}
                                    onChange={(e) => setDataEmissao(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="salvar">
                            <label htmlFor="nome">CNPJ do fornecedor</label>
                            <input
                                type="text"
                                placeholder="XXXXXXXXXXXXXX"
                                value={fornecedorCNPJ}
                                onChange={(e) => setFornecedorCNPJ(e.target.value)}
                            />
                            <button type="submit" className="salvar-materia">
                                {" "}
                                Salvar{" "}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Lado direito */}
            <div className="info-side-materia">
                <p>
                    {" "}
                    Faça upload do arquivo xml ou preencha os campos para cadastrar as
                    matérias-primas manualmente.
                </p>
                <img src={materia} alt="Evolução de Custos" className="materia-img" />
            </div>

            {/* Modal de itens pendentes */}
            {showModal && (
                <div className="modal">
                    <h3>Informe a quantidade por embalagem</h3>
                    {itensPendentes.map((item, index) => (
                        <div key={index}>
                            <span>
                                {item.nome} ({item.unidade_medida})
                            </span>
                            <input
                                type="number"
                                value={item.qtd_embalagem || ""}
                                onChange={(e) => {
                                    const newItens = [...itensPendentes];
                                    newItens[index].qtd_embalagem = Number(e.target.value);
                                    setItensPendentes(newItens);
                                }}
                                placeholder={getPlaceholder()}
                            />
                        </div>
                    ))}
                    <button onClick={handleFinalizarPendentes}>Finalizar Cadastro</button>
                </div>
            )}
        </div>
    );
};

export default CadastroMateriaPrima;
