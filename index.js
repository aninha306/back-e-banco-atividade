const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = 4000;

app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'atividade_bancoback',
    password: 'ds564',
    port: 7007,
});

function Idade(dataNascimento) {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = dataNascimento.getMonth();
    if (mesNascimento > mesAtual || (mesNascimento === mesAtual && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }
    return idade;
}

function Signo(mes, dia) {
    if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) {
        return 'aquário';
    } else if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) {
        return 'peixes';
    } else if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) {
        return 'áries';
    } else if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) {
        return 'touro';
    } else if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) {
        return 'gêmeos';
    } else if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) {
        return 'câncer';
    } else if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) {
        return 'leão';
    } else if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) {
        return 'virgem';
    } else if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) {
        return 'libra';
    } else if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) {
        return 'escorpião';
    } else if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) {
        return 'sagitário';
    } else {
        return 'capricórnio';
    }
}

app.post('/usuarios', async (req, res) => {
    try {
        const { nome, email, datanascimento, sexo } = req.body;

        const dataNascimento = new Date(datanascimento);
        const idade = Idade(dataNascimento);
        const signo = Signo(dataNascimento.getMonth() + 1, dataNascimento.getDate());

        await pool.query('INSERT INTO usuarios (nome, email, idade, signo, datanascimento, sexo) VALUES ($1, $2, $3, $4, $5, $6)', [nome, email, idade, signo, datanascimento, sexo]);
        res.status(201).send({ mensagem: 'O usuário foi adicionado com sucesso' });
    } catch (error) {
        console.error('Erro ao adicionar usuário:', error);
        res.status(500).send('Erro ao adicionar usuário');
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios;');
        res.json({
            total: resultado.rowCount,
            usuarios: resultado.rows,
        });
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        res.status(500).send('Erro ao obter usuários');
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, datanascimento, sexo } = req.body;
        const dataNascimento = new Date(datanascimento);
        const idade = Idade(dataNascimento);
        const signo = Signo(dataNascimento.getMonth() + 1, dataNascimento.getDate());
        await pool.query('UPDATE usuarios SET nome = $1, email = $2, idade = $3, signo = $4, datanascimento = $5, sexo = $6 WHERE id = $7', [nome, email, idade, signo, datanascimento, sexo, id]);
        res.status(200).send({ mensagem: 'O usuário foi atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).send('Erro ao atualizar usuário');
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.status(200).send({ mensagem: 'O usuário foi excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).send('Erro ao excluir usuário');
    }
});

app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        if (resultado.rowCount === 0) {
            res.status(404).send({ mensagem: 'Usuário não encontrado' });
        } else {
            res.json(resultado.rows[0]);
        }
    } catch (error) {
        console.error('Erro ao obter usuário por ID:', error);
        res.status(500).send('Erro ao obter usuário por ID');
    }
});

app.get('/', async (req, res) => {
    res.status(200).send({ mensagem: 'Servidor funcionando perfeitamente' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} `);
});