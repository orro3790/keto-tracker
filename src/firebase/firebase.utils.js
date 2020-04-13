import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyBPtcNfchAjmJLqsZBtk8G5wYScadGwhwg',
  authDomain: 'keto-tracker-5fafb.firebaseapp.com',
  databaseURL: 'https://keto-tracker-5fafb.firebaseio.com',
  projectId: 'keto-tracker-5fafb',
  storageBucket: 'keto-tracker-5fafb.appspot.com',
  messagingSenderId: '43088763001',
  appId: '1:43088763001:web:96e1f78948a1c660ad9ca8',
  measurementId: 'G-9CGXG3QMHK',
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

// automatically check if a logged in user is stored in the database or not, and add them, and also return the userRef for use later.
export const createUserProfileDocument = async (userAuth, additionalData) => {
  // If the user isn't logged in, pass
  if (!userAuth) return;

  // userRef if used for all CRUD operations
  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  // If there's no data for this user in the database, create it and store the following variables
  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      // .set() is the create method
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }
  return userRef;
};

export default firebase;
