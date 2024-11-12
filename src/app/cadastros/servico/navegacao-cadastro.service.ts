import { navegacaoCadastros } from "../../shared/servico/navegacao.service"

const navegacaoConta = {
  label: 'Conta',
  link: `${navegacaoCadastros.link}/conta`
}

const navegacaoContaNovoCadastro = {
  label: 'Novo Responsável',
  link: `${navegacaoConta.link}/formulario`
}

const navegacaoContaEditarCadastro = (id: string) => {
  return{
    label: 'Novo Responsável',
    link: `${navegacaoContaNovoCadastro.link}/${id}`
  }
}

const navegacaoResponsavel = {
  label: 'Responsável',
  link: `${navegacaoCadastros.link}/responsavel`
}

const navegacaoResponsavelNovoCadastro = {
  label: 'Novo Responsável',
  link: `${navegacaoResponsavel.link}/formulario`
}

const navegacaoResponsavelEditarCadastro = (id: string) => {
  return{
    label: 'Novo Responsável',
    link: `${navegacaoResponsavelNovoCadastro.link}/${id}`
  }
}

const navegacaoFornecedor = {
  label: 'Fornecedor',
  link: `${navegacaoCadastros.link}/fornecedor`
}

const navegacaoGrupo = {
  label: 'Grupo',
  link: `${navegacaoCadastros.link}/grupo`
}

export {
  navegacaoConta,
  navegacaoContaNovoCadastro,
  navegacaoContaEditarCadastro,
  navegacaoResponsavel,
  navegacaoResponsavelNovoCadastro,
  navegacaoResponsavelEditarCadastro,
  navegacaoFornecedor,
  navegacaoGrupo
}
