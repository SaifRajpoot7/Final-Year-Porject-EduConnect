const formatCustomDateTime = (dateString) => {
  const date = new Date(dateString);

  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = String(date.getFullYear()).slice(-2);

  return `${hours}:${minutes} ${ampm} ${day} ${month} ${year}`;
}

export default formatCustomDateTime;