// frontend/js/reset-password.js
const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Função para mostrar mensagens
const showMessage = (message, type = "error") => {
  const messageBox = document.querySelector(".message-box");

  messageBox.classList.remove("error", "success");
  messageBox.textContent = message;
  messageBox.classList.add(type);
  messageBox.classList.add("visible");
  messageBox.style.animation = "fadeIn 0.3s ease";

  setTimeout(() => {
    messageBox.classList.remove("visible");
    messageBox.textContent = "";
  }, 5000);
};

// Função para pegar o token da URL
const getTokenFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("token");
};

// Função para redefinir senha
const resetPassword = async (event) => {
  event.preventDefault();

  const password = event.target.password.value;
  const confirmPassword = event.target.confirmPassword.value;
  const token = getTokenFromUrl();

  // Verificar se as senhas coincidem
  if (password !== confirmPassword) {
    showMessage("As senhas não coincidem!", "error");
    return;
  }

  // Verificar se tem token
  if (!token) {
    showMessage(
      "Token inválido. Solicite uma nova recuperação de senha.",
      "error"
    );
    return;
  }

  try {
    const response = await api.post("/auth/reset-password", {
      token: token,
      password: password,
    });

    showMessage("Senha redefinida com sucesso! Redirecionando...", "success");

    // Redirecionar para login após 2 segundos
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    const errorMessage =
      error.response?.data?.message ||
      "Erro ao redefinir senha. Tente novamente.";
    showMessage(errorMessage, "error");
  }
};

// Verificar token quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  const token = getTokenFromUrl();

  if (!token) {
    showMessage(
      "Token não encontrado. Solicite uma nova recuperação de senha.",
      "error"
    );
    return;
  }

  // Adicionar evento ao formulário
  const form = document.getElementById("reset-password-form");
  form.addEventListener("submit", resetPassword);
});
