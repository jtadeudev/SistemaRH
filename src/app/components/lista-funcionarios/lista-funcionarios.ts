import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Funcionario } from '../../models/funcionario';
import { FuncionarioService } from '../../services/funcionario';

@Component({
  selector: 'app-lista-funcionarios',
  styleUrl: './lista-funcionarios.css',
  templateUrl: './lista-funcionarios.html',
})
export class ListaFuncionarios implements OnInit {
  private readonly funcionarioService = inject(FuncionarioService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly funcionarios = signal<Funcionario[]>([]);
  protected readonly carregando = signal(false);
  protected readonly erro = signal<string | null>(null);

  ngOnInit(): void {
    this.carregar();
  }

  protected carregar(): void {
    if (this.carregando()) return;

    this.carregando.set(true);
    this.erro.set(null);
    this.funcionarioService
      .listar()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.carregando.set(false)),
      )
      .subscribe({
        next: (funcionarios) => this.funcionarios.set(funcionarios),
        error: (erro: unknown) => {
          const sessaoRecusada = erro instanceof HttpErrorResponse && erro.status === 401;
          this.erro.set(
            sessaoRecusada
              ? 'A API recusou a sessão. Saia e entre novamente.'
              : 'Não foi possível carregar os funcionários.',
          );
        },
      });
  }
}
