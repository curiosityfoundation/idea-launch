describe('profiles-ui: ProfilesUi component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=profilesui--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to profiles-ui!');
    });
});
