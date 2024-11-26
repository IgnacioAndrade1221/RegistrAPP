describe('Login Flow', () => {
    it('should login successfully', () => {
      // Visitar la página de inicio de sesión
      cy.visit('/login');
  
      // Completar el formulario
      cy.get('[name="username"]').type('testuser');
      cy.get('[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
  
      // Verificar redirección
      cy.url().should('include', '/dashboard');
    });
  
    it('should show error on invalid login', () => {
      cy.visit('/login');
      cy.get('[name="username"]').type('wronguser');
      cy.get('[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
  
      // Verificar mensaje de error
      cy.contains('Invalid credentials').should('be.visible');
    });
  });
  