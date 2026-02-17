// Counter variables to track attendance
let totalCount = 0;
let waterCount = 0;
let zeroCount = 0;
let powerCount = 0;

// Array to store all attendees
let attendees = [];

// Maximum capacity for the event
const maxCapacity = 50;

// Get references to all the DOM elements we need
const checkInForm = document.getElementById("checkInForm");
const attendeeName = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountDisplay = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const waterCountDisplay = document.getElementById("waterCount");
const zeroCountDisplay = document.getElementById("zeroCount");
const powerCountDisplay = document.getElementById("powerCount");
const checkInBtn = document.getElementById("checkInBtn");
const attendeeListElement = document.getElementById("attendeeList");

// Function to save data to localStorage
function saveToLocalStorage() {
  const data = {
    totalCount: totalCount,
    waterCount: waterCount,
    zeroCount: zeroCount,
    powerCount: powerCount,
    attendees: attendees,
  };
  localStorage.setItem("eventCheckInData", JSON.stringify(data));
}

// Function to load data from localStorage
function loadFromLocalStorage() {
  const savedData = localStorage.getItem("eventCheckInData");
  if (savedData) {
    const data = JSON.parse(savedData);
    totalCount = data.totalCount;
    waterCount = data.waterCount;
    zeroCount = data.zeroCount;
    powerCount = data.powerCount;
    attendees = data.attendees;

    // Update all displays with loaded data
    updateAllDisplays();
    renderAttendeeList();

    // Check if capacity was already reached
    if (totalCount >= maxCapacity) {
      checkInBtn.disabled = true;
      showCelebrationMessage();
    }
  }
}

// Function to update all displays
function updateAllDisplays() {
  attendeeCountDisplay.textContent = totalCount;
  waterCountDisplay.textContent = waterCount;
  zeroCountDisplay.textContent = zeroCount;
  powerCountDisplay.textContent = powerCount;

  const progressPercentage = (totalCount / maxCapacity) * 100;
  progressBar.style.width = `${progressPercentage}%`;
}

// Function to get full team name
function getTeamName(teamCode) {
  if (teamCode === "water") {
    return "Team Water Wise";
  } else if (teamCode === "zero") {
    return "Team Net Zero";
  } else if (teamCode === "power") {
    return "Team Renewables";
  }
  return "";
}

// Function to get the winning team
function getWinningTeam() {
  if (waterCount > zeroCount && waterCount > powerCount) {
    return "🌊 Team Water Wise";
  } else if (zeroCount > waterCount && zeroCount > powerCount) {
    return "🌿 Team Net Zero";
  } else if (powerCount > waterCount && powerCount > zeroCount) {
    return "⚡ Team Renewables";
  } else {
    // Handle ties
    return "all teams (tie)";
  }
}

// Function to show celebration message
function showCelebrationMessage() {
  const winningTeam = getWinningTeam();
  greeting.textContent = `🎉 Event at full capacity! Congratulations to ${winningTeam} for the win! 🏆`;
  greeting.style.display = "block";
  greeting.className = "celebration-message";
}

// Function to render the attendee list
function renderAttendeeList() {
  // Clear the current list
  attendeeListElement.innerHTML = "";

  // If no attendees, show empty message
  if (attendees.length === 0) {
    attendeeListElement.innerHTML =
      '<p class="empty-message">No attendees checked in yet</p>';
    return;
  }

  // Create a list item for each attendee
  attendees.forEach(function (attendee) {
    const attendeeItem = document.createElement("div");
    attendeeItem.className = `attendee-item ${attendee.team}`;

    const attendeeNameSpan = document.createElement("span");
    attendeeNameSpan.className = "attendee-name";
    attendeeNameSpan.textContent = attendee.name;

    const attendeeTeamSpan = document.createElement("span");
    attendeeTeamSpan.className = "attendee-team";
    attendeeTeamSpan.textContent = getTeamName(attendee.team);

    attendeeItem.appendChild(attendeeNameSpan);
    attendeeItem.appendChild(attendeeTeamSpan);

    attendeeListElement.appendChild(attendeeItem);
  });
}

// Load saved data when page loads
loadFromLocalStorage();

// Add submit event listener to the form
checkInForm.addEventListener("submit", function (event) {
  // Prevent the default form submission
  event.preventDefault();

  // Get the values from the form
  const name = attendeeName.value;
  const team = teamSelect.value;

  // Add attendee to the list
  attendees.push({
    name: name,
    team: team,
  });

  // Increment the total count
  totalCount = totalCount + 1;

  // Increment the correct team counter
  if (team === "water") {
    waterCount = waterCount + 1;
  } else if (team === "zero") {
    zeroCount = zeroCount + 1;
  } else if (team === "power") {
    powerCount = powerCount + 1;
  }

  // Update all displays
  updateAllDisplays();

  // Render the updated attendee list
  renderAttendeeList();

  // Save to localStorage
  saveToLocalStorage();

  // Create a personalized greeting message
  const teamName = getTeamName(team);
  const message = `Welcome, ${name}! You're checked in with ${teamName}. 🎉`;

  // Display the success message
  greeting.textContent = message;
  greeting.style.display = "block";
  greeting.className = "success-message";

  // Reset the form for the next attendee
  checkInForm.reset();

  // Check if we've reached capacity
  if (totalCount >= maxCapacity) {
    checkInBtn.disabled = true;
    showCelebrationMessage();
  }
});
