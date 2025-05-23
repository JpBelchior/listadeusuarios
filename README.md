# Sistema de Gerenciamento de Usuários

Um sistema completo de gerenciamento de usuários com autenticação, CRUD e recuperação de senha.

## 📋 Funcionalidades

- ✅ **Cadastro de usuários** com validação
- ✅ **Login e autenticação** com JWT
- ✅ **CRUD completo** (criar, listar, editar, deletar usuários)
- ✅ **Recuperação de senha** via email
- ✅ **Interface responsiva** e moderna
- ✅ **Validações de segurança**

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** com TypeScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **Nodemailer** - Envio de emails
- **CORS** - Configuração de CORS

### Frontend

- **HTML5** semântico
- **CSS3** com variáveis customizadas
- **JavaScript** vanilla
- **Axios** - Cliente HTTP

## 📁 Estrutura do Projeto

```
projeto/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   └── envconfig.ts
│   │   ├── controllers/
│   │   │   ├── authControllers.ts
│   │   │   └── userControllers.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── userMiddleware.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── userModel.ts
│   │   ├── routes/
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   └── setupRoutes.ts
│   │   ├── service/
│   │   │   └── emailService.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nodemon.json
├── frontend/
│   ├── src/
│   │   ├── css/
│   │   │   └── style.css
│   │   ├── js/
│   │   │   ├── script.js
│   │   │   ├── login.js
│   │   │   ├── forgot-password.js
│   │   │   └── reset-password.js
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── forgot-password.html
│   │   └── reset-password.html
│   └── package.json
└── Dockerfile
```

## ⚙️ Configuração e Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/JpBelchior/listadeusuarios-Usando-JS_CSS
cd projeto
```

### 2. Configuração do Backend

#### Instalar dependências:

```bash
cd backend
npm install
```

#### Configurar variáveis de ambiente:

Crie um arquivo `.env` na raiz do backend:

```env
# Servidor
HTTP_PORT=3000

# Banco de dados MySQL
MYSQL_HOST=localhost
MYSQL_USER=seu_usuario
MYSQL_PASSWORD=sua_senha
MYSQL_DATABASE=nome_do_banco

# JWT
JWT_SECRET=seu_jwt_secret_muito_seguro

# Email (para recuperação de senha)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
EMAIL_FROM=seu_email@gmail.com
```

#### Configurar banco de dados:

```sql
CREATE DATABASE nome_do_banco;
USE nome_do_banco;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    gender ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Configuração do Frontend

#### Instalar dependências:

```bash
cd frontend
npm install
```

## 🚀 Como Executar

### Opção 1: Executar com Docker

```bash
# Na raiz do projeto
docker build -t meu-projeto .
docker run -p 3000:3000 meu-projeto
```

### Opção 2: Executar manualmente

#### Backend:

```bash
cd backend
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

#### Frontend:

Abra o arquivo `frontend/src/index.html` em um servidor local ou navegador.

## 📡 API Endpoints

### Autenticação

- `POST /auth/login` - Login do usuário
- `GET /auth/me` - Obter usuário autenticado
- `POST /auth/forgot-password` - Solicitar recuperação de senha
- `POST /auth/reset-password` - Redefinir senha

### Usuários

- `GET /user` - Listar todos os usuários
- `POST /user` - Criar novo usuário
- `PUT /user/:id` - Atualizar usuário
- `DELETE /user` - Deletar usuário

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** para autenticação.

### Como funciona:

1. Usuário faz login com username/password
2. API retorna um token JWT
3. Frontend armazena o token no localStorage
4. Token é enviado no header `x-auth-token` nas requisições protegidas

## 📧 Recuperação de Senha

### Fluxo:

1. Usuário acessa "Esqueceu sua senha?"
2. Informa o username
3. Sistema envia email com link de recuperação
4. Link redireciona para página de redefinição
5. Usuário define nova senha

## 🎨 Interface

- **Design moderno** com tema escuro
- **Responsivo** para diferentes dispositivos
- **Animações suaves** para melhor UX
- **Validações em tempo real**
- **Mensagens de feedback** claras

## 🛡️ Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Validação de dados no backend
- ✅ Proteção contra SQL injection
- ✅ Tokens JWT com expiração
- ✅ Validação de email único
- ✅ Middleware de autenticação

## 🧪 Scripts Disponíveis

### Backend:

- `npm run dev` - Executa em modo desenvolvimento
- `npm start` - Executa em produção

## 📝 Notas Importantes

1. **Email**: Configure corretamente as credenciais de email para que a recuperação de senha funcione
2. **JWT_SECRET**: Use uma chave forte em produção
3. **CORS**: Ajuste as configurações conforme necessário
4. **Banco de dados**: Certifique-se que o MySQL está rodando

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

- **Desenvolvedor**: [Seu Nome]
- **Email**: [seu-email@exemplo.com]
- **GitHub**: [seu-github]

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
