/**
 * CASTRA PET - Sistema UI e Dados
 * Interface do usuário, exportação, histórico, relatórios e notificações
 * Inclui: Exportação, Histórico, Relatórios, Notificações e Main
 */

// ============================================================================
// MÓDULO DE NOTIFICAÇÕES
// ============================================================================
const Notificacoes = {
    /**
     * Mostra uma notificação toast
     * @param {string} mensagem - Mensagem da notificação
     * @param {string} tipo - Tipo (success, error, info, warning)
     * @param {number} duracao - Duração em milissegundos
     */
    mostrar: function(mensagem, tipo = 'info', duracao = 5000) {
        const container = document.getElementById('toast-container');
        if (!container) {
            console.log(`[${tipo.toUpperCase()}] ${mensagem}`);
            return;
        }
        
        // Cria elemento da notificação
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">
                    <i class="fas ${this.getIcone(tipo)} me-2"></i>
                    ${this.getTitulo(tipo)}
                </strong>
                <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
            <div class="toast-body">
                ${mensagem}
            </div>
        `;
        
        // Adiciona ao container
        container.appendChild(toast);
        
        // Remove automaticamente após a duração
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        }, duracao);
        
        // Animação de entrada
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);
    },
    
    /**
     * Obtém ícone baseado no tipo
     * @param {string} tipo - Tipo da notificação
     * @returns {string} Classe do ícone
     */
    getIcone: function(tipo) {
        const icones = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icones[tipo] || 'fa-info-circle';
    },
    
    /**
     * Obtém título baseado no tipo
     * @param {string} tipo - Tipo da notificação
     * @returns {string} Título
     */
    getTitulo: function(tipo) {
        const titulos = {
            success: 'Sucesso!',
            error: 'Erro!',
            warning: 'Atenção!',
            info: 'Informação'
        };
        return titulos[tipo] || 'Notificação';
    },
    
    /**
     * Limpa todas as notificações
     */
    limparTodas: function() {
        const container = document.getElementById('toast-container');
        if (container) {
            container.innerHTML = '';
        }
    },
    
    /**
     * Mostra notificação de sucesso
     * @param {string} mensagem - Mensagem
     */
    sucesso: function(mensagem) {
        this.mostrar(mensagem, 'success');
    },
    
    /**
     * Mostra notificação de erro
     * @param {string} mensagem - Mensagem
     */
    erro: function(mensagem) {
        this.mostrar(mensagem, 'error');
    },
    
    /**
     * Mostra notificação de aviso
     * @param {string} mensagem - Mensagem
     */
    aviso: function(mensagem) {
        this.mostrar(mensagem, 'warning');
    },
    
    /**
     * Mostra notificação informativa
     * @param {string} mensagem - Mensagem
     */
    informacao: function(mensagem) {
        this.mostrar(mensagem, 'info');
    }
};

// ============================================================================
// MÓDULO DE EXPORTAÇÃO
// ============================================================================
const Exportacao = {
    /**
     * Mostra opções de exportação
     * @param {Array} dados - Dados a serem exportados
     */
    mostrarOpcoesExportacao: function(dados = null) {
        if (!dados) {
            dados = Cadastro.obterCadastros();
        }
        
        if (!dados || dados.length === 0) {
            Notificacoes.mostrar('Nenhum dado para exportar.', 'warning');
            return;
        }
        
        Modal.mostrar(
            'Exportar Dados',
            `
            <p>Selecione o formato de exportação para ${dados.length} registro(s):</p>
            <div class="d-grid gap-2 mt-3">
                <button class="btn btn-outline-primary export-btn" data-action="csv">
                    <i class="fas fa-file-csv me-2"></i>CSV (Excel)
                </button>
                <button class="btn btn-outline-success export-btn" data-action="json">
                    <i class="fas fa-file-code me-2"></i>JSON
                </button>
                <button class="btn btn-outline-danger export-btn" data-action="pdf">
                    <i class="fas fa-file-pdf me-2"></i>PDF
                </button>
                <button class="btn btn-outline-info export-btn" data-action="xlsx">
                    <i class="fas fa-file-excel me-2"></i>Excel (XLSX)
                </button>
                <button class="btn btn-outline-secondary export-btn" data-action="txt">
                    <i class="fas fa-file-alt me-2"></i>Texto (TXT)
                </button>
                <button class="btn btn-outline-warning export-btn" data-action="relatorio">
                    <i class="fas fa-print me-2"></i>Relatório Impresso
                </button>
            </div>
            <div class="mt-3">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="exportarTodosCampos">
                    <label class="form-check-label" for="exportarTodosCampos">
                        Exportar todos os campos (incluindo metadados)
                    </label>
                </div>
            </div>
            `,
            'info'
        );

        // Anexa listeners aos botões do modal (usa closure para 'dados' sem injetar JSON no HTML)
        setTimeout(() => {
            const modalOverlay = document.getElementById('confirmation-modal');
            if (!modalOverlay) return;

            modalOverlay.querySelectorAll('.export-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.getAttribute('data-action');
                    const todosCampos = modalOverlay.querySelector('#exportarTodosCampos')?.checked || false;

                    switch (action) {
                        case 'csv':
                            Exportacao.exportarCSV(dados);
                            break;
                        case 'json':
                            Exportacao.exportarJSON(dados);
                            break;
                        case 'pdf':
                            Exportacao.exportarPDF(dados);
                            break;
                        case 'xlsx':
                            Exportacao.exportarXLSX(dados);
                            break;
                        case 'txt':
                            Exportacao.exportarTXT(dados);
                            break;
                        case 'relatorio':
                            Exportacao.exportarRelatorio(dados);
                            break;
                    }

                    Modal.fechar();
                });
            });
        }, 50);
    },
    
    /**
     * Exporta dados para CSV
     * @param {Array} dados - Dados a exportar
     * @param {string} nomeArquivo - Nome do arquivo
     */
    exportarCSV: function(dados, nomeArquivo = null) {
        try {
            if (!dados || dados.length === 0) {
                Notificacoes.mostrar('Nenhum dado para exportar.', 'warning');
                return;
            }
            
            Modal.mostrarCarregamento('Gerando arquivo CSV...');
            
            // Prepara dados
            const todosCampos = document.getElementById('exportarTodosCampos')?.checked || false;
            const camposExportar = this.getCamposParaExportar(todosCampos);
            
            // Cria cabeçalho
            const cabecalho = camposExportar.map(campo => 
                `"${this.formatarNomeCampoCSV(campo)}"`
            ).join(';');
            
            // Cria linhas
            const linhas = dados.map(registro => {
                return camposExportar.map(campo => {
                    let valor = registro[campo] || '';
                    
                    // Formata valores especiais
                    if (campo === 'dataCadastro' || campo === 'ultimaAtualizacao') {
                        valor = Utils.formatarData(valor, true);
                    } else if (campo === 'cpf') {
                        valor = Utils.formatarCPF(valor);
                    } else if (campo === 'celular' || campo === 'telefone') {
                        valor = Utils.formatarTelefone(valor);
                    } else if (campo === 'cep') {
                        valor = Utils.formatarCEP(valor);
                    }
                    
                    // Escapa aspas e ponto-e-vírgula
                    valor = valor.toString().replace(/"/g, '""');
                    return `"${valor}"`;
                }).join(';');
            });
            
            // Conteúdo final
            const conteudo = [cabecalho, ...linhas].join('\n');
            
            // Nome do arquivo
            if (!nomeArquivo) {
                const data = Utils.formatarData(new Date(), false).replace(/\//g, '-');
                nomeArquivo = `castrapet_exportacao_${data}_${dados.length}_registros.csv`;
            }
            
            // Faz download
            Utils.downloadArquivo(conteudo, nomeArquivo, 'text/csv;charset=utf-8');
            
            Modal.esconderCarregamento();
            Notificacoes.mostrar(`Exportação CSV concluída! ${dados.length} registro(s) exportado(s).`, 'success');
            
        } catch (error) {
            Modal.esconderCarregamento();
            console.error('Erro ao exportar CSV:', error);
            Notificacoes.mostrar('Erro ao exportar CSV.', 'error');
        }
    },
    
    /**
     * Exporta dados para JSON
     * @param {Array|Object} dados - Dados a exportar
     * @param {string} nomeArquivo - Nome do arquivo
     */
    exportarJSON: function(dados, nomeArquivo = null) {
        try {
            if (!dados || (Array.isArray(dados) && dados.length === 0)) {
                Notificacoes.mostrar('Nenhum dado para exportar.', 'warning');
                return;
            }
            
            Modal.mostrarCarregamento('Gerando arquivo JSON...');
            
            // Prepara dados para exportação
            const dadosExportar = Array.isArray(dados) 
                ? dados.map(registro => this.prepararRegistroParaExportacao(registro))
                : this.prepararRegistroParaExportacao(dados);
            
            // Formata JSON
            const conteudo = JSON.stringify(dadosExportar, null, 2);
            
            // Nome do arquivo
            if (!nomeArquivo) {
                const data = Utils.formatarData(new Date(), false).replace(/\//g, '-');
                const qtd = Array.isArray(dados) ? dados.length : 1;
                nomeArquivo = `castrapet_exportacao_${data}_${qtd}_registros.json`;
            }
            
            // Faz download
            Utils.downloadArquivo(conteudo, nomeArquivo, 'application/json');
            
            Modal.esconderCarregamento();
            Notificacoes.mostrar(`Exportação JSON concluída! ${Array.isArray(dados) ? dados.length : 1} registro(s) exportado(s).`, 'success');
            
        } catch (error) {
            Modal.esconderCarregamento();
            console.error('Erro ao exportar JSON:', error);
            Notificacoes.mostrar('Erro ao exportar JSON.', 'error');
        }
    },
    
    /**
     * Exporta dados para PDF
     * @param {Array} dados - Dados a exportar
     */
    exportarPDF: function(dados) {
        try {
            if (!dados || dados.length === 0) {
                Notificacoes.mostrar('Nenhum dado para exportar.', 'warning');
                return;
            }
            
            Notificacoes.mostrar('Exportação PDF em desenvolvimento...', 'info');
            
            // Em produção, você pode usar bibliotecas como jsPDF ou pdfmake
            // Aqui está um exemplo simplificado
            
            if (typeof window.jspdf !== 'undefined') {
                this.gerarPDFComJSPDF(dados);
            } else {
                // Fallback para relatório HTML
                this.exportarRelatorio(dados);
            }
            
        } catch (error) {
            console.error('Erro ao exportar PDF:', error);
            Notificacoes.mostrar('Erro ao exportar PDF.', 'error');
        }
    },
    
    /**
     * Exporta dados para XLSX (Excel)
     * @param {Array} dados - Dados a exportar
     */
    exportarXLSX: function(dados) {
        try {
            if (!dados || dados.length === 0) {
                Notificacoes.mostrar('Nenhum dado para exportar.', 'warning');
                return;
            }
            
            Notificacoes.mostrar('Exportação Excel em desenvolvimento...', 'info');
            
            // Em produção, você pode usar bibliotecas como SheetJS
            // Como fallback, exportamos como CSV que o Excel pode abrir
            this.exportarCSV(dados, `castrapet_exportacao_${Utils.formatarData(new Date(), false).replace(/\//g, '-')}.xlsx`);
            
        } catch (error) {
            console.error('Erro ao exportar Excel:', error);
            Notificacoes.mostrar('Erro ao exportar Excel.', 'error');
        }
    },
    
    /**
     * Exporta dados para TXT
     * @param {Array} dados - Dados a exportar
     */
    exportarTXT: function(dados) {
        try {
            if (!dados || dados.length === 0) {
                Notificacoes.mostrar('Nenhum dado para exportar.', 'warning');
                return;
            }
            
            Modal.mostrarCarregamento('Gerando arquivo de texto...');
            
            let conteudo = '='.repeat(80) + '\n';
            conteudo += 'RELATÓRIO CASTRA PET - SISTEMA DE CADASTRO DE ANIMAIS\n';
            conteudo += '='.repeat(80) + '\n\n';
            conteudo += `Data da exportação: ${Utils.formatarData(new Date(), true)}\n`;
            conteudo += `Total de registros: ${dados.length}\n`;
            conteudo += '\n' + '='.repeat(80) + '\n\n';
            
            // Adiciona cada registro
            dados.forEach((registro, index) => {
                conteudo += `REGISTRO ${index + 1} de ${dados.length}\n`;
                conteudo += '-'.repeat(40) + '\n';
                
                const campos = this.getCamposParaExportar(true);
                
                campos.forEach(campo => {
                    if (registro[campo]) {
                        const nomeCampo = this.formatarNomeCampoCSV(campo).padEnd(25, ' ');
                        let valor = registro[campo];
                        
                        // Formata valores especiais
                        if (campo === 'dataCadastro' || campo === 'ultimaAtualizacao') {
                            valor = Utils.formatarData(valor, true);
                        } else if (campo === 'cpf') {
                            valor = Utils.formatarCPF(valor);
                        }
                        
                        conteudo += `${nomeCampo}: ${valor}\n`;
                    }
                });
                
                conteudo += '\n';
            });
            
            conteudo += '='.repeat(80) + '\n';
            conteudo += 'FIM DO RELATÓRIO\n';
            conteudo += '='.repeat(80);
            
            const nomeArquivo = `castrapet_relatorio_${Utils.formatarData(new Date(), false).replace(/\//g, '-')}.txt`;
            Utils.downloadArquivo(conteudo, nomeArquivo, 'text/plain');
            
            Modal.esconderCarregamento();
            Notificacoes.mostrar(`Exportação TXT concluída! ${dados.length} registro(s) exportado(s).`, 'success');
            
        } catch (error) {
            Modal.esconderCarregamento();
            console.error('Erro ao exportar TXT:', error);
            Notificacoes.mostrar('Erro ao exportar TXT.', 'error');
        }
    },
    
    /**
     * Exporta relatório formatado
     * @param {Array} dados - Dados a exportar
     */
    exportarRelatorio: function(dados) {
        try {
            if (!dados || dados.length === 0) {
                Notificacoes.mostrar('Nenhum dado para exportar.', 'warning');
                return;
            }
            
            // Abre nova janela com relatório formatado
            const janela = window.open('', '_blank');
            if (!janela) {
                Notificacoes.mostrar('Permita pop-ups para visualizar o relatório.', 'warning');
                return;
            }
            
            const estilo = `
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #333; border-bottom: 2px solid #4361ee; padding-bottom: 10px; }
                    h2 { color: #4361ee; margin-top: 30px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th { background: #4361ee; color: white; padding: 10px; text-align: left; }
                    td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
                    .registro { margin-bottom: 40px; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    .info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
                    .label { font-weight: bold; color: #555; }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            `;
            
            let conteudo = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Relatório Castra Pet</title>
                    ${estilo}
                </head>
                <body>
                    <h1>📋 Relatório Castra Pet</h1>
                    <div class="info">
                        <p><span class="label">Data do relatório:</span> ${Utils.formatarData(new Date(), true)}</p>
                        <p><span class="label">Total de registros:</span> ${dados.length}</p>
                    </div>
                    <div class="no-print">
                        <button onclick="window.print()">🖨️ Imprimir</button>
                        <button onclick="window.close()">❌ Fechar</button>
                    </div>
            `;
            
            // Adiciona cada registro
            dados.forEach((registro, index) => {
                conteudo += `
                    <div class="registro">
                        <h2>🐾 Registro ${index + 1} - ${registro.animal || 'Sem nome'}</h2>
                        
                        <h3>Informações do Animal</h3>
                        <table>
                            <tr><td><strong>Nome:</strong></td><td>${registro.animal || '-'}</td></tr>
                            <tr><td><strong>Espécie:</strong></td><td>${registro.especie || '-'}</td></tr>
                            <tr><td><strong>Sexo:</strong></td><td>${registro.sexo || '-'}</td></tr>
                            <tr><td><strong>Pelagem:</strong></td><td>${registro.pelagem || '-'}</td></tr>
                            <tr><td><strong>Idade:</strong></td><td>${registro.idade || '-'}</td></tr>
                            <tr><td><strong>Porte:</strong></td><td>${registro.porte || '-'}</td></tr>
                            <tr><td><strong>Raça:</strong></td><td>${registro.raca || '-'}</td></tr>
                            <tr><td><strong>Castrado:</strong></td><td>${registro.castra || '-'}</td></tr>
                            <tr><td><strong>Microchip:</strong></td><td>${registro.microchip || 'Não informado'}</td></tr>
                        </table>
                        
                        <h3>Informações do Tutor</h3>
                        <table>
                            <tr><td><strong>Nome:</strong></td><td>${registro.tutor || '-'}</td></tr>
                            <tr><td><strong>CPF:</strong></td><td>${Utils.formatarCPF(registro.cpf) || '-'}</td></tr>
                            <tr><td><strong>RG:</strong></td><td>${registro.rg || '-'}</td></tr>
                            <tr><td><strong>Celular:</strong></td><td>${Utils.formatarTelefone(registro.celular) || '-'}</td></tr>
                            <tr><td><strong>E-mail:</strong></td><td>${registro.email || 'Não informado'}</td></tr>
                        </table>
                        
                        <h3>Endereço</h3>
                        <table>
                            <tr><td><strong>Logradouro:</strong></td><td>${registro.logradouro || '-'}, ${registro.numero || '-'}</td></tr>
                            <tr><td><strong>Complemento:</strong></td><td>${registro.complemento || 'Não informado'}</td></tr>
                            <tr><td><strong>Bairro:</strong></td><td>${registro.bairro || '-'}</td></tr>
                            <tr><td><strong>Cidade/Estado:</strong></td><td>${registro.cidade || '-'}/${registro.estado || '-'}</td></tr>
                            <tr><td><strong>CEP:</strong></td><td>${Utils.formatarCEP(registro.cep) || '-'}</td></tr>
                        </table>
                        
                        <div class="info">
                            <p><strong>ID do cadastro:</strong> ${registro.id || '-'}</p>
                            <p><strong>Data do cadastro:</strong> ${Utils.formatarData(registro.dataCadastro, true)}</p>
                        </div>
                    </div>
                    <hr>
                `;
            });
            
            conteudo += `
                    <div class="info no-print">
                        <p><strong>Relatório gerado automaticamente pelo Sistema Castra Pet</strong></p>
                        <p>Total de páginas: ${Math.ceil(dados.length / 5)}</p>
                    </div>
                </body>
                </html>
            `;
            
            janela.document.write(conteudo);
            janela.document.close();
            
            Notificacoes.mostrar(`Relatório gerado com ${dados.length} registro(s)!`, 'success');
            
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            Notificacoes.mostrar('Erro ao gerar relatório.', 'error');
        }
    },
    
    /**
     * Obtém campos para exportação
     * @param {boolean} todosCampos - Incluir todos os campos
     * @returns {Array} Lista de campos
     */
    getCamposParaExportar: function(todosCampos = false) {
        const camposBase = [
            'id', 'animal', 'especie', 'sexo', 'pelagem', 'idade',
            'porte', 'raca', 'castra', 'microchip', 'observacoes',
            'tutor', 'cpf', 'rg', 'celular', 'telefone', 'email',
            'profissao', 'cep', 'logradouro', 'numero', 'complemento',
            'bairro', 'cidade', 'estado', 'referencia'
        ];
        
        const camposExtras = [
            'dataCadastro', 'ultimaAtualizacao'
        ];
        
        return todosCampos ? [...camposBase, ...camposExtras] : camposBase;
    },
    
    /**
     * Formata nome do campo para CSV
     * @param {string} campo - Nome do campo
     * @returns {string} Nome formatado
     */
    formatarNomeCampoCSV: function(campo) {
        const nomes = {
            id: 'ID',
            animal: 'Nome do Animal',
            especie: 'Espécie',
            sexo: 'Sexo',
            pelagem: 'Pelagem',
            idade: 'Idade',
            porte: 'Porte',
            raca: 'Raça Definida',
            castra: 'Castrado',
            microchip: 'Microchip',
            observacoes: 'Observações',
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
            dataCadastro: 'Data do Cadastro',
            ultimaAtualizacao: 'Última Atualização'
        };
        
        return nomes[campo] || campo;
    },
    
    /**
     * Prepara registro para exportação
     * @param {Object} registro - Registro original
     * @returns {Object} Registro preparado
     */
    prepararRegistroParaExportacao: function(registro) {
        const registroExportar = { ...registro };
        
        // Remove campos internos se necessário
        delete registroExportar._internal;
        
        return registroExportar;
    },
    
    /**
     * Gera PDF usando jsPDF (se disponível)
     * @param {Array} dados - Dados a exportar
     */
    gerarPDFComJSPDF: function(dados) {
        // Implementação básica com jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text('Relatório Castra Pet', 20, 20);
        doc.setFontSize(10);
        doc.text(`Data: ${Utils.formatarData(new Date(), false)}`, 20, 30);
        doc.text(`Registros: ${dados.length}`, 20, 35);
        
        let y = 45;
        dados.forEach((registro, index) => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            
            doc.setFontSize(12);
            doc.text(`${index + 1}. ${registro.animal} - ${registro.tutor}`, 20, y);
            y += 7;
            
            doc.setFontSize(10);
            doc.text(`Espécie: ${registro.especie} | Sexo: ${registro.sexo} | Idade: ${registro.idade}`, 20, y);
            y += 5;
            doc.text(`Endereço: ${registro.logradouro}, ${registro.numero} - ${registro.cidade}/${registro.estado}`, 20, y);
            y += 10;
        });
        
        doc.save(`castrapet_relatorio_${Utils.formatarData(new Date(), false).replace(/\//g, '-')}.pdf`);
        Notificacoes.mostrar(`PDF gerado com ${dados.length} registro(s)!`, 'success');
    }
};

// ============================================================================
// MÓDULO DE HISTÓRICO
// ============================================================================
const Historico = {
    /**
     * Abre a interface de histórico
     */
    abrir: function() {
        this.carregarInterface();
        this.navegarPara('buscar');
    },
    
    /**
     * Carrega a interface de histórico
     */
    carregarInterface: function() {
        const secao = document.getElementById('buscar-section');
        if (!secao) return;
        
        secao.innerHTML = `
            <div class="section-header">
                <h1><i class="fas fa-search me-2"></i>Buscar Cadastros</h1>
                <p class="lead">Encontre cadastros por nome, microchip ou tutor</p>
            </div>
            
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="row g-3 mb-4">
                                <div class="col-md-4">
                                    <label for="buscar-animal" class="form-label">
                                        <i class="fas fa-dog me-1"></i>Nome do Animal
                                    </label>
                                    <input type="text" class="form-control" id="buscar-animal" 
                                           placeholder="Digite o nome do animal">
                                </div>
                                
                                <div class="col-md-4">
                                    <label for="buscar-tutor" class="form-label">
                                        <i class="fas fa-user me-1"></i>Nome do Tutor
                                    </label>
                                    <input type="text" class="form-control" id="buscar-tutor" 
                                           placeholder="Digite o nome do tutor">
                                </div>
                                
                                <div class="col-md-4">
                                    <label for="buscar-microchip" class="form-label">
                                        <i class="fas fa-microchip me-1"></i>Microchip
                                    </label>
                                    <input type="text" class="form-control" id="buscar-microchip" 
                                           placeholder="Número do microchip">
                                </div>
                                
                                <div class="col-md-3">
                                    <label for="buscar-especie" class="form-label">
                                        <i class="fas fa-crow me-1"></i>Espécie
                                    </label>
                                    <select class="form-select" id="buscar-especie">
                                        <option value="">Todas</option>
                                        <option value="CÃO">Cão</option>
                                        <option value="GATO">Gato</option>
                                        <option value="OUTRO">Outro</option>
                                    </select>
                                </div>
                                
                                <div class="col-md-3">
                                    <label for="buscar-sexo" class="form-label">
                                        <i class="fas fa-venus-mars me-1"></i>Sexo
                                    </label>
                                    <select class="form-select" id="buscar-sexo">
                                        <option value="">Todos</option>
                                        <option value="MACHO">Macho</option>
                                        <option value="FÊMEA">Fêmea</option>
                                    </select>
                                </div>
                                
                                <div class="col-md-3">
                                    <label for="buscar-castra" class="form-label">
                                        <i class="fas fa-clinic-medical me-1"></i>Castrado
                                    </label>
                                    <select class="form-select" id="buscar-castra">
                                        <option value="">Todos</option>
                                        <option value="SIM">Sim</option>
                                        <option value="NÃO">Não</option>
                                    </select>
                                </div>
                                
                                <div class="col-md-3">
                                    <label for="buscar-data" class="form-label">
                                        <i class="fas fa-calendar me-1"></i>Data
                                    </label>
                                    <input type="date" class="form-control" id="buscar-data">
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-between mb-4">
                                <button class="btn btn-primary" onclick="Historico.buscar()">
                                    <i class="fas fa-search me-2"></i>Buscar
                                </button>
                                
                                <div>
                                    <button class="btn btn-outline-secondary me-2" onclick="Historico.limparBusca()">
                                        <i class="fas fa-broom me-2"></i>Limpar
                                    </button>
                                    <button class="btn btn-success" onclick="Cadastro.exportarTodos()">
                                        <i class="fas fa-file-export me-2"></i>Exportar Todos
                                    </button>
                                </div>
                            </div>
                            
                            <div id="resultados-busca" class="mt-4">
                                <div class="text-center text-muted">
                                    <i class="fas fa-search fa-3x mb-3"></i>
                                    <p>Use os filtros acima para buscar cadastros</p>
                                </div>
                            </div>
                            
                            <div id="estatisticas-busca" class="mt-4 card bg-light">
                                <div class="card-body">
                                    <div class="row text-center">
                                        <div class="col-md-3">
                                            <h5 id="total-cadastros-busca">0</h5>
                                            <small>Total de Cadastros</small>
                                        </div>
                                        <div class="col-md-3">
                                            <h5 id="total-caes-busca">0</h5>
                                            <small>Cães</small>
                                        </div>
                                        <div class="col-md-3">
                                            <h5 id="total-gatos-busca">0</h5>
                                            <small>Gatos</small>
                                        </div>
                                        <div class="col-md-3">
                                            <h5 id="total-castrados-busca">0</h5>
                                            <small>Castrados</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Atualiza estatísticas
        this.atualizarEstatisticas();
    },
    
    /**
     * Realiza busca com os filtros
     */
    buscar: function() {
        const criterios = {
            animal: document.getElementById('buscar-animal')?.value,
            tutor: document.getElementById('buscar-tutor')?.value,
            microchip: document.getElementById('buscar-microchip')?.value,
            especie: document.getElementById('buscar-especie')?.value,
            sexo: document.getElementById('buscar-sexo')?.value,
            castra: document.getElementById('buscar-castra')?.value
        };
        
        // Remove critérios vazios
        Object.keys(criterios).forEach(key => {
            if (!criterios[key]) delete criterios[key];
        });
        
        const resultados = Cadastro.buscar(criterios);
        this.mostrarResultados(resultados);
    },
    
    /**
     * Mostra resultados da busca
     * @param {Array} resultados - Resultados da busca
     */
    mostrarResultados: function(resultados) {
        const container = document.getElementById('resultados-busca');
        if (!container) return;
        
        if (resultados.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted py-5">
                    <i class="fas fa-search fa-3x mb-3"></i>
                    <h4>Nenhum cadastro encontrado</h4>
                    <p>Tente ajustar os critérios de busca</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Animal</th>
                            <th>Tutor</th>
                            <th>Espécie</th>
                            <th>Sexo</th>
                            <th>Castrado</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        resultados.forEach((cadastro, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <strong>${cadastro.animal || '-'}</strong>
                        ${cadastro.microchip ? `<br><small class="text-muted">${cadastro.microchip}</small>` : ''}
                    </td>
                    <td>${cadastro.tutor || '-'}</td>
                    <td>${cadastro.especie || '-'}</td>
                    <td>${cadastro.sexo || '-'}</td>
                    <td>
                        <span class="badge bg-${cadastro.castra === 'SIM' ? 'success' : 'warning'}">
                            ${cadastro.castra || '-'}
                        </span>
                    </td>
                    <td>${Utils.formatarData(cadastro.dataCadastro, false)}</td>
                    <td>
                        <button class="btn btn-sm btn-info me-1" onclick="Historico.verDetalhes('${cadastro.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning me-1" onclick="Historico.editar('${cadastro.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="Cadastro.excluir('${cadastro.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
            
            <div class="d-flex justify-content-between align-items-center mt-3">
                <div>
                    <span class="text-muted">${resultados.length} resultado(s) encontrado(s)</span>
                </div>
                <div>
                    <button class="btn btn-outline-primary btn-sm btn-export-resultados">
                        <i class="fas fa-download me-1"></i>Exportar Resultados
                    </button>
                </div>
            </div>
        `;
        
        container.innerHTML = html;

        // Anexa listener para exportar resultados (usa closure para 'resultados')
        const btnExportarResultados = container.querySelector('.btn-export-resultados');
        if (btnExportarResultados) {
            btnExportarResultados.addEventListener('click', () => {
                Exportacao.exportarCSV(resultados);
            });
        }
    },
    
    /**
     * Mostra detalhes de um cadastro
     * @param {string} id - ID do cadastro
     */
    verDetalhes: function(id) {
        const cadastros = Cadastro.obterCadastros();
        const cadastro = cadastros.find(c => c.id === id);
        
        if (!cadastro) {
            Notificacoes.mostrar('Cadastro não encontrado.', 'error');
            return;
        }
        
        Modal.mostrar(
            `Detalhes - ${cadastro.animal}`,
            this.getHtmlDetalhes(cadastro),
            'info'
        );

        // Anexa listener ao botão de exportar no modal de detalhes
        setTimeout(() => {
            const modal = document.getElementById('confirmation-modal');
            if (!modal) return;
            const btnExportDetalhe = modal.querySelector('.btn-export-detalhe');
            if (btnExportDetalhe) {
                btnExportDetalhe.addEventListener('click', () => {
                    Exportacao.exportarJSON([cadastro]);
                    Modal.fechar();
                });
            }
        }, 50);
    },
    
    /**
     * Gera HTML para detalhes do cadastro
     * @param {Object} cadastro - Dados do cadastro
     * @returns {string} HTML
     */
    getHtmlDetalhes: function(cadastro) {
        return `
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="fas fa-paw me-2"></i>Animal</h6>
                    <p><strong>Nome:</strong> ${cadastro.animal || '-'}</p>
                    <p><strong>Espécie:</strong> ${cadastro.especie || '-'}</p>
                    <p><strong>Sexo:</strong> ${cadastro.sexo || '-'}</p>
                    <p><strong>Pelagem:</strong> ${cadastro.pelagem || '-'}</p>
                    <p><strong>Idade:</strong> ${cadastro.idade || '-'}</p>
                    <p><strong>Porte:</strong> ${cadastro.porte || '-'}</p>
                    <p><strong>Raça:</strong> ${cadastro.raca || '-'}</p>
                    <p><strong>Castrado:</strong> ${cadastro.castra || '-'}</p>
                    <p><strong>Microchip:</strong> ${cadastro.microchip || 'Não informado'}</p>
                </div>
                
                <div class="col-md-6">
                    <h6><i class="fas fa-user me-2"></i>Tutor</h6>
                    <p><strong>Nome:</strong> ${cadastro.tutor || '-'}</p>
                    <p><strong>CPF:</strong> ${Utils.formatarCPF(cadastro.cpf) || '-'}</p>
                    <p><strong>RG:</strong> ${cadastro.rg || '-'}</p>
                    <p><strong>Celular:</strong> ${Utils.formatarTelefone(cadastro.celular) || '-'}</p>
                    <p><strong>Telefone:</strong> ${cadastro.telefone ? Utils.formatarTelefone(cadastro.telefone) : 'Não informado'}</p>
                    <p><strong>E-mail:</strong> ${cadastro.email || 'Não informado'}</p>
                    <p><strong>Profissão:</strong> ${cadastro.profissao || 'Não informada'}</p>
                </div>
                
                <div class="col-md-12 mt-3">
                    <h6><i class="fas fa-home me-2"></i>Endereço</h6>
                    <p>${cadastro.logradouro || '-'}, ${cadastro.numero || '-'}</p>
                    <p>${cadastro.complemento ? `Complemento: ${cadastro.complemento}<br>` : ''}
                       Bairro: ${cadastro.bairro || '-'}<br>
                       ${cadastro.cidade || '-'} - ${cadastro.estado || '-'}<br>
                       CEP: ${Utils.formatarCEP(cadastro.cep) || '-'}</p>
                </div>
                
                <div class="col-md-12 mt-3">
                    <div class="alert alert-light">
                        <h6><i class="fas fa-info-circle me-2"></i>Informações do Cadastro</h6>
                        <p><strong>ID:</strong> ${cadastro.id || '-'}</p>
                        <p><strong>Data do Cadastro:</strong> ${Utils.formatarData(cadastro.dataCadastro, true)}</p>
                        <p><strong>Última Atualização:</strong> ${Utils.formatarData(cadastro.ultimaAtualizacao, true)}</p>
                    </div>
                </div>
            </div>
            
            <div class="mt-3">
                <button class="btn btn-primary me-2 btn-export-detalhe">
                    <i class="fas fa-download me-1"></i>Exportar
                </button>
                <button class="btn btn-warning me-2" onclick="Historico.editar('${cadastro.id}')">
                    <i class="fas fa-edit me-1"></i>Editar
                </button>
                <button class="btn btn-danger" onclick="Cadastro.excluir('${cadastro.id}'); Modal.fechar()">
                    <i class="fas fa-trash me-1"></i>Excluir
                </button>
            </div>
        `;
    },
    
    /**
     * Edita um cadastro existente
     * @param {string} id - ID do cadastro
     */
    editar: function(id) {
        const cadastros = Cadastro.obterCadastros();
        const cadastro = cadastros.find(c => c.id === id);
        
        if (!cadastro) {
            Notificacoes.mostrar('Cadastro não encontrado.', 'error');
            return;
        }
        
        Modal.mostrar(
            `Editar Cadastro - ${cadastro.animal}`,
            `
            <p>Deseja editar o cadastro de <strong>${cadastro.animal}</strong>?</p>
            <p>O formulário atual será preenchido com os dados deste cadastro.</p>
            `,
            'warning',
            () => {
                // Preenche formulário com dados do cadastro
                Object.keys(cadastro).forEach(campo => {
                    const elemento = document.getElementById(campo);
                    if (elemento && cadastro[campo]) {
                        elemento.value = cadastro[campo];
                        // Dispara eventos para máscaras e validações
                        elemento.dispatchEvent(new Event('input'));
                    }
                });
                
                // Navega para o formulário
                navegarPara('formulario');
                
                Notificacoes.mostrar('Cadastro carregado para edição!', 'success');
            }
        );
    },
    
    /**
     * Limpa os campos de busca
     */
    limparBusca: function() {
        const campos = [
            'buscar-animal', 'buscar-tutor', 'buscar-microchip',
            'buscar-especie', 'buscar-sexo', 'buscar-castra', 'buscar-data'
        ];
        
        campos.forEach(id => {
            const campo = document.getElementById(id);
            if (campo) campo.value = '';
        });
        
        const container = document.getElementById('resultados-busca');
        if (container) {
            container.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-search fa-3x mb-3"></i>
                    <p>Use os filtros acima para buscar cadastros</p>
                </div>
            `;
        }
    },
    
    /**
     * Atualiza estatísticas na interface
     */
    atualizarEstatisticas: function() {
        const cadastros = Cadastro.obterCadastros();
        
        const total = cadastros.length;
        const caes = cadastros.filter(c => c.especie === 'CÃO').length;
        const gatos = cadastros.filter(c => c.especie === 'GATO').length;
        const castrados = cadastros.filter(c => c.castra === 'SIM').length;
        
        const elementos = {
            'total-cadastros-busca': total,
            'total-caes-busca': caes,
            'total-gatos-busca': gatos,
            'total-castrados-busca': castrados
        };
        
        Object.keys(elementos).forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.textContent = elementos[id];
            }
        });
    }
};

// ============================================================================
// MÓDULO DE RELATÓRIOS
// ============================================================================
const Relatorios = {
    /**
     * Abre a interface de relatórios
     */
    abrir: function() {
        this.carregarInterface();
        this.navegarPara('relatorios');
    },
    
    /**
     * Carrega a interface de relatórios
     */
    carregarInterface: function() {
        const secao = document.getElementById('relatorios-section');
        if (!secao) return;
        
        secao.innerHTML = `
            <div class="section-header">
                <h1><i class="fas fa-chart-bar me-2"></i>Relatórios e Estatísticas</h1>
                <p class="lead">Visualize estatísticas e gere relatórios do sistema</p>
            </div>
            
            <div class="row">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fas fa-chart-pie me-2"></i>Distribuição por Espécie</h5>
                            <div class="chart-container" style="height: 300px;">
                                <canvas id="chart-especies"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fas fa-chart-bar me-2"></i>Estatísticas Rápidas</h5>
                            <div class="list-group list-group-flush">
                                <div class="list-group-item d-flex justify-content-between">
                                    <span>Total de Cadastros</span>
                                    <span class="badge bg-primary" id="total-relatorio">0</span>
                                </div>
                                <div class="list-group-item d-flex justify-content-between">
                                    <span>Cães</span>
                                    <span class="badge bg-success" id="caes-relatorio">0</span>
                                </div>
                                <div class="list-group-item d-flex justify-content-between">
                                    <span>Gatos</span>
                                    <span class="badge bg-info" id="gatos-relatorio">0</span>
                                </div>
                                <div class="list-group-item d-flex justify-content-between">
                                    <span>Castrados</span>
                                    <span class="badge bg-warning" id="castrados-relatorio">0</span>
                                </div>
                                <div class="list-group-item d-flex justify-content-between">
                                    <span>Com Microchip</span>
                                    <span class="badge bg-secondary" id="microchips-relatorio">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mt-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fas fa-venus-mars me-2"></i>Distribuição por Sexo</h5>
                            <div class="chart-container" style="height: 250px;">
                                <canvas id="chart-sexo"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mt-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fas fa-weight me-2"></i>Distribuição por Porte</h5>
                            <div class="chart-container" style="height: 250px;">
                                <canvas id="chart-porte"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-12 mt-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fas fa-calendar me-2"></i>Cadastros por Mês</h5>
                            <div class="chart-container" style="height: 300px;">
                                <canvas id="chart-mensal"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-12 mt-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title"><i class="fas fa-cogs me-2"></i>Ações</h5>
                            <div class="d-grid gap-2 d-md-flex">
                                <button class="btn btn-primary me-2" onclick="Relatorios.gerarRelatorioCompleto()">
                                    <i class="fas fa-file-pdf me-2"></i>Gerar Relatório Completo
                                </button>
                                <button class="btn btn-success me-2" onclick="Cadastro.fazerBackup()">
                                    <i class="fas fa-database me-2"></i>Fazer Backup
                                </button>
                                <button class="btn btn-warning" onclick="Relatorios.restaurarBackup()">
                                    <i class="fas fa-upload me-2"></i>Restaurar Backup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Carrega gráficos
        setTimeout(() => {
            this.carregarGraficos();
            this.atualizarEstatisticas();
        }, 500);
    },
    
    /**
     * Carrega todos os gráficos
     */
    carregarGraficos: function() {
        const cadastros = Cadastro.obterCadastros();
        
        // Gráfico de espécies
        this.criarGraficoPizza('chart-especies', {
            labels: ['Cães', 'Gatos', 'Outros'],
            data: [
                cadastros.filter(c => c.especie === 'CÃO').length,
                cadastros.filter(c => c.especie === 'GATO').length,
                cadastros.filter(c => c.especie !== 'CÃO' && c.especie !== 'GATO').length
            ],
            colors: ['#4361ee', '#7209b7', '#f72585']
        });
        
        // Gráfico de sexo
        this.criarGraficoPizza('chart-sexo', {
            labels: ['Macho', 'Fêmea'],
            data: [
                cadastros.filter(c => c.sexo === 'MACHO').length,
                cadastros.filter(c => c.sexo === 'FÊMEA').length
            ],
            colors: ['#4cc9f0', '#f72585']
        });
        
        // Gráfico de porte
        this.criarGraficoBarras('chart-porte', {
            labels: ['Pequeno', 'Médio', 'Grande', 'Gigante'],
            data: [
                cadastros.filter(c => c.porte === 'PEQUENO').length,
                cadastros.filter(c => c.porte === 'MEDIO').length,
                cadastros.filter(c => c.porte === 'GRANDE').length,
                cadastros.filter(c => c.porte === 'GIGANTE').length
            ],
            color: '#4361ee'
        });
        
        // Gráfico mensal
        this.criarGraficoLinhas('chart-mensal', this.getDadosMensais(cadastros));
    },
    
    /**
     * Obtém dados mensais para gráfico
     * @param {Array} cadastros - Lista de cadastros
     * @returns {Object} Dados para gráfico
     */
    getDadosMensais: function(cadastros) {
        const meses = [];
        const dados = [];
        const agora = new Date();
        
        // Últimos 6 meses
        for (let i = 5; i >= 0; i--) {
            const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
            const mesAno = data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
            meses.push(mesAno);
            
            const mes = data.getMonth() + 1;
            const ano = data.getFullYear();
            
            const totalMes = cadastros.filter(c => {
                const dataCad = new Date(c.dataCadastro);
                return dataCad.getMonth() + 1 === mes && dataCad.getFullYear() === ano;
            }).length;
            
            dados.push(totalMes);
        }
        
        return { labels: meses, data: dados };
    },
    
    /**
     * Cria gráfico de pizza
     */
    criarGraficoPizza: function(idCanvas, dados) {
        const canvas = document.getElementById(idCanvas);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Simulação de gráfico (em produção, use Chart.js)
        this.desenharGraficoSimulado(ctx, dados);
    },
    
    /**
     * Cria gráfico de barras
     */
    criarGraficoBarras: function(idCanvas, dados) {
        const canvas = document.getElementById(idCanvas);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        this.desenharBarrasSimuladas(ctx, dados);
    },
    
    /**
     * Cria gráfico de linhas
     */
    criarGraficoLinhas: function(idCanvas, dados) {
        const canvas = document.getElementById(idCanvas);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        this.desenharLinhasSimuladas(ctx, dados);
    },
    
    /**
     * Desenha gráfico simulado (fallback)
     */
    desenharGraficoSimulado: function(ctx, dados) {
        // Implementação simplificada
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const centroX = ctx.canvas.width / 2;
        const centroY = ctx.canvas.height / 2;
        const raio = Math.min(centroX, centroY) * 0.7;
        
        let anguloInicio = 0;
        const total = dados.data.reduce((a, b) => a + b, 0);
        
        dados.data.forEach((valor, index) => {
            if (valor === 0) return;
            
            const proporcao = valor / total;
            const angulo = proporcao * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(centroX, centroY);
            ctx.arc(centroX, centroY, raio, anguloInicio, anguloInicio + angulo);
            ctx.closePath();
            
            ctx.fillStyle = dados.colors[index] || '#cccccc';
            ctx.fill();
            
            // Legenda
            const anguloMeio = anguloInicio + angulo / 2;
            const textoX = centroX + (raio + 20) * Math.cos(anguloMeio);
            const textoY = centroY + (raio + 20) * Math.sin(anguloMeio);
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = textoX > centroX ? 'left' : 'right';
            ctx.fillText(`${dados.labels[index]}: ${valor} (${Math.round(proporcao * 100)}%)`, textoX, textoY);
            
            anguloInicio += angulo;
        });
    },
    
    /**
     * Desenha barras simuladas
     */
    desenharBarrasSimuladas: function(ctx, dados) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const larguraBarra = 40;
        const espacamento = 20;
        const margem = 40;
        const alturaMax = ctx.canvas.height - margem * 2;
        const maxValor = Math.max(...dados.data);
        
        const xInicial = (ctx.canvas.width - (dados.data.length * (larguraBarra + espacamento) - espacamento)) / 2;
        
        dados.data.forEach((valor, index) => {
            const x = xInicial + index * (larguraBarra + espacamento);
            const altura = (valor / maxValor) * alturaMax;
            const y = ctx.canvas.height - margem - altura;
            
            ctx.fillStyle = dados.color || '#4361ee';
            ctx.fillRect(x, y, larguraBarra, altura);
            
            // Valor
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(valor.toString(), x + larguraBarra / 2, y - 5);
            
            // Label
            ctx.fillText(dados.labels[index], x + larguraBarra / 2, ctx.canvas.height - margem + 20);
        });
    },
    
    /**
     * Desenha linhas simuladas
     */
    desenharLinhasSimuladas: function(ctx, dados) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        const margem = 40;
        const alturaMax = ctx.canvas.height - margem * 2;
        const larguraUtil = ctx.canvas.width - margem * 2;
        const maxValor = Math.max(...dados.data);
        
        // Desenha linha
        ctx.beginPath();
        ctx.strokeStyle = '#4361ee';
        ctx.lineWidth = 3;
        
        dados.data.forEach((valor, index) => {
            const x = margem + (larguraUtil / (dados.data.length - 1)) * index;
            const y = ctx.canvas.height - margem - (valor / maxValor) * alturaMax;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            // Ponto
            ctx.fillStyle = '#4361ee';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
            
            // Valor
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(valor.toString(), x, y - 15);
            
            // Label
            ctx.fillText(dados.labels[index], x, ctx.canvas.height - margem + 20);
        });
        
        ctx.stroke();
    },
    
    /**
     * Atualiza estatísticas na interface
     */
    atualizarEstatisticas: function() {
        const cadastros = Cadastro.obterCadastros();
        
        const elementos = {
            'total-relatorio': cadastros.length,
            'caes-relatorio': cadastros.filter(c => c.especie === 'CÃO').length,
            'gatos-relatorio': cadastros.filter(c => c.especie === 'GATO').length,
            'castrados-relatorio': cadastros.filter(c => c.castra === 'SIM').length,
            'microchips-relatorio': cadastros.filter(c => c.microchip && c.microchip.length === 15).length
        };
        
        Object.keys(elementos).forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.textContent = elementos[id];
            }
        });
    },
    
    /**
     * Gera relatório completo
     */
    gerarRelatorioCompleto: function() {
        const cadastros = Cadastro.obterCadastros();
        
        if (cadastros.length === 0) {
            Notificacoes.mostrar('Nenhum cadastro para gerar relatório.', 'warning');
            return;
        }
        
        Exportacao.exportarRelatorio(cadastros);
    },
    
    /**
     * Abre diálogo para restaurar backup
     */
    restaurarBackup: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.txt';
        
        input.onchange = function(e) {
            const arquivo = e.target.files[0];
            if (arquivo) {
                Cadastro.restaurarBackup(arquivo);
            }
        };
        
        input.click();
    }
};

// ============================================================================
// CONFIGURAÇÕES DO SISTEMA
// ============================================================================
const Configuracoes = {
    exportacaoAutomatica: false,
    
    /**
     * Abre a interface de configurações
     */
    abrir: function() {
        Modal.mostrar(
            'Configurações do Sistema',
            `
            <div class="mb-3">
                <h6><i class="fas fa-cog me-2"></i>Configurações Gerais</h6>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="config-auto-save" ${this.exportacaoAutomatica ? 'checked' : ''}>
                    <label class="form-check-label" for="config-auto-save">
                        Exportação automática após salvar
                    </label>
                </div>
                <div class="form-check form-switch mt-2">
                    <input class="form-check-input" type="checkbox" id="config-notificacoes" checked>
                    <label class="form-check-label" for="config-notificacoes">
                        Notificações do sistema
                    </label>
                </div>
                <div class="form-check form-switch mt-2">
                    <input class="form-check-input" type="checkbox" id="config-animacoes" checked>
                    <label class="form-check-label" for="config-animacoes">
                        Animações da interface
                    </label>
                </div>
            </div>
            
            <div class="mb-3">
                <h6><i class="fas fa-palette me-2"></i>Aparência</h6>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="tema" id="tema-claro" checked>
                    <label class="form-check-label" for="tema-claro">
                        <i class="fas fa-sun me-1"></i> Tema Claro
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="tema" id="tema-escuro">
                    <label class="form-check-label" for="tema-escuro">
                        <i class="fas fa-moon me-1"></i> Tema Escuro
                    </label>
                </div>
            </div>
            
            <div class="mb-3">
                <h6><i class="fas fa-database me-2"></i>Dados</h6>
                <button class="btn btn-outline-primary btn-sm w-100 mb-2" onclick="Cadastro.fazerBackup()">
                    <i class="fas fa-download me-1"></i> Fazer Backup
                </button>
                <button class="btn btn-outline-warning btn-sm w-100 mb-2" onclick="Relatorios.restaurarBackup()">
                    <i class="fas fa-upload me-1"></i> Restaurar Backup
                </button>
                <button class="btn btn-outline-danger btn-sm w-100" onclick="Configuracoes.limparTodosDados()">
                    <i class="fas fa-trash me-1"></i> Limpar Todos os Dados
                </button>
            </div>
            
            <div class="mt-4">
                <h6><i class="fas fa-info-circle me-2"></i>Informações do Sistema</h6>
                <p class="small mb-1"><strong>Versão:</strong> ${CONFIG.SISTEMA.VERSAO}</p>
                <p class="small mb-1"><strong>Cadastros:</strong> <span id="config-total-cadastros">0</span></p>
                <p class="small"><strong>Última atualização:</strong> ${Utils.formatarData(new Date(), true)}</p>
            </div>
            `,
            'info',
            () => {
                this.salvarConfiguracoes();
                Notificacoes.mostrar('Configurações salvas!', 'success');
            }
        );
        
        // Atualiza contador
        const cadastros = Cadastro.obterCadastros();
        const elemento = document.getElementById('config-total-cadastros');
        if (elemento) elemento.textContent = cadastros.length;
    },
    
    /**
     * Salva configurações
     */
    salvarConfiguracoes: function() {
        const autoSave = document.getElementById('config-auto-save');
        if (autoSave) {
            this.exportacaoAutomatica = autoSave.checked;
            localStorage.setItem('castrapet_config_auto_export', autoSave.checked);
        }
        
        const notificacoes = document.getElementById('config-notificacoes');
        if (notificacoes) {
            localStorage.setItem('castrapet_config_notificacoes', notificacoes.checked);
        }
        
        const animacoes = document.getElementById('config-animacoes');
        if (animacoes) {
            localStorage.setItem('castrapet_config_animacoes', animacoes.checked);
            document.body.classList.toggle('no-animations', !animacoes.checked);
        }
        
        // Tema
        const temaEscuro = document.getElementById('tema-escuro');
        if (temaEscuro && temaEscuro.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('castrapet_tema', 'escuro');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('castrapet_tema', 'claro');
        }
    },
    
    /**
     * Carrega configurações salvas
     */
    carregarConfiguracoes: function() {
        // Exportação automática
        const autoExport = localStorage.getItem('castrapet_config_auto_export');
        this.exportacaoAutomatica = autoExport === 'true';
        
        // Notificações
        const notificacoes = localStorage.getItem('castrapet_config_notificacoes');
        if (notificacoes === 'false') {
            // Desativa notificações
            Notificacoes.mostrar = function() {};
        }
        
        // Animações
        const animacoes = localStorage.getItem('castrapet_config_animacoes');
        if (animacoes === 'false') {
            document.body.classList.add('no-animations');
        }
        
        // Tema
        const tema = localStorage.getItem('castrapet_tema');
        if (tema === 'escuro') {
            document.body.classList.add('dark-theme');
            const radio = document.getElementById('tema-escuro');
            if (radio) radio.checked = true;
        }
    },
    
    /**
     * Limpa todos os dados do sistema
     */
    limparTodosDados: function() {
        Modal.mostrar(
            'Limpar Todos os Dados',
            `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>ATENÇÃO!</strong> Esta ação é irreversível.
            </div>
            <p>Todos os cadastros, configurações e histórico serão <strong>permanentemente excluídos</strong>.</p>
            <p>Recomendamos fazer um backup antes de continuar.</p>
            <p>Digite <strong>CONFIRMAR</strong> abaixo para prosseguir:</p>
            <input type="text" class="form-control mt-2" id="confirmacao-exclusao" placeholder="Digite CONFIRMAR">
            `,
            'error',
            () => {
                const confirmacao = document.getElementById('confirmacao-exclusao')?.value;
                if (confirmacao?.toUpperCase() === 'CONFIRMAR') {
                    this.executarLimpezaTotal();
                } else {
                    Notificacoes.mostrar('Confirmação incorreta. Operação cancelada.', 'error');
                }
            }
        );
    },
    
    /**
     * Executa limpeza total dos dados
     */
    executarLimpezaTotal: function() {
        try {
            // Remove todos os dados do localStorage
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('castrapet_')) {
                    localStorage.removeItem(key);
                }
            });
            
            // Limpa formulário
            Formulario.limpar();
            
            // Atualiza contadores
            Cadastro.atualizarContador();
            
            Notificacoes.mostrar('Todos os dados foram excluídos com sucesso!', 'success');
            
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
            Notificacoes.mostrar('Erro ao limpar dados.', 'error');
        }
    }
};

// ============================================================================
// MÓDULO DE AJUDA
// ============================================================================
const Ajuda = {
    /**
     * Abre a interface de ajuda
     */
    abrir: function() {
        Modal.mostrar(
            'Ajuda - Sistema Castra Pet',
            `
            <h6><i class="fas fa-question-circle me-2"></i>Como usar o sistema</h6>
            <div class="accordion" id="accordionAjuda">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#ajuda1">
                            <i class="fas fa-paw me-2"></i>Cadastrar um novo animal
                        </button>
                    </h2>
                    <div id="ajuda1" class="accordion-collapse collapse show" data-bs-parent="#accordionAjuda">
                        <div class="accordion-body">
                            <ol>
                                <li>Preencha todas as informações do animal (passo 1)</li>
                                <li>Informe os dados do tutor (passo 2)</li>
                                <li>Complete o endereço (use o botão "Buscar" para CEP)</li>
                                <li>Revise e salve o cadastro (passo 4)</li>
                            </ol>
                        </div>
                    </div>
                </div>
                
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ajuda2">
                            <i class="fas fa-search me-2"></i>Buscar cadastros
                        </button>
                    </h2>
                    <div id="ajuda2" class="accordion-collapse collapse" data-bs-parent="#accordionAjuda">
                        <div class="accordion-body">
                            <p>Use a opção "Buscar" no menu lateral para:</p>
                            <ul>
                                <li>Localizar cadastros por nome do animal ou tutor</li>
                                <li>Buscar por número de microchip</li>
                                <li>Filtrar por espécie, sexo ou castração</li>
                                <li>Visualizar, editar ou excluir cadastros</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ajuda3">
                            <i class="fas fa-file-export me-2"></i>Exportar dados
                        </button>
                    </h2>
                    <div id="ajuda3" class="accordion-collapse collapse" data-bs-parent="#accordionAjuda">
                        <div class="accordion-body">
                            <p>O sistema permite exportar dados em vários formatos:</p>
                            <ul>
                                <li><strong>CSV:</strong> Para abrir no Excel</li>
                                <li><strong>JSON:</strong> Para backup ou integração</li>
                                <li><strong>PDF:</strong> Para impressão ou arquivo</li>
                                <li><strong>TXT:</strong> Relatório em texto simples</li>
                            </ul>
                            <p class="mb-0">Use a opção "Exportar" no menu lateral.</p>
                        </div>
                    </div>
                </div>
                
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ajuda4">
                            <i class="fas fa-database me-2"></i>Backup e segurança
                        </button>
                    </h2>
                    <div id="ajuda4" class="accordion-collapse collapse" data-bs-parent="#accordionAjuda">
                        <div class="accordion-body">
                            <p><strong>Importante:</strong> Os dados são salvos apenas no seu navegador.</p>
                            <p>Recomendamos fazer backup regularmente:</p>
                            <ol>
                                <li>Vá em "Configurações"</li>
                                <li>Clique em "Fazer Backup"</li>
                                <li>Guarde o arquivo em local seguro</li>
                            </ol>
                            <p class="mb-0 text-danger"><i class="fas fa-exclamation-triangle me-1"></i> 
                                Limpar o cache do navegador pode apagar todos os dados!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-4">
                <h6><i class="fas fa-headset me-2"></i>Suporte</h6>
                <p class="mb-1"><i class="fas fa-phone me-2"></i> (00) 0000-0000</p>
                <p class="mb-1"><i class="fas fa-envelope me-2"></i> contato@castrapet.com.br</p>
                <p class="mb-0"><i class="fas fa-globe me-2"></i> www.castrapet.com.br</p>
            </div>
            `,
            'info'
        );
    }
};

// ============================================================================
// FUNÇÕES GLOBAIS
// ============================================================================

/**
 * Navega para uma seção específica
 * @param {string} secao - ID da seção
 */
function navegarPara(secao) {
    // Esconde todas as seções
    document.querySelectorAll('.content-section').forEach(el => {
        el.classList.remove('active');
    });
    
    // Remove classe active de todos os botões do menu
    document.querySelectorAll('.sidebar .nav-link').forEach(el => {
        el.classList.remove('active');
    });
    
    // Mostra a seção solicitada
    const secaoElemento = document.getElementById(`${secao}-section`);
    if (secaoElemento) {
        secaoElemento.classList.add('active');
    }
    
    // Ativa o botão correspondente no menu
    const botaoMenu = document.querySelector(`[onclick*="navegarPara('${secao}')"]`);
    if (botaoMenu) {
        botaoMenu.classList.add('active');
    }
    
    // Executa ações específicas da seção
    switch (secao) {
        case 'buscar':
            Historico.carregarInterface();
            break;
        case 'relatorios':
            Relatorios.carregarInterface();
            break;
        case 'exportar':
            Exportacao.mostrarOpcoesExportacao();
            break;
    }
    
    // Rola para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Gerador de microchip aleatório
 */
const Gerador = {
    gerarMicrochip: function() {
        const microchip = '9' + Math.random().toString().slice(2, 16);
        const elemento = document.getElementById('microchip');
        if (elemento) {
            elemento.value = microchip;
            elemento.dispatchEvent(new Event('input'));
            Notificacoes.mostrar('Microchip gerado automaticamente!', 'success');
        }
    }
};

// ============================================================================
// INICIALIZAÇÃO DO SISTEMA
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema Castra Pet - UI e Dados inicializando...');
    
    // Carrega configurações
    Configuracoes.carregarConfiguracoes();
    
    // Inicializa contador
    Cadastro.atualizarContador();
    
    // Configura eventos do menu
    document.querySelectorAll('.sidebar .nav-link').forEach(botao => {
        const onclick = botao.getAttribute('onclick');
        if (onclick && onclick.includes('navegarPara')) {
            const match = onclick.match(/navegarPara\('([^']+)'\)/);
            if (match) {
                botao.onclick = () => navegarPara(match[1]);
            }
        }
    });
    
    // Configura botões de ajuda e configurações
    const btnConfig = document.querySelector('[onclick*="Configuracoes.abrir"]');
    if (btnConfig) {
        btnConfig.onclick = () => Configuracoes.abrir();
    }
    
    const btnAjuda = document.querySelector('[onclick*="Ajuda.abrir"]');
    if (btnAjuda) {
        btnAjuda.onclick = () => Ajuda.abrir();
    }
    
    // Configura botão de histórico
    const btnHistorico = document.querySelector('[onclick*="Historico.abrir"]');
    if (btnHistorico) {
        btnHistorico.onclick = () => Historico.abrir();
    }
    
    // Configura botão de limpar cache
    const btnLimparCache = document.querySelector('[onclick*="Utils.limparCache"]');
    if (btnLimparCache) {
        btnLimparCache.onclick = () => Utils.limparCache();
    }
    
    console.log('Sistema Castra Pet - UI e Dados inicializado!');
});

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.Notificacoes = Notificacoes;
    window.Exportacao = Exportacao;
    window.Historico = Historico;
    window.Relatorios = Relatorios;
    window.Configuracoes = Configuracoes;
    window.Ajuda = Ajuda;
    window.Gerador = Gerador;
    window.navegarPara = navegarPara;
}
