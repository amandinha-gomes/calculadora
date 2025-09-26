// export default CadastroProdutoContent;
import { useEffect, useState } from "react";
import Menu from "../components/menu";
import "../css/cadastroproduto.css";
import api from "../services/api";

const CadastroProdutoContent = () => {
    const [produtoNome, setProdutoNome] = useState("");
    const [materiais, setMateriais] = useState([{ materia: "", unidade: "", quantidade: "" }]);
    const [materiasDisponiveis, setMateriasDisponiveis] = useState([]);
    const [cadastroFinalizado, setCadastroFinalizado] = useState(false);

    // 🔹 Busca as matérias-primas ao carregar a página
    useEffect(() => {
        const fetchMaterias = async () => {
            try {
                const response = await api.get("/materia/listar");
                setMateriasDisponiveis(response.data.materias);
            } catch (error) {
                console.error("Erro ao buscar matérias:", error);
                alert("Erro ao carregar matérias-primas cadastradas!");
            }
        };

        fetchMaterias();
    }, []);

    // 🔹 Manipulação de seleção de matéria
    const handleMateriaChange = (index, idMateria) => {
        const materiaSelecionada = materiasDisponiveis.find((m) => m.id_materia === Number(idMateria));

        const novosMateriais = [...materiais];
        novosMateriais[index].materia = idMateria;
        novosMateriais[index].unidade = materiaSelecionada?.unidade_medida || "";
        setMateriais(novosMateriais);
    };

    const handleQuantidadeChange = (index, value) => {
        const novosMateriais = [...materiais];
        novosMateriais[index].quantidade = value;
        setMateriais(novosMateriais);
    };

    const addMateria = (e) => {
        e.preventDefault();
        setMateriais([...materiais, { materia: "", unidade: "", quantidade: "" }]);
    };

    const resetForm = () => {
        setCadastroFinalizado(false);
        setProdutoNome("");
        setMateriais([{ materia: "", unidade: "", quantidade: "" }]);
    };

    // 🔹 Cálculo de subtotal considerando LATA e ROLO
    const calcularSubtotal = (materiaSelecionada, quantidadeInformada) => {
        if (!materiaSelecionada || !quantidadeInformada) return 0;

        let quantidadeReal = quantidadeInformada;

        if (materiaSelecionada.unidade_medida.toUpperCase() === "LATA" && materiaSelecionada.qtd_embalagem) {
            quantidadeReal = quantidadeInformada / materiaSelecionada.qtd_embalagem; // Litros
        } else if (materiaSelecionada.unidade_medida.toUpperCase() === "ROLO" && materiaSelecionada.qtd_embalagem) {
            quantidadeReal = quantidadeInformada / materiaSelecionada.qtd_embalagem; // Metros
        }

        return (quantidadeReal * materiaSelecionada.preco_atual).toFixed(2);
    };

    // 🔹 Subtotal total do produto
    const calcularTotal = () => {
        return materiais.reduce((total, item) => {
            const materiaSelecionada = materiasDisponiveis.find((m) => m.id_materia === Number(item.materia));
            return total + Number(calcularSubtotal(materiaSelecionada, item.quantidade));
        }, 0).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!produtoNome) {
            return alert("Informe o nome do produto!");
        }

        // Mapeia materiais para o formato esperado pelo back-end
        const materiasParaEnviar = materiais.map((item) => ({
            id_materia: Number(item.materia),
            quantidade: Number(item.quantidade),
        }));

        try {
            const response = await api.post("/produto/cadastrar", {
                nome: produtoNome,
                materias: materiasParaEnviar,
            });

            alert(response.data.message);
            setCadastroFinalizado(true);
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            alert("Erro ao cadastrar produto! Tente novamente.");
        }
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
                <input
                    type="text"
                    id="nome"
                    placeholder="Nome"
                    className="produto"
                    value={produtoNome}
                    onChange={(e) => setProdutoNome(e.target.value)}
                />

                {materiais.map((item, index) => {
                    const materiaSelecionada = materiasDisponiveis.find((m) => m.id_materia === Number(item.materia));

                    // Determinar unidade exibida
                    let unidadeExibida = item.unidade;
                    if (item.unidade.toUpperCase() === "LATA") unidadeExibida = "Litros";
                    else if (item.unidade.toUpperCase() === "ROLO") unidadeExibida = "Metros";

                    return (
                        <div className="row" key={index}>
                            <div>
                                <label>Matéria-Prima:</label>
                                <select
                                    value={item.materia}
                                    onChange={(e) => handleMateriaChange(index, e.target.value)}
                                    className="materia-prima-produto"
                                >
                                    <option value="">Selecione</option>
                                    {materiasDisponiveis.map((materia) => (
                                        <option key={materia.id_materia} value={materia.id_materia}>
                                            {materia.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Quantidade: {unidadeExibida || "..."}</label>
                                <input
                                    type="number"
                                    placeholder="Ex: 5"
                                    className="quantidade"
                                    value={item.quantidade}
                                    onChange={(e) => handleQuantidadeChange(index, e.target.value)}
                                />
                            </div>

                            {/* Subtotal */}
                            {materiaSelecionada && item.quantidade && (
                                <div className="subtotal">
                                    Subtotal: R$ {calcularSubtotal(materiaSelecionada, item.quantidade)}
                                </div>
                            )}

                            {index === materiais.length - 1 && (
                                <button type="button" className="add-btn" onClick={addMateria}>
                                    +
                                </button>
                            )}
                        </div>
                    );
                })}

                {/* Total do produto */}
                <div className="total-produto">
                    <strong>Total: R$ {calcularTotal()}</strong>
                </div>

                <button type="submit" className="salvar-produto">
                    Salvar
                </button>
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
