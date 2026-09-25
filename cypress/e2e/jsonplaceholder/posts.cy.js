// cypress/e2e/posts.cy.js
// Testes de automação de API - Endpoint: /posts
// Autor: Idna Reis | Desafio DIO - Automação de Testes de API com Cypress

describe('📋 Posts API - Testes de Automação', () => {

  // =============================================
  // GET - LISTAR POSTS
  // =============================================

  describe('GET /posts', () => {

    it('Deve retornar status 200 ao listar todos os posts', () => {
      cy.request('GET', '/posts').then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('Deve retornar um array com 100 posts', () => {
      cy.request('GET', '/posts').then((response) => {
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length(100)
      })
    })

    it('Deve retornar posts com a estrutura correta (id, userId, title, body)', () => {
      cy.request('GET', '/posts').then((response) => {
        const post = response.body[0]
        cy.validatePostStructure(post)
      })
    })

    it('Deve retornar o Content-Type como application/json', () => {
      cy.request('GET', '/posts').then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })

  })

  // =============================================
  // GET - BUSCAR POST POR ID
  // =============================================

  describe('GET /posts/:id', () => {

    it('Deve retornar status 200 ao buscar post com ID válido', () => {
      cy.request('GET', '/posts/1').then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('Deve retornar o post correto ao buscar pelo ID 1', () => {
      cy.request('GET', '/posts/1').then((response) => {
        expect(response.body.id).to.eq(1)
        expect(response.body.userId).to.eq(1)
        cy.validatePostStructure(response.body)
      })
    })

    it('Deve retornar status 404 ao buscar post com ID inexistente', () => {
      cy.request({
        method: 'GET',
        url: '/posts/9999',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

  })

  // =============================================
  // GET - FILTRAR POSTS POR USUARIO
  // =============================================

  describe('GET /posts?userId=:id', () => {

    it('Deve filtrar posts pelo userId e retornar somente os posts do usuário', () => {
      cy.request('GET', '/posts?userId=1').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        response.body.forEach((post) => {
          expect(post.userId).to.eq(1)
        })
      })
    })

    it('Deve retornar 10 posts para o userId=1', () => {
      cy.request('GET', '/posts?userId=1').then((response) => {
        expect(response.body).to.have.length(10)
      })
    })

  })

  // =============================================
  // POST - CRIAR POST
  // =============================================

  describe('POST /posts', () => {

    it('Deve criar um novo post e retornar status 201', () => {
      const novoPost = {
        title: 'Automação de Testes com Cypress',
        body: 'Cypress é uma excelente ferramenta para testes de API e E2E.',
        userId: 1
      }

      cy.request('POST', '/posts', novoPost).then((response) => {
        expect(response.status).to.eq(201)
      })
    })

    it('Deve retornar o post criado com os dados enviados', () => {
      const novoPost = {
        title: 'Desafio DIO - QA com Cypress',
        body: 'Testes automatizados de API usando Cypress e JavaScript.',
        userId: 2
      }

      cy.request('POST', '/posts', novoPost).then((response) => {
        expect(response.body.title).to.eq(novoPost.title)
        expect(response.body.body).to.eq(novoPost.body)
        expect(response.body.userId).to.eq(novoPost.userId)
        expect(response.body.id).to.exist
      })
    })

    it('Deve retornar um ID gerado automaticamente ao criar post', () => {
      const novoPost = {
        title: 'Teste de ID automático',
        body: 'O ID deve ser gerado pelo servidor.',
        userId: 3
      }

      cy.request('POST', '/posts', novoPost).then((response) => {
        expect(response.body.id).to.be.a('number')
        expect(response.body.id).to.eq(101)
      })
    })

  })

  // =============================================
  // PUT - ATUALIZAR POST COMPLETO
  // =============================================

  describe('PUT /posts/:id', () => {

    it('Deve atualizar um post completo e retornar status 200', () => {
      const postAtualizado = {
        id: 1,
        title: 'Título atualizado com PUT',
        body: 'Corpo do post atualizado completamente.',
        userId: 1
      }

      cy.request('PUT', '/posts/1', postAtualizado).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('Deve retornar o post com os dados atualizados via PUT', () => {
      const postAtualizado = {
        id: 1,
        title: 'QA é estratégia, não apenas testes',
        body: 'Qualidade começa antes do desenvolvimento.',
        userId: 1
      }

      cy.request('PUT', '/posts/1', postAtualizado).then((response) => {
        expect(response.body.title).to.eq(postAtualizado.title)
        expect(response.body.body).to.eq(postAtualizado.body)
        expect(response.body.id).to.eq(1)
      })
    })

  })

  // =============================================
  // PATCH - ATUALIZAR POST PARCIALMENTE
  // =============================================

  describe('PATCH /posts/:id', () => {

    it('Deve atualizar apenas o título do post via PATCH e retornar status 200', () => {
      cy.request('PATCH', '/posts/1', { title: 'Título atualizado parcialmente' }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.title).to.eq('Título atualizado parcialmente')
      })
    })

  })

  // =============================================
  // DELETE - EXCLUIR POST
  // =============================================

  describe('DELETE /posts/:id', () => {

    it('Deve excluir um post e retornar status 200', () => {
      cy.request('DELETE', '/posts/1').then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('Deve retornar body vazio após excluir o post', () => {
      cy.request('DELETE', '/posts/1').then((response) => {
        expect(response.body).to.deep.eq({})
      })
    })

  })

})
