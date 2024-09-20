import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";
import { withRouter } from "react-router-dom";
import LOADING_ICON from './images/loading.gif';
import Home from './components/Home'
import PlantDetails  from "./components/PlantDetails";
import PlantUploader  from "./components/PlantUploader";
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome'
import * as icon from '@fortawesome/free-solid-svg-icons'
import PlantCondition from "./components/PlantCondition";


class App extends Component {
  render()
  {
    let self=this;
    return (
      <React.Fragment>
      <div class="header-bar">
        <div style={{width:'33%'}}><img src="./images/logo.png" className="logo"></img></div>
        <div class="header-title">Plant Health Optimiser</div>
        <div style={{width:'33%'}} className="top-icon-div">
          <a href="/" style={{cursor:'pointer'}}><FA icon={ icon.faHouse} color="white" className="fa-xl" /></a>
        </div>
    	</div>

      <Router>
          <Container fluid={true} >
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/plantdisease" render={() => <PlantDetails type="Symptoms"/>}/>
              <Route exact path="/plantsolution" render={() => <PlantDetails type="Solution"/>}/>
              <Route exact path="/plantuploader" component={PlantUploader} />
              <Route exact path="/plantcondition" component={PlantCondition} />

            </Switch>
          </Container>
        </Router>
        <footer class="footer" >
        <div class="copyright">
          <div>{"Copyright © " +  new Date().getFullYear()+" IIT Mandi"}</div>
        </div>
      </footer>
        </React.Fragment>   
   )
  
  }
}

export default withRouter(App);
