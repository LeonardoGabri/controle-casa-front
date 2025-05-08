export const MensagemNotificacao = (msg?: string) => ({
  salvarRegistro: {
    severity: 'success',
    summary: 'Salvo com sucesso'
  },
  erroSalvarRegistro: {
    severity: 'error',
    detail: `Erro ao salvar registro - ${msg}`
  },
  formularioInvalido: {
    severity: 'error',
    detail: `Campos inválidos`
  },
  erroAoBuscarRegistro: {
    severity: 'error',
    detail: `Erro ao buscar registro - ${msg}`
  },
  msgWarning: {
    severity: 'warning',
    detail: msg
  },
  erroAoListar: {
    severity: 'error',
    detail: `Erro ao listar registros - ${msg}`
  },
  erroAoDeletar: {
    severity: 'error',
    detail: `Erro ao deletar registro - ${msg}`
  },
  deletarRegistro: {
    severity: 'success',
    summary: 'Deletado com sucesso'
  },
  erroSomaPorcentagem: {
    severity: 'warning',
    detail: 'A soma das porcentagens nao atingiu 100%'
  },
  sessaoExpirada: {
    severity: 'error',
    detail: `Sessão Expirada`
  }

});
