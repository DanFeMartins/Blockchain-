const Healthchain = artifacts.require("Healthchain");

contract("Healthchain", accounts => {
    let healthchain;

    const instituicaoAddress = accounts[0];
    const clienteAddress = accounts[1];
    const socorristaAddress = accounts[2];

    beforeEach(async () => {
        // Implanta um novo contrato antes de cada teste
        healthchain = await Healthchain.new();

        // Cadastra uma instituição e um cliente
        await healthchain.cadastrarInstituicao(instituicaoAddress, "Instituicao Teste", { from: instituicaoAddress });
        await healthchain.cadastrarCliente("Asma", "Amendoim", "O+", instituicaoAddress, { from: clienteAddress, value: web3.utils.toWei('1', 'ether') });
    });

    it("deveria retornar as informações da instituição no formato correto", async () => {
        // Chama a função getInstituicao
        const instituicao = await healthchain.getInstituicao(instituicaoAddress);

        // Verifica se o formato dos dados está correto
        assert.equal(instituicao[0], instituicaoAddress, "O endereço da instituição retornado não corresponde");
        assert.equal(instituicao[2], "Instituicao Teste", "O nome da instituição retornado não corresponde");

        // Verifica o saldo da instituição
        const saldo = parseFloat(web3.utils.fromWei(instituicao[1], 'ether'));
        assert.isNumber(saldo, "O saldo retornado não é um número");
    });

    it("deveria retornar as informações do cliente no formato correto", async () => {
        // Chama a função getCliente
        const cliente = await healthchain.getCliente(clienteAddress, { from: socorristaAddress });

        // Verifica se o formato dos dados está correto
        assert.equal(cliente[0], "Asma", "Comorbidades do cliente não correspondem");
        assert.equal(cliente[1], "Amendoim", "Alergias do cliente não correspondem");
        assert.equal(cliente[2], "O+", "Tipo sanguíneo do cliente não corresponde");
    });

    it("deveria lançar um erro ao tentar consultar uma instituição não cadastrada", async () => {
        try {
            await healthchain.getInstituicao(accounts[3]);
            assert.fail("A função deveria ter falhado para uma instituição não cadastrada");
        } catch (error) {
            assert(error.message.includes("Instituicao nao encontrada"), "A mensagem de erro esperada não foi recebida");
        }
    });

    it("deveria lançar um erro ao tentar consultar um cliente não cadastrado", async () => {
        try {
            await healthchain.getCliente(accounts[4], { from: socorristaAddress });
            assert.fail("A função deveria ter falhado para um cliente não cadastrado");
        } catch (error) {
            assert(error.message.includes("Cliente nao encontrado"), "A mensagem de erro esperada não foi recebida");
        }
    });
});
