// Validações avançadas da JSONPlaceholder:
// contrato (JSON Schema), cenários negativos e tempo de resposta
import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })
const EMAIL = '^[^@\\s]+@[^@\\s]+$'

const validadores = {
  post: ajv.compile({
    type: 'object',
    required: ['userId', 'id', 'title', 'body'],
    properties: {
      userId: { type: 'integer' },
      id: { type: 'integer' },
      title: { type: 'string', minLength: 1 },
      body: { type: 'string', minLength: 1 }
    },
    additionalProperties: false
  }),
  comment: ajv.compile({
    type: 'object',
    required: ['postId', 'id', 'name', 'email', 'body'],
    properties: {
      postId: { type: 'integer' },
      id: { type: 'integer' },
      name: { type: 'string' },
      email: { type: 'string', pattern: EMAIL },
      body: { type: 'string' }
    },
    additionalProperties: false
  }),
  user: ajv.compile({
    type: 'object',
    required: ['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      username: { type: 'string' },
      email: { type: 'string', pattern: EMAIL },
      address: { type: 'object', required: ['street', 'city', 'zipcode', 'geo'] },
      phone: { type: 'string' },
      website: { type: 'string' },
      company: { type: 'object', required: ['name'] }
    }
  })
}

function validarContrato(tipo, itens) {
  itens.forEach((item) => {
    const valido = validadores[tipo](item)
    expect(valido, JSON.stringify(validadores[tipo].errors)).to.be.true
  })
}

describe('JSONPlaceholder - Contrato (JSON Schema)', () => {
  it('Todos os posts respeitam o contrato', () => {
    cy.request('/posts').then((res) => validarContrato('post', res.body))
  })

  it('Todos os comentários respeitam o contrato', () => {
    cy.request('/comments').then((res) => validarContrato('comment', res.body))
  })

  it('Todos os usuários respeitam o contrato', () => {
    cy.request('/users').then((res) => validarContrato('user', res.body))
  })
})

describe('JSONPlaceholder - Cenários negativos', () => {
  it('Deve retornar 404 para post inexistente', () => {
    cy.request({ url: '/posts/9999', failOnStatusCode: false })
      .its('status').should('eq', 404)
  })

  it('Deve retornar 404 para comentário inexistente', () => {
    cy.request({ url: '/comments/9999', failOnStatusCode: false })
      .its('status').should('eq', 404)
  })

  it('Deve retornar 404 para rota inexistente', () => {
    cy.request({ url: '/rota-que-nao-existe', failOnStatusCode: false })
      .its('status').should('eq', 404)
  })

  it('Deve retornar lista vazia ao filtrar por usuário inexistente', () => {
    cy.request('/posts?userId=9999').then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.be.an('array').and.have.length(0)
    })
  })
})

describe('JSONPlaceholder - Desempenho e headers', () => {
  ;['/posts', '/comments', '/users'].forEach((rota) => {
    it(`${rota} deve responder em menos de 2 segundos com JSON`, () => {
      cy.request(rota).then((res) => {
        expect(res.duration).to.be.lessThan(2000)
        expect(res.headers['content-type']).to.include('application/json')
      })
    })
  })
})