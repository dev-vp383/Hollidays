// Firebase Configuration (Ensure this matches your existing configuration)
const firebaseConfig = {
    apiKey: "AIzaSyD0Biwjk-PfEGAsm_FUwavuo_6-FpfQw8I",
    authDomain: "vacation-calendar-ad463.firebaseapp.com",
    databaseURL: "https://vacation-calendar-ad463-default-rtdb.firebaseio.com",
    projectId: "vacation-calendar-ad463",
    storageBucket: "vacation-calendar-ad463.firebasestorage.app",
    messagingSenderId: "318751055172",
    appId: "1:318751055172:web:b511b2a74e7b804f56cb11"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Populate Restricted Dates from Variable
function loadRestrictedDates() {
    const restrictedDates = [
        { start: "02-10-2025", end: "02-17-2025" },
        { start: "03-05-2025", end: "03-20-2025" },
        { start: "04-16-2025", end: "04-24-2025" },
        { start: "04-30-2025", end: "05-02-2025" },
        { start: "06-10-2025", end: "06-19-2025" },
        { start: "07-15-2025", end: "07-23-2025" },
        { start: "10-28-2025", end: "11-04-2025" },
        { start: "11-26-2025", end: "12-02-2025" },
        { start: "12-15-2025", end: "01-03-2025" }
    ];
    const restrictedDatesList = document.getElementById("restricted-dates-list");

    restrictedDates.forEach((dateRange) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${dateRange.start} to ${dateRange.end}`;
        restrictedDatesList.appendChild(listItem);
    });
}

// Fetch Approved Vacations from Firebase
async function fetchApprovedVacations() {
    try {
        const ref = database.ref("vacations");
        const snapshot = await ref.get();
        const vacations = snapshot.val() || {};

        console.log("Vacation data fetched successfully:", vacations); // Log the data

        const approvedVacationsList = document.getElementById("approved-vacations-list");
        const approvedVacations = [];

        Object.entries(vacations).forEach(([employee, info]) => {
            // Convert employee key (Achraf_T_N) to display format (Achraf T. N.)
            const formattedEmployeeName = formatEmployeeName(employee);

            console.log(`Processing employee: ${formattedEmployeeName}`, info); // Log employee details

            // Check if there is an `approved` array
            if (info.approved && Array.isArray(info.approved)) {
                console.log(`Approved vacations found for ${formattedEmployeeName}`, info.approved);

                // Loop through the `approved` array and add each entry to the list
                info.approved.forEach((dateRange) => {
                    const formattedDateRange = formatDateRange(dateRange);
                    approvedVacations.push({
                        employee: formattedEmployeeName,
                        formattedDateRange,
                        startDate: new Date(dateRange.split(" to ")[0])
                    });
                });
            } else {
                console.log(`No approved vacations found for ${formattedEmployeeName}`);
            }
        });

        // Sort approved vacations by start date
        approvedVacations.sort((a, b) => a.startDate - b.startDate);

        // Add sorted vacations to the list
        approvedVacations.forEach(({ employee, formattedDateRange }) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${employee}: ${formattedDateRange}`;
            approvedVacationsList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching approved vacations:", error); // Log any errors
    }
}

// Helper function to format employee names (Achraf_T_N -> Achraf T. N.)
function formatEmployeeName(name) {
    return name
        .split("_") // Split by underscore
        .map((part, index) => (index === 0 ? part : `${part.charAt(0).toUpperCase()}.`)) // Add initials
        .join(" "); // Join with spaces
}

// Helper function to format date ranges
function formatDateRange(dateRange) {
    const [start, end] = dateRange.split(" to ");
    const formattedStart = formatDate(start);
    const formattedEnd = formatDate(end);
    return `${formattedStart} to ${formattedEnd}`;
}

// Helper function to format a single date (YYYY-MM-DD to MM-DD-YYYY)
function formatDate(date) {
    const [year, month, day] = date.split("-");
    return `${month}-${day}-${year}`;
}

// Initialize Vacation Details
function initializeVacationDetails() {
    loadRestrictedDates(); // Load restricted dates from the variable
    fetchApprovedVacations(); // Fetch approved vacations from Firebase
}

// Load the script after DOM is ready
document.addEventListener("DOMContentLoaded", initializeVacationDetails);
