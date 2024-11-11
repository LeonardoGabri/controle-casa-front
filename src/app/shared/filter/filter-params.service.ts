import { HttpParams } from "@angular/common/http";

const criarParametro = (
  param: any,
  page?: number,
  size: number = 20
): HttpParams => {
  let paramCriado = new HttpParams();

  page && (paramCriado = paramCriado.set('page', page))

  size && (paramCriado = paramCriado.set('size', size))

  for (const key in param){
    if(param.hasOwnProperty(key) &&
    (param[key] === 0 ||
      (!Array.isArray(param[key]) && param[key]) ||
      (Array.isArray(param[key]) && param[key].length > 0))
      ){
        paramCriado = paramCriado.set(key, param[key])
    }
  }
  return paramCriado;

}

export const filtroService = {
  criarParametro
}
