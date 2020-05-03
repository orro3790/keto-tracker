export const instantiateDatesObj = (datesObj) => {
  if (datesObj === undefined || datesObj === null) {
    let today = new Date();
    let currentDate = new Date(today);
    let prevDate = new Date(today);
    let nextDate = new Date(today);

    currentDate.setDate(today.getDate());
    prevDate.setDate(currentDate.getDate() - 1);
    nextDate.setDate(currentDate.getDate() + 1);

    today = today.toLocaleDateString();
    currentDate = currentDate.toLocaleDateString();
    prevDate = prevDate.toLocaleDateString();
    nextDate = nextDate.toLocaleDateString();

    // set datesObj so now the user is anchored on today's day
    datesObj = {
      today: today,
      currentDate: currentDate,
      prevDate: prevDate,
      nextDate: nextDate,
    };
  }

  localStorage.setItem('dates', JSON.stringify(datesObj));

  return datesObj;
};

export const instantiateEntriesObj = (entriesObj, datesObj) => {
  // instantiate a new entriesObj for currentDate if one doesn't already exist
  if (!Object.keys(entriesObj).includes(datesObj.currentDate)) {
    const newEntry = {
      [datesObj.currentDate]: {
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
      },
    };
    // copy entries and append newEntry to it without replacing other keys
    const copy = Object.assign({}, entriesObj, newEntry);

    // add the updated entryObj to localStorage
    localStorage.setItem('entries', JSON.stringify(copy));

    // return the new entriesObj which can optionally be used to update state
    return copy;
  }
};
