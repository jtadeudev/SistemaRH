# SistemaRH

Exercício de Programação Frontend III. Sistema de Recursos Humanos com Angular e Tailwind CSS.

## Como executar

É necessário ter o Node.js 24 LTS atualizado e o npm instalados.

```bash
git clone https://github.com/jtadeudev/SistemaRH.git
cd SistemaRH
npm ci
npm start
```

Abra http://localhost:4200 no navegador. O servidor de desenvolvimento encaminha as chamadas para a API do Senac usando o `proxy.conf.json`.

Para gerar a versão de produção:

```bash
npm run build
```

## Telas e rotas

| Rota                 | Tela                  | Acesso    |
| -------------------- | --------------------- | --------- |
| `/login`             | Login                 | Público   |
| `/cadastro`          | Cadastro              | Público   |
| `/funcionarios`      | Lista de funcionários | Com login |
| `/funcionarios/novo` | Novo funcionário      | Com login |
| `/enderecos`         | Endereços             | Com login |
| `/contatos`          | Contatos              | Com login |

As rotas `/lista-funcionarios` e `/formulario-funcionarios` do roteiro também levam às respectivas telas.

## Como testar o login

1. Abra `/enderecos` antes de entrar. O sistema redireciona para `/login`.
2. Entre com um usuário de teste já cadastrado na API. Na aba **Network** do navegador, confira o `POST /auth/login`.
3. Na aba **Application**, confira a chave `sistemarh_token` em Session Storage, Local Storage e Cookies. Recarregue uma tela interna para verificar a recuperação da sessão.
4. Clique em **Sair** e confira que a chave foi removida dos três lugares e que o menu volta a mostrar Login e Cadastro.

## Organização

- `src/app/components/`: os seis componentes das telas.
- `src/app/services/`: serviço de autenticação e armazenamento do token.
- `src/app/models/`: tipos usados para enviar as credenciais e ler a resposta da API.
- `src/app/guards/`: proteção das rotas internas.
- `src/app/interceptors/`: inclusão do token Bearer nas chamadas autenticadas à API.
- `src/environments/`: configurações dos ambientes de desenvolvimento e produção.

## Etapa atual

O login envia e-mail e senha à API. O cadastro é uma tela demonstrativa. A integração da lista de funcionários depende da rota e do formato da resposta descritos na coleção Postman da aula.

Versões utilizadas: Angular 22.2.4, Angular CLI 22.2.5 e TailwindCSS 4.
