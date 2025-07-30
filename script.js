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
let animationFrameId;

const logo = new Image();
logo.src = 'logo.png';

function startCamera(facingMode) {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    // --- O EXPERIMENTO: PEDINDO RESOLUÇÃO 4K ---
    // Trocamos o 'ideal' de 1920x1080 para 3840x2160 (4K UHD)
    const constraints = {
        video: {
            facingMode: facingMode,
            width: { ideal: 3840 },
            height: { ideal: 2160 }
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            currentStream = stream;
            video.srcObject = stream;
            video.play();
            drawFrame();
        })
        .catch(err => {
            console.error("Pedido de 4K falhou, tentando modo de segurança.", err);
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
            drawFrame();
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
    animationFrameId = requestAnimationFrame(drawFrame);
}
switchCamBtn.addEventListener('click', () => {
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    startCamera(currentFacingMode);
});
captureBtn.addEventListener('click', () => {
    cancelAnimationFrame(animationFrameId);
    showReviewView();
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    downloadLink.href = dataUrl;
    downloadLink.download = 'foto_evento_4K.jpg';
});
retakeBtn.addEventListener('click', () => {
    showLiveView();
    drawFrame();
});
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
startCamera(currentFacingMode);
showLiveView();
