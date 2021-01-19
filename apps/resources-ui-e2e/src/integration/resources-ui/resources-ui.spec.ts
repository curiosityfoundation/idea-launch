describe('resources-ui: ResourcesUi component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=resourcesui--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to resources-ui!');
    });
});
