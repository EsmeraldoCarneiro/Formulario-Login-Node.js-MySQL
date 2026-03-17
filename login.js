/* eslint-env node */
// Importação de pacotes necessários para o ecossistema Node.js
var mysql = require('mysql');          // Driver de conexão com o banco MySQL
var express = require('express');      // Framework para gerenciar rotas e requisições HTTP
var session = require('express-session'); // Middleware para controle de sessões de usuário
var bodyParser = require('body-parser'); // Extrator de dados de formulários (corpo da requisição)
var path = require('path');            // Utilitário para manipular caminhos de arquivos

// Configuração da conexão com o banco de dados MySQL (XAMPP padrão)
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',            // No XAMPP, a senha do root por padrão é vazia
    database: 'formulariologin'
});

var app = express();

/**
 * CONFIGURAÇÕES DO EXPRESS (Middlewares)
 */
// Define a estratégia de sessão para manter o usuário logado entre páginas
app.use(session({
    secret: 'secret',        // Chave secreta para assinar o cookie da sessão
    resave: true,            // Força a sessão a ser salva de volta na loja de sessões
    saveUninitialized: true  // Força uma sessão "não inicializada" a ser salva
}));

// Configura o bodyParser para entender dados vindos de formulários HTML (URL Encoded)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Também permite entender dados em formato JSON

/**
 * ROTA GET '/': Página Inicial (Login)
 * Quando o usuário acessa http://localhost:3000, o servidor envia o arquivo HTML.
 */
app.get('/', function (request, response) {
    // path.join garante que o caminho funcione independente do sistema operacional
    response.sendFile(path.join(__dirname + '/login.html'));
});

/**
 * ROTA POST '/auth': Processamento do Login
 * Recebe os dados do formulário e consulta o banco de dados.
 */
app.post('/auth', function (request, response) {
    // Extrai o nome de usuário e senha enviados pelo formulário (via name="...")
    var username = request.body.username;
    var password = request.body.password;

    // Validação básica: verifica se os campos não estão vazios
    if (username && password) {
        // Query SQL: O uso de '?' evita ataques de SQL Injection (segurança de dados)
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            
            // Se o array de resultados tiver tamanho > 0, o usuário existe e a senha confere
            if (results.length > 0) {
                // Autenticação bem-sucedida: criamos as variáveis na sessão do servidor
                request.session.loggedin = true;
                request.session.username = username;
                
                // Redireciona o usuário para a página restrita
                response.redirect('/home');
            } else {
                response.send('Nome de usuário e / ou senha incorretos!');
            }
            response.end();
        });
    } else {
        response.send('Por favor, insira o nome de usuário e a senha!');
        response.end();
    }
});

/**
 * ROTA GET '/home': Área Restrita
 * Verifica se o usuário tem permissão (está logado) para ver o conteúdo.
 */
app.get('/home', function (request, response) {
    // Checa a variável de sessão criada no momento do login (/auth)
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        // Se não houver sessão ativa, bloqueia o acesso
        response.send('Por favor faça o login para ver esta página!');
    }
    response.end();
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor iniciado em http://localhost:3000');
});