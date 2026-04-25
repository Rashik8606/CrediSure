describe('FULL EMI PAYMENT FLOW', () => {

  let token = ''
  let emi_id = ''
  let order_id = ''

  it('1. Login user', () => {
    cy.request('POST', 'http://127.0.0.1:8000/api/token/', {
      username: 'jomol',
      password: 'rashik@123'
    }).then((res) => {
      expect(res.status).to.eq(200)
      token = res.body.access
    })
  })

  it('2. Get Next EMI', () => {
    cy.request({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/loans/next-emi/',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.has_emi).to.eq(true)

      emi_id = res.body.emi_id
    })
  })

  it('3. Create Payment Order', () => {
    cy.request({
      method: 'POST',
      url: 'http://127.0.0.1:8001/api/emi/create-payment/',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        emi_id: emi_id
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('order_id')

      order_id = res.body.order_id
    })
  })

  it('4. Simulate Payment Success', () => {
    cy.request({
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
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('5. Verify EMI is marked paid', () => {
    cy.request({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/loans/emi/${emi_id}/`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.paid).to.eq(true)
    })
  })

})