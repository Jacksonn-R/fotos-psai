const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');
const switchCamBtn = document.getElementById('switch-cam-btn'); // Pega o novo botão
const downloadLink = document.getElementById('download-link');

// Variável para guardar a câmera atual e o stream de vídeo
let currentFacingMode = 'user'; // Começa com a câmera frontal ('user')
let currentStream;

// Carregar a imagem do seu logo
const logo = new Image();
logo.src = 'logo.png';

// Função para iniciar a câmera com a configuração desejada
function startCamera(facingMode) {
    // Se já houver um stream (câmera ligada), pare-o primeiro
    if (currentStream) {
        currentStream.getTracks().forEach(track => {
            track.stop();
        });
    }

    // Configurações para a nova câmera
    const constraints = {
        video: {
            facingMode: facingMode
        }
    };

    // Pede acesso à nova câmera
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            currentStream = stream; // Guarda o novo stream
            video.srcObject = stream;
            video.play();
            requestAnimationFrame(drawFrame); // Inicia o desenho na tela
        })
        .catch(err => {
            console.error("Erro ao acessar a câmera: ", err);
            alert("Não foi possível acessar a câmera. Verifique as permissões ou se a câmera selecionada existe no seu aparelho.");
        });
}

// Função para desenhar o vídeo e o logo no canvas (como antes)
function drawFrame() {
    if (video.paused || video.ended) return; // Não desenha se o vídeo não estiver rodando

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const logoWidth = canvas.width * 0.3;
    const logoHeight = logo.height * (logoWidth / logo.width);
    const margin = canvas.width * 0.05;
    context.drawImage(logo, canvas.width - logoWidth - margin, canvas.height - logoHeight - margin, logoWidth, logoHeight);
    
    requestAnimationFrame(drawFrame);
}

// Lógica para o botão de troca de câmera
switchCamBtn.addEventListener('click', () => {
    // Inverte a câmera atual
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    // Reinicia a câmera com a nova configuração
    startCamera(currentFacingMode);
});

// Lógica para tirar a foto (como antes)
captureBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/jpeg');
    downloadLink.href = dataUrl;
    downloadLink.download = 'foto_evento.jpg';
    downloadLink.style.display = 'block';
    captureBtn.style.display = 'none';
    switchCamBtn.style.display = 'none'; // Esconde o botão de troca também
});

// Inicia a câmera frontal quando a página carrega
startCamera(currentFacingMode);
