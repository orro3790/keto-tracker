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
export const createUserDoc = async (userAuth, additionalData) => {
  // If the user isn't logged in, pass
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  // If there's no data for this user in the database, create it and store the following variables
  if (!snapShot.exists) {
    const { email, displayName } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        createdAt,
        email,
        displayName,
        hudModel: 'remaining',
        diet: {
          e: 2000,
          p: 100,
          c: 25,
          f: 166,
          w: 1250,
        },
        carbSettings: 't',
        membership: 's',
        waterSettings: {
          e: true,
          g: 1250,
          u: 'cups',
        },
        ...additionalData,
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }
  return userRef;
};

export const createFood = async (userId, food) => {
  try {
    const collectionRef = firestore.collection(`users/${userId}/createdFoods`);
    await collectionRef.add(food);
  } catch (error) {
    console.log(`error adding ${food.n} to favorites`, error.message);
  }
};

export const deleteFood = async (userId, food) => {
  try {
    const foodRef = firestore.doc(`users/${userId}/createdFoods/${food.id}`);
    await foodRef.delete();
  } catch (error) {
    console.log(`error deleting food from custom foods`, error.message);
  }
};

export const updateDiet = async (userId, macros) => {
  if (userId === null) return;

  // grab the collection and instantiate an empty doc so it is assigned a random ID
  const userRef = firestore.doc(`users/${userId}`);

  userRef.update({
    diet: macros,
  });

  console.log('diet settings updated');
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

  // drop hr, min, s, ms,
  anchor.setHours(0, 0, 0, 0);

  // firestore stores timestamps in seconds in unix epoch time, but javascript uses milliseconds, so / 1000 first
  const anchorUtcSeconds = anchor / 1000;

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
      water: {
        t: 0,
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
      goals: {
        diet: {
          snapshot: {
            f: 0,
            c: 0,
            p: 0,
            e: 0,
          },
          hit: {
            f: true,
            c: true,
            p: true,
            e: true,
          },
          precision: {
            f: 0,
            c: 0,
            p: 0,
            e: 0,
          },
        },
        water: {
          snapshot: {
            w: 0,
          },
          hit: {
            w: false,
          },
          precision: {
            w: 0,
          },
        },
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

export const updateWaterSettings = async (currentUser, waterSettings) => {
  const userRef = firestore.doc(`users/${currentUser.id}`);

  try {
    await userRef.update({
      waterSettings,
    });
    return 'success';
  } catch (error) {
    return 'error';
  }
};

export const toggleFavFood = async (userId, food) => {
  console.log(food);
  // grab the collection and instantiate an empty doc so it is assigned a random ID
  const querySnapshot = await firestore
    .collection(`users/${userId}/favFoods`)
    .where('id', '==', food.id)
    .get();

  if (querySnapshot.empty) {
    try {
      const collectionRef = firestore.collection(`users/${userId}/favFoods`);
      await collectionRef.doc(food.id).set(food);
    } catch (error) {
      console.log(`error adding ${food.n} to favorites`, error.message);
    }
  } else {
    // const foodRef = firestore.collection(`users/${userId}/favFoods`);
    querySnapshot.docs.forEach((doc) => doc.ref.delete());
  }
};

export default firebase;
