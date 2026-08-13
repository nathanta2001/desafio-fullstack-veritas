# Mini Kanban de Tarefas - React + Go

Aplicação Fullstack para gerenciamento de tarefas no estilo **Kanban**, desenvolvida com **backend RESTful em Go** e **frontend em React com Ant Design**.

> 🔗 **Aplicação em Produção**: https://desafio-fullstack-veritas.vercel.app  
> 🔗 **API Backend (Fly.io)**: https://backend-wandering-hillside-106.fly.dev/tasks

---

## Como Rodar o Projeto

### Pré-requisitos

Antes de executar, certifique-se de ter instalado:

* **Go** 1.22 ou superior
* **Node.js** 18 ou superior
* **npm**

---

## 1. Backend - Go

Entre na pasta do backend:

```bash
cd backend
```

Execute o servidor:

```bash
go run cmd/server/main.go
```

O servidor estará disponível em:

**http://localhost:8080**

### Testes do Backend

Para executar os testes:

```bash
go test ./...
```

---

## 2. Frontend - React

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível em:

**http://localhost:5173**

### Testes do Frontend

Para executar os testes:

```bash
npm test -- --run
```

---

## Arquitetura

### Backend - Go

* Estrutura baseada em `cmd/` e `internal/`
* `cmd/server/`: ponto de entrada da aplicação
* `internal/task/`: regras de negócio relacionadas às tarefas

#### Concorrência e Persistência

* Armazenamento das tarefas em memória
* Uso de `sync.RWMutex` para garantir acesso concorrente seguro
* Persistência dos dados em arquivo JSON
* Escrita atômica do arquivo `tasks.json`

#### Segurança

* Graceful Shutdown do servidor HTTP
* Timeouts para operações HTTP
* Limite de payload de **1 MB** utilizando `http.MaxBytesReader`
* Escrita atômica dos dados persistidos

#### Validações

O backend possui validações para garantir a consistência das tarefas:

* Título obrigatório
* Limite de **80 caracteres** para o título
* Status limitado aos valores permitidos
* Validação da consistência temporal entre `data_inicio` e `data_fim`

---

### Frontend - React

#### Gerenciamento de Dados

**TanStack Query (React Query)** é utilizado para:

* Gerenciamento do cache HTTP
* Sincronização dos dados com a API
* Atualização automática dos estados
* Controle das requisições assíncronas

#### Interface

O projeto utiliza **Ant Design v5**, com:

* Interface responsiva
* Customização dinâmica dos tokens utilizando `theme.useToken()`

#### Drag and Drop

A movimentação das tarefas entre as colunas é realizada utilizando:

**@hello-pangea/dnd**

As tarefas podem ser movimentadas entre:

* 📋 **A Fazer**
* 🔄 **Em Progresso**
* ✅ **Concluídas**

#### Notificações

O sistema utiliza **Web Notifications** para monitorar os prazos das tarefas e disparar notificações nativas do navegador quando necessário.

---

## Estrutura do Projeto

```text

desafio veritas/
├── backend/                  # API RESTful em Go
│   ├── cmd/
│   │   └── server/
│   │       └── main.go       # Ponto de entrada (Server HTTP com Graceful Shutdown)
│   ├── internal/
│   │   └── task/             # Regras de negócio de Tarefas
│   │       ├── handlers.go   # Handlers HTTP, rotas REST e escrita atômica em JSON
│   │       ├── model.go      # Modelos de dados, validações e tipos Go
│   │       └── handlers_test.go # Testes unitários com arquivos isolados
│   ├── go.mod                # Gerenciamento de módulos Go
│   └── tasks.json            # Persistência de dados em arquivo JSON
│
├── frontend/                 # Interface Web em React (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosClient.js # Configuração do cliente Axios com env vars
│   │   ├── components/
│   │   │   ├── Kanban/       # KanbanBoard, KanbanColumn, TaskCard
│   │   │   └── Modals/       # Modais de Criação/Edição e Visualização Detalhada
│   │   ├── hooks/
│   │   │   ├── useTasksQuery.js # Custom Hook (TanStack Query) para CRUD
│   │   │   └── useTaskNotifier.js # Monitor de prazos e notificações Web Push
│   │   ├── services/
│   │   │   └── taskService.js # Comunicação direta com os endpoints Go
│   │   ├── theme/
│   │   │   └── themeConfig.js # Design System e tokens Dark Mode (Ant Design v5)
│   │   ├── App.jsx           # Componente raiz da aplicação
│   │   ├── main.jsx          # Providers globais (QueryClient e AntD Config)
│   │   └── setupTests.js     # Setup de Mocks para ambiente Vitest/JSDom
│   ├── package.json
│   └── vite.config.js
│
└── docs/                     # Documentação e Diagramas
    └── user-flow.png         # Diagrama visual do Fluxo do Usuário (User Flow)
```

---

## 🔄 Fluxo da Aplicação

O usuário pode:

1. Criar uma nova tarefa
2. Definir título, descrição, status e datas
3. Visualizar as tarefas organizadas por status
4. Arrastar tarefas entre as colunas
5. Editar tarefas existentes
6. Excluir tarefas
7. Acompanhar os prazos por meio das notificações do navegador

---

## Tecnologias

### Backend

* Go
* HTTP REST API
* JSON
* `sync.RWMutex`

### Frontend

* React
* TypeScript
* Ant Design v5
* TanStack Query
* @hello-pangea/dnd
* Web Notifications

