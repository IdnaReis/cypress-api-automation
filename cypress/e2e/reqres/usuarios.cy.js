describe('API de Usuários - ReqRes', () => {

  it('Deve listar usuários com status 200', () => {
    cy.request('GET', 'https://reqres.in/api/users?page=2').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('data');
      expect(response.body.data).to.be.an('array');
    });
  });

  it('Deve retornar um usuário específico com dados corretos', () => {
    cy.request('GET', 'https://reqres.in/api/users/2').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data).to.have.property('email');
      expect(response.body.data.id).to.eq(2);
    });
  });

  it('Deve retornar 404 ao buscar usuário inexistente', () => {
    cy.request({
      method: 'GET',
      url: 'https://reqres.in/api/users/999',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it('Deve criar um novo usuário com sucesso (201)', () => {
    const novoUsuario = {
      name: "Idna Reis",
      job: "QA Engineer"
    };
    cy.request('POST', 'https://reqres.in/api/users', novoUsuario).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.name).to.eq(novoUsuario.name);
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('createdAt');
    });
  });

  it('Deve atualizar um usuário existente (200)', () => {
    const dadosAtualizados = {
      name: "Idna Reis",
      job: "QA Lead"
    };
    cy.request('PUT', 'https://reqres.in/api/users/2', dadosAtualizados).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.job).to.eq('QA Lead');
    });
  });

  it('Deve deletar um usuário (204)', () => {
    cy.request('DELETE', 'https://reqres.in/api/users/2').then((response) => {
      expect(response.status).to.eq(204);
    });
  });

  it('Deve validar o tempo de resposta abaixo de 1 segundo', () => {
    cy.request('GET', 'https://reqres.in/api/users?page=1').then((response) => {
      expect(response.duration).to.be.lessThan(1000);
    });
  });

});