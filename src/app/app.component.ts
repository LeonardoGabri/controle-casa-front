import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MegaMenuModule, ButtonModule, AvatarModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    items: MegaMenuItem[] | undefined = [
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
    ]

    ngOnInit() {
    }
}
