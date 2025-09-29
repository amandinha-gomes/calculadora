import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import api from "../services/api";
import "../css/dashboard.css";
import grafico from "../img/grafico.svg";
import editar from "../img/editar.svg";
import trash from "../img/trash.svg";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [produtoFiltrado, setProdutoFiltrado] = useState(null);

    const [mostrarProdutos, setMostrarProdutos] = useState(true);
    const [mostrarMaterias, setMostrarMaterias] = useState(false);

    const [produtos, setProdutos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [materiasDisponiveis, setMateriasDisponiveis] = useState([]);

    const [itemSelecionado, setItemSelecionado] = useState(null); // item atual (produto ou matéria)

    const [itemVisualizacao, setItemVisualizacao] = useState(null); // só para modal de visualização
    const [itemParaExcluir, setItemParaExcluir] = useState(null); // só para modal de exclusão
    const [editando, setEditando] = useState(false);

    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    const [produtosImpactados, setProdutosImpactados] = useState(0);
    const [itemTipo, setItemTipo] = useState(""); // "produto" ou "materia"

    const fecharModalExcluir = () => setModalExcluirAberto(false);

    // Buscar produtos ao abrir dashboard
    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await api.get("/produto/listar");
                setProdutos(response.data.produtos || []);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
                alert("Erro ao carregar produtos!");
            }
        };

        const fetchMateriasDisponiveis = async () => {
            try {
                const response = await api.get("/materia/listar");
                setMateriasDisponiveis(response.data.materias || []);
            } catch (error) {
                console.error("Erro ao buscar matérias:", error);
            }
        };

        const fetchDashboard = async () => {
            try {
                const response = await api.get("/produto/dashboard");
                setDashboardData(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados do dashboard:", error);
            }
        };

        fetchProdutos();
        fetchMateriasDisponiveis();
        fetchDashboard();
    }, []);

    // Dados do gráfico
    const graficoProdutos = (historicoProdutos, produtoFiltrado) => {
        if (!historicoProdutos) return null;

        const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

        // Coletar todos os meses existentes no histórico
        const mesesExistentes = new Set();
        Object.values(historicoProdutos).forEach(produto => {
            produto.dados.forEach(d => mesesExistentes.add(d.mes));
        });

        // Ordenar e converter para nomes
        const labels = Array.from(mesesExistentes).sort((a, b) => a - b).map(m => meses[m - 1]);

        // Obter produtos para plotar
        const produtosParaPlotar = produtoFiltrado
            ? [historicoProdutos[produtoFiltrado]]
            : Object.values(historicoProdutos);

        const datasets = produtosParaPlotar.map(produto => {
            // Mapear valores de cada mês
            const data = Array.from(mesesExistentes).sort((a, b) => a - b).map(mes => {
                const registro = produto.dados.find(d => d.mes === mes);
                return registro ? registro.valor : null; // null para mês sem valor
            });

            return {
                label: produto.nome,
                data,
                borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
                backgroundColor: "rgba(75,192,192,0.2)",
                tension: 0.4
            };
        });

        return { labels, datasets };
    };

    // Buscar matérias-primas quando o usuário clicar no botão
    const fetchMaterias = async () => {
        try {
            const response = await api.get("/materia/listar");
            setMaterias(response.data.materias || []);
        } catch (error) {
            console.error("Erro ao buscar matérias:", error);
            alert("Erro ao carregar matérias-primas!");
        }
    };

    const abrirModal = (item, tipo, modoEdicao = false) => {
        // console.log("abrirModal:", tipo, item);
        setItemSelecionado(item);
        setItemTipo(tipo);
        setEditando(modoEdicao);
    };

    const fecharModal = () => {
        setItemSelecionado(null);
        setItemTipo(null);
        setEditando(false);
    };

    const abrirModalExcluir = async (item, tipo) => {
        setItemTipo(tipo);
        setItemParaExcluir(item);

        if (tipo === "materia") {
            try {
                const response = await api.get(
                    `/materia/produtos-impactados/${item.id_materia}`
                );
                setProdutosImpactados(response.data.produtosImpactados || 0);
            } catch (error) {
                console.error("Erro ao buscar produtos impactados:", error);
                setProdutosImpactados(0);
            }
        } else {
            setProdutosImpactados(0);
        }

        setModalExcluirAberto(true);
    };

    // fechar modal com ESC
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") fecharModal();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    // salvar edição de produto e matéria-prima
    const salvarEdicao = async () => {
        try {
            if (itemTipo === "produto") {
                // Prepara matérias para envio
                const materiasParaEnviar = itemSelecionado.materias.map((m) => ({
                    id_materia: m.id_materia,
                    quantidade: m.quantidade,
                }));

                const response = await api.put(
                    `/produto/editar/${itemSelecionado.id_produto}`,
                    {
                        nome: itemSelecionado.nome,
                        materias: materiasParaEnviar,
                    }
                );

                // Atualiza produto localmente
                setProdutos(
                    produtos.map((p) =>
                        p.id_produto === itemSelecionado.id_produto
                            ? response.data.produto
                            : p
                    )
                );

                alert("Produto atualizado com sucesso!");
            } else if (itemTipo === "materia") {
                // Exemplo de envio de atualização de matéria-prima
                const payload = {
                    nome: itemSelecionado.nome,
                    unidade_medida: itemSelecionado.unidade_medida,
                    qtd_embalagem: itemSelecionado.qtd_embalagem,
                    preco_atual: itemSelecionado.preco_atual,
                    fornecedor_cnpj: itemSelecionado.fornecedor_cnpj,
                    fornecedor_nome: itemSelecionado.fornecedor_nome,
                    quantidade: itemSelecionado.quantidade,
                };

                await api.put(`/materia/editar/${itemSelecionado.id_materia}`, payload);

                // Atualiza localmente
                setMaterias(
                    materias.map((m) =>
                        m.id_materia === itemSelecionado.id_materia
                            ? { ...m, ...payload }
                            : m
                    )
                );

                alert("Matéria-prima atualizada com sucesso!");
            }

            setEditando(false);
            fecharModal();
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            alert("Erro ao atualizar item!");
        }
    };

    // Função para deletar
    const deletarItem = async () => {
        try {
            if (!itemParaExcluir) return;

            if (itemTipo === "produto") {
                await api.delete(`/produto/deletar/${itemParaExcluir.id_produto}`);
                setProdutos(
                    produtos.filter((p) => p.id_produto !== itemParaExcluir.id_produto)
                );
            } else if (itemTipo === "materia") {
                await api.delete(`/materia/deletar/${itemParaExcluir.id_materia}`);
                setMaterias(
                    materias.filter((m) => m.id_materia !== itemParaExcluir.id_materia)
                );
            }

            setItemParaExcluir(null);
            setItemSelecionado(null);
            setProdutosImpactados(0);
            setModalExcluirAberto(false);
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert(error.message || "Erro desconhecido");
        }
    };

    // calcular subtotal e total para modal de edição de produto
    const calcularSubtotal = (materia, quantidade) => {
        if (!materia || !quantidade) return 0;
        let quantidadeReal = quantidade;
        if (
            materia.unidade_medida.toUpperCase() === "LATA" &&
            materia.qtd_embalagem
        )
            quantidadeReal = quantidade / materia.qtd_embalagem;
        if (
            materia.unidade_medida.toUpperCase() === "ROLO" &&
            materia.qtd_embalagem
        )
            quantidadeReal = quantidade / materia.qtd_embalagem;
        return (quantidadeReal * materia.preco_atual).toFixed(2);
    };

    const calcularTotal = () => {
        if (!itemSelecionado?.materias) return 0;
        return itemSelecionado.materias
            .reduce((acc, m) => {
                const mat = materiasDisponiveis.find(
                    (mat) => mat.id_materia === m.id_materia
                );
                return acc + Number(calcularSubtotal(mat, m.quantidade));
            }, 0)
            .toFixed(2);
    };

    return (
        <div className="dashboard-wrapper">
            <main className="main-contentdash">
                <header className="main-header">
                    <h1>
                        Bem-vindo ao <span className="logo">FiscalCalc</span>
                    </h1>
                    <p>Dashboard de Custos e Estoque</p>
                </header>

                {/* GRÁFICO */}
                <section className="chart-section">
                    {/* <img src={grafico} alt="Evolução de Custos" className="chart-img" /> */}
                    {dashboardData && (
                        <Line
                            data={graficoProdutos(
                                dashboardData.historico_produtos,
                                produtoFiltrado
                            )}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "right", align: "start", padding: {
                                            top: 50
                                        }, labels: {
                                            font: {
                                                size: 14,   // 👈 fonte da legenda
                                                weight: "bold"
                                            }
                                        }
                                    },
                                    title: {
                                        display: true, text: "Evolução de Custo dos Produtos", align: "start", padding: {
                                            top: 10,
                                            bottom: 20
                                        }, font: {
                                            size: 16,
                                            weight: "bold",

                                        }
                                    },
                                },
                                scales: {
                                    y: {
                                        title: {
                                            display: true, text: "Custo Total (R$)", font: {
                                                size: 14
                                            }
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true, text: "Mês", font: {
                                                size: 14
                                            }
                                        }
                                    },
                                },
                            }}
                        />
                    )}
                </section>

                {/* CARDS */}
                <section className="cards1">
                    <div className="card">
                        <h2>Cadastrados</h2>
                        <p className="valor">{dashboardData?.total_produtos}</p>
                    </div>

                    <div className="card">
                        <h2>Custo Total</h2>
                        <p className="valor">
                            R$ {dashboardData?.custo_total?.toFixed(2) || "0.00"}
                        </p>
                        <small>Uma unidade por produto</small>
                    </div>

                    <div className="card2">
                        <h2>Menor Custo</h2>
                        <p className="valor2">{dashboardData?.mais_barato?.nome || "-"}</p>
                        <small>
                            R$ {dashboardData?.mais_barato?.custo_total?.toFixed(2) || "0.00"}
                        </small>
                    </div>

                    <div className="card2">
                        <h2>Maior Custo</h2>
                        <p className="valor2">{dashboardData?.mais_caro?.nome || "-"}</p>
                        <small>
                            R$ {dashboardData?.mais_caro?.custo_total?.toFixed(2) || "0.00"}
                        </small>
                    </div>
                </section>

                {/* BOTÕES */}
                <div className="actions">
                    <button
                        onClick={() => {
                            setMostrarProdutos(true);
                            setMostrarMaterias(false);
                        }}
                    >
                        Produtos Cadastrados
                    </button>
                    <button
                        onClick={() => {
                            setMostrarMaterias(true);
                            setMostrarProdutos(false);
                            fetchMaterias();
                        }}
                    >
                        Matérias Cadastradas
                    </button>
                </div>

                {/* LISTAGEM DE PRODUTOS */}
                {mostrarProdutos && (
                    <section className="produtos-section">
                        <table className="produtos-table">
                            <thead>
                                <tr>
                                    <th id="id-produtos-table">ID</th>
                                    <th>Nome</th>
                                    <th>Custo Total (R$)</th>
                                    <th>Criador</th>
                                    <th>Data Atualização</th>
                                    <th id="id1-produtos-table">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos.map((p) => (
                                    <tr
                                        key={p.id_produto}
                                        onClick={() => abrirModal(p, "produto")}
                                        className="linha-click"
                                    >
                                        <td>{p.id_produto}</td>
                                        <td>{p.nome}</td>
                                        <td>{p.custo_total}</td>
                                        <td>{p.criador}</td>
                                        <td>{p.data_atualizacao}</td>
                                        <td className="acoes-cell">
                                            <button
                                                className="btn-acao editar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    abrirModal(p, "produto", true);
                                                }}
                                            >
                                                <img src={editar} alt="Editar" />
                                            </button>
                                            <button
                                                className="btn-acao deletar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    abrirModalExcluir(p, "produto");
                                                }}
                                            >
                                                <img src={trash} alt="Deletar" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* LISTAGEM DE MATÉRIAS-PRIMAS */}
                {mostrarMaterias && (
                    <section className="produtos-section">
                        <table className="produtos-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Matéria</th>
                                    <th>Preço Atual (R$)</th>
                                    <th>Fornecedor</th>
                                    <th>Data Atualização</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materias.map((m, index) => (
                                    <tr
                                        key={m.id_materia}
                                        onClick={() => abrirModal(m, "materia")}
                                        className="linha-click"
                                    >
                                        <td>{m.id_materia}</td>
                                        <td>{m.nome}</td>
                                        <td>{m.preco_atual}</td>
                                        <td>{m.fornecedor}</td>
                                        <td>{m.data_atualizacao}</td>
                                        <td className="acoes-cell">
                                            <button
                                                className="btn-acao editar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    abrirModal(m, "materia", true);
                                                }}
                                            >
                                                <img src={editar} alt="Editar" />
                                            </button>
                                            <button
                                                className="btn-acao deletar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    abrirModalExcluir(m, "materia");
                                                }}
                                            >
                                                <img src={trash} alt="Deletar" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* MODAL */}
                {itemSelecionado && (
                    <div className="modal-overlay" onClick={fecharModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Detalhes do {itemTipo}</h3>

                            {itemTipo === "produto" ? (
                                <div className="modal-body">
                                    {/* Campos não editáveis */}
                                    <p>
                                        <strong>ID:</strong> {itemSelecionado.id_produto}
                                    </p>
                                    <p>
                                        <strong>Custo Total:</strong> R${" "}
                                        {itemSelecionado.custo_total.toFixed(2)}
                                    </p>
                                    <p>
                                        <strong>Data Atualização:</strong>{" "}
                                        {itemSelecionado.data_atualizacao}
                                    </p>
                                    <p>
                                        <strong>Criador:</strong> {itemSelecionado.criador}
                                    </p>

                                    {/* Nome editável */}
                                    {editando ? (
                                        <div>
                                            <label>Nome:</label>
                                            <input
                                                type="text"
                                                value={itemSelecionado.nome}
                                                onChange={(e) =>
                                                    setItemSelecionado({
                                                        ...itemSelecionado,
                                                        nome: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <p>
                                            <strong>Nome:</strong> {itemSelecionado.nome}
                                        </p>
                                    )}

                                    <h4>Matérias</h4>

                                    {itemSelecionado.materias?.length > 0 ? (
                                        <table className="materias-table">
                                            <thead>
                                                <tr>
                                                    <th>Matéria</th>
                                                    <th>Quantidade</th>
                                                    <th>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {itemSelecionado.materias.map((mat, index) => {
                                                    const materiaBanco = materiasDisponiveis.find(
                                                        (m) => m.id_materia === mat.id_materia
                                                    );

                                                    return (
                                                        <tr key={mat.id_materia}>
                                                            <td>
                                                                {editando ? (
                                                                    <select
                                                                        value={mat.id_materia}
                                                                        onChange={(e) => {
                                                                            const novasMaterias = [
                                                                                ...itemSelecionado.materias,
                                                                            ];
                                                                            novasMaterias[index].id_materia = Number(
                                                                                e.target.value
                                                                            );
                                                                            setItemSelecionado({
                                                                                ...itemSelecionado,
                                                                                materias: novasMaterias,
                                                                            });
                                                                        }}
                                                                    >
                                                                        <option value="">Selecione</option>
                                                                        {materiasDisponiveis.map((m) => (
                                                                            <option
                                                                                key={m.id_materia}
                                                                                value={m.id_materia}
                                                                            >
                                                                                {m.nome}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                ) : (
                                                                    materiaBanco?.nome || "N/A"
                                                                )}
                                                            </td>

                                                            <td>
                                                                {editando ? (
                                                                    <input
                                                                        type="number"
                                                                        step="0.001"
                                                                        value={mat.quantidade || ""}
                                                                        onChange={(e) => {
                                                                            const novasMaterias = [
                                                                                ...itemSelecionado.materias,
                                                                            ];
                                                                            novasMaterias[index].quantidade =
                                                                                e.target.value === ""
                                                                                    ? ""
                                                                                    : Number(e.target.value);
                                                                            setItemSelecionado({
                                                                                ...itemSelecionado,
                                                                                materias: novasMaterias,
                                                                            });
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    mat.quantidade
                                                                )}
                                                            </td>

                                                            <td>
                                                                R${" "}
                                                                {calcularSubtotal(
                                                                    materiasDisponiveis.find(
                                                                        (m) => m.id_materia === mat.id_materia
                                                                    ),
                                                                    mat.quantidade
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>Nenhuma matéria vinculada.</p>
                                    )}

                                    {editando && (
                                        <div className="total-produto-modal">
                                            <strong>Total: R$ {calcularTotal()}</strong>
                                        </div>
                                    )}

                                    <div className="modal-actions">
                                        {editando && <button onClick={salvarEdicao}>Salvar</button>}
                                        <button className="close-btn" onClick={fecharModal}>
                                            Fechar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // Modal para matéria-prima
                                <div className="modal-body">
                                    {editando ? (
                                        <div>
                                            {/* Exibir ID e Data sem permitir edição */}
                                            <p>
                                                <strong>ID:</strong> {itemSelecionado.id_materia}
                                            </p>
                                            <p>
                                                <strong>Data Atualização:</strong>{" "}
                                                {itemSelecionado.data_atualizacao}
                                            </p>

                                            {/* Campos editáveis */}
                                            {Object.entries(itemSelecionado)
                                                .filter(
                                                    ([key]) =>
                                                        key !== "id_materia" &&
                                                        key !== "data_atualizacao" &&
                                                        key !== "fornecedor_cnpj"
                                                )
                                                .map(([key, value]) => (
                                                    <div key={key}>
                                                        <label>{key}:</label>
                                                        <input
                                                            type={
                                                                typeof value === "number" ? "number" : "text"
                                                            }
                                                            value={value || ""}
                                                            onChange={(e) =>
                                                                setItemSelecionado({
                                                                    ...itemSelecionado,
                                                                    [key]: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            <button onClick={salvarEdicao}>Salvar</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p>
                                                <strong>ID:</strong> {itemSelecionado.id_materia}
                                            </p>
                                            <p>
                                                <strong>Data Atualização:</strong>{" "}
                                                {itemSelecionado.data_atualizacao}
                                            </p>

                                            {Object.entries(itemSelecionado)
                                                .filter(
                                                    ([key]) =>
                                                        key !== "id_materia" && key !== "data_atualizacao"
                                                )
                                                .map(([key, value], i) => (
                                                    <p key={i}>
                                                        <strong>{key}:</strong> {value}
                                                    </p>
                                                ))}
                                        </div>
                                    )}
                                    <button className="close-btn" onClick={fecharModal}>
                                        Fechar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
                {modalExcluirAberto && (
                    <div className="modal-overlay" onClick={fecharModalExcluir}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Confirmar Exclusão</h3>
                            <p>
                                {produtosImpactados > 0
                                    ? `Atenção! ${produtosImpactados} produto(s) usam essa matéria-prima. Deletar pode afetar essas relações.`
                                    : "Tem certeza que deseja excluir esse registro?"}
                            </p>
                            <div className="modal-actions">
                                <button className="btn-excluir" onClick={deletarItem}>
                                    Excluir
                                </button>
                                <button className="btn-voltar" onClick={fecharModalExcluir}>
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
