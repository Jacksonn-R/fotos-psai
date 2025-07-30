const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');
const downloadLink = document.getElementById('download-link');

// 1. Carregar a imagem do seu logo
const logo = new Image();
logo.src = 'logo.png'; // <-- IMPORTANTE: Seu logo deve estar na mesma pasta e com este nome!

// 2. Pedir acesso à câmera do usuário
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
    .then(stream => {
        video.srcObject = stream;
        drawFrame(); // Inicia o desenho contínuo
    })
    .catch(err => {
        console.error("Erro ao acessar a câmera: ", err);
        alert("Não foi possível acessar a câmera. Por favor, dê permissão no seu navegador.");
    });

// 3. Função para desenhar o vídeo e o logo no canvas
function drawFrame() {
    // Define o tamanho do canvas igual ao do container
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Desenha o frame atual do vídeo no canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Desenha o logo sobre o vídeo
    const logoWidth = canvas.width * 0.3; // Logo terá 30% da largura da foto
    const logoHeight = logo.height * (logoWidth / logo.width); // Mantém proporção
    const margin = canvas.width * 0.05; // Margem de 5%
    // Posição: canto inferior direito
    context.drawImage(logo, canvas.width - logoWidth - margin, canvas.height - logoHeight - margin, logoWidth, logoHeight);

    // Continua desenhando no próximo frame
    requestAnimationFrame(drawFrame);
}


// 4. Lógica para tirar a foto
captureBtn.addEventListener('click', () => {
    // O canvas já tem a imagem com o logo, então apenas preparamos o download
    const dataUrl = canvas.toDataURL('image/jpeg');
    downloadLink.href = dataUrl;
    downloadLink.download = 'foto_evento.jpg'; // Nome do arquivo baixado
    downloadLink.style.display = 'block'; // Mostra o botão de download
    captureBtn.style.display = 'none'; // Esconde o botão de tirar foto
});