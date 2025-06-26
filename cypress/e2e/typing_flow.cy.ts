describe('Typing Test Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the typing test and transition to summary screen after completion', () => {
    // Ensure the typing test elements are visible
    cy.contains('Typing Test').should('be.visible');
    cy.get('[data-testid="time-left"]').should('contain', '30s');

    // Simulate typing to start the test
    // We don't need to type the whole text, just enough to start the timer
    cy.get('input[type="text"]').type('hello');

    // Wait for the test to finish (30 seconds)
    cy.get('[data-testid="time-left"]', { timeout: 31000 }).should('contain', '0s');

    // Verify that the SummaryScreen is displayed
    cy.contains('Test Complete!').should('be.visible');
    cy.contains('Raw WPM').should('be.visible');
    cy.contains('Net WPM').should('be.visible');
    cy.contains('Accuracy').should('be.visible');
    cy.contains('Retry').should('be.visible');
    cy.contains('New Test').should('be.visible');
  });

  it('should allow retrying the test from the summary screen', () => {
    // Complete a test first
    cy.get('input[type="text"]').type('test');
    cy.get('[data-testid="time-left"]', { timeout: 31000 }).should('contain', '0s');
    cy.contains('Test Complete!').should('be.visible');

    // Click Retry
    cy.contains('Retry').click();

    // Verify that the typing test screen is back
    cy.contains('Typing Test').should('be.visible');
    cy.get('[data-testid="time-left"]').should('contain', '30s');
    cy.get('input[type="text"]').should('have.value', '');
  });

  it('should allow starting a new test from the summary screen', () => {
    // Complete a test first
    cy.get('input[type="text"]').type('test');
    cy.get('[data-testid="time-left"]', { timeout: 31000 }).should('contain', '0s');
    cy.contains('Test Complete!').should('be.visible');

    // Click New Test
    cy.contains('New Test').click();

    // Verify that the typing test screen is back
    cy.contains('Typing Test').should('be.visible');
    cy.get('[data-testid="time-left"]').should('contain', '30s');
    cy.get('input[type="text"]').should('have.value', '');
  });
});
