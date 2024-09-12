# Projeto Healthchain
 Healthchain é um projeto desenvolvido para a matéria de Blockchain oferecida pelo professor Dr. Arlindo Flávio da Conceição no primeiro semestre de 2024 na UNIVERSIDADE FEDERAL DE SÃO PAULO (UNIFESP) - INSTITUTO DE CIÊNCIA E TECNOLOGIA (ICT).

 O projeto consiste no desenvolvimento de um contrato inteligente e de seu deploy em uma rede de testes. A rede de testes em questão simula a rede Ethereum.
 
##  BMC (Business Model Canvas)

<p align="center">
  <img src="https://github.com/DanFeMartins/Blockchain-/blob/master/BMC.png" alt="BMC">
</p>


##  Surgimento do Healthchain

 Para muitas pessoas a segurança e o anonimato das suas informações médicas é de extrema importância. Porém, com os sistemas de banco de dados centralizados que existem atualmente, a segurança dessas informações pode ficar comprometida, gerando
 vazamentos destes mesmos dados.

 Então, para previnir que tais dados possam sofrer com esse tipo de problema e para que, quando necessário, esses dados possam ser acessados de maneira rápida e segura, surgiu a ideia do Healthchain.
 Basicamente, a ideia por trás do Healthchain é o armazenamento de dados sensíveis de maneira segura e anônima. Para isto é utilizada uma rede blockchain, mais especificamente a rede Ethereum, por sua capacidade de trabalhar com DAPP's, que nada mais
 são do que Aplicações que conseguem trabalhar em redes descentralizadas. 
  
##  Principal Objetivo do Healthchain

 Além das já mencionadas segurança e anonimidade dos dados, o Healthchain funciona visando o rápido acesso que um socorrista possa vir a ter quando necessário for acessar os dados de uma pessoa acidentada. Dessa maneira um socorrista previamente
 cadastrado por um instituição validadora, poderá acessar as informações do cliente caso o mesmo não esteja apto a passar as mesmas no exato momento. 

##  Tecnologias Utilizadas

- ___Truffle:___ é um conjunto de ferramentas para o desenvolvimento de contratos inteligentes e aplicações descentralizadas (dApps) na blockchain Ethereum.

- ___Ganache:___ é uma ferramenta da Truffle Suite que simula uma blockchain Ethereum localmente em seu computador.

- ___Solidity:___ é uma linguagem de programação desenvolvida para escrever contratos inteligentes na blockchain Ethereum e em outras plataformas compatíveis com a Ethereum Virtual Machine (EVM).

- ___Metamask:___ é uma carteira de criptomoedas e um aplicativo de extensão de navegador que permite aos usuários interagir com a blockchain Ethereum e outras blockchains compatíveis com a Ethereum Virtual Machine (EVM) diretamente de seus navegadores.

- ___JavaScript:___  é uma linguagem de programação amplamente utilizada para criar e gerenciar conteúdo dinâmico em páginas da web. Nesse projeto ela foi utilizada para escrever os testes unitários e o terminal de interação com a rede de testes.

- ___NodeJS:___  é um ambiente de execução JavaScript no lado do servidor, baseado no motor V8 do Google Chrome. Ele permite que você execute código JavaScript fora do navegador, oferecendo uma plataforma poderosa para o desenvolvimento de aplicações de  servidor, APIs, ferramentas de linha de comando e muito mais.

## Configurações
- Truffle v5.11.5 (core: 5.11.5)
- Ganache v7.9.1
- Solidity - 0.8.0 (solc-js)
- Node v16.13.1
- Web3.js v1.10.0

___OBS:___ O Truffle, além de ser um tecnologia que não é mais atualizada, ela tambémm não tem suporte para máquinas Windows, sendo necessário rodar o projeto em Linux ou utilizando o WSL (Windows Subsystem for Linux).

## Instalação e Execução

1. Clone o repositório:

``` bash
    git clone https://github.com/seu-usuario/Blockchain-.git
    cd Blockchain-
    code .
```
2. Compile o código (Essa função vai compilar os contratos inteligentes escritos em Solidity para bytecode, que pode ser executado na Ethereum Virtual Machine).

```bash
    truffle compile
```

3. Realiza o deploy do contrato inteligente na blockchain.

```bash
    truffle migrate
```

4. Executa testes automatizados nos contratos inteligentes.

```bash
    truffle test
```

5. Executa o código em JavaScript para interagir com o contrato via terminal de comando

```bash
    node web3.mjs_holesky
```

## Folders

A disponibilização dos folders no projeto Healthchain segue o modelo de projetos do Truffle. Para iniciar um projeto nesses moldes, utilize o comando:

```bash
    truffle init
```

- contracts: Diretório onde ficam os contratos inteligentes.
- migrations: Diretório usado para gerenciar o processo de implantação (deploy) de contratos inteligentes na blockchain.
- test: Diretório onde ficam contidos os testes a serem realizados nos contratos.
- web3: Diretório que contem os arquivos de extensão .js que realizam a interatividade com o contrato.

## Test Net

A rede de testes online utilizada para os testes do nosso smartcontract foi a Holesky. 
- RPC URL: https://rpc.holesky.ethpandaops.io
- Chain ID: 17000
- Currency Symbol: ETH
- Block Explorer URL: https://dora.holesky.ethpandaops.io/
- OBS: para ganhar fake ether dentro da Holesky é necessário seguir os passos em: https://cloud.google.com/application/web3/faucet/ethereum/holesky

### Licença
Este projeto está licenciado sob a licença MIT.
