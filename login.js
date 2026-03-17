/* eslint-env node */
// Importação de Módulos Core
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser'); // Analisa o corpo das requisições HTTP
var path = require('path');

// Configuração da Conexão MySQL
// Nota: Certifique-se de que o XAMPP/Wamp está rodando e a DB 'formulariologin' existe.
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'formulariologin'
});

var app = express();

// Configuração de Sessão: permite que o servidor "lembre" quem é o usuário.
app.use(session({
    secret: 'secret', // Chave para criptografar o ID da sessão
    resave: true,
    saveUninitialized: true
}));

// Configuração do Body-Parser: transforma os dados do formulário em um objeto JS fácil de ler.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * ROTA GET '/': Serve o arquivo HTML inicial.
 * __dirname garante que o Node encontre o arquivo no caminho absoluto da pasta.
 */
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

/**
 * ROTA POST '/auth': O coração da autenticação.
 */
app.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;

    if (username && password) {
        // Query Segura: O uso de '?' evita que hackers injetem comandos maliciosos no seu banco.
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            if (results.length > 0) {
                // Sucesso: Criamos a "identidade" do usuário na sessão.
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home'); // Redireciona para a área restrita
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
 * ROTA GET '/home': Área Protegida.
 */
app.get('/home', function (request, response) {
    // Verificamos se a flag 'loggedin' existe na sessão deste usuário específico.
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Por favor faça o login para ver esta página!');
    }
    response.end();
});

// Inicialização do Servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});