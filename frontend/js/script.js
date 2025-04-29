const tbody = document.querySelector("tbody");
const createForm = document.querySelector(".add-form");

let currentEditId = null; // Variável para armazenar o ID do usuário em edição

const fetchUser = async () => {
  const response = await fetch("http://localhost:3000/user");
  const users = await response.json();
  console.log(users);
  return users;
};

const formtDate = (dateUTC) => {
  const options = {
    dateStyle: "long",
    timeStyle: "short",
  };
  const date = new Date(dateUTC).toLocaleString("pt-br", options);
  return date;
};

const createElement = (tag, innerText = "", innerHTML = "") => {
  const element = document.createElement(tag);
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  if (innerText) {
    element.innerText = innerText;
  }

  return element;
};

const createSelect = (value) => {
  const option1 = ` <option value="Masculino">Masculino</option>
    <option value="Feminino">Feminino</option> 
    <option value="Outro">Outro</option>`;

  const select = createElement("select", "", option1);
  select.value = value;
  return select;
};

const openEditModal = (user) => {
  // Abre a modal de edição
  const modal = document.getElementById("editModal");
  const editUsername = document.getElementById("editUsername");
  const editGender = document.getElementById("editGender");

  currentEditId = user.id;

  // Preenche o formulário com os valores atuais
  editUsername.value = user.username;
  editGender.value = user.gender;

  // Exibe a modal
  modal.style.display = "block";
};

const createrowUser = (user) => {
  const { id, username, created_at, gender } = user;

  const tr = createElement("tr");
  const tdUsername = createElement("td", username);
  //const tdpassword = createElement("td", password);
  const tdCreatedAt = createElement("td", formtDate(created_at));

  const tdGender = createElement("td", gender);

  const tdaction = createElement("td");

  const editButton = createElement("button", "Edit");
  const deleteButton = createElement("button", "Delete");

  editButton.classList.add("btn-action");
  deleteButton.classList.add("btn-action");

  deleteButton.addEventListener("click", () => {
    const confirmed = confirm("Tem certeza que deseja deletar este usuário?");

    if (confirmed) {
      deleteUser(id);
    }
  });

  editButton.addEventListener("click", () => {
    // evento esperando o click para acionar o openEditModal
    openEditModal({
      id,
      username,
      gender,
    });
  });

  tdaction.appendChild(editButton);
  tdaction.appendChild(deleteButton);

  tr.appendChild(tdUsername);
  //tr.appendChild(tdpassword);
  tr.appendChild(tdCreatedAt);
  tr.appendChild(tdGender);
  tr.appendChild(tdaction);

  console.log("Data de criação:", created_at);
  console.log("genero", gender);
  return tr;
};

const updateUser = async ({ id, username, gender }) => {
  try {
    await fetch(`http://localhost:3000/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, username, gender }),
    });
    loadUser();
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
  }
};

const deleteUser = async (id) => {
  try {
    console.log("Deletando usuário com id:", id);
    await fetch(`http://localhost:3000/user/  `, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }), // agora mandando o id no body
    });
    loadUser();
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
  }
};

const loadUser = async () => {
  const users = await fetchUser();
  tbody.innerHTML = ""; // Limpa o tbody antes de adicionar os novos usuários
  users.forEach((user) => {
    const row = createrowUser(user);
    tbody.appendChild(row);
  });
};

const addUser = async (event) => {
  event.preventDefault();

  const user = {
    username: event.target.username.value,
    password: event.target.password.value,
    gender: event.target.gender.value,
  };

  try {
    const response = await fetch("http://localhost:3000/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Erro ao cadastrar usuário");
    }

    console.log("Usuário cadastrado com sucesso!");
    event.target.reset(); // limpa os campos do formulário
    loadUser(); // Atualiza a lista de usuários após o cadastro
  } catch (error) {
    console.error("Erro:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Aguarda o carregamento do HTML
  const modal = document.getElementById("editModal"); // Seleciona o elemento com o ID "editModal" (a div da modal)
  const editForm = document.getElementById("editForm");
  const closeBtn = document.querySelector(".close"); //querySelector retorna o primeiro elemento dentro do documento que corresponde ao seletor especificado
  const cancelBtn = document.querySelector(".btn-cancel");

  // Evento para fechar a modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Fechar modal ao clicar fora dela
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Envio do formulário de edição
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log("Formulário enviado!");
    const username = document.getElementById("editUsername").value;
    const gender = document.getElementById("editGender").value;

    console.log("Dados para atualização:", {
      id: currentEditId,
      username,
      gender,
    });
    if (currentEditId) {
      updateUser({
        id: currentEditId,
        username: username,
        gender: gender,
      });

      modal.style.display = "none";
    }
  });
});

loadUser(); // Carrega os usuários ao iniciar a página
createForm.addEventListener("submit", addUser);
