import { Component } from "@angular/core";

@Component({
  selector: 'app-conta-lista',
  templateUrl: './conta-lista-component.html',
  styleUrls: ['./conta-lista.component.scss']
})
export class ContaListaComponent{
  items = [
    {
      nome: 'Leo',
      descricao: 'Daora'
    },
    {
      nome: 'Gustavo',
      descricao: 'Daora'
    },
    {
      nome: 'Angela',
      descricao: 'Daora'
    },
    {
      nome: 'Orlando',
      descricao: 'Daora'
    }
  ];
  searchTerm = '';

  getActionMenu(item: any) {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editItem(item)
      },
      {
        label: 'Remover',
        icon: 'pi pi-trash',
        command: () => this.removeItem(item)
      }
    ];
  }

  editItem(item: any) {
    // Lógica para editar o item
    console.log('Editando', item);
  }

  removeItem(item: any) {
    // Lógica para remover o item
    console.log('Removendo', item);
  }
}
