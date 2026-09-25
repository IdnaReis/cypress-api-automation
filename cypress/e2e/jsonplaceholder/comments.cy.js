// cypress/e2e/comments.cy.js
// Testes de automação de API - Endpoint: /comments
// Autor: Idna Reis | Desafio DIO - Automação de Testes de API com Cypress

describe('💬 Comments API - Testes de Automação', () => {

  // =============================================
  // GET - LISTAR COMENTÁRIOS
  // =============================================

  describe('GET /comments', () => {

    it('Deve retornar status 200 ao listar todos os comentários', () => {
      cy.request('GET', '/comments').then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('Deve retornar um array com 500 comentários', () => {
      cy.request('GET', '/comments').then((response) => {
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length(500)
      })
    })

    it('Deve retornar comentários com a estrutura correta', () => {
      cy.request('GET', '/comments').then((response) => {
        const comment = response.body[0]
        cy.validateCommentStructure(comment)
      })
    })

    it('Todos os comentários devem ter email válido', () => {
      cy.request('GET', '/comments').then((response) => {
        response.body.forEach((comment) => {
          expect(comment.email).to.include('@')
        })
      })
    })

  })

  // =============================================
  // GET - BUSCAR COMENTÁRIO POR ID
  // =============================================

  describe('GET /comments/:id', () => {

    it('Deve retornar status 200 ao buscar comentário com ID válido', () => {
      cy.request('GET', '/comments/1').then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('Deve retornar o comentário correto ao buscar pelo ID 1', () => {
      cy.request('GET', '/comments/1').then((response) => {
        expect(response.body.id).to.eq(1)
        expect(response.body.postId).to.eq(1)
        cy.validateCommentStructure(response.body)
      })
    })

    it('Deve retornar status 404 para comentário com ID inexistente', () => {
      cy.request({
        method: 'GET',
        url: '/comments/9999',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404)
      })
    })

  })

  // =============================================
  // GET - FILTRAR COMENTÁRIOS POR POST
  // =============================================

  describe('GET /comments?postId=:id', () => {

    it('Deve retornar somente os comentários do post 1', () => {
      cy.request('GET', '/comments?postId=1').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        response.body.forEach((comment) => {
          expect(comment.postId).to.eq(1)
        })
      })
    })

    it('Deve retornar 5 comentários para o postId=1', () => {
      cy.request('GET', '/comments?postId=1').then((response) => {
        expect(response.body).to.have.length(5)
      })
    })

  })

  // =============================================
  // GET - COMENTÁRIOS VIA ROTA ANINHADA
  // =============================================

  describe('GET /posts/:id/comments', () => {

    it('Deve retornar os comentários do post 1 via rota aninhada', () => {
      cy.request('GET', '/posts/1/comments').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        expect(response.body.length).to.be.greaterThan(0)
        response.body.forEach((comment) => {
          expect(comment.postId).to.eq(1)
        })
      })
    })

    it('Resultado de /posts/1/comments deve ser igual a /comments?postId=1', () => {
      cy.request('GET', '/posts/1/comments').then((responseAninhada) => {
        cy.request('GET', '/comments?postId=1').then((responseFiltrada) => {
          expect(responseAninhada.body).to.deep.eq(responseFiltrada.body)
        })
      })
    })

  })

  // =============================================
  // POST - CRIAR COMENTÁRIO
  // =============================================

  describe('POST /comments', () => {

    it('Deve criar um novo comentário e retornar status 201', () => {
      const novoComentario = {
        postId: 1,
        name: 'Comentário de teste - Idna Reis',
        email: 'idna@email.com',
        body: 'Este é um comentário criado via automação de testes com Cypress.'
      }

      cy.request('POST', '/comments', novoComentario).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.name).to.eq(novoComentario.name)
        expect(response.body.email).to.eq(novoComentario.email)
        expect(response.body.postId).to.eq(novoComentario.postId)
        expect(response.body.id).to.exist
      })
    })

  })

  // =============================================
  // DELETE - EXCLUIR COMENTÁRIO
  // =============================================

  describe('DELETE /comments/:id', () => {

    it('Deve excluir um comentário e retornar status 200', () => {
      cy.request('DELETE', '/comments/1').then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('Deve retornar body vazio após excluir o comentário', () => {
      cy.request('DELETE', '/comments/1').then((response) => {
        expect(response.body).to.deep.eq({})
      })
    })

  })

})
