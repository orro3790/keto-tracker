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
        },
        carbSettings: 't',
        membership: 's',
        waterSettings: {
          e: true,
          g: 1250,
          u: 'cups',
        },
        scheduled: {
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
  if (userId === null) return;

  const userRef = firestore.doc(`users/${userId}`);

  // check if there are any scheduled food entries that may need to have their diet snapshot updated
  const snapshot = await userRef.get();

  const data = snapshot.data();

  let scheduledEntries = Object.assign({}, data.scheduled.f);

  let entriesEdited = false;

  // If the user has foodDiary entries scheduled, check if some have expired or the diet snapshot needs updating
  if (Object.keys(scheduledEntries).length !== 0) {
    let today = new Date();

    // If the scheduled date has passed, remove it
    Object.keys(scheduledEntries).forEach((date) => {
      // Firestore timestamps are stored as seconds => * 1000 to convert to milliseconds
      let scheduledDate = new Date(date * 1000);

      if (scheduledDate < today) {
        delete scheduledEntries[date];
        entriesEdited = true;
      }
    });

    let dates = Object.keys(scheduledEntries);

    // Updates will be pushed in an all-or-none approach via batch.
    let batch = firestore.batch();

    if (dates.length > 0) {
      // Update the diet snapshots in scheduled foodDiary entries.
      dates.forEach((date) => {
        const entryRef = firestore.doc(`users/${userId}/foodDiary/${date}`);
        batch.update(entryRef, { 'entry.goals.diet.snapshot': macros });
      });

      // Update the user's diet settings, as well as their scheduled entries, if they were edited
      if (entriesEdited === true) {
        userRef.update({
          diet: macros,
          'scheduled.f': scheduledEntries,
        });
      } else {
        userRef.update({
          diet: macros,
        });
      }
    }

    // Commit the batch updates to firestore
    try {
      batch.commit();
    } catch (error) {
      console.log(error);
    }
    console.log(Object.keys(scheduledEntries));
  }
  // If the user doesn't have any foodDiary entries scheduled, simply update their diet settings in their user doc
  else {
    try {
      userRef.update({
        diet: macros,
      });
    } catch (error) {
      console.log(error);
    }
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
      date: firebase.firestore.Timestamp.fromDate(anchor),
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
            f: dietSettings.f,
            c: dietSettings.c,
            p: dietSettings.p,
            e: dietSettings.e,
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
            w: waterSettings.g,
          },
          precision: {
            w: 0,
          },
        },
      },
    };
    return entry;
  } else {
    return snapShot.data().entry;
  }
};

export const updateEntry = async (userId, entry) => {
  const entryRef = firestore.doc(
    `users/${userId}/foodDiary/${entry.date.seconds}`
  );
  // check to see if this entry is scheduled for the future (searchModal allows scheduling 7 days in adv.)
  let today = new Date();

  if (entry.date.seconds * 1000 > today.getTime()) {
    const userRef = firestore.doc(`users/${userId}`);
    try {
      // store the entry date as a key in the scheduled.f obj, no value needed
      userRef.update({
        [`scheduled.f.${entry.date.seconds}`]: true,
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
        .where('entry.date', '<', today)
        .get();

      // Nest the entries in monthlyData, under keys generated from the month & year UNIX time
      let monthlyData = {};

      foodDiaryCollectionSnapshot.docs.forEach((snapshot) => {
        const data = snapshot.data();

        // Reduce entry's date to the month, determining where to nest the data
        let date = data.entry.date.seconds;
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
          dailyMacros: data.entry.dailyMacros,
          water: data.entry.water,
          goals: data.entry.goals,
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
        .where('entry.date', '>', lastDayWithData)
        .where('entry.date', '<', today)
        .get();

      // Nest the entries in monthlyData, under keys generated from the month & year UNIX time
      let monthlyData = {};

      foodDiaryCollectionSnapshot.docs.forEach((snapshot) => {
        const data = snapshot.data();

        // Reduce entry's date to the month, determining where to nest the data
        let date = data.entry.date.seconds;
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
          dailyMacros: data.entry.dailyMacros,
          water: data.entry.water,
          goals: data.entry.goals,
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
