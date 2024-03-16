import React from 'react'

import './login.css';
function Login() {
  return (
    <body className='b2'>
        <div className="container">
            <h1>Login</h1>
            <form action="">
                <input type="text" placeholder='Username' />
                <input type="password" placeholder='Password' />
            </form>
            <button>Login</button>
        </div>
        </body>
  )
}

export default Login ;