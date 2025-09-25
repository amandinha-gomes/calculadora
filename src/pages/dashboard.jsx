// import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import "../css/dashboard.css";
import grafico from "../img/grafico.svg";
import editar from "../img/editar.svg";
import trash from "../img/trash.svg"

const Dashboard = () => {
    const [mostrarProdutos, setMostrarProdutos] = useState(false);
    const [mostrarMaterias, setMostrarMaterias] = useState(false);

    // controle do modal
    const [itemSelecionado, setItemSelecionado] = useState(null);
    const [itemTipo, setItemTipo] = useState(null); // 'produto' ou 'materia'
    const [editando, setEditando] = useState(false);

    // produtos (cada item tem id único)
    const [produtos, setProdutos] = useState([
        {
            // id: "1",
            nome: "MCM037",
            codigo: "000604",
            preco: 85.0,
            estoque: 12,
            ultimaAtualizacao: "16/07/2025",
            materiaPrima: ["Tinta", "Solvente", "Verniz"],
            quantidade: "2 Latas (10l)",
            fornecedor: "Marquinhos"
        },
        {
            // id: "2",
            nome: "MCM010",
            codigo: "000605",
            preco: 55.0,
            estoque: 8,
            ultimaAtualizacao: "09/08/2025",
            materiaPrima: "Aço",
            quantidade: "5 Barras",
            fornecedor: "Luquinhas"
        },
        {
            // id: "3",
            nome: "MCM033E-C",
            codigo: "000606",
            preco: 110.0,
            estoque: 20,
            ultimaAtualizacao: "23/04/2024",
            materiaPrima: "Cobre",
            quantidade: "3 Kg",
            fornecedor: "Aninha"
        }
    ]);

    // matérias-primas
    const[materias, setMaterias] = useState([
        { materia: "Tinta", codigo: "000604", custo: 85.0, fornecedor: "Marquinhos", data: "16/07/2025" },
        { materia: "Aço", codigo: "000605", custo: 120.0, fornecedor: "Luquinhas", data: "09/08/2025" },
        { materia: "Cobre", codigo: "000606", custo: 95.0, fornecedor: "Aninha", data: "23/04/2024" }
    ]);

    const abrirModal = (item, tipo) => {
        // console.log("abrirModal:", tipo, item);
        setItemSelecionado(item);
        setItemTipo(tipo);
        setEditando(false);
    };

    const fecharModal = () => {
        setItemSelecionado(null);
        setItemTipo(null);
        setEditando(false);
    };

    // editar item
    const salvarEdicao = () => {
        if (itemTipo === "produto") {
            setProdutos(produtos.map(p => p.id === itemSelecionado.id ? itemSelecionado : p));
        } else if (itemTipo === "materia") {
            setMaterias(materias.map(m => m.codigo === itemSelecionado.codigo ? itemSelecionado : m));
        }
        setEditando(false);
    };

    // deletar item
    const deletarItem = () => {
        if (itemTipo === "produto") {
            setProdutos(produtos.filter(p => p.id !== itemSelecionado.id));
        } else if (itemTipo === "materia") {
            setMaterias(materias.filter(m => m.codigo !== itemSelecionado.codigo));
        }
        fecharModal();
    };

    // fechar modal com ESC
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") fecharModal();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    return (
        <div className="dashboard-wrapper">
            <main className="main-contentdash">
                <header className="main-header">
                    <h1>Bem-vindo ao <span className="logo">FiscalCalc</span></h1>
                    <p>Dashboard de Custos e Estoque</p>
                </header>

                {/* GRÁFICO */}
                <section className="chart-section">
                    <img src={grafico} alt="Evolução de Custos" className="chart-img" />
                </section>

                {/* CARDS */}
                <section className="cards1">
                    <div className="card">
                        <h2>Cadastrados</h2>
                        <p className="valor">7</p>
                    </div>

                    <div className="card">
                        <h2>Custo Total</h2>
                        <p className="valor">R$ 10.500,00</p>
                        <small>Uma unidade por produto</small>
                    </div>

                    <div className="card2">
                        <h2>Menor Custo</h2>
                        <p className="valor2">MCM010</p>
                        <small>R$ 55,00</small>
                    </div>

                    <div className="card2">
                        <h2>Maior Custo</h2>
                        <p className="valor2">MCM037</p>
                        <small>R$ 110,00</small>
                    </div>
                </section>

                {/* BOTÕES */}
                <div className="actions">
                    <button onClick={() => { setMostrarProdutos(!mostrarProdutos); setMostrarMaterias(false); }}>
                        Produtos Cadastrados
                    </button>
                    <button onClick={() => { setMostrarMaterias(!mostrarMaterias); setMostrarProdutos(false); }}>
                        Matérias Cadastradas
                    </button>
                </div>

                {/* LISTAGEM DE PRODUTOS */}
                {mostrarProdutos && (
                    <section className="produtos-section">
                        <table className="produtos-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Código</th>
                                    <th>Preço (R$)</th>
                                    <th>Estoque</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos.map((p) => (
                                    <tr key={p.id} onClick={() => abrirModal(p, "produto")} className="linha-click">
                                        <td>{p.nome}</td>
                                        <td>{p.codigo}</td>
                                        <td>{p.preco.toFixed(2)}</td>
                                        <td>{p.estoque}</td>
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
                                    <th>Matéria</th>
                                    <th>Código</th>
                                    <th>Valor Custo (R$)</th>
                                    <th>Fornecedor</th>
                                    <th>Data de compra</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materias.map((m, index) => (
                                    <tr key={index} onClick={() => abrirModal(m, "materia")} className="linha-click">
                                        <td>{m.materia}</td>
                                        <td>{m.codigo}</td>
                                        <td>{m.custo.toFixed(2)}</td>
                                        <td>{m.fornecedor}</td>
                                        <td>{m.data}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* MODAL */}
                {itemSelecionado && (
                    <div className="modal-overlay" onClick={fecharModal}>
                        <img
                            src={editar}
                            alt="editar"
                            className="editar-img"
                            onClick={(e) => { e.stopPropagation(); setEditando(true); }}
                        />
                        <img
                            src={trash}
                            alt="deletar"
                            className="deletar-img"
                            onClick={(e) => { e.stopPropagation(); deletarItem(); }}
                        />
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>Detalhes</h3>

                            {editando ? (
                                <div className="modal-body">
                                    {Object.keys(itemSelecionado).map((key) => (
                                        <div key={key}>
                                            <label>{key}:</label>
                                            <input
                                                type="text"
                                                value={itemSelecionado[key]}
                                                onChange={(e) =>
                                                    setItemSelecionado({
                                                        ...itemSelecionado,
                                                        [key]: e.target.value
                                                    })
                                                }
                                            />
                                        </div>
                                    ))}
                                    <button onClick={salvarEdicao}>Salvar</button>
                                </div>
                            ) : (
                                <div className="modal-body">
                                    {Object.entries(itemSelecionado).map(([key, value], i) => (
                                        <p key={i}><strong>{key}:</strong> {Array.isArray(value) ? value.join(", ") : value}</p>
                                    ))}
                                </div>
                            )}

                            <button className="close-btn" onClick={fecharModal}>Fechar</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
