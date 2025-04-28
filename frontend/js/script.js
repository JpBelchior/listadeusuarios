const tbody = document.querySelector("tbody");
const createForm = document.querySelector(".add-form");

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

const createrowUser = (user) => {
  const { id, username, password, created_at, gender } = user;

  const tr = createElement("tr");
  const tdUsername = createElement("td", username);
  //const tdpassword = createElement("td", password);
  const tdCreatedAt = createElement("td", formtDate(created_at));

  const tdGender = createElement("td");

  const tdaction = createElement("td");

  const select = createSelect(gender);

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

  tdGender.appendChild(select);

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

const deleteUser = async (id) => {
  console.log("Deletando usuário com id:", id);
  await fetch(`http://localhost:3000/user/  `, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }), // agora mandando o id no body
  });

  loadUser();
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

loadUser(); // Carrega os usuários ao iniciar a página
createForm.addEventListener("submit", addUser);
