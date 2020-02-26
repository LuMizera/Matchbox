# Match Box Teste

## Requisitos

- Node.JS (Feito e testado na versão 12.13.1)
- Docker
- Insomnia

## Instalação e inicio

Ao iniciar o projeto será necessário instalar os pacotes node atravéz do comando `npm i` e subir uma imagem mongo com o docker atravéz do comando `docker run -p 27017:27017 --name mongodb -d mongo`

Depois disso basta executar `npm start` e a aplicação irá iniciar e estará pronta para ser usada.

## Importante

- A conexão mongo e a porta que a aplicação está atendendo se encontram dentro do arquivo `.env`, caso deseje alterar alguma configuração sera necessário alterar somente o arquivo.
- Existe um arquivo chamado insomnia.json, que contem todas as rotas e métodos da aplicação, basta exportar para o próprio insomnia e usar.
- Para rotas que são listas como `[GET] candidate` e `[GET] job` utilizei a biblioteca `api-query-params` que suporta query string, link [aqui](https://www.npmjs.com/package/api-query-params#supported-features) para como ela funciona caso queira usar filtros em minhas rotas.
- Todos os deletes são somente lógicos, um candidato ou vaga quando deleteada irá virar uma flag chamada `isDeleted` para `true` dentro do MongoDb, mas mesmo ainda estando no banco nenhuma query ira buscar este objeto, somente se a flag for convertida para `false` novamente.
- Quando um candidato for deletado e estiver associado a alguma vaga, ele sera removido desta vaga.
- Existem descrições para cada rota com o JSON necessário para o envio dentro do Insomnia
- O token sempre sera "Bearer ...token"
