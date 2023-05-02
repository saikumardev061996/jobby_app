import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitErrorMsg: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {errorMsg, showSubmitErrorMsg} = this.state

    return (
      <div className="login-background-container">
        <div className="login-form-container">
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="form-logo"
            />
            <div className="label-container">
              <label htmlFor="userNameInput" className="label-input">
                USERNAME
              </label>
              <input
                type="text"
                id="userNameInput"
                placeholder="Username"
                className="input"
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="label-container">
              <label htmlFor="passwordInput" className="label-input">
                PASSWORD
              </label>
              <input
                type="password"
                id="passwordInput"
                placeholder="Password"
                className="input"
                onChange={this.onChangePassword}
              />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            {showSubmitErrorMsg ? <p>{errorMsg}</p> : null}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
