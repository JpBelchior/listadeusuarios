// frontend/js/forgot-password.js

// Configuração do axios para API
const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

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

  // Remover após 5 segundos
  setTimeout(() => {
    messageBox.classList.remove("visible");
    messageBox.textContent = "";
  }, 5000);
};

// Função para solicitar recuperação de senha
const forgotPassword = async (event) => {
  event.preventDefault();

  const username = event.target.username.value.trim();

  // Validar se o campo não está vazio
  if (!username) {
    showMessage("Por favor, digite seu nome de usuário.", "error");
    return;
  }

  try {
    // Desabilitar o botão durante a requisição
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    // Fazer a requisição para o backend
    const response = await api.post("/auth/forgot-password", {
      username: username,
    });

    // Mostrar mensagem de sucesso
    showMessage(
      "Se o usuário existir, as instruções foram enviadas por email. Verifique sua caixa de entrada e spam.",
      "success"
    );

    // Limpar o formulário
    event.target.reset();

    // Log para desenvolvimento (remover em produção)
    if (response.data.emailSent !== undefined) {
      console.log("Email enviado:", response.data.emailSent ? "✅" : "❌");
    }
  } catch (error) {
    console.error("Erro ao solicitar recuperação:", error);

    // Verificar se é erro de rede ou servidor
    if (error.code === "ECONNABORTED") {
      showMessage("Tempo limite esgotado. Tente novamente.", "error");
    } else if (error.response) {
      // Erro da API
      const errorMessage =
        error.response.data?.message || "Erro ao processar solicitação.";
      showMessage(errorMessage, "error");
    } else {
      // Erro de rede
      showMessage("Erro de conexão. Verifique sua internet.", "error");
    }
  } finally {
    // Reabilitar o botão
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.textContent = "Recuperar Senha";
  }
};

// Aguardar o DOM carregar
document.addEventListener("DOMContentLoaded", () => {
  console.log("🔄 Página de recuperação de senha carregada");

  // Selecionar o formulário
  const forgotPasswordForm = document.getElementById("forgot-password-form");

  if (forgotPasswordForm) {
    // Adicionar evento de submit
    forgotPasswordForm.addEventListener("submit", forgotPassword);
    console.log("✅ Event listener adicionado ao formulário");
  } else {
    console.error("❌ Formulário de recuperação não encontrado");
  }

  // Focar no campo de username ao carregar a página
  const usernameField = document.querySelector('input[name="username"]');
  if (usernameField) {
    usernameField.focus();
  }
});

// Verificar se o usuário já está logado
const checkIfLoggedIn = () => {
  const token = localStorage.getItem("token");
  if (token) {
    // Se já estiver logado, redirecionar para a página principal
    window.location.href = "index.html";
  }
};

// Executar verificação ao carregar
checkIfLoggedIn();
