describe('EMI Payment Flow', () => {

  it('should load payment page', () => {
    cy.visit('http://localhost:3000/payments')

    cy.contains('Payment Gateway')  // check page loaded
  })

})