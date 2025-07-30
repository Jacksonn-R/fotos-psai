const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');
const switchCamBtn = document.getElementById('switch-cam-btn');
const downloadLink = document.getElementById('download-link');
const retakeBtn = document.getElementById('retake-btn');
const resolutionInfo = document.getElementById('resolution-info');

let currentFacingMode = 'user';
let currentStream;
let animationFrameId; // Variável para controlar o nosso "pintor" (o loop de desenho)

const logo = new Image();
logo.src = 'logo.png';

function startCamera(facingMode) {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    // Para o pintor antes de iniciar uma nova câmera
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    const constraints = { video: { facingMode: facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } } };
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            currentStream = stream;
            video.srcObject = stream;
            video.play();
            drawFrame(); // Inicia o pintor
        })
        .catch(err => {
            console.error("Pedido de alta resolução falhou, tentando modo de segurança.", err);
            startCameraFallback(facingMode);
        });
}
function startCameraFallback(facingMode) {
     const constraints = { video: { facingMode: facingMode } };
     navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            currentStream = stream;
            video.srcObject = stream;
            video.play();
            drawFrame(); // Inicia o pintor
        })
        .catch(err => {
            console.error("Erro fatal, não foi possível acessar a câmera.", err);
            alert("Não foi possível acessar a câmera.");
        });
}
function drawFrame() {
    if (video.paused || video.ended) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const logoWidth = canvas.width * 0.3;
    const logoHeight = logo.height * (logoWidth / logo.width);
    const margin = canvas.width * 0.05;
    context.drawImage(logo, canvas.width - logoWidth - margin, canvas.height - logoHeight - margin, logoWidth, logoHeight);
    resolutionInfo.textContent = `Resolução: ${video.videoWidth}x${video.videoHeight}`;
    
    // Pede ao pintor para pintar o próximo quadro e guarda o 'ID' do pedido
    animationFrameId = requestAnimationFrame(drawFrame);
}
switchCamBtn.addEventListener('click', () => {
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    startCamera(currentFacingMode);
});


// --- Lógica da Captura e Revisão CORRIGIDA ---

function showLiveView() {
    video.style.display = 'block';
    captureBtn.style.display = 'inline-block';
    switchCamBtn.style.display = 'inline-block';
    downloadLink.style.display = 'none';
    retakeBtn.style.display = 'none';
}

function showReviewView() {
    video.style.display = 'none'; 
    captureBtn.style.display = 'none';
    switchCamBtn.style.display = 'none';
    downloadLink.style.display = 'inline-block';
    retakeBtn.style.display = 'inline-block';
}

captureBtn.addEventListener('click', () => {
    // --- CORREÇÃO IMPORTANTE: DÁ O COMANDO 'PARE' PARA O PINTOR ---
    cancelAnimationFrame(animationFrameId);

    // Agora, a imagem no canvas está verdadeiramente congelada.
    showReviewView();

    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    downloadLink.href = dataUrl;
    downloadLink.download = 'foto_evento_HD.jpg';
});

retakeBtn.addEventListener('click', () => {
    // Volta para a interface da câmera ao vivo
    showLiveView();
    // --- CORREÇÃO IMPORTANTE: DÁ O COMANDO 'CONTINUE' PARA O PINTOR ---
    drawFrame();
});

// Inicia a câmera e a interface
startCamera(currentFacingMode);
showLiveView();
