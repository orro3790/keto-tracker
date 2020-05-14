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

export const returnCollectionSnapshots = (collectionSnapshot) => {
  const transformedCollection = collectionSnapshot.docs.map((docSnapshot) => {
    const { fdc_id, description } = docSnapshot.data();

    return {
      fdc_id: fdc_id,
      description: description,
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

// export const addCollectionAndDocuments = async (
//   collectionKey,
//   objectsToAdd
// ) => {
//   const collectionRef = firestore.collection(collectionKey);

//   // rather than set each obj, wait for the batch to finish then set, just in case the code is interrupted midway through, we don't want it to be unpredictable, but the limit is 500 docs per batch, so batches need to be chunked
//   const batch = firestore.batch();
//   objectsToAdd.forEach((obj) => {
//     const newDocRef = collectionRef.doc();
//     batch.set(newDocRef, obj);
//   });

//   return await batch.commit();
// };

// .add() assigns a new auto-generated id to the document, it's like .set() but it knows the doc didn't already exist
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = firestore.collection(collectionKey);
  let batch = firestore.batch();
  let batchesArray = [];
  let counter = 0;
  let totalDocs = 0;

  objectsToAdd.forEach((obj) => {
    if (counter === 500) {
      batchesArray.push(batch);
      batch = firestore.batch();
      counter = 0;
      const newDocRef = collectionRef.doc();
      batch.set(newDocRef, obj);
      counter++;
      totalDocs++;
      console.log('Batch complete!');
    } else {
      const newDocRef = collectionRef.doc();
      batch.set(newDocRef, obj);
      counter++;
      totalDocs++;
    }
  });

  // if anything remains, push it to batchesArray
  if (batch.length !== 0) {
    batchesArray.push(batch);
  }

  // console log the total batch and doc count
  console.log(
    `${totalDocs} documents being pushed in ${batchesArray.length} batches.`
  );

  // now push to firestore
  const pushBatches = async (batch) => {
    return await batch.commit();
  };

  batchesArray.forEach((batch) => pushBatches(batch));

  console.log('Done!');
};

export const getDateSelector = async (userId) => {
  const dateSelectorRef = firestore.doc(
    `users/${userId}/dateSelector/selector`
  );
  const snapShot = await dateSelectorRef.get();
  return snapShot.data();
};

export const createDateSelector = async (userId) => {
  // unix is in milliseconds, so convert seconds to milliseconds by * 1000

  // const today = new Date(dateSelector.currentDate.seconds * 1000);
  // const currentDate = new Date(dateSelector.currentDate.seconds * 1000);
  // const prevDate = new Date(dateSelector.prevDate.seconds * 1000);
  // const nextDate = new Date(dateSelector.nextDate.seconds * 1000);

  let currentDatetime = new Date();
  const month = currentDatetime.getMonth();
  const date = currentDatetime.getDate();
  const year = currentDatetime.getFullYear();

  // javascript generates months starting from 0, so month +1 to properly format the string
  let currentDate = new Date(`${month + 1}/${date}/${year}`);

  // firestore stores timestamps in seconds in unix epoch time, but javascript uses milliseconds, so / 1000 first
  currentDate = Date.parse(currentDate) / 1000;

  // now check if this date exists in firestore
  const entryRef = firestore.doc(`users/${userId}/foodDiary/${currentDate}`);

  const snapShot = await entryRef.get();

  // if this date doesn't exist in the foodDiary, create it
  if (snapShot.exists === false) {
    const entry = {
      Breakfast: {
        foods: [],
        totals: {
          fats: '',
          carbs: '',
          protein: '',
          calories: '',
        },
      },
      Lunch: {
        foods: [],
        totals: {
          fats: '',
          carbs: '',
          protein: '',
          calories: '',
        },
      },
      Dinner: {
        foods: [],
        totals: {
          fats: '',
          carbs: '',
          protein: '',
          calories: '',
        },
      },
      Snacks: {
        foods: [],
        totals: {
          fats: '',
          carbs: '',
          protein: '',
          calories: '',
        },
      },
    };
    try {
      await entryRef.set({ entry });
    } catch (error) {
      console.log('error creating foodDiary entry', error.message);
    }
  }
};

export default firebase;
