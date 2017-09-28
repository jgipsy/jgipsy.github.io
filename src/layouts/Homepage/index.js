import React from "react"
//import GATracker from "../../components/GoogleAnalyticsTracker"

import LatestPosts from "../../components/LatestPosts"
import Page from "../Page"

const Homepage = (props) => {
  return (
    //<GATracker>
    <Page { ...props }>
      <LatestPosts />
    </Page>
    //</GATracker>
  )
}

export default Homepage
