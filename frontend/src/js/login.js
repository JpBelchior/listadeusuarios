// frontend/js/login.js
// Configuração inicial do axios para comunicação com a API
const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Selecionando o formulário de login
const loginForm = document.querySelector(".login-form");

// Função para mostrar mensagens (sucesso ou erro)
const showMessage = (message, type = "error") => {
  const messageBox = document.querySelector(".message-box");

  // Limpar classes anteriores
  messageBox.classList.remove("error", "success");

  // Definir conteúdo e classe
  messageBox.textContent = message;
  messageBox.classList.add(type);
  messageBox.classList.add("visible");

  // Animar
  messageBox.style.animation = "fadeIn 0.3s ease";

  // Remover após 3 segundos
  setTimeout(() => {
    messageBox.classList.remove("visible");
    messageBox.textContent = "";
  }, 3000);
};

// Função para realizar o login
const login = async (event) => {
  event.preventDefault();

  const credentials = {
    username: event.target.username.value,
    password: event.target.password.value,
  };

  try {
    const response = await api.post("/auth/login", credentials);

    // Login bem-sucedido
    const { token, user } = response.data;

    // Armazenar o token e informações do usuário no localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    showMessage("Login realizado com sucesso!", "success");

    // Redirecionar para a página principal após 1 segundo
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  } catch (error) {
    console.error("Erro de login:", error);
    const errorMessage =
      error.response?.data?.message ||
      "Falha na autenticação. Verifique suas credenciais.";
    showMessage(errorMessage, "error");
  }
};

// Adicionar evento de submit ao formulário
loginForm.addEventListener("submit", login);
