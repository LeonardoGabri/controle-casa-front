import {navegacaoDespesas, navegacaoProventos} from "../../shared/servico/navegacao/navegacao.service"

const navegacaoPatrimonio = {
  label: 'Patrimônio',
  link: `${navegacaoProventos.link}/patrimonio`
}

const navegacaoPatrimonioNovoCadastro = {
  label: 'Novo Patrimônio',
  link: `${navegacaoPatrimonio.link}/formulario`
}

const navegacaoPatrimonioEditarCadastro = (id: string) => {
  return{
    label: 'Editar Patrimônio',
    link: `${navegacaoPatrimonioNovoCadastro.link}/${id}`
  }
}

const navegacaoTransacao = {
  label: 'Transação',
  link: `${navegacaoProventos.link}/transacao`
}

const navegacaoTransacaoNovoCadastro = {
  label: 'Nova Transação',
  link: `${navegacaoTransacao.link}/formulario`
}

const navegacaoTransacaoEditarCadastro = (id: string) => {
  return{
    label: 'Editar Transação',
    link: `${navegacaoTransacaoNovoCadastro.link}/${id}`
  }
}
export {
  navegacaoPatrimonio,
  navegacaoPatrimonioNovoCadastro,
  navegacaoPatrimonioEditarCadastro,
  navegacaoTransacao,
  navegacaoTransacaoNovoCadastro,
  navegacaoTransacaoEditarCadastro
}
