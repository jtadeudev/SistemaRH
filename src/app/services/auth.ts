import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { fromEvent, map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';

const CHAVE_TOKEN = 'sistemarh_token';
export const LOGIN_URL = `${environment.apiUrl}/auth/login`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenEmMemoria = signal<string | null>(this.recuperarToken());

  readonly token = this.tokenEmMemoria.asReadonly();
  readonly estaLogado = computed(() => !!this.token());

  constructor() {
    fromEvent<StorageEvent>(window, 'storage')
      .pipe(takeUntilDestroyed())
      .subscribe((evento) => {
        if (evento.key !== CHAVE_TOKEN || evento.storageArea !== localStorage) return;

        const estavaLogado = this.estaLogado();
        this.acessarArmazenamento(() => sessionStorage.removeItem(CHAVE_TOKEN));
        this.tokenEmMemoria.set(localStorage.getItem(CHAVE_TOKEN));
        if (estavaLogado && !this.estaLogado()) void this.router.navigate(['/login']);
      });
  }

  login(dados: LoginRequest): Observable<string> {
    return this.http.post(LOGIN_URL, dados, { responseType: 'text' }).pipe(
      map((resposta) => this.extrairToken(resposta)),
      tap((token) => {
        this.acessarArmazenamento(() => sessionStorage.setItem(CHAVE_TOKEN, token));
        this.acessarArmazenamento(() => localStorage.setItem(CHAVE_TOKEN, token));
        this.acessarArmazenamento(() => this.gravarCookie(token, 60 * 60));
        this.tokenEmMemoria.set(token);
      }),
    );
  }

  logout(): void {
    this.tokenEmMemoria.set(null);
    this.acessarArmazenamento(() => sessionStorage.removeItem(CHAVE_TOKEN));
    this.acessarArmazenamento(() => localStorage.removeItem(CHAVE_TOKEN));
    this.acessarArmazenamento(() => this.gravarCookie('', 0));
    void this.router.navigate(['/login']);
  }

  private extrairToken(corpo: string): string {
    let resposta: LoginResponse | string | null = corpo;
    try {
      resposta = JSON.parse(corpo);
    } catch {
      // A API também pode devolver o token como texto puro.
    }

    const valor =
      typeof resposta === 'string'
        ? resposta
        : (resposta?.token ?? resposta?.accessToken ?? resposta?.access_token);
    const token = typeof valor === 'string' ? valor.trim().replace(/^Bearer\s+/i, '') : '';
    if (!/^[A-Za-z0-9._~+/-]+=*$/.test(token)) {
      throw new Error('A API não retornou um token válido.');
    }
    return token;
  }

  private recuperarToken(): string | null {
    return (
      this.acessarArmazenamento(() => sessionStorage.getItem(CHAVE_TOKEN)) ??
      this.acessarArmazenamento(() => localStorage.getItem(CHAVE_TOKEN)) ??
      this.acessarArmazenamento(() => this.lerCookie())
    );
  }

  private gravarCookie(token: string, duracao: number): void {
    const seguro = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${CHAVE_TOKEN}=${encodeURIComponent(token)}; Path=/; Max-Age=${duracao}; SameSite=Strict${seguro}`;
  }

  private lerCookie(): string | null {
    const prefixo = `${CHAVE_TOKEN}=`;
    const cookie = document.cookie.split('; ').find((item) => item.startsWith(prefixo));
    return cookie ? decodeURIComponent(cookie.slice(prefixo.length)) : null;
  }

  private acessarArmazenamento<T>(acao: () => T): T | null {
    try {
      return acao();
    } catch {
      // O navegador pode bloquear um tipo de armazenamento.
      return null;
    }
  }
}
