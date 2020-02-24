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
