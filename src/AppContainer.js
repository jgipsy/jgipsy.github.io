import React, { PropTypes } from "react"

import "./index.global.css"
import "./highlight.global.css"

import Container from "./components/Container"
import DefaultHeadMeta from "./components/DefaultHeadMeta"
import Header from "./components/Header"
import Content from "./components/Content"
import Footer from "./components/Footer"
//import GATracker from "./components/GoogleAnalyticsTracker"

const AppContainer = (props) => (
  //<GATracker params={ props }>
  <Container>
    <DefaultHeadMeta />
    <Header />
    <Content>
      { props.children }
    </Content>
    <Footer />
  </Container>
  //</GATracker>
)

AppContainer.propTypes = {
  children: PropTypes.node,
}

export default AppContainer
