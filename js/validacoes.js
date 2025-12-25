/**
 * CASTRA PET - Validações
 * Sistema completo de validação de formulários
 */

const Validacoes = {
    /**
     * Validação de CPF
     * @param {string} cpf - CPF a ser validado
     * @returns {boolean} True se válido
     */
    validarCPF: function(cpf) {
        if (!cpf) return false;
        
        // Remove caracteres não numéricos
        cpf = cpf.replace(/\D/g, '');
        
        // Verifica se tem 11 dígitos
        if (cpf.length !== 11) return false;
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1+$/.test(cpf)) return false;
        
        // Validação dos dígitos verificadores
        let soma = 0;
        let resto;
        
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.substring(10, 11));
    },

    /**
     * Validação de email
     * @param {string} email - Email a ser validado
     * @returns {boolean} True se válido
     */
    validarEmail: function(email) {
        if (!email) return true; // Email opcional
        
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Validação de telefone
     * @param {string} telefone - Telefone a ser validado
     * @returns {boolean} True se válido
     */
    validarTelefone: function(telefone) {
        if (!telefone) return false;
        
        // Remove caracteres não numéricos
        const numero = telefone.replace(/\D/g, '');
        
        // Verifica se tem 10 ou 11 dígitos
        return numero.length === 10 || numero.length === 11;
    },

    /**
     * Validação de CEP
     * @param {string} cep - CEP a ser validado
     * @returns {boolean} True se válido
     */
    validarCEP: function(cep) {
        if (!cep) return false;
        
        // Remove caracteres não numéricos
        cep = cep.replace(/\D/g, '');
        
        // Verifica se tem 8 dígitos
        return cep.length === 8;
    },

    /**
     * Validação de data
     * @param {string} data - Data a ser validada
     * @returns {boolean} True se válida
     */
    validarData: function(data) {
        if (!data) return false;
        
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (!regex.test(data)) return false;
        
        const partes = data.split('/');
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10);
        const ano = parseInt(partes[2], 10);
        
        // Verifica se a data é válida
        const dataObj = new Date(ano, mes - 1, dia);
        return dataObj.getFullYear() === ano && 
               dataObj.getMonth() === mes - 1 && 
               dataObj.getDate() === dia;
    },

    /**
     * Validação de número
     * @param {string} numero - Número a ser validado
     * @returns {boolean} True se válido
     */
    validarNumero: function(numero) {
        if (!numero) return false;
        return /^\d+$/.test(numero);
    },

    /**
     * Validação de campo obrigatório
     * @param {string} valor - Valor a ser validado
     * @returns {boolean} True se preenchido
     */
    campoObrigatorio: function(valor) {
        return valor !== null && valor !== undefined && valor.toString().trim() !== '';
    },

    /**
     * Validação de tamanho mínimo
     * @param {string} valor - Valor a ser validado
     * @param {number} minimo - Tamanho mínimo
     * @returns {boolean} True se válido
     */
    tamanhoMinimo: function(valor, minimo) {
        if (!valor) return false;
        return valor.toString().length >= minimo;
    },

    /**
     * Validação de tamanho máximo
     * @param {string} valor - Valor a ser validado
     * @param {number} maximo - Tamanho máximo
     * @returns {boolean} True se válido
     */
    tamanhoMaximo: function(valor, maximo) {
        if (!valor) return true;
        return valor.toString().length <= maximo;
    },

    /**
     * Validação de intervalo numérico
     * @param {number} valor - Valor a ser validado
     * @param {number} minimo - Valor mínimo
     * @param {number} maximo - Valor máximo
     * @returns {boolean} True se válido
     */
    intervaloNumerico: function(valor, minimo, maximo) {
        if (isNaN(valor)) return false;
        return valor >= minimo && valor <= maximo;
    },

    /**
     * Validação de idade mínima
     * @param {string} dataNascimento - Data de nascimento
     * @param {number} idadeMinima - Idade mínima
     * @returns {boolean} True se válido
     */
    idadeMinima: function(dataNascimento, idadeMinima) {
        if (!dataNascimento) return false;
        
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        
        const mes = hoje.getMonth() - nascimento.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade >= idadeMinima;
    },

    /**
     * Validação de URL
     * @param {string} url - URL a ser validada
     * @returns {boolean} True se válida
     */
    validarURL: function(url) {
        if (!url) return true;
        
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    },

    /**
     * Validação de senha forte
     * @param {string} senha - Senha a ser validada
     * @returns {Object} Resultado da validação
     */
    validarSenha: function(senha) {
        const resultado = {
            valida: true,
            criterios: {
                tamanho: false,
                maiuscula: false,
                minuscula: false,
                numero: false,
                especial: false
            }
        };

        if (!senha) {
            resultado.valida = false;
            return resultado;
        }

        // Tamanho mínimo
        resultado.criterios.tamanho = senha.length >= 8;
        
        // Pelo menos uma letra maiúscula
        resultado.criterios.maiuscula = /[A-Z]/.test(senha);
        
        // Pelo menos uma letra minúscula
        resultado.criterios.minuscula = /[a-z]/.test(senha);
        
        // Pelo menos um número
        resultado.criterios.numero = /\d/.test(senha);
        
        // Pelo menos um caractere especial
        resultado.criterios.especial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

        // Verifica se todos os critérios foram atendidos
        resultado.valida = Object.values(resultado.criterios).every(criterio => criterio);

        return resultado;
    },

    /**
     * Validação de RG
     * @param {string} rg - RG a ser validado
     * @returns {boolean} True se válido
     */
    validarRG: function(rg) {
        if (!rg) return false;
        
        // Remove caracteres não numéricos
        rg = rg.replace(/\D/g, '');
        
        // Verifica se tem entre 8 e 9 dígitos
        return rg.length >= 8 && rg.length <= 9;
    },

    /**
     * Validação de CNPJ
     * @param {string} cnpj - CNPJ a ser validado
     * @returns {boolean} True se válido
     */
    validarCNPJ: function(cnpj) {
        if (!cnpj) return false;
        
        cnpj = cnpj.replace(/\D/g, '');
        
        if (cnpj.length !== 14) return false;
        
        // Elimina CNPJs inválidos conhecidos
        if (/^(\d)\1+$/.test(cnpj)) return false;
        
        // Valida DVs
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado !== parseInt(digitos.charAt(0))) return false;
        
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        return resultado === parseInt(digitos.charAt(1));
    },

    /**
     * Validação de microchip (15 dígitos)
     * @param {string} microchip - Microchip a ser validado
     * @returns {boolean} True se válido
     */
    validarMicrochip: function(microchip) {
        if (!microchip) return true; // Opcional
        
        microchip = microchip.replace(/\D/g, '');
        return microchip.length === 15;
    },

    /**
     * Validação de peso
     * @param {string} peso - Peso a ser validado
     * @returns {boolean} True se válido
     */
    validarPeso: function(peso) {
        if (!peso) return false;
        
        const pesoNum = parseFloat(peso.replace(',', '.'));
        return !isNaN(pesoNum) && pesoNum > 0 && pesoNum <= 100;
    },

    /**
     * Validação completa do formulário
     * @param {Object} dados - Dados do formulário
     * @returns {Object} Resultado da validação
     */
    validarFormularioCompleto: function(dados) {
        const erros = [];
        const avisos = [];

        // Validação de campos obrigatórios
        const camposObrigatorios = [
            'animal', 'especie', 'sexo', 'pelagem', 'idade',
            'porte', 'raca', 'castra', 'tutor', 'cpf', 'rg',
            'celular', 'cep', 'logradouro', 'numero', 'bairro',
            'cidade', 'estado'
        ];

        camposObrigatorios.forEach(campo => {
            if (!this.campoObrigatorio(dados[campo])) {
                erros.push(`O campo "${this.formatarNomeCampo(campo)}" é obrigatório.`);
            }
        });

        // Validação de CPF
        if (dados.cpf && !this.validarCPF(dados.cpf)) {
            erros.push('CPF inválido.');
        }

        // Validação de email
        if (dados.email && !this.validarEmail(dados.email)) {
            erros.push('E-mail inválido.');
        }

        // Validação de telefone
        if (dados.celular && !this.validarTelefone(dados.celular)) {
            erros.push('Celular inválido.');
        }

        // Validação de CEP
        if (dados.cep && !this.validarCEP(dados.cep)) {
            erros.push('CEP inválido.');
        }

        // Validação de microchip
        if (dados.microchip && !this.validarMicrochip(dados.microchip)) {
            avisos.push('Microchip deve ter 15 dígitos.');
        }

        // Validação de RG
        if (dados.rg && !this.validarRG(dados.rg)) {
            avisos.push('RG pode estar incompleto.');
        }

        return {
            valido: erros.length === 0,
            erros: erros,
            avisos: avisos
        };
    },

    /**
     * Formata nome do campo para exibição
     * @param {string} campo - Nome do campo
     * @returns {string} Nome formatado
     */
    formatarNomeCampo: function(campo) {
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
            celular: 'Celular',
            telefone: 'Telefone',
            email: 'E-mail',
            profissao: 'Profissão',
            cep: 'CEP',
            logradouro: 'Logradouro',
            numero: 'Número',
            complemento: 'Complemento',
            bairro: 'Bairro',
            cidade: 'Cidade',
            estado: 'Estado',
            referencia: 'Ponto de Referência',
            observacoes: 'Observações',
            microchip: 'Microchip'
        };

        return nomes[campo] || campo;
    },

    /**
     * Aplica validação em tempo real
     * @param {HTMLElement} elemento - Elemento a ser validado
     */
    validarEmTempoReal: function(elemento) {
        if (!elemento) return;

        const valor = elemento.value;
        const tipo = elemento.type || elemento.tagName;
        const id = elemento.id;

        // Remove classes de validação anteriores
        elemento.classList.remove('is-valid', 'is-invalid');

        let valido = true;
        let mensagem = '';

        switch (id) {
            case 'cpf':
                valido = this.validarCPF(valor);
                mensagem = valido ? 'CPF válido' : 'CPF inválido';
                break;

            case 'email':
                if (valor) {
                    valido = this.validarEmail(valor);
                    mensagem = valido ? 'E-mail válido' : 'E-mail inválido';
                }
                break;

            case 'celular':
            case 'telefone':
                if (valor) {
                    valido = this.validarTelefone(valor);
                    mensagem = valido ? 'Telefone válido' : 'Telefone inválido';
                }
                break;

            case 'cep':
                valido = this.validarCEP(valor);
                mensagem = valido ? 'CEP válido' : 'CEP inválido';
                break;

            case 'rg':
                valido = this.validarRG(valor);
                mensagem = valido ? 'RG válido' : 'RG inválido';
                break;

            case 'numero':
                valido = this.validarNumero(valor);
                mensagem = valido ? 'Número válido' : 'Apenas números';
                break;

            default:
                // Validação básica para campos obrigatórios
                if (elemento.hasAttribute('required')) {
                    valido = this.campoObrigatorio(valor);
                    if (!valido) {
                        mensagem = 'Campo obrigatório';
                    }
                }
        }

        // Aplica classes de validação
        if (valor && mensagem) {
            if (valido) {
                elemento.classList.add('is-valid');
            } else {
                elemento.classList.add('is-invalid');
            }

            // Atualiza feedback
            this.atualizarFeedback(elemento, mensagem, valido);
        }
    },

    /**
     * Atualiza feedback de validação
     * @param {HTMLElement} elemento - Elemento validado
     * @param {string} mensagem - Mensagem de feedback
     * @param {boolean} valido - Status da validação
     */
    atualizarFeedback: function(elemento, mensagem, valido) {
        let feedback = elemento.nextElementSibling;
        
        // Verifica se já existe um elemento de feedback (válido ou inválido)
        if (!feedback || (!feedback.classList.contains('invalid-feedback') && !feedback.classList.contains('valid-feedback'))) {
            feedback = document.createElement('div');
            feedback.className = valido ? 'valid-feedback' : 'invalid-feedback';
            elemento.parentNode.appendChild(feedback);
        }

        feedback.textContent = mensagem;
        feedback.className = valido ? 'valid-feedback' : 'invalid-feedback';
    }
};

// Configurar validação em tempo real
document.addEventListener('DOMContentLoaded', function() {
    const elementosValidaveis = document.querySelectorAll('input, select, textarea');
    
    elementosValidaveis.forEach(elemento => {
        elemento.addEventListener('blur', function() {
            Validacoes.validarEmTempoReal(this);
        });

        elemento.addEventListener('input', Utils.debounce(function() {
            Validacoes.validarEmTempoReal(this);
        }, 500));
    });
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.Validacoes = Validacoes;
}

// Compatibilidade CommonJS (se usado em bundlers)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Validacoes;
}
