import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './pages/home/home.component';
import Diary from './pages/diary/diary.component';
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
import {
  auth,
  createUserProfileDocument,
  firestore,
} from './firebase/firebase.utils';
import { connect } from 'react-redux';
import { setCurrentUser } from './redux/user/user.actions';

const App = ({ setCurrentUser }) => {
  const [authUser, setAuthUser] = useState(null);
  // call onAuthStateChanged from firebase.auth, so firebase can notify us about user state changes and we can change our state with the user object when a change occurs. The snapshots themselves don't show anything until we call .data() on them. The id value is always used to reference the location of data in the database, so it must be referenced

  useEffect(() => {
    const unsubCurrentUser = auth.onAuthStateChanged(async (authUser) => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);

      if (authUser) {
        // create user in database if they don't already exist --> eitherway, return userRef
        const userRef = await createUserProfileDocument(authUser);

        // get a snapshot of the user from the database, and set our state to it
        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      } else {
        // If the current user logs out, set the state of currentUser to null (because userAuth will be null)
        setCurrentUser(authUser);
      }
    });

    // listen for changes to favFoods collection
    // const unsubFavFoods = firestore
    //   .collection(`user/${authUser.uid}/favFoods`)
    //   .onSnapshot(function () {
    //     console.log('added');
    //   });

    return () => {
      unsubCurrentUser();
      // unsubFavFoods();
    };
  }, [setCurrentUser, authUser]);

  return (
    <Router>
      {/* <Header /> */}
      <Switch>
        <Route exact path='/' component={Home} />
        <Route
          path='/diary'
          render={() => (authUser ? <Diary /> : <Redirect to='/' />)}
        />
        <Route
          path='/exercises'
          render={() =>
            authUser && authUser.membership.t === 'premium' ? (
              <Exercises />
            ) : (
              <Redirect to='/' />
            )
          }
        />
        <Route
          path='/metrics'
          render={() =>
            authUser && authUser.membership.t === 'premium' ? (
              <Metrics />
            ) : (
              <Redirect to='/' />
            )
          }
        />
        <Route
          path='/settings'
          render={() => (authUser ? <Settings /> : <Redirect to='/' />)}
        />
        <Route
          exact
          path='/signin'
          render={() =>
            authUser ? <Redirect to='/' /> : <SignInAndSignUpPage />
          }
        />
      </Switch>
    </Router>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(App);
