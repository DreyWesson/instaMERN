function formatDate(date = new Date(), formatType = "timeSince") {
  let hours = date.getHours(),
    minutes = date.getMinutes(),
    weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    monthName = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    ampm = hours >= 12 ? "pm" : "am",
    strTime,
    day;
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  strTime = hours + ":" + minutes + ampm;
  day = weekDay[date.getDay()];
  let month = monthName[date.getMonth()];

  // if the date is TODAY display only time else display DAY,DATE
  let timeUI = () => {
    switch (formatType) {
      case "time&date":
        // 6:28 pm 14 Nov, 2020
        return `${strTime} ${date.getDate()} ${month}, ${date.getFullYear()}`;
      case "time&day&date":
        // 6:28 pm Sat 14 Nov, 2020
        return `${strTime} ${day} ${date.getDate()} ${month}, ${date.getFullYear()}`;
      case "isToday":
        // 6:28 pm • Today
        return `${strTime} • Today`;
      case "checkIfToday":
        return `${date.getDate()}•${month}•${date.getFullYear()}`;

      case "longTime":
        // Sat 14 Nov, 2020
        return `${day} ${date.getDate()} ${month}, ${date.getFullYear()}`;
      default:
        // 20mins ago
        return timeSince(date);
    }
  };

  function timeSince(date) {
    let seconds = Math.floor((new Date() - date) / 1000),
      interval = seconds / 31536000;

    if (interval >= 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) + " years ago"
        : Math.floor(interval) + " year ago";
    }
    interval = seconds / 2592000;
    if (interval >= 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) + " months ago"
        : Math.floor(interval) + " month ago";
    }
    interval = seconds / 86400;
    if (interval >= 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) + " days ago"
        : Math.floor(interval) + " day ago";
    }
    interval = seconds / 3600;
    if (interval >= 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) + " hours ago"
        : Math.floor(interval) + " hour ago";
    }
    interval = seconds / 60;
    if (interval >= 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) + " minutes ago"
        : Math.floor(interval) + " minute ago";
    }
    return Math.floor(interval) > 1
      ? Math.floor(seconds) + " seconds ago"
      : Math.floor(seconds) + " second ago";
  }

  return timeUI();
}
const isToday = (postTime, today = "") => {
  const checkIsToday = "checkIfToday";

  // returns time in formatDate default if is today and 'longTime if its not'
  return formatDate(new Date(), checkIsToday) ===
    formatDate(postTime, checkIsToday)
    ? formatDate(postTime, today)
    : formatDate(postTime, "longTime");
};

export { formatDate, isToday };
