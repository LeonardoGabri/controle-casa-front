export const MensagemNotificacao = (msg?: string) => ({
  salvarRegistro: {
    severity: 'success',
    summary: 'Salvo com sucesso'
  },
  erroSalvarRegistro: {
    severity: 'error',
    detail: `Erro ao salvar registro - ${msg}`
  },
  msgWarning: {
    severity: 'warning',
    detail: msg
  },
  erroAoListar: {
    severity: 'error',
    detail: `Erro ao listar registros - ${msg}`
  }
});
