// cypress/support/commands.js/
// Comandos globais e configurações para todos os testes

// Comando customizado: validar estrutura de um post
Cypress.Commands.add('validatePostStructure', (post) => {
  expect(post).to.have.property('id')
  expect(post).to.have.property('userId')
  expect(post).to.have.property('title')
  expect(post).to.have.property('body')
  expect(post.id).to.be.a('number')
  expect(post.userId).to.be.a('number')
  expect(post.title).to.be.a('string')
  expect(post.body).to.be.a('string')
})

// Comando customizado: validar estrutura de um usuário
Cypress.Commands.add('validateUserStructure', (user) => {
  expect(user).to.have.property('id')
  expect(user).to.have.property('name')
  expect(user).to.have.property('email')
  expect(user).to.have.property('username')
  expect(user.email).to.include('@')
})

// Comando customizado: validar estrutura de um comentário
Cypress.Commands.add('validateCommentStructure', (comment) => {
  expect(comment).to.have.property('id')
  expect(comment).to.have.property('postId')
  expect(comment).to.have.property('name')
  expect(comment).to.have.property('email')
  expect(comment).to.have.property('body')
  expect(comment.email).to.include('@')
})
