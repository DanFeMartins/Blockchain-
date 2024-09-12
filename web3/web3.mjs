import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import readlineSync from 'readline-sync';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Configuração para obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuração da conexão com o nó Ethereum
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

// Endereço do contrato implantado (substitua pelo seu endereço real)
const contractAddress = '0xB30132Fb94505b9a71dA5aCBFbA9AD636D83d5ad';

// Leitura do ABI do contrato
const contractABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../build/contracts/Healthchain.json'), 'utf8')).abi;

// Criação da instância do contrato
const contract = new web3.eth.Contract(contractABI, contractAddress);

let Adress_atual = '';

async function main() {
    const accounts = await web3.eth.getAccounts();

    // Função para escolher uma conta
    function escolherConta(string, accounts) {
        console.log("")
        console.log('Contas disponíveis:');
        accounts.forEach((account, index) => {
            console.log(`${index + 1}: ${account}`);
        });
        console.log("")
        const choice = readlineSync.questionInt(string);
        return accounts[choice - 1];
    }
    // Função para cadastrar uma nova instituição de saúde
    async function cadastrarInstituicao() {
        try {
            // const instituicaoAddress = escolherConta("escolha o endereço do hospital: ",accounts);
            const nomeInstituicao = readlineSync.question('Digite o nome da instituição: ');

            const inicio = performance.now();
            
            await contract.methods.cadastrarInstituicao(Adress_atual, nomeInstituicao)
                .send({ from: Adress_atual });
            const fim = performance.now();
            const tempoDecorrido = fim - inicio;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} ms`);
            console.log("")


            console.log(`Instituição ${nomeInstituicao} cadastrada com sucesso!`);
            console.log("")


        } catch (error) {
            console.error('Erro ao cadastrar instituição:', error);
        }
    }

    async function getInstituicao() {
        try {
            console.log("")
            const instituicaoAddress = escolherConta('Escolha o endereço da instituição:', accounts);

            console.log("AAAAAAAAA")

            
            // const inicio = performance.now();
            const instituicao = await contract.methods.getInstituicao(instituicaoAddress).call();

            // const fim = performance.now();
            // const tempoDecorrido = fim - inicio;
            // console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} ms`);
            // console.log("")

            
            // console.log(`Endereço da Instituição: ${instituicao[0]}`);
            // console.log(`Saldo: ${web3.utils.fromWei(instituicao[1], 'ether')} ETH`);
            // console.log(`Nome da Instituição: ${instituicao[1]}`);
            
        } catch (error) {
            console.error('Erro ao consultar instituição:', error);
            console.error('Detalhes do erro:', error);  // Exibe detalhes adicionais do erro
        }
    }



    async function cadastrarCliente() {
        try {
            console.log("")
            const clienteAddress = escolherConta('Escolha o endereço do cliente:', accounts);
            console.log("")   
    
            // Faz a chamada para a função `cadastrarCliente` no contrato
            const inicio = performance.now();
            
            await contract.methods.cadastrarCliente(clienteAddress, "----------", "-----------", "----------", "----------")
                .send({
                    from: Adress_atual,
                    value: web3.utils.toWei('0.0001', 'ether'),  // Enviar 0.0001 ether
                    gas: 3000000  // Ajustar o valor de gas se necessário
                });
            const fim = performance.now();
            const tempoDecorrido = fim - inicio;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} ms`);
            console.log("")
    
            console.log(`Cliente ${clienteAddress} cadastrado com sucesso!`);
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error.message);
        }
    }
    
    
    
    async function getCliente() {
        try {
            const clienteAddress = escolherConta("Escolha o endereço do cliente: ", accounts);
            console.log("")
            
            const inicio = performance.now();
            // Chama a função Solidity
            const cliente = await contract.methods.getCliente(clienteAddress).call({ from: Adress_atual });
            const fim = performance.now();
            const tempoDecorrido = fim - inicio;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} ms`);
            console.log("")
    
            // Os valores retornados pelo Solidity são acessados pelo índice no array
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
    
            // const Adress_atual = escolherConta('Escolha o endereço do cliente:', accounts);
            
            const inicio = performance.now();
            await contract.methods.editarCliente(comorbidade, alergia, tipoSanguineo, restricao)
                .send({ from: Adress_atual });
            const fim = performance.now();
            const tempoDecorrido = fim - inicio;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} ms`);
            console.log("")
    
            console.log('Cliente editado com sucesso!');
        } catch (error) {
            console.error('Erro ao editar cliente:', error.message);
            console.error('Detalhes do erro:', error);
        }
    }
    
    
    async function excluirCliente() {
        try {
            console.log("")
            const clienteAddress = escolherConta('escolha o endereço do cliente: ',accounts);
            console.log("")
        const inicio = performance.now();
        await contract.methods.excluirCliente(clienteAddress)
            .send({ from: Adress_atual });
        const fim = performance.now();
        const tempoDecorrido = fim - inicio;
        console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} ms`);
        console.log("")
        console.log('Cliente excluido com sucesso!');
        console.log("")
        } catch (error) { console.log(error) }
    }

    async function excluirSocorrista() {
        try {
            console.log("")
            const socorristaAddress = escolherConta('escolha o endereço do socorrista: ',accounts);
            console.log("")
            const inicio = performance.now();
            await contract.methods.excluirSocorrista(socorristaAddress)
            .send({ from: Adress_atual });
            const fim = performance.now();
            const tempoDecorrido = fim - inicio;
            console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} ms`);
            console.log('Socorrista excluido com sucesso!');
        }
        catch(error){
            console.error('erro exclui socorrista: ',error)
        }
    }


  
    async function cadastrarSocorrista() {
        try {
            // Escolha a conta da instituição
            console.log("")
            
            const socorristaAddress = escolherConta('escolha o endereço do socorrista: ' ,accounts);
            console.log("")
            
            const crm = readlineSync.question('Digite o CRM do socorrista: ');
            console.log("")
    
            // console.log('Endereço do socorrista:', socorristaAddress);
            console.log('CRM do socorrista:', crm);
    
            await contract.methods.cadastrarSocorrista(socorristaAddress, crm)
                .send({ from: Adress_atual , gas: 3000000 }); // A instituição deve ser a que envia a transação
    
            console.log(`Socorrista ${crm} cadastrado com sucesso!`);
        } catch (error) {
            console.error('Erro ao cadastrar socorrista:', error);
        }
    }

    async function getSocorrista(){
        try{  
        console.log("")

        const socorristaAdress = escolherConta('esolha a conta do socorrista:', accounts);
        console.log("")

        const inicio = performance.now();
        const socorrista = await contract.methods.getSocorrista(socorristaAdress)
            .call({from: Adress_atual, gas: 3000000});
        const fim = performance.now();
        const tempoDecorrido = fim - inicio;
        console.log(`Tempo de execução: ${tempoDecorrido.toFixed(2)} ms`);
        console.log("")
        console.log("informações do socorrista:")
        console.log("Crm do soccorista",socorrista[1]);
        }catch(error){
            console.error('erro getsocorrista: ',error)
        }
    }

    async function trocarConta() {
        console.log("")
        Adress_atual = escolherConta('Escolha a conta: ', accounts);
        console.log("")
        console.log(`Conta atual: ${Adress_atual}`);
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
                11) Sair`);

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


