CREATE DATABASE atividade_bancoback;

\c atividade_bancoback;

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    idade INTEGER NOT NULL,
    signo VARCHAR(20) NOT NULL,
    datanascimento DATE NOT NULL,
    sexo VARCHAR(10) NOT NULL
);

INSERT INTO (nome, sobrenome, email, idade, signo, datanascimento, sexo) VALUES ('Ana', 'Pontes','ana@gmail.com', 17, 'câncer', '30/06/2006', 'feminino');