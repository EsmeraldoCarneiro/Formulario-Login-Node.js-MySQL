# 🔐 Sistema de Autenticação Full Stack (Node.js + MySQL)

Este repositório contém uma aplicação completa de login, demonstrando a integração entre uma interface web, um servidor de backend e persistência de dados em um banco de dados relacional.

## 🚀 Tecnologias Utilizadas

* **Frontend**: HTML5 e CSS3 (Design responsivo e formulários).
* **Backend**: Node.js com Framework Express.
* **Banco de Dados**: MySQL (via XAMPP).
* **Gerenciamento de Sessão**: `express-session` para controle de acesso a rotas restritas.

---

## 🏗️ Arquitetura do Sistema

A aplicação segue o modelo **Cliente-Servidor**:
1.  **O Cliente** (Navegador) solicita a página de login.
2.  **O Servidor** (Node.js) entrega o arquivo `login.html`.
3.  **O Usuário** preenche as credenciais e o formulário faz um `POST` para a rota `/auth`.
4.  **O Servidor** consulta o **MySQL** para verificar se os dados existem.
5.  **Se válido**, o servidor cria uma **Sessão** e redireciona o usuário para `/home`.



---

## 🛠️ Passo a Passo para Configuração

### 1. Preparação do Banco de Dados (XAMPP)
1.  Abra o **XAMPP Control Panel** e inicie os módulos **Apache** e **MySQL**.
2.  Acesse o `http://localhost/phpmyadmin` no seu navegador.
3.  Crie um novo banco de dados chamado `formulariologin`.
4.  Na aba **SQL**, execute o comando abaixo para criar a tabela de usuários:

```sql
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Inserindo um usuário de teste
INSERT INTO `accounts` (`username`, `password`, `email`) 
VALUES ('admin', '1234', 'admin@email.com');
```

### 2. Configuração do Projeto Node.js
1.  No terminal, dentro da pasta do projeto, instale as dependências necessárias:
    ```bash
    npm install express mysql express-session body-parser
    ```
2.  Certifique-se de que o arquivo `login.html` e o script do servidor (ex: `app.js`) estão no mesmo diretório.

### 3. Execução
Inicie o servidor com o comando:
```bash
node app.js
```
Acesse no navegador: `http://localhost:3000`

---

## 📝 Análise Técnica de Código

* **Segurança (SQL Injection)**: O código utiliza queries parametrizadas (`SELECT * FROM accounts WHERE username = ?`), o que impede ataques onde o usuário tenta injetar comandos SQL pelo formulário.
* **Persistência de Sessão**: Através do `express-session`, o servidor consegue identificar o usuário em diferentes requisições, permitindo proteger a rota `/home`.
* **Body-Parser**: Essencial para capturar os dados enviados via `POST` e transformá-los em objetos JavaScript acessíveis via `request.body`.



---

## 📂 Estrutura de Arquivos
* `login.html`: Interface do usuário e estilização CSS.
* `app.js`: Lógica do servidor, conexão com banco de dados e rotas.
* `package.json`: Manifesto do projeto e lista de dependências.

---
**Desenvolvido por:** Esmeraldo Junior 👨‍💻  
*Analista e Desenvolvedor de Sistemas*
