import { navegacaoDespesas } from "../../shared/servico/navegacao/navegacao.service"

const navegacaoDespesa = {
  label: 'Despesa',
  link: `${navegacaoDespesas.link}/despesa`
}

const navegacaoDespesaNovoCadastro = {
  label: 'Nova Despesa',
  link: `${navegacaoDespesa.link}/formulario`
}

const navegacaoDespesaEditarCadastro = (id: string, idParcela?: string) => {
  return{
    label: 'Editar despesa',
    link: `${navegacaoDespesaNovoCadastro.link}/${id}/${idParcela}`
  }
}

const navegacaoParcela = {
  label: 'Parcelas',
  link: `${navegacaoDespesas.link}/fatura`
}

const navegacaoParcelaNovoCadastro = {
  label: 'Nova Parcela',
  link: `${navegacaoParcela.link}/formulario`
}

const navegacaoParcelaEditarCadastro = (id: string, editaDespesa?: boolean) => {
  return {
    label: 'Editar parcela',
    link: `${navegacaoParcelaNovoCadastro.link}/${id}${editaDespesa ? `/${editaDespesa}` : ''}`
  };
};

const navegacaoResumoMensal = {
  label: 'Resumo Mensal',
  link: `${navegacaoDespesas.link}/resumo-mensal`
}

export {
  navegacaoDespesa,
  navegacaoDespesaNovoCadastro,
  navegacaoDespesaEditarCadastro,
  navegacaoParcela,
  navegacaoParcelaNovoCadastro,
  navegacaoParcelaEditarCadastro,
  navegacaoResumoMensal
}
