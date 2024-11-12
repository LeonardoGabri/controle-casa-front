import { navegacaoDespesas } from "../../shared/servico/navegacao.service"

const navegacaoDespesa = {
  label: 'Despesa',
  link: `${navegacaoDespesas.link}/despesa`
}

const navegacaoDespesaNovoCadastro = {
  label: 'Nova Despesa',
  link: `${navegacaoDespesa.link}/formulario`
}

const navegacaoDespesaEditarCadastro = (id: string) => {
  return{
    label: 'Editar despesa',
    link: `${navegacaoDespesaNovoCadastro.link}/${id}`
  }
}

const navegacaoParcela = {
  label: 'Parcelas',
  link: `${navegacaoDespesas.link}/parcela`
}

const navegacaoParcelaNovoCadastro = {
  label: 'Nova Parcela',
  link: `${navegacaoParcela.link}/formulario`
}

const navegacaoParcelaEditarCadastro = (id: string) => {
  return{
    label: 'Editar parcela',
    link: `${navegacaoParcelaNovoCadastro.link}/${id}`
  }
}

export {
  navegacaoDespesa,
  navegacaoDespesaNovoCadastro,
  navegacaoDespesaEditarCadastro,
  navegacaoParcela,
  navegacaoParcelaNovoCadastro,
  navegacaoParcelaEditarCadastro
}
