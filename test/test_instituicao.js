const Healthchain = artifacts.require("Healthchain");

contract("Healthchain", accounts => {
    let healthchain;

    const instituicaoAddress1 = accounts[0];
    const instituicaoAddress2 = accounts[1];

    beforeEach(async () => {
        // Implanta um novo contrato antes de cada teste
        healthchain = await Healthchain.new();
    });

    it("deveria cadastrar instituições corretamente", async () => {
        // Cadastrar a primeira instituição
        await healthchain.cadastrarInstituicao(instituicaoAddress1, "Instituicao 1", { from: instituicaoAddress1 });
        // Cadastrar a segunda instituição
        await healthchain.cadastrarInstituicao(instituicaoAddress2, "Instituicao 2", { from: instituicaoAddress2 });

        // Recuperar as informações da primeira instituição
        const instituicao1 = await healthchain.getInstituicao(instituicaoAddress1);
        assert.equal(instituicao1[0], instituicaoAddress1, "Endereço da Instituição 1 não corresponde");
        assert.equal(instituicao1[2], "Instituicao 1", "Nome da Instituição 1 não corresponde");

        // Recuperar as informações da segunda instituição
        const instituicao2 = await healthchain.getInstituicao(instituicaoAddress2);
        assert.equal(instituicao2[0], instituicaoAddress2, "Endereço da Instituição 2 não corresponde");
        assert.equal(instituicao2[2], "Instituicao 2", "Nome da Instituição 2 não corresponde");
    });

    it("deveria lançar um erro ao tentar cadastrar uma instituição já cadastrada", async () => {
        // Cadastrar a instituição
        await healthchain.cadastrarInstituicao(instituicaoAddress1, "Instituicao 1", { from: instituicaoAddress1 });

        // Tentar cadastrar a mesma instituição novamente
        try {
            await healthchain.cadastrarInstituicao(instituicaoAddress1, "Instituicao 1", { from: instituicaoAddress1 });
            assert.fail("A transação deveria ter falhado ao tentar cadastrar uma instituição já existente");
        } catch (error) {
            assert(error.message.includes("Instituicao ja cadastrada"), "Mensagem de erro esperada não foi recebida");
        }
    });

    it("deveria lançar um erro ao tentar recuperar uma instituição não cadastrada", async () => {
        try {
            await healthchain.getInstituicao(instituicaoAddress1);
            assert.fail("A transação deveria ter falhado ao tentar recuperar uma instituição não cadastrada");
        } catch (error) {
            assert(error.message.includes("Instituicao nao encontrada"), "Mensagem de erro esperada não foi recebida");
        }
    });
});
