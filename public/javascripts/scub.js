'use strict';

const e = React.createElement;
const c = console.log;
const url = 'http://jdev.rio.rj.gov.br/CCU';
const local = 'http://127.0.0.1:8049/webrunstudio'


var obSol = {
    cpf: '',
    nome: '',
    idauto: '',
    descricao: '',
    lacre: '',
    dataLacre: '',
    numeroauto: '',
    logradouro: ''
}


if (window.innerWidth < 575) {
    $('#listas').hide();
    $('#card').show();
} else {
    $('#listas').show();
    $('#card').hide();
}




// Área para renderizar o cabeçalho de solicitação
const titulo = e('p', { key: 'titulo' }, 'NOVA SOLICITAÇÃO')
const textoTitulo = e('p', { key: 'textoTitulo' }, 'Uma nova solicitação será avaliada pela Prefeitura em até 7 dias contados da data da apreensão.')
const corpoTextoAviso = e('div', { key: 'corpoTextoAviso' }, [textoTitulo])
const divTitulo = e('div', { key: 'divTitulo', className: 'lableSolicitacoes' }, titulo)




var resLacre = (NumeroAuto, DataApreensao, Logradouro) => {
    class RespostaLacre extends React.Component {
        constructor(props) {
            super(props);
            this.state = { NumeroAuto: NumeroAuto, DataApreensao: moment(DataApreensao).format('DD/MM/YYYY'), Logradouro: Logradouro }
            this.handleChangeDescricao = this.handleChangeDescricao.bind(this);

        }

        componentDidMount() {


            $('#btnEnviarSolicitacao').click(() => {

                let cpf = obSol.cpf;
                let nome = obSol.nome;
                let idauto = obSol.idauto;
                let descricao = 'Descricao: ' + obSol.descricao + ';Data: ' + obSol.dataLacre + ';Lacre: ' + obSol.lacre + ';Auto: ' + obSol.numeroauto + ';Logradouro: ' + obSol.logradouro;

                if (!descricao) {
                    alert('Preencha a Descrição das mercadorias')
                } else if (descricao.length < 50) {
                    alert('Informe mais detalhes para efeturar a solicitação')
                } else {
                    axios
                        .get(url + "/ZServicoInserirSolicitacao.rule?sys=CCU&CPF=" + cpf + "&NOME=" + nome + "&idAuto=" + idauto + "&DESCRICAO=" + descricao)
                        .then(response => {
                            if (response.data.status === 'error') {
                                c('houve um erro')
                            } else {
                                var res = response.data.dados[0];
                                carregaImagens(res.idSolicitacaoMercadoria, 0);
                                obSol.descricao = null;
                                atualizarHistorico(res.idSolicitacaoMercadoria, 1)
                            }
                        })
                        .catch(error => console.log(error));
                }

            })


        }

        handleChangeDescricao(value) {
            obSol.descricao = event.target.value;
        }

        render() {

            return e('div', { key: 'divLacreRespota' },
                [
                    e('ul', { key: 'listaDadosLacre', className: 'listaRespostaLacre' },
                        [
                            e('li', { key: 'l1' }, 'Data da Apreensão: ' + this.state.DataApreensao),
                            e('li', { key: 'l2' }, 'Número do Auto de Apreensão: ' + this.state.NumeroAuto),
                            e('li', { key: 'l3' }, 'Local da Apreensão: ' + this.state.Logradouro)
                        ]),
                    e('div', { key: 'divDescricao', id: 'descricaolacre' }, e('textarea', { key: 'textareaDescricao', value: this.state.descricao, onChange: this.handleChangeDescricao, className: 'form-control', placeholder: 'Informe uma breve descrição da mercadoria' }, null)),
                    e('button', { key: 'btnEnviarSolicitacao', className: 'btn btn-info btn-lg btn-block', id: 'btnEnviarSolicitacao' }, 'PROSSEGUIR COM O CADASTRO'),
                    e('div', { key: Math.random(), className: 'divimagens', id: 'divimagens' })

                ])
        }
    }

    const domContainer = document.querySelector('#divRespostaLacre');
    ReactDOM.render(e(RespostaLacre), domContainer);
}

var solLacre = () => {

    class Lacre extends React.Component {
        constructor(props) {
            super(props);
            this.state = { lacre: '', data: '', descricao: '' }

            this.handleChangeLacre = this.handleChangeLacre.bind(this);
            this.handleChangeDescricao = this.handleChangeDescricao.bind(this);
            this.handleChangeData = this.handleChangeData.bind(this);
        }

        componentDidMount() {
            $('#button-lacre').click(() => {
                if (!this.state.data) {
                    meercadoria
                    alert('Informe a data da apreensão da mercadoria');
                } else if (!this.state.lacre) {
                    alert('Informe o número do lacre');
                } else {
                    obSol.lacre = this.state.lacre;
                    obSol.dataLacre = moment(this.state.data).format('DD/MM/YYYY');

                    axios
                        .get(url + "/ZServicoBuscarLacre.rule?sys=CCU&LACRE=" + this.state.lacre + "&DATA=" + this.state.data)
                        .then(response => {
                            if (response.data.status === 'error') {
                                alert('Lacre não encontrado. Aguarde 24 horas e tente novamente')
                                $('#divRespostaLacre').empty();
                            } else {
                                var res = response.data.dados[0];
                                obSol.idauto = res.IDAuto;
                                obSol.numeroauto = res.NumeroAuto;
                                obSol.logradouro = res.Logradouro;
                                resLacre(res.NumeroAuto, res.DataApreensao, res.Logradouro);
                            }
                        })
                        .catch(error => console.log(error));
                }

            })
        }

        handleChangeLacre(event) {
            this.setState({ lacre: event.target.value });
        }

        handleChangeDescricao(event) {
            this.setState({ descricao: event.target.value });
        }

        handleChangeData(event) {
            this.setState({ data: event.target.value });
        }

        render() {

            return e('div', { key: 'divPrincipalSolicitacoes' }, [
                divTitulo,
                textoTitulo,
                e('div', { key: 'divData', className: 'form-group' },
                    [
                        e('label', { key: 'labelData' }, 'Data da Apreensão'),
                        e('input', { key: 'inputData', value: this.state.data, onChange: this.handleChangeData, type: 'date', min: '2020-01-01', id: 'datepicker', className: 'form-control' }, null),

                    ]),
                e('div', { key: 'divLacre', className: 'input-group mb-3' },
                    [
                        e('input', { key: 'inputLacre', value: this.state.lacre, onChange: this.handleChangeLacre, className: 'form-control', placeholder: 'Informe o número do lacre', 'aria-label': 'Informe o número do lacre', 'aria-describedby': 'button-addon2' }, null),
                        e('div', { key: 'divlacre', className: 'input-group-append' }, e('button', {
                            key: 'buttonlacre', className: 'btn btn-outline-secondary', type: 'button', id: 'button-lacre'
                        }, 'Consultar'))
                    ]),
                e('div', { key: 'divRespostaLacre', id: 'divRespostaLacre', className: 'divRespostaLacre' }, null)
            ])
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Lacre), domContainer);
}

var solDescricao = () => {

    class Descricao extends React.Component {
        constructor(props) {
            super(props);
            this.state = { data: '', local: '', descricao: '' }

            this.handleChangeData = this.handleChangeData.bind(this);
            this.handleChangeLocal = this.handleChangeLocal.bind(this);
            this.handleChangeDescricao = this.handleChangeDescricao.bind(this);

        }

        componentDidMount() {
            $('#buttonDescricao').click(() => {
                if (!this.state.descricao) {
                    alert('Preencha primeiramente uma breve descrição da mercadoria');
                } else if (this.state.descricao.length < 5) {
                    alert('Informe mais detalhes para efeturar a solicitação')
                } else {
                    if (!this.state.data) {
                        alert('Informe a data da preensão');
                    } else if (!this.state.local) {
                        alert('Informe o local da apreensão');
                    } else {

                        let resposta = 'Descrição: ' + this.state.descricao.concat(';Data: ' + moment(this.state.data).format('DD/MM/YYYY') + ';Local: ' + this.state.local);
                        c(resposta);

                        axios
                            .get(url + "/ZServicoInserirSolicitacaoDescricao.rule?sys=CCU&CPF=" + obSol.cpf + "&NOME=" + obSol.nome + "&DESCRICAO=" + resposta)
                            .then(response => {

                                if (response.data.status === 'error') {
                                    c('houve um erro')
                                } else {
                                    var res = response.data.dados[0];
                                    c(res);
                                    carregaImagens(res.idSolicitacaoMercadoria, 1);
                                    obSol.descricao = null;
                                    atualizarHistorico(res.idSolicitacaoMercadoria, 1)
                                }
                            })
                            .catch(error => console.log(error));

                    }

                }
            })
        }

        handleChangeData(event) {
            this.setState({ data: event.target.value });
        }

        handleChangeLocal(event) {
            this.setState({ local: event.target.value });
        }

        handleChangeDescricao(event) {
            this.setState({ descricao: event.target.value });
        }



        render() {

            return e('div', { key: 'divPrincipalDescricao', className: 'divPrincipalSolicitacoes' },
                [
                    divTitulo,
                    textoTitulo,
                    e('div', { key: 'divData', className: 'form-group' },
                        [
                            e('label', { key: 'labelData' }, 'Data da Apreensão'),
                            e('input', { key: 'inputData', value: this.state.data, onChange: this.handleChangeData, type: 'date', min: '2020-01-01', id: 'datepicker', className: 'form-control' }, null),

                        ]),
                    e('div', { key: 'divLocal', className: 'form-group' },
                        [
                            e('label', { key: 'labelLocal' }, 'Local da Apreensão'),
                            e('input', { key: 'inputLocal', value: this.state.local, onChange: this.handleChangeLocal, type: 'text', className: 'form-control', placeholder: 'Informe o local da apreensão' }, null),

                        ]),
                    e('textarea', { key: 'textareaDescricao', value: this.state.descricao, onChange: this.handleChangeDescricao, className: 'form-control', placeholder: 'Informe uma breve descrição da mercadoria' }, null),
                    e('div', { key: 'divRespostaDescricao', id: 'divRespostaDescricao' }, null),
                    e('button', { key: 'btnEnviarSolicitacao', className: 'btn btn-info btn-lg btn-block', id: 'buttonDescricao' }, 'PROSSEGUIR COM O CADASTRO'),
                    e('div', { key: Math.random(), className: 'divimagens', id: 'divimagens' })
                ]);
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Descricao), domContainer);
}

const printSolicitacao = (value) => {
    c(value);
    c(obSol);
}

var sucesso = () => {
    class Sucesso extends React.Component {
        constructor(props) {
            super(props);
        }


        render() {
            return e('div', { key: 'sucesso', id: 'sucesso', className: 'sucesso' },
                [
                    e('h1', { key: 'titulosucesso', className: 'sucesso-titulo' }, 'SUCESSO'),
                    e('span', { key: 'textosucesso', className: 'sucesso-texto' }, 'A partir de agora, acompanhe o andamento desta solicitação no menu MINHAS SOLICITAÇÕES'),
                    e('div', { key: Math.random() }, e('button', { key: 'buttonsucesso', className: 'btn btn-link', onClick: () => location.reload() }, 'VER SOLICITAÇÕES'))
                ])
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Sucesso), domContainer);

}


var consultaSolicitacao = (dados) => {

    c(dados);
    class Consulta extends React.Component {
        constructor(props) {
            super(props);
            this.state = { conteudo: dados, idSolicitacaoDevolucao: '' }

            this.handleChange = this.handleChange.bind(this);

        }



        componentDidMount() {

            $('#button-taxa').hide();
            $('#button-acompanharrecurso').hide();
            $('#button-motivoindeferimento').hide();

            this.state.conteudo.forEach(a => {

                if (a.IDStatusSolicitacao === 3) {
                    $('#button-taxa').show();
                }

                if (a.IDStatusSolicitacao === 4) {
                    $('#button-motivoindeferimento').show();
                }


                if (a.IDStatusSolicitacao === 5) {
                    $('#button-motivoindeferimento').hide();
                    $('#button-acompanharrecurso').show();
                }

                if (a.IDStatusSolicitacao === 11) {
                    $('#button-motivoindeferimento').hide();
                    $('#button-acompanharrecurso').show();
                }

                if (a.IDStatusSolicitacao === 17) {
                    $('#button-motivoindeferimento').show();
                    $('#button-acompanharrecurso').hide();
                }

                if (a.IDStatusSolicitacao === 16) {
                    $('#button-motivoindeferimento').hide();
                    $('#button-acompanharrecurso').hide();
                    $('#button-taxa').show();
                }


            })

            $('#button-documento-main').click()

            $('#button-documento-main').click(() => {
                $("#button-documento").trigger('click');
            });

            $('#button-pegaridsolicitacao').trigger('click');

        }


        handleChange(value) {
            this.setState({ idSolicitacaoDevolucao: value });
        }

        render() {

            let arr = []
            let codigosolicitacao = 0;
            let numeroprocesso = null;
            let arrDescricao;
            let listaArrayDescricao = [];
            let dataSolicitacao;

            const tituloSolicitar = e('p', { key: Math.random() }, 'CONSULTAR SOLICITAÇÃO')
            const divTituloSolicitar = e('div', { key: Math.random(), className: 'lableSolicitacoes' }, tituloSolicitar)


            //Header da tabela
            const contador = e('th', { key: Math.random(), scope: 'row', className: 'coluna' }, ' ');
            const etapas = e('th', { key: Math.random(), scope: 'col', className: 'coluna' }, 'ETAPA');
            const data = e('th', { key: Math.random(), scope: 'col', className: 'coluna' }, 'DATA');
            const linhaTitulo = e('tr', { key: Math.random() }, [contador, etapas, data]);
            const thead = e('thead', { key: Math.random() }, [linhaTitulo]);

            this.state.conteudo.forEach(
                (a, b) => {

                    arrDescricao = a.Descricao.split(';');
                    numeroprocesso = a.Processo;
                    codigosolicitacao = a.idSolicitacaoMercadoria;
                    dataSolicitacao = a.Data;
                    const linhaData = e('td', { key: Math.random() }, moment(a.Data).format('DD/MM/YYYY'));
                    const linhaEtapa = e('td', { key: Math.random() }, a.StatusSolciitacao);
                    const linhaContador = e('th', { key: Math.random() }, b + 1);
                    const linhaConteudo = e('tr', { key: Math.random() }, [linhaContador, linhaEtapa, linhaData]);
                    arr.push(linhaConteudo)
                });


            if (!numeroprocesso) {
                numeroprocesso = 'Aguardando abertura'
            }

            arrDescricao.forEach(a => {
                let listaDescricao = e('li', { key: Math.random() }, a)
                listaArrayDescricao.push(listaDescricao);
            });

            let corpoListaDescricao = e('div', { key: Math.random(), className: 'detalhamentoConsulta' }, e('ul', { key: Math.random() }, listaArrayDescricao));


            //Corpo da tabela


            const divDetalhamento = e('div', { key: Math.random() },
                [
                    e('span', { key: Math.random(), className: 'datasolicitacao', id: 'codigosolicitacao' }, 'Código da Solicitação: ' + codigosolicitacao),
                    e('span', { key: Math.random(), className: 'statussolicitacao' }, 'Processo: ' + numeroprocesso)
                ])
            const tbody = e('tbody', { key: Math.random() }, arr);
            const table = e('table', { key: Math.random(), className: 'table table-bordered table-info' }, [thead, tbody]);
            return e('div', { key: Math.random() }, [divTituloSolicitar, divDetalhamento, corpoListaDescricao, table,
                e('button', { key: Math.random(), className: 'btn btn-link btn-lg btn-block', id: 'button-prazos', onClick: () => carregarPrazos(codigosolicitacao, dataSolicitacao) }, 'Consultar Prazos'),
                e('button', { key: Math.random(), className: 'btn btn-link btn-lg btn-block', id: 'button-taxa', onClick: () => carregaTelaTaxa() }, 'Taxa de Depósito'),
                e('button', { key: Math.random(), className: 'btn btn-link btn-lg btn-block', id: 'button-motivoindeferimento', onClick: () => motivoIndeferimento(codigosolicitacao) }, 'Motivo do Indeferimento'),
                e('button', { key: Math.random(), className: 'btn btn-link btn-lg btn-block', id: 'button-acompanharrecurso', onClick: () => acompanharReconsideracao(codigosolicitacao) }, 'Acompanhar Reconsideração')
            ]);
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Consulta), domContainer);


    return codigosolicitacao;
}


const buscarSolicitacao = (value) => {
    axios
        .get(url + "/ZServicoBuscarHistoricos.rule?sys=CCU&ID=" + value)
        .then(response => {
            const res = response.data.dados;
            let codigosolicitacao;
            res.sort((a, b) => a.IDStatusSolicitacao - b.IDStatusSolicitacao);

            res.forEach(a => {
                codigosolicitacao = a.idSolicitacaoMercadoria
            })

            consultaSolicitacao(res);

        })
        .catch(error => console.log(error));

};

const atualizarHistorico = (IDSOLICITACAO, IDSTATUS, OBS) => {
    axios
        .get(url + "/ZServicoAtualizarHistorico.rule?sys=CCU&IDSOLICITACAO=" + IDSOLICITACAO + "&IDSTATUS=" + IDSTATUS + "&OBS=" + OBS)
        .then(response => {
            const res = response.data.dados;
        })
        .catch(error => console.log(error));
}



const carregarPrazos = (idSolicitacaoMercadoria, dataSolicitacao) => {

    axios
        .get(url + "/ZServicoBuscarAuto.rule?sys=CCU&IDSOLICITACAO=" + idSolicitacaoMercadoria)
        .then(response => {

            var obj = {};
            obj.DataSolicitacao = dataSolicitacao;

            if (response.data.status === 'error') {
                obj.Apreensao = null;
                obj.LimiteSolicitacao = null;
                limiteDiasUteis(obj);
            } else {
                const res = response.data.dados[0];
                obj.Apreensao = res.DataApreensao;
                obj.LimiteSolicitacao = res.DataLimite;
                limiteDiasUteis(obj);
            }

        })
        .catch(error => console.log(error));
}


const limiteDiasUteis = (obj) => {
    let data = obj.DataSolicitacao;
    let arrDatas = [];
    let urls = [];

    for (let index = 0; index < 12; index++) {
        data = moment(data).add(1, 'days');
        let semana = moment(data).format('ddd');
        if (semana !== 'sáb' && semana !== 'dom') {
            let obj = { url: url + '/ZServicoBuscarFeriado.rule?sys=CCU&DATA=' + moment(data).format('YYYY-MM-DD'), data: moment(data).format('DD/MM/YYYY') }
            urls.push(obj);
        }
    }

    async function getTodos() {
        for (const [idx, obj] of urls.entries()) {
            const todo = await axios
                .get(obj.url)
                .then(response => {
                    if (response.data.status === "error") {
                        arrDatas.push(obj.data);
                    }
                })
                .catch(error => console.log(error));
        }

        obj['limitedogerente'] = arrDatas[4];

        class Prazos extends React.Component {
            constructor(props) {
                super(props);
                this.state = { value: '' }

                this.handleChange = this.handleChange.bind(this);

            }

            componentDidMount() {

            }


            handleChange(event) {
                this.setState({ value: event.target.value });
            }

            render() {
                const tituloSolicitar = e('p', { key: Math.random() }, 'CONSULTAR PRAZOS DA SOLICITAÇÃO');
                const divTituloSolicitar = e('div', { key: Math.random(), className: 'lableSolicitacoes' }, tituloSolicitar);

                //Header da tabela
                const contador = e('th', { key: Math.random(), scope: 'row', className: 'coluna' }, ' ');
                const etapas = e('th', { key: Math.random(), scope: 'col', className: 'coluna' }, 'ETAPA');
                const data = e('th', { key: Math.random(), scope: 'col', className: 'coluna' }, 'DATA');
                const linhaTitulo = e('tr', { key: Math.random() }, [contador, etapas, data]);
                const thead = e('thead', { key: Math.random() }, [linhaTitulo]);


                //Body da tabela
                let arr = [];

                //linha data da apreensão

                let linhaData;

                if (!obj.Apreensao) {
                    linhaData = e('td', { key: Math.random() }, 'Aguardando confirmação');
                } else {
                    linhaData = e('td', { key: Math.random() }, moment(obj.Apreensao).format('DD/MM/YYYY'));
                }


                let linhaEtapa = e('td', { key: Math.random() }, 'Data da Apreensão');
                let linhaContador = e('th', { key: Math.random() }, 1);
                let linhaConteudo = e('tr', { key: Math.random() }, [linhaContador, linhaEtapa, linhaData]);
                arr.push(linhaConteudo)


                //linha data da solicitação

                linhaData = e('td', { key: Math.random() }, moment(obj.DataSolicitacao).format('DD/MM/YYYY'));
                linhaEtapa = e('td', { key: Math.random() }, 'Data da Solicitacao');
                linhaContador = e('th', { key: Math.random() }, 2);
                linhaConteudo = e('tr', { key: Math.random() }, [linhaContador, linhaEtapa, linhaData]);
                arr.push(linhaConteudo)

                //linha data máxima para solicitar

                if (!obj.LimiteSolicitacao) {
                    linhaData = e('td', { key: Math.random() }, 'Aguardando confirmação');
                } else {
                    linhaData = e('td', { key: Math.random() }, moment(obj.LimiteSolicitacao).format('DD/MM/YYYY'));
                }



                linhaEtapa = e('td', { key: Math.random() }, 'Limite para Solicitar');
                linhaContador = e('th', { key: Math.random() }, 3);
                linhaConteudo = e('tr', { key: Math.random() }, [linhaContador, linhaEtapa, linhaData]);
                arr.push(linhaConteudo)

                //linha data máxima para resposta
                linhaData = e('td', { key: Math.random() }, obj.limitedogerente);
                linhaEtapa = e('td', { key: Math.random() }, 'Limite para Resposta');
                linhaContador = e('th', { key: Math.random() }, 4);
                linhaConteudo = e('tr', { key: Math.random() }, [linhaContador, linhaEtapa, linhaData]);
                arr.push(linhaConteudo)



                const tbody = e('tbody', { key: Math.random() }, arr);
                const table = e('table', { key: Math.random(), className: 'table table-bordered table-info' }, [thead, tbody]);


                return e('div', { key: Math.random() }, [divTituloSolicitar, table]);
            }
        }

        const domContainer = document.querySelector('#conteudo-solicitacao');
        ReactDOM.render(e(Prazos), domContainer);

    }


    getTodos();

}


//Quando o botão de consultar da lista e do card
//são precionados eles já chamam essa função e já
//criam a variavel de sessão idsolicitacao do0 lado do servidor 


const carregaTelaTaxa = () => {

    class Taxa extends React.Component {
        constructor(props) {
            super(props);
            this.state = { value: '' }

            this.handleChange = this.handleChange.bind(this);

        }

        componentDidMount() {
            $('#button-taxa-main').click(() => {
                $("#button-taxa").trigger('click');
            });

            $('#button-comprovante-main').click(() => {
                $("#button-comprovante").trigger('click');
            });
        }


        handleChange(event) {
            this.setState({ value: event.target.value });
        }

        render() {
            let avisos = {
                1: 'Após a confirmação do pagamento. Será permito, durante três dias úteis, a retirada do bem e/ou mercadorias apreendidas.',
                2: 'Passados os três dias úteis, deverá ser impressa uma nova taxa.',
                3: 'A nova taxa deverá ser paga e assim como na primeira taxa, dever-se-á aguardar a confirmação de pagamento.',
                4: 'Após a confirmação de pagamento, um novo prazo de três dias úteis será disponibilizado para a retirada do bem e/ou material apreendido.'
            }


            let textoecabecalhotaxa = e('span', { key: Math.random() }, 'TAXA DE DEPÓSITO');
            let cabecalhotaxa = e('div', { key: Math.random(), className: 'lableSolicitacoes' }, textoecabecalhotaxa);
            let textoaviso1 = e('span', { key: Math.random() }, avisos['1']);
            let aviso1 = e('div', { key: Math.random(), className: 'avisotaxa' }, textoaviso1);
            let textoaviso2 = e('span', { key: Math.random() }, avisos['2']);
            let aviso2 = e('div', { key: Math.random(), className: 'avisotaxa' }, textoaviso2);
            let textoaviso3 = e('span', { key: Math.random() }, avisos['3']);
            let aviso3 = e('div', { key: Math.random(), className: 'avisotaxa' }, textoaviso3);
            let textoaviso4 = e('span', { key: Math.random() }, avisos['4']);
            let aviso4 = e('div', { key: Math.random(), className: 'avisotaxa' }, textoaviso4);
            let botaotaxa = e('button', { key: Math.random, id: 'button-taxa-main', className: 'btn btn-light btn-lg btn-block' }, 'Imprimir Taxa');
            let divbotaotaxa = e('div', { key: Math.random(), className: 'botaotaxa' }, botaotaxa);
            let botaomarcar = e('button', { key: Math.random, className: 'btn btn-light btn-lg btn-block', id: 'button-comprovante-main' }, 'Imprimir comprovante de pagamento');
            let divbotaomarcar = e('div', { key: Math.random(), className: 'botaotaxa' }, botaomarcar);

            return e('div', { key: Math.random() }, [
                cabecalhotaxa,
                aviso1,
                aviso2,
                aviso3,
                aviso4,
                divbotaotaxa,
                divbotaomarcar
            ]);
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Taxa), domContainer);


    return codigosolicitacao;
}

const excluirImagem = (nome, idsolicitacao) => {
    c(nome + ' - ' + idsolicitacao);
}


const carregaImagens = (idsolicitacao, tiposolicitacao) => {
    class Imagens extends React.Component {
        constructor(props) {
            super(props);
            this.state = { value: '' }

            this.handleChange = this.handleChange.bind(this);

        }

        componentDidMount() {

            if (tiposolicitacao === 0) {
                $('#button-documento-main').click(() => {
                    $('#button-pegaridsolicitacaoimagens').trigger('click');
                })
            } else {
                $('#button-documento-main').click(() => {
                    $('#button-pegaridsolicitacaoimagensdescricao').trigger('click');
                })
            }


            $('#button-salvar').click(() => {
                sucesso();
            })

        }


        handleChange(event) {
            this.setState({ value: event.target.value });
        }




        render() {
            const span = e('span', { key: Math.random() }, 'Selecione imagens (jpg, png, bmp, tif) de notas fiscais e documentos que comprovem que as mercadorias são de fato suas para terminar a solicitação número ' + idsolicitacao + '.');
            const aviso = e('div', { key: Math.random(), className: 'form-group' }, span);
            const documentos = e('button', { key: 'btnImagensSolicitacao', className: 'btn btn-info btn-lg btn-block', id: 'button-documento-main' }, 'INSERIR DOCUMENTOS');
            const salvar = e('button', { key: 'btnEnviarSolicitacao', className: 'btn btn-info btn-lg btn-block', id: 'button-salvar' }, 'SALVAR SOLICITAÇÃO');
            const div = e('div', { key: Math.random(), className: 'form-group' }, [aviso, documentos, salvar])
            return div;
        }
    }

    const domContainer = document.querySelector('#divimagens');
    ReactDOM.render(e(Imagens), domContainer);
}

const carregaReconsideracao = (idsolicitacao) => {
    class Reconsideracao extends React.Component {
        constructor(props) {
            super(props);
            this.state = { descricao: '' }

            this.handleChange = this.handleChange.bind(this);

        }

        componentDidMount() {



            $('#button-reconsideracao-main').click(() => {
                $("#button-reconsideracao").trigger('click');
            });


            $('#button-salvar-reconsideração').click(() => {
                let texto = $('#texto').val();

                if (texto.length < 1) {
                    alert('Você precisa informar o FATO NOVO para solicitar a reconsideração do indeferimento.')
                }
                else if (texto.length < 50) {
                    alert('Você precisa dar mais detalhes para concluir a solicitação.')
                } else {
                    axios
                        .get(url + "/ZServicoAtualizarHistorico.rule?sys=CCU&IDSOLICITACAO=" + idsolicitacao + "&IDSTATUS=" + 5 + "&OBS=" + texto)
                        .then(response => {
                            sucesso();
                        })
                        .catch(error => console.log(error));
                }

            });

        }

        handleChange(event) {
            this.setState({ descricao: event.target.value });
        }

        render() {
            const aviso = {
                1: 'Deverá ser informado o "FATO NOVO" que poderá influenciar na decisão do gerente, tornando possível a liberação da mercadoria.',
                2: 'Será permitido realizar essa solicitação durante o pedido de 30 dias corridos.',
                3: 'Caso haja a necessidade de apresentar mais documentos, clique no botão abaixo.'
            }

            const tituloSolicitar = e('p', { key: Math.random() }, 'PEDIDO DE RECONSIDERAÇÃO');
            const divTituloSolicitar = e('div', { key: Math.random(), className: 'lableSolicitacoes' }, tituloSolicitar);
            const span = e('span', { key: Math.random(), className: 'datasolicitacao', id: 'codigosolicitacao' }, 'Código da Solicitação: ' + idsolicitacao)
            const aviso1 = e('span', { key: Math.random() }, aviso['1']); salvar
            const divaviso1 = e('div', { key: Math.random(), className: 'avisotaxa' }, aviso1);
            const aviso2 = e('span', { key: Math.random() }, aviso['2']);
            const divaviso2 = e('div', { key: Math.random(), className: 'avisotaxa' }, aviso2);
            var textarea = e('textarea', { key: 'textareaDescricao2', id: 'texto', className: 'form-control', placeholder: 'Informe o "FATO NOVO" que pode influenciar na decisão do gerente' }, null)
            var divtextarea = e('div', { key: Math.random(), className: 'avisotaxa' }, textarea);
            const aviso3 = e('span', { key: Math.random() }, aviso['3']);
            const divaviso3 = e('div', { key: Math.random(), className: 'avisotaxa' }, aviso3);
            const documentos = e('button', { key: Math.random(), className: 'btn btn-info btn-lg btn-block', id: 'button-reconsideracao-main' }, 'INSERIR DOCUMENTOS');
            const salvar = e('button', { key: 'btnEnviarSolicitacao2', className: 'btn btn-info btn-lg btn-block', id: 'button-salvar-reconsideração' }, 'SALVAR SOLICITAÇÃO');

            return e('div', { key: Math.random() }, [divTituloSolicitar, span, divaviso1, divaviso2, divtextarea, divaviso3, documentos, salvar]);
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Reconsideracao), domContainer);
}

const acompanharReconsideracao = (idsolicitacao) => {
    class Acompanhar extends React.Component {
        constructor(props) {
            super(props);
            this.state = { value: '' }

            this.handleChange = this.handleChange.bind(this);

        }

        componentDidMount() {
            axios
                .get(url + "/ZServicoBuscarHistoricos.rule?sys=CCU&ID=" + idsolicitacao)
                .then(response => {
                    const res = response.data.dados;
                    res.sort((a, b) => a.IDStatusSolicitacao - b.IDStatusSolicitacao)
                    c(res);

                    let respindeferido = res.filter(x => x.StatusSolciitacao === "RECURSO INDEFERIDO");
                    let respdeferido = res.filter(x => x.StatusSolciitacao === "RECURSO EM PROSSEGUIMENTO");

                    if (respindeferido.length > 0) {
                        respostaReconsideracao(respindeferido);
                    } else if (respdeferido.length > 0) {
                        respostaReconsideracao(respdeferido);
                    } else {
                        const arr = [];
                        respostaReconsideracao(arr);
                    }
                })
                .catch(error => console.log(error));

        }

        handleChange(event) {
            this.setState({ descricao: event.target.value });
        }

        render() {

            const tituloSolicitar = e('p', { key: Math.random() }, 'ACOMPANHAR RECONSIDERAÇÃO');
            const divTituloSolicitar = e('div', { key: Math.random(), className: 'lableSolicitacoes' }, tituloSolicitar);
            const span = e('span', { key: Math.random(), className: 'datasolicitacao', id: 'codigosolicitacao' }, 'Código da Solicitação: ' + idsolicitacao);
            const divanonima = e('div', { key: Math.random(), className: 'divacompanharreconsideracao', id: 'divacompanharreconsideracao' }, null);



            return e('div', { key: Math.random() }, [divTituloSolicitar, span, divanonima]);
        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Acompanhar), domContainer);
}

const respostaReconsideracao = (resposta) => {
    class Resposta extends React.Component {
        constructor(props) {
            super(props);
            this.state = { value: '' }

            this.handleChange = this.handleChange.bind(this);

        }

        componentDidMount() {

        }

        handleChange(event) {
            this.setState({ descricao: event.target.value });
        }

        render() {

            let obj = {};

            if (resposta.length === 0) {
                obj.StatusSolciitacao = 'AGUARDANDO ANÁLISE';
                obj.Obs = 'Tão logo haja uma decisão, que pode levar até 30 dias a contar da data do pedido de reconsideração (recurso), ela estará presente neste campo de resposta.';
            } else {
                obj = resposta[0];
            }


            const aviso1 = e('span', { key: Math.random() }, obj.StatusSolciitacao);
            const divaviso1 = e('div', { key: Math.random(), className: 'avisotaxa datasolicitacao' }, aviso1);
            const label = e('label', { key: 'labelData' }, 'Resposta:');
            const divaviso2 = e('div', { key: Math.random(), className: 'avisotaxa' }, label);

            let aviso2;
            aviso2 = e('span', { key: Math.random() }, obj.Obs);

            if (obj.StatusSolciitacao === 'RECURSO EM PROSSEGUIMENTO') {
                aviso2 = e('span', { key: Math.random() }, 'Sua solicitação foi encaminhada para apreciação do Coordenador de Controle Urbano, para análise.');
            }

            const divaviso3 = e('div', { key: Math.random(), className: 'avisotaxa' }, aviso2);

            return e('div', { key: Math.random() }, [divaviso1, divaviso2, divaviso3]);
        }
    }

    const domContainer = document.querySelector('#divacompanharreconsideracao');
    ReactDOM.render(e(Resposta), domContainer);
}


const motivoIndeferimento = (idsolicitacao) => {
    class Motivo extends React.Component {
        constructor(props) {
            super(props);
            this.state = { value: '' }

            this.handleChange = this.handleChange.bind(this);

        }

        componentDidMount() {
            axios
                .get(url + "/ZServicoBuscarHistoricos.rule?sys=CCU&ID=" + idsolicitacao)
                .then(response => {
                    let res = response.data.dados;
                    let x = res.findIndex(x => x.IDStatusSolicitacao === 17)

                    if (x !== -1) {
                        $('#button-recurso').hide();
                    }

                    res = res.filter(a => a.IDStatusSolicitacao === 4);
                    let resposta = res[0].Observacoes;



                    class Resposta extends React.Component {
                        constructor(props) {
                            super(props);

                        }

                        render() {

                            const aviso1 = e('span', { key: Math.random() }, res[0].StatusSolciitacao);
                            const divaviso1 = e('div', { key: Math.random(), className: 'avisotaxa datasolicitacao' }, aviso1);
                            const label = e('label', { key: 'labelData' }, 'Resposta:');
                            const divaviso2 = e('div', { key: Math.random(), className: 'avisotaxa' }, label);

                            return e('div', { key: Math.random() }, e('span', { key: Math.random() }, [divaviso1, divaviso2, resposta]));

                        }
                    }

                    const domContainer = document.querySelector('#divanonimamotivo');
                    ReactDOM.render(e(Resposta), domContainer);
                })
                .catch(error => console.log(error));

        }

        handleChange(event) {
            this.setState({ descricao: event.target.value });
        }

        render() {
            const tituloSolicitar = e('p', { key: Math.random() }, 'MOTIVO DO INDEFERIMENTO');
            const divTituloSolicitar = e('div', { key: Math.random(), className: 'lableSolicitacoes' }, tituloSolicitar);
            const span = e('span', { key: Math.random(), className: 'datasolicitacao', id: 'codigosolicitacao' }, 'Código da Solicitação: ' + idsolicitacao);
            const div = e('div', { key: Math.random(), id: 'divanonimamotivo', className: 'divanonimamotivo' })
            const button = e('button', { key: Math.random(), className: 'btn btn-link btn-lg btn-block', id: 'button-recurso', onClick: () => carregaReconsideracao(idsolicitacao) }, 'Pedido de Reconsideração');
            return e('div', { key: Math.random() }, [divTituloSolicitar, span, div, button]);

        }
    }

    const domContainer = document.querySelector('#conteudo-solicitacao');
    ReactDOM.render(e(Motivo), domContainer);
}

class ShowWindowDimensions extends React.Component {
    state = { width: window.innerWidth, height: window.innerHeight };

    updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
        if (this.state.width < 575) {
            $('#listas').hide();
            $('#card').show();

        };

        if (this.state.width >= 575) {
            $('#listas').show();
            $('#card').hide();

        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    render() {
        return e('span', {}, null)
    }
}

const domContainer = document.querySelector('#conteudo-solicitacao');
ReactDOM.render(e(ShowWindowDimensions), domContainer);