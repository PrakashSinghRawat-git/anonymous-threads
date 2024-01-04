export const getDateMonthYear = (timestamp) => {
    const date = new Date(timestamp.toDate()); // Convert Firestore timestamp to JavaScript Date object
    const year = date.getFullYear(); // Get the year (YYYY)
    let month = date.getMonth() + 1; // Get the month (0-11, so adding 1 to match actual months)
    let day = date.getDate(); // Get the day (1-31)

    // Add leading zeros if needed
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return { year, month, day };
};

export const getCurrentDate = () => {
    const currentDate = new Date(); // Get current date

    const year = currentDate.getFullYear(); // Get the year (YYYY)
    let month = currentDate.getMonth() + 1; // Get the month (0-11, so adding 1 to match actual months)
    let day = currentDate.getDate(); // Get the day (1-31)

    // Add leading zeros if needed
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return { day, month, year };
};
