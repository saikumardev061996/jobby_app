import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import JobProfile from '../JobProfile'
import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobRoute extends Component {
  state = {
    jobs: [],
    searchInput: '',
    salaryRangeInput: '',
    employmentType: [],
    apiState: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiState: apiStatusConstants.inProgress})
    const {salaryRangeInput, employmentType, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?minimum_package=${salaryRangeInput}&employment_type=${employmentType.join()}&search=${searchInput}`
    console.log(url)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobs: updatedJobData,
        apiState: apiStatusConstants.success,
      })
    } else {
      this.setState({apiState: apiStatusConstants.failure})
    }
  }

  onClickSearchButton = () => {
    const {searchInput, jobs} = this.state
    const filteredProjects = jobs.filter(eachSearchJob =>
      eachSearchJob.title.toUpperCase().includes(searchInput.toUpperCase()),
    )
    this.setState({jobs: filteredProjects})
  }

  onClickSalary = event => {
    this.setState({salaryRangeInput: event.target.value}, this.getJobDetails)
  }

  onChangeType = event => {
    this.setState(
      prevState => ({
        employmentType: [...prevState.employmentType, event.target.value],
      }),
      this.getJobDetails,
    )
  }

  onSearchJobs = event => {
    this.setState({searchInput: event.target.value})
  }

  renderLoadingView = () => (
    <>
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </>
  )

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
        <button type="button" onClick={this.getJobDetails} data-testid="button">
          Retry
        </button>
      </div>
    </>
  )

  renderSuccessView = () => {
    const {jobs} = this.state
    return (
      <>
        <div className="job-main-container" data-testid="loader">
          <div className="job-profile-first-container">
            <JobProfile />
            <hr className="line" />
            <h1 className="type-of-employee">Type of Employment</h1>
            <nav>
              <ul className="employment-list">
                {employmentTypesList.map(eachType => (
                  <li
                    key={eachType.employmentTypeId}
                    className="employment-type-details"
                  >
                    <input
                      type="checkbox"
                      id={eachType.employmentTypeId}
                      value={eachType.employmentTypeId}
                      onChange={this.onChangeType}
                    />
                    <label htmlFor={eachType.employmentTypeId}>
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </nav>

            <hr className="line" />
            <h1 className="type-of-employee">Salary Range</h1>
            <nav>
              <ul className="employment-list">
                {salaryRangesList.map(eachRange => (
                  <li
                    key={eachRange.salaryRangeId}
                    className="employment-type-details"
                  >
                    <input
                      type="radio"
                      name="range"
                      id={eachRange.salaryRangeId}
                      value={eachRange.salaryRangeId}
                      onChange={this.onClickSalary}
                    />
                    <label htmlFor={eachRange.salaryRangeId}>
                      {eachRange.label}
                    </label>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="job-details-second-container">
            <div className="search-container">
              <input
                type="search"
                className="input-search"
                placeholder="Search"
                onChange={this.onSearchJobs}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onClickSearchButton}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {jobs.length === 0 ? (
              <div>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                  alt="no jobs"
                />
                <h1 className="failure-jobs-heading">No Jobs Found</h1>
                <p className="failure-jobs-description">
                  We could not find any jobs. Try other filters
                </p>
              </div>
            ) : (
              <ul className="jobs-total-list">
                {jobs.map(eachJobItem => (
                  <JobItem key={eachJobItem.id} jobs={eachJobItem} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </>
    )
  }

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

  render() {
    return (
      <div className="job-app-container">
        <Header />
        {this.renderApiState()}
      </div>
    )
  }
}

export default JobRoute
