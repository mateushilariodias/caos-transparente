const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('src'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/index.html');
});

app.post('/processa_formulario', (req, res) => {
    const formData = req.body;

    // Ler o arquivo JSON atual, atualizar com os novos dados e salvar de volta
    fs.readFile('submissions.json', (err, data) => {
        if (err && err.code === 'ENOENT') {
            // Se o arquivo não existir, inicializa com um array vazio
            return fs.writeFile('submissions.json', JSON.stringify([formData], null, 2), error => {
                if (error) throw error;
                res.send(buildSuccessPage());
            });
        } else if (err) {
            throw err;
        }

        // Se o arquivo existir, adicione a nova submissão
        const json = JSON.parse(data.toString());
        json.push(formData);

        fs.writeFile('submissions.json', JSON.stringify(json, null, 2), error => {
            if (error) throw error;
            res.send(buildSuccessPage());
        });
    });
});

function buildSuccessPage() {
    return `
    <html>
        <head>
            <title>Success</title>
        </head>
        <body>
            <h1>Dados salvos com sucesso!</h1>
            <button onclick="location.href='/'">Voltar à página principal</button>
        </body>
    </html>
    `;
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
