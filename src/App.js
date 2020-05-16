import React from 'react';
import './App.css';
import Home from './pages/home/home.component';
import Diary from './components/food-diary/food-diary.component.jsx';
import Exercises from './pages/exercises/exercises.component.jsx';
import Metrics from './pages/metrics/metrics.component.jsx';
import Settings from './pages/settings/settings.component.jsx';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component.jsx';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { connect } from 'react-redux';
import { setCurrentUser } from './redux/user/user.actions';

class App extends React.Component {
  unsubscribeFromAuth = null;

  // call onAuthStateChanged from firebase.auth, so firebase can notify us about user state changes and we can change our state with the user object when a change occurs. The snapshots themselves don't show anything until we call .data() on them. The id value is always used to reference the location of data in the database, so it must be referenced
  componentDidMount() {
    const { setCurrentUser } = this.props;

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        // create user in database if they don't already exist --> eitherway, return userRef
        const userRef = await createUserProfileDocument(userAuth);

        // get a snapshot of the user from the database, and set our state to it
        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      } else {
        // If the current user logs out, set the state of currentUser to null (because userAuth will be null)
        setCurrentUser(userAuth);
      }
    });
  }

  // onAuthStateChanged is an open subscription (messaging system), so we have to close it when the component unmounts, to prevent memory leaks
  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <Router>
        {/* <Header /> */}
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/diary' component={Diary} />
          <Route path='/exercises' component={Exercises} />
          <Route path='/metrics' component={Metrics} />
          <Route path='/settings' component={Settings} />
          <Route
            exact
            path='/signin'
            render={() =>
              this.props.currentUser ? (
                <Redirect to='/' />
              ) : (
                <SignInAndSignUpPage />
              )
            }
          />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
