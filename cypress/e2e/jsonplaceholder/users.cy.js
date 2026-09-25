// cypress/e2e/users.cy.js
// Testes de automação de API - Endpoint: /users
// Autor: Idna Reis | Desafio DIO - Automação de Testes de API com Cypress

describe('👤 Users API - Testes de Automação', () => {

  // =============================================
  // GET - LISTAR USUÁRIOS
  // =============================================

  describe('GET /users', () => {

    it('Deve retornar status 200 ao listar todos os usuários', () => {
      cy.request('GET', '/users').then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('Deve retornar um array com 10 usuários', () => {
      cy.request('GET', '/users').then((response) => {
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length(10)
      })
    })

    it('Deve retornar usuários com a estrutura correta (id, name, email, username)', () => {
      cy.request('GET', '/users').then((response) => {
        const user = response.body[0]
        cy.validateUserStructure(user)
      })
    })

    it('Deve retornar o Content-Type como application/json', () => {
      cy.request('GET', '/users').then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })

    it('Todos os usuários devem ter um email válido com @', () => {
      cy.request('GET', '/users').then((response) => {
        response.body.forEach((user) => {
          expect(user.email).to.include('@')
        })
      })
    })

  })

  // =============================================
  // GET - BUSCAR USUÁRIO POR ID
  // =============================================

  describe('GET /users/:id', () => {

    it('Deve retornar status 200 ao buscar usuário com ID válido', () => {
      cy.request('GET', '/users/1').then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('Deve retornar o usuário correto ao buscar pelo ID 1', () => {
      cy.request('GET', '/users/1').then((response) => {
        expect(response.body.id).to.eq(1)
        expect(response.body.name).to.eq('Leanne Graham')
        expect(response.body.username).to.eq('Bret')
        cy.validateUserStructure(response.body)
      })
    })

    it('Deve retornar status 404 para usuário com ID inexistente', () => {
      cy.request({
        method: 'GET',
        url: '/users/9999',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

  })

  // =============================================
  // GET - POSTS DE UM USUÁRIO
  // =============================================

  describe('GET /users/:id/posts', () => {

    it('Deve retornar os posts do usuário 1', () => {
      cy.request('GET', '/users/1/posts').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
        response.body.forEach((post) => {
          expect(post.userId).to.eq(1)
        })
      })
    })

  })

  // =============================================
  // GET - TODOS TODO DE UM USUÁRIO
  // =============================================

  describe('GET /users/:id/todos', () => {

    it('Deve retornar as tarefas (todos) do usuário 1', () => {
      cy.request('GET', '/users/1/todos').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
      })
    })

    it('Cada todo deve ter as propriedades: userId, id, title, completed', () => {
      cy.request('GET', '/users/1/todos').then((response) => {
        const todo = response.body[0]
        expect(todo).to.have.property('userId')
        expect(todo).to.have.property('id')
        expect(todo).to.have.property('title')
        expect(todo).to.have.property('completed')
        expect(todo.completed).to.be.a('boolean')
      })
    })

  })

  // =============================================
  // POST - CRIAR USUÁRIO
  // =============================================

  describe('POST /users', () => {

    it('Deve criar um novo usuário e retornar status 201', () => {
      const novoUsuario = {
        name: 'Idna Reis',
        username: 'idnareis',
        email: 'idna@email.com',
        phone: '61-99999-0000',
        website: 'github.com/IdnaReis'
      }

      cy.request('POST', '/users', novoUsuario).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.name).to.eq(novoUsuario.name)
        expect(response.body.email).to.eq(novoUsuario.email)
        expect(response.body.id).to.exist
      })
    })

  })

})
