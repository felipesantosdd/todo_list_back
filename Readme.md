# API de Tarefas e Usuários

Esta API oferece endpoints para gerenciar tarefas (To-Do) e usuários, incluindo autenticação. Abaixo estão os detalhes de cada endpoint fornecido pelos serviços disponíveis:

## Tarefas (To-Do)

### 1. **Criação de Nova Tarefa**

-   **Endpoint:** `POST /todos`
-   **Descrição:** Cria uma nova tarefa associada a um usuário.
-   **Parâmetros de Requisição:**
    -   `newTodoData`: Objeto contendo as informações da nova tarefa.
        -   `title`: Título da tarefa.
        -   `text`: Descrição da tarefa.
        -   `color`: Cor da tarefa.
        -   `isFavorited`: Indica se a tarefa está favoritada.
        -   `isDone`: Indica se a tarefa está concluída.
-   **Exemplo de Requisição:**

    ```http
    POST /todos
    Authorization: Bearer <token_de_acesso>

    {
      "newTodoData": {
        "title": "Completar Projeto",
        "text": "Concluir a implementação do novo projeto",
        "color": "#FF5733",
        "isFavorited": false,
        "isDone": false
      }
    }
    ```

-   **Possíveis Respostas:**
    -   `201 Created`: Tarefa criada com sucesso.
    -   `409 Conflict`: Nome da tarefa já utilizado.

### 2. **Listagem de Todas as Tarefas**

-   **Endpoint:** `GET /todos`
-   **Descrição:** Retorna a lista de todas as tarefas existentes, incluindo informações sobre os usuários associados.
-   **Parâmetros de Requisição:**
    -   Nenhum.
-   **Exemplo de Requisição:**
    ```http
    GET /todos
    Authorization: Bearer <token_de_acesso>
    ```
-   **Possíveis Respostas:**
    -   `200 OK`: Lista de tarefas recuperada com sucesso.

### 3. **Detalhes de uma Tarefa Específica**

-   **Endpoint:** `GET /todos/:id`
-   **Descrição:** Retorna detalhes de uma tarefa específica, incluindo informações sobre o usuário associado.
-   **Parâmetros de Requisição:**
    -   `id`: Identificador único da tarefa.
-   **Exemplo de Requisição:**
    ```http
    GET /todos/1
    Authorization: Bearer <token_de_acesso>
    ```
-   **Possíveis Respostas:**
    -   `200 OK`: Detalhes da tarefa recuperados com sucesso.
    -   `401 Unauthorized`: Não autorizado a acessar a tarefa.
    -   `404 Not Found`: Tarefa não encontrada.

### 4. **Atualização de uma Tarefa Específica**

-   **Endpoint:** `PATCH /todos/:id`
-   **Descrição:** Atualiza parcialmente uma tarefa específica, alterando propriedades fornecidas.
-   **Parâmetros de Requisição:**
    -   `id`: Identificador único da tarefa.
    -   `todoUpdate`: Objeto contendo as propriedades a serem atualizadas na tarefa.
-   **Exemplo de Requisição:**

    ```http
    PATCH /todos/1
    Authorization: Bearer <token_de_acesso>

    {
      "todoUpdate": {
        "text": "Concluir a implementação e testar"
      }
    }
    ```

-   **Possíveis Respostas:**
    -   `200 OK`: Tarefa atualizada com sucesso.
    -   `401 Unauthorized`: Não autorizado a editar a tarefa.
    -   `404 Not Found`: Tarefa não encontrada.

### 5. **Remoção de uma Tarefa Específica**

-   **Endpoint:** `DELETE /todos/:id`
-   **Descrição:** Remove uma tarefa específica.
-   **Parâmetros de Requisição:**
    -   `id`: Identificador único da tarefa.
-   **Exemplo de Requisição:**
    ```http
    DELETE /todos/1
    Authorization: Bearer <token_de_acesso>
    ```
-   **Possíveis Respostas:**
    -   `204 No Content`: Tarefa removida com sucesso.
    -   `401 Unauthorized`: Não autorizado a remover a tarefa.
    -   `404 Not Found`: Tarefa não encontrada.

## Usuários

### 1. **Cadastro de Novo Usuário**

-   **Endpoint:** `POST /users`
-   **Descrição:** Cria um novo usuário.
-   **Parâmetros de Requisição:**
    -   `newUserData`: Objeto contendo informações do novo usuário.
        -   `nome`: Nome do usuário.
        -   `email`: Endereço de e-mail do usuário.
        -   `senha`: Senha do usuário.
-   **Exemplo de Requisição:**

    ```http
    POST /users

    {
      "newUserData": {
        "nome": "John Doe",
        "email": "john.doe@example.com",
        "senha": "senha123"
      }
    }
    ```

-   **Possíveis Respostas:**
    -   `200 OK`: Usuário criado com sucesso.
    -   `409 Conflict`: E-mail já está sendo usado.

### 2. **Listagem de Todos os Usuários**

-   **Endpoint:** `GET /users`
-   **Descrição:** Retorna a lista de todos os usuários cadastrados.
-   **Parâmetros de Requisição:** Nenhum.
-   **Exemplo de Requisição:**
    ```http
    GET /users
    ```
-   **Possíveis Respostas:**
    -   `200 OK`: Lista de usuários recuperada com sucesso.
    -   `404 Not Found`: Nenhum usuário cadastrado.

### 3. **Detalhes de um Usuário Específico**

-   **Endpoint:** `GET /users/:id`
-   **Descrição:** Retorna detalhes de um usuário específico, excluindo informações sensíveis.
-   **Parâmetros de Requisição:**
    -   `id`: Identificador único do usuário.
-   **Exemplo de Requisição:**
    ```http
    GET /users/1
    ```
-   **Possíveis Respostas:**
    -   `200 OK`: Detalhes do usuário recuperados com sucesso.
    -   `404 Not Found`: Usuário não encontrado.

### 4. **Autenticação de Usuário**

-   **Endpoint:** `POST /users/login`
-   **Descrição:** Autentica um usuário existente.
-   **Parâmetros de Requisição:**
    -   `data`: Objeto contendo informações de login.
        -   `email`: Endereço de e-mail do usuário.
        -   `senha`: Senha do usuário.
-   **Exemplo de Requisição:**

    ```http
    POST /users/login

    {
      "data": {
        "email": "john
    ```

.doe@example.com",
"senha": "senha123"
}
}

```
- **Possíveis Respostas:**
- `200 OK`: Login bem-sucedido. Retorna informações do usuário e um token de acesso.
- `401 Unauthorized`: Usuário e/ou senha inválidos.

### Notas Gerais

- Todos os identificadores (`id`) são do tipo UUID.
- O token de acesso deve ser incluído no cabeçalho de autorização (`Authorization: Bearer <token_de_acesso>`) para autenticação em endpoints protegidos.

Este README fornece uma visão geral dos serviços oferecidos pela API de Tarefas e Usuários. Consulte a documentação completa para obter detalhes adicionais sobre os parâmetros de requisição, respostas e exemplos de uso.
```
