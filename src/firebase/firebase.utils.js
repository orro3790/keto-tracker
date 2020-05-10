import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyBmRfC2bNeb6B-_PkOYqk393rH4ghrHGqk',
  authDomain: 'keto-tracker-177a9.firebaseapp.com',
  databaseURL: 'https://keto-tracker-177a9.firebaseio.com',
  projectId: 'keto-tracker-177a9',
  storageBucket: 'keto-tracker-177a9.appspot.com',
  messagingSenderId: '89794598592',
  appId: '1:89794598592:web:5e07c0d02dbe18fb753f25',
  measurementId: 'G-8792LJSPTH',
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

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  // If there's no data for this user in the database, create it and store the following variables
  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    // also create diet collection with default macros doc
    const macrosRef = firestore.doc(`users/${userAuth.uid}/diet/macros`);

    try {
      // .set() is the create method
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
      await macrosRef.set({
        calories: 2000,
        fats: 166,
        carbs: 25,
        protein: 100,
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
  const size = parseFloat(fields.size.value);
  const unit = fields.unit.value;
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
      size,
      unit,
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
      size,
      unit,
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
      size: size,
      unit: unit,
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

export const getDietMacros = async (userAuth) => {
  if (!userAuth) return;

  // grab the collection and instantiate an empty doc so it is assigned a random ID
  const macrosRef = firestore.doc(`users/${userAuth.uid}/diet/macros`);

  const snapShot = await macrosRef.get();

  const userMacros = snapShot.data();

  return userMacros;
};

export const updateDietMacros = async (userId, macros) => {
  if (!userId) return;

  // grab the collection and instantiate an empty doc so it is assigned a random ID
  const macrosRef = firestore.doc(`users/${userId}/diet/macros`);

  try {
    await macrosRef.set(macros);
  } catch (error) {
    console.log('error updating user macros', error.message);
  }
};

const scanner = (string) => {
  var strSearch = string;
  var strlength = strSearch.length;
  var strFrontCode = strSearch.slice(0, strlength - 1);
  var strEndCode = strSearch.slice(strlength - 1, strSearch.length);

  var startcode = strSearch;
  var endcode =
    strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
  return { startcode, endcode };
};

export const queryFoodByName = async (query) => {
  var strSearch = query;
  var strlength = strSearch.length;
  var strFrontCode = strSearch.slice(0, strlength - 1);
  var strEndCode = strSearch.slice(strlength - 1, strSearch.length);

  var startcode = strSearch;
  var endcode =
    strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
  firestore
    .collection('foods')
    .where('name', '>=', startcode)
    .where('name', '<', endcode)
    .get()
    .then((snapshot) =>
      snapshot.docs.forEach((doc) => console.log(doc.data()))
    );
};

export default firebase;
