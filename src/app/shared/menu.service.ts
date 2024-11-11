import { MegaMenuItem } from "primeng/api";

export const menus: MegaMenuItem[] =  [
  {
      label: 'Cadastros',
      items: [
          [
              {
                  items: [
                      { label: 'Conta', icon: 'pi pi-list', subtext: 'Subtext of item', routerLink: "/cadastro" },
                      { label: 'Responsável', icon: 'pi pi-users', subtext: 'Subtext of item' },
                      { label: 'Fornecedor', icon: 'pi pi-file', subtext: 'Subtext of item' },
                      { label: 'Grupo', icon: 'pi pi-file', subtext: 'Subtext of item' }
                  ]
              }
          ],
      ]
  },
  {
    label: 'Despesas',
    items: [
        [
            {
                items: [
                    { label: 'Compra', icon: 'pi pi-list', subtext: 'Subtext of item' },
                    { label: 'Fatura', icon: 'pi pi-users', subtext: 'Subtext of item' }
                ]
            }
        ],
    ]
},
{
  label: 'Proventos'
},
] as MegaMenuItem[];
