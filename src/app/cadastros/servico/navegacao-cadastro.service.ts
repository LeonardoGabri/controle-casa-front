import { navegacaoCadastros } from "../../shared/servico/navegacao.service"

const navegacaoConta = {
  label: 'Conta',
  link: `${navegacaoCadastros.link}/conta`
}

const navegacaoContaNovoCadastro = {
  label: 'Nova Conta',
  link: `${navegacaoConta.link}/formulario`
}

const navegacaoContaEditarCadastro = (id: string) => {
  return{
    label: 'Editar conta',
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
    label: 'Editar responsável',
    link: `${navegacaoResponsavelNovoCadastro.link}/${id}`
  }
}

const navegacaoFornecedor = {
  label: 'Fornecedor',
  link: `${navegacaoCadastros.link}/fornecedor`
}

const navegacaoFornecedorNovoCadastro = {
  label: 'Novo fornecedor',
  link: `${navegacaoFornecedor.link}/formulario`
}

const navegacaoFornecedorEditarCadastro = (id: string) => {
  return{
    label: 'Editar fornecedor',
    link: `${navegacaoFornecedorNovoCadastro.link}/${id}`
  }
}

const navegacaoGrupo = {
  label: 'Grupo',
  link: `${navegacaoCadastros.link}/grupo`
}

const navegacaoGrupoNovoCadastro = {
  label: 'Novo grupo',
  link: `${navegacaoGrupo.link}/formulario`
}

const navegacaoGrupoEditarCadastro = (id: string) => {
  return{
    label: 'Editar grupo',
    link: `${navegacaoGrupoNovoCadastro.link}/${id}`
  }
}

export {
  navegacaoConta,
  navegacaoContaNovoCadastro,
  navegacaoContaEditarCadastro,
  navegacaoResponsavel,
  navegacaoResponsavelNovoCadastro,
  navegacaoResponsavelEditarCadastro,
  navegacaoFornecedor,
  navegacaoFornecedorNovoCadastro,
  navegacaoFornecedorEditarCadastro,
  navegacaoGrupo,
  navegacaoGrupoNovoCadastro,
  navegacaoGrupoEditarCadastro
}
