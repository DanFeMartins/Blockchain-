import Web3 from 'web3';
import fs, { read } from 'fs';
import path from 'path';
import readlineSync from 'readline-sync';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Console } from 'console';

// Configuração para obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

// Configuração da conexão com o nó Ethereum
const web3 = new Web3(Web3.givenProvider || 'https://eth-holesky.g.alchemy.com/v2/wkboEYORoNasSxYtby8hSihEei6XRkun');

// Endereço do contrato implantado (substitua pelo seu endereço real)
if (args.length === 0) {
    console.error('Endereço do contrato não fornecido.');
    process.exit(1);
}
const contractAddress = args[0];

// Leitura do ABI do contrato
const contractABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'build/contracts/Healthchain.json'), 'utf8')).abi;

// Criação da instância do contrato
const contract = new web3.eth.Contract(contractABI, contractAddress);

let Adress_atual = '';
let userPrivateKey = '';
let loggedIn = false;

async function sendTransaction(method, options = {}) {
    const tx = {
        from: Adress_atual,
        to: contractAddress,
        data: method.encodeABI(),
        gas: await method.estimateGas({ from: Adress_atual, ...options }),
        gasPrice: await web3.eth.getGasPrice()
    };

    const signedTX = await web3.eth.accounts.signTransaction(tx, userPrivateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTX.rawTransaction);

    return receipt;
}

async function trocarConta() {
    console.log("HealthChain");
    console.log("1) Fazer LogIn");
    console.log("2) Sair");
    const choice = readlineSync.questionInt("\nEscolha uma opção: ");
    switch (choice) {
        case 1:
            Adress_atual = readlineSync.question("Endereço da carteira: ");
            userPrivateKey = readlineSync.question("Chave privada: ");
            loggedIn = true;  // Define que o usuário está logado
            console.log(`Logado com sucesso na conta: ${Adress_atual}`);
            break;
        case 2:
            console.log("Saindo...");
            process.exit(0);  // Encerra o programa
            break;
        default:
            console.log("Opção Inválida");
            break;
    }
}

async function main() {
    if (!loggedIn) {
        await trocarConta();
    }

    const accounts = await web3.eth.getAccounts();

    // Função para escolher uma conta
    function escolherConta(promptText, accounts) {
        console.log('Contas disponíveis:');
        accounts.forEach((account, index) => {
            console.log(`${index + 1}: ${account}`);
        });
        const choice = readlineSync.questionInt(promptText);
        return accounts[choice - 1];
    }

    // Função para cadastrar uma nova instituição de saúde
    async function cadastrarInstituicao() {
        try {
            const nomeInstituicao = readlineSync.question('Digite o nome da instituição: ');
            const inicio = performance.now();

            const method = contract.methods.cadastrarInstituicao(Adress_atual, nomeInstituicao);
            const receipt = await sendTransaction(method);

            const fim = performance.now();
            const tempoDecorrido = (fim - inicio)/1000;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} s`);

            console.log(`Instituição ${nomeInstituicao} cadastrada com sucesso!`);
        } catch (error) {
            console.error('Erro ao cadastrar instituição:', error);
        }
    }

    async function getInstituicao() {
        try {
            const instituicaoAddress = readlineSync.question('Escreva o endereço da instituição: ');

            const inicio = performance.now();
            const instituicao = await contract.methods.getInstituicao(instituicaoAddress).call();
            const fim = performance.now();
            const tempoDecorrido = (fim - inicio)/1000;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} s`);

            console.log(`Endereço da Instituição: ${instituicao[0]}`);
            console.log(`Nome da Instituição: ${instituicao[1]}`);
        } catch (error) {
            console.error('Erro ao consultar instituição:', error);
        }
    }

    async function cadastrarCliente() {
        try {
            const clienteAddress = readlineSync.question('Digite o endereço do cliente: ');

            const inicio = performance.now();

            const method = contract.methods.cadastrarCliente( clienteAddress,'-------', '-------', '-------', '-------');
            const receipt = await sendTransaction(method);

            const fim = performance.now();
            const tempoDecorrido = (fim - inicio)/1000;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} s`);

            console.log(`Cliente ${clienteAddress} cadastrado com sucesso!`);
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error.message);
        }
    }

    async function getCliente() {
        try {
            const clienteAddress = readlineSync.question('Escreva o endereço do cliente: ');
    
            const inicio = performance.now();
            const cliente = await contract.methods.getCliente(clienteAddress).call({ from: Adress_atual });
            const fim = performance.now();
            const tempoDecorrido = (fim - inicio) / 1000; // Converte para segundos
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} s`);
            console.log("")
            console.log('Dados do Cliente:');
            console.log(`Comorbidades: ${cliente[0]}`);
            console.log(`Alergias: ${cliente[1]}`);
            console.log(`Tipo Sanguíneo: ${cliente[2]}`);
            console.log(`Restrição: ${cliente[3]}`);
        } catch (error) {
            console.error('Erro ao consultar cliente:', error);
        }
    }
    

    async function editarCliente() {
        try {
            const comorbidade = readlineSync.question('Digite a comorbidade: ');
            const alergia = readlineSync.question('Digite a alergia: ');
            const tipoSanguineo = readlineSync.question('Digite o tipo sanguíneo: ');
            const restricao = readlineSync.question('Digite a restricao: ');

            const inicio = performance.now();

            const method = contract.methods.editarCliente(comorbidade, alergia, tipoSanguineo, restricao);
            const receipt = await sendTransaction(method);

            const fim = performance.now();
            const tempoDecorrido = (fim - inicio)/1000;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} s`);

            console.log('Cliente editado com sucesso!');
        } catch (error) {
            console.error('Erro ao editar cliente:', error.message);
        }
    }

    async function excluirCliente() {
        try {
            const clienteAddress = readlineSync.question('Digite o endereço do cliente: ');

            const inicio = performance.now();

            const method = contract.methods.excluirCliente(clienteAddress);
            const receipt = await sendTransaction(method);

            const fim = performance.now();
            const tempoDecorrido = (fim - inicio)/1000;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} s`);

            console.log('Cliente excluído com sucesso!');
        } catch (error) {
            console.log(error);
        }
    }

    async function excluirSocorrista() {
        try {
            const socorristaAddress = readlineSync.question('Digite o endereço do socorrista: ');

            const inicio = performance.now();

            const method = contract.methods.excluirSocorrista(socorristaAddress);
            const receipt = await sendTransaction(method);

            const fim = performance.now();
            const tempoDecorrido = (fim - inicio)/1000;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} s`);

            console.log('Socorrista excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir socorrista:', error);
        }
    }

    async function cadastrarSocorrista() {
        try {
            const socorristaAddress = readlineSync.question('Digite o endereço do socorrista: ');
            const crm = readlineSync.question('Digite o CRM do socorrista: ');

            const inicio = performance.now();

            const method = contract.methods.cadastrarSocorrista(socorristaAddress, crm);
            const receipt = await sendTransaction(method);

            const fim = performance.now();
            const tempoDecorrido = (fim - inicio)/1000;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} s`);

            console.log(`Socorrista cadastrado com sucesso!`);
        } catch (error) {
            console.error('Erro ao cadastrar socorrista:', error);
        }
    }

    async function getSocorrista() {
        try {
            const socorristaAddress = readlineSync.question('Digite o endereço do socorrista: ');

            const inicio = performance.now();
            const socorrista = await contract.methods.getSocorrista(socorristaAddress).call({ from: Adress_atual });
            const fim = performance.now();
            const tempoDecorrido = (fim - inicio)/1000;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} s`);

            console.log(`CRM do Socorrista: ${socorrista[1]}`);
        } catch (error) {
            console.error('Erro ao consultar socorrista:', error);
        }
    }

    // Função interativa
    async function interactive() {
        while (true) {
            console.log(`
                1) Cadastrar instituição
                2) Consultar instituição
                3) Cadastrar cliente
                4) Consultar cliente
                5) Editar cliente
                6) Excluir cliente
                7) Cadastrar socorrista
                8) Consultar socorrista
                9) Excluir socorrista
                10) Trocar conta
                11) Sair
                `);

            const choice = readlineSync.questionInt('Escolha uma opção: ');

            switch (choice) {
                case 1:
                    await cadastrarInstituicao();
                    break;
                case 2:
                    await getInstituicao();
                    break;
                case 3:
                    await cadastrarCliente();
                    break;
                case 4:
                    await getCliente();
                    break;
                case 5:
                    await editarCliente();
                    break;
                case 6:
                    await excluirCliente();
                    break;
                case 7:
                    await cadastrarSocorrista();
                    break;
                case 8:
                    await getSocorrista();
                    break;
                case 9:
                    await excluirSocorrista();
                    break;
                case 10:
                    await trocarConta();
                    break;
                case 11:
                    return;
                default:
                    console.log('Escolha inválida.');
            }
        }
    }

    // Inicia o menu interativo
    await interactive();
}

// Executa o código principal
main().catch((error) => {
    console.error('Erro na execução do código principal:', error);
});
