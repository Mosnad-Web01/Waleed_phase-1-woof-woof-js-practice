document.addEventListener("DOMContentLoaded", () => {
  fetchPups();
});

// Fetch pups from the server
const fetchPups = () => {
  fetch("http://localhost:3000/pups")
    .then((response) => response.json())
    .then(renderDogBar)
    .catch((error) => console.error("Error fetching pups:", error));
};

// Render each pup's name in the dog bar
const renderDogBar = (pups) => {
  const dogBar = document.getElementById("dog-bar");
  dogBar.innerHTML = ""; // Clear previous entries
  pups.forEach((pup) => {
    const span = document.createElement("span");
    span.textContent = pup.name;
    span.dataset.id = pup.id; // Store the id for later use
    span.addEventListener("click", () => showDogInfo(pup));
    dogBar.appendChild(span);
  });
};

// Show info about the selected pup
const showDogInfo = (pup) => {
  const dogInfo = document.getElementById("dog-info");
  dogInfo.innerHTML = `
    <img src="${pup.image}" />
    <h2>${pup.name}</h2>
    <button data-id="${pup.id}" class="good-bad-btn">${
    pup.isGoodDog ? "Good Dog!" : "Bad Dog!"
  }</button>
  `;
  const button = dogInfo.querySelector(".good-bad-btn");
  button.addEventListener("click", () => toggleGoodDog(pup));
};

// Toggle the Good Dog/Bad Dog status
const toggleGoodDog = (pup) => {
  pup.isGoodDog = !pup.isGoodDog; // Toggle the status
  const button = document.querySelector(`button[data-id="${pup.id}"]`);
  button.textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!";

  // Update the server
  fetch(`http://localhost:3000/pups/${pup.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isGoodDog: pup.isGoodDog }),
  }).catch((error) => console.error("Error updating pup:", error));
};

// Implement filter functionality
let filterOn = false;

const filterButton = document.getElementById("filter-button");
filterButton.addEventListener("click", () => {
  filterOn = !filterOn;
  filterButton.textContent = filterOn
    ? "Filter good dogs: ON"
    : "Filter good dogs: OFF";
  fetchPups(); // Re-fetch and then filter
});

const renderDogBarWithFilter = (pups) => {
  const dogBar = document.getElementById("dog-bar");
  dogBar.innerHTML = ""; // Clear previous entries
  pups.forEach((pup) => {
    if (!filterOn || pup.isGoodDog) {
      // Apply filter
      const span = document.createElement("span");
      span.textContent = pup.name;
      span.dataset.id = pup.id;
      span.addEventListener("click", () => showDogInfo(pup));
      dogBar.appendChild(span);
    }
  });
};
