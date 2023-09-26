import * as React from 'react'
import * as ReactDOM from 'react-dom'

const Welcome = () => {

  return(

    <div className= 'container'>
      <h1> Hello , Welcome to my Wakilni App </h1>
      <p className='lead'> Now I will push this to github </p>
    </div>
  )
}

document.addEventListener('DOMContentLoaded', () => {

  ReactDOM.render(<Welcome />, document.getElementById('welcome'))

})

export default Welcome
