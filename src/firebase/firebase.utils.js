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
        a: createdAt,
        e: email,
        n: displayName,
        h: 'r',
        d: {
          e: 2000,
          p: 100,
          c: 25,
          f: 166,
        },
        c: 't',
        m: 's',
        w: {
          e: true,
          g: 1250,
          u: 'c',
        },
        s: {
          f: {},
          e: {},
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
  const userRef = firestore.doc(`users/${userId}`);

  const userSnapshot = await userRef.get();

  const userData = userSnapshot.data();

  // Use a batch approach to ensure all-or-none updates
  let batch = firestore.batch();

  let today = new Date();
  today.setHours(0, 0, 0, 0);

  // STEP 1: If today's entry already exists, stage an update to its diet snapshot
  const todaysEntryRef = firestore.doc(
    `users/${userId}/foodDiary/${today / 1000}`
  );

  const snapshot = await todaysEntryRef.get();

  if (snapshot.exists === true) {
    batch.update(todaysEntryRef, { 'entry.g.d.s': macros });
  }

  // STEP 2: Check if the user has any scheduled entries ==> stage updates to their diet snapshots
  let scheduledEntries = Object.assign({}, userData.s.f);

  // keep track of whether or not the user's scheduled entries list will need to be updated
  let entriesEdited = false;

  // STEP 3: if entries are scheduled, remove any that have expired
  if (Object.keys(scheduledEntries).length > 0) {
    Object.keys(scheduledEntries).forEach((date) => {
      // Firestore timestamps are stored as seconds => * 1000 to convert to milliseconds
      let scheduledDate = new Date(date * 1000);

      if (scheduledDate < today) {
        delete scheduledEntries[date];
        entriesEdited = true;
      }
    });
  }

  let dates = Object.keys(scheduledEntries);

  // STEP 4: if any entries are still scheduled, stage updates to their diet snapshots
  if (dates.length > 0) {
    dates.forEach((date) => {
      const entryRef = firestore.doc(`users/${userId}/foodDiary/${date}`);
      batch.update(entryRef, { 'entry.g.d.s': macros });
    });
  }

  // STEP 5: stage update to diet settings and also stage update to the scheduled entries list if it was edited
  switch (entriesEdited) {
    case true:
      batch.update(userRef, {
        d: macros,
        's.f': scheduledEntries,
      });
      break;
    case false:
      batch.update(userRef, {
        d: macros,
      });
      break;
    default:
      break;
  }

  // STEP 7: commit all staged updates to firestore
  try {
    batch.commit();
  } catch (error) {}
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

export const getEntry = async (
  userId,
  dietSettings,
  waterSettings,
  anchorDate,
  dateShift
) => {
  // date refers to the date currently being viewed, not today's date

  let anchor = new Date();

  // if a date other than today is passed in
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

  // if this date doesn't exist in the foodDiary, return default entry object

  if (snapShot.exists === false) {
    const entry = {
      b: {
        f: [],
        t: {
          f: 0,
          c: 0,
          p: 0,
          e: 0,
          d: 0,
          k: 0,
        },
      },
      l: {
        f: [],
        t: {
          f: 0,
          c: 0,
          p: 0,
          e: 0,
          d: 0,
          k: 0,
        },
      },
      d: {
        f: [],
        t: {
          f: 0,
          c: 0,
          p: 0,
          e: 0,
          d: 0,
          k: 0,
        },
      },
      s: {
        f: [],
        t: {
          f: 0,
          c: 0,
          p: 0,
          e: 0,
          d: 0,
          k: 0,
        },
      },
      w: {
        t: null,
      },
      t: firebase.firestore.Timestamp.fromDate(anchor),
      m: {
        f: 0,
        c: 0,
        p: 0,
        e: 0,
        d: 0,
        k: 0,
      },
      g: {
        d: {
          s: {
            f: dietSettings.f,
            c: null,
            p: dietSettings.p,
            e: dietSettings.e,
            d: null,
            k: null,
          },
          p: {
            f: 0,
            c: null,
            p: 0,
            e: 0,
            d: null,
            k: null,
          },
        },
        w: {
          s: {
            w: null,
          },
          p: {
            w: null,
          },
        },
      },
    };

    // if the user is tracking net carbs, total carbs, or fiber, include it in the default entry's nested goals object
    const optionalMacros = ['c', 'k', 'd'];

    optionalMacros.forEach((macro) => {
      if (dietSettings[macro]) {
        entry.g.d.s[macro] = dietSettings[macro];
        entry.g.d.p[macro] = 0;
      }
    });

    // if the user is tracking water, include it in the default entry's nested goals object and daily total
    if (waterSettings.e) {
      entry.w.t = 0;
      entry.g.w.s.w = waterSettings.g;
      entry.g.w.p.w = 0;
    }

    return entry;
  } else {
    return snapShot.data().entry;
  }
};

export const updateEntry = async (userId, entry) => {
  const entryRef = firestore.doc(
    `users/${userId}/foodDiary/${entry.t.seconds}`
  );
  // check to see if this entry is scheduled for the future (searchModal allows scheduling 7 days in adv.)
  let today = new Date();

  if (entry.t.seconds * 1000 > today.getTime()) {
    const userRef = firestore.doc(`users/${userId}`);
    try {
      // store the entry date as a key in the scheduled.f obj, no value needed
      userRef.update({
        [`s.f.${entry.t.seconds}`]: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

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

export const updateCarbSettings = async (userId, diet, setting) => {
  const userRef = firestore.doc(`users/${userId}`);

  const userSnapshot = await userRef.get();

  const userData = userSnapshot.data();

  // Use a batch approach to ensure all-or-none updates
  let batch = firestore.batch();

  // Stage 1: stage updates the user's carbSettings and diet
  batch.update(userRef, { c: setting });
  batch.update(userRef, { d: diet });

  // STEP 2: If today's entry already exists, stage an update to its diet goal snapshot
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysEntryRef = firestore.doc(
    `users/${userId}/foodDiary/${today / 1000}`
  );

  const snapshot = await todaysEntryRef.get();

  if (snapshot.exists === true) {
    batch.update(todaysEntryRef, {
      'entry.g.d.s': diet,
    });
  }

  // STEP 3: Check if the user has any scheduled entries ==> stage updates to their carb goal snapshots
  let scheduledEntries = Object.assign({}, userData.s.f);

  // keep track of whether or not the user's scheduled entries list will need to be updated
  let entriesEdited = false;

  // STEP 3: if entries are scheduled, remove any that have expired
  if (Object.keys(scheduledEntries).length > 0) {
    Object.keys(scheduledEntries).forEach((date) => {
      // Firestore timestamps are stored as seconds => * 1000 to convert to milliseconds
      let scheduledDate = new Date(date * 1000);

      if (scheduledDate < today) {
        delete scheduledEntries[date];
        entriesEdited = true;
      }
    });
  }

  let dates = Object.keys(scheduledEntries);

  // STEP 4: if any entries are still scheduled, stage updates to their diet goal snapshots
  if (dates.length > 0) {
    dates.forEach((date) => {
      const entryRef = firestore.doc(`users/${userId}/foodDiary/${date}`);
      batch.update(entryRef, {
        'entry.g.d.s': diet,
      });
    });
  }

  // STEP 5: also stage update to scheduled entries list if it was edited
  if (entriesEdited) {
    batch.update(userRef, {
      's.f': scheduledEntries,
    });
  }

  // LAST: commit all staged updates to firestore
  try {
    batch.commit();
    return 'success';
  } catch (error) {
    return 'error';
  }
};

export const updateWaterSettings = async (userId, waterSettings) => {
  const userRef = firestore.doc(`users/${userId}`);

  const userSnapshot = await userRef.get();

  const userData = userSnapshot.data();

  // Use a batch approach to ensure all-or-none updates
  let batch = firestore.batch();

  // STEP 1: Stage update to waterSettings
  batch.update(userRef, {
    w: waterSettings,
  });

  // STEP 2: if today's entry already exists, stage an update to its water goal snapshot
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysEntryRef = firestore.doc(
    `users/${userId}/foodDiary/${today / 1000}`
  );

  const snapshot = await todaysEntryRef.get();

  if (snapshot.exists === true) {
    batch.update(todaysEntryRef, {
      'entry.g.w.s.w': waterSettings.g,
    });
  }

  // STEP 3: check if the user has any scheduled entries ==> stage updates to their water goal snapshots
  let scheduledEntries = Object.assign({}, userData.s.f);

  // keep track of whether or not the user's scheduled entries list will need to be updated
  let entriesEdited = false;

  // STEP 4: if entries are scheduled, remove any that have expired
  if (Object.keys(scheduledEntries).length > 0) {
    Object.keys(scheduledEntries).forEach((date) => {
      // Firestore timestamps are stored as seconds => * 1000 to convert to milliseconds
      let scheduledDate = new Date(date * 1000);

      if (scheduledDate < today) {
        delete scheduledEntries[date];
        entriesEdited = true;
      }
    });
  }

  let dates = Object.keys(scheduledEntries);

  // STEP 5: if any entries are still scheduled, stage updates to their water goal snapshots
  if (dates.length > 0) {
    dates.forEach((date) => {
      const entryRef = firestore.doc(`users/${userId}/foodDiary/${date}`);
      batch.update(entryRef, {
        'entry.g.w.s.w': waterSettings.g,
      });
    });
  }

  // STEP 6: stage update to scheduled entries list if it was edited
  if (entriesEdited) {
    batch.update(userRef, {
      's.f': scheduledEntries,
    });
  }

  // STEP 7: commit all staged updates to firestore
  try {
    batch.commit();
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
    querySnapshot.docs.forEach((doc) => doc.ref.delete());
  }
};

export const updateMetricsData = async (userId, membership) => {
  const initializeMetricsCollection = async () => {
    // Only update metrics data up until, but not including, today's date which ensures each entry is complete
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Check if the metrics collection exists yet
    const metricsCollectionRef = firestore.collection(
      `users/${userId}/metrics`
    );

    const metricsCollectionSnapshot = await metricsCollectionRef.get();

    // 2. If metrics collection does not exist ==> fetch all data in foodDiary to initialize it
    if (metricsCollectionSnapshot.empty === true) {
      const foodDiaryCollectionSnapshot = await firestore
        .collection(`users/${userId}/foodDiary`)
        .where('entry.t', '<', today)
        .get();

      // Nest the entries in monthlyData, under keys generated from the month & year UNIX time
      let monthlyData = {};

      foodDiaryCollectionSnapshot.docs.forEach((snapshot) => {
        const data = snapshot.data();

        // Reduce entry's date to the month, determining where to nest the data
        let date = data.entry.t.seconds;
        // Convert back to milliseconds to adjust date
        let month = new Date(date * 1000).setDate(1);
        // Convert back to seconds for storing in firestore
        month = month / 1000;

        // If the monthly key doesn't exist (first loop), create it and then append the data, else just append the data
        if (monthlyData[month] === undefined) {
          monthlyData[month] = {};
        }

        monthlyData[month][date] = {
          Breakfast: data.entry.Breakfast.totals,
          Lunch: data.entry.Lunch.totals,
          Dinner: data.entry.Dinner.totals,
          Snacks: data.entry.Snacks.totals,
          m: data.entry.m,
          water: data.entry.w,
          g: data.entry.g,
        };
      });

      // 3. Create a doc for each item in the monthlyData object
      Object.keys(monthlyData).forEach(async (month) => {
        const monthlyDocRef = firestore.doc(`users/${userId}/metrics/${month}`);
        await monthlyDocRef.set(monthlyData[month]);
      });
    }
    // 3. If metrics collection exists already ==> fetch only the foodDiary entries needed to update it
    else {
      // Get the most recent month with metrics data stored in it
      // Because it dates > today can never be stored in metrics, indexing last doc should work.
      const lastMonthWithData = metricsCollectionSnapshot.docs[
        metricsCollectionSnapshot.docs.length - 1
      ].data();

      // Get the most recent date with metrics data
      let lastDayWithData = Object.keys(lastMonthWithData);
      lastDayWithData = lastDayWithData[lastDayWithData.length - 1];

      // Query the foodDiary from latest date in metrics collection onwards, not including today
      const foodDiaryCollectionSnapshot = await firestore
        .collection(`users/${userId}/foodDiary`)
        .where('entry.t', '>', lastDayWithData)
        .where('entry.t', '<', today)
        .get();

      // Nest the entries in monthlyData, under keys generated from the month & year UNIX time
      let monthlyData = {};

      foodDiaryCollectionSnapshot.docs.forEach((snapshot) => {
        const data = snapshot.data();

        // Reduce entry's date to the month, determining where to nest the data
        let date = data.entry.t.seconds;
        // Convert back to milliseconds to adjust date
        let month = new Date(date * 1000).setDate(1);
        // Convert back to seconds for storing in firestore
        month = month / 1000;

        // If the monthly key doesn't exist (first loop), create it and then append the data, else just append the data
        if (monthlyData[month] === undefined) {
          monthlyData[month] = {};
        }

        monthlyData[month][date] = {
          Breakfast: data.entry.Breakfast.totals,
          Lunch: data.entry.Lunch.totals,
          Dinner: data.entry.Dinner.totals,
          Snacks: data.entry.Snacks.totals,
          m: data.entry.m,
          water: data.entry.w,
          g: data.entry.g,
        };
      });

      // 3. Create a doc for each item in the monthlyData object
      Object.keys(monthlyData).forEach(async (month) => {
        const monthlyDocRef = firestore.doc(`users/${userId}/metrics/${month}`);

        await monthlyDocRef.set(monthlyData[month]);
      });
    }
  };

  // Only execute if the user's membership status is 'premium'
  if (membership === 'p') {
    initializeMetricsCollection();
  }
};

export const getMetricsData = async (userId) => {
  // 1. Check if the metrics collection exists yet
  const metricsCollectionSnapshot = await firestore
    .collection(`users/${userId}/metrics`)
    .get();

  const data = {};

  metricsCollectionSnapshot.docs.forEach((snapshot) => {
    data[snapshot.id] = snapshot.data();
  });

  return data;
};

export const dateWriteable = (date) => {
  // Only allow updates to the firestore +/- 7 days from today's date to limit abuse
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let deltaTime = today - date;
  let deltaDays = Math.abs(deltaTime / (1000 * 3600 * 24));

  if (deltaDays <= 20) {
    return true;
  } else {
    return false;
  }
};

export default firebase;
