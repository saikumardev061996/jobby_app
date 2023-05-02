import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class JobProfile extends Component {
  state = {
    userProfile: [],
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  onClickRetry = () => {
    this.getProfileDetails()
  }

  failureProfileView = () => (
    <>
      <div className="profile-failure-view">
        <button type="button" onClick={this.onClickRetry}>
          Retry
        </button>
      </div>
    </>
  )

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedProfile = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({userProfile: updatedProfile})
    } else if (response.status === 401) {
      this.failureProfileView()
    }
  }

  render() {
    const {userProfile} = this.state
    const {name, profileImageUrl, shortBio} = userProfile
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-heading">{name}</h1>
        <p className="profile-description">{shortBio}</p>
      </div>
    )
  }
}

export default JobProfile
