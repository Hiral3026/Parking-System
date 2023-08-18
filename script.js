//the maximum number of spots
const max_spots = 10;

// a variable to keep track of the total revenue
let totalRevenue = 0;

// an array of customer 
const customers = [
  {
    spotNo: 1,
    name: "John Smith",
    license: "ABC123",
    timeIn: "2023-04-27T12:00",
  },
  {
    spotNo: "2",
    name: "Jane Doe",
    license: "XYZ789",
    timeIn: "2023-04-27T13:30"
  },
  {
    spotNo: "3",
    name: "Bob Johnson",
    license: "DEF456",
    timeIn: "2023-04-27T14:15",
  }
];



// Get the table element
const table = document.getElementById("customer-table");

// Loop through the customers array
customers.forEach(customer => {
  // Create a new row for each customer
  const row = table.insertRow();

  // Add the customer data to the row
  row.insertCell().innerHTML = customer.spotNo;
  row.insertCell().innerHTML = customer.name;
  row.insertCell().innerHTML = customer.license;
  row.insertCell().innerHTML = customer.timeIn;

  // Update parking spots display based on customer data
  const parkingSpot = document.querySelector(`.parking-spot:nth-of-type(${customer.spotNo})`);
  if (parkingSpot) {
    parkingSpot.classList.remove("available");
    parkingSpot.classList.add("taken");
  }
});

// get references to the form and table elements
const form = document.getElementById("customer-details");
const customerTable = document.getElementById("customer-table");

// Get the form submit button
const submitButton = document.getElementById("submit-details");

//  form submit button
form.addEventListener("submit", function (event) {
  event.preventDefault(); // prevent the form from submitting normally

  // get values from form input fields
  const spotNo = document.getElementById("spotNo").value;
  const name = document.getElementById("name").value;
  const license = document.getElementById("license").value;
  const timeIn = document.getElementById("mydatetime").value;

  // Check if the selected spot is already taken
  const selectedSpot = document.querySelector(`.parking-spot:nth-of-type(${spotNo})`);
  if (selectedSpot.classList.contains("taken")) {
  document.getElementById("status").textContent = "Spot " +spotNo+ " is already taken. Please select another spot.";
  return;
  }

  // Check if all spots are occupied
  const occupiedSpots = document.querySelectorAll(".taken").length;
  if (occupiedSpots === max_spots) {
    document.getElementById("status").textContent = "All spots are taken. Please try again later.";
    return;
  }

  // create a new row in the table
  const newRow = table.insertRow();

  // add cells to the new row and populate them with the form values
  const spotNoCell = newRow.insertCell();
  spotNoCell.textContent = spotNo;

  const nameCell = newRow.insertCell();
  nameCell.textContent = name;

  const licenseCell = newRow.insertCell();
  licenseCell.textContent = license;

  const timeInCell = newRow.insertCell();
  timeInCell.textContent = timeIn;


  // Update parking spots display
  const parkingSpot = document.querySelector(`.parking-spot:nth-of-type(${spotNo})`);
  if (parkingSpot) {
    parkingSpot.classList.remove("available");
    parkingSpot.classList.add("taken");
  }

  // reset the form
  form.reset();

  // Disable the submit button if all spots are occupied
  if (occupiedSpots + 1 === max_spots) {
    submitButton.disabled = true;
    document.getElementById("status").textContent = "All parking spots are taken.";
  } else {
    submitButton.disabled = false;
    document.getElementById("status").textContent = "New car added successfully at Parking spot " +spotNo;
  }

});

function updateParkingStatus() {
  // Get all parking spots
  const parkingSpots = document.querySelectorAll(".parking-spot");

  // Loop through each spot and update its availability
  parkingSpots.forEach(spot => {

    // Get the spot number from the spot's text content
    const spotNumber = spot.textContent;

    // Find the row in the table with the corresponding spot number
    const table = document.getElementById("customer-table");
    const rows = table.getElementsByTagName("tr");
    let isOccupied = false;
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const rowSpotNumber = row.getElementsByTagName("td")[0].textContent;
      if (rowSpotNumber === spotNumber) {
        isOccupied = true;
        break;
      }
    }

    // Update the spot's class and availability
    if (isOccupied) {
      spot.classList.add("taken");
      spot.classList.remove("available");
    } else {
      spot.classList.add("available");
      spot.classList.remove("taken");
    }
  });
}

// Get the "Remove Car" button element
const removeButton = document.getElementById("remove-car");

// Remove button
removeButton.addEventListener("click", function (event) {
  event.preventDefault();

  // Gets the spot number entered by the user
  const removeSpotNumber = document.getElementById("remove-spot-No").value;

  // Get the "Time Out" value entered by the user
  const timeOutValue = document.getElementById("datetime").value;

  // Find the row in the table with the corresponding spot number
  const table = document.getElementById("customer-table");
  const rows = table.getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowSpotNumber = row.getElementsByTagName("td")[0].textContent;
    if (rowSpotNumber === removeSpotNumber) {

      // Calculate parking duration
      const timeInCell = row.querySelector("td:nth-child(4)");
      const checkInTime = new Date(timeInCell.textContent).getTime();
      const checkOutTime = new Date(timeOutValue).getTime();
      const duration = calculateDuration(checkInTime, checkOutTime);

      // Calculate parking cost
      const cost = calculateCost(duration);

      // Remove the row from the table
      row.parentNode.removeChild(row);

      document.getElementById("status").textContent = "Car has been removed from parking spot " + removeSpotNumber + ".";

      // Store parking cost
      document.getElementById("total").textContent = "Total Parking Fee: $" + cost;

      // Add the cost to the total revenue
      totalRevenue += parseFloat(cost);

      break;
    }
  }

  // Reset the form inputs
  document.getElementById("remove-spot-No").value = "";
  document.getElementById("datetime").value = "";

  // Update the parking spot status
  updateParkingStatus();

  // Enable the submit button
  submitButton.disabled = false;
});

// Calculate parking duration
function calculateDuration(checkInTime, checkOutTime) {
  const duration = Math.round((checkOutTime - checkInTime) / (1000 * 60));
  return duration;
}

// Calculate parking cost
function calculateCost(duration) {
  const costPerMinute = 0.1;
  const cost = (duration * costPerMinute).toFixed(2);
  return cost;
}

// "Show Revenue" button
const revenueButton = document.getElementById("total-revenue");
revenueButton.addEventListener("click", function (event) {
  event.preventDefault();

  // Store parking cost
  document.getElementById("revenue").textContent = "Total Revenue of the day: $" + totalRevenue.toFixed(2);
});
