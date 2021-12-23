import { FAVICON, TWITTER_PROFILE_LINK, GITHUB_PROFILE_LINK } from '../lib/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

export default function ContentHeader(props: { publishedAt: string }) {
  return (
    <>
      <div className="container">
        <a href={TWITTER_PROFILE_LINK} target="_blank" rel="noreferrer noopener">
          <img className="iconImg" src={FAVICON} />
        </a>
        <div className="leftContainer">
          <a href={TWITTER_PROFILE_LINK} target="_blank" rel="noreferrer noopener">
            <div className="authorName">きゅうしま</div>
          </a>
          <div className="createdAt">{props.publishedAt}</div>
        </div>
        <div className="shareButtonsContainer">
          <a href={TWITTER_PROFILE_LINK} target="_blank" rel="noreferrer noopener">
            <div className="socialAcountIcon">
              <FontAwesomeIcon icon={faTwitter} size="3x" />
            </div>
          </a>
          <a href={GITHUB_PROFILE_LINK} target="_blank" rel="noreferrer noopener">
            <div className="socialAcountIcon">
              <FontAwesomeIcon icon={faGithub} size="3x" />
            </div>
          </a>
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          margin: 40px 0;
        }
        .leftContainer {
          margin: 0 8px;
        }
        .iconImg {
          width: 32px;
          height: 32px;
          border: solid 1px #a9b7c6;
          padding: 2px;
          border-radius: 50%;
        }
        .authorName {
          fontsize: 13px;
        }
        .shareButtonsContainer {
          margin-left: auto;
          display: flex;
        }
        .socialAcountIcon {
          width: 30px;
          height: 30px;
          margin: 0 4px 0 16px;
        }
      `}</style>
    </>
  )
}
