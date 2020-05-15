const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

// exports.entryUpdated = functions.firestore
//   .document('users/{userId}/foodDiary/{date}')
//   .onUpdate((snapshot, context) => {
//     const data = snapshot.after.data();

//     const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

//     meals.forEach((meal) => {
//       if (meal !== 'currentDate') {
//         data.entry[meal].totals.f = data.entry[meal].foods.reduce(
//           (accumulator, food) => {
//             return (accumulator += food.f);
//           },
//           0
//         );
//         data.entry[meal].totals.p = data.entry[meal].foods.reduce(
//           (accumulator, food) => {
//             return (accumulator += food.p);
//           },
//           0
//         );
//         data.entry[meal].totals.c = data.entry[meal].foods.reduce(
//           (accumulator, food) => {
//             return (accumulator += food.c);
//           },
//           0
//         );
//         data.entry[meal].totals.d = data.entry[meal].foods.reduce(
//           (accumulator, food) => {
//             return (accumulator += food.d);
//           },
//           0
//         );
//         data.entry[meal].totals.e = data.entry[meal].foods.reduce(
//           (accumulator, food) => {
//             return (accumulator += food.e);
//           },
//           0
//         );
//       }
//     });

//     return snapshot.after.ref.set({
//       data,
//     });
//   });
