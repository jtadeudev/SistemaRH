# SistemaRH

Exercício de Programação Frontend III: estrutura inicial de um sistema de Recursos Humanos com Angular e TailwindCSS.

## Como executar

É necessário ter o Node.js 24 LTS atualizado e o npm instalados.

```bash
git clone https://github.com/jtadeudev/SistemaRH.git
cd SistemaRH
npm ci
npm start
```

Abra http://localhost:4200 no navegador.

Para gerar a versão de produção:

```bash
npm run build
```

## Telas e rotas

| Rota                 | Tela                  |
| -------------------- | --------------------- |
| `/login`             | Login                 |
| `/cadastro`          | Cadastro              |
| `/funcionarios`      | Lista de funcionários |
| `/funcionarios/novo` | Novo funcionário      |
| `/enderecos`         | Endereços             |
| `/contatos`          | Contatos              |

O endereço inicial e os caminhos inexistentes redirecionam para `/login`. O menu fica visível em todas as telas e destaca a opção selecionada.

## Organização

- `src/app/components/`: os seis componentes das telas.
- `src/app/services/`: pasta reservada para os futuros serviços.
- `src/app/models/`: pasta reservada para os modelos de dados.
- `src/environments/`: configurações dos ambientes de desenvolvimento e produção.

## Etapa atual

O projeto usa componentes standalone, roteamento e detecção de mudanças zoneless, sem SSR ou SSG.

Login e Cadastro incluem as atividades extras do PDF, com campos, botões e links feitos com TailwindCSS. As outras quatro telas apresentam apenas seus títulos.

Os botões Entrar e Cadastrar são apenas visuais, com `type="button"`. Não há autenticação, conexão com API nem armazenamento de dados nesta etapa.

Versões utilizadas: Angular 22.2.4, Angular CLI 22.2.5 e TailwindCSS 4.
