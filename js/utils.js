/**
 * CASTRA PET - Utilitários Gerais
 * Funções utilitárias para todo o sistema
 */

const Utils = {
    /**
     * Formata uma data para o padrão brasileiro
     * @param {Date|string} data - Data a ser formatada
     * @param {boolean} incluirHora - Incluir hora na formatação
     * @returns {string} Data formatada
     */
    formatarData: function(data, incluirHora = false) {
        try {
            const dataObj = new Date(data);
            if (isNaN(dataObj.getTime())) return 'Data inválida';
            
            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            };
            
            if (incluirHora) {
                // Usa toLocaleString para incluir hora corretamente
                const optionsHora = {
                    ...options,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                };
                return dataObj.toLocaleString('pt-BR', optionsHora);
            }
            
            return dataObj.toLocaleDateString('pt-BR', options);
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return '--/--/----';
        }
    },

    /**
     * Formata CPF
     * @param {string} cpf - CPF sem formatação
     * @returns {string} CPF formatado
     */
    formatarCPF: function(cpf) {
        if (!cpf) return '';
        cpf = cpf.replace(/\D/g, '');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },

    /**
     * Formata telefone
     * @param {string} telefone - Telefone sem formatação
     * @returns {string} Telefone formatado
     */
    formatarTelefone: function(telefone) {
        if (!telefone) return '';
        telefone = telefone.replace(/\D/g, '');
        
        if (telefone.length === 11) {
            return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (telefone.length === 10) {
            return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        
        return telefone;
    },

    /**
     * Formata CEP
     * @param {string} cep - CEP sem formatação
     * @returns {string} CEP formatado
     */
    formatarCEP: function(cep) {
        if (!cep) return '';
        cep = cep.replace(/\D/g, '');
        return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    },

    /**
     * Gera um ID único
     * @returns {string} ID único
     */
    gerarID: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    /**
     * Formata número para moeda brasileira
     * @param {number} valor - Valor a ser formatado
     * @returns {string} Valor formatado
     */
    formatarMoeda: function(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    },

    /**
     * Limpa a máscara de um valor
     * @param {string} valor - Valor com máscara
     * @returns {string} Valor limpo
     */
    limparMascara: function(valor) {
        return valor ? valor.replace(/\D/g, '') : '';
    },

    /**
     * Capitaliza a primeira letra de cada palavra
     * @param {string} texto - Texto a ser capitalizado
     * @returns {string} Texto capitalizado
     */
    capitalizar: function(texto) {
        if (!texto) return '';
        return texto.toLowerCase()
            .split(' ')
            .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
            .join(' ');
    },

    /**
     * Trunca texto se for muito longo
     * @param {string} texto - Texto original
     * @param {number} limite - Limite de caracteres
     * @returns {string} Texto truncado
     */
    truncarTexto: function(texto, limite = 50) {
        if (!texto) return '';
        if (texto.length <= limite) return texto;
        return texto.substring(0, limite) + '...';
    },

    /**
     * Valida se é um objeto vazio
     * @param {Object} obj - Objeto a ser verificado
     * @returns {boolean} True se vazio
     */
    isEmpty: function(obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    },

    /**
     * Clona um objeto profundamente
     * @param {Object} obj - Objeto a ser clonado
     * @returns {Object} Clone do objeto
     */
    deepClone: function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Debounce function
     * @param {Function} func - Função a ser debounced
     * @param {number} wait - Tempo de espera em ms
     * @returns {Function} Função debounced
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function
     * @param {Function} func - Função a ser throttled
     * @param {number} limit - Limite de tempo em ms
     * @returns {Function} Função throttled
     */
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Copia texto para área de transferência
     * @param {string} texto - Texto a ser copiado
     * @returns {Promise<boolean>} Sucesso da operação
     */
    copiarParaAreaTransferencia: async function(texto) {
        try {
            await navigator.clipboard.writeText(texto);
            return true;
        } catch (err) {
            console.error('Erro ao copiar:', err);
            // Fallback para navegadores antigos
            const textArea = document.createElement('textarea');
            textArea.value = texto;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        }
    },

    /**
     * Faz download de um arquivo
     * @param {string} conteudo - Conteúdo do arquivo
     * @param {string} nomeArquivo - Nome do arquivo
     * @param {string} tipo - Tipo MIME
     */
    downloadArquivo: function(conteudo, nomeArquivo, tipo = 'text/plain') {
        const blob = new Blob([conteudo], { type: tipo });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = nomeArquivo;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Obtém a idade a partir da data de nascimento
     * @param {string} dataNascimento - Data de nascimento
     * @returns {number} Idade em anos
     */
    calcularIdade: function(dataNascimento) {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade;
    },

    /**
     * Formata bytes para tamanho legível
     * @param {number} bytes - Bytes
     * @param {number} decimais - Casas decimais
     * @returns {string} Tamanho formatado
     */
    formatarTamanhoArquivo: function(bytes, decimais = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimais < 0 ? 0 : decimais;
        const tamanhos = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + tamanhos[i];
    },

    /**
     * Verifica conexão com internet
     * @returns {Promise<boolean>} Status da conexão
     */
    verificarConexao: async function() {
        try {
            const response = await fetch('https://www.google.com', { 
                mode: 'no-cors',
                cache: 'no-store'
            });
            return true;
        } catch (error) {
            return false;
        }
    },

    /**
     * Sleep function
     * @param {number} ms - Milissegundos
     * @returns {Promise} Promise que resolve após o tempo
     */
    sleep: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Serializa objeto para URL
     * @param {Object} obj - Objeto a ser serializado
     * @returns {string} String serializada
     */
    serializarParaURL: function(obj) {
        return Object.keys(obj)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
            .join('&');
    },

    /**
     * Limpa localStorage relacionado ao sistema
     */
    limparCache: function() {
        const prefixo = CONFIG.STORAGE.PREFIXO;
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(prefixo)) {
                localStorage.removeItem(key);
            }
        });
        Notificacoes.mostrar('Cache limpo com sucesso!', 'success');
    },

    /**
     * Obtém informações do sistema
     * @returns {Object} Informações do sistema
     */
    getInfoSistema: function() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookiesEnabled: navigator.cookieEnabled,
            screenWidth: screen.width,
            screenHeight: screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            timestamp: new Date().toISOString()
        };
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.Utils = Utils;
}

// Compatibilidade CommonJS (se usado em bundlers)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Utils;
}
