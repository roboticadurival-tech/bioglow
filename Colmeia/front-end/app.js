const API_URL = 'http://localhost:3000';

async function carregarUltimaLeitura() {
  try {
    const resposta = await fetch(`${API_URL}/telemetria`);

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }

    const leituras = await resposta.json();

    if (!Array.isArray(leituras) || leituras.length === 0) {
      console.warn('Nenhuma leitura encontrada ainda.');
      return;
    }

    // A mais recente é a primeira da lista (assumindo ordem decrescente por data)
    const ultima = leituras[0];
    atualizarCards(ultima);

  } catch (erro) {
    console.error('Falha ao buscar telemetria:', erro);
    mostrarErroNosCards();
  }
}

function atualizarCards(leitura) {
  // 1. Temperatura
  const temp = Number(leitura.tempInterna);
  document.getElementById('valor-temperatura').textContent = !isNaN(temp) 
    ? `${temp.toFixed(1)} °C` 
    : '-- °C';

  // 2. Umidade
  const umidade = Number(leitura.umidadeInterna);
  document.getElementById('valor-umidade').textContent = !isNaN(umidade) 
    ? `${umidade.toFixed(0)} %` 
    : '-- %';

  // 3. Peso (Corrigido de pesokg para pesoKg)
  const peso = Number(leitura.pesoKg);
  document.getElementById('valor-peso').textContent = !isNaN(peso) 
    ? `${peso.toFixed(1)} kg` 
    : '-- kg';
}

function mostrarErroNosCards() {
  document.getElementById('valor-temperatura').textContent = '-- °C';
  document.getElementById('valor-umidade').textContent = '-- %';
  document.getElementById('valor-peso').textContent = `${leitura.pesoKg} kg`;
}

// Busca assim que a página carrega
const INTERVALO_ATUALIZACAO_MS = 15000; // 15 segundos

carregarUltimaLeitura(); // busca imediatamente ao abrir a página
setInterval(carregarUltimaLeitura, INTERVALO_ATUALIZACAO_MS);

const CAMERA_URL = 'http://192.168.14.36:81/stream'; // troque SEU_IP pelo IP da câmera

function iniciarCamera() {
  const img = document.getElementById('camera-stream');
  const status = document.getElementById('camera-status');

  img.hidden = false;
  status.hidden = true;

  img.onerror = () => {
    img.hidden = true;
    status.hidden = false;
    setTimeout(iniciarCamera, 10000); // tenta reconectar em 10 segundos
  };

  img.src = CAMERA_URL;
}

iniciarCamera();