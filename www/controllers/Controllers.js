class App {

    constructor(appId, appName, appVersion, appOs, ambiente, token, tokenSms) {

        this.appId      = appId;
        this.appName    = appName;
        this.appVersion = appVersion;        
        this.appOs      = appOs;

        this.views   = new Views();
        this.sessao  = new Sessao();
        this.models  = new Models();
        this.helpers = new Helpers();

        this.nomeApp         = "PONTO CERTO";
        this.linkApp         = "https://servidorseguro.cloud/pontocerto/";
        this.nomeMoeda       = "MOEDA";
        this.nomeMoedaPlural = "MOEDAS";

        if(ambiente=="HOMOLOGACAO"){
             
            this.urlDom = "https://servidorseguro.cloud/pontocerto//app/www/";
            this.urlApi = "https://servidorseguro.cloud/pontocerto/apiservicekeys/";
            this.urlCdn = "https://servidorseguro.cloud/pontocerto/cdn/";

        }
        if(ambiente=="PRODUCAO"){

            this.urlDom = "https://pontocertointermediacoes.com.br/app/www/";
            this.urlApi = "https://pontocertointermediacoes.com.br/apiservicekeys/";
            this.urlCdn = "https://pontocertointermediacoes.com.br/cdn/";

        }

        this.urlApiPagto = "https://pontocertointermediacoes.com.br/pay/";

        this.token = token;
        this.tokenSms = tokenSms;
        
    }
    
    getVersion() {

        return this.appVersion;
    }

    getOs(){

        return this.appOs;
    }
    
    initApp(elemento){

        this.views.viewPrincipal();

        // VERIFICAR SE A API ESTÁ OK
        this.models.testeApi();
        
        // VERIFICAR SE O USUÁRIO ESTÄ LOGADO
        this.sessao.verificarLogado();

    }

    inicio(){

        this.views.viewPrincipal();
        this.views.ativarMenuUm();

    }

    login(idUsuario,emailUusario,dadosUsuario){
   
        this.sessao.logarUsuario(idUsuario,emailUusario,dadosUsuario);
   
    }

    verificarCodigoSms(){

        this.views.viewCodigoSms();

    }

    procVerificarSms(){
        
       this.models.verificarCodigoSms(); 

    }
    
    procLoginSms(){

        this.models.procLoginSms();
   
    }

    procLogin(){

        this.models.procLogin();
   
    }
    
    procLogoff(){

        confirmacao("Tem certeza que deseja sair?","Você será desconectado...","app.logoff();","Sim, sair");
        
    }

    logoff(){
       
        localStorage.clear();
        
        // RECARREGAR AS CATEGORIAS E DADOS PADRÕES
        app.models.testeApi();
        app.viewLogin();

    }

    cadastro(){
        this.views.viewCadastro();
        this.views.desativarTodosMenus();
    }

    viewLoginEmailSenha(){
        this.views.viewLoginEmailSenha();
    }

    procCadastro(){
        this.models.procCadastro();
    }


    esqueciMinhaSenha(){
        this.views.viewEsqueciMinhaSenha();
        this.views.desativarTodosMenus();
    }

    procResetSenha(){
        this.models.procResetSenha();
    }

    

    selecaoPerfil(){

        event.preventDefault();

        var tipoPerfil = $('input[name=tipoPerfil]:checked').val();

        if(tipoPerfil=="cliente"){

            app.opcoesCarretamentoPerfilCliente();
            localStorage.setItem("selecaoPerfil","cliente");

        }else{

            var dadosCompletosUsuario = JSON.parse(localStorage.getItem("dadosCompletosUsuario"));

            if(dadosCompletosUsuario.categoria!=null || localStorage.getItem("categoria1")!=null){

                    this.views.viewPrincipalProfissional();
                    this.models.orcamentosDisponiveis();
                    localStorage.setItem("selecaoPerfil","profissional");

            }else{

                aviso("Qual categoria de serviço você atua?","Para visualizar os orçamentos disponíveis na nossa plataforma, você precisa informar qual categoria você atua. No próximo passo, você terá que informar esse dado.");
                this.views.selecionarMinhasCategorias();

            }

        }

    }

    induzirReInicio(){

        this.views.viewPrincipalProfissional();
                    this.models.orcamentosDisponiveis();

    }


    listagemNovaBlocada(){

          this.views.listagemNovaBlocada();

    }


    salvarMinhasCategorias(){

            var categoria1 = $("#categoria_1").val();
            var categoria2 = $("#categoria_2").val();
            var cnpj       = $("#profissionalCNPJ").val();

            console.log("ESSAS SÃO AS MINHAS CATEGORIAS:");
            console.log(categoria1);
            console.log(categoria2);
            console.log(cnpj);

            if(!cnpj || cnpj==null || cnpj==undefined){
                aviso("CNPJ é obrigatório","Apenas pessoas jurídicas podem atuar como profissionais na Ponto Certo");
                return;

            }

            localStorage.setItem("categoria1",categoria1);
            localStorage.setItem("categoria2",categoria2);
            localStorage.setItem("cnpj",cnpj);

            this.models.salvarMinhasCategorias();
            this.models.salvarEtapaCadastroProfissional();

            this.views.viewEnviarFotoRg();

            // this.views.viewPrincipalProfissional();
            // this.models.orcamentosDisponiveis();

            localStorage.setItem("selecaoPerfil","profissional");

    }    
    opcoesCarretamentoPerfilCliente(){

        this.views.viewPrincipalCliente();
        this.models.categoriasAtendimento();

    }

    // PASSO 2 DO ATENDIMENTO
    novoAtendimentoPasso2(idCategoria,nomeCategoria){

        // DESCOBRIR SE A CATEGORIA TEM CATEGORIAS FILHAS, 
        var categorias = JSON.parse(localStorage.getItem("categoiasAtendimento"));


        $("#listaDeCategorias").html(`

            <li>
               <a href="javascript:void(0)" onclick="app.novoAtendimentoPasso3(${idCategoria},'${nomeCategoria}')" title="${nomeCategoria}">
                  <b>${nomeCategoria}</b> <img src="assets/images/right.svg" alt="Ver mais">
               </a>
            </li>

            <li class="carregandoCategorias" style="text-align:left;font-size:13px;">
                <img src="assets/images/loading.gif" alt="Carregando" style="width:17px;margin-right:5px;float:none;" /> Carregando
            </li>

        `);

        var n = "";
        var entrei = 0;
        
        // VARRER AS CATEGORIAS
        for(var i = 0;i<categorias.categorias.length;i++){

             if(categorias.categorias[i].relacao.length>0){

                for(var j = 0;j<categorias.categorias[i].relacao.length;j++){

                    if(categorias.categorias[i].relacao[j]==idCategoria){

                        $("#fraseDeAbertura").fadeOut(1);

                        entrei = 1;

                        n = categorias.categorias[i];

                        $(".carregandoCategorias").remove();
                        $("#listaDeCategorias").append(`

                            <li>
                                <a href="javascript:void(0)" onclick="app.novoAtendimentoPasso3(${n.id},'${n.titulo}')" title="${n.titulo}">
                                   ${n.titulo} <img src="assets/images/right.svg" alt="Ver mais">
                                </a>
                            </li>

                        `);

                    }

                }


             }// FINAL DO IF DO TAMANHO

        }// FINAL DO FOR

        app.views._content.append(`
                <p style="text-align:center;font-size:11px;padding-top:20px;">
                    <a href="javascript:void(0)" onclick="app.opcoesCarretamentoPerfilCliente();" title="VOLTAR AO INÍCNIO" style="color:#747474;text-decoration:none;">VOLTAR AO INÍCIO</a>
                </p>
        `);

        if(entrei==0){
            
            localStorage.setItem("tipoHistoricoCategoria","pai");
            app.novoAtendimentoPasso3(idCategoria,nomeCategoria);
        
        }


    }
    


    novoAtendimentoPasso3(idCategoria,nomeCategoria){

        localStorage.setItem("idCategoriaHistorico",idCategoria);
        localStorage.setItem("nomeCategoria",nomeCategoria);

        this.views.novoAtendimento(idCategoria,nomeCategoria);

    }

    enviarAtendimento(){

        $("#btnEnviarSolicitacao").html("enviando... aguarde");

        this.models.enviarAtendimento();

    }


/**
*  ------------------------------------------------------------------------------------------------
*
*
*   SOLICITAÇÕES DO CLIENTE
*
*
*  ------------------------------------------------------------------------------------------------
*/
minhasSolicitacoes(){

    this.views.minhasSolicitacoes();
    this.models.minhasSolicitacoes();

}
cancelarAnuncio(idAnuncio){
    
    confirmacao("Tem certeza que deseja cancelar essa solicitação?","Sua solicitação de orçamento será apagada e não receberá mais propostas dos profissionais.",`app.confirmarCancelamento(${idAnuncio})`,"Sim, remover");

}
confirmarCancelamento(idAnuncio){
   
    aviso("Processando...","Aguarde, estamos removendo a sua solicitação de orçamento.");
    console.log("REMOVER SOLICITAÇÃO: "+idAnuncio);

    this.models.removerSolicitacaoOrcamento(idAnuncio);

}

fecharAnuncio(idAnuncio){

    confirmacao("Tem certeza que deseja encerrar essa solicitação?","Sua solicitação de orçamento será encerrada e não receberá mais orçamentos.",`app.confirmarFechamento(${idAnuncio})`,"Sim, fechar");

}
confirmarFechamento(idAnuncio){

    aviso("Processando...","Aguarde, estamos fechando a sua solicitação de orçamento.");
    console.log("FECHANDO SOLICITAÇÃO: "+idAnuncio);

    this.models.fecharSolicitacaoOrcamento(idAnuncio);

}

    
/**
*  ------------------------------------------------------------------------------------------------
*
*
*   FILTRO TABELA GERAIS
*
*
*  ------------------------------------------------------------------------------------------------
*/
filtrotabela(){

                  var input, filter, ul, li, a, i;
                  
                  input = document.getElementById('filtroTabela');
                  filter = input.value.toUpperCase();
                  ul = document.getElementById("listaDeCategorias");

                  li = ul.getElementsByTagName('li');
                  var entrei = 0;

                   for (i = 0; i < li.length; i++) {
                      a = li[i];
                      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                          li[i].style.display = "";
                          entrei = 1;
                      } else {
                          li[i].style.display = "none";
                          
                      }
                  }

                  if($(input).val()==""){
                    $("#fraseDeAbertura").fadeIn(1);
                }else{
                    $("#fraseDeAbertura").fadeOut(1);
                }

                if(entrei==0){

                    $("#listaDeCategorias").append(`

                        <li class="semResultados" style="text-align:left;font-size:13px;">
                            Nenhum resultado encontrado
                        </li>

                    `);

                }else{

                    $(".semResultados").remove();

                }

     }



    viewPrincipalProfissional(){

      this.models.verificarAtivacaoProfissional();
      
      

    }



    servicosDesbloqueadosProfissional(){

        this.views.servicosDesbloqueadosProfissional();
        this.models.orcamentosDisponiveisDesbloqueados();

    }


    // ALERTAS E MENSAGENS DE AVISO DO USUÁRIO
    alertasProfissionais(){

        this.views.alertasProfissionais();

    }



    atualizarStatusProposta(idOrcamento, idProfissional, novoStatus, valorTotal = null) {
    aviso("Aguarde...", `Atualizando status da proposta para ${novoStatus}.`);

    this.models.atualizarStatusPropostaAPI(idOrcamento, idProfissional, novoStatus, (sucesso, resposta) => {
        fecharAviso();
        if (sucesso) {
            if (novoStatus === 'Aguardando Pagamento' && valorTotal) {
                // --- CORREÇÃO AQUI ---
                // Passar os três argumentos corretamente: idOrcamento, idProfissional, valorTotal
                this.views.viewPagamentoProposta(idOrcamento, idProfissional, valorTotal);
                // --- FIM DA CORREÇÃO ---
            } else {
                aviso("Sucesso!", "A proposta foi recusada.");
                this.minhasSolicitacoes();
            }
        } else {
            aviso("Erro", resposta.erro || "Não foi possível atualizar o status da proposta.");
        }
    });
}


iniciarPagamentoPix(idOrcamento, idProfissional, valorTotal) {
    console.log(`Iniciando pagamento PIX para Orçamento ${idOrcamento}, Profissional ${idProfissional}, Valor ${valorTotal}`);

    // Tenta buscar o CPF de algum lugar (ex: dados do usuário já carregados)
    // Se você tiver os dados completos do usuário em localStorage:
    let cpfCliente = null;
    try {
        const dadosCompletos = JSON.parse(localStorage.getItem("dadosCompletosUsuario"));
         // Ajuste o nome da chave 'cpf' conforme a estrutura real dos seus dados
        if (dadosCompletos && dadosCompletos.cpf) { 
            cpfCliente = dadosCompletos.cpf;
        } else if (dadosCompletos && dadosCompletos.dados && dadosCompletos.dados.cpf) { // Tenta outra estrutura comum
            cpfCliente = dadosCompletos.dados.cpf;
        }
         // Adicione mais verificações se a estrutura for diferente
    } catch (e) {
        console.warn("Não foi possível obter CPF do localStorage:", e);
    }


    // Se NÃO encontrou o CPF, navega para a tela de coleta
    if (!cpfCliente || cpfCliente.length < 11) { // Verifica se tem um CPF minimamente válido
        console.log("CPF do cliente não encontrado localmente. Solicitando...");
        this.views.viewColetaCpfPix(idOrcamento, idProfissional, valorTotal);
    } else {
        // Se JÁ TEM o CPF, prossegue diretamente para gerar o PIX
        console.log("CPF encontrado localmente:", cpfCliente);
        aviso("Processando PIX...", "Aguarde enquanto geramos o código PIX.");
        $("#btnPagarPix, #btnPagarCartao").prop("disabled", true);

        this.models.gerarCobrancaPixProposta(idOrcamento, idProfissional, valorTotal, cpfCliente, (success, data) => { // Passa o CPF
            fecharAviso();
            $("#btnPagarPix, #btnPagarCartao").prop("disabled", false);

            if (success && data.payload) {
                console.log("PIX Gerado:", data);
                this.views.dadosBoleto(data);
            } else {
                console.error("Erro ao gerar PIX:", data);
                aviso("Erro no PIX", "Não foi possível gerar o código PIX. " + (data.erro || "Tente novamente."));
            }
        });
    }
}

// NOVA FUNÇÃO para processar após coletar CPF
processarPagamentoPixComCpf(event, idOrcamento, idProfissional, valorTotal) {
    event.preventDefault();
    const cpfDigitado = $("#pagtoPixCPF").val();

    if (!cpfDigitado || cpfDigitado.length < 14) { // 14 por causa da máscara
        aviso("CPF inválido", "Por favor, digite um CPF válido.");
        return;
    }

    // Desabilitar botão
     const btnSubmit = document.getElementById('btnGerarPixComCpf');
     if(btnSubmit) {
         btnSubmit.innerHTML = 'Gerando...';
         btnSubmit.disabled = true;
     }

    aviso("Processando PIX...", "Aguarde enquanto geramos o código PIX.");

    // Chama o model passando o CPF digitado
    this.models.gerarCobrancaPixProposta(idOrcamento, idProfissional, valorTotal, cpfDigitado, (success, data) => {
        fecharAviso();
         if(btnSubmit) { // Reabilita botão
            btnSubmit.innerHTML = 'Gerar Código PIX';
            btnSubmit.disabled = false;
         }

        if (success && data.payload) {
            console.log("PIX Gerado com CPF digitado:", data);
            this.views.dadosBoleto(data);
        } else {
            console.error("Erro ao gerar PIX com CPF digitado:", data);
            aviso("Erro no PIX", "Não foi possível gerar o código PIX. " + (data.erro || "Tente novamente."));
        }
    });
}    

iniciarPagamentoCartao(idOrcamento, idProfissional, valorTotal) {
    console.log(`Iniciando pagamento Cartão para Orçamento ${idOrcamento}, Profissional ${idProfissional}, Valor ${valorTotal}`);
    //aviso("Processando Cartão...", "Aguarde."); // Pode ser rápido, talvez não precise de aviso aqui

    // Salva os dados necessários para a próxima tela
    localStorage.setItem("pagamentoPropostaOrcamentoId", idOrcamento);
    localStorage.setItem("pagamentoPropostaProfissionalId", idProfissional);
    localStorage.setItem("pagamentoPropostaValorTotal", valorTotal);

    // Navega para uma nova view (ou reutiliza/adapta a 'paginaDeCompra')
    // para coletar os dados do cartão.
    // Vamos criar uma nova view para clareza: viewColetaCartaoProposta
     this.views.viewColetaCartaoProposta(valorTotal);

    // O processamento real do cartão ocorrerá APÓS o usuário preencher os dados
    // na viewColetaCartaoProposta e clicar em "Pagar".
}

// Função chamada pelo formulário da viewColetaCartaoProposta
processarPagamentoCartaoProposta(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    console.log("Processando dados do cartão...");

    // Desabilitar botão
    const btnSubmit = document.getElementById('btnPagarComCartao');
    if(btnSubmit) {
        btnSubmit.innerHTML = 'Processando...';
        btnSubmit.disabled = true;
    }

    // Recupera os IDs e valor salvos
    const idOrcamento = localStorage.getItem("pagamentoPropostaOrcamentoId");
    const idProfissional = localStorage.getItem("pagamentoPropostaProfissionalId");
    const valorTotal = localStorage.getItem("pagamentoPropostaValorTotal");

    // Coleta os dados do formulário do cartão (IDs dos inputs precisam existir na nova view)
    const dadosCartao = {
        numero: $("#pagtoCCNumero").val(),
        nome: $("#pagtoCCNome").val(),
        cpf: $("#pagtoCCNumeroCPF").val(),
        validade: $("#pagtoCCValidade").val(), // MM/YY
        cvv: $("#pagtoCCCvv").val(),
        parcelas: $("#pagtoCCParcelas").val() || 1 // Default para 1 parcela
    };

    // Validação básica (pode ser mais robusta)
    if (!dadosCartao.numero || !dadosCartao.nome || !dadosCartao.cpf || !dadosCartao.validade || !dadosCartao.cvv) {
        aviso("Dados incompletos", "Por favor, preencha todos os dados do cartão.");
        if(btnSubmit) {
            btnSubmit.innerHTML = 'PAGAR COM CARTÃO DE CRÉDITO';
            btnSubmit.disabled = false;
        }
        return;
    }

    // Chama o Model para enviar os dados à API
    this.models.gerarCobrancaCartaoProposta(idOrcamento, idProfissional, valorTotal, dadosCartao, (success, data) => {
         if(btnSubmit) { // Reabilita o botão em caso de sucesso ou erro
            btnSubmit.innerHTML = 'PAGAR COM CARTÃO DE CRÉDITO';
            btnSubmit.disabled = false;
         }

        if (success && data.dados_cobranca_cc && (data.dados_cobranca_cc.status === 'CONFIRMED' || data.dados_cobranca_cc.status === 'RECEIVED')) {
            console.log("Pagamento Cartão Aprovado:", data);
            // Pagamento aprovado imediatamente
             this.views.dadosCartao(data.dados_cobranca_cc.invoiceUrl); // Reutiliza a view de sucesso
            // Limpa os dados salvos
             localStorage.removeItem("pagamentoPropostaOrcamentoId");
             localStorage.removeItem("pagamentoPropostaProfissionalId");
             localStorage.removeItem("pagamentoPropostaValorTotal");

        } else if (success && data.dados_cobranca_cc && data.dados_cobranca_cc.status === 'PENDING') {
             console.log("Pagamento Cartão Pendente:", data);
             aviso("Pagamento Pendente", "Seu pagamento com cartão está pendente de análise. Aguarde a confirmação.");
             app.minhasSolicitacoes(); // Volta para a lista de solicitações
             // Limpa os dados salvos
             localStorage.removeItem("pagamentoPropostaOrcamentoId");
             localStorage.removeItem("pagamentoPropostaProfissionalId");
             localStorage.removeItem("pagamentoPropostaValorTotal");
        }
        else {
            console.error("Erro no pagamento com Cartão:", data);
             this.views.dadosCartaoPendente(data.erro || "O pagamento foi recusado ou houve um erro."); // Reutiliza a view de falha/pendente
        }
    });
}


saldoFinanceiro() {
        // Navega para a view que exibe saldo e extrato
        this.views.viewSaldoFinanceiro();
        // A própria view chamará 'carregarSaldoExtrato' após renderizar o HTML base
    }

    
    carregarSaldoExtrato() {
        // Mostra feedback de carregamento (geralmente já presente na view inicial)
        // Chama o model para buscar os dados da API (saldo disponível, bloqueado e extrato)
        this.models.getSaldoExtrato((success, data) => {
            if (success) {
                // Atualiza os saldos exibidos na tela
                $("#saldoAtualProfissional").text('R$ ' + data.saldo_disponivel); // Saldo Disponível
                $("#saldoBloqueadoProfissional").text('R$ ' + data.saldo_bloqueado); // Saldo Bloqueado

                 // Renderiza a lista de extrato
                 let extratoHtml = '';
                 // Verifica se o extrato existe e tem itens
                 if(data.extrato && data.extrato.length > 0) {
                     // Mapeia cada item do extrato para um elemento HTML
                     extratoHtml = data.extrato.map(item => `
                        <div class="extrato-item ${item.tipo ? item.tipo.toLowerCase().replace('í', 'i') : ''}"> <span class="extrato-data">${item.data ? item.data.split(' ')[0] : '-'}</span>
                            <span class="extrato-desc">${item.descricao || '-'}</span>
                            <span class="extrato-valor">${item.tipo === 'Entrada' ? '+' : '-'} ${item.valor || 'R$ 0,00'}</span>
                        </div>
                     `).join(''); // Junta todos os elementos HTML em uma string
                 } else {
                     // Mensagem se não houver transações
                     extratoHtml = '<p style="text-align:center; padding: 15px; color: #777;">Nenhuma transação encontrada no extrato.</p>';
                 }
                 // Atualiza o container do extrato com o HTML gerado
                 $("#extratoItensContainer").html(extratoHtml);

            } else {
                // Em caso de erro ao buscar dados
                $("#saldoAtualProfissional").text('Erro');
                $("#saldoBloqueadoProfissional").text('Erro');
                $("#extratoItensContainer").html('<p style="text-align: center; padding: 15px; color: red;">Erro ao carregar dados.</p>');
                // Mostra um aviso para o usuário
                aviso("Erro", data.erro || "Não foi possível carregar seu saldo e extrato.");
            }
        });
    }

    
    submitSaque(event) {
        event.preventDefault(); // Impede o envio padrão do formulário do modal
        const btnSubmit = $("#btnSubmitSaque"); // Seleciona o botão de submit do modal

        // Desabilita o botão e mostra feedback de processamento
        btnSubmit.text('Processando...').prop('disabled', true);

        // Obtém os valores dos campos do modal
        // Usa inputmask('unmaskedvalue') para pegar o valor numérico do campo de valor
        const valorSaqueRaw = $("#valorSaque").inputmask('unmaskedvalue');
        const valorSaque = parseFloat(valorSaqueRaw) || 0;
        // Obtém o saldo disponível do campo oculto
        const saldoDisponivel = parseFloat($("#saldoDisponivelSaque").val()) || 0;
        const pixType = $("#pixType").val();
        const pixKey = $("#pixKey").val();
        const cpfTitular = $("#cpfTitular").val(); // Pode vir com máscara

        // --- Validações ---
        if (valorSaque <= 0) {
            aviso("Valor inválido", "Digite um valor de saque maior que zero.");
            btnSubmit.text('Confirmar Solicitação').prop('disabled', false); // Reabilita o botão
            return;
        }
        // Compara com pequena tolerância para evitar erros de ponto flutuante
        if (valorSaque > saldoDisponivel + 0.001) {
            // Formata os valores para exibição no aviso
            const valorSaqueF = valorSaque.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const saldoDispF = saldoDisponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            aviso("Saldo insuficiente", `Você solicitou ${valorSaqueF} mas só tem ${saldoDispF} disponível para saque.`);
            btnSubmit.text('Confirmar Solicitação').prop('disabled', false);
            return;
        }
         if (!pixType || !pixKey || !cpfTitular) {
            aviso("Dados incompletos", "Preencha todos os dados PIX para o recebimento.");
            btnSubmit.text('Confirmar Solicitação').prop('disabled', false);
            return;
        }
         // Validação básica de CPF (remove máscara e verifica se tem 11 dígitos)
         const cpfLimpo = cpfTitular.replace(/\D/g, '');
         if (cpfLimpo.length !== 11) {
             aviso("CPF inválido", "O CPF do titular da conta PIX parece inválido. Verifique.");
             btnSubmit.text('Confirmar Solicitação').prop('disabled', false);
             return;
         }
        // --- Fim Validações ---


        // Chama o método no Model para enviar a solicitação para a API
        // Passa o valor numérico e o CPF (pode estar com máscara, backend limpa se necessário)
        this.models.submitSaque(valorSaque, pixType, pixKey, cpfTitular, (success, data) => {
            // Reabilita o botão, independentemente do resultado
            btnSubmit.text('Confirmar Solicitação').prop('disabled', false);

            if (success) {
                // Se a API retornou sucesso
                aviso("Sucesso!", data.mensagem || "Solicitação de saque enviada com sucesso.");
                // Remove o modal da tela
                const modalSaque = document.getElementById('modalSaque');
                if (modalSaque) modalSaque.remove();
                // Recarrega a view de saldo/extrato para mostrar o saldo atualizado e a nova transação
                this.saldoFinanceiro();
            } else {
                // Se a API retornou erro
                aviso("Erro ao solicitar", data.erro || "Não foi possível registrar a solicitação. Tente novamente.");
            }
        });
    }

    concluirAtendimento(idOrcamento, idProfissional) {
         // Confirmação com o usuário
         confirmacao(
            'Confirmar Conclusão?',
            'Ao confirmar, o pagamento será liberado para o profissional e esta ação não poderá ser desfeita. Você confirma que o serviço foi concluído satisfatoriamente?',
            // Função a ser executada se confirmar: chama o Model
             `app.processarConclusaoAtendimento(${idOrcamento}, ${idProfissional})`,
            'Sim, Concluir' // Texto do botão de confirmação
        );
    }

    // --- NOVA FUNÇÃO: Processa a conclusão após confirmação ---
    processarConclusaoAtendimento(idOrcamento, idProfissional) {
        aviso("Processando...", "Aguarde enquanto finalizamos o atendimento."); // Feedback inicial

        this.models.concluirAtendimentoAPI(idOrcamento, idProfissional, (success, data) => {
             fecharAviso(); // Fecha o aviso de processamento
             if(success) {
                 aviso("Atendimento Concluído!", data.mensagem || "O pagamento foi liberado para o profissional.");
                 // Recarrega a view de 'Minhas Solicitações' para atualizar o status
                 this.minhasSolicitacoes();
             } else {
                 aviso("Erro", data.erro || "Não foi possível concluir o atendimento no momento.");
             }
        });
    }

    desbloqAnuncio(anuncio,valorAnuncio,categoria){

        var categoria1 = localStorage.getItem("categoria1");
        var categoria2 = localStorage.getItem("categoria2");
        console.log("ESSA É A CATEGORIA: "+categoria);

        if(categoria1==categoria || categoria2==categoria || 3 == 3){

        var saldoUsuario = localStorage.getItem("saldoPrestadorServico");
        
        // SALVAR DETALHE DO ANÚNCIO
        localStorage.setItem("anuncioHeranca",anuncio);

        if(saldoUsuario<valorAnuncio && 9 == 3){ // Não precisamos mais da verificação de saldo 
        
            confirmacao("Oops! Você não tem MOEDAS suficiêntes","Quer enviar um orçamento para esse cliente? Compre agora um pacote de MOEDAS para desbloquear essa e muitos outros anúncios!","app.comprarChaves()","Comprar");
        
        }else{

            confirmacao("Deseja enviar um orçamento para esse anúncio?",`Envie uma proposta de valor para esse orçamento, se o cliente topar: negócio fechado!`,`app.views.viewDetalheAnuncio(${anuncio},5)`,"Enviar");

        }

    }else{

          aviso("Oops! Você não pode atender a esse orçamento","Suas categorias de atendimento não permitem atender a esse tipo de orçamento. Para alterar as suas categorias de atendimento, envie um e-mail para <b>suporte@pontocerto.com.br</b>");  

    }
        

    }

    resumoSaldoProfissional(){

        this.views.resumoSaldoProfissional();

    }


    comprarChaves(){
       
        this.views.viewComprarChaves();
        this.models.pacoteChaves();

    }

    selecaoPacoteCompra(){

        // SELECIONAR A OPÇÃO ESCOLHIDA
        var pacoteEscolhido = $('input[name=pacote]:checked', '#formPacoteSelecao').val();

        console.log("PACOTE ESCOLHIDO PELO USUÁRIO: "+pacoteEscolhido);

        $("#btnComprarSelecionado").html("Carregando....");

        // SELECIONAR O VALOR DE ACORDO COM A ESCOLHA
        this.models.selecaoPacoteDeChaves(pacoteEscolhido);

        // DIRECIONAR PARA A TELA DE COMPRA DO PACOTE
        //this.views.paginaDeCmopra();

        // CARREGAR O PRECO DO PACOTE ESCOLHIDO
        //this.models.paginaDeCompra();
        
        // DIRECIONAR PARA O DETALHE DO ORÇAMENTO (PROVISORIO)
        //this.views.viewDetalheAnuncio();

    }

    payBoleto(evemt){
         
         
         $("#btnPayBoleto").html("PROCESSANDO...");
         this.views.processandoPagamento();

         this.models.payBoleto();


  

    }

    payCartaoDeCredito(){
        
        $("#btnPayCartao").html("PROCESSANDO...");
        this.views.processandoPagamentoCartao();
        this.models.payCartaoDeCredito();

    }

    dadosBoleto(dados){
        
        this.views.dadosBoleto(dados);

    }


    /* CURSOS */
    cursos(){
       
       this.views.cursos();
       this.models.cursos();

    }

    filtrotabelaCursos(){

        var input, filter, ul, li, a, i;
                  
                  input = document.getElementById('buscaCursos');
                  filter = input.value.toUpperCase();
                  ul = document.getElementById("loopCursosLista");

                  li = ul.getElementsByTagName('li');

                  // Loop through all list items, and hide those who don't match the search query
                  for (i = 0; i < li.length; i++) {
                      a = li[i];
                      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
                          li[i].style.display = "";
                      } else {
                          li[i].style.display = "none";
                      }
                  }

    }

    
    detalheCurso(idCurso){

      this.views.detalheCurso(idCurso);
      this.models.detalheCurso(idCurso);


    }

    abrirChat(){

        this.views.abrirChat();

    }

    // controllers/Controllers.js

    // SUBSTITUA A FUNÇÃO INICIARCHATORCAMENTO ANTIGA POR ESTA
    // controllers/Controllers.js
    // controllers/Controllers.js

    // SUBSTITUA a função iniciarChatOrcamento por esta versão final:
    iniciarChatOrcamento(idOrcamento) {
        
        // 1. Renderiza manualmente o container principal do chat, 
        //    sem chamar a lógica extra de 'this.views.abrirChat()'.
        this.views._content.html(`<div class="novo-chat-compon-container" id="chatContainer"></div>`);
        this.views.animarTransicao();
        
        // 2. Chama diretamente a função 'trocarView' para carregar a tela de 'detalhe'.
        //    Isso evita a condição de corrida, pois agora apenas uma ação está sendo executada.
        trocarView('detail', idOrcamento);
    }

    iniciarCurso(){
       
       this.views.iniciarCurso();
       this.models.iniciarCurso();

    }

    nextAula(){

        this.views.nextAula();
        this.models.atualizarHistoricoAluno();

    }

    carregarProximaAula(){

         var oQueFazer = localStorage.getItem("aulaHasTeste");

         if(oQueFazer=="nao"){

            this.views.iniciarCurso();
            this.models.carregarProximaAula(); 

         }else{

            // DIRECIONAR O USUÁRIO PARA O TESTE
            this.views.detalheTeste();

         }

           

    }


    detalheTeste(idTeste){

        this.views.detalheTeste(idTeste);

    }


    corrigirTeste(){
         
         this.views.corrigirTeste();

         

    }





    /* INDIQUE E GANHE */
    indiqueEGanhe(){
         
         this.views.indiqueEGanhe();

    }


    configuracoes(){

        this.views.configuracoes();

    }
    

    configuracoesProfissionais(){

         this.views.configuracoes();

    }

    duvidasESuporte(){

        this.views.duvidasESuporte();
        this.models.duvidasESuporte();
    }


    /* ABRIR OU FECHAR O MENU CLIENTE */
    abrirFecharMenuCliente(){

      if($(".menu-adicional-cliente").hasClass("aberto")){
         
            $(".menu-adicional-cliente").removeClass("aberto");
        
      }else{

            $(".menu-adicional-cliente").addClass("aberto");
        
      }

    }

    /* ABRIR OU FECHAR O MENU PROFISSIONAL */
    abrirFecharMenuProfissional(){

      if($(".menu-adicional-profissional").hasClass("aberto")){
         
            $(".menu-adicional-profissional").removeClass("aberto");
        
      }else{

            $(".menu-adicional-profissional").addClass("aberto");
        
      }

    }


    finalizarServico(){
       
       aviso("Você realizou atendimento para esse cliente?","Apenas confirme o atendimento se você realizou o serviço orçado para esse cliente");

    }




/**
*  ------------------------------------------------------------------------------------------------
*
*
*   EDITAR PERFIL USUARIO LOGADO
*
*
*  ------------------------------------------------------------------------------------------------
*/
    editarPerfil(){

       this.views.editarPerfil();
       this.models.editarPerfil();

    }
    procEditarPerfil(){
       
       this.models.procEditarPerfil();

    }




    view2(){
        this.views.view2();
        this.views.ativarMenuDois();
    }

    view3(){
        this.views.view3();
        this.views.ativarMenuTres();
    }

    viewLogin(){
        this.views.viewLogin();
        this.views.desativarTodosMenus();
    }

    viewUploadFoto(){
        this.views.viewUploadFoto();
        this.views.desativarTodosMenus();
    }

}


class Sessao{
    
	constructor(){
	      
	     this.logado = "nao-logado";
	     this.bdLogado = localStorage.getItem("bdLogado");
	     this.idUsuario = localStorage.getItem("idUsuario");
	     this.emailUsuario = localStorage.getItem("emailUsuario");
	     this.dadosUsuario = localStorage.getItem("dadosUsuario");

	}
    
    logarUsuario(idUsuario,emailUusario,dadosUsuario){
    	this.logado = "logado";
    	this.idUsuario = idUsuario;
    	this.dadosUsuario = dadosUsuario;
    	localStorage.setItem("bdLogado","logado");
        localStorage.setItem("idUsuario",this.idUsuario);
        
        // DIRECIONAR O USUÁRIO PARA O INÍCIO
    	app.inicio();
    }

    verificarLogado(){
      
	      if(this.bdLogado!="logado"){
	      	app.viewLogin();
	      	
	      }

    }

    deslogarUusario(){
    	this.logado = "nao-logado";
    	localStorage.setItem("bdLogado","nao-logado");
    	localStorage.clear();
    }

}