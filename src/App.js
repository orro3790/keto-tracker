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
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from './redux/user/user.selectors';
import {
  setCurrentUser,
  setFavFoods,
  setCreatedFoods,
} from './redux/user/user.actions';
import {
  auth,
  createUserProfileDocument,
  firestore,
} from './firebase/firebase.utils';

const App = ({ setCurrentUser, currentUser, setFavFoods, setCreatedFoods }) => {
  const [authUser, setAuthUser] = useState(null);

  // call onAuthStateChanged from firebase.auth, so firebase can notify us about user state changes and we can change our state with the user object when a change occurs. The snapshots themselves don't show anything until we call .data() on them. The id value is always used to reference the location of data in the database, so it must be referenced

  useEffect(() => {
    const unsubCurrentUser = auth.onAuthStateChanged(async (authUser) => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);

      if (authUser) {
        // create user in database if they don't already exist --> eitherway, return userRef
        const userRef = await createUserProfileDocument(authUser);

        // get a snapshot of the user from the database, and set our state to it
        userRef.onSnapshot((snapshot) => {
          setCurrentUser({
            id: snapshot.id,
            ...snapshot.data(),
          });
        });
      } else {
        // If the current user logs out, set the state of currentUser to null (because userAuth will be null)
        setCurrentUser(authUser);
      }
    });

    return () => {
      unsubCurrentUser();
    };
  }, [setCurrentUser]);

  // favorites listener
  useEffect(() => {
    let unsubFavFoods = null;

    const favFoodsListener = () => {
      return firestore
        .collection(`users/${authUser.uid}/favFoods`)
        .onSnapshot((querySnapshot) => {
          const favFoods = [];
          querySnapshot.forEach((doc) => {
            const food = doc.data();
            food.id = doc.id;
            favFoods.push(food);
          });
          setFavFoods(favFoods);
        });
    };

    if (authUser !== null) {
      unsubFavFoods = favFoodsListener();
    }

    return () => {
      if (unsubFavFoods) {
        unsubFavFoods();
        console.log('unsubbed from favs listener');
      }
    };
  }, [authUser, setFavFoods]);

  // createdFoods listener
  useEffect(() => {
    let unsubCreatedFoods = null;

    const createdFoodsListener = () => {
      return firestore
        .collection(`users/${authUser.uid}/createdFoods`)
        .onSnapshot((querySnapshot) => {
          const createdFoods = [];
          querySnapshot.forEach((doc) => {
            const food = doc.data();
            food.id = doc.id;
            createdFoods.push(food);
          });
          setCreatedFoods(createdFoods);
        });
    };

    if (authUser !== null) {
      unsubCreatedFoods = createdFoodsListener();
    }

    return () => {
      if (unsubCreatedFoods) {
        unsubCreatedFoods();
        console.log('unsubbed from favs listener');
      }
    };
  }, [authUser, setCreatedFoods]);

  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route
          path='/diary'
          render={() => (currentUser ? <Diary /> : <Redirect to='/' />)}
        />
        <Route
          path='/exercises'
          render={() =>
            currentUser && currentUser.membership.t === 'p' ? (
              <Exercises />
            ) : (
              <Redirect to='/' />
            )
          }
        />
        <Route
          path='/metrics'
          render={() =>
            currentUser && currentUser.membership.t === 'p' ? (
              <Metrics />
            ) : (
              <Redirect to='/' />
            )
          }
        />
        <Route
          path='/settings'
          render={() => (currentUser ? <Settings /> : <Redirect to='/' />)}
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

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  setFavFoods: (favFoods) => dispatch(setFavFoods(favFoods)),
  setCreatedFoods: (createdFoods) => dispatch(setCreatedFoods(createdFoods)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
