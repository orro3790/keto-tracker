import React from 'react';
import './App.css';
import Header from './components/header/header.component';
import Home from './pages/home/home.component';
import Diary from './components/food-diary/food-diary.component.jsx';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component.jsx';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: null,
    };
  }

  unsubscribeFromAuth = null;

  // call onAuthStateChanged from firebase.auth, so firebase can notify us about user state changes and we can change our state with the user object when a change occurs. The snapshots themselves don't show anything until we call .data() on them. The id value is always used to reference the location of data in the database, so it must be referenced
  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        // create user in database if they don't already exist --> eitherway, return userRef
        const userRef = await createUserProfileDocument(userAuth);

        // get a snapshot of the user from the database, and set our state to it
        userRef.onSnapshot((snapShot) => {
          this.setState(
            {
              currentUser: {
                id: snapShot.id,
                ...snapShot.data(),
              },
            },
            () => {
              console.log(this.state);
            }
          );
        });
      }
      // If the current user logs out, set the state of currentUser to null (because userAuth will be null)
      this.setState({ currentUser: userAuth });
    });
  }

  // onAuthStateChanged is an open subscription (messaging system), so we have to close it when the component unmounts, to prevent memory leaks
  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <Router>
        <Header currentUser={this.state.currentUser} />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/diary' component={Diary} />
          <Route path='/signin' component={SignInAndSignUpPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
