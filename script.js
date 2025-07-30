const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');
const switchCamBtn = document.getElementById('switch-cam-btn');
const downloadLink = document.getElementById('download-link');
const resolutionInfo = document.getElementById('resolution-info'); // Pega o medidor

let currentFacingMode = 'user';
let currentStream;

const logo = new Image();
logo.src = 'logo.png';

// Função para iniciar a câmera de forma simples e segura
function startCamera(facingMode) {
    // Se já houver um stream, pare-o primeiro
    if (currentStream) {
        currentStream.getTracks().forEach(track => {
            track.stop();
        });
    }

    // Voltamos para as configurações simples, sem pedir resolução específica
    const constraints = {
        video: {
            facingMode: facingMode
        }
    };

    // Pede acesso à câmera
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            currentStream = stream;
            video.srcObject = stream;
            video.play();
            requestAnimationFrame(drawFrame); // Inicia o desenho na tela
        })
        .catch(err => {
            console.error("Erro ao acessar a câmera: ", err);
            alert("Não foi possível acessar a câmera. Por favor, verifique nas configurações do seu navegador se a permissão para a câmera não foi bloqueada para este site.");
        });
}

// Função para desenhar o vídeo, o logo e a resolução na tela
function drawFrame() {
    if (video.paused || video.ended) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const logoWidth = canvas.width * 0.3;
    const logoHeight = logo.height * (logoWidth / logo.width);
    const margin = canvas.width * 0.05;
    context.drawImage(logo, canvas.width - logoWidth - margin, canvas.height - logoHeight - margin, logoWidth, logoHeight);
    
    // ATUALIZA O MEDIDOR DE QUALIDADE
    resolutionInfo.textContent = `Resolução: ${video.videoWidth}x${video.videoHeight}`;

    requestAnimationFrame(drawFrame);
}

// Lógica para o botão de troca de câmera
switchCamBtn.addEventListener('click', () => {
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    startCamera(currentFacingMode);
});

// Lógica para tirar a foto
captureBtn.addEventListener('click', () => {
    // Mantemos a qualidade máxima do JPG, isso não causa problemas.
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    
    downloadLink.href = dataUrl;
    downloadLink.download = 'foto_evento.jpg';
    downloadLink.style.display = 'block';
    captureBtn.style.display = 'none';
    switchCamBtn.style.display = 'none';
});

// Inicia a câmera com as configurações seguras
startCamera(currentFacingMode);
