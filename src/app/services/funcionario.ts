import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Funcionario } from '../models/funcionario';

type RespostaUsuarios = unknown[] | { usuarios?: unknown; data?: unknown } | null;

function ehFuncionario(valor: unknown): valor is Funcionario {
  if (typeof valor !== 'object' || valor === null) return false;

  const { id, nome, email } = valor as Partial<Funcionario>;
  return (
    (typeof id === 'number' || typeof id === 'string') &&
    typeof nome === 'string' &&
    (email == null || typeof email === 'string')
  );
}

@Injectable({ providedIn: 'root' })
export class FuncionarioService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Funcionario[]> {
    return this.http.get<RespostaUsuarios>(`${environment.apiUrl}/usuarios`).pipe(
      map((resposta) => {
        const usuarios = Array.isArray(resposta)
          ? resposta
          : (resposta?.usuarios ?? resposta?.data);
        if (!Array.isArray(usuarios) || !usuarios.every(ehFuncionario)) {
          throw new Error('A API retornou uma lista de funcionários em formato inesperado.');
        }
        return usuarios;
      }),
    );
  }
}
