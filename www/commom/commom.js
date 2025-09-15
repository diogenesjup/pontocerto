// Função para filtrar as categorias
function filtrarCategorias() {

   // Pegando os valores de categoria1 e categoria2 da localStorage
let categoria1 = localStorage.getItem('categoria1'); // Supondo que os valores estão salvos como string na localStorage
let categoria2 = localStorage.getItem('categoria2');


    let isChecked = document.getElementById('toggleSwitch').checked;

    // Seleciona todas as divs .caixa-destaque-servicos
    let divs = document.querySelectorAll('.caixa-destaque-servicos');

    // Se o switch estiver ativado
    if (isChecked) {
        divs.forEach(function(div) {
            let categoria = div.getAttribute('data-categoria');

            // Verifica se a categoria da div é igual a categoria1 ou categoria2
            if (categoria === categoria1 || categoria === categoria2) {
                div.style.display = 'block'; // Exibe a div
            } else {
                div.style.display = 'none'; // Oculta a div
            }
        });
    } else {
        // Se o switch estiver desativado, todas as divs ficam visíveis
        divs.forEach(function(div) {
            div.style.display = 'block'; // Exibe todas as divs
        });
    }
}

// Adiciona o evento ao switch para detectar quando ele for ativado/desativado
//document.getElementById('toggleSwitch').addEventListener('change', filtrarCategorias);



            // COMO FAZER A CHAMADA NO FORMULÁRIO onSubmit="return ajaxSubmit(this);"
            var ajaxSubmit = function(form) {
                // fetch where we want to submit the form to
                var url = $(form).attr('action');
                var flag = 9;

                var data = $(form).serializeArray();

                // setup the ajax request
                $.ajax({
                    url: url,
                    data: data,
                    dataType: 'json',
                    type:'POST'
                });

                swal("Obrigado!", 'Sua mensagem foi enviada com sucesso', "success");

                return false;
            }


            

          // SE O USUÁRIO FIZER UM GESTURE PARA A PARTE INFERIOR DA PÁGINA
          // VAMOS FECHAR A LAYER DO CARRO, CASO ELA ESTEJA ABERTA

          $("#swipeAviso").swipe({
            swipe:function(event, direction, distance, duration, fingerCount) {

              if(direction=="down"){

                $(".modal-avisos .aviso").css("bottom","-300%");
                $(".modal-avisos").fadeOut(500);

              }

            }
          });
          
          $("#swipemeConfirmacao").swipe({
            swipe:function(event, direction, distance, duration, fingerCount) {

              if(direction=="down"){

                $(".modal-confirmacao .confirmacao").css("bottom","-300%");
                $(".modal-confirmacao").fadeOut(500);

              }

            }
          });



            /* FUNÇÃO GERAL PARA EXIBIR OS AVISOS DO PÁGINA */
            function aviso(titulo,mensagem){

              console.log("%c COMEÇANDO FUNÇÃO PARA EXIBIR AVISO","background:#ff0000;color:#fff;");
              $(".modal-avisos").fadeIn(100);

              $(".modal-avisos .aviso").css("bottom","0");


              // ALIMENTAR O HTML
              $(".modal-avisos .aviso h3").html(titulo);
              $(".modal-avisos .aviso p").html(mensagem+'<p style="padding-top:12px;padding-left:0px;"><button type="button" onclick="fecharAviso();" class="btn btn-primary">Ok</button></p>');
              
              //setTimeout("fecharAviso()",12000);


            }
            function fecharAviso(){
              
              $(".modal-avisos .aviso").css("bottom","-300%");
              $(".modal-avisos").fadeOut(500);

            }

            /* FUNÇÃO GERAL PARA EXIBIR CONFIRMAÇÕES DE AÇÕES */
            function confirmacao(titulo,mensagem,funcaoConfirmacao,textoConfirmacao){

              console.log("%c COMEÇANDO FUNÇÃO PARA EXIBIR AVISO","background:#ff0000;color:#fff;");
              $(".modal-confirmacao").fadeIn(100);

              $(".modal-confirmacao .confirmacao").css("bottom","0");

              // ALIMENTAR O HTML
              $(".confirmacao h3").html(titulo);
              $(".confirmacao p").html(mensagem);

              $(".confirmacao #acaoConfirmacao").attr("onclick",funcaoConfirmacao+"; fecharConfirmacao();");
              if(textoConfirmacao!=""){
                $(".confirmacao #acaoConfirmacao").html(textoConfirmacao);
              }
              

            }
            function fecharConfirmacao(){

                 $(".modal-confirmacao .confirmacao").css("bottom","-300%");
                 $(".modal-confirmacao").fadeOut(500);

            }







// FORMULARIO FLUTUANTE onclick="ativarFormularioFlutuante('','')"
function ativarFormularioFlutuante(campoParaPreenchimento,labelPreenchimento){

   $(".input-flutuante-acessibilidade").fadeIn(500);
   //$(".barra-navegacao").hide(0);

   $("#fieldInputFlutuante").val($(campoParaPreenchimento).val());

   localStorage.setItem("campoParaPreenchimento",campoParaPreenchimento);

   $("#fieldInputFlutuante").focus();
   $('.input-flutuante-acessibilidade label').html(labelPreenchimento);

}

function validarFormularioFlutuante(event){

    event.preventDefault();

    var fieldInputFlutuante = $("#fieldInputFlutuante").val();
    
    $(".input-flutuante-acessibilidade").fadeOut(500);
    //$(".barra-navegacao").show(0);

    $(localStorage.getItem("campoParaPreenchimento")).val(fieldInputFlutuante);

}

// GARANTIR O FECHAMENTO DO CAMPO QUANDO A TELA VOLTAR AO NORMAL

$(document).ready(function() {
  var _originalSize = $(window).width() + $(window).height()
  $(window).resize(function() {
    if ($(window).width() + $(window).height() == _originalSize) {
      console.log("keyboard active "+_originalSize);
      $(".input-flutuante-acessibilidade").fadeOut(500);
      //$(".barra-navegacao").show(0);
    }
  });
});

// ABRIR URL`s EXTERNAS`
function abrirUrl(url){

  cordova.InAppBrowser.open(url, '_blank', 'location=yes,hidden=no,hardwareback=no');

}




     // CODIGOS PARA UPLOAD DE ARQUIVOS LOCAIS
     function uploadLocal(){

         console.log("ENTRAMOS!");
         //var files = $(this)[0].files;
         
         /* Efetua o Upload */
         $('.fileForm').ajaxForm({
          dataType:  'json',
          success:   processJson 
        
         }).submit();

     }
     function processJson(dados) { 
            // 'data' is the json object returned from the server 
            console.log("%c RETORNO SOBRE O ENVIO DAS IMAGENS (UPLOAD):","background:#ff0000;color:#fff;");
            console.log(dados); 
            
            if(dados.erros===null){
            
                console.log("NENHUM ERRO!");

            }else{
              
              $(".retorno-upload").html('<div class="alert alert-danger">'+dados.erros+'</div>');              

            }

            $('.fileForm').resetForm();

        }
      // CODIGOS PARA UPLOAD DE ARQUIVOS LOCAIS



      // UPLOAD DE IMAGENS USANDO CAMERA ANDROID
      /* ######### FUNÇÕES USO DE CAMERA SELFIE #########  */
      var minhaImagem;
      var controleFotoEnviada = 1;
      var tipoArquivo = "nenhum";

      function initCameraSelfie(){ // CHAMAR ESSA FUNCAO PARA INICIALIZAR A CAMERA

               minhaImagem;
               controleFotoEnviada = 1;
               
               tipoArquivo = "camera";

               console.log("INICIANDO FUNÇÃO PARA INICIALIZAR A CAMERA SELFE");

              // SCRIPTS DA CAMERA                                 

                              controleFotoEnviada = 2;
                              console.log("CONTROLE FOTO ENVIADA ATUALIZADA");
                              
                              console.log("INICIALIZANDO A CAMERA");
                              $("#retornoMsgSelfie").html("inicializando a câmera para a selfie");
                              navigator.camera.getPicture(onSuccess2, onFail2, {
                                  quality: 50,
                                  destinationType: Camera.DestinationType.DATA_URL
                              });

                              function onSuccess2(imageData) {
                                  console.log("CAMERA INICIALIZADA COM SUCESSO");
                                  $("#retornoMsgSelfie").html("Imagem capturada com sucesso!");
                                  var image = document.getElementById('fotoDestinoSelfie');
                                  image.style.display = 'block';
                                  image.src = "data:image/jpeg;base64," + imageData;

                                  minhaImagem = imageData;

                                  //$(".perfil-banner .foto-perfil").css("background","url('data:image/jpeg;base64,"+imageData+"')");
                                  //$(".perfil-banner .foto-perfil").css("background-size","cover");
                                  //$(".perfil-banner .foto-perfil").css("background-position","center center");
                                  //localStorage.setItem("parametroFoto",1);

                                  $('.btn-action-foto').attr('onclick',"uploadMyImageSelfie()");

                              }

                              function onFail2(message) {
                                  console.log("CAMERA NÃO FUNCIONOU");
                                  $("#retornoMsgSelfie").html("Não possível obter a imagem da sua câmera, tente novamente. "+message);
                                  console.log('### MOTIVO FALHA DE ACESSO A CÂMERA: ' + message);
                              }                           

              document.addEventListener("deviceready", function () {  
              //alert("Phonegap");                                                                                        
              }, false); 

      }

      function uploadMyImageSelfie(){

                    console.log("INICIANDO FUNÇÃO PARA FAZER UPLOAD DA IMAGEM");
         
                                          if(controleFotoEnviada == 2){

                                                  $('.btn-action-foto').html("processando...");

                                                  var cadastroEmail = localStorage.getItem("idUsuario");
                                                  
                                                  $.ajax({
                                                    type: "POST",
                                                    url: app.urlApi+'upload-selfie-camera.php?idUsuario='+idUsuario,
                                                    data: { img_data:minhaImagem},
                                                    cache: false,
                                                    contentType: "application/x-www-form-urlencoded",
                                                    success: function (result) {
                                                      
                                                      $('#sendFileSelfie').html("ATUALIZAR IMAGEM");      
                                                      aviso("Foto de perfil atualizada com sucesso","Obrigado por manter o seu perfil atualizado!");
                                                      editarPerfil(); 

                                                      minhaImagem = "";
                                                      controleFotoEnviada = 1;
                                                      tipoArquivo = "nenhum";                                        

                                                    },
                                                    fail: function(result){
                                                      aviso("Oops! Algo deu errado, tente novamente",result);
                                                    }
                                                  });   

                                              }else{

                                                  aviso('Oops! Você não selecionou nenhuma imagem','Você não selecionou ou tirou nenhuma foto.');
                                                  $('.btn-action-foto').html("ATUALIZAR IMAGEM");

                                              }

}



function copiarCodigoPix(){

  // Cria um elemento textarea temporário
  var textArea = document.createElement("textarea");
            
  // Define o valor do textarea para o conteúdo do span
  textArea.value = document.querySelector('#codigoPix').value;
  
  // Adiciona o textarea ao DOM
  document.body.appendChild(textArea);
  
  // Seleciona o conteúdo do textarea
  textArea.select();
  
  // Copia o texto selecionado para a área de transferência
  document.execCommand('copy');
  
  // Remove o textarea do DOM
  document.body.removeChild(textArea);
  
  // (Opcional) Mostra uma mensagem para o usuário
  alert('Código copiado com sucesso!');

}










/* 

TESTES COM CAMERA

*/
// Função auxiliar para converter Base64 em Blob URL
function converterBase64ParaBlob(base64Data) {
    try {
        // Remover prefixo data: se existir
        const base64Limpo = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
        
        // Converter para bytes
        const byteCharacters = atob(base64Limpo);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        // Criar URL do blob
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Erro ao converter base64 para blob:', error);
        return null;
    }
}

// BOTÃO 1: USAR CÂMERA
function usarCamera() {
    if (!navigator.camera) {
        alert('❌ Plugin da câmera não encontrado');
        return;
    }
    
    const opcoes = {
        quality: 70,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 800,
        targetHeight: 800,
        correctOrientation: true,
        allowEdit: false,
        saveToPhotoAlbum: false
    };
    
    // Limpar div antes de abrir câmera
    const divCamera = document.getElementById('divImagemCamera');
    if (divCamera) {
        divCamera.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">📸 Abrindo câmera...</p>';
    }
    
    function onSucesso(imageData) {
        // Converter base64 para blob URL
        const blobURL = converterBase64ParaBlob(imageData);
        
        if (blobURL && divCamera) {
            // Exibir imagem na div
            divCamera.innerHTML = `
                <div style="text-align: center; padding: 10px;">
                    <img src="${blobURL}" 
                         style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">
                        ✅ Foto capturada da câmera (${(imageData.length / 1024).toFixed(1)} KB)
                    </p>
                </div>
            `;
            
            // Limpar blob URL após 5 minutos para liberar memória
            setTimeout(() => URL.revokeObjectURL(blobURL), 300000);
        } else {
            divCamera.innerHTML = '<p style="text-align: center; color: #dc3545; padding: 20px;">❌ Erro ao processar imagem</p>';
        }
    }
    
    function onErro(message) {
        if (divCamera) {
            if (message.includes('cancelled')) {
                divCamera.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">📸 Captura cancelada</p>';
            } else {
                divCamera.innerHTML = `<p style="text-align: center; color: #dc3545; padding: 20px;">❌ Erro: ${message}</p>`;
            }
        }
    }
    
    navigator.camera.getPicture(onSucesso, onErro, opcoes);
}

// BOTÃO 2: USAR BIBLIOTECA (GALERIA)
function usarBiblioteca() {
    if (!navigator.camera) {
        alert('❌ Plugin da câmera não encontrado');
        return;
    }
    
    const opcoes = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY, // ← GALERIA
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 800,
        targetHeight: 800,
        correctOrientation: true,
        allowEdit: false
    };
    
    // Limpar div antes de abrir galeria
    const divBiblioteca = document.getElementById('divImagemBiblioteca');
    if (divBiblioteca) {
        divBiblioteca.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">🖼️ Abrindo galeria...</p>';
    }
    
    function onSucesso(imageData) {
        // Converter base64 para blob URL
        const blobURL = converterBase64ParaBlob(imageData);
        
        if (blobURL && divBiblioteca) {
            // Exibir imagem na div
            divBiblioteca.innerHTML = `
                <div style="text-align: center; padding: 10px;">
                    <img src="${blobURL}" 
                         style="width: 100%; max-height: 400px; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">
                        ✅ Imagem da galeria (${(imageData.length / 1024).toFixed(1)} KB)
                    </p>
                </div>
            `;
            
            // Limpar blob URL após 5 minutos para liberar memória
            setTimeout(() => URL.revokeObjectURL(blobURL), 300000);
        } else {
            divBiblioteca.innerHTML = '<p style="text-align: center; color: #dc3545; padding: 20px;">❌ Erro ao processar imagem</p>';
        }
    }
    
    function onErro(message) {
        if (divBiblioteca) {
            if (message.includes('cancelled')) {
                divBiblioteca.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">🖼️ Seleção cancelada</p>';
            } else {
                divBiblioteca.innerHTML = `<p style="text-align: center; color: #dc3545; padding: 20px;">❌ Erro: ${message}</p>`;
            }
        }
    }
    
    navigator.camera.getPicture(onSucesso, onErro, opcoes);
}

// FUNÇÃO PARA OBTER BASE64 DA IMAGEM (ÚTIL PARA UPLOAD)
function obterBase64DaCamera(callback) {
    if (!navigator.camera) {
        callback(null, 'Plugin da câmera não encontrado');
        return;
    }
    
    const opcoes = {
        quality: 70,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 800,
        targetHeight: 800,
        correctOrientation: true
    };
    
    navigator.camera.getPicture(
        function(imageData) {
            // Retornar base64 limpo (sem prefixo data:)
            const base64Limpo = imageData.includes(',') ? imageData.split(',')[1] : imageData;
            callback(base64Limpo, null);
        },
        function(error) {
            callback(null, error);
        },
        opcoes
    );
}

// FUNÇÃO PARA OBTER BASE64 DA GALERIA (ÚTIL PARA UPLOAD)
function obterBase64DaGaleria(callback) {
    if (!navigator.camera) {
        callback(null, 'Plugin da câmera não encontrado');
        return;
    }
    
    const opcoes = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 800,
        targetHeight: 800,
        correctOrientation: true
    };
    
    navigator.camera.getPicture(
        function(imageData) {
            // Retornar base64 limpo (sem prefixo data:)
            const base64Limpo = imageData.includes(',') ? imageData.split(',')[1] : imageData;
            callback(base64Limpo, null);
        },
        function(error) {
            callback(null, error);
        },
        opcoes
    );
}













// CAMERA PREVIEW
// CÂMERA ESPECIAL CORRIGIDA - SUBSTITUIR A FUNÇÃO usarCameraEspecial()

// Variáveis globais para controle da câmera especial
let cameraEspecialAtiva = false;
let divCameraRect = null;
let imagensSelecionadas = [];

// FUNÇÃO PRINCIPAL: CÂMERA ESPECIAL CORRIGIDA
function usarCameraEspecial() {
    const divCamera = document.getElementById('divCameraEspecial');
    
    if (!divCamera) {
        alert('❌ Div divCameraEspecial não encontrada');
        return;
    }
    
    // Verificar se o plugin camera-preview está disponível
    if (typeof CameraPreview === 'undefined') {
        // Se não tiver o plugin, usar fallback com getUserMedia (HTML5)
        usarCameraHTML5();
        return;
    }
    
    if (cameraEspecialAtiva) {
        pararCameraEspecial();
        return;
    }
    
    // IMPORTANTE: Obter posição exata da div na tela
    const rect = divCamera.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Calcular posição absoluta considerando scroll
    divCameraRect = {
        x: Math.round(rect.left),
        y: Math.round(rect.top + scrollTop),
        width: Math.round(rect.width),
        height: 300 // Altura fixa para o preview
    };
    
    console.log('Posição da câmera:', divCameraRect);
    
    // Configurar preview da câmera com posição exata
    const opcoes = {
        x: divCameraRect.x,
        y: divCameraRect.y,
        width: divCameraRect.width,
        height: divCameraRect.height,
        camera: CameraPreview.CAMERA_DIRECTION.BACK,
        tapPhoto: false, // Desabilitar tap para capturar
        tapFocus: true,
        previewDrag: false,
        toBack: true, // Importante: câmera fica atrás
        alpha: 0.8
    };
    
    // Preparar div com fundo transparente e controles
    divCamera.style.height = divCameraRect.height + 'px';
    divCamera.style.background = 'transparent'; // Deixar transparente para ver a câmera
    divCamera.style.position = 'relative';
    
    divCamera.innerHTML = `
        <div style="position: absolute; top: 0; left: 0; right: 0; z-index: 1000; background: rgba(0,0,0,0.8); padding: 10px; border-radius: 8px 8px 0 0;">
            <div style="text-align: center;">
                <h5 style="color: white; margin: 0 0 10px 0;">📹 Câmera Ativa</h5>
                <div style="display: flex; justify-content: center; gap: 8px; flex-wrap: wrap;">
                    <button onclick="capturarFotoCameraEspecial()" 
                            class="btn-generico-actions-camera">
                        📸 Capturar
                    </button>
                    <button onclick="trocarCameraCameraEspecial()" 
                            class="btn-generico-actions-camera">
                        🔄 Trocar
                    </button>
                    <button onclick="pararCameraEspecial()" 
                            class="btn-generico-actions-camera">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
        
        <div id="cameraStatus" style="position: absolute; bottom: 0; left: 0; right: 0; z-index: 1000; background: rgba(0,0,0,0.8); color: white; padding: 8px; text-align: center; font-size: 11px; border-radius: 0 0 8px 8px;">
            Iniciando câmera...
        </div>
        
        <!-- Overlay para delimitar área da câmera -->
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 2px solid #6f42c1; border-radius: 8px; pointer-events: none; z-index: 999;"></div>
    `;
    
    // Adicionar estilo temporário ao body para que a câmera apareça
    document.body.style.setProperty('--camera-background', 'transparent');
    
    // Iniciar preview
    CameraPreview.startCamera(opcoes, 
        function() {
            cameraEspecialAtiva = true;
            document.getElementById('cameraStatus').innerHTML = '✅ Câmera ativa - Toque na tela para focar';
            
            // Ajustar posição se necessário após iniciar
            setTimeout(ajustarPosicaoCamera, 500);
        },
        function(error) {
            document.getElementById('cameraStatus').innerHTML = '❌ Erro: ' + error;
            console.error('Erro da câmera:', error);
        }
    );
}

// FUNÇÃO PARA AJUSTAR POSIÇÃO DA CÂMERA
function ajustarPosicaoCamera() {
    if (!cameraEspecialAtiva || typeof CameraPreview === 'undefined') return;
    
    const divCamera = document.getElementById('divCameraEspecial');
    if (!divCamera) return;
    
    // Recalcular posição (caso tenha mudado)
    const rect = divCamera.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    const novasPosicoes = {
        x: Math.round(rect.left),
        y: Math.round(rect.top + scrollTop),
        width: Math.round(rect.width),
        height: 200
    };
    
    // Só ajustar se a posição mudou significativamente
    if (Math.abs(novasPosicoes.x - divCameraRect.x) > 5 || 
        Math.abs(novasPosicoes.y - divCameraRect.y) > 5) {
        
        console.log('Ajustando posição da câmera:', novasPosicoes);
        divCameraRect = novasPosicoes;
        
        CameraPreview.setRect(novasPosicoes.x, novasPosicoes.y, novasPosicoes.width, novasPosicoes.height);
    }
}

// FUNÇÃO PARA RECALCULAR POSIÇÃO AO ROLAR A PÁGINA
function recalcularPosicaoCamera() {
    if (cameraEspecialAtiva) {
        ajustarPosicaoCamera();
    }
}

// PARAR CÂMERA ESPECIAL (FUNÇÃO ATUALIZADA)
function pararCameraEspecial() {
    if (typeof CameraPreview !== 'undefined' && cameraEspecialAtiva) {
        CameraPreview.stopCamera();
    }
    
    cameraEspecialAtiva = false;
    divCameraRect = null;
    
    // Restaurar fundo normal
    document.body.style.removeProperty('--camera-background');
    
    const divCamera = document.getElementById('divCameraEspecial');
    if (divCamera) {
        divCamera.style.background = '#f8f9fa'; // Restaurar fundo
        divCamera.style.height = 'auto';
        
        divCamera.innerHTML = `
            <div style="
                width: 100%; 
                min-height: 200px; 
                border: 2px dashed #6f42c1; 
                border-radius: 8px; 
                background: #f8f9fa;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <p style="color: #666; text-align: center; margin: 0;">
                    📹 Clique no botão acima para ativar câmera especial
                </p>
            </div>
        `;
    }
}

// LISTENER PARA RECALCULAR POSIÇÃO AO ROLAR/REDIMENSIONAR
window.addEventListener('scroll', recalcularPosicaoCamera);
window.addEventListener('resize', recalcularPosicaoCamera);

// VERSÃO MELHORADA DA CAPTURA
function capturarFotoCameraEspecial() {
    if (typeof CameraPreview === 'undefined') {
        alert('❌ Plugin camera-preview não encontrado');
        return;
    }
    
    const statusEl = document.getElementById('cameraStatus');
    if (statusEl) {
        statusEl.innerHTML = '📸 Capturando foto...';
    }
    
    const opcoes = {
        width: 640,
        height: 480,
        quality: 85
    };
    
    CameraPreview.takePicture(opcoes, 
        function(base64) {
            console.log('Foto capturada, tamanho:', base64.length);
            
            if (statusEl) {
                statusEl.innerHTML = '✅ Foto capturada com sucesso!';
            }
            
            // Converter para blob e exibir
            const blobURL = converterBase64ParaBlob(base64);
            
            if (blobURL) {
                // Parar câmera e mostrar resultado
                pararCameraEspecial();
                
                const divCamera = document.getElementById('divCameraEspecial');
                divCamera.innerHTML = `
                    <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
                        <h4 style="color: #28a745; margin-bottom: 15px;">📸 Foto Capturada</h4>
                        <img src="${blobURL}" 
                             style="width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
                        <p style="font-size: 12px; color: #666; margin: 10px 0;">
                            Tamanho: ${(base64.length / 1024).toFixed(1)} KB
                        </p>
                        <div style="margin-top: 15px;">
                            <button onclick="usarCameraEspecial()" 
                                    style="padding: 10px 20px; background: #6f42c1; color: white; border: none; border-radius: 4px; margin-right: 10px;">
                                📹 Nova Câmera
                            </button>
                            <button onclick="salvarFotoEspecial('${base64}')" 
                                    style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px;">
                                💾 Usar Foto
                            </button>
                        </div>
                    </div>
                `;
                
                // Limpar blob após 5 minutos
                setTimeout(() => URL.revokeObjectURL(blobURL), 300000);
            } else {
                if (statusEl) {
                    statusEl.innerHTML = '❌ Erro ao processar imagem';
                }
            }
        },
        function(error) {
            console.error('Erro ao capturar:', error);
            if (statusEl) {
                statusEl.innerHTML = '❌ Erro ao capturar: ' + error;
            }
        }
    );
}

// FUNÇÃO MELHORADA PARA SALVAR/USAR FOTO
function salvarFotoEspecial(base64) {
    // Aqui você pode usar o base64 como quiser
    console.log('Base64 da foto especial:', base64.substring(0, 100) + '...');
    
    alert(`💾 Foto pronta para usar!\nTamanho: ${(base64.length / 1024).toFixed(1)} KB\n\nVocê pode agora enviar para o servidor ou usar no app.`);
    
    // Exemplo de como usar:
    // enviarParaServidor(base64);
    // ou salvar em uma variável global
    // window.fotoCapturada = base64;
}



function usarCameraEspecialModal(titulo,descricao,acao) {

    // SALVAR QUAL AÇÃO SOLICITOU A CÂMERA
    localStorage.setItem("acaoAcionamentoCamera",acao);

    if (typeof CameraPreview === 'undefined') {
        usarCameraHTML5();
        return;
    }
    
    // Criar modal para a câmera
    const modal = document.createElement('div');
    modal.id = 'modalCameraEspecial';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #1B3686 0%, #466CDF 100%);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0px;
        box-sizing: border-box;
    `;
    
    modal.innerHTML = `
        <div style="
            width: 100%;
            max-width: 400px;
            height: 100%;
            position: fixed;
            top:0;
            left:0;
            background: transparent;
            border-radius: 0px;
            overflow: hidden;
            z-index: 999999999999999999999999;
        ">
            <!-- Controles superiores -->
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                width:100%;
                background: transparent;
                height:100%;
                padding: 15px;
                text-align: center;
                border-radius: 0;
                z-index:999999999999999999999999;
            "
                id="areaEspecialControlesSuperiores"
            >
                <h4 style="color: white; margin: 0 0 10px 0;">${titulo}</h4>
                <p style="color:#f2f2f2">${descricao}</p>
            </div>
            
            <!-- Controles inferiores -->
            <div style="
                position: absolute;
                bottom: 0px;
                left: 0;
                right: 0;
                width:100%;
                background: transparent;
                padding: 15px;
                text-align: center;
                border-radius: 0;
                z-index:999999999999999999999999;
            "
            id="areaEspecialControleInferiores"
            >
                <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 10px;">
                    <button onclick="capturarFotoModal()" 
                            class="btn-generico-actions-camera">
                        📸 Capturar
                    </button>
                    <button onclick="trocarCameraModal()" 
                            class="btn-generico-actions-camera">
                        🔄 Trocar
                    </button>
                    <button onclick="fecharCameraModal()" 
                            class="btn-generico-actions-camera">
                        Cancelar
                    </button>
                </div>
                <div id="statusCameraModal" style="color: white; font-size: 12px;">
                    Iniciando câmera...
                </div>
            </div>
            
            <!-- Border da câmera (quando não inicializada) -->
            <div style="
                position: relative;
                top: 250px;
                left: 0px;
                right: 0px;
                bottom: auto;
                border: 1px solid #f2f2f2;
                border-radius: 8px;
                pointer-events: none;
                background:#f2f2f2;
                height:300px;
                z-index: 1000;
                opacity:0;
            "   id="areaEspecialCamera"
            ></div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar câmera para o modal
    const modalRect = modal.querySelector('div').getBoundingClientRect();
    const opcoes = {
        x: Math.round(modalRect.left + 10),
        y: Math.round(modalRect.top + 50),
        width: Math.round(modalRect.width - 20),
        height: Math.round(modalRect.height - 120),
        camera: CameraPreview.CAMERA_DIRECTION.BACK,
        tapPhoto: false,
        tapFocus: true,
        previewDrag: false,
        toBack: false, // Frente do modal
        alpha: 1
    };
    
    // Iniciar câmera
    CameraPreview.startCamera(opcoes, 
        function() {
            document.getElementById('statusCameraModal').innerHTML = '✅ Câmera ativa';
            window.cameraModalAtiva = true;
        },
        function(error) {
            document.getElementById('statusCameraModal').innerHTML = '❌ Erro: ' + error;
        }
    );
}

function capturarFotoModal() {
    if (typeof CameraPreview === 'undefined') return;
    
    document.getElementById('statusCameraModal').innerHTML = '📸 Capturando...';
    
    CameraPreview.takePicture({
        width: 640,
        height: 480,
        quality: 85
    }, 
    function(base64) {
        document.getElementById('statusCameraModal').innerHTML = '✅ Foto capturada!';
        
        // Fechar modal e mostrar resultado
        fecharCameraModal();
        
        // Mostrar foto na div original
        const blobURL = converterBase64ParaBlob(base64);
        const divCamera = document.getElementById('divCameraEspecial');

        localStorage.setItem("backupBlobURL",blobURL);

        // Adicionar a imagem ao feedback
        adicionarImagemAoFeedback(blobURL, 'camera');
        
        if (divCamera && blobURL) {
            divCamera.innerHTML = `
                <div style="text-align: center; padding: 15px; background: white; border-radius: 8px;">
                    <h4 style="color: #28a745; margin-bottom: 15px;">📸 Foto do Modal</h4>
                    <img src="${blobURL}" 
                         style="width: 100%; max-height: 300px; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
                    <div style="margin-top: 15px;">
                        <button onclick="usarCameraEspecialModal('Título do modal','Descrição ou instrução para o usuário')" 
                                style="padding: 10px 20px; background: #6f42c1; color: white; border: none; border-radius: 4px;">
                            📹 Nova Foto Modal
                        </button>
                    </div>
                </div>
            `;
        }
    },
    function(error) {
        document.getElementById('statusCameraModal').innerHTML = '❌ Erro: ' + error;
    });
}

function trocarCameraModal() {
    if (typeof CameraPreview !== 'undefined') {
        CameraPreview.switchCamera();
    }
}

function fecharCameraModal() {
    if (typeof CameraPreview !== 'undefined' && window.cameraModalAtiva) {
        CameraPreview.stopCamera();
        window.cameraModalAtiva = false;
    }
    
    const modal = document.getElementById('modalCameraEspecial');
    if (modal) {
        modal.remove();
    }
}



// FUNÇÃO PARA SELECIONAR DA GALERIA
function selecionarArquivosGaleria() {
    // Criar input file temporário
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true; // Permitir múltiplas seleções
    input.style.display = 'none';
    
    input.onchange = function(event) {
        const files = event.target.files;
        
        if (files.length > 0) {
            // Processar cada arquivo selecionado
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    // Converter arquivo para blob URL
                    const blobURL = URL.createObjectURL(file);
                    
                    // Adicionar à lista
                    adicionarImagemAoFeedback(blobURL, 'galeria');
                }
            });
        }
        
        // Remover input temporário
        document.body.removeChild(input);
    };
    
    // Adicionar ao DOM temporariamente e clicar
    document.body.appendChild(input);
    input.click();
}

// FUNÇÃO PARA ADICIONAR IMAGEM AO FEEDBACK
function adicionarImagemAoFeedback(blobURL, origem) {
    // Criar objeto da imagem
    const imagemObj = {
        id: Date.now() + Math.random(), // ID único
        url: blobURL,
        origem: origem, // 'camera' ou 'galeria'
        timestamp: new Date().toLocaleTimeString()
    };
    
    // Adicionar ao array
    imagensSelecionadas.push(imagemObj);
    
    // Atualizar interface
    atualizarFeedbackImagens();
}

// FUNÇÃO PARA ATUALIZAR O GRID DE IMAGENS
function atualizarFeedbackImagens() {
    const feedbackDiv = document.getElementById('feedbackDosArquivos');
    
    if (imagensSelecionadas.length === 0) {
        feedbackDiv.innerHTML = '';
        return;
    }
    
    let html = `
        <div class="feedback-header">
            <h5>Imagens Selecionadas (${imagensSelecionadas.length})</h5>
        </div>
        <div class="grid-imagens">
    `;
    
    imagensSelecionadas.forEach(imagem => {
        const origemIcon = imagem.origem === 'camera' ? '📸' : '🖼️';
        
        html += `
            <div class="item-imagem" data-id="${imagem.id}">
                <div class="imagem-container">
                    <img src="${imagem.url}" alt="Imagem selecionada" />
                    <button class="btn-remover" onclick="removerImagem('${imagem.id}')">
                        ❌
                    </button>
                    <div class="origem-badge">
                        ${origemIcon}
                    </div>
                </div>
                <div class="imagem-info">
                    <small>${imagem.timestamp}</small>
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
        <div class="feedback-actions">
            <button onclick="limparTodasImagens()" class="btn-limpar">
                Limpar Todas
            </button>
        </div>
    `;
    
    feedbackDiv.innerHTML = html;
}

// FUNÇÃO PARA REMOVER UMA IMAGEM
function removerImagem(id) {
    // Encontrar imagem no array
    const imagemIndex = imagensSelecionadas.findIndex(img => img.id == id);
    
    if (imagemIndex !== -1) {
        // Revogar blob URL para liberar memória
        URL.revokeObjectURL(imagensSelecionadas[imagemIndex].url);
        
        // Remover do array
        imagensSelecionadas.splice(imagemIndex, 1);
        
        // Atualizar interface
        atualizarFeedbackImagens();
    }
}

// FUNÇÃO PARA LIMPAR TODAS AS IMAGENS
function limparTodasImagens() {
    if (confirm('Deseja remover todas as imagens selecionadas?')) {
        // Revogar todos os blob URLs
        imagensSelecionadas.forEach(imagem => {
            URL.revokeObjectURL(imagem.url);
        });
        
        // Limpar array
        imagensSelecionadas = [];
        
        // Limpar localStorage backup
        localStorage.removeItem('backupBlobURL');
        
        // Atualizar interface
        atualizarFeedbackImagens();
    }
}

// FUNÇÃO PARA OBTER TODAS AS IMAGENS (PARA USO POSTERIOR)
function obterImagensSelecionadas() {
    return imagensSelecionadas;
}

// FUNÇÃO PARA LIMPAR MEMÓRIA (CHAMAR AO SAIR DA PÁGINA)
function limparMemoriaImagens() {
    imagensSelecionadas.forEach(imagem => {
        URL.revokeObjectURL(imagem.url);
    });
    imagensSelecionadas = [];
}




// Função para converter blob URL para base64
function blobURLParaBase64(blobURL) {
    return new Promise((resolve, reject) => {
        fetch(blobURL)
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onload = function() {
                    // Remover o prefixo data:image/...;base64, se existir
                    let base64 = this.result;
                    if (base64.includes(',')) {
                        base64 = base64.split(',')[1];
                    }
                    
                    // Validar se o base64 não está vazio
                    if (!base64 || base64.length < 100) {
                        reject(new Error('Base64 inválido ou muito pequeno'));
                        return;
                    }
                    
                    resolve(base64);
                };
                reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
                reader.readAsDataURL(blob);
            })
            .catch(error => reject(new Error('Erro ao converter blob: ' + error.message)));
    });
}


// Função principal para enviar documento para WordPress (usando XMLHttpRequest)
function enviarDocumentoParaWordPress(key) {
    const idUsuario = localStorage.getItem("idUsuario");
    
    if (!idUsuario) {
        alert('Erro: ID do usuário não encontrado');
        return;
    }
    
    if (imagensSelecionadas.length === 0) {
        alert('Nenhuma imagem selecionada');
        return;
    }
    
    // Mostrar loading
    document.getElementById('btnViewCadastro').innerHTML = 'Enviando...';
    document.getElementById('btnViewCadastro').disabled = true;
    
    // Converter primeira imagem para base64
    const primeiraImagem = imagensSelecionadas[0];
    
    blobURLParaBase64(primeiraImagem.url)
        .then(base64Image => {
            console.log("Debug imagem capturada:");
            console.log(base64Image);
            
            // Preparar dados para envio
            const dadosEnvio = {
                token: app.token,
                id_usuario: parseInt(idUsuario),
                campo_acf: key,
                imagem_base64: base64Image,
                nome_arquivo: `${key}_${idUsuario}_${Date.now()}.jpg`
            };
            
            // Configurar XMLHttpRequest
            let xhr = new XMLHttpRequest();
            xhr.open('POST', app.urlApi + 'upload-imagem-acf', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            xhr.onreadystatechange = () => {
                if(xhr.readyState == 4) {
                    if(xhr.status == 200) {
                        try {
                            const resultado = JSON.parse(xhr.responseText);
                            
                            if (resultado.sucesso === "200") {
                                aviso("Deu certo!", "Coloque uma mensagem de confirmação aqui...");
                                
                                // Limpar imagens após sucesso
                                limparTodasImagens();
                                localStorage.removeItem("acaoAcionamentoCamera");
                                
                            } else {
                                console.error('Erro retornado pela API:', resultado.erro);
                                aviso("Não foi possível enviar a sua imagem", `Ocorreu um erro: ${resultado.erro || 'Erro desconhecido'}`);
                            }
                        } catch (error) {
                            console.error('Erro ao processar resposta:', error);
                            aviso("Não foi possível enviar a sua imagem", `Erro ao processar resposta do servidor: ${error.message}`);
                        }
                    } else {
                        console.error('Erro HTTP:', xhr.status);
                        aviso("Não foi possível enviar a sua imagem", `Erro de conexão (${xhr.status}). Tente novamente em alguns minutos.`);
                    }
                    
                    // Restaurar botão sempre, independente do resultado
                    document.getElementById('btnViewCadastro').innerHTML = 'Enviar';
                    document.getElementById('btnViewCadastro').disabled = false;
                }
            };
            
            // Enviar dados como JSON
            xhr.send(JSON.stringify(dadosEnvio));
            
        })
        .catch(error => {
            console.error('Erro ao converter imagem para base64:', error);
            aviso("Não foi possível enviar a sua imagem", `Erro ao processar imagem: ${error.message}`);
            
            // Restaurar botão em caso de erro
            document.getElementById('btnViewCadastro').innerHTML = 'Enviar';
            document.getElementById('btnViewCadastro').disabled = false;
        });
}

