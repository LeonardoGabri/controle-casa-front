import { FormGroup } from "@angular/forms";

export function validaCamposInvalidosFormulario(formulario: FormGroup){
  const camposComErro: string[] = [];

  Object.keys(formulario.controls).forEach(campo => {
    const controle = formulario.get(campo);
    if (controle?.status == 'INVALID') {
      camposComErro.push(campo);
    }
  });

  return camposComErro;
}

export function getMesAnoAtual(): string {
  const hoje = new Date();

  const mes = String(hoje.getMonth() + 2).padStart(2, '0')
  const ano = hoje.getFullYear();
  return `${mes}/${ano}`;
}
