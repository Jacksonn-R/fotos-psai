const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');
const switchCamBtn = document.getElementById('switch-cam-btn');
const downloadLink = document.getElementById('download-link');

let currentFacingMode = 'user';
let currentStream;

const logo = new Image();
logo.src = 'logo.png';

function startCamera(facingMode) {
    if (currentStream) {
        currentStream.getTracks().forEach(track => {
            track.stop();
        });
    }

    // --- MUDANÇA 1: PEDINDO MAIOR RESOLUÇÃO ---
    // Agora pedimos a resolução "ideal" de 1920x1080 (Full HD).
    // O navegador tentará atender a este pedido.
    const constraints = {
        video: {
            facingMode: facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            currentStream = stream;
            video.srcObject = stream;
            video.play();
            requestAnimationFrame(drawFrame);
        })
        .catch(err => {
            console.error("Erro ao acessar a câmera: ", err);
            alert("Não foi possível acessar a câmera com alta resolução. Tentando com uma resolução menor...");
            // Se falhar, tenta iniciar com as configurações padrão
            startCameraFallback(facingMode);
        });
}

// Função de fallback caso a alta resolução não funcione
function startCameraFallback(facingMode) {
     const constraints = { video: { facingMode: facingMode } };
     navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            currentStream = stream;
            video.srcObject = stream;
            video.play();
            requestAnimationFrame(drawFrame);
        })
        .catch(err => {
            console.error("Erro ao acessar a câmera no modo fallback: ", err);
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
    
    requestAnimationFrame(drawFrame);
}

switchCamBtn.addEventListener('click', () => {
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    startCamera(currentFacingMode);
});

captureBtn.addEventListener('click', () => {
    // --- MUDANÇA 2: AUMENTANDO A QUALIDADE DO ARQUIVO JPG ---
    // O '1.0' significa 100% de qualidade, sem compressão.
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    
    downloadLink.href = dataUrl;
    downloadLink.download = 'foto_evento_HD.jpg'; // Mudei o nome para indicar a alta qualidade
    downloadLink.style.display = 'block';
    captureBtn.style.display = 'none';
    switchCamBtn.style.display = 'none';
});

startCamera(currentFacingMode);
