import React from 'react'
import FuzzyText from './FuzzyText';
import { Link } from 'react-router-dom';

const UnAuthrized = () => {
  console.log('Page is working')
  return (
    <div style={{ textAlign:'center', marginTop:'80px' }}>

      <FuzzyText
        color='black'
        baseIntensity={0.2}
        hoverIntensity={0.3}
        enableHover
        fontSize='clamp(1rem, 8vw, 4rem)'
      >
        401 🚫 
      </FuzzyText>
      <p>Unauthorized Page</p>
      <Link to='/login'>BACK TO LOGIN</Link>
    </div>
  )
}

export default UnAuthrized;