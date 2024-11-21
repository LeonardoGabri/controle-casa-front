import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { navegacaoConta, navegacaoFornecedor, navegacaoGrupo, navegacaoResponsavel, navegacaoSubgrupo } from './cadastros/servico/navegacao-cadastro.service';
import { navegacaoDespesa, navegacaoParcela } from './despesas/servico/navegacao-despesa.service';

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
                          { label: 'Responsável', icon: 'pi pi-users', subtext: 'Subtext of item', routerLink: navegacaoResponsavel.link },
                          { label: 'Conta', icon: 'pi pi-shopping-cart', subtext: 'Subtext of item', routerLink: navegacaoConta.link },
                          { label: 'Grupo', icon: 'pi pi-sitemap', subtext: 'Subtext of item', routerLink: navegacaoGrupo.link },
                          { label: 'Subgrupo', icon: 'pi pi-stop', subtext: 'Subtext of item', routerLink: navegacaoSubgrupo.link },
                          { label: 'Fornecedor', icon: 'pi pi-shop', subtext: 'Subtext of item', routerLink: navegacaoFornecedor.link }
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
                        { label: 'Compra', icon: 'pi pi-shopping-cart', subtext: 'Subtext of item', routerLink: navegacaoDespesa.link },
                        { label: 'Fatura', icon: 'pi pi-barcode', subtext: 'Subtext of item', routerLink: navegacaoParcela.link }

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
