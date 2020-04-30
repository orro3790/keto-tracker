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

export const createCreateFoodDocument = async (currentUser, fields) => {
  // grab the collection and instantiate an empty doc so it is assigned a random ID
  const collectionRef = firestore.collection(
    `users/${currentUser.id}/createdFoods/`
  );
  const newDocRef = collectionRef.doc();

  // prep the fields
  const name = fields.name.value;
  const description = fields.description.value;
  const grams = parseFloat(fields.grams.value);
  const fats = parseFloat(fields.fats.value);
  const fatsPer = parseFloat(fields.fatsPer.value);
  const carbs = parseFloat(fields.carbs.value);
  const carbsPer = parseFloat(fields.carbsPer.value);
  const protein = parseFloat(fields.protein.value);
  const proteinPer = parseFloat(fields.proteinPer.value);
  const calories = parseFloat(fields.calories.value);
  const caloriesPer = parseFloat(fields.caloriesPer.value);
  const createdAt = new Date();

  try {
    // .set() is the create method
    await newDocRef.set({
      name,
      description,
      grams,
      fats,
      fatsPer,
      carbs,
      carbsPer,
      protein,
      proteinPer,
      calories,
      caloriesPer,
      createdAt,
    });
    return 'successful';
  } catch (error) {
    console.log('error creating new food item', error.message);
  }
};

// get standard catalogue of foods to display in the food diary
export const getFoodsCollection = async () => {
  const collectionRef = firestore.collection('foods');

  collectionRef.onSnapshot(async (snapshot) =>
    convertCollectionSnapshotToMap(snapshot)
  );

  return collectionRef;
};

export const convertCollectionSnapshotToMap = (collectionSnapshot) => {
  const transformedCollection = collectionSnapshot.docs.map((docSnapshot) => {
    const {
      name,
      description,
      grams,
      fats,
      fatsPer,
      carbs,
      carbsPer,
      protein,
      proteinPer,
      calories,
      caloriesPer,
    } = docSnapshot.data();

    return {
      id: docSnapshot.id,
      name: name,
      description: description,
      grams: grams,
      fats: fats,
      fatsPer: fatsPer,
      carbs: carbs,
      carbsPer: carbsPer,
      protein: protein,
      proteinPer: proteinPer,
      calories: calories,
      caloriesPer: caloriesPer,
    };
  });

  return transformedCollection;
};

export default firebase;
