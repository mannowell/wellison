/**
 * CASTRA PET - Sistema Operacional
 * Arquivo principal com funcionalidades essenciais do sistema
 * Inclui: Formulário, Cadastro, ViaCEP, Máscaras e Modal
 */

// ============================================================================
// MÓDULO DE MÁSCARAS
// ============================================================================
const Mascaras = {
    /**
     * Inicializa todas as máscaras do sistema
     */
    inicializar: function() {
        console.log('Inicializando máscaras...');
        
        // Máscara para CPF
        this.aplicarMascaraCPF();
        
        // Máscara para telefone
        this.aplicarMascaraTelefone();
        
        // Máscara para CEP
        this.aplicarMascaraCEP();
        
        // Máscara para RG
        this.aplicarMascaraRG();
        
        // Máscara para número
        this.aplicarMascaraNumero();
        
        console.log('Máscaras inicializadas com sucesso!');
    },
    
    /**
     * Aplica máscara de CPF (000.000.000-00)
     */
    aplicarMascaraCPF: function() {
        const cpfInputs = document.querySelectorAll('.cpf-mask, #cpf');
        
        cpfInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let valor = e.target.value.replace(/\D/g, '');
                
                if (valor.length > 11) {
                    valor = valor.substring(0, 11);
                }
                
                if (valor.length <= 11) {
                    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
                    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
                    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                }
                
                e.target.value = valor;
                
                // Validação em tempo real
                if (valor.length === 14) {
                    const valido = Validacoes.validarCPF(valor);
                    input.classList.toggle('is-valid', valido);
                    input.classList.toggle('is-invalid', !valido);
                }
            });
        });
    },
    
    /**
     * Aplica máscara de telefone ((00) 00000-0000)
     */
    aplicarMascaraTelefone: function() {
        const telefoneInputs = document.querySelectorAll('.phone-mask, #celular, #telefone');
        
        telefoneInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let valor = e.target.value.replace(/\D/g, '');
                
                if (valor.length > 11) {
                    valor = valor.substring(0, 11);
                }
                
                if (valor.length === 11) {
                    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
                    valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
                } else if (valor.length === 10) {
                    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
                    valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
                }
                
                e.target.value = valor;
            });
        });
    },
    
    /**
     * Aplica máscara de CEP (00000-000)
     */
    aplicarMascaraCEP: function() {
        const cepInputs = document.querySelectorAll('.cep-mask, #cep');
        
        cepInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let valor = e.target.value.replace(/\D/g, '');
                
                if (valor.length > 8) {
                    valor = valor.substring(0, 8);
                }
                
                if (valor.length >= 5) {
                    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
                }
                
                e.target.value = valor;
                
                // Busca automática quando CEP estiver completo
                if (valor.length === 9) {
                    setTimeout(() => {
                        ViaCEP.buscar();
                    }, 500);
                }
            });
        });
    },
    
    /**
     * Aplica máscara de RG (00.000.000-0)
     */
    aplicarMascaraRG: function() {
        const rgInputs = document.querySelectorAll('.rg-mask, #rg');
        
        rgInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let valor = e.target.value.replace(/\D/g, '');
                
                if (valor.length > 9) {
                    valor = valor.substring(0, 9);
                }
                
                if (valor.length >= 2) {
                    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
                    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                    valor = valor.replace(/\.(\d{3})(\d{1})$/, '.$1-$2');
                }
                
                e.target.value = valor;
            });
        });
    },
    
    /**
     * Aplica máscara para aceitar apenas números
     */
    aplicarMascaraNumero: function() {
        const numeroInputs = document.querySelectorAll('input[type="number"], .numero-mask, #numero');
        
        numeroInputs.forEach(input => {
            input.addEventListener('input', function(e) {
                let valor = e.target.value.replace(/\D/g, '');
                e.target.value = valor;
            });
        });
    },
    
    /**
     * Remove todas as máscaras de um valor
     * @param {string} valor - Valor com máscara
     * @returns {string} Valor sem máscara
     */
    removerMascara: function(valor) {
        return valor ? valor.replace(/\D/g, '') : '';
    },
    
    /**
     * Aplica máscara personalizada
     * @param {HTMLElement} elemento - Elemento a receber a máscara
     * @param {string} mascara - Padrão da máscara
     */
    aplicarMascaraPersonalizada: function(elemento, mascara) {
        elemento.addEventListener('input', function(e) {
            let valor = e.target.value;
            let resultado = '';
            let indice = 0;
            
            for (let i = 0; i < mascara.length; i++) {
                if (mascara[i] === '#') {
                    if (indice < valor.length) {
                        resultado += valor[indice];
                        indice++;
                    }
                } else {
                    resultado += mascara[i];
                }
            }
            
            e.target.value = resultado;
        });
    }
};

// ============================================================================
// MÓDULO VIACEP
// ============================================================================
const ViaCEP = {
    /**
     * Busca endereço pelo CEP
     */
    buscar: async function() {
        const cepInput = document.getElementById('cep');
        if (!cepInput) return;
        
        const cep = Utils.limparMascara(cepInput.value);
        
        if (!Validacoes.validarCEP(cep)) {
            Notificacoes.mostrar('CEP inválido. Digite 8 números.', 'error');
            cepInput.focus();
            return;
        }
        
        Notificacoes.mostrar('Buscando endereço...', 'info');
        
        try {
            const response = await fetch(`${CONFIG.API.VIACEP}/${cep}/json/`);
            
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            
            const data = await response.json();
            
            if (data.erro) {
                Notificacoes.mostrar('CEP não encontrado.', 'error');
                return;
            }
            
            // Preenche os campos de endereço
            this.preencherEndereco(data);
            
            Notificacoes.mostrar('Endereço encontrado!', 'success');
            
            // Foca no campo número
            setTimeout(() => {
                const numeroInput = document.getElementById('numero');
                if (numeroInput) numeroInput.focus();
            }, 300);
            
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            Notificacoes.mostrar('Erro ao buscar CEP. Tente novamente.', 'error');
        }
    },
    
    /**
     * Preenche os campos de endereço com os dados do CEP
     * @param {Object} data - Dados do endereço
     */
    preencherEndereco: function(data) {
        const campos = {
            'logradouro': data.logradouro || '',
            'bairro': data.bairro || '',
            'cidade': data.localidade || '',
            'estado': data.uf || ''
        };
        
        Object.keys(campos).forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.value = campos[id];
                // Dispara evento de input para validação
                elemento.dispatchEvent(new Event('input'));
            }
        });
    },
    
    /**
     * Busca CEP pelo endereço (funcionalidade reversa)
     */
    buscarPorEndereco: async function() {
        const estado = document.getElementById('estado')?.value;
        const cidade = document.getElementById('cidade')?.value;
        const logradouro = document.getElementById('logradouro')?.value;
        
        if (!estado || !cidade || !logradouro) {
            Notificacoes.mostrar('Preencha estado, cidade e logradouro primeiro.', 'warning');
            return;
        }
        
        Notificacoes.mostrar('Buscando CEP...', 'info');
        
        try {
            const url = `${CONFIG.API.VIACEP}/${estado}/${cidade}/${logradouro}/json/`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            
            const data = await response.json();
            
            if (data.erro || data.length === 0) {
                Notificacoes.mostrar('Endereço não encontrado.', 'error');
                return;
            }
            
            // Usa o primeiro resultado
            const primeiroResultado = data[0];
            const cepInput = document.getElementById('cep');
            
            if (cepInput && primeiroResultado.cep) {
                cepInput.value = Utils.formatarCEP(primeiroResultado.cep);
                cepInput.dispatchEvent(new Event('input'));
                Notificacoes.mostrar('CEP encontrado!', 'success');
            }
            
        } catch (error) {
            console.error('Erro ao buscar CEP por endereço:', error);
            Notificacoes.mostrar('Erro ao buscar CEP. Tente novamente.', 'error');
        }
    }
};

// ============================================================================
// MÓDULO DE FORMULÁRIO
// ============================================================================
const Formulario = {
    passoAtual: 1,
    totalPassos: 4,
    
    /**
     * Inicializa o formulário
     */
    inicializar: function() {
        console.log('Inicializando formulário...');
        
        // Configura navegação entre passos
        this.configurarNavegacao();
        
        // Configura validações
        this.configurarValidacoes();
        
        // Configura eventos
        this.configurarEventos();
        
        // Atualiza progresso
        this.atualizarProgresso();
        
        console.log('Formulário inicializado!');
    },
    
    /**
     * Configura navegação entre passos do formulário
     */
    configurarNavegacao: function() {
        // Botão Próximo
        const btnProximo = document.querySelector('.btn-next');
        if (btnProximo) {
            btnProximo.addEventListener('click', () => this.avancarPasso());
        }
        
        // Botão Voltar
        const btnVoltar = document.querySelector('.btn-prev');
        if (btnVoltar) {
            btnVoltar.addEventListener('click', () => this.voltarPasso());
        }
        
        // Botão Salvar (último passo)
        const btnSalvar = document.querySelector('.btn-save');
        if (btnSalvar) {
            btnSalvar.addEventListener('click', () => Cadastro.salvar());
        }
    },
    
    /**
     * Configura validações do formulário
     */
    configurarValidacoes: function() {
        const formulario = document.getElementById('cadastro-form');
        if (!formulario) return;
        
        // Validação ao tentar enviar
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validarPassoAtual()) {
                Cadastro.salvar();
            }
        });
        
        // Validação em tempo real para cada campo
        const campos = formulario.querySelectorAll('input, select, textarea');
        campos.forEach(campo => {
            campo.addEventListener('blur', () => {
                Validacoes.validarEmTempoReal(campo);
            });
            
            campo.addEventListener('input', Utils.debounce(() => {
                Validacoes.validarEmTempoReal(campo);
            }, 500));
        });
    },
    
    /**
     * Configura eventos do formulário
     */
    configurarEventos: function() {
        // Auto-save a cada 30 segundos
        setInterval(() => {
            this.salvarRascunho();
        }, 30000);
        
        // Prevenir fechamento da página com dados não salvos
        window.addEventListener('beforeunload', (e) => {
            if (this.temDadosNaoSalvos()) {
                e.preventDefault();
                e.returnValue = 'Você tem dados não salvos. Deseja realmente sair?';
                return e.returnValue;
            }
        });
        
        // Restaurar rascunho ao carregar
        window.addEventListener('load', () => {
            this.restaurarRascunho();
        });
    },
    
    /**
     * Avança para o próximo passo
     */
    avancarPasso: function() {
        if (!this.validarPassoAtual()) {
            Notificacoes.mostrar('Preencha todos os campos obrigatórios corretamente.', 'error');
            return;
        }
        
        if (this.passoAtual < this.totalPassos) {
            this.esconderPasso(this.passoAtual);
            this.passoAtual++;
            this.mostrarPasso(this.passoAtual);
            this.atualizarBotoes();
            this.atualizarProgresso();
            
            // Se for o último passo, mostra resumo
            if (this.passoAtual === this.totalPassos) {
                this.mostrarResumo();
            }
            
            // Rola para o topo do formulário
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
    
    /**
     * Volta para o passo anterior
     */
    voltarPasso: function() {
        if (this.passoAtual > 1) {
            this.esconderPasso(this.passoAtual);
            this.passoAtual--;
            this.mostrarPasso(this.passoAtual);
            this.atualizarBotoes();
            this.atualizarProgresso();
            
            // Rola para o topo do formulário
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    },
    
    /**
     * Valida o passo atual
     * @returns {boolean} True se válido
     */
    validarPassoAtual: function() {
        const passoElemento = document.querySelector(`.form-step[data-step="${this.passoAtual}"]`);
        if (!passoElemento) return true;
        
        const camposObrigatorios = passoElemento.querySelectorAll('[required]');
        let valido = true;
        
        camposObrigatorios.forEach(campo => {
            const valor = campo.value ? campo.value.trim() : '';
            const campoValido = Validacoes.campoObrigatorio(valor);
            
            if (!campoValido) {
                campo.classList.add('is-invalid');
                valido = false;
                
                // Adiciona feedback
                const feedback = campo.nextElementSibling;
                if (!feedback || !feedback.classList.contains('invalid-feedback')) {
                    const divFeedback = document.createElement('div');
                    divFeedback.className = 'invalid-feedback';
                    divFeedback.textContent = 'Este campo é obrigatório.';
                    campo.parentNode.appendChild(divFeedback);
                }
            } else {
                campo.classList.remove('is-invalid');
                campo.classList.add('is-valid');
            }
        });
        
        return valido;
    },
    
    /**
     * Mostra um passo específico
     * @param {number} passo - Número do passo
     */
    mostrarPasso: function(passo) {
        const passoElemento = document.querySelector(`.form-step[data-step="${passo}"]`);
        if (passoElemento) {
            passoElemento.classList.add('active');
            passoElemento.style.display = 'block';
            
            // Foca no primeiro campo
            const primeiroCampo = passoElemento.querySelector('input, select, textarea');
            if (primeiroCampo) {
                setTimeout(() => primeiroCampo.focus(), 300);
            }
        }
    },
    
    /**
     * Esconde um passo específico
     * @param {number} passo - Número do passo
     */
    esconderPasso: function(passo) {
        const passoElemento = document.querySelector(`.form-step[data-step="${passo}"]`);
        if (passoElemento) {
            passoElemento.classList.remove('active');
            passoElemento.style.display = 'none';
        }
    },
    
    /**
     * Atualiza a visibilidade dos botões
     */
    atualizarBotoes: function() {
        const btnVoltar = document.querySelector('.btn-prev');
        const btnProximo = document.querySelector('.btn-next');
        const btnSalvar = document.querySelector('.btn-save');
        
        if (btnVoltar) {
            btnVoltar.style.display = this.passoAtual === 1 ? 'none' : 'inline-flex';
        }
        
        if (btnProximo && btnSalvar) {
            if (this.passoAtual === this.totalPassos) {
                btnProximo.style.display = 'none';
                btnSalvar.style.display = 'inline-flex';
            } else {
                btnProximo.style.display = 'inline-flex';
                btnSalvar.style.display = 'none';
            }
        }
    },
    
    /**
     * Atualiza a barra de progresso
     */
    atualizarProgresso: function() {
        // Atualiza os steps
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.toggle('active', stepNum <= this.passoAtual);
            
            const stepCircle = step.querySelector('.step-circle');
            if (stepCircle) {
                if (stepNum < this.passoAtual) {
                    stepCircle.innerHTML = '<i class="fas fa-check"></i>';
                } else if (stepNum === this.passoAtual) {
                    stepCircle.textContent = stepNum;
                } else {
                    stepCircle.textContent = stepNum;
                }
            }
        });
        
        // Atualiza título da seção
        const titulos = [
            'Informações do Animal',
            'Informações do Tutor',
            'Endereço',
            'Revisão do Cadastro'
        ];
        
        const tituloSecao = document.querySelector('.section-header h1');
        if (tituloSecao && titulos[this.passoAtual - 1]) {
            const icones = ['fa-paw', 'fa-user', 'fa-home', 'fa-check-circle'];
            tituloSecao.innerHTML = `<i class="fas ${icones[this.passoAtual - 1]} me-2"></i>${titulos[this.passoAtual - 1]}`;
        }
    },
    
    /**
     * Mostra resumo do cadastro
     */
    mostrarResumo: function() {
        const dados = Cadastro.coletarDados();
        const container = document.getElementById('review-content');
        
        if (!container) return;
        
        let html = `
            <div class="review-section">
                <h5><i class="fas fa-paw me-2"></i>Informações do Animal</h5>
                <div class="review-item"><strong>Nome:</strong> <span>${dados.animal || '-'}</span></div>
                <div class="review-item"><strong>Espécie:</strong> <span>${dados.especie || '-'}</span></div>
                <div class="review-item"><strong>Sexo:</strong> <span>${dados.sexo || '-'}</span></div>
                <div class="review-item"><strong>Pelagem:</strong> <span>${dados.pelagem || '-'}</span></div>
                <div class="review-item"><strong>Idade:</strong> <span>${dados.idade || '-'}</span></div>
                <div class="review-item"><strong>Porte:</strong> <span>${dados.porte || '-'}</span></div>
                <div class="review-item"><strong>Raça Definida:</strong> <span>${dados.raca || '-'}</span></div>
                <div class="review-item"><strong>Castrado:</strong> <span>${dados.castra || '-'}</span></div>
                <div class="review-item"><strong>Microchip:</strong> <span>${dados.microchip || 'Não informado'}</span></div>
                <div class="review-item"><strong>Observações:</strong> <span>${dados.observacoes || 'Nenhuma'}</span></div>
            </div>
            
            <div class="review-section">
                <h5><i class="fas fa-user me-2"></i>Informações do Tutor</h5>
                <div class="review-item"><strong>Nome:</strong> <span>${dados.tutor || '-'}</span></div>
                <div class="review-item"><strong>CPF:</strong> <span>${Utils.formatarCPF(dados.cpf) || '-'}</span></div>
                <div class="review-item"><strong>RG:</strong> <span>${dados.rg || '-'}</span></div>
                <div class="review-item"><strong>Celular:</strong> <span>${Utils.formatarTelefone(dados.celular) || '-'}</span></div>
                <div class="review-item"><strong>Telefone:</strong> <span>${dados.telefone ? Utils.formatarTelefone(dados.telefone) : 'Não informado'}</span></div>
                <div class="review-item"><strong>E-mail:</strong> <span>${dados.email || 'Não informado'}</span></div>
                <div class="review-item"><strong>Profissão:</strong> <span>${dados.profissao || 'Não informada'}</span></div>
            </div>
            
            <div class="review-section">
                <h5><i class="fas fa-home me-2"></i>Endereço</h5>
                <div class="review-item"><strong>CEP:</strong> <span>${Utils.formatarCEP(dados.cep) || '-'}</span></div>
                <div class="review-item"><strong>Logradouro:</strong> <span>${dados.logradouro || '-'}</span></div>
                <div class="review-item"><strong>Número:</strong> <span>${dados.numero || '-'}</span></div>
                <div class="review-item"><strong>Complemento:</strong> <span>${dados.complemento || 'Não informado'}</span></div>
                <div class="review-item"><strong>Bairro:</strong> <span>${dados.bairro || '-'}</span></div>
                <div class="review-item"><strong>Cidade:</strong> <span>${dados.cidade || '-'}</span></div>
                <div class="review-item"><strong>Estado:</strong> <span>${dados.estado || '-'}</span></div>
                <div class="review-item"><strong>Ponto de Referência:</strong> <span>${dados.referencia || 'Não informado'}</span></div>
            </div>
            
            <div class="review-section">
                <h5><i class="fas fa-calendar me-2"></i>Informações do Cadastro</h5>
                <div class="review-item"><strong>Data do Cadastro:</strong> <span>${Utils.formatarData(dados.dataCadastro, true)}</span></div>
                <div class="review-item"><strong>ID do Cadastro:</strong> <span>${dados.id || 'Gerar ao salvar'}</span></div>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    /**
     * Coleta dados do formulário
     * @returns {Object} Dados do formulário
     */
    coletarDadosFormulario: function() {
        return Cadastro.coletarDados();
    },
    
    /**
     * Limpa o formulário
     */
    limpar: function() {
        Modal.mostrar(
            'Limpar Formulário',
            'Tem certeza que deseja limpar todos os campos? Esta ação não pode ser desfeita.',
            'warning',
            () => {
                const formulario = document.getElementById('cadastro-form');
                if (formulario) {
                    formulario.reset();
                    
                    // Limpa classes de validação
                    formulario.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                        el.classList.remove('is-valid', 'is-invalid');
                    });
                    
                    // Remove feedbacks
                    formulario.querySelectorAll('.valid-feedback, .invalid-feedback').forEach(el => {
                        el.remove();
                    });
                    
                    // Volta para o primeiro passo
                    this.passoAtual = 1;
                    document.querySelectorAll('.form-step').forEach((step, index) => {
                        step.style.display = index === 0 ? 'block' : 'none';
                        step.classList.toggle('active', index === 0);
                    });
                    
                    this.atualizarBotoes();
                    this.atualizarProgresso();
                    
                    // Limpa rascunho
                    this.limparRascunho();
                    
                    Notificacoes.mostrar('Formulário limpo com sucesso!', 'success');
                    
                    // Foca no primeiro campo
                    const primeiroCampo = document.querySelector('#microchip, #animal');
                    if (primeiroCampo) primeiroCampo.focus();
                }
            }
        );
    },
    
    /**
     * Salva rascunho no localStorage
     */
    salvarRascunho: function() {
        const dados = Cadastro.coletarDados();
        const temDados = Object.values(dados).some(valor => 
            valor && valor.toString().trim() !== ''
        );
        
        if (temDados) {
            try {
                localStorage.setItem('castrapet_rascunho', JSON.stringify({
                    dados: dados,
                    passo: this.passoAtual,
                    timestamp: new Date().toISOString()
                }));
                console.log('Rascunho salvo automaticamente');
            } catch (error) {
                console.warn('Não foi possível salvar o rascunho:', error);
            }
        }
    },
    
    /**
     * Restaura rascunho do localStorage
     */
    restaurarRascunho: function() {
        try {
            const rascunho = localStorage.getItem('castrapet_rascunho');
            if (rascunho) {
                const { dados, passo } = JSON.parse(rascunho);
                
                Modal.mostrar(
                    'Rascunho Encontrado',
                    'Encontramos um rascunho não salvo. Deseja restaurá-lo?',
                    'info',
                    () => {
                        // Restaura dados
                        Object.keys(dados).forEach(id => {
                            const elemento = document.getElementById(id);
                            if (elemento && dados[id]) {
                                elemento.value = dados[id];
                                // Dispara evento para máscaras e validações
                                elemento.dispatchEvent(new Event('input'));
                            }
                        });
                        
                        // Restaura passo
                        if (passo && passo > 1) {
                            this.passoAtual = 1;
                            for (let i = 1; i < passo; i++) {
                                this.avancarPasso();
                            }
                        }
                        
                        Notificacoes.mostrar('Rascunho restaurado com sucesso!', 'success');
                        
                        // Remove rascunho após restaurar
                        localStorage.removeItem('castrapet_rascunho');
                    },
                    () => {
                        // Usuário escolheu não restaurar
                        localStorage.removeItem('castrapet_rascunho');
                    }
                );
            }
        } catch (error) {
            console.warn('Erro ao restaurar rascunho:', error);
            localStorage.removeItem('castrapet_rascunho');
        }
    },
    
    /**
     * Limpa rascunho do localStorage
     */
    limparRascunho: function() {
        localStorage.removeItem('castrapet_rascunho');
    },
    
    /**
     * Verifica se há dados não salvos
     * @returns {boolean} True se há dados não salvos
     */
    temDadosNaoSalvos: function() {
        const dados = Cadastro.coletarDados();
        return Object.values(dados).some(valor => 
            valor && valor.toString().trim() !== ''
        );
    }
};

// ============================================================================
// MÓDULO DE CADASTRO
// ============================================================================
const Cadastro = {
    /**
     * Inicializa o módulo de cadastro
     */
    inicializar: function() {
        console.log('Inicializando módulo de cadastro...');
        
        // Carrega cadastros existentes
        this.carregarCadastros();
        
        // Atualiza contador
        this.atualizarContador();
        
        console.log('Módulo de cadastro inicializado!');
    },
    
    /**
     * Coleta todos os dados do formulário
     * @returns {Object} Dados do formulário
     */
    coletarDados: function() {
        const dados = {};
        
        // Coleta todos os campos do formulário
        const formulario = document.getElementById('cadastro-form');
        if (formulario) {
            const elementos = formulario.querySelectorAll('input, select, textarea');
            
            elementos.forEach(elemento => {
                if (elemento.id) {
                    let valor = elemento.value;
                    
                    // Remove máscaras de campos específicos
                    if (elemento.classList.contains('cpf-mask') || 
                        elemento.classList.contains('phone-mask') ||
                        elemento.classList.contains('cep-mask') ||
                        elemento.classList.contains('rg-mask')) {
                        valor = Utils.limparMascara(valor);
                    }
                    
                    dados[elemento.id] = valor;
                }
            });
        }
        
        // Adiciona metadados
        dados.id = Utils.gerarID();
        dados.dataCadastro = new Date().toISOString();
        dados.ultimaAtualizacao = new Date().toISOString();
        
        return dados;
    },
    
    /**
     * Valida os dados antes de salvar
     * @param {Object} dados - Dados a serem validados
     * @returns {Object} Resultado da validação
     */
    validarDados: function(dados) {
        return Validacoes.validarFormularioCompleto(dados);
    },
    
    /**
     * Salva o cadastro
     */
    salvar: function() {
        const dados = this.coletarDados();
        const validacao = this.validarDados(dados);
        
        if (!validacao.valido) {
            // Mostra erros
            validacao.erros.forEach(erro => {
                Notificacoes.mostrar(erro, 'error');
            });
            
            // Mostra avisos
            validacao.avisos.forEach(aviso => {
                Notificacoes.mostrar(aviso, 'warning');
            });
            
            // Volta para o primeiro passo com erro
            Formulario.passoAtual = 1;
            Formulario.atualizarProgresso();
            Formulario.atualizarBotoes();
            
            return;
        }
        
        // Mostra avisos (se houver)
        validacao.avisos.forEach(aviso => {
            Notificacoes.mostrar(aviso, 'warning');
        });
        
        // Confirmação antes de salvar
        Modal.mostrar(
            'Salvar Cadastro',
            'Deseja salvar este cadastro? Esta ação não pode ser desfeita.',
            'info',
            () => {
                this.processarSalvamento(dados);
            }
        );
    },
    
    /**
     * Processa o salvamento dos dados
     * @param {Object} dados - Dados a serem salvos
     */
    processarSalvamento: async function(dados) {
        Notificacoes.mostrar('Salvando cadastro...', 'info');
        
        try {
            // Salva no localStorage
            this.salvarLocal(dados);
            
            // Exporta automaticamente se configurado
            if (Configuracoes.exportacaoAutomatica) {
                await Exportacao.exportarCSV([dados]);
            }
            
            // Limpa formulário
            Formulario.limparRascunho();
            
            // Mostra sucesso
            Notificacoes.mostrar('Cadastro salvo com sucesso!', 'success');
            
            // Atualiza contador
            this.atualizarContador();
            
            // Mostra opções de exportação
            setTimeout(() => {
                this.mostrarOpcoesPosSalvamento(dados);
            }, 1000);
            
        } catch (error) {
            console.error('Erro ao salvar cadastro:', error);
            Notificacoes.mostrar('Erro ao salvar cadastro. Tente novamente.', 'error');
        }
    },
    
    /**
     * Salva dados no localStorage
     * @param {Object} dados - Dados a serem salvos
     */
    salvarLocal: function(dados) {
        try {
            // Obtém cadastros existentes
            let cadastros = this.obterCadastros();
            
            // Adiciona novo cadastro
            cadastros.push(dados);
            
            // Limita número de cadastros
            if (cadastros.length > CONFIG.STORAGE.MAX_CADASTROS) {
                cadastros = cadastros.slice(-CONFIG.STORAGE.MAX_CADASTROS);
                Notificacoes.mostrar(`Limite de ${CONFIG.STORAGE.MAX_CADASTROS} cadastros atingido. Os mais antigos foram removidos.`, 'warning');
            }
            
            // Salva no localStorage
            localStorage.setItem(
                CONFIG.STORAGE.PREFIXO + 'cadastros',
                JSON.stringify(cadastros)
            );
            
            // Atualiza índice de busca
            this.atualizarIndiceBusca(cadastros);
            
            console.log('Cadastro salvo localmente:', dados.id);
            
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            throw error;
        }
    },
    
    /**
     * Obtém todos os cadastros
     * @returns {Array} Lista de cadastros
     */
    obterCadastros: function() {
        try {
            const cadastrosJSON = localStorage.getItem(CONFIG.STORAGE.PREFIXO + 'cadastros');
            return cadastrosJSON ? JSON.parse(cadastrosJSON) : [];
        } catch (error) {
            console.error('Erro ao obter cadastros:', error);
            return [];
        }
    },
    
    /**
     * Carrega cadastros do localStorage
     */
    carregarCadastros: function() {
        const cadastros = this.obterCadastros();
        console.log(`Carregados ${cadastros.length} cadastros`);
        return cadastros;
    },
    
    /**
     * Busca cadastros por critérios
     * @param {Object} criterios - Critérios de busca
     * @returns {Array} Cadastros encontrados
     */
    buscar: function(criterios = {}) {
        let cadastros = this.obterCadastros();
        
        // Aplica filtros
        Object.keys(criterios).forEach(chave => {
            if (criterios[chave]) {
                const termo = criterios[chave].toString().toLowerCase();
                cadastros = cadastros.filter(cadastro => 
                    cadastro[chave] && 
                    cadastro[chave].toString().toLowerCase().includes(termo)
                );
            }
        });
        
        return cadastros;
    },
    
    /**
     * Atualiza índice de busca para performance
     * @param {Array} cadastros - Lista de cadastros
     */
    atualizarIndiceBusca: function(cadastros) {
        try {
            const indice = {
                porAnimal: {},
                porTutor: {},
                porMicrochip: {},
                porData: {}
            };
            
            cadastros.forEach((cadastro, index) => {
                // Índice por nome do animal
                if (cadastro.animal) {
                    const chave = cadastro.animal.toLowerCase();
                    if (!indice.porAnimal[chave]) indice.porAnimal[chave] = [];
                    indice.porAnimal[chave].push(index);
                }
                
                // Índice por nome do tutor
                if (cadastro.tutor) {
                    const chave = cadastro.tutor.toLowerCase();
                    if (!indice.porTutor[chave]) indice.porTutor[chave] = [];
                    indice.porTutor[chave].push(index);
                }
                
                // Índice por microchip
                if (cadastro.microchip) {
                    indice.porMicrochip[cadastro.microchip] = index;
                }
                
                // Índice por data
                const data = new Date(cadastro.dataCadastro).toISOString().split('T')[0];
                if (!indice.porData[data]) indice.porData[data] = [];
                indice.porData[data].push(index);
            });
            
            localStorage.setItem(
                CONFIG.STORAGE.PREFIXO + 'indice_busca',
                JSON.stringify(indice)
            );
            
        } catch (error) {
            console.warn('Erro ao atualizar índice de busca:', error);
        }
    },
    
    /**
     * Atualiza contador de cadastros na interface
     */
    atualizarContador: function() {
        const cadastros = this.obterCadastros();
        const contadorElemento = document.getElementById('total-cadastros');
        
        if (contadorElemento) {
            contadorElemento.textContent = cadastros.length;
        }
    },
    
    /**
     * Mostra opções após salvar
     * @param {Object} dados - Dados salvos
     */
    mostrarOpcoesPosSalvamento: function(dados) {
        Modal.mostrar(
            'Cadastro Salvo!',
            `
            <p>O cadastro de <strong>${dados.animal}</strong> foi salvo com sucesso!</p>
            <p>Deseja:</p>
            <div class="d-grid gap-2 mt-3">
                <button class="btn btn-outline-primary btn-export-last" data-action="csv">
                    <i class="fas fa-file-csv me-2"></i>Exportar como CSV
                </button>
                <button class="btn btn-outline-success btn-export-last" data-action="json">
                    <i class="fas fa-file-code me-2"></i>Exportar como JSON
                </button>
                <button class="btn btn-outline-info btn-export-last" data-action="pdf">
                    <i class="fas fa-file-pdf me-2"></i>Exportar como PDF
                </button>
                <button class="btn btn-outline-secondary" onclick="window.print()">
                    <i class="fas fa-print me-2"></i>Imprimir Cadastro
                </button>
                <button class="btn btn-outline-warning" onclick="Formulario.limpar(); Modal.fechar()">
                    <i class="fas fa-plus me-2"></i>Novo Cadastro
                </button>
            </div>
            `,
            'success'
        );

        // Anexa listeners aos botões de exportação do modal (usa window.lastSavedData)
        setTimeout(() => {
            const modal = document.getElementById('confirmation-modal');
            if (!modal) return;
            modal.querySelectorAll('.btn-export-last').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.getAttribute('data-action');
                    switch (action) {
                        case 'csv': Exportacao.exportarCSV([window.lastSavedData || {}]); break;
                        case 'json': Exportacao.exportarJSON([window.lastSavedData || {}]); break;
                        case 'pdf': Exportacao.exportarPDF([window.lastSavedData || {}]); break;
                    }
                    Modal.fechar();
                });
            });
        }, 50);
        
        // Salva referência aos dados
        window.lastSavedData = dados;
    },
    
    /**
     * Exclui um cadastro
     * @param {string} id - ID do cadastro
     */
    excluir: function(id) {
        Modal.mostrar(
            'Excluir Cadastro',
            'Tem certeza que deseja excluir este cadastro? Esta ação não pode ser desfeita.',
            'error',
            () => {
                try {
                    let cadastros = this.obterCadastros();
                    const totalAntes = cadastros.length;
                    
                    // Filtra removendo o cadastro com o ID especificado
                    cadastros = cadastros.filter(cadastro => cadastro.id !== id);
                    
                    if (cadastros.length < totalAntes) {
                        // Salva lista atualizada
                        localStorage.setItem(
                            CONFIG.STORAGE.PREFIXO + 'cadastros',
                            JSON.stringify(cadastros)
                        );
                        
                        // Atualiza índice
                        this.atualizarIndiceBusca(cadastros);
                        
                        // Atualiza contador
                        this.atualizarContador();
                        
                        Notificacoes.mostrar('Cadastro excluído com sucesso!', 'success');
                    } else {
                        Notificacoes.mostrar('Cadastro não encontrado.', 'warning');
                    }
                    
                } catch (error) {
                    console.error('Erro ao excluir cadastro:', error);
                    Notificacoes.mostrar('Erro ao excluir cadastro.', 'error');
                }
            }
        );
    },
    
    /**
     * Exporta todos os cadastros
     */
    exportarTodos: function() {
        const cadastros = this.obterCadastros();
        
        if (cadastros.length === 0) {
            Notificacoes.mostrar('Nenhum cadastro para exportar.', 'warning');
            return;
        }
        
        Exportacao.mostrarOpcoesExportacao(cadastros);
    },
    
    /**
     * Faz backup dos cadastros
     */
    fazerBackup: function() {
        const cadastros = this.obterCadastros();
        const backup = {
            sistema: CONFIG.SISTEMA.NOME,
            versao: CONFIG.SISTEMA.VERSAO,
            dataBackup: new Date().toISOString(),
            totalCadastros: cadastros.length,
            cadastros: cadastros
        };
        
        Exportacao.exportarJSON(backup, `backup_castrapet_${Utils.formatarData(new Date(), false).replace(/\//g, '-')}.json`);
        Notificacoes.mostrar(`Backup realizado com sucesso! ${cadastros.length} cadastros exportados.`, 'success');
    },
    
    /**
     * Restaura cadastros de backup
     * @param {File} arquivo - Arquivo de backup
     */
    restaurarBackup: function(arquivo) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const backup = JSON.parse(e.target.result);
                
                // Valida backup
                if (!backup.cadastros || !Array.isArray(backup.cadastros)) {
                    throw new Error('Arquivo de backup inválido');
                }
                
                Modal.mostrar(
                    'Restaurar Backup',
                    `
                    <p>Encontrado backup com <strong>${backup.cadastros.length}</strong> cadastros.</p>
                    <p>Data do backup: <strong>${Utils.formatarData(backup.dataBackup, true)}</strong></p>
                    <p>Deseja restaurar este backup? Os cadastros existentes serão mantidos.</p>
                    `,
                    'warning',
                    () => {
                        try {
                            const cadastrosAtuais = Cadastro.obterCadastros();
                            const novosCadastros = [...cadastrosAtuais, ...backup.cadastros];
                            
                            // Remove duplicados por ID
                            const idsUnicos = new Set();
                            const cadastrosUnicos = novosCadastros.filter(cadastro => {
                                if (idsUnicos.has(cadastro.id)) {
                                    return false;
                                }
                                idsUnicos.add(cadastro.id);
                                return true;
                            });
                            
                            // Salva
                            localStorage.setItem(
                                CONFIG.STORAGE.PREFIXO + 'cadastros',
                                JSON.stringify(cadastrosUnicos)
                            );
                            
                            // Atualiza índice
                            Cadastro.atualizarIndiceBusca(cadastrosUnicos);
                            
                            // Atualiza contador
                            Cadastro.atualizarContador();
                            
                            Notificacoes.mostrar(
                                `Backup restaurado! ${backup.cadastros.length} cadastros adicionados. Total: ${cadastrosUnicos.length}`,
                                'success'
                            );
                            
                        } catch (error) {
                            console.error('Erro ao restaurar backup:', error);
                            Notificacoes.mostrar('Erro ao restaurar backup.', 'error');
                        }
                    }
                );
                
            } catch (error) {
                console.error('Erro ao ler arquivo de backup:', error);
                Notificacoes.mostrar('Arquivo de backup inválido.', 'error');
            }
        };
        
        reader.readAsText(arquivo);
    }
};

// ============================================================================
// MÓDULO MODAL
// ============================================================================
const Modal = {
    /**
     * Mostra um modal
     * @param {string} titulo - Título do modal
     * @param {string} conteudo - Conteúdo HTML/texto
     * @param {string} tipo - Tipo (info, warning, error, success)
     * @param {Function} callbackConfirmar - Callback para confirmar
     * @param {Function} callbackCancelar - Callback para cancelar
     */
    mostrar: function(titulo, conteudo, tipo = 'info', callbackConfirmar = null, callbackCancelar = null) {
        const modalOverlay = document.getElementById('confirmation-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const modalConfirmBtn = document.getElementById('modal-confirm-btn');
        
        if (!modalOverlay || !modalTitle || !modalMessage) return;
        
        // Configura título
        modalTitle.textContent = titulo;
        
        // Configura conteúdo
        modalMessage.innerHTML = conteudo;
        
        // Configura cor baseada no tipo
        const tipos = {
            info: 'btn-primary',
            warning: 'btn-warning',
            error: 'btn-danger',
            success: 'btn-success'
        };
        
        if (modalConfirmBtn) {
            modalConfirmBtn.className = `btn ${tipos[tipo] || 'btn-primary'}`;
            modalConfirmBtn.textContent = callbackConfirmar ? 'Confirmar' : 'OK';
            
            // Remove listeners anteriores
            const newBtn = modalConfirmBtn.cloneNode(true);
            modalConfirmBtn.parentNode.replaceChild(newBtn, modalConfirmBtn);
            
            // Adiciona novo listener
            document.getElementById('modal-confirm-btn').onclick = () => {
                if (callbackConfirmar) callbackConfirmar();
                this.fechar();
            };
        }
        
        // Configura botão cancelar
        const btnCancelar = modalOverlay.querySelector('.btn-secondary');
        if (btnCancelar) {
            btnCancelar.onclick = () => {
                if (callbackCancelar) callbackCancelar();
                this.fechar();
            };
        }
        
        // Mostra modal
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Fecha com ESC
        const fecharComESC = (e) => {
            if (e.key === 'Escape') {
                if (callbackCancelar) callbackCancelar();
                this.fechar();
            }
        };
        
        document.addEventListener('keydown', fecharComESC);
        
        // Remove listener quando modal fechar
        this.fecharComESC = fecharComESC;
    },
    
    /**
     * Fecha o modal
     */
    fechar: function() {
        const modalOverlay = document.getElementById('confirmation-modal');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Remove listener ESC
            if (this.fecharComESC) {
                document.removeEventListener('keydown', this.fecharComESC);
                this.fecharComESC = null;
            }
        }
    },
    
    /**
     * Mostra modal de carregamento
     * @param {string} mensagem - Mensagem de carregamento
     */
    mostrarCarregamento: function(mensagem = 'Carregando...') {
        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');
        
        if (loadingOverlay && loadingText) {
            loadingText.textContent = mensagem;
            loadingOverlay.classList.add('active');
        }
    },
    
    /**
     * Esconde modal de carregamento
     */
    esconderCarregamento: function() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }
};

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa módulos
    Mascaras.inicializar();
    Formulario.inicializar();
    Cadastro.inicializar();
    
    // Configura eventos globais
    configurarEventosGlobais();
    
    console.log('Sistema operacional inicializado!');
});

/**
 * Configura eventos globais
 */
function configurarEventosGlobais() {
    // Botão buscar CEP
    const btnBuscarCEP = document.querySelector('[onclick*="ViaCEP.buscar"]');
    if (btnBuscarCEP) {
        btnBuscarCEP.onclick = ViaCEP.buscar;
    }
    
    // Botão limpar formulário
    const btnLimpar = document.querySelector('[onclick*="Formulario.limpar"]');
    if (btnLimpar) {
        btnLimpar.onclick = () => Formulario.limpar();
    }
    
    // Botão salvar
    const btnSalvar = document.querySelector('[onclick*="Cadastro.salvar"]');
    if (btnSalvar) {
        btnSalvar.onclick = () => Cadastro.salvar();
    }
    
    // Atualiza hora no footer
    function atualizarHora() {
        const elemento = document.getElementById('ultima-atualizacao');
        if (elemento) {
            elemento.textContent = new Date().toLocaleTimeString('pt-BR');
        }
    }
    
    atualizarHora();
    setInterval(atualizarHora, 60000); // Atualiza a cada minuto
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.Mascaras = Mascaras;
    window.ViaCEP = ViaCEP;
    window.Formulario = Formulario;
    window.Cadastro = Cadastro;
    window.Modal = Modal;
}
