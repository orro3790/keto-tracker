import React, { useState, useEffect } from 'react';
import './App.css';
import AlertModal from './components/alert-modal/alert-modal.component';
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
import { alertModal } from './redux/alert-modal/alert-modal.selectors';
import {
  setCurrentUser,
  setFavFoods,
  setCreatedFoods,
} from './redux/user/user.actions';
import { auth, createUserDoc, firestore } from './firebase/firebase.utils';

const App = ({
  setCurrentUser,
  currentUser,
  setFavFoods,
  setCreatedFoods,
  alertModal,
}) => {
  const [authUser, setAuthUser] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [alertMounted, setAlertMounted] = useState(false);

  // call onAuthStateChanged from firebase.auth, so firebase can notify us about user state changes and we can change our state with the user object when a change occurs. The snapshots themselves don't show anything until we call .data() on them. The id value is always used to reference the location of data in the database, so it must be referenced

  useEffect(() => {
    const unsubCurrentUser = auth.onAuthStateChanged(async (authUser) => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);

      if (authUser) {
        // create user in database if they don't already exist --> eitherway, return userRef
        const userRef = await createUserDoc(authUser);

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

  // listen for alerts
  useEffect(() => {
    let fadeTimer;
    let unMountAlertTimer;

    const fade = () => {
      fadeTimer = setTimeout(() => {
        setEnabled(true);
      }, 4000);
    };

    const unMountAlert = () => {
      // css opacity transition effect takes 1s, so clear the modal away completely 1 sec later
      unMountAlertTimer = setTimeout(() => {
        setAlertMounted(false);
      }, 5000);
    };

    if (alertModal.status === 'visible') {
      // if an alert is already mounted, clear the fade and umount timers first
      clearTimeout(fadeTimer);

      clearTimeout(unMountAlertTimer);

      setAlertMounted(true);

      setEnabled(true);

      if (alertModal.sticky === false) {
        fade();

        unMountAlert();
      }
    }

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unMountAlertTimer);
    };
  }, [alertModal]);

  let renderedAlert;

  if (alertModal.status === 'visible' && alertMounted === true) {
    renderedAlert = <AlertModal enabled={enabled} />;
  }

  return (
    <div>
      {renderedAlert}
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
              currentUser && currentUser.m === 'p' ? (
                <Exercises />
              ) : (
                <Redirect to='/' />
              )
            }
          />
          <Route
            path='/metrics'
            render={() =>
              currentUser && currentUser.m === 'p' ? (
                <Metrics />
              ) : (
                <Redirect to='/' />
              )
            }
          />
          <Route
            path='/settings'
            render={() => (currentUser ? <Settings /> : <Redirect to='/' />)}
            onLeav
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
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  alertModal: alertModal,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
  setFavFoods: (favFoods) => dispatch(setFavFoods(favFoods)),
  setCreatedFoods: (createdFoods) => dispatch(setCreatedFoods(createdFoods)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
