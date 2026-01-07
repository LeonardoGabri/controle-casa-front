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
                subtext: 'Subtext of item',
                routerLink: navegacaoResponsavel.link,
              },
              {
                label: 'Conta',
                icon: 'pi pi-shopping-cart',
                subtext: 'Subtext of item',
                routerLink: navegacaoConta.link,
              },
              {
                label: 'Grupo',
                icon: 'pi pi-sitemap',
                subtext: 'Subtext of item',
                routerLink: navegacaoGrupo.link,
              },
              {
                label: 'Subgrupo',
                icon: 'pi pi-stop',
                subtext: 'Subtext of item',
                routerLink: navegacaoSubgrupo.link,
              },
              {
                label: 'Fornecedor',
                icon: 'pi pi-shop',
                subtext: 'Subtext of item',
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
                subtext: 'Subtext of item',
                routerLink: navegacaoDespesa.link,
              },
              {
                label: 'Fatura',
                icon: 'pi pi-barcode',
                subtext: 'Subtext of item',
                routerLink: navegacaoParcela.link,
              },
              {
                label: 'Resumo Mensal',
                icon: 'pi pi-envelope',
                subtext: 'Subtext of item',
                routerLink: navegacaoResumoMensal.link,
              },
            ],
          },
        ],
      ],
    },
    {
      label: 'Proventos',
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
