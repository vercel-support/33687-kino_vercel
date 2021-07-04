import './App.sass';
import React from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import Header from "./Header";
import Home from "./Home";
import Film from "./Film";
import Genre from "./Genre";
import Search from "./Search";
import Footer from "./Footer";

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/media/:film" component={Film} />
          <Route path="/search/:search/:number" component={Search} />
          <Route path="/genre/:genre/:number" component={Genre} />
        </Switch>
        <Footer />
      </Router>
    </HelmetProvider>
  );
}
export default App;
