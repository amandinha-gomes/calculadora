import React, { useState } from "react";
import styles from "../css/login.module.css";
import calculator from "../img/calculator.svg";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {
            const response = await api.post("/auth/login", { email, senha });

            // Salva token no localStorage
            localStorage.setItem("access_token", response.data.access_token);

            // Salva dados do usuário
            localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

            // Redireciona
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.detail || "Erro ao fazer login");
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.container}>

                {/* Lado Esquerdo */}
                <div className={styles.leftPanel}>
                    <div className={styles.overlay}>
                        <h2 className={styles.brand}>FISCALCALC</h2>
                        <p className={styles.invite}>
                            Sua solução <br />
                            <strong>para calcular custos com precisão.</strong>
                        </p>
                        <p className={styles.subtext}>
                            Plataforma 100% segura e confiável para gestão de custos.
                        </p>
                        <div className={styles.logo}>
                            <img
                                src={calculator}
                                alt="Ícone calculadora"
                                className={styles.calculatorIcon}
                            />
                        </div>
                    </div>
                </div>

                {/* Lado Direito */}
                <div className={styles.rightPanel}>
                    <form onSubmit={handleLogin} className={styles.loginForm}>
                        <h2 className={styles.title}>Login</h2>

                        <label htmlFor="email" className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Informe seu email"
                            required
                            className={styles.formInput}
                        />

                        <label htmlFor="senha" className={styles.formLabel}>Senha</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="senha"
                            placeholder="••••••"
                            required
                            className={styles.formInput}
                        />

                        <div className={styles.showPassword}>
                            <input
                                type="checkbox"
                                id="show-password"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label htmlFor="show-password">Mostrar senha</label>
                        </div>

                        <button type="submit" className={styles.btn}>
                            Login →
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;