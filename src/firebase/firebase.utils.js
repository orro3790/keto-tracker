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

    try {
      // .set() is the create method
      await userRef.set({
        displayName,
        email,
        createdAt,
        hudModel: 'remaining',
        diet: {
          calories: 2000,
          protein: 100,
          carbs: 25,
          fats: 166,
        },
        carbSettings: 'total',
        favFoods: [],
        membership: 'standard',
        ...additionalData,
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }
  return userRef;
};

export const createCreateFoodDocument = async (currentUser, newFood) => {
  // grab the collection and instantiate an empty doc so it is assigned a random ID
  const collectionRef = firestore.collection(
    `users/${currentUser.id}/createdFoods/`
  );
  const newDocRef = collectionRef.doc();
  try {
    // .set() is the create method
    await newDocRef.set(newFood);
    console.log('New food successfully added!');
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

export const updateUpdateDiet = async (userId, macros) => {
  if (userId === null) return;

  // grab the collection and instantiate an empty doc so it is assigned a random ID
  const userRef = firestore.doc(`users/${userId}`);

  userRef.update({
    diet: macros,
  });

  console.log('diet settings updated');
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

export const getEntry = async (userId, anchorDate, dateShift) => {
  // currentDate refers to the date currently being viewed, not today's date

  let anchor = new Date();

  if (anchorDate) {
    anchor = new Date(anchorDate);
  }

  switch (dateShift) {
    case -1:
      anchor.setDate(anchor.getDate() - 1);
      break;
    case +1:
      anchor.setDate(anchor.getDate() + 1);
      break;
    default:
      break;
  }

  const month = anchor.getMonth();
  const date = anchor.getDate();
  const year = anchor.getFullYear();

  // javascript generates months starting from 0, so month +1 to properly format the string
  anchor = new Date(`${month + 1}/${date}/${year}`);

  // firestore stores timestamps in seconds in unix epoch time, but javascript uses milliseconds, so / 1000 first
  const anchorUtcSeconds = Date.parse(anchor) / 1000;

  // now check if this date exists in firestore
  const entryRef = firestore.doc(
    `users/${userId}/foodDiary/${anchorUtcSeconds}`
  );

  const snapShot = await entryRef.get();

  // if this date doesn't exist in the foodDiary, create it
  if (snapShot.exists === false) {
    const entry = {
      Breakfast: {
        foods: [],
        totals: {
          f: 0,
          c: 0,
          p: 0,
          e: 0,
          d: 0,
          k: 0,
        },
      },
      Lunch: {
        foods: [],
        totals: {
          f: 0,
          c: 0,
          p: 0,
          e: 0,
          d: 0,
          k: 0,
        },
      },
      Dinner: {
        foods: [],
        totals: {
          f: 0,
          c: 0,
          p: 0,
          e: 0,
          d: 0,
          k: 0,
        },
      },
      Snacks: {
        foods: [],
        totals: {
          f: 0,
          c: 0,
          p: 0,
          e: 0,
          d: 0,
          k: 0,
        },
      },
      currentDate: firebase.firestore.Timestamp.fromDate(anchor),
      dailyMacros: {
        f: 0,
        c: 0,
        p: 0,
        e: 0,
        d: 0,
        k: 0,
      },
    };
    try {
      await entryRef.set({ entry });
      return entry;
    } catch (error) {
      console.log('error creating foodDiary entry', error.message);
    }
  } else {
    return snapShot.data().entry;
  }
};

export const updateEntry = async (userId, entry) => {
  // Check if this date exists in firestore
  const entryRef = firestore.doc(
    `users/${userId}/foodDiary/${entry.currentDate.seconds}`
  );
  try {
    await entryRef.set({ entry });
    console.log('entry updated in firestore!');
  } catch (error) {
    console.log('error creating foodDiary entry', error.message);
  }
};

export const signOut = () => {
  const auth = firebase.auth();
  auth.signOut();
};

export const updateCarbSettings = async (userId, setting) => {
  const userRef = firestore.doc(`users/${userId}`);
  try {
    await userRef.update({ carbSettings: setting });
  } catch (error) {
    console.log('error creating foodDiary entry', error.message);
  }
};

export const addFavoriteFood = async (userId, foodReference) => {
  // grab the collection and instantiate an empty doc so it is assigned a random ID
  const userRef = firestore.doc(`users/${userId}/`);

  const snapshot = await userRef.get();

  const userData = snapshot.data();

  let exists = false;

  userData.favFoods.forEach((food) => {
    if (food.id === foodReference.id) {
      exists = true;
    }
  });

  if (exists === false) {
    try {
      let userCopy = Object.assign({}, userData);
      userCopy.favFoods.push(foodReference);
      userRef.set(userCopy).then(function () {
        console.log(`${foodReference.n} added to favorites`);
      });
    } catch (error) {
      console.log(
        `error adding ${foodReference.n} to favorites: ${error.error}`
      );
    }
  } else {
    try {
      let userCopy = Object.assign({}, userData);
      userCopy.favFoods.splice(foodReference, 1);
      userRef.set(userCopy).then(function () {
        console.log(`${foodReference.n} removed from favorites`);
      });
    } catch (error) {
      console.log(
        `error removing ${foodReference.n} from favorites: ${error.error}`
      );
    }
  }
};

export default firebase;
