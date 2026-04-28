describe('FULL EMI PAYMENT FLOW', () => {

  it('Complete Flow', () => {

    let token = ''
    let emi_id = ''
    let order_id = ''

    // 1. Login
    cy.request('POST', 'http://127.0.0.1:8000/api/token/', {
      username: 'jomol',
      password: 'rashik@123'
    }).then((res) => {
      expect(res.status).to.eq(200)
      token = res.body.access

      // 2. Get EMI
      return cy.request({
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/loans/next-emi/',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }).then((res) => {
      expect(res.status).to.eq(200)

      emi_id = res.body.emi_id
      expect(emi_id).to.exist

      // 3. Create Payment
      return cy.request({
        method: 'POST',
        url: 'http://127.0.0.1:8001/api/emi/create-payment/',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          emi_id: emi_id
        }
      })
    }).then((res) => {
      expect(res.status).to.eq(200)

      order_id = res.body.order_id
      expect(order_id).to.exist

      // 4. Verify Payment (TEST MODE)
      return cy.request({
        method: 'POST',
        url: 'http://127.0.0.1:8001/api/emi/verify-payment/',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: {
          razorpay_order_id: order_id,
          razorpay_payment_id: 'test_payment_123',
          razorpay_signature: 'test_signature'
        }
      })
    }).then((res) => {
      expect(res.status).to.eq(200)

      // 5. Check EMI Paid
      return cy.request({
        method: 'GET',
        url: `http://127.0.0.1:8000/api/loans/emi/${emi_id}/`,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }).then((res) => {
      expect(res.body.paid).to.eq(true)
    })

  })

})