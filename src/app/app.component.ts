import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MegaMenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { ToastModule } from 'primeng/toast';
import { filter } from 'rxjs';

import { AuthService } from './auth/service/auth.service';
import {
  navegacaoConta,
  navegacaoFornecedor,
  navegacaoGrupo,
  navegacaoResponsavel,
  navegacaoSubgrupo,
} from './cadastros/servico/navegacao-cadastro.service';
import {
  navegacaoDespesa,
  navegacaoParcela, navegacaoResumoMensal,
} from './despesas/servico/navegacao-despesa.service';
import { NotificationService } from './shared/mensagem/notification.service';
import {navegacaoPatrimonio, navegacaoTransacao} from "./proventos/servico/navegacao-proventos.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MegaMenuModule,
    ButtonModule,
    AvatarModule,
    HttpClientModule,
    ToastModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showMenu = true;

  items: MegaMenuItem[] | undefined = [
    {
      label: 'Cadastros',
      items: [
        [
          {
            items: [
              {
                label: 'Responsável',
                icon: 'pi pi-users',
                routerLink: navegacaoResponsavel.link,
              },
              {
                label: 'Conta',
                icon: 'pi pi-shopping-cart',
                routerLink: navegacaoConta.link,
              },
              {
                label: 'Grupo',
                icon: 'pi pi-sitemap',
                routerLink: navegacaoGrupo.link,
              },
              {
                label: 'Subgrupo',
                icon: 'pi pi-stop',
                routerLink: navegacaoSubgrupo.link,
              },
              {
                label: 'Fornecedor',
                icon: 'pi pi-shop',
                routerLink: navegacaoFornecedor.link,
              }
            ],
          },
        ],
      ],
    },
    {
      label: 'Despesas',
      items: [
        [
          {
            items: [
              {
                label: 'Compra',
                icon: 'pi pi-shopping-cart',
                routerLink: navegacaoDespesa.link,
              },
              {
                label: 'Fatura',
                icon: 'pi pi-barcode',
                routerLink: navegacaoParcela.link,
              },
              {
                label: 'Resumo Mensal',
                icon: 'pi pi-envelope',
                routerLink: navegacaoResumoMensal.link,
              },
            ],
          },
        ],
      ],
    },
    {
      label: 'Proventos',
      items: [
        [
          {
            items: [
              {
                label: 'Patrimônio',
                icon: 'pi pi-money-bill',
                routerLink: navegacaoPatrimonio.link,
              },
            ],
          },
        ],
      ],
    },
  ];

  constructor(
    private router: Router,
    private auth: AuthService,
    private notificationService: NotificationService
  ) {
    this.notificationService.error('Sessão Expirada');
  }

  ngOnInit() {
    this.notificationService.error('Sessão Expirada');
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const isLogin = this.router.url.includes('/login');
        const isAuth = this.auth.isAuthenticated();

        this.showMenu = !isLogin && isAuth;

        if (!isLogin && !isAuth) {
          this.auth.logout();
          this.notificationService.error('Sessão Expirada');
          this.router.navigate(['/login']);
        }
      });
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
    this.notificationService.info('Logout', 'Sessão encerrada com sucesso');
  }
}
