/**
 * Caçadores News - Lógica Principal
 */

const ADMIN_PASS = "1355";
let legends = JSON.parse(localStorage.getItem('cacadore_news_v3')) || [];
let isLoggedIn = false;
let currentLink = "";

// Inicializa a aplicação
function init() {
    renderLegends();
}

// Abre/Fecha o painel administrativo
function toggleAdminPanel() {
    const panel = document.getElementById('adminPanel');
    panel.classList.toggle('hidden');
}

// Verifica a senha de administrador
function verifyLogin() {
    const passInput = document.getElementById('adminPass');
    if (passInput.value === ADMIN_PASS) {
        isLoggedIn = true;
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('postForm').classList.remove('hidden');
        passInput.value = "";
        showToast("ACESSO PERMITIDO!");
        renderLegends();
    } else {
        showToast("SENHA INCORRETA!");
    }
}

// Faz logout do painel
function logout() {
    isLoggedIn = false;
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('postForm').classList.add('hidden');
    showToast("Sessão Encerrada");
    renderLegends();
}

// Adiciona uma nova lenda à lista
function addLegend() {
    const title = document.getElementById('legendTitle').value;
    const link = document.getElementById('youtubeLink').value;
    const desc = document.getElementById('legendDesc').value;

    if (!title || !link || !desc) {
        showToast("Complete o dossiê!");
        return;
    }

    // Tenta extrair o ID do vídeo para a miniatura
    let videoId = "";
    try {
        if(link.includes('v=')) {
            videoId = link.split('v=')[1].split('&')[0];
        } else if(link.includes('youtu.be/')) {
            videoId = link.split('youtu.be/')[1].split('?')[0];
        }
    } catch(e) {
        console.error("Erro ao ler link do YouTube");
    }

    const newLegend = {
        id: Date.now(),
        title,
        link,
        desc,
        videoId,
        date: new Date().toLocaleDateString('pt-BR')
    };

    legends.unshift(newLegend);
    localStorage.setItem('cacadore_news_v3', JSON.stringify(legends));
    renderLegends();

    // Limpa os campos
    document.getElementById('legendTitle').value = "";
    document.getElementById('youtubeLink').value = "";
    document.getElementById('legendDesc').value = "";
    showToast("LENDA PUBLICADA!");
}

// Remove uma lenda
function deleteLegend(id) {
    if(!confirm("Deseja destruir estas evidências?")) return;
    legends = legends.filter(l => l.id !== id);
    localStorage.setItem('cacadore_news_v3', JSON.stringify(legends));
    renderLegends();
    showToast("Evidência Apagada");
}

/**
 * Funções de Menu e Interface
 */

// Abre o menu de decisão (Abrir ou Copiar)
function openActionMenu(link, title) {
    currentLink = link;
    document.getElementById('menuTitle').innerText = title;
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('actionMenu').style.display = 'block';

    // Configura botões do menu
    document.getElementById('btnOpen').onclick = () => {
        window.open(currentLink, '_blank');
        closeMenu();
    };

    document.getElementById('btnCopy').onclick = () => {
        const tempInput = document.createElement("input");
        tempInput.value = currentLink;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy"); // Método compatível com iframes
        document.body.removeChild(tempInput);
        showToast("LINK COPIADO!");
        closeMenu();
    };
}

function closeMenu() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('actionMenu').style.display = 'none';
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.style.opacity = "1";
    setTimeout(() => { toast.style.opacity = "0"; }, 2500);
}

// Renderiza os cards no feed
function renderLegends() {
    const feed = document.getElementById('feed');
    const emptyMsg = document.getElementById('emptyMsg');

    if (legends.length === 0) {
        feed.innerHTML = "";
        emptyMsg.classList.remove('hidden');
        return;
    }

    emptyMsg.classList.add('hidden');
    feed.innerHTML = legends.map(legend => `
        <article class="legend-card p-6 shadow-xl relative overflow-hidden">
            <div class="absolute top-2 right-2">
                ${isLoggedIn ? `
                    <button onclick="deleteLegend(${legend.id})" class="bg-red-900/40 text-red-500 hover:bg-red-600 hover:text-white p-2 rounded text-xs font-bold transition-all uppercase">
                        Excluir
                    </button>
                ` : ''}
            </div>
            
            <div class="mb-4">
                <span class="text-[10px] bg-red-900 px-2 py-0.5 rounded text-white font-bold uppercase">${legend.date}</span>
                <h3 class="horror-font text-3xl text-red-600 mt-2">${legend.title}</h3>
            </div>

            <p class="text-gray-300 mb-6 text-sm leading-relaxed italic border-l-2 border-red-900 pl-4">
                "${legend.desc}"
            </p>

            <div class="flex flex-col sm:flex-row gap-4 items-center">
                ${legend.videoId ? `
                    <div class="w-full sm:w-40 h-24 bg-black rounded border border-red-900/50 overflow-hidden relative shadow-inner">
                        <img src="https://img.youtube.com/vi/${legend.videoId}/mqdefault.jpg" class="w-full h-full object-cover opacity-50">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-8 h-8 bg-red-700 rounded-full flex items-center justify-center text-[10px] play-icon-pulse">▶</div>
                        </div>
                    </div>
                ` : ''}
                
                <button onclick="openActionMenu('${legend.link}', '${legend.title}')" 
                        class="w-full sm:w-auto btn-horror px-8 py-4 rounded font-black text-center uppercase tracking-widest active:scale-95 shadow-lg">
                    ASSISTIR INVESTIGAÇÃO
                </button>
            </div>
        </article>
    `).join('');
}

// Carrega ao abrir a página
window.onload = init;

