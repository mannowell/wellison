/**
 * CASTRA PET - Sistema de Cadastro de Animais
 * Configurações Globais do Sistema
 */

const CONFIG = {
    // Informações do Sistema
    SISTEMA: {
        NOME: 'CASTRA PET',
        VERSAO: '2.0.0',
        DESENVOLVEDOR: 'WELLISON OLIVEIRA',
        ANO: new Date().getFullYear()
    },

    // API e Serviços Externos
    API: {
        VIACEP: 'https://viacep.com.br/ws',
        TIMEOUT: 10000
    },

    // Configurações de Armazenamento
    STORAGE: {
        PREFIXO: 'castrapet_',
        BACKUP_INTERVALO: 30000, // 30 segundos
        MAX_CADASTROS: 1000
    },

    // Validações
    VALIDACAO: {
        CPF_REGEX: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        TELEFONE_REGEX: /^\(\d{2}\) \d{4,5}-\d{4}$/,
        CEP_REGEX: /^\d{5}-\d{3}$/
    },

    // Formatações
    FORMATO: {
        DATA: 'pt-BR',
        HORA: 'HH:mm:ss',
        DATA_HORA: 'DD/MM/YYYY HH:mm:ss',
        MOEDA: 'pt-BR',
        DECIMAIS: 2
    },

    // Opções de Exportação
    EXPORTACAO: {
        FORMATOS: ['CSV', 'JSON', 'PDF', 'XLSX', 'TXT'],
        DELIMITADOR_CSV: ';',
        ENCODING_CSV: 'UTF-8'
    },

    // Interface
    UI: {
        TEMA_PADRAO: 'claro',
        IDIOMA: 'pt-BR',
        ANIMACOES: true,
        NOTIFICACOES: true,
        CONFIRMACAO_SAIDA: true
    },

    // Mensagens do Sistema
    MENSAGENS: {
        SUCESSO: {
            SALVO: 'Cadastro salvo com sucesso!',
            EXPORTADO: 'Dados exportados com sucesso!',
            LIMPO: 'Formulário limpo com sucesso!',
            CEP_ENCONTRADO: 'Endereço encontrado!'
        },
        ERRO: {
            CAMPOS_OBRIGATORIOS: 'Preencha todos os campos obrigatórios.',
            CEP_INVALIDO: 'CEP inválido. Verifique o número.',
            CEP_NAO_ENCONTRADO: 'CEP não encontrado.',
            CPF_INVALIDO: 'CPF inválido.',
            EMAIL_INVALIDO: 'E-mail inválido.',
            TELEFONE_INVALIDO: 'Telefone inválido.',
            SALVAR: 'Erro ao salvar os dados.',
            BUSCAR: 'Erro ao buscar informações.',
            CONEXAO: 'Erro de conexão. Verifique sua internet.'
        },
        CONFIRMACAO: {
            LIMPAR: 'Tem certeza que deseja limpar o formulário?',
            EXCLUIR: 'Tem certeza que deseja excluir este cadastro?',
            SAIR: 'Tem certeza que deseja sair? As alterações não salvas serão perdidas.'
        },
        INFO: {
            CARREGANDO: 'Carregando...',
            PROCESSANDO: 'Processando...',
            BUSCANDO: 'Buscando informações...'
        }
    },

    // Opções de Animais
    ANIMAIS: {
        ESPECIES: ['CÃO', 'GATO', 'OUTRO'],
        SEXOS: ['MACHO', 'FÊMEA'],
        PELAGENS: [
            'PRETO', 'BRANCO', 'CARAMELO', 'MARROM',
            'MESCLADO', 'CINZA', 'AMARELO', 'TRICOLOR', 'OUTRO'
        ],
        IDADES: [
            { valor: 'FILHOTE', label: 'Filhote (até 6 meses)' },
            { valor: 'JOVEM', label: 'Jovem (6-12 meses)' },
            { valor: 'ADULTO_JOVEM', label: 'Adulto Jovem (1-2 anos)' },
            { valor: 'ADULTO', label: 'Adulto (3-6 anos)' },
            { valor: 'SENIOR', label: 'Sênior (7+ anos)' }
        ],
        PORTES: [
            { valor: 'PEQUENO', label: 'Pequeno (até 8kg)' },
            { valor: 'MEDIO', label: 'Médio (8-15kg)' },
            { valor: 'GRANDE', label: 'Grande (15-25kg)' },
            { valor: 'GIGANTE', label: 'Gigante (25kg+)' }
        ],
        RACAS: ['SIM', 'NÃO', 'SRD'],
        CASTRADOS: ['SIM', 'NÃO']
    },

    // Estados Brasileiros
    ESTADOS: [
        { sigla: 'AC', nome: 'Acre' },
        { sigla: 'AL', nome: 'Alagoas' },
        { sigla: 'AP', nome: 'Amapá' },
        { sigla: 'AM', nome: 'Amazonas' },
        { sigla: 'BA', nome: 'Bahia' },
        { sigla: 'CE', nome: 'Ceará' },
        { sigla: 'DF', nome: 'Distrito Federal' },
        { sigla: 'ES', nome: 'Espírito Santo' },
        { sigla: 'GO', nome: 'Goiás' },
        { sigla: 'MA', nome: 'Maranhão' },
        { sigla: 'MT', nome: 'Mato Grosso' },
        { sigla: 'MS', nome: 'Mato Grosso do Sul' },
        { sigla: 'MG', nome: 'Minas Gerais' },
        { sigla: 'PA', nome: 'Pará' },
        { sigla: 'PB', nome: 'Paraíba' },
        { sigla: 'PR', nome: 'Paraná' },
        { sigla: 'PE', nome: 'Pernambuco' },
        { sigla: 'PI', nome: 'Piauí' },
        { sigla: 'RJ', nome: 'Rio de Janeiro' },
        { sigla: 'RN', nome: 'Rio Grande do Norte' },
        { sigla: 'RS', nome: 'Rio Grande do Sul' },
        { sigla: 'RO', nome: 'Rondônia' },
        { sigla: 'RR', nome: 'Roraima' },
        { sigla: 'SC', nome: 'Santa Catarina' },
        { sigla: 'SP', nome: 'São Paulo' },
        { sigla: 'SE', nome: 'Sergipe' },
        { sigla: 'TO', nome: 'Tocantins' }
    ],

    // Configurações de Segurança
    SEGURANCA: {
        AUTO_LOGOUT: 30, // minutos
        MAX_TENTATIVAS: 3,
        BLOQUEIO_TEMPORARIO: 5 // minutos
    }
};

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Compatibilidade CommonJS (se usado em bundlers)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = CONFIG;
}
