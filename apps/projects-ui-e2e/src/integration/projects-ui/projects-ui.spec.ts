describe('projects-ui: ProjectsUi component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=projectsui--primary'));

  it('should render the component', () => {
    cy.get('h1').should('contain', 'Welcome to projects-ui!');
  });
});
