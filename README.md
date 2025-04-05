# 📌 Guia de Configuração e Execução do Projeto NestJS + React

Este documento orienta a configuração e execução de um projeto utilizando **NestJS** (backend) e **React** (frontend).

---

## 📂 Estrutura do Projeto

```
nestjs-react-invoice-report/
├── backend/  # Aplicação NestJS
├── frontend/ # Aplicação React
└── README.md # Este documento
```

---

## 🛠️ 1. Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:
- **Node.js** (versão 18+ recomendada) → [Download Node.js](https://nodejs.org/)
- **npm** ou **yarn** (instalado junto com o Node.js)
- **PostgreSQL** 

Verifique as versões instaladas:
```bash
node -v
npm -v
docker -v
```

### 🐘 Instalar PostgreSQL com Docker (opcional)
Se preferir não instalar o PostgreSQL manualmente, você pode rodá-lo via Docker com o seguinte comando:

```bash
docker run --name postgresql \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=nestjs_db \
  -d postgres:17.4
```

✅ Isso criará um container chamado `postgresql` com:
- Usuário: `postgres`
- Senha: `postgres`
- Banco: `nestjs_db`

> ℹ️ Verifique se a porta `5432` está disponível no seu sistema. Caso já esteja em uso, altere a primeira `5432` do comando para outra porta disponível.

---

## ⚙️ 2. Configurar e Executar o Backend (NestJS)

### 🔹 2.1 Clonar o projeto
```bash
git clone https://github.com/fredportela/nestjs-react-invoice-report
cd nestjs-react-invoice-report/backend
```

### 🔹 2.2 Instalar dependências
```bash
npm install
```

### 🔹 2.3 Configurar variáveis de ambiente
Crie um arquivo `.env` dentro da pasta `backend/` e adicione:
```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/meu_banco
```
📌 **Substitua** `usuario`, `senha` e `meu_banco` pelos dados reais do seu banco de dados.

### 🔹 2.5 Iniciar o servidor
```bash
npm run start
```
✅ Agora o backend estará rodando em `http://localhost:8080/api`.

---

## 🎨 3. Configurar e Executar o Frontend (React)

### 🔹 3.1 Acessar a pasta do frontend
```bash
cd ../frontend
```

### 🔹 3.2 Instalar dependências
```bash
npm install
```

### 🔹 3.3 Configurar variáveis de ambiente
Crie um arquivo `.env` dentro da pasta `frontend/` e adicione:
```
REACT_APP_API_URL=http://localhost:8080/api
```

### 🔹 3.4 Iniciar o frontend
```bash
npm start
```
✅ O frontend estará rodando em `http://localhost:3000`.

---

## 🏗️ 4. Build e Execução em Produção

Agora, vamos construir e executar o projeto de forma integrada no backend.

### 🔹 4.1 Verificar configuração do banco de dados no ambiente de produção
Antes de prosseguir, certifique-se de que o arquivo **backend/.env.production** contém a configuração correta do banco de dados:
```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/meu_banco
```

### 🔹 4.2 Gerar o build do frontend e backend
Na raiz do repositório `nestjs-react-invoice-report/`, execute:
```bash
npm run build:client
npm run build:server
```
Isso irá gerar o build do React e movê-lo para o backend.

### 🔹 4.3 Iniciar o servidor backend servindo o frontend
```bash
npm run start
```
✅ Se tudo estiver correto, a aplicação estará disponível em `http://localhost:8080` junto com a API.

---

## 🚀 Testando a Conexão

Agora, abra o navegador e acesse:
- **API**: `http://localhost:8080/api`
- **Aplicação React**: `http://localhost:3000`

Verifique se a API responde e se o frontend está consumindo os dados corretamente.

---

## 📌 Conclusão
Parabéns! Agora você tem o backend em NestJS e o frontend em React rodando juntos. 🚀🎉

Caso tenha dúvidas, entre em contato ou consulte a documentação oficial:
- [NestJS Docs](https://docs.nestjs.com/)
- [React Docs](https://reactjs.org/)

