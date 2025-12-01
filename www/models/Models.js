class Models{
    
    // TESTAR A DISPONIBILIDADE DA API
    testeApi(){

    	      // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"testeapi",
                  data:{token:app.token}
              
              })
              request.done(function (dados) {            

                  console.log("%c VERIFICAÇÃO DE DISPONIBILIDADE DE API","background:#ff0000;color:#fff;");
                  console.log(dados);

                  // SALVAR NA MEMÓRIA AS CATEGORIAS
                  localStorage.setItem("herancaCategorias",JSON.stringify(dados.categorias));
                  localStorage.setItem("categoiasAtendimento",JSON.stringify(dados.categorias));

              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (apiAtiva)");
                   console.log(app.urlApi);
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }

    // VERIFICAR SE O PROFISSIONAL ESTÁ ATIVADO
    verificarAtivacaoProfissional(){

        var id_usuario = localStorage.getItem("idUsuario");
        var debugTeste = {token:app.token,id_entidade:id_usuario,tipo:'usuario',campos:JSON.stringify(["ativacao_usuario"])};

        // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"api-geral",
                  data:{token:app.token,
                        id_entidade:id_usuario,
                        tipo:'usuario',campos:["ativacao_usuario"]}
              
              })
              request.done(function (dados) {            

                    console.log("Dados que enviamos:");
                    console.log(debugTeste);

                    console.log("%c VERIFICAÇÃO DE VERIFICAÇÃO DE CADASTRO DE PROFISSIONAL","background:#ff0000;color:#fff;");
                    console.log(dados);

                    // SALVAR NA MEMÓRIA AS CATEGORIAS
                    var dadosArray = typeof dados === 'string' ? JSON.parse(dados) : dados;

                    // Os dados estão dentro de dadosArray.dados
                    var ativacao_usuario = dadosArray.dados.ativacao_usuario;
                    
                    // Enviou todos os documentos, mas ainda não foi aprovado
                    if(ativacao_usuario === "pendente_aprovacao"){
                        app.views.viewProfissionalPendente();
                        localStorage.setItem("profissionalStatus","pendente_aprovacao");
                    }

                    // Ainda não enviou os documentos
                    if(ativacao_usuario === "pendente_documentos"){
                        app.views.viewEnviarFotoRg();
                        localStorage.setItem("profissionalStatus","pendente_documentos");
                    }

                    // Se cadastrou mas não enviou nem categorias, nem documentos, vamos direcionar para salvar as categorias
                    if(ativacao_usuario === "" || ativacao_usuario === null || ativacao_usuario === undefined){
                        app.views.selecionarMinhasCategorias();
                    }

                    if(ativacao_usuario==="aprovado"){
                      app.views.viewPrincipalProfissional();
                      app.models.orcamentosDisponiveis();
                      localStorage.setItem("profissionalStatus","aprovado");
                    }

              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (verificarAtivacaoProfissional)");
                   console.log(app.urlApi);
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }
    
    // PROC LOGIN
    procLogin(){
       
       event.preventDefault();

       $("#btnLoginEmailSenha").html("Carregando...");

       var loginUsuario = $("#loginUsuario").val();
       var loginSenha = $("#loginSenha").val();

            // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"login-api",
                  data:{token:app.token,tokenSms:app.tokenSms,loginUsuario:loginUsuario,loginSenha:loginSenha}
              
              })
              request.done(function (dados) {            

                  console.log("%c RETORNO DO LOGIN 2","background:#ff0000;color:#fff;");
                  console.log(dados);

                  $("#btnLoginEmailSenha").html("Login");
                  
                  if(dados.sucesso=="200"){

                    console.log(dados);

                    var dadosUsuario = JSON.stringify(dados);
                     
                     //localStorage.setItem("dadosUsuario",dadosUsuario);
                     //app.login(dados.id,dados.email,dadosUsuario);

                     localStorage.setItem("dadosUsuario",dadosUsuario.dados);
                     
                    
                     localStorage.setItem("categoria1",dados.categoria);
                     localStorage.setItem("categoria2",dados.categoria_2);
                     
                     localStorage.setItem("dadosCompletosUsuario",JSON.stringify(dados));

                     localStorage.setItem("nomeUsuario",dados.nome);

                     localStorage.setItem("nomeCompletoUsuario",dados.nome_completo);
                     localStorage.setItem("emailUsuario",dados.email);
                     localStorage.setItem("celularUsuario",dados.celular);

                     app.login(dados.id_usuario,loginUsuario,dadosUsuario.dados);

                  
                  }else{

                     $(".form-control").val("");
                     aviso("Oops! Login ou senha não encontrados","Verifique os dados inseridos e tente novamente!");
                     
                  }
                  
              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (procLogin)");
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }

    // PROC LOGIN SMS
    procLoginSms(){
       
       event.preventDefault();

       $("#btnViewLogin").html("Carregando...");

       var loginUsuario = $("#loginUsuario").val();

	          // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"token-sms-login",
                  data:{token:app.token,tokenSms:app.tokenSms,loginUsuario:loginUsuario}
              
              })
              request.done(function (dados) {          

                  $("#btnViewLogin").html("Próximo");  

                  console.log("%c RETORNO DO LOGIN","background:#ff0000;color:#fff;");
                  console.log(dados);

                  var dadosUsuario = JSON.stringify(dados);
                  
                  if(dados.sucesso=="200"){
                  	 
                  	 //localStorage.setItem("dadosUsuario",dadosUsuario);
                  	 //app.login(dados.id,dados.email,dadosUsuario);

                     app.verificarCodigoSms();
                  
                  }else{
                     
                     //$(".form-control").val("");
                     //aviso("Oops! Login ou senha não encontrados","Verifique os dados inseridos e tente novamente!");
                     
                     // SE O CELULAR NAO ESTIVER CADASTRADO
                     // VAMOS DIRECIONAR O USUÁRIO PARA CONCLUIR O CADASTRO
                     
                     // SALVAR O CELULAR PARA O CADASTRO
                     localStorage.setItem("celularCadastro",loginUsuario);

                     app.cadastro();

                  }
                  
              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (procLogin)");
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }

    // VERIFICAR O CÓDIGO SMS ENVIADO PELO USUÁRIO
    verificarCodigoSms(){

      event.preventDefault();

      $("#btnConfirmarCodigo").html("Processando...");

       var codigoSms = $("#codigoSms").val();

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"verificar-sms",
                  data:{token:app.token,codigoSms:codigoSms}
              
              })
              request.done(function (dados) {            

                  console.log("%c RETORNO DA VERIFICACAO DO CODIGO DE SMS","background:#ff0000;color:#fff;");
                  console.log(dados);

                  var dadosUsuario = JSON.stringify(dados);

                  $("#btnConfirmarCodigo").html("Confirmar código");
                  
                  if(dados.sucesso=="200"){
                     
                     localStorage.setItem("dadosUsuario",dados.usuarios[0].data);

                     localStorage.setItem("categoria1",dados.categoria);
                     localStorage.setItem("categoria2",dados.categoria_2);
                     
                     localStorage.setItem("dadosCompletosUsuario",JSON.stringify(dados));

                     localStorage.setItem("nomeUsuario",dados.nome);

                     localStorage.setItem("nomeCompletoUsuario",dados.nome_completo);
                     localStorage.setItem("emailUsuario",dados.email);
                     localStorage.setItem("celularUsuario",dados.celular);

                     app.login(dados.id_usuario,dados.email,dados.usuarios[0].data);
                  
                  
                  }else{
                     
                     $(".form-control").val("");
                     aviso("Oops! Código incorreto","Verifique o código recebido e tente novamente. Se ainda tiver dificuldades, tente entrar com o e-mail e senha.");
                     
                  }
                  
              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (verificarCodigoSms)");
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }





    // PROC CADASTRO
    procCadastro(){

      event.preventDefault();

      $("#btnViewCadastro").html("Carregando...");
       
      var cadastroNome    = $("#cadastroNome").val();
      var cadastroEmail   = $("#cadastroEmail").val();
      var cadastroSenha   = $("#cadastroSenha").val();
      var cadastroCPF     = $("#cadastroCPF").val();
      var cadastroCelular = localStorage.getItem("celularCadastro");

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"cadastro-usuarios",
                  data:{token:app.token,cadastroCelular:cadastroCelular,cadastroNome:cadastroNome,cadastroEmail:cadastroEmail,cadastroSenha:cadastroSenha,cadastroCPF:cadastroCPF}
              
              })
              request.done(function (dados) {            

                  console.log("%c RETORNO DO CADASTRO","background:#ff0000;color:#fff;");
                  console.log(dados);

                  $("#btnViewCadastro").html("Cadastrar");

                  var dadosUsuario = JSON.stringify(dados);
                  
                  if(dados.sucesso=="200"){
                     
                      localStorage.setItem("dadosUsuario",dadosUsuario);
                      localStorage.setItem("nomeUsuario",dados.nome);
                      localStorage.setItem("dadosCompletosUsuario",JSON.stringify(dados));
                      localStorage.setItem("nomeCompletoUsuario",dados.nome_completo);
                      localStorage.setItem("emailUsuario",dados.email);
                      localStorage.setItem("celularUsuario",dados.celular);

                      localStorage.setItem("saldoPrestadorServico",dados.saldo_chaves);
  
                      // SE DEU TUDO CERTO, VAMOS LOGAR O USUÁRIO
                      app.login(dados.id,dados.email,dadosUsuario);

                      aviso("Bem vindo!","Seu cadastro foi realizado com sucesso, você já pode aproveitar as vantagens do nosso aplicativo.")
                       
                  
                  }else{
                     
                     aviso("Oops! Esse e-mail já está cadastrado na nossa plataforma","Verifique os dados inseridos e tente novamente! Caso tenha esquecido sua senha, clique no link \"Esqueci Senha\" na tela de login.");
                  
                  }
                  
              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (procCadastro)");
                   console.log(dados);
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX

    }


    procResetSenha(){

              event.preventDefault();

              $("#btnViewResetarSenha").html("Processando...");
               
              var resetEmail = $("#resetEmail").val();

              // INICIO CHAMADA AJAX
              var request = $.ajax({

                  method: "POST",
                  url: app.urlApi+"reset-senha",
                  data:{token:app.token,resetEmail:resetEmail}
              
              })
              request.done(function (dados) {            

                  console.log("%c RETORNO DO RESET","background:#ff0000;color:#fff;");
                  console.log(dados);

                  $("#btnViewResetarSenha").html("Resetar senha");

                  var dadosUsuario = JSON.stringify(dados);
                  
                  if(dados.sucesso=="200"){
                     
                     app.viewLogin();
                     aviso("Deu certo! Senha resetada","Enviamos para o seu e-mails instruções sobre o reset de senha.");
                     $("#btnViewResetarSenha").html("Resetar senha");

                  }else{
                     
                     aviso("Oops! E-mail não encontrado","Seu e-mail não foi localizado na plataforma. Verique as informações inseridas e tente novamente.");
                  
                  }
                  
              });
              request.fail(function (dados) {
                     
                   console.log("API NÃO DISPONÍVEL (ResetDeSenha)");
                   console.log(dados);
                   $("#btnViewResetarSenha").html("Resetar senha");
                   aviso("Oops! Algo deu errado","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos");

              });
              // FINAL CHAMADA AJAX


    }






/**
*  ------------------------------------------------------------------------------------------------
*
*
*   EDITAR ACESSO USUARIO PERFIL LOGADO
*
*
*  ------------------------------------------------------------------------------------------------
*/
    editarPerfil(){

      var idUsuario = localStorage.getItem("idUsuario");

      let xhr = new XMLHttpRequest();
       
      /* CONFIGURAÇÕES */
      //xhr.open('GET', app.urlApi+'admin-editarPerfil.php');
      xhr.open('POST', app.urlApi+'editar-perfil',true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

      var params = 'idUsuario='+idUsuario+"&token="+app.token;

      /*

        Então, quais são os estados possíveis de um requisição AJAX? Listaremos abaixo os estados:
        0: requisição ainda não iniciada
        1: conexão com o servidor estabelecida
        2: requisição recebida
        3: processando requisição
        4: requisição está concluída e a resposta está pronta
        O estado 4 é o que mais nos interessa, porque é nele que temos acesso à resposta enviada pelo servidor.

      */
      
      xhr.onreadystatechange = () => {
          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS RETORNADOS EDITAR PERFIL");
              console.log(JSON.parse(xhr.responseText));

              var dados = JSON.parse(xhr.responseText);

                  if(dados.sucesso==200){

                    $(".placeholder").hide(0);
                    $(".form").fadeIn(500);
                    
                    $("#editarPerfilNome").val(dados.nome);
                    $("#editarPerfilEmail").val(dados.dados[0].user_email);
                    $("#editarPerfilCelular").val(dados.celular);
                    
                    // CARREGAR MASCARAS
                    app.helpers.carregarMascaras();

                  }else{
                    
                    aviso("Oops! Algo deu errado!","Nossos servidores estão passando por dificuldades técnicas, tente novamente em alguns minutos.");

                  }


            }else{
              
              console.log("SEM SUCESSO editarPerfil()");
              console.log(JSON.parse(xhr.responseText));

            }

          }
      };

      /* EXECUTA */
      xhr.send(params);


    }
    
    
    procEditarPerfil(){
        
        $("#btnEditar").html("Processando...");
        $(".form-control").attr("readonly","true");

        // CAPTURAR OS DADOS DO FORMULÁRIO
        var dados = $('#formEditarPerfil').formSerialize();
        var idUsuario = localStorage.getItem("idUsuario");
       
        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();
         
        xhr.open('POST', app.urlApi+'proc-editar-perfil',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+
                     "&token="+app.token+
                     "&"+dados;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("OPERAÇÃO REALIZADA COM SUCESSO");
              console.log(JSON.parse(xhr.responseText));
              aviso("Deu certo!","As informações foram atualizadas.");

            }else{
              
              console.log("SEM SUCESSO procEditarPerfil()");
              console.log(JSON.parse(xhr.responseText));

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

      $("#btnEditar").html("Atualizar");
      $(".form-control").removeAttr("readonly");


    }

/**
*  ------------------------------------------------------------------------------------------------
*
*
*   BUSCAR AS CATEGORIAS DE ATENDIMENTO
*
*
*  ------------------------------------------------------------------------------------------------
*/
categoriasAtendimento(){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'categorias-atendimento',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("BUSCA DAS CATEGORIAS DE ATENDIMENTO");
              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              // SALVAR AS CATEGORIAS NA MEMORIA
              localStorage.setItem("categoiasAtendimento",JSON.stringify(dados));

              $("#listaDeCategorias").html(`

                  ${dados.categorias.map((n) => {

                      if(n.relacao.length==0){

                              return `
                                  
                                 <li>
                                     <a href="javascript:void(0)" onclick="app.novoAtendimentoPasso2(${n.id},'${n.titulo}')" title="${n.titulo}">
                                      ${n.titulo} <img src="assets/images/right.svg" alt="Ver mais">
                                     </a>
                                  </li>

                              `
                       }

                       }).join('')}

              `);
              

            }else{
              
              console.log("SEM SUCESSO categoriasAtendimento()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);


}


/**
*  ------------------------------------------------------------------------------------------------
*
*
*   ENVIAR O ATENDIMENTO
*
*
*  ------------------------------------------------------------------------------------------------
*/
enviarAtendimentoBackup(){

        // CAPTURAR OS DADOS DO FORMULÁRIO
        var dados = $('#formularioNovoAtendimento').formSerialize();

        var idUsuario = localStorage.getItem("idUsuario");
        var nomeCompletoUsuario = localStorage.getItem("nomeCompletoUsuario");
        var emailUsuario = localStorage.getItem("emailUsuario");
        var celularUsuario = localStorage.getItem("celularUsuario");

        var nomeCategoriaAtendimento = localStorage.getItem("nomeCategoriaAtendimento");
        var idCategoriaAtendimento = localStorage.getItem("idCategoriaAtendimento");

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'enviar-atendimento',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+
                     '&nomeCompletoUsuario='+nomeCompletoUsuario+ 
                     '&emailUsuario='+emailUsuario+ 
                     '&celularUsuario='+celularUsuario+ 
                     '&dados='+dados+ 
                     '&nomeCategoriaAtendimento='+nomeCategoriaAtendimento+ 
                     '&idCategoriaAtendimento='+idCategoriaAtendimento+
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO SALVAR ATENDIMENTO");
              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);
              aviso("Deu certo!","Você receberá em breve orçamentos vindos dos nossos parceiros!");
              app.opcoesCarretamentoPerfilCliente();

            }else{
              
              console.log("SEM SUCESSO enviarAtendimento()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");
             
              $("#btnEnviarSolicitacao").html("Enviar informações");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}


// SUBSTITUA A FUNÇÃO ENVIARATENDIMENTO() ANTIGA POR ESTA
// models/Models.js
// models/Models.js - VERSÃO DE DEBUG 2

async enviarAtendimento() {
    console.log('[DEBUG] A função enviarAtendimento() foi iniciada.');

    $("#btnEnviarSolicitacao").html("Processando imagens...");
    $("#btnEnviarSolicitacao").prop('disabled', true);

    const imagensBase64 = [];
    
    console.log('[DEBUG] Verificando se há imagens selecionadas em "window.imagensSelecionadas"...');
    if (window.imagensSelecionadas && window.imagensSelecionadas.length > 0) {
        console.log(`[DEBUG] Encontradas ${window.imagensSelecionadas.length} imagens. Iniciando conversão para Base64.`);
        
        const promessas = window.imagensSelecionadas.map(img => blobURLParaBase64(img.url));
        try {
            const resultados = await Promise.all(promessas);
            console.log('[DEBUG] Todas as imagens foram convertidas (Promise.all resolveu).');
            console.log('[DEBUG] Resultado bruto (primeira imagem, se houver):', resultados[0] ? resultados[0].substring(0, 100) + '...' : 'N/A');

            const resultadosLimpos = resultados.map(res => res.includes(',') ? res.split(',')[1] : res);
            console.log('[DEBUG] Prefixos "data:image/..." foram removidos.');

            imagensBase64.push(...resultadosLimpos);
            console.log(`[DEBUG] Array 'imagensBase64' populado com ${imagensBase64.length} item(ns).`);
            console.log('[DEBUG] Conteúdo da primeira imagem (primeiros 100 caracteres):', imagensBase64[0] ? imagensBase64[0].substring(0, 100) + '...' : 'N/A');

        } catch (error) {
            console.error("[DEBUG] ERRO no bloco try/catch ao converter imagens:", error);
            aviso("Oops! Algo deu errado.", "Não foi possível processar as imagens. Verifique o console para mais detalhes.");
            $("#btnEnviarSolicitacao").html("Enviar informações");
            $("#btnEnviarSolicitacao").prop('disabled', false);
            return;
        }
    } else {
        console.log('[DEBUG] Nenhuma imagem selecionada foi encontrada no array window.imagensSelecionadas.');
    }

    $("#btnEnviarSolicitacao").html("Enviando dados...");

    var dadosFormulario = $('#formularioNovoAtendimento').formSerialize();
    var idUsuario = localStorage.getItem("idUsuario");
    var nomeCompletoUsuario = localStorage.getItem("nomeCompletoUsuario");
    var emailUsuario = localStorage.getItem("emailUsuario");
    var celularUsuario = localStorage.getItem("celularUsuario");
    var nomeCategoriaAtendimento = localStorage.getItem("nomeCategoriaAtendimento");
    var idCategoriaAtendimento = localStorage.getItem("idCategoriaAtendimento");

    let xhr = new XMLHttpRequest();
    xhr.open('POST', app.urlApi + 'enviar-atendimento', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    var params = 'idUsuario=' + idUsuario +
        '&nomeCompletoUsuario=' + encodeURIComponent(nomeCompletoUsuario) +
        '&emailUsuario=' + encodeURIComponent(emailUsuario) +
        '&celularUsuario=' + encodeURIComponent(celularUsuario) +
        '&nomeCategoriaAtendimento=' + encodeURIComponent(nomeCategoriaAtendimento) +
        '&idCategoriaAtendimento=' + idCategoriaAtendimento +
        "&token=" + app.token +
        "&" + dadosFormulario +
        "&imagens_base64=" + encodeURIComponent(JSON.stringify(imagensBase64));

    console.log('[DEBUG] Parâmetros FINAIS que serão enviados para a API (início):');
    console.log(params.substring(0, 400) + (params.length > 400 ? '...' : ''));

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            $("#btnEnviarSolicitacao").html("Enviar informações");
            $("#btnEnviarSolicitacao").prop('disabled', false);

            if (xhr.status == 200) {
                console.log("[DEBUG] SUCESSO: Resposta do servidor recebida.", JSON.parse(xhr.responseText));
                limparTodasImagens();
                aviso("Deu certo!", "Você receberá em breve orçamentos vindos dos nossos parceiros!");
                app.opcoesCarretamentoPerfilCliente();
            } else {
                console.error("[DEBUG] FALHA: A requisição para a API falhou. Status: " + xhr.status, xhr.responseText);
                aviso("Oops! Algo deu errado.", "Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");
            }
        }
    };
    
    xhr.send(params);
}

/**
*  ------------------------------------------------------------------------------------------------
*
*
*   ORÇAMENTOS DISPONÍVEIS DENTRO DO APP (PROFISSIONAIS)
*
*
*  ------------------------------------------------------------------------------------------------
*/
orcamentosDisponiveis(){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'orcamentos-abertos',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ATENDIMENTOS EM ABERTO");
              console.log(xhr.responseText);
              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              localStorage.setItem("saldoPrestadorServico",dados.saldo_usuario);

              $("#saldoAtualUsuarioHeader").html(dados.saldo_usuario);

              /*
              NESSE PROJETO NÂO TERÁ MAIS USO DE MOEDAS, APENAS ORÇAMENTOS DIRETOS
              if(dados.saldo_usuario==""||dados.saldo_usuario==0||dados.saldo_usuario<0){

                  confirmacao(`Você está sem ${app.nomeMoedaPlural}`,`Para desbloquear e visualizar os orçamentos, você precisa ter comprado algum pacote de ${app.nomeMoedaPlural}. Deseja fazer isso agora?`,"app.comprarChaves()","Comprar agora");

              }
              */

              

              console.log("COMECANDO A IMPRIMIR OS ORCAMENTOS NA TELA:");

              localStorage.setItem("orcamentosHeranca",JSON.stringify(dados.orcamentos));

              $("#listaDeOrcamentosDISABLED").html(`

                  ${dados.orcamentos.map((n) => {

                          // ORCAMENTO SÓ FICA DISPONIVEL SE NAO TIVER SIDO DESBLOQUEADO AINDA
                          if(n.desblock=="nao" && 9 == 3){ // Vamos desabilitar por enquanto o controle de só exibir os serviços ainda não desbloqueados

                              return `
                                  
                                 <!-- CAIXA DESTAQUE SERVIÇOS -->
                                 <div id="anuncio${n.id}" class="caixa-destaque-servicos" data-categoria="${n.nome_categoria}">
                                   
                                     <div class="header-autor">

                                         <h3>
                                            <img src="assets/images/perfil.png" style="opacity:0.5;border-radius: 100%;" alt="Foto Perfil" />
                                            ${n.nome_do_cliente}
                                            <small>
                                               <p>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                               </p>
                                               Área de atendimento: ${n.regiao}
                                            </small>
                                         </h3>

                                     </div>

                                     <br clear="both">

                                     <div class="body-autor">
                                          <h4>${n.titulo_origin}</h4>
                                          <p>${n.descricao}</p>
                                          <p><b>Requisitos:</b> ${n.requisitos}</p>
                                     </div>

                                     <div class="footer-autor">
                                          <a href="javascript:void(0)" onclick="app.desbloqAnuncio(${n.id},${n.valor_chaves_para_desbloqueio},${n.nome_categoria});" title="Enviar orçamento" class="btn btn-primary">
                                              Enviar Orçamento
                                          </a>
                                     </div>

                                 </div>
                                 <!-- CAIXA DESTAQUE SERVIÇOS -->


                              `

                          }


                       }).join('')}

              `);

              // LOOP CATEGORIAS
              var categs = JSON.parse(localStorage.getItem("herancaCategorias"));
              
              $("#loopDeCategoriasJobs").append(`

                      ${categs.map((c) => {

                          return `

                              <div 
                                  class="novo-listing-dashboard-job-option" 
                                  data-id="${c.id}" 
                                  data-nome="${c.titulo}" 
                                  onclick="app.listagemNovaBlocada();">
                                  ${c.titulo}
                              </div>
                          
                          `;

                      }).join('')}  
                
              `);

              // INSERIR OS ORÇAMENTOS
              $("#listaDeOrcamentos").html(`

                  ${dados.orcamentos.map((n) => {

                          // ORCAMENTO SÓ FICA DISPONIVEL SE NAO TIVER SIDO DESBLOQUEADO AINDA
                          if(n.desblock=="nao"){

                              return `
                                  
                                      <!-- ORÇAMENTO -->
                                      <div 
                                        class="novo-listing-dashboard-job-card" 
                                        id="anuncio${n.id}" 
                                        data-categoria="${n.nome_categoria}"
                                      >
                                             <h3 class="novo-listing-dashboard-job-title">
                                                ${n.titulo_origin}
                                             </h3>
                                             <div class="novo-listing-dashboard-job-details">
                                                <!--
                                                <div class="novo-listing-dashboard-job-location">
                                                   <i class="fa-solid fa-location-dot novo-listing-dashboard-detail-icon"></i>
                                                </div>
                                                -->
                                                <div class="novo-listing-dashboard-job-type">
                                                   <i class="fa-regular fa-clock novo-listing-dashboard-detail-icon"></i>
                                                   ${n.titulo_origin}
                                                </div>
                                             </div>
                                             <p class="novo-listing-dashboard-job-description">
                                                ${n.descricao}<br>
                                                <b>Cliente:</b> ${n.nome_do_cliente}<br>
                                                <b>Requisitos:</b> ${n.requisitos}<br>
                                                <b>Área de atendimento:</b> ${n.regiao}
                                             </p>
                                             <button 
                                               class="novo-listing-dashboard-apply-button"
                                               onclick="app.desbloqAnuncio(${n.id},${n.valor_chaves_para_desbloqueio},${n.nome_categoria});" 
                                             >
                                                 Enviar Orçamento
                                              </button>
                                      </div>
                                      <!-- ORÇAMENTO -->

                              `
                          }

                       }).join('')}

              `);


              // INSERIR OS ORÇAMENTOS COM ORDEM ALEATÓRIA
              $("#listaDeOrcamentosRecentes").html(`
                  ${dados.orcamentos
                    // Primeiro, cria uma cópia do array para não modificar o original
                    .slice()
                    // Depois, embaralha o array usando o algoritmo Fisher-Yates
                    .sort(() => Math.random() - 0.5)
                    .map((n) => {
                      // ORCAMENTO SÓ FICA DISPONIVEL SE NAO TIVER SIDO DESBLOQUEADO AINDA
                      if(n.desblock=="nao"){
                        return `
                          <!-- ORÇAMENTO -->
                          <div 
                            class="novo-listing-dashboard-job-card" 
                            id="anuncio${n.id}" 
                            data-categoria="${n.nome_categoria}"
                          >
                            <h3 class="novo-listing-dashboard-job-title">
                              ${n.titulo_origin}
                            </h3>
                            <div class="novo-listing-dashboard-job-details">
                              <!--
                              <div class="novo-listing-dashboard-job-location">
                                <i class="fa-solid fa-location-dot novo-listing-dashboard-detail-icon"></i>
                                ${n.nome_do_cliente}
                              </div>
                              -->
                              <div class="novo-listing-dashboard-job-type">
                                <i class="fa-regular fa-clock novo-listing-dashboard-detail-icon"></i>
                                ${n.titulo_origin}
                              </div>
                            </div>
                            <p class="novo-listing-dashboard-job-description">
                              ${n.descricao}<br>
                              <b>Cliente:</b> ${n.nome_do_cliente}<br>
                              <b>Requisitos:</b> ${n.requisitos}<br>
                              <b>Área de atendimento:</b> ${n.regiao}
                            </p>
                            <button 
                              class="novo-listing-dashboard-apply-button"
                              onclick="app.desbloqAnuncio(${n.id},${n.valor_chaves_para_desbloqueio},'${n.nome_categoria}');" 
                            >
                              Enviar Orçamento
                            </button>
                          </div>
                          <!-- ORÇAMENTO -->
                        `
                      }
                      return ''; // Retorna string vazia para casos onde desblock != "nao"
                    })
                    .join('')}
              `);


              // INIT CARROSSEL
              $('.novo-listing-dashboard-best-matches-carousel').owlCarousel({
                  loop: true,
                  center: false,
                  margin: 12,
                  nav: false,
                  dots: false,
                  stagePadding: 0,
                  responsive: {
                      0: {
                          items: 1.5
                      }
                  }
              });
              
              // Initialize Categories carousel
              $('.novo-listing-dashboard-categories-carousel').owlCarousel({
                  loop: true,
                  center: false,
                  margin: 12,
                  nav: false,
                  dots: false,
                  stagePadding: 0,
                  responsive: {
                      0: {
                          items: 1.5
                      }
                  }
              });
              
              // Job type selection
              $('.novo-listing-dashboard-job-option').on('click', function() {
                  $('.novo-listing-dashboard-job-option').removeClass('active');
                  $(this).addClass('active');
              });
              

            }else{
              
              console.log("SEM SUCESSO orcamentosDisponiveis()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

      // VERIFICAR SE O PROFISSIONAL JÁ ESTÁ ATIVADO
      if(localStorage.getItem("profissionalStatus")!="aprovado"){
        app.models.verificarAtivacaoProfissional();  
      }
  
}


// CARREGAR OS ORCAMENTOS QUE O PROFISSIONAL JÁ TEM DESBLOQUEADO
orcamentosDisponiveisDesbloqueados(){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'orcamentos-abertos',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ATENDIMENTOS DESBLOQUEADOS PELO PROFISSIONAL");
              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              localStorage.setItem("saldoPrestadorServico",dados.saldo_usuario);

              $("#saldoAtualUsuarioHeader").html(dados.saldo_usuario);

              console.log("COMECANDO A IMPRIMIR OS ORCAMENTOS NA TELA:");

              $("#listaDeOrcamentos").html(`

                  ${dados.orcamentos.map((n) => {

                          // ORCAMENTO SÓ FICA DISPONIVEL SE NAO TIVER SIDO DESBLOQUEADO AINDA
                          if(n.desblock=="sim"){

                              return `
                                  
                                 <!-- CAIXA DESTAQUE SERVIÇOS -->
                                 <div id="anuncio${n.id}" class="caixa-destaque-servicos">
                                   
                                     <div class="header-autor">

                                         <h3>
                                            <img src="assets/images/perfil.png" style="opacity:0.5;border-radius: 100%;" alt="Foto Perfil" />
                                            ${n.nome_do_cliente}
                                            <small>
                                               <p>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                                  <i class="fa fa-star" aria-hidden="true"></i>
                                               </p>
                                               Área de atendimento: ${n.regiao}
                                            </small>
                                         </h3>

                                     </div>

                                     <br clear="both">

                                     <div class="body-autor">
                                          <h4>${n.titulo_origin}</h4>
                                          <p>${n.descricao}</p>
                                          <p><b>Requisitos:</b> ${n.requisitos}</p>
                                          <p>
                                             Você <b>visualizou</b> esse orçamento!
                                          </p>
                                     </div>

                                     <div class="footer-autor">
                                          <a href="javascript:void(0)" onclick='app.views.viewDetalheAnuncio(${n.id},1)' title="VER DETALHES" style="text-align:center;" class="btn btn-primary">
                                              VER DETALHES
                                          </a>
                                     </div>

                                 </div>
                                 <!-- CAIXA DESTAQUE SERVIÇOS -->


                              `

                          }


                       }).join('')}

              `);

              

            }else{
              
              console.log("SEM SUCESSO orcamentosDisponiveisDesbloqueados()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}



/**
*  ------------------------------------------------------------------------------------------------
*
*
*   DETALHE DE UM ATENDIMENTO EM ESPECIFICO
*
*
*  ------------------------------------------------------------------------------------------------
*/
carregarDetalheAtendimento(idAnuncio,acao){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
        var nomeCompletoUsuario = localStorage.getItem("nomeCompletoUsuario");
         
        xhr.open('POST', app.urlApi+'detalhe-atendimento',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token+
                     "&idanuncio="+idAnuncio+
                     "&nomeCompletoUsuario="+nomeCompletoUsuario+
                     "&acao="+acao;

        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DETALHE DO ATENDIMENTO:");
              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              $("#nomeCliente").html(`${dados.orcamentos[0].nome_do_cliente}`);
              $("#subTituloAnuncio").html(`${dados.orcamentos[0].quando}`);
              $("#descAnuncio").html(`Descrição: ${dados.orcamentos[0].descricao}`);
              $("#descAnuncio").append(`<br>Orçamento ideal: ${dados.orcamentos[0].orcamento_ideal ? dados.orcamentos[0].orcamento_ideal : 'Não informado'}`);
              $("#localAnuncio").html(`Local do atendimento: ${dados.orcamentos[0].regiao}`);
              $("#requisitosAnuncio").html(`Requisitos: ${dados.orcamentos[0].requisitos}`);
              $("#dataAnuncio").html(`${dados.orcamentos[0].data_criacao}`);
              $("#formaContaAnuncio").html(`Forma de contato: ${dados.orcamentos[0].forma_de_contato}`);
              $("#contatoTelefone").html(`${dados.orcamentos[0].celular}`);
              $("#contatoEmail").html(`${dados.orcamentos[0].e_mail}`);

              $(".body-autor h4").html(`${dados.orcamentos[0].titulo_origin}`);

              let celularLimpo = dados.orcamentos[0].celular.replace(/\D/g, '');

              $("#actionLigacao").attr("href",`tel:${celularLimpo}`);
              $("#actionWhatsApp").attr("href",`https://api.whatsapp.com/send?l=pt_BR&phone=55${celularLimpo}`);

              /*
              const tituloOrcamento = dados.orcamentos[0].titulo_origin;
              const btnChat = document.querySelector('.btn-chat-duvidas');
              if(btnChat){
                  // Passa o elemento 'this' e o ID do anúncio
                  btnChat.setAttribute('onclick', `app.iniciarChatOrcamento(this, ${idAnuncio})`);
                  btnChat.setAttribute('data-titulo-orcamento', tituloOrcamento);
              }
              */
                
                // Renderiza as imagens do orçamento
                const imagens = dados.orcamentos[0].imagens;
                const gridContainer = document.getElementById('orcamentoImagensGrid');
                
                if (gridContainer && imagens && imagens.length > 0) {
                    let gridHtml = '<h4>Imagens do Orçamento</h4><div class="image-grid">';
                    imagens.forEach(item => {
                        // O sub-campo 'arquivo_de_midia' retorna a URL da imagem
                        if(item.arquivo_de_midia) {
                            gridHtml += `
                                <div class="image-grid-item">
                                    <a href="javascript:void(0)" onclick="abrirLightbox('${item.arquivo_de_midia}')">
                                        <img src="${item.arquivo_de_midia}" alt="Imagem do orçamento">
                                    </a>
                                </div>
                            `;
                        }
                    });
                    gridHtml += '</div>';
                    gridContainer.innerHTML = gridHtml;
                } else if (gridContainer) {
                    gridContainer.innerHTML = ''; // Limpa o container se não houver imagens
                }

                const idProfissionalLogado = localStorage.getItem("idUsuario");
                const historico = dados.orcamentos[0].historico;
                const propostasContainer = document.getElementById('minhas-propostas-container');
                const btnEnviarProposta = document.querySelector('.actions-contato a[onclick^="capProposta"]');

                // Filtra as propostas feitas pelo profissional logado
                const minhasPropostas = historico.filter(item => item.id_profissional == idProfissionalLogado);

                if (propostasContainer && minhasPropostas.length > 0) {
                    let propostasHtml = '';
                    
                    minhasPropostas.forEach(proposta => {

                      // PROPOSTA NÃO APROVADA (AINDA)
                      if(proposta.valor_enviado_profissional && proposta.status_orcamento != 'Aprovado' &&
                        proposta.valor_enviado_profissional && proposta.status_orcamento != 'Cancelado'
                      ){
                          propostasHtml += `
                              <div class="proposta-card">
                                  <div class="proposta-valor">
                                      <span>Sua proposta:</span>
                                      <strong>R$ ${proposta.valor_enviado_profissional}</strong>
                                  </div>
                                  <div class="proposta-actions">
                                      <button onclick="capProposta(${idAnuncio})" class="btn btn-sm btn-primary">Atualizar</button>
                                      <button onclick="confirmacao('Cancelar Proposta?', 'Tem certeza que deseja remover sua proposta para este orçamento?', 'confirmarCancelamentoProposta(${idAnuncio})', 'Sim, Cancelar')" class="btn btn-sm btn-default">Cancelar</button>
                                  </div>
                              </div>
                          `;
                        }

                      // PROPOSTA APROVADA
                      if(proposta.valor_enviado_profissional && proposta.status_orcamento == 'Aprovado'){
                          propostasHtml += `
                              <div class="proposta-card">
                                  <div class="proposta-valor">
                                      <span>Sua proposta:</span>
                                      <strong>R$ ${proposta.valor_enviado_profissional}</strong>
                                  </div>
                                  <div class="proposta-actions">
                                      <span class="super-aprovada">Proposta Aprovada</span> 
                                      <small class="super-aprovada">projeto em andamento</small>  
                                  </div>
                              </div>
                          `;
                        }


                    });

                    propostasContainer.innerHTML = propostasHtml;

                    // Esconde o botão original "Enviar proposta"
                    //if(btnEnviarProposta) btnEnviarProposta.parentElement.style.display = 'none';

                } else {
                    // Garante que o container esteja vazio e o botão visível se não houver proposta
                    if(propostasContainer) propostasContainer.innerHTML = '';
                    if(btnEnviarProposta) btnEnviarProposta.parentElement.style.display = 'block';
                }


            }else{
              
              console.log("SEM SUCESSO carregarDetalheAtendimento()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}




gerarCobrancaPixProposta(idOrcamento, idProfissional, valorTotal, cpfCliente, callback) {
    const idUsuario = localStorage.getItem("idUsuario");
    const nome = localStorage.getItem("nomeCompletoUsuario");
    const email = localStorage.getItem("emailUsuario");
    const celular = localStorage.getItem("celularUsuario");

    let xhr = new XMLHttpRequest();
    xhr.open('POST', app.urlApi + 'pagar-proposta-pix', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    const params = `token=${app.token}&idOrcamento=${idOrcamento}&idProfissional=${idProfissional}&valorTotal=${valorTotal}&idCliente=${idUsuario}&nomeCliente=${encodeURIComponent(nome)}&emailCliente=${encodeURIComponent(email)}&celularCliente=${encodeURIComponent(celular)}&cpfCliente=${encodeURIComponent(cpfCliente)}`;

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
            try {
                const response = JSON.parse(xhr.responseText);

                // --- CORREÇÃO NA VERIFICAÇÃO ---
                // Verifica se a requisição HTTP foi OK (status 200),
                // se a API WordPress retornou 'success: true',
                // e se o objeto 'data' existe e contém o 'payload' do PIX.
                if (xhr.status == 200 && response.success === true && response.data && response.data.payload) {
                    // Chama o callback com sucesso, passando o objeto 'data' que contém payload, encodedImage, etc.
                    callback(true, response.data);
                // --- FIM DA CORREÇÃO ---

                } else {
                    // Se a condição acima falhar, trata como erro.
                    // Tenta pegar a mensagem de erro específica da API (response.data.erro ou response.erro)
                    // ou usa uma mensagem genérica.
                    const erroMsg = (response.data && response.data.erro) ? response.data.erro : (response.erro || 'Não foi possível gerar o PIX. Verifique os dados e tente novamente.');
                    console.error("Erro detalhado da API PIX:", response); // Loga a resposta completa para debug
                    callback(false, { erro: erroMsg, response: response }); // Retorna erro
                }
            } catch (e) {
                 console.error("Erro ao processar JSON da API PIX:", e, xhr.responseText);
                callback(false, { erro: "Erro ao processar resposta do servidor PIX.", status: xhr.status, responseText: xhr.responseText });
            }
        }
    };
    xhr.send(params);
}



gerarCobrancaCartaoProposta(idOrcamento, idProfissional, valorTotal, dadosCartao, callback) {
    const idUsuario = localStorage.getItem("idUsuario");
    const nome = localStorage.getItem("nomeCompletoUsuario");
    const email = localStorage.getItem("emailUsuario");
    const celular = localStorage.getItem("celularUsuario");

     // Validade MM/AA -> MM e AA
    let mesValidade = '';
    let anoValidade = '';
    if (dadosCartao.validade && dadosCartao.validade.includes('/')) {
        const partesValidade = dadosCartao.validade.split('/');
        mesValidade = partesValidade[0];
        anoValidade = partesValidade[1]; // Mantém como AA (ex: 25)
    }


    let xhr = new XMLHttpRequest();
    xhr.open('POST', app.urlApi + 'pagar-proposta-cartao', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Monta os parâmetros, incluindo dados do cliente e do cartão
    const params = `token=${app.token}&idOrcamento=${idOrcamento}&idProfissional=${idProfissional}&valorTotal=${valorTotal}`
        + `&idCliente=${idUsuario}&nomeCliente=${encodeURIComponent(nome)}&emailCliente=${encodeURIComponent(email)}&celularCliente=${encodeURIComponent(celular)}&cpfCliente=${encodeURIComponent(dadosCartao.cpf)}`
        + `&cartaoNumero=${encodeURIComponent(dadosCartao.numero.replace(/\D/g,''))}&cartaoNome=${encodeURIComponent(dadosCartao.nome)}&cartaoMes=${mesValidade}&cartaoAno=${anoValidade}&cartaoCvv=${encodeURIComponent(dadosCartao.cvv)}&cartaoParcelas=${dadosCartao.parcelas}`;

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4) {
             try {
                const response = JSON.parse(xhr.responseText);
                 if (xhr.status == 200 && response.sucesso == "200") {
                    callback(true, response); // Retorna sucesso e dados da cobrança
                } else {
                    callback(false, response); // Retorna erro
                }
            } catch (e) {
                callback(false, { erro: "Erro ao processar resposta do servidor Cartão.", status: xhr.status });
            }
        }
    };
    xhr.send(params);
}



  atualizarStatusPropostaAPI(idOrcamento, idProfissional, novoStatus, callback) {

      let params = `id_orcamento=${idOrcamento}&id_profissional=${idProfissional}&novo_status=${encodeURIComponent(novoStatus)}&token=${app.token}`;

      let xhr = new XMLHttpRequest();
      xhr.open('POST', app.urlApi + 'atualizar-status-proposta', true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

      xhr.onreadystatechange = () => {
          if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                  const response = JSON.parse(xhr.responseText);
                  if (response.sucesso == "200") {
                      callback(true, response); // Sucesso
                  } else {
                      callback(false, response); // Erro da API
                  }
              } else {
                  callback(false, { erro: "Erro de conexão com o servidor." }); // Erro de conexão
              }
          }
      };
      xhr.send(params);
      
  }


  getSaldoExtrato(callback) {
        const idUsuario = localStorage.getItem("idUsuario");
        // Verifica se o usuário está logado
        if (!idUsuario) {
            console.error("getSaldoExtrato: idUsuario não encontrado no localStorage.");
            return callback(false, { erro: "Usuário não autenticado." });
        }

        let xhr = new XMLHttpRequest();
        xhr.open('POST', app.urlApi + 'get-saldo-extrato-profissional', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        const params = `token=${app.token}&idUsuario=${idUsuario}`;

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    // Verifica status HTTP e a flag 'sucesso' da API
                    if (xhr.status == 200 && response.sucesso == "200") {
                        // Retorna sucesso com os dados de saldo disponível, bloqueado e extrato
                        callback(true, {
                            saldo_disponivel: response.saldo_disponivel || '0,00',
                            saldo_bloqueado: response.saldo_bloqueado || '0,00',
                            extrato: response.extrato || [] // Garante que extrato seja array
                         });
                    } else {
                        // Retorna erro com a mensagem da API ou padrão
                         console.error("Erro da API getSaldoExtrato:", response);
                        callback(false, { erro: response.erro || "Falha ao buscar saldo/extrato.", response: response });
                    }
                } catch (e) {
                     // Erro ao decodificar JSON
                     console.error("Erro ao processar JSON em getSaldoExtrato:", e, xhr.responseText);
                    callback(false, { erro: "Erro ao processar resposta do servidor.", status: xhr.status, responseText: xhr.responseText });
                }
            }
        };
        xhr.send(params);
    }



    submitSaque(valorSaque, pixType, pixKey, cpfTitular, callback) {
        const idUsuario = localStorage.getItem("idUsuario");
        // Verifica se o usuário está logado
        if (!idUsuario) {
            console.error("submitSaque: idUsuario não encontrado no localStorage.");
            return callback(false, { erro: "Usuário não autenticado." });
        }

        let xhr = new XMLHttpRequest();
        xhr.open('POST', app.urlApi + 'solicitar-saque', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        // Formata o valor para enviar com vírgula decimal, como esperado pelo backend PHP
        // O backend converterá para float com ponto
        const valorFormatadoParaApi = valorSaque.toFixed(2).replace('.', ',');

        // Monta os parâmetros para a requisição POST
        const params = `token=${app.token}&idUsuario=${idUsuario}`
                     + `&valorSaque=${valorFormatadoParaApi}` // Envia formatado com vírgula
                     + `&pixType=${encodeURIComponent(pixType)}`
                     + `&pixKey=${encodeURIComponent(pixKey)}`
                     + `&cpfTitular=${encodeURIComponent(cpfTitular)}`; // Envia CPF (pode estar com máscara)

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    // Verifica status HTTP e a flag 'sucesso' da API
                    if (xhr.status == 200 && response.sucesso == "200") {
                        // Retorna sucesso com a mensagem da API
                        callback(true, { mensagem: response.mensagem });
                    } else {
                        // Retorna erro com a mensagem da API ou padrão
                         console.error("Erro da API submitSaque:", response);
                        callback(false, { erro: response.erro || "Falha ao enviar solicitação.", response: response });
                    }
                } catch (e) {
                     // Erro ao decodificar JSON
                     console.error("Erro ao processar JSON em submitSaque:", e, xhr.responseText);
                    callback(false, { erro: "Erro ao processar resposta do servidor.", status: xhr.status, responseText: xhr.responseText });
                }
            }
        };
        xhr.send(params);
    }


    concluirAtendimentoAPI(idOrcamento, idProfissional, callback) {
        const idUsuarioCliente = localStorage.getItem("idUsuario"); // Pega o ID do cliente logado
        if (!idUsuarioCliente) {
             console.error("concluirAtendimentoAPI: idUsuarioCliente não encontrado no localStorage.");
            return callback(false, { erro: "Usuário cliente não autenticado." });
        }

        let xhr = new XMLHttpRequest();
        xhr.open('POST', app.urlApi + 'concluir-atendimento', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        const params = `token=${app.token}&idUsuarioCliente=${idUsuarioCliente}&idOrcamento=${idOrcamento}&idProfissional=${idProfissional}`;

        xhr.onreadystatechange = () => {
             if (xhr.readyState == 4) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (xhr.status == 200 && response.sucesso == "200") {
                        callback(true, response); // Retorna sucesso com a mensagem
                    } else {
                        console.error("Erro da API concluirAtendimento:", response);
                        callback(false, { erro: response.erro || "Falha ao concluir atendimento.", response: response });
                    }
                } catch (e) {
                    console.error("Erro ao processar JSON em concluirAtendimentoAPI:", e, xhr.responseText);
                    callback(false, { erro: "Erro ao processar resposta do servidor.", status: xhr.status, responseText: xhr.responseText });
                }
            }
        };
        xhr.send(params);
    }
/**
*  ------------------------------------------------------------------------------------------------
*
*
*   PAGAMENTO
*
*
*  ------------------------------------------------------------------------------------------------
*/
pacoteChaves(){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");

        let temp = 0;
        let resultado = 0;
        var checked = "checked";

        xhr.open('POST', app.urlApi+'pacotes-chaves',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("PACOTES DISPONÍVEIS PARA COMPRA");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("COMECANDO A IMPRIMIR OS PACOTES NA TELA:");

              $("#appendPacotes").html(`

                  ${dados.pacotes.map((n) => {

                              temp++;
                              if(temp>1){ checked = ""; }

                              resultado = n.valor_blr / 4;

                              return `
                                  
                                 <!-- PACOTE -->
                                 <div class="form-check">
                                    <input class="form-check-input" type="radio" name="pacote" id="pacote${temp}" value="${n.qtd_chaves}" ${checked}>
                                    <label class="form-check-label" for="pacote${temp}">
                                      <img src="assets/images/simbolo.svg" alt="Comprar ${n.qtd_chaves} Chaves" />  
                                      ${n.qtd_chaves} ${app.nomeMoedaPlural}
                                      <small>À vista por R$ ${n.valor_blr.replace(".",",")}<br>Validade de ${n.validade_dias} dias</small>
                                      <span>
                                        <d>ou em até 4X de</d>
                                        R$ ${resultado.toFixed(2).replace(".",",")}
                                      </span>
                                    </label>
                                 </div>
                                 <!-- PACOTE -->

                              `

                       }).join('')}

              `);
              

            }else{
              
              console.log("SEM SUCESSO pacoteChaves()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}


selecaoPacoteDeChaves(pacoteEscolhido){


  // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");

        let temp = 0;
        let resultado = 0;
        var checked = "checked";

        xhr.open('POST', app.urlApi+'pacotes-chaves',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("BUSCANDO PACOTES DISPONÍVEIS PARA COMPRA");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("COMECANDO A IMPRIMIR OS PACOTES NA TELA:");

              app.views.paginaDeCmopra();

              for(let i = 0;i<dados.pacotes.length;i++){

                    if(pacoteEscolhido==dados.pacotes[i].qtd_chaves){

                        // SALVAR AS OPÇÕES ESCOLHIDAS PELO USUÁRIO 
                        localStorage.setItem("valorPagamento",dados.pacotes[i].valor_blr.replace(".",""));
                        localStorage.setItem("valorPagamentoOriginal",dados.pacotes[i].valor_blr);
                        localStorage.setItem("qtd_chaves",dados.pacotes[i].qtd_chaves);

                        var resultado = dados.pacotes[i].valor_blr / 4;
                        resultado = resultado.toFixed(2).replace(".",",");

                        $("#pacoteEscolhido").html(`

                                 <!-- PACOTE ESCOLHIDO -->
                                 <div class="form-check" style="margin-top: 23px;margin-bottom: 56px;">
                                    <input class="form-check-input" type="radio" name="pacote" id="pacote1" value="${pacoteEscolhido}" checked>
                                    <label class="form-check-label" for="pacote1">
                                      <img src="assets/images/simbolo.svg" alt="Comprar ${pacoteEscolhido} ${app.nomeMoedaPlural}" />  
                                      ${pacoteEscolhido} ${app.nomeMoedaPlural} 
                                      <small>À vista por R$ ${dados.pacotes[i].valor_blr.replace(".",",")}</small>
                                      <span>
                                        <d>ou em até 4X de</d>
                                        R$ ${resultado}
                                      </span>
                                    </label>
                                 </div>
                                 <!-- PACOTE -->

                        `);


                        window.setTimeout(function(){
                            console.log("Iniciando teste de parcelas");
                            console.log(dados.pacotes);
                            // CARREGANDO PARCELAS
                            var j = 1;

                            for(let k = 0;k<4;k++){

                                var divisao = dados.pacotes[i].valor_blr / j;
                                divisao = divisao.toFixed(2).replace(".",",");

                                console.log("DIVISAO: ");
                                console.log(divisao);

                                if(parseInt(divisao)>=5){

                                  console.log("IMPRMINDO VALORES...");

                                  $("#pagtoCCParcelas").append(`
                                      <option value="${j}">${j}x de R$ ${divisao}</option>
                                  `);

                                }

                                j++;

                            }// FINAL DO FOR DE PARCELAS

                            // CONTROLE DO VALOR MINIMO DE PARCELAS
                            if(parseInt(dados.pacotes[i].valor_blr)<=5){

                              $("#pagtoCCParcelas").append(`
                                      <option value="1">1x de R$ ${dados.pacotes[i].valor_blr}</option>
                                  `);

                            }

                          },3000);


                    }

              } // FINAL DO FOR
              

            }else{
              
              console.log("SEM SUCESSO selecaoPacoteDeChaves()");
              console.log(JSON.parse(xhr.responseText));
              
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");
              
              $("#btnComprarSelecionado").html("COMPRAR SELECIONADO");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}




payBoleto(){
      
        // CAPTURAR OS DADOS DO FORMULÁRIO
        var dados = $('#formPayBoleto').formSerialize();

        var idUsuario = localStorage.getItem("idUsuario");

        //var dadosUsuario = JSON.parse(localStorage.getItem("dadosUsuario"));

        var nome = localStorage.getItem("nomeCompletoUsuario");
        var celular = localStorage.getItem("celularUsuario");
        var email = localStorage.getItem("emailUsuario");
        var valorPagamento = localStorage.getItem("valorPagamento");
        var valorPagamentoOriginal = localStorage.getItem("valorPagamentoOriginal");
        var qtd_chaves = localStorage.getItem("qtd_chaves");

        console.log(nome);
        console.log(celular);
        console.log(email);
       
        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();
         
        xhr.open('POST', app.urlApi+'payboleto',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+
                     "&token="+app.token+
                     "&tokenSms="+app.tokenSms+
                     "&"+dados+
                     "&nome="+nome+
                     "&celular="+celular+
                     "&email="+email+
                     "&valorPagamento="+valorPagamento+
                     "&valorPagamentoOriginal="+valorPagamentoOriginal+
                     "&qtd_chaves="+qtd_chaves;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO PAGAMENTO PIX: ");
              //console.log(xhr.responseText);
              console.log(JSON.parse(xhr.responseText));

              var dados = JSON.parse(xhr.responseText);

              if(dados.sucesso==200){
                  app.views.dadosBoleto(dados.dados_boleto);

                  // SALVAR AS INFORMAÇÕES DA COMPRA DO USUÁRIO
                  app.models.salvarDadosCompraUsuario(dados.dados_boleto.customer,dados.dados_boleto.id);
                  
              }else{
                  aviso("Oops! Algo deu errado","Tente novamente dentro de alguns minutos. Essa é a mensagem de erro: "+dados.description);
                  app.viewPrincipalProfissional();
              }

              

            }else{
              
              console.log("SEM SUCESSO payBoleto()");
              console.log(xhr.responseText);

              aviso("Oops! Algo deu errado","Tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

      $("#btnPayBoleto").html("PAGAR COM BOLETO");



}




payCartaoDeCredito(){

        // CAPTURAR OS DADOS DO FORMULÁRIO
        var dados = $('#formPayBoleto').formSerialize();

        var idUsuario = localStorage.getItem("idUsuario");

        //var dadosUsuario = JSON.parse(localStorage.getItem("dadosUsuario"));

        var nome = localStorage.getItem("nomeCompletoUsuario");
        var celular = localStorage.getItem("celularUsuario");
        var email = localStorage.getItem("emailUsuario");

        var pagtoCCNumero    = $("#pagtoCCNumero").val();
        pagtoCCNumero = pagtoCCNumero.replace("-","");

        var pagtoCCNome      = $("#pagtoCCNome").val();
        var pagtoCCNumeroCPF = $("#pagtoCCNumeroCPF").val();
        
        var pagtoCCValidade  = $("#pagtoCCValidade").val();
        pagtoCCValidade = pagtoCCValidade.split("/");

        var mesValidade = pagtoCCValidade[0];
        var anoValidade = pagtoCCValidade[1];

        var pagtoCCCvv       = $("#pagtoCCCvv").val();

        var valorPagamento = localStorage.getItem("valorPagamento");
        var valorPagamentoOriginal = localStorage.getItem("valorPagamentoOriginal");
        var qtd_chaves = localStorage.getItem("qtd_chaves");

        var pagtoCCParcelas = $("#pagtoCCParcelas").val();


        console.log(nome);
        console.log(celular);
        console.log(email);
        console.log(pagtoCCNumero);
        console.log(mesValidade);
        console.log(anoValidade);
        console.log(pagtoCCParcelas);
        console.log(app.tokenSms);

        
       
        // CONFIGURAÇÕES AJAX VANILLA
        
        let xhr = new XMLHttpRequest();
         
        xhr.open('POST', app.urlApi+'cartaodecredito',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+
                     "&token="+app.token+
                     "&tokenSms="+app.tokenSms+
                     "&"+dados+
                     "&nome="+nome+
                     "&celular="+celular+
                     "&email="+email+
                     "&pagtoCCNumero="+pagtoCCNumero+
                     "&pagtoCCNome="+pagtoCCNome+
                     "&pagtoCCNumeroCPF="+pagtoCCNumeroCPF+
                     "&pagtoCCValidade="+pagtoCCValidade+
                     "&mesValidade="+mesValidade+
                     "&anoValidade="+anoValidade+
                     "&pagtoCCCvv="+pagtoCCCvv+
                     "&valorPagamento="+valorPagamento+
                     "&valorPagamentoOriginal="+valorPagamentoOriginal+
                     "&qtd_chaves="+qtd_chaves+
                     "&pagtoCCParcelas="+pagtoCCParcelas;

        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO PAGAMENTO CARTAO");
              //console.log(xhr.responseText);
              console.log(JSON.parse(xhr.responseText));

              var dados = JSON.parse(xhr.responseText);
              
              // DIRECIONAR PARA QUANDO O PAGAMENTO FOR CONFIRMADO 
              if(dados.sucesso==200 && dados.dados_cobranca_cc.status=="CONFIRMED"){

                  setTimeout(function(){ 
           
                     app.views.dadosCartao(dados.dados_cobranca_cc.invoiceUrl);
                     //app.models.atualizarSaldoCompra();

                     // SALVAR HISTÓRICO DE PAGAMENTO DO USUÁRIO
                     app.models.salvarDadosCompraUsuario(dados.dados_cobranca_cc.customer,dados.dados_cobranca_cc.id);

                  }, 3000);

              // DIRECIONAR PARA QUANDO O PAGAMENTO TIVER DADO PROBLEMA (NÃO AUTORIZADO OU PENDENTE)
              }else{

                setTimeout(function(){ 
           
                     app.views.dadosCartaoPendente(dados.erro);

                  }, 3000);

              }


            }else{
              
              console.log("SEM SUCESSO payCartaoDeCredito()");
              console.log(JSON.parse(xhr.responseText));

              aviso("Oops! Algo deu errado","Tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      xhr.send(params);
      
}

// ATUALIZAR O SALDO DO USUÁRIO NA TELA DO APP
atualizarSaldoCompra(){
   
   var saldoAdicionado = localStorage.getItem("qtd_chaves");

   var antigoSaldo = localStorage.getItem("saldoPrestadorServico");

   var saldoAtual = antigoSaldo + saldoAdicionado;

   localStorage.setItem("saldoPrestadorServico",saldoAtual);

   $("#saldoAtualUsuarioHeader").html(saldoAtual);

}



salvarDadosCompraUsuario(customer,id){

      return;

     console.log("SALVAR OS DADOS DO ASAAS NO HISTÓRICO DE PEDIDOS DO CLIENTE");

     var idUsuario = localStorage.getItem("idUsuario");
     var valorPagamentoOriginal = localStorage.getItem("valorPagamentoOriginal");
     var qtd_chaves = localStorage.getItem("qtd_chaves");

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();
         
        xhr.open('POST', app.urlApi+'salvar-dados-compra-usuario',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+
                     "&token="+app.token+
                     "&valorPagamentoOriginal="+valorPagamentoOriginal+
                     "&qtd_chaves="+qtd_chaves+
                     "&customer="+customer+
                     "&id="+id;

        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO SALVAR INFOS PEDIDO E CLIENTE ASAAS");
              //console.log(xhr.responseText);
              console.log(JSON.parse(xhr.responseText));

            }else{
              
              console.log("SEM SUCESSO salvarDadosCompraUsuario()");
              console.log(JSON.parse(xhr.responseText));

              aviso("Oops! Algo deu errado","Tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      xhr.send(params);


}


duvidasESuporte(){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'suporte-e-ajuda',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ITENS DE SUPORTE E AJUDA");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("COMECANDO A IMPRIMIR OS SUPORTES NA TELA:");

              $("#itensSuporte").html(`

                  ${dados.itens.map((n) => {

                              return `
                                  
                                 <div class="item-suporte-e-ajuda">
                                  <h3>${n.pergunta}</h3>
                                  <p>${n.resposta}</p>
                                 </div>

                              `

                       }).join('')}

              `);

            }else{
              
              console.log("SEM SUCESSO duvidasESuporte()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}


// CARREGAR LISTA DE CURSOS
cursos(){
   
        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'lista-cursos',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ITENS LISTA DE CURSOS");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("COMECANDO A IMPRIMIR OS CURSOS NA TELA:");

              // ALIMENTAR OS CURSOS AINDA NAO COMPLETOS OU INICIADOS
              $("#loopCursosLista").html(`

                     ${dados.cursos.map((n) => {

                          if(n.status=="not-started"){

                              return `
                                  
                                 <li onclick="app.detalheCurso(${n.id})">
                                         ${n.titulo}
                                        <small>${n.resumo}</small>
                                 </li>

                              `

                          }

                       }).join('')}

              `);

              // ALIMENTAR OS CURSOS JÁ INICIADOS OU CONCLUIDOS PELO USUÁRIO
              $("#loopCursosListaEmAndamento").html(`

                     ${dados.cursos.map((n) => {

                          if(n.status=="started"){

                              return `
                                  
                                 <li onclick="app.detalheCurso(${n.id})">
                                         ${n.titulo}
                                        <small>${n.resumo}</small>
                                 </li>

                              `

                          }

                       }).join('')}

              `);




            }else{
              
              console.log("SEM SUCESSO cursos()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}



// CARREGAR DETALHE DO CURSO
detalheCurso(idCurso){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
         
        xhr.open('POST', app.urlApi+'detalhe-curso',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token+
                     "&idCurso="+idCurso;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ITENS DETALHE DO CURSO");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("COMECANDO A IMPRIMIR DETALHES DO CURSO NA TELA:");

              // ALIMENTAR O HTML COM AS INFOS BASICAS DO CURSO
              $("#nomeDoCurso").html(`${dados.curso.titulo}`);
              $("#resumoCurso").html(`${dados.curso.resumo}`);
              $("#totAulasCurso").html(`${dados.aulas.length} aulas`);


              // VERIFICAR SE O USUÁRIO JÁ INICIOU O CURSO
              if(dados.curso.status=="started"){

                    // BARRA DE PROGRESSO (CASO O USUÁRIO JA TENHA INICIADO O CURSO)
                    $(".barra-de-progresso-caixa").html(`<span class="badge badge-success">Curso iniciado!</span>`);
                    /*
                    $(".barra-de-progresso-caixa").html(`

                        <div id="progressoCurso" class="progress">
                            <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">seu progresso: 25%</div>
                        </div>

                    `);
                    */

               }

              // SALVAR O CONTEUDO DO CURSO NA MEMÓRIA DO DISPOSITIVO
              localStorage.setItem("dadosCurso",JSON.stringify(dados));

              // ALIMENTAR O RESUMO DAS AULAS
              $("#listaDasAulasResumo").html(`

                      ${dados.aulas.map((n) => {

                              return `
                                  
                                 <li>
                                    <i class="fa fa-play-circle"></i> ${n.nome_da_aula}
                                    <small>${n.resumo_da_aula}</small>
                                 </li>

                              `
                      
                       }).join('')}

              `);

            }else{
              
              console.log("SEM SUCESSO detalheCurso()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}



// DENTRO DO CURSO
iniciarCurso(){

  var dadosCurso = JSON.parse(localStorage.getItem("dadosCurso"));

  console.log("ESSES SAO OS DADOS DO CURSO");
  console.log(dadosCurso);

  // SE O USUÁRIO AINDA NAO TIVER INICIADO O CURSO, VAMOS SALVAR ESSE START
  if(dadosCurso.curso.status=="not-started"){

    app.models.salvarInicioCurso(dadosCurso.curso.id);

  }
  
  // ALIMENTAR OS DETALHES DA AULA DO CURSO
  $("#voltarLinkDetalheCurso").attr("onclick",`app.detalheCurso(${dadosCurso.curso.id})`);
  $("#nomeDoCurso").html(`${dadosCurso.curso.titulo}`);
  $("#nomeDaAulaAtual").html(`${dadosCurso.aulas[0].nome_da_aula}`);

  // IFRAME DO VIDEO
  if(dadosCurso.aulas[0].video_da_aula != false && 
     dadosCurso.aulas[0].video_da_aula != "" && 
     dadosCurso.aulas[0].video_da_aula != null){

     $("#videoAula").html(`${dadosCurso.aulas[0].video_da_aula}`);
  
  }
  
  // CONTEUDO DA AULA  
  $("#conteudoEmSiDaAula").html(`${dadosCurso.aulas[0].conteudo_da_aula}`);

  localStorage.setItem("posicaoCurso",0);

  // MARCAR SE A AULA TEM TESTE
  if(dadosCurso.aulas[0].conteudo_teste!==null){
     localStorage.setItem("aulaHasTeste","sim");
  }else{
     localStorage.setItem("aulaHasTeste","nao");
  }



  // PERGUNTAR PARA O USUARIO SE ELE QUER CONTINUAR O CURSO DE ONDE PAROU OU SE VAI COMEÇAR DO ZERO
  try {
        if(dadosCurso.historico_cursos_usuario.length>0){
            confirmacao("Quer continuar o curso de onde você parou?","Você pode continuar o curso de onde parou, ou se preferir pode recomeça-lo.","app.carregarProximaAula();","Continuar");
        }
  }
  catch(err) {
    console.log("USUÁRIO NAO TEM HISTÓRICO SOBRE ESSE CURSO");
  }



}


carregarProximaAula(){

  var dadosCurso = JSON.parse(localStorage.getItem("dadosCurso"));

  var posicao = localStorage.getItem("posicaoCurso");
  
  posicao = parseInt(posicao) + parseInt(1);

  localStorage.setItem("posicaoCurso",parseInt(posicao));

  console.log("ESSES SAO OS DADOS DO CURSO PARA A PROXIMA AULA");
  console.log(dadosCurso);

  console.log("ESSA É A POSIÇÃO");
  console.log(posicao);

  if(posicao==dadosCurso.aulas.length){
    app.detalheCurso();
    aviso("Parabéns! Curso concluído","Você concluíu 100% do curso! Continue se aperfeiçoando e aprendendo novos conteúdos!");
  }
  
  // ALIMENTAR OS DETALHES DA AULA DO CURSO
  $("#voltarLinkDetalheCurso").attr("onclick",`app.detalheCurso(${dadosCurso.curso.id})`);
  $("#nomeDoCurso").html(`${dadosCurso.curso.titulo}`);
  $("#nomeDaAulaAtual").html(`${dadosCurso.aulas[posicao].nome_da_aula}`);

  // IFRAME DO VIDEO
  if(dadosCurso.aulas[posicao].video_da_aula != false && 
     dadosCurso.aulas[posicao].video_da_aula != "" && 
     dadosCurso.aulas[posicao].video_da_aula != null){

     $("#videoAula").html(`${dadosCurso.aulas[posicao].video_da_aula}`);
  
  }else{
    $("#videoAula").html(` `);
  }
  
  // CONTEUDO DA AULA  
  $("#conteudoEmSiDaAula").html(`${dadosCurso.aulas[posicao].conteudo_da_aula}`);
  
  // MARCAR SE A AULA TEM TESTE
  if(dadosCurso.aulas[posicao].conteudo_teste!==null){

     localStorage.setItem("aulaHasTeste","sim");
  
  }else{
  
     localStorage.setItem("aulaHasTeste","nao");
  
  }


}


// SALVAR O INICIO DO CURSO
salvarInicioCurso(idCurso){
    
       // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
        var acao = "START CURSO";
         
        xhr.open('POST', app.urlApi+'historico-curso',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token+
                     "&idCurso="+idCurso+
                     "&acao="+acao;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ITENS DETALHE DO CURSO");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("HISTÓRICO DO USUARIO SALVO");

            }else{
              
              console.log("SEM SUCESSO salvarInicioCurso()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);


}

// ATUALIZAR O HISTÓRICO DO ALUNO
atualizarHistoricoAluno(){

  var posicaoCurso = localStorage.getItem("posicaoCurso");

  var dadosCurso = JSON.parse(localStorage.getItem("dadosCurso"));

  console.log("ESSES SAO OS DADOS DO CURSO");
  console.log(dadosCurso);

  var idCurso = dadosCurso.curso.id;

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        var idUsuario = localStorage.getItem("idUsuario");
        var acao = "UPDATE CURSO";
         
        xhr.open('POST', app.urlApi+'historico-curso',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token+
                     "&idCurso="+idCurso+
                     "&posicao="+posicaoCurso+
                     "&acao="+acao;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("DADOS DOS ITENS DETALHE DO CURSO");

              console.log(JSON.parse(xhr.responseText));
              
              var dados = JSON.parse(xhr.responseText);

              console.log("HISTÓRICO DO USUARIO ATUALIZADO");

            }else{
              
              console.log("SEM SUCESSO atualizarHistoricoAluno()");
              console.log(JSON.parse(xhr.responseText));
              aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);


}


salvarMinhasCategorias(){

    var idUsuario  = localStorage.getItem("idUsuario");
    var categoria1 = localStorage.getItem("categoria1");
    var categoria2 = localStorage.getItem("categoria2");
    var cnpj       = localStorage.getItem("cnpj");
    var profissionalTipoPix  = localStorage.getItem("profissionalTipoPix");
    var profissionalChavePix = localStorage.getItem("profissionalChavePix");

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        xhr.open('POST', app.urlApi+'salvar-minhas-categorias',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idUsuario='+idUsuario+ 
                     "&token="+app.token+
                     "&categoria1="+categoria1+
                     "&categoria2="+categoria2+
                     "&cnpj="+cnpj+
                     "&profissionalTipoPix="+profissionalTipoPix+
                     "&profissionalChavePix="+profissionalChavePix;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO SALVAR MINHAS CATEGORIAS");
              console.log(JSON.parse(xhr.responseText));
              
            }else{
              
              console.log("SEM SUCESSO salvarMinhasCategorias()");
              console.log(JSON.parse(xhr.responseText));
              //aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}


iniciarChatAPI(idOrcamento, callback) {
    const idProfissional = localStorage.getItem("idUsuario");

    // Validação para garantir que temos os dados necessários antes de chamar a API
    if (!idOrcamento || !idProfissional) {
        console.error("iniciarChatAPI: ID do Orçamento ou do Profissional está faltando.");
        callback(false, { erro: "Dados essenciais (ID do orçamento ou do profissional) não encontrados." });
        return;
    }

    // Monta os parâmetros para a requisição POST
    let params = `id_orcamento=${idOrcamento}&id_profissional=${idProfissional}&token=${app.token}`;

    // Configuração do AJAX (XMLHttpRequest)
    let xhr = new XMLHttpRequest();
    xhr.open('POST', app.urlApi + 'iniciar-chat', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = () => {
        // Verifica se a requisição foi concluída
        if (xhr.readyState == 4) {
            // Verifica se a requisição foi bem-sucedida (status 200 OK)
            if (xhr.status == 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    // A API retorna um objeto com uma chave "success" (true/false)
                    if (response.success) {
                        // Chama o callback com sucesso e os dados (o histórico do chat)
                        callback(true, response.data);
                    } else {
                        // A API retornou um erro conhecido
                        console.error("Erro da API em iniciar-chat:", response.data);
                        callback(false, response.data || { erro: "A API retornou um erro." });
                    }
                } catch (e) {
                    // Erro ao decodificar a resposta JSON do servidor
                    console.error("Erro ao processar JSON de iniciar-chat:", e);
                    callback(false, { erro: "Resposta inválida do servidor." });
                }
            } else {
                // Erro de conexão HTTP (ex: 404 Não Encontrado, 500 Erro de Servidor)
                console.error("Erro de HTTP em iniciar-chat. Status:", xhr.status);
                callback(false, { erro: "Erro de conexão ao iniciar o chat." });
            }
        }
    };

    // Envia a requisição
    xhr.send(params);
}




salvarEtapaCadastroProfissional(){

        // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        xhr.open('POST', app.urlApi+'atualizacao', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        var idUsuario      = localStorage.getItem("idUsuario");
        var statusCadastro = "pendente_documentos";

        // Criar o objeto JSON no formato da API
        var dadosJSON = {
            "token": app.token,
            "id_entidade": parseInt(idUsuario),
            "tipo": "usuario",
            "campos": {
                "ativacao_usuario": statusCadastro
            }
        };

        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    console.log("RETORNO SALVAR MINHAS CATEGORIAS");
                    
                    var resposta = JSON.parse(xhr.responseText);
                    console.log(resposta);
                    
                    // Verificar se a atualização foi bem-sucedida
                    if(resposta.sucesso === "200") {
                        console.log("Atualização realizada com sucesso!");
                        console.log("Campos atualizados:", resposta.atualizados);
                    } else {
                        console.log("Erro na atualização:", resposta.erro);
                        if(resposta.erros && Object.keys(resposta.erros).length > 0) {
                            console.log("Erros por campo:", resposta.erros);
                        }
                    }
                    
                } else {
                    console.log("SEM SUCESSO salvarEtapaCadastroProfissional()");
                    console.log(JSON.parse(xhr.responseText));
                    aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");
                }
            }
        }; // FINAL AJAX VANILLA

        /* EXECUTA */
        xhr.send(JSON.stringify(dadosJSON));   
  
}


minhasSolicitacoes(){
        var idUsuario  = localStorage.getItem("idUsuario");
        var emailUsuario = localStorage.getItem("emailUsuario");
        let xhr = new XMLHttpRequest();
        xhr.open('POST', app.urlApi+'minhas-solicitacoes',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        var params = 'idUsuario='+idUsuario+'&emailUsuario='+emailUsuario+"&token="+app.token;

        xhr.onreadystatechange = () => {
          if(xhr.readyState == 4) {
            if(xhr.status == 200) {
              console.log("RETORNO MINHAS SOLICITACOES");
               try {
                 var dados = JSON.parse(xhr.responseText);
                 console.log(dados);

                 if (dados.orcamentos && Array.isArray(dados.orcamentos)) {
                    $("#minhasSolicitacoesContainer").html(`
                        ${dados.orcamentos.map((n) => { // n = orçamento
                                // ... (código existente para imagensHtml) ...
                                let imagensHtml = '';
                                if (n.imagens && n.imagens.length > 0) {
                                    imagensHtml += '<div class="image-grid-container"><h4>Imagens do Orçamento</h4><div class="image-grid">';
                                    n.imagens.forEach(item => { /* ... */ });
                                    imagensHtml += '</div></div>';
                                }


                                let propostasHtml = '';
                                const latestProposalsByProf = {};
                                if (n.historicos && Array.isArray(n.historicos) && n.historicos.length > 0) {
                                    n.historicos.forEach(p => {
                                        if (p.id_profissional && p.status_orcamento) {
                                            latestProposalsByProf[p.id_profissional] = p;
                                        }
                                    });
                                }
                                const uniqueProposals = Object.values(latestProposalsByProf);

                                if (uniqueProposals.length > 0) {
                                    propostasHtml += '<div class="propostas-recebidas-container"><h4>Propostas Recebidas</h4>';
                                    uniqueProposals.forEach(p => {
                                        const statusClass = p.status_orcamento ? p.status_orcamento.toLowerCase().replace(/ /g, '-') : 'status-desconhecido';
                                        const valorDisplay = p.valor_total_orcamento || 'Valor Indisponível';
                                        const nomeProfissional = p.nome_profissional || 'Profissional';

                                        propostasHtml += `
                                            <div class="proposta-recebida-card">
                                                <div class="proposta-info">
                                                    <span class="proposta-profissional">${nomeProfissional}</span>
                                                    <strong class="proposta-valor-total">R$ ${valorDisplay}</strong>
                                                </div>
                                                <div class="proposta-status-actions">
                                                    <span class="status-badge status-${statusClass}">${p.status_orcamento}</span>`;

                                        // Botões condicionais
                                        if (p.status_orcamento === 'Enviado') {
                                             const valorNumericoRaw = (p.valor_total_orcamento || '0').replace(/[^0-9,]/g, '').replace(',', '.');
                                            propostasHtml += `
                                                <div class="proposta-botoes">
                                                    <button onclick="confirmacao('Aceitar Proposta?', 'Você será direcionado para a tela de pagamento.', 'app.atualizarStatusProposta(${n.id}, ${p.id_profissional}, \\'Aguardando Pagamento\\', \\'${valorNumericoRaw}\\')', 'Sim, Aceitar')" class="btn btn-sm btn-success">Aceitar</button>
                                                    <button onclick="confirmacao('Recusar Proposta?', 'Esta ação não pode ser desfeita.', 'app.atualizarStatusProposta(${n.id}, ${p.id_profissional}, \\'Recusado\\')', 'Sim, Recusar')" class="btn btn-sm btn-default">Recusar</button>
                                                </div>`;
                                        } else if (p.status_orcamento === 'Aguardando Pagamento') {
                                             const valorNumerico = parseFloat(valorDisplay.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
                                             propostasHtml += `
                                                <div class="proposta-botoes">
                                                    <button onclick="app.views.viewPagamentoProposta(${n.id}, ${p.id_profissional}, ${valorNumerico})" class="btn btn-sm btn-success">Pagar Agora</button>
                                                    <button onclick="confirmacao('Recusar Proposta?', 'Esta ação não pode ser desfeita.', 'app.atualizarStatusProposta(${n.id}, ${p.id_profissional}, \\'Recusado\\')', 'Sim, Recusar')" class="btn btn-sm btn-default">Recusar</button>
                                                </div>`;
                                        } else if (p.status_orcamento === 'Aprovado') { // Status após pagamento confirmado
                                             // --- BOTÃO CONCLUIR ADICIONADO AQUI ---
                                             propostasHtml += `
                                                <div class="proposta-botoes">
                                                    <button onclick="app.concluirAtendimento(${n.id}, ${p.id_profissional})" class="btn btn-sm btn-primary">Concluir Atendimento</button>
                                                     </div>`;
                                        } else if (p.status_orcamento === 'Concluído') {
                                            // Apenas mostra o status, sem botões
                                        } else if (p.status_orcamento === 'Recusado') {
                                             // Apenas mostra o status, sem botões
                                        }
                                        propostasHtml += `</div></div>`; // Fecha status-actions e card
                                    });
                                    propostasHtml += '</div>'; // Fecha container
                                }

                                // Retorna o card completo
                                return `
                                    <div id="anuncio${n.id}" class="caixa-destaque-servicos" data-categoria="${n.nome_categoria}">
                                        <div class="body-autor">
                                            <h4>${n.titulo_origin || 'Solicitação sem Título'}</h4>
                                            <p>Área de atendimento: ${n.regiao || 'Não informada'}</p>
                                            <p>Data: ${n.data_criacao || 'Não informada'}</p>
                                        </div>
                                        ${imagensHtml}
                                        ${propostasHtml} <div class="footer-autor" style="margin-top: 15px;">
                                            ${n.status === "fechado" ?
                                                `<span class="status-badge status-fechado" style="display: inline-block; margin-right: 10px;">Orçamento Fechado</span>`
                                            : `
                                                <a href="javascript:void(0)" onclick="app.cancelarAnuncio(${n.id});" title="CANCELAR SOLICITAÇÃO" class="btn btn-warning">CANCELAR SOLICITAÇÃO <i class="fa fa-ban"></i></a>
                                            `}
                                            
                                        </div>
                                    </div>
                                `;
                        }).join('')}
                    `);
                 } else {
                     $("#minhasSolicitacoesContainer").html('<p style="text-align: center; padding: 20px;">Nenhuma solicitação encontrada.</p>');
                 }
               } catch (e) { /* ... tratamento de erro ... */ }
            } else { /* ... tratamento de erro ... */ }
          }
        };
        xhr.send(params);
    } // Fim minhasSolicitacoes



removerSolicitacaoOrcamento(idAnuncio){

  // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        xhr.open('POST', app.urlApi+'remover-anuncio',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idAnuncio='+idAnuncio+
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO REMOVER ANUNCIO");
              console.log(JSON.parse(xhr.responseText));

              fecharAviso();
              aviso("Deu certo!","Sua solicitação foi removida com sucesso! Aproveite e publique novos orçamentos para continuar contando com os profissionais da nossa plataforma!");
              
            }else{
              
              console.log("SEM SUCESSO removerSolicitacaoOrcamento()");
              console.log(JSON.parse(xhr.responseText));
              //aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);



}

fecharSolicitacaoOrcamento(idAnuncio){
  
         // CONFIGURAÇÕES AJAX VANILLA
        let xhr = new XMLHttpRequest();

        xhr.open('POST', app.urlApi+'fechar-anuncio',true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        var params = 'idAnuncio='+idAnuncio+
                     "&token="+app.token;
        
        // INICIO AJAX VANILLA
        xhr.onreadystatechange = () => {

          if(xhr.readyState == 4) {

            if(xhr.status == 200) {

              console.log("RETORNO FECHAR ANUNCIO");
              console.log(JSON.parse(xhr.responseText));

              fecharAviso();
              aviso("Deu certo!","Sua solicitação foi fechada com sucesso! Aproveite e publique novos orçamentos para continuar contando com os profissionais da nossa plataforma!");
              
            }else{
              
              console.log("SEM SUCESSO fecharSolicitacaoOrcamento()");
              console.log(JSON.parse(xhr.responseText));
              //aviso("Oops! Algo deu errado.","Nossos servidores estão passando por dificuldades, tente novamente em alguns minutos.");

            }

          }
      }; // FINAL AJAX VANILLA

      /* EXECUTA */
      xhr.send(params);

}


      // =========================================================
      // INÍCIO DO CÓDIGO A SER ADICIONADO (FUNÇÕES DO CHAT)
      // =========================================================

      getConversationsAPI(callback) {
          const userId = localStorage.getItem("idUsuario");
          const userEmail = localStorage.getItem("emailUsuario");

          if (!userId || !userEmail) {
              console.error("Chat: ID ou E-mail do usuário não encontrados no localStorage.");
              callback(false, { erro: "Usuário não autenticado." });
              return;
          }

          let params = `user_id=${userId}&user_email=${encodeURIComponent(userEmail)}&token=${app.token}`;

          let xhr = new XMLHttpRequest();
          xhr.open('POST', app.urlApi + 'get-conversations', true);
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

          xhr.onreadystatechange = () => {
              if (xhr.readyState == 4) {
                  if (xhr.status == 200) {
                      try {
                          const response = JSON.parse(xhr.responseText);
                          // A API wp_send_json_success encapsula a resposta em { "success": true, "data": [...] }
                          if (response.success) {
                              callback(true, response.data);
                          } else {
                              callback(false, response.data || { erro: "A API retornou um erro." });
                          }
                      } catch (e) {
                          console.error("Erro ao processar resposta de get-conversations:", e);
                          callback(false, { erro: "Resposta inválida do servidor." });
                      }
                  } else {
                      callback(false, { erro: "Erro de conexão ao buscar conversas." });
                  }
              }
          };
          xhr.send(params);
      }

      getChatHistoryAPI(idOrcamento, callback) {
          let params = `id_orcamento=${idOrcamento}&token=${app.token}`;

          let xhr = new XMLHttpRequest();
          xhr.open('POST', app.urlApi + 'get-chat', true);
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

          xhr.onreadystatechange = () => {
              if (xhr.readyState == 4) {
                  if (xhr.status == 200) {
                      try {
                          const response = JSON.parse(xhr.responseText);
                          if (response.success) {
                              callback(true, response.data);
                          } else {
                              callback(false, response.data || { erro: "A API retornou um erro." });
                          }
                      } catch (e) {
                          console.error("Erro ao processar resposta de get-chat:", e);
                          callback(false, { erro: "Resposta inválida do servidor." });
                      }
                  } else {
                      callback(false, { erro: "Erro de conexão ao buscar histórico do chat." });
                  }
              }
          };
          xhr.send(params);
      }

      sendMessageAPI(idOrcamento, autorId, mensagem, imagemBase64, callback) {
          let params = `id_orcamento=${idOrcamento}&autor_id=${encodeURIComponent(autorId)}&mensagem=${encodeURIComponent(mensagem)}&imagem_base64=${encodeURIComponent(imagemBase64)}&token=${app.token}`;

          let xhr = new XMLHttpRequest();
          xhr.open('POST', app.urlApi + 'send-message', true);
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

          xhr.onreadystatechange = () => {
              if (xhr.readyState == 4) {
                  if (xhr.status == 200) {
                      try {
                          const response = JSON.parse(xhr.responseText);
                          if (response.success) {
                              callback(true, response.data);
                          } else {
                              callback(false, response.data || { erro: "A API retornou um erro." });
                          }
                      } catch (e) {
                          console.error("Erro ao processar resposta de send-message:", e);
                          callback(false, { erro: "Resposta inválida do servidor." });
                      }
                  } else {
                      callback(false, { erro: "Erro de conexão ao enviar mensagem." });
                  }
              }
          };
          xhr.send(params);
      }




}