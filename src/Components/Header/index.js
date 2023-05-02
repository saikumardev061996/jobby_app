import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLgOut = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <>
      <nav className="nav-header">
        <ul className="header-item-list">
          <Link to="/">
            <li>
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="header-logo"
              />
            </li>
          </Link>
          <li>
            <div className="nav-link-container">
              <Link to="/" className="nav-link">
                <p className="nav-titles">Home</p>
              </Link>
              <Link to="/jobs" className="nav-link">
                <p className="nav-titles">Jobs</p>
              </Link>
            </div>
          </li>
          <li>
            <button
              type="button"
              className="log-out-button"
              onClick={onClickLgOut}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default withRouter(Header)
