// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Healthchain {
    struct Cliente {
        address payable cliente;
        string comorbidades;
        string alergias;
        string tipoSanguineo;
        string restricao;
    }

    struct Socorrista {
        address payable socorrista;
        string crm;
    }

    struct InstituicaoSaude {
        address payable instituicaoSaude;
        string nomeInstituicao;
    }

    mapping(address => Cliente) private clientes;
    mapping(address => Socorrista) private socorristas;
    mapping(address => InstituicaoSaude) private instituicoes;

    mapping(address => address) public clienteParaInstituicao;
    mapping(address => address) public socorristaParaInstituicao;

    // Eventos
    event ClienteCadastrado(address indexed cliente, address indexed instituicao);
    event ClienteAtualizado(address indexed cliente);
    event ClienteExcluido(address indexed cliente);
    event SocorristaCadastrado(address indexed socorrista, address indexed instituicao);
    event SocorristaExcluido(address indexed socorrista);
    event InstituicaoCadastrada(address indexed instituicao, string nome);
    event DepositoRealizado(address indexed conta, uint256 valor);
    event ClienteConsultado(address indexed socorrista, address indexed cliente);

    // Função para cadastrar uma nova instituição de saúde
    function cadastrarInstituicao(address _instituicaoAddress, string memory _nomeInstituicao) public {
        require(_instituicaoAddress != address(0), "Endereco invalido");
        require(instituicoes[_instituicaoAddress].instituicaoSaude == address(0), "Instituicao ja cadastrada");
        
        instituicoes[_instituicaoAddress] = InstituicaoSaude(
            payable(_instituicaoAddress),
            _nomeInstituicao
        );
        
        emit InstituicaoCadastrada(_instituicaoAddress, _nomeInstituicao);
    }

    // Função para obter informações de uma instituição de saúde
    function getInstituicao(address _instituicao) public view returns (
        address,
        string memory
    ) {
        require(instituicoes[_instituicao].instituicaoSaude != address(0), "Instituicao nao encontrada");
        InstituicaoSaude memory instituicao = instituicoes[_instituicao];
        return (
            instituicao.instituicaoSaude,
            instituicao.nomeInstituicao
        );
    }

    // Função para cadastrar um novo cliente
    function cadastrarCliente(
        address _cliente,
        string memory _comorbidades,
        string memory _alergias,
        string memory _tipoSanguineo,
        string memory _restricao
    ) public payable {
        // require(msg.value == 0.0001 ether, "O cadastro requer 0.0001 ether");
        require(instituicoes[msg.sender].instituicaoSaude != address(0), "Somente instituicoes podem cadastrar clientes");
        require(clientes[_cliente].cliente == address(0), "Cliente ja cadastrado");

        clientes[_cliente] = Cliente(
            payable(_cliente),
            _comorbidades,
            _alergias,
            _tipoSanguineo,
            _restricao
        );

        clienteParaInstituicao[_cliente] = msg.sender;
        emit ClienteCadastrado(_cliente, msg.sender);
    }

    // Função para editar as informações de um cliente
    function editarCliente(
        string memory _comorbidades,
        string memory _alergias,
        string memory _tipoSanguineo,
        string memory _restricao
    ) public {
        require(clientes[msg.sender].cliente != address(0), "Cliente nao encontrado");
        Cliente storage cliente = clientes[msg.sender];
        cliente.comorbidades = _comorbidades;
        cliente.alergias = _alergias;
        cliente.tipoSanguineo = _tipoSanguineo;
        cliente.restricao = _restricao;
        emit ClienteAtualizado(msg.sender);
    }

    // Função para excluir um cliente
    function excluirCliente(address _cliente) public {
        require(clientes[_cliente].cliente != address(0), "Cliente nao encontrado");
        require(clienteParaInstituicao[_cliente] == msg.sender, "Somente a instituicao associada pode excluir o cliente");
        delete clientes[_cliente];
        delete clienteParaInstituicao[_cliente];
        emit ClienteExcluido(_cliente);
    }

    // Função para obter informações de um cliente - Apenas socorristas podem chamar esta função
function getCliente(address _cliente) public returns (
    string memory,
    string memory,
    string memory,
    string memory
) {
    // Requisitos de acesso e verificações
    require(
        socorristas[msg.sender].socorrista != address(0) || 
        instituicoes[msg.sender].instituicaoSaude != address(0), 
        "Somente socorristas e instituicoes podem acessar as informacoes do cliente"
    );
    require(clientes[_cliente].cliente != address(0), "Cliente nao encontrado");

    // Emitindo evento de consulta ao cliente
    emit ClienteConsultado(msg.sender, _cliente);

    // Retornando informações do cliente
    Cliente memory cliente = clientes[_cliente];
    return (
        cliente.comorbidades,
        cliente.alergias,
        cliente.tipoSanguineo,
        cliente.restricao
    );
}



    // Função para cadastrar um novo socorrista
    function cadastrarSocorrista(
        address _socorrista,
        string memory _crm
    ) public {
        require(instituicoes[msg.sender].instituicaoSaude != address(0), "Somente instituicoes podem cadastrar socorristas");
        require(socorristas[_socorrista].socorrista == address(0), "Socorrista ja cadastrado");

        socorristas[_socorrista] = Socorrista(
            payable(_socorrista),
            _crm
        );
        socorristaParaInstituicao[_socorrista] = msg.sender;
        emit SocorristaCadastrado(_socorrista, msg.sender);
    }

    // Função para excluir um socorrista
    function excluirSocorrista(address _socorrista) public {
        require(instituicoes[msg.sender].instituicaoSaude != address(0), "Somente instituicoes podem excluir socorristas");
        require(socorristas[_socorrista].socorrista != address(0), "Socorrista nao encontrado");
        require(socorristaParaInstituicao[_socorrista] == msg.sender, "Somente a instituicao associada pode excluir o socorrista");
        delete socorristas[_socorrista];
        delete socorristaParaInstituicao[_socorrista];
        emit SocorristaExcluido(_socorrista);
    }

    // Função para obter os dados de um socorrista
    function getSocorrista(address _socorrista) public view returns (
        address,
        string memory,
        address
    ) {
        require(socorristas[_socorrista].socorrista != address(0), "Socorrista nao encontrado");

        Socorrista memory socorrista = socorristas[_socorrista];
        return (
            socorrista.socorrista,
            socorrista.crm,
            socorristaParaInstituicao[_socorrista]
        );
    }

}
