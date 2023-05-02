import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobCardDetails: [],
    skills: [],
    lifeAtCompanyList: [],
    similarJobsList: [],
  }

  componentDidMount() {
    this.getJobCarsDetails()
  }

  getJobCarsDetails = async () => {
    this.setState({apiState: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        title: data.job_details.title,
        location: data.job_details.location,
        rating: data.job_details.rating,
        packagePerAnnum: data.job_details.package_per_annum,
      }
      this.setState({
        jobCardDetails: updatedData,
        apiState: apiStatusConstants.success,
      })

      const skillsUpdatedData = data.job_details.skills.map(each => ({
        imageUrl: each.image_url,
        name: each.name,
      }))
      this.setState({skills: skillsUpdatedData})

      const lifeAtCompany = {
        description: data.job_details.life_at_company.description,
        lifeImageUrl: data.job_details.life_at_company.image_url,
      }
      this.setState({lifeAtCompanyList: lifeAtCompany})

      const similarJobs = data.similar_jobs.map(eachSimilar => ({
        similarCompanyLogoUrl: eachSimilar.company_logo_url,
        similarRating: eachSimilar.rating,
        similarTitle: eachSimilar.title,
        similarLocation: eachSimilar.location,
        similarJobDescription: eachSimilar.job_description,
        similarEmploymentType: eachSimilar.employment_type,
      }))
      this.setState({similarJobsList: similarJobs})
    } else {
      this.setState({apiState: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <>
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </>
  )

  retryButton = () => {
    this.getJobCarsDetails()
  }

  renderFailureView = () => (
    <>
      <div className="failure-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="failure-description">
          We cannot seem to find the page you are looking for
        </p>
        <button type="button" onClick={this.retryButton}>
          Retry
        </button>
      </div>
    </>
  )

  renderApiState = () => {
    const {apiState} = this.state
    switch (apiState) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  renderSuccessView = () => {
    const {
      jobCardDetails,
      skills,
      lifeAtCompanyList,
      similarJobsList,
    } = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      jobDescription,
      employmentType,
      rating,
      packagePerAnnum,
      location,
    } = jobCardDetails
    const {similarTitle} = similarJobsList
    const {description, lifeImageUrl} = lifeAtCompanyList
    return (
      <>
        <div className="details-log-container">
          <div className="logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="heading-container">
              <h1 className="job-title-heading">{title}</h1>
              <div className="raring-container">
                <AiFillStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-container">
            <div className="location-icon-container">
              <HiLocationMarker className="location-icon" />
              <p>{location}</p>
            </div>
            <div className="employment-type">
              <p>{employmentType}</p>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <hr className="card-line" />
          <h1 className="company-description">Description</h1>
          <a href={companyWebsiteUrl}>Visit</a>
          <p className="job-item-description">{jobDescription}</p>
          <h1 className="skills-list">Skills</h1>
          <div className="skills-container">
            <ul className="skills-list">
              {skills.map(eachSkills => (
                <li value={eachSkills} className="skill-list-item">
                  <img
                    src={eachSkills.imageUrl}
                    alt={eachSkills.name}
                    className="skills-logo-image"
                  />
                  <p className="skills-heading">{eachSkills.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="skills-list">Life At Company</h1>
            <div className="life-at-company-container">
              <p className="job-item-description life-description">
                {description}
              </p>
              <img
                src={lifeImageUrl}
                alt="life at company"
                className="life-at-company-image"
              />
            </div>
          </div>
        </div>
        <div className="similar-container">
          <h1 className="similar-container-heading">Similar Jobs</h1>
        </div>
        <ul className="similar-unOrder-list">
          {similarJobsList.map(eachSimilar => (
            <li
              value={eachSimilar}
              key={eachSimilar.similarTitle}
              className="list-similar-data"
            >
              <div className="similar-card-items">
                <div className="logo-container">
                  <img
                    src={eachSimilar.similarCompanyLogoUrl}
                    alt="similar job company logo"
                    className="similar-company-logo"
                  />
                  <div className="heading-container">
                    <h1 className="job-title-heading">{similarTitle}</h1>
                    <div className="raring-container">
                      <AiFillStar className="star-icon" />
                      <p className="rating">{eachSimilar.similarRating}</p>
                    </div>
                  </div>
                </div>
                <h1 className="company-description">Description</h1>
                <p className="job-item-description">
                  {eachSimilar.similarJobDescription}
                </p>
                <div className="location-icon-container">
                  <div className="location-icon-container">
                    <HiLocationMarker className="location-icon" />
                    <p>{eachSimilar.similarLocation}</p>
                  </div>
                  <div className="employment-type">
                    <p className="similar-intern">
                      {eachSimilar.similarEmploymentType}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  render() {
    return (
      <>
        <div className="job-item-details-main-container">
          <Header />
          <div className="details-card-container">{this.renderApiState()}</div>
        </div>
      </>
    )
  }
}

export default JobItemDetails
