import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `linear-gradient(to bottom, #0e1e25 20%,#2d3b41 90%)`,
      textShadow: `0 2px 20px rgba(0,0,0,.16)`,
      marginBottom: `4em`,
      paddingTop: `2em`,
      paddingBottom: `4em`,
      position: `relative`,
      overflow: `hidden`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `#fff`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
    </div>
    <div class="wave" aria-hidden="true">
      <svg viewBox="0 0 1440 127">
        <path
          d="M0.5,42.9636079 L0.5,119.5 L1439.5,119.5 L1439.5,43.119913 C748.936314,13.2999357 269.448743,13.3212255 1.05528611,43.1811859 L0.5,43.242964 L0.5,42.9636079 Z"
          id="Combined-Shape"
        />
      </svg>
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
