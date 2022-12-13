/// <reference types="cypress" />
describe('When page is opened', () => {
  beforeEach(() => {
    cy.fixture('env').then(function (env) {
      this.env = env;
      cy.visit(this.env.PNC_UI_URL);
    });
  });

  it('should have 11 section tabs', function () {
    cy.get('.pf-c-nav__list li').should('have.length', 11);
  });

  it('should access dashboard page', function () {
    cy.get('a')
      .contains(/^Dashboard$/)
      .click();
  });

  it('should access Products page', function () {
    cy.get('a')
      .contains(/^Products$/)
      .click();
  });

  it('should access Projects page', function () {
    cy.get('a')
      .contains(/^Projects$/)
      .click();
  });

  it('should access BuildConfigs page', function () {
    cy.get('button')
      .contains(/^Configs$/)
      .click();
    cy.get('a')
      .contains(/^Build Configs$/)
      .click();
  });

  it('should access GroupConfigs page', function () {
    cy.get('button')
      .contains(/^Configs$/)
      .click();
    cy.get('a')
      .contains(/^Group Configs$/)
      .click();
  });

  it('should access Builds page', function () {
    cy.get('button')
      .contains(/^Builds$/)
      .click();
    cy.get('a')
      .contains(/^Builds$/)
      .click();
  });

  it('should access Group Builds page', function () {
    cy.get('button')
      .contains(/^Builds$/)
      .click();
    cy.get('a')
      .contains(/^Group Builds$/)
      .click();
  });

  it('should access Artifacts page', function () {
    cy.get('a')
      .contains(/^Artifacts$/)
      .click();
  });

  it('should access SCM Repositories page', function () {
    cy.get('a')
      .contains(/^SCM Repositories$/)
      .click();
  });
});
