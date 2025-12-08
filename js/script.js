/**
 * Sistema de Cadastro CASTRA PET
 * Script principal com validações e funcionalidades
 */

// Configuração global
const CONFIG = {
    API_CEP: 'https://viacep.com.br/ws',
    FORMATO_DATA: 'pt-BR',
    TIPOS_ANIMAIS: ['CÃO', 'GATO'],
    PORTES: ['PEQUENO', 'MEDIO', 'GRANDE'],
    MENSAGENS: {
        SUCESSO: 'Operação realizada com sucesso!',
        ERRO: 'Ocorreu um erro. Tente novamente.',
        CEP_INVALIDO: 'CEP inválido. Digite 8 números.',
        CEP_NAO_ENCONTRADO: 'CEP não encontrado.',
        CAMPOS_OBRIGATORIOS: 'Por favor, preencha todos os campos obrigatórios.',
        EMAIL_INVALIDO: 'Por favor, insira um email válido.',
        SALVANDO: 'Salvando dados...',
        SALVO_SUCESSO: 'Cadastro salvo com sucesso!'
    }
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema CASTRA PET inicializado');
    
    // Inicializar máscaras
    inicializarMascaras();
    
    // Inicializar eventos
    inicializarEventos();
    
    // Configurar auto-salvamento (opcional)
    configurarAutoSalvamento();
});

/**
 * Inicializa todas as máscaras de entrada
 */
function inicializarMascaras() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    // Máscara para celular
    const celInput = document.getElementById('cel');
    if (celInput) {
        celInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    // Máscara para CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 8) {
                value = value.substring(0, 8);
            }
            
            if (value.length >= 5) {
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    // Máscara para RG
    const rgInput = document.getElementById('rg');
    if (rgInput) {
        rgInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 9) {
                value = value.substring(0, 9);
            }
            
            if (value.length >= 2) {
                value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                value = value.replace(/\.(\d{3})(\d{1})$/, '.$1-$2');
            }
            
            e.target.value = value;
        });
    }
}

/**
 * Inicializa todos os eventos do sistema
 */
function inicializarEventos() {
    // Evento para buscar CEP ao pressionar Enter
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarCEP();
            }
        });
    }
    
    // Evento para auto-completar endereço quando CEP for preenchido
    if (cepInput) {
        cepInput.addEventListener('blur', function() {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                buscarCEP();
            }
        });
    }
    
    // Evento para validar email em tempo real
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', validarEmailTempoReal);
    }
    
    // Evento para fechar modal de mensagem com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharMensagem();
        }
    });
    
    // Prevenir envio do formulário com Enter
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.type !== 'button') {
                e.preventDefault();
            }
        });
    });
}

/**
 * Configura o auto-salvamento local (opcional)
 */
function configurarAutoSalvamento() {
    const campos = document.querySelectorAll('input, select');
    
    campos.forEach(campo => {
        campo.addEventListener('change', function() {
            salvarLocalmente();
        });
    });
    
    // Restaurar dados ao carregar a página
    window.addEventListener('load', restaurarLocalmente);
}

/**
 * Salva os dados localmente no localStorage
 */
function salvarLocalmente() {
    const dados = {};
    const campos = document.querySelectorAll('input, select');
    
    campos.forEach(campo => {
        if (campo.id) {
            dados[campo.id] = campo.value;
        }
    });
    
    try {
        localStorage.setItem('castraPetRascunho', JSON.stringify(dados));
    } catch (e) {
        console.warn('Não foi possível salvar localmente:', e);
    }
}

/**
 * Restaura dados do localStorage
 */
function restaurarLocalmente() {
    try {
        const dados = JSON.parse(localStorage.getItem('castraPetRascunho'));
        
        if (dados) {
            Object.keys(dados).forEach(id => {
                const campo = document.getElementById(id);
                if (campo && dados[id]) {
                    campo.value = dados[id];
                }
            });
            
            console.log('Dados restaurados do rascunho');
        }
    } catch (e) {
        console.warn('Não foi possível restaurar dados:', e);
    }
}

/**
 * Limpa o salvamento local
 */
function limparSalvamentoLocal() {
    localStorage.removeItem('castraPetRascunho');
}

/**
 * Busca endereço pelo CEP usando ViaCEP
 */
async function buscarCEP() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        mostrarMensagem(CONFIG.MENSAGENS.CEP_INVALIDO, 'erro');
        cepInput.focus();
        return;
    }
    
    mostrarCarregamento(true, 'Buscando endereço...');
    
    try {
        const response = await fetch(`${CONFIG.API_CEP}/${cep}/json/`);
        
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        
        const data = await response.json();
        
        if (data.erro) {
            mostrarMensagem(CONFIG.MENSAGENS.CEP_NAO_ENCONTRADO, 'erro');
            return;
        }
        
        // Preencher campos de endereço
        document.getElementById('logradouro').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';
        
        mostrarMensagem('Endereço encontrado com sucesso!');
        
        // Focar no campo número
        setTimeout(() => {
            document.getElementById('numero').focus();
        }, 300);
        
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        mostrarMensagem('Erro ao buscar CEP. Verifique sua conexão.', 'erro');
    } finally {
        mostrarCarregamento(false);
    }
}

/**
 * Valida email em tempo real
 */
function validarEmailTempoReal() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    
    if (email && !validarEmail(email)) {
        emailInput.classList.add('is-invalid');
        mostrarMensagem(CONFIG.MENSAGENS.EMAIL_INVALIDO, 'erro');
    } else {
        emailInput.classList.remove('is-invalid');
    }
}

/**
 * Valida formato de email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - True se email válido
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida CPF
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} - True se CPF válido
 */
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validar dígitos verificadores
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}

/**
 * Coleta todos os dados do formulário
 * @returns {Object} - Objeto com todos os dados
 */
function coletarDados() {
    return {
        // Informações do animal
        microchip: document.getElementById('microchip').value,
        animal: document.getElementById('animal').value,
        especie: document.getElementById('especie').value,
        sexo: document.getElementById('sexo').value,
        pelagem: document.getElementById('pelagem').value,
        idade: document.getElementById('idade').value,
        porte: document.getElementById('porte').value,
        raca: document.getElementById('raca').value,
        castra: document.getElementById('castra').value,
        
        // Informações do tutor
        tutor: document.getElementById('tutor').value,
        cpf: document.getElementById('cpf').value,
        rg: document.getElementById('rg').value,
        cel: document.getElementById('cel').value,
        email: document.getElementById('email').value,
        
        // Endereço
        cep: document.getElementById('cep').value,
        logradouro: document.getElementById('logradouro').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        
        // Metadados
        dataCadastro: new Date().toISOString(),
        timestamp: Date.now()
    };
}

/**
 * Valida todos os campos do formulário
 * @returns {boolean} - True se válido
 */
function validarFormulario() {
    const dados = coletarDados();
    
    // Lista de campos obrigatórios
    const camposObrigatorios = [
        'animal', 'especie', 'sexo', 'pelagem', 'idade',
        'porte', 'raca', 'castra', 'tutor', 'cpf', 'rg',
        'cel', 'cep', 'logradouro', 'numero', 'bairro',
        'cidade', 'estado'
    ];
    
    // Verificar campos obrigatórios
    for (const campo of camposObrigatorios) {
        if (!dados[campo] || dados[campo].toString().trim() === '') {
            mostrarMensagem(`Campo obrigatório não preenchido: ${formatarNomeCampo(campo)}`, 'erro');
            
            // Focar no campo faltante
            const campoElemento = document.getElementById(campo);
            if (campoElemento) {
                campoElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
                campoElemento.focus();
            }
            
            return false;
        }
    }
    
    // Validar CPF
    if (!validarCPF(dados.cpf)) {
        mostrarMensagem('CPF inválido. Verifique o número digitado.', 'erro');
        document.getElementById('cpf').focus();
        return false;
    }
    
    // Validar email se fornecido
    if (dados.email && !validarEmail(dados.email)) {
        mostrarMensagem('Email inválido. Verifique o endereço digitado.', 'erro');
        document.getElementById('email').focus();
        return false;
    }
    
    return true;
}

/**
 * Formata nome do campo para exibição
 * @param {string} campo - Nome do campo
 * @returns {string} - Nome formatado
 */
function formatarNomeCampo(campo) {
    const nomes = {
        animal: 'Nome do Animal',
        especie: 'Espécie',
        sexo: 'Sexo',
        pelagem: 'Pelagem',
        idade: 'Idade',
        porte: 'Porte',
        raca: 'Raça',
        castra: 'Castrado',
        tutor: 'Nome do Tutor',
        cpf: 'CPF',
        rg: 'RG',
        cel: 'Celular',
        cep: 'CEP',
        logradouro: 'Logradouro',
        numero: 'Número',
        bairro: 'Bairro',
        cidade: 'Cidade',
        estado: 'Estado'
    };
    
    return nomes[campo] || campo;
}

/**
 * Salva os dados como arquivo CSV
 */
function salvarComoCSV() {
    if (!validarFormulario()) {
        return;
    }
    
    mostrarCarregamento(true, CONFIG.MENSAGENS.SALVANDO);
    
    const dados = coletarDados();
    
    // Criar linha CSV
    const cabecalho = Object.keys(dados).join(';');
    const valores = Object.values(dados).map(valor => {
        // Escapar ponto-e-vírgula e quebras de linha
        const strValor = String(valor || '');
        return `"${strValor.replace(/"/g, '""')}"`;
    }).join(';');
    
    const conteudoCSV = cabecalho + '\n' + valores;
    
    // Criar blob
    const blob = new Blob(['\ufeff' + conteudoCSV], {
        type: 'text/csv;charset=utf-8;'
    });
    
    // Criar link de download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = `castra_pet_${dados.animal}_${dados.timestamp}.csv`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Limpar
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        mostrarCarregamento(false);
        mostrarMensagem(CONFIG.MENSAGENS.SALVO_SUCESSO);
        
        // Limpar salvamento local após sucesso
        limparSalvamentoLocal();
    }, 1000);
}

/**
 * Salva os dados como arquivo JSON
 */
function salvarComoJSON() {
    if (!validarFormulario()) {
        return;
    }
    
    mostrarCarregamento(true, CONFIG.MENSAGENS.SALVANDO);
    
    const dados = coletarDados();
    const conteudoJSON = JSON.stringify(dados, null, 2);
    
    // Criar blob
    const blob = new Blob([conteudoJSON], {
        type: 'application/json;charset=utf-8'
    });
    
    // Criar link de download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = `castra_pet_${dados.animal}_${dados.timestamp}.json`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    // Limpar
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        mostrarCarregamento(false);
        mostrarMensagem('Dados salvos como JSON com sucesso!');
    }, 1000);
}

/**
 * Gera um relatório em formato de texto
 */
function gerarRelatorioTexto() {
    if (!validarFormulario()) {
        return;
    }
    
    const dados = coletarDados();
    
    // Formatar data
    const dataFormatada = new Date(dados.dataCadastro).toLocaleString(CONFIG.FORMATO_DATA);
    
    // Criar relatório
    let relatorio = '='.repeat(60) + '\n';
    relatorio += 'RELATÓRIO CASTRA PET\n';
    relatorio += '='.repeat(60) + '\n\n';
    
    relatorio += 'INFORMAÇÕES DO ANIMAL:\n';
    relatorio += '-'.repeat(30) + '\n';
    relatorio += `Nome: ${dados.animal}\n`;
    relatorio += `Espécie: ${dados.especie}\n`;
    relatorio += `Sexo: ${dados.sexo}\n`;
    relatorio += `Pelagem: ${dados.pelagem}\n`;
    relatorio += `Idade: ${dados.idade}\n`;
    relatorio += `Porte: ${dados.porte}\n`;
    relatorio += `Raça definida: ${dados.raca}\n`;
    relatorio += `Castrado: ${dados.castra}\n`;
    relatorio += `Microchip: ${dados.microchip || 'Não informado'}\n\n`;
    
    relatorio += 'INFORMAÇÕES DO TUTOR:\n';
    relatorio += '-'.repeat(30) + '\n';
    relatorio += `Nome: ${dados.tutor}\n`;
    relatorio += `CPF: ${dados.cpf}\n`;
    relatorio += `RG: ${dados.rg}\n`;
    relatorio += `Celular: ${dados.cel}\n`;
    relatorio += `Email: ${dados.email || 'Não informado'}\n\n`;
    
    relatorio += 'ENDEREÇO:\n';
    relatorio += '-'.repeat(30) + '\n';
    relatorio += `${dados.logradouro}, ${dados.numero}\n`;
    relatorio += `${dados.complemento ? 'Complemento: ' + dados.complemento + '\n' : ''}`;
    relatorio += `Bairro: ${dados.bairro}\n`;
    relatorio += `Cidade: ${dados.cidade} - ${dados.estado}\n`;
    relatorio += `CEP: ${dados.cep}\n\n`;
    
    relatorio += 'DATA E HORA DO CADASTRO:\n';
    relatorio += '-'.repeat(30) + '\n';
    relatorio += `${dataFormatada}\n\n`;
    
    relatorio += '='.repeat(60) + '\n';
    relatorio += 'Sistema CASTRA PET - Cadastro de Animais\n';
    relatorio += '='.repeat(60);
    
    // Abrir em nova janela
    const janela = window.open('', '_blank');
    janela.document.write('<pre>' + relatorio + '</pre>');
    janela.document.title = `Relatório - ${dados.animal}`;
}

/**
 * Mostra mensagem para o usuário
 * @param {string} texto - Texto da mensagem
 * @param {string} tipo - Tipo da mensagem (sucesso, erro, info)
 */
function mostrarMensagem(texto, tipo = 'info') {
    const mensagemDiv = document.getElementById('message-text');
    const fadeDiv = document.getElementById('fade');
    const messageDiv = document.getElementById('message');
    
    if (!mensagemDiv || !fadeDiv || !messageDiv) {
        alert(texto);
        return;
    }
    
    mensagemDiv.textContent = texto;
    
    // Definir classe baseada no tipo
    messageDiv.className = 'hide';
    if (tipo === 'erro') {
        messageDiv.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4><i class="fas fa-exclamation-triangle mr-2"></i>Atenção</h4>
                <p id="message-text">${texto}</p>
                <button id="close-message" type="button" class="btn btn-danger">Fechar</button>
            </div>
        `;
    } else if (tipo === 'sucesso') {
        messageDiv.innerHTML = `
            <div class="alert alert-success" role="alert">
                <h4><i class="fas fa-check-circle mr-2"></i>Sucesso!</h4>
                <p id="message-text">${texto}</p>
                <button id="close-message" type="button" class="btn btn-success">OK</button>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="alert alert-info" role="alert">
                <h4><i class="fas fa-info-circle mr-2"></i>Informação</h4>
                <p id="message-text">${texto}</p>
                <button id="close-message" type="button" class="btn btn-info">Fechar</button>
            </div>
        `;
    }
    
    fadeDiv.classList.remove('hide');
    messageDiv.classList.remove('hide');
    
    // Reatribuir evento ao botão de fechar
    document.getElementById('close-message').addEventListener('click', fecharMensagem);
}

/**
 * Fecha a mensagem atual
 */
function fecharMensagem() {
    const fadeDiv = document.getElementById('fade');
    const messageDiv = document.getElementById('message');
    
    if (fadeDiv) fadeDiv.classList.add('hide');
    if (messageDiv) messageDiv.classList.add('hide');
}

/**
 * Mostra/oculta indicador de carregamento
 * @param {boolean} mostrar - Mostrar ou ocultar
 * @param {string} mensagem - Mensagem opcional
 */
function mostrarCarregamento(mostrar, mensagem = 'Processando...') {
    const loader = document.getElementById('loader');
    const fade = document.getElementById('fade');
    const messageDiv = document.getElementById('message');
    
    if (!loader || !fade) return;
    
    if (mostrar) {
        fade.classList.remove('hide');
        loader.classList.remove('hide');
        
        if (messageDiv) {
            messageDiv.classList.add('hide');
        }
    } else {
        fade.classList.add('hide');
        loader.classList.add('hide');
    }
}

/**
 * Exporta dados para múltiplos formatos
 */
function exportarDados() {
    const formatos = [
        { nome: 'CSV', funcao: salvarComoCSV },
        { nome: 'JSON', funcao: salvarComoJSON },
        { nome: 'Relatório Texto', funcao: gerarRelatorioTexto }
    ];
    
    let opcoes = 'Escolha o formato de exportação:\n\n';
    formatos.forEach((formato, index) => {
        opcoes += `${index + 1}. ${formato.nome}\n`;
    });
    
    const escolha = prompt(opcoes + '\nDigite o número da opção:');
    const indice = parseInt(escolha) - 1;
    
    if (indice >= 0 && indice < formatos.length) {
        formatos[indice].funcao();
    } else {
        mostrarMensagem('Opção inválida!', 'erro');
    }
}

/**
 * Limpa todo o formulário
 */
function limparFormulario() {
    if (!confirm('Tem certeza que deseja limpar todos os campos?')) {
        return;
    }
    
    // Limpar inputs
    document.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => {
        input.value = '';
    });
    
    // Resetar selects
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Limpar salvamento local
    limparSalvamentoLocal();
    
    mostrarMensagem('Formulário limpo com sucesso!');
    
    // Focar no primeiro campo
    document.getElementById('microchip').focus();
}

// Exportar funções globais
window.salvarComoCSV = salvarComoCSV;
window.salvarComoJSON = salvarComoJSON;
window.gerarRelatorioTexto = gerarRelatorioTexto;
window.exportarDados = exportarDados;
window.limparFormulario = limparFormulario;
window.buscarCEP = buscarCEP;
window.validarESalvar = salvarComoCSV;
