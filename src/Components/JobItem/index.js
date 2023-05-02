import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import './index.css'

const JobItem = props => {
  const {jobs} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobs

  return (
    <Link to={`/jobs/${id}`} className="nav-link">
      <li className="item-container">
        <div className="logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
        <h1 className="job-title-heading">Description</h1>
        <p className="job-item-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
