# ReceitaApp

Aplicação web de gerenciamento de receitas desenvolvida como Projeto Prático Integrador da disciplina de **Linguagens e Paradigmas de Programação Visual**.

## Funcionalidades

- Cadastrar, editar e excluir receitas
- Busca em tempo real por nome
- Filtro por categoria (Café da manhã, Almoço, Jantar, Sobremesa, Lanches)
- Marcar receitas como favoritas
- Persistência local via `localStorage`
- Interface responsiva para mobile e desktop

## Tecnologias

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool
- [Tailwind CSS 4](https://tailwindcss.com/) — estilização
- [Lucide React](https://lucide.dev/) — ícones

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## Estrutura

```
src/
└── app/
    └── App.tsx   # Componente principal com toda a lógica e telas
```

## Telas

| Tela | Descrição |
|------|-----------|
| Lista | Grid de receitas com busca e filtro por categoria |
| Detalhe | Visualização completa com ingredientes e modo de preparo |
| Formulário | Modal para criar ou editar receitas |

## Protótipo

O layout foi baseado no wireframe do Figma:
[Recipe Manager Wireframe](https://www.figma.com/design/Vgz9gisAZI5Yrey02Hpisx/Recipe-Manager-Wireframe)
