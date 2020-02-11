
const EXPIRED_SENTINEL = "EXP";

document.addEventListener('DOMContentLoaded', function () {
  var targetDate = new Date("Mar 21, 2020 09:00:00").getTime();
  var coundownElement = document.getElementById("countdown")
  var originalPrefix = coundownElement.innerHTML

  // Set on page load
  coundownElement.innerHTML = makePageElement(originalPrefix, makeCounterText(targetDate))

  // Update every 1 second
  var x = setInterval(function () {
    coundownElement.innerHTML = makePageElement(originalPrefix, makeCounterText(targetDate))
  }, 1000);
}, false);

function makeCounterText(target) {
  var distance = target - new Date().getTime();

  if (distance < 0) {
    return EXPIRED_SENTINEL;
  }

  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function makePageElement(prefix, counter) {
  if (counter == EXPIRED_SENTINEL) {
    return prefix + "In Progress!";
  }
  return prefix + counter;
}