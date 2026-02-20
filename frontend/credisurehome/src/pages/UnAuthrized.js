import React from 'react'

const UnAuthrized = () => {
  return (
    <div style={{textAlign:'center',marginTop:'80px'}}>
      <h1>🚫 Unauthorized</h1>
      <p>You are not allowed this page.</p>
      <a href='/login'>Back to login</a>
    </div>
  )
}

export default UnAuthrized
