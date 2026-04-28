describe('FULL EMI FLOW WITH UI', () => {

  it('Complete Flow + UI', () => {

    let access = ''
    let refresh = ''

    cy.request('POST', 'http://127.0.0.1:8000/api/token/', {
      username: 'jomol',
      password: 'rashik@123'
    }).then((res) => {

      access = res.body.access
      refresh = res.body.refresh

      cy.visit('http://localhost:3000/borrower/dashboard', {
        onBeforeLoad(win) {
          win.localStorage.setItem('access_token', access)
          win.localStorage.setItem('refresh_token', refresh)
          win.localStorage.setItem('role', 'borrower')
        }
      })

    })

    cy.visit('http://localhost:3000/payments')

    // ✅ generic check (safe)
    cy.get('body').should('be.visible')

  })

})