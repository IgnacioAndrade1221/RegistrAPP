describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('/login');

    // Completar el formulario
    cy.get('[name="username"]').eq(0).type('nacho');  // Seleccionar el primer campo
    cy.get('[name="password"]').eq(0).type('admin');
    cy.get('button[type="submit"]').click({ force: true });

    // Verificar redirección a /home
    cy.location('pathname', { timeout: 10000 }).should('include', '/home');
  });

  it('should show error on invalid login', () => {
    cy.visit('/login');

    // Asegurarse de seleccionar el primer campo de username
    cy.get('[name="username"]').eq(0).type('wronguser');
    cy.get('[name="password"]').eq(0).type('wrongpassword');
    cy.get('button[type="submit"]').click({ force: true });

    // Mock de la alerta
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Credenciales incorrectas. Inténtalo de nuevo.');
    });
  });
});
