class JogoDaMemoria {
    // Se mandar um Objeto = {tela:1, idade:2, etc:3}
    // vai ignorar o resto das propriedades e pegar somente a propriedade tela
    constructor({ tela, util }) {
        this.tela = tela
        this.util = util
        // caminho do arquivo, sempre relativo ao index.html
        this.heroisIniciais = [
            {img: './arquivos/batman.png', nome:'batman'},
            {img: './arquivos/ciclope.png', nome:'ciclope'},
            {img: './arquivos/flash.png', nome:'flash'},
            {img: './arquivos/volverine.png', nome:'volverine'}
        ]
        this.iconePadrao = './arquivos/padrao.png'
        this.heroisEscondidos = []
        this.heroiSelecinados = []
    }
    // para usar o this, não precisamos usar static!
    inicializar() {
        // vai pegar todas as funcoes da classe tela!
        // coloca todos os herois na tela
        this.tela.atualizarImagens(this.heroisIniciais)
        // força a tela a usar o THIS de Jogo da Memoria
        this.tela.configurarBotaoJogar(this.jogar.bind(this))
        this.tela.configurarBotaoVerificarSelecao(this.verificarSelecao.bind(this))
        this.tela.configurarBotaoMostrarTudo(this.mostrarHeroisEscondidos.bind(this))
    }
    async embaralhar() {
        const copias = this.heroisIniciais
        // duplicar os itens
        .concat(this.heroisIniciais)
        // entrar em cada item e criar um id aleatorio
        .map(item => {
            return Object.assign({}, item, {id: Math.random() / 0.5})
        })
        // ordenar aleatoriamente
        .sort(() => Math.random() - 0.5)
        this.tela.atualizarImagens(copias)
        this.tela.exibirCarregando()

        const idDoIntervalo = this.tela.iniciarContador()

        // vamos esperar 3 segundo para atualizar a tela
        await this.util.timeout(3000)
        this.tela.limparContador(idDoIntervalo)
        this.esconderHerois(copias)
        this.tela.exibirCarregando(false)
    }
    esconderHerois(herois) {
        // Vamos trocar a imagem de todos os herois existentes
        // pelo icone padrao
        // como fizemos no construtor, vamos extrair somente o necessário
        // usando a sintaxe ({ chave: 1 }) estamos falando que vamos retornar
        // o que tiver dentro dos parenteses
        // quando nao usamos : (exemplo do id), o JS entende que o nome
        // é o mesmo do valor Ex. id: id, vira id,
        const heroisEscondidos = herois.map(( {nome, id} ) => ({
            id,
            nome,
            img: this.iconePadrao
        }))
        // Atualizamos a tela com os herois ocultos
        this.tela.atualizarImagens(heroisEscondidos)
        // guardamos os herois para trabalhar com eles depois
        this.heroisEscondidos = heroisEscondidos
    }
    exibirHerois(nomeDoHeroi) {
        // vamos procurar esse heroi pelo nome em nossos heroisIniciais
        // vamos obter somente a imagem dele
        const { img } = this.heroisIniciais.find(({ nome }) => nomeDoHeroi === nome)
        // vamos criar uma funcao na tela, para exibir somente o heroi selecionado
        this.tela.exibirHerois(nomeDoHeroi, img)
    }
    verificarSelecao(id, nome) {
        const item = {id, nome}
        // vamos verificar a quantidade de herois selecionados
        // e tomar a ação se escolher certo ou errado
        const heroiSelecinados = this.heroiSelecinados.length
        switch(heroiSelecinados) {
            case 0:
                // adiciona a escolha na lista, esperando pela proxima
                // clicada
                this.heroiSelecinados.push(item)
                break;
            case 1:
                // se a quantidade for 1, significa
                // que o usuário só pode escolher mais um
                // vamos obter o primeiro item da lista
                const [ opcao1 ] = this.heroiSelecinados
                // zerar itens para nao selecionar mais de dois
                this.heroiSelecinados = []
                // conferimos se os nomes e ids batem conforme
                // o esperado
                if(opcao1.nome === item.nome &&
                    // aqui verificamos se são ids diferentes para
                    // o usuário nao clicar duas vezes
                opcao1.id !== item.id
                ) {
                    this.exibirHerois(item.nome)
                    // como padrao é true, não precisa passar nada
                    this.tela.exibirMensagem()
                    // para a execucao
                    return;
                }

                this.tela.exibirMensagem(false)
                // fim do case
                break;
        }
    }
    mostrarHeroisEscondidos() {
        // vamos pegar todos os herois da tela e colocar seu
        // respectivo valor correto
        const heroisEscondidos = this.heroisEscondidos
        for(const heroi of heroisEscondidos) {
            const { img } = this.heroisIniciais.find(item => item.nome === heroi.nome)
            heroi.img = img
        }
        this.tela.atualizarImagens(heroisEscondidos)
    }
    jogar() {
        this.embaralhar()
    }
}