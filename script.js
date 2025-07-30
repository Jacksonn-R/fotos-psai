// ... (todo o código anterior permanece o mesmo até a função drawFrame)
const resolutionInfo = document.getElementById('resolution-info'); // Pega o novo elemento

// ...

function drawFrame() {
    if (video.paused || video.ended) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const logoWidth = canvas.width * 0.3;
    const logoHeight = logo.height * (logoWidth / logo.width);
    const margin = canvas.width * 0.05;
    context.drawImage(logo, canvas.width - logoWidth - margin, canvas.height - logoHeight - margin, logoWidth, logoHeight);
    
    // --- NOVIDADE: ATUALIZA O MEDIDOR DE QUALIDADE ---
    resolutionInfo.textContent = `Resolução: ${video.videoWidth}x${video.videoHeight}`;

    requestAnimationFrame(drawFrame);
}

// ... (todo o resto do código permanece o mesmo)
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');
const switchCamBtn = document.getElementById('switch-cam-btn');
const downloadLink = document.getElementById('download-link');
// const resolutionInfo = document.getElementById('resolution-info'); // A linha já foi declarada no topo do pensamento, mas o usuário precisa dela aqui. Vou reestruturar para o usuário.

// A versão correta para o usuário:
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');
const switchCamBtn = document.getElementById('switch-cam-btn');
const downloadLink = document.getElementById('download-link');
const resolutionInfo = document.getElementById('resolution-info'); // Pega o novo elemento de texto

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
    
    // ATUALIZA O MEDIDOR
    resolutionInfo.textContent = `Resolução: ${video.videoWidth}x${video.videoHeight}`;

    requestAnimationFrame(drawFrame);
}

switchCamBtn.addEventListener('click', () => {
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    startCamera(currentFacingMode);
});

captureBtn.addEventListener('click', () => {
    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    downloadLink.href = dataUrl;
    downloadLink.download = 'foto_evento_HD.jpg';
    downloadLink.style.display = 'block';
    captureBtn.style.display = 'none';
    switchCamBtn.style.display = 'none';
});

startCamera(currentFacingMode);
