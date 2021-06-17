import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import{Home,About,Projects,Contact}from "./Components"
import Nav from "./Components/nav"

function App() {
  return (
    <Router>
          <Route path="/">
            <Nav />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/projects">
            <Projects />
          </Route>
          <Route path="/contact">
            <Contact />
          </Route>
    </Router>
  );
}

export default App;
