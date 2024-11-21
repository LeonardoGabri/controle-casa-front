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
