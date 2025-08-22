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

// Populate Restricted Dates from Global Variable (shared with restricted-dates.js)
function loadRestrictedDates() {
    if (typeof window.vacationNotAllowedRanges === "undefined") {
        console.error("Vacation not allowed ranges not loaded");
        return;
    }
    
    const restrictedDatesList = document.getElementById("restricted-dates-list");
    const currentYear = window.currentYear || 2025;
    
    // Filter restricted dates by current year
    const yearFilteredRanges = window.vacationNotAllowedRanges.filter((dateRange) => {
        const startYear = new Date(dateRange.start).getFullYear();
        return startYear === currentYear;
    });
    
    yearFilteredRanges.forEach((dateRange) => {
        const listItem = document.createElement("li");
        // Convert date format from YYYY-MM-DD to DD-MM-YYYY for display
        const startDate = new Date(dateRange.start).toLocaleDateString("en-GB");
        const endDate = new Date(dateRange.end).toLocaleDateString("en-GB");
        listItem.textContent = `${startDate} to ${endDate}`;
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

        // Filter by current year
        const currentYear = window.currentYear || 2025;
        const yearFilteredData = {};
        
        Object.entries(vacations).forEach(([employee, info]) => {
            // Only include vacations that have year field matching current year, or no year field (legacy 2025 data)
            if (!info.year || info.year === currentYear) {
                yearFilteredData[employee] = info;
            }
        });

        Object.entries(yearFilteredData).forEach(([employee, info]) => {
            // Convert employee key (Achraf_T_N) to display format (Achraf T. N.)
            const formattedEmployeeName = formatEmployeeName(employee);

            console.log(`Processing employee: ${formattedEmployeeName}`, info); // Log employee details

            // Check if there is an `approved` array
            if (info.approved && Array.isArray(info.approved)) {
                console.log(`Approved vacations found for ${formattedEmployeeName}`, info.approved);

                // Merge consecutive approved ranges
                const mergedApprovedRanges = mergeConsecutiveRanges(info.approved);
                console.log(`Merged approved ranges for ${formattedEmployeeName}:`, mergedApprovedRanges);

                // Loop through the merged ranges and add each entry to the list
                mergedApprovedRanges.forEach((dateRange) => {
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

// Helper: Merge consecutive date ranges
function mergeConsecutiveRanges(ranges) {
    if (!ranges || ranges.length === 0) return [];
    
    // Convert ranges to date objects for easier comparison
    const rangeObjects = ranges.map(range => {
        const [start, end] = range.split(" to ");
        return {
            start: new Date(start),
            end: new Date(end),
            original: range
        };
    });
    
    // Sort by start date
    rangeObjects.sort((a, b) => a.start - b.start);
    
    const merged = [];
    let current = rangeObjects[0];
    
    for (let i = 1; i < rangeObjects.length; i++) {
        const next = rangeObjects[i];
        
        // Check if current range ends the day before next range starts (consecutive)
        const currentEndPlusOne = new Date(current.end);
        currentEndPlusOne.setDate(currentEndPlusOne.getDate() + 1);
        
        if (currentEndPlusOne.getTime() === next.start.getTime()) {
            // Merge the ranges
            current.end = next.end;
        } else {
            // No consecutive, add current to merged and move to next
            merged.push(current);
            current = next;
        }
    }
    
    // Add the last range
    merged.push(current);
    
    // Convert back to string format
    return merged.map(range => {
        const startStr = range.start.toISOString().split('T')[0];
        const endStr = range.end.toISOString().split('T')[0];
        return `${startStr} to ${endStr}`;
    });
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

// Make functions globally available for year switching
window.loadRestrictedDates = loadRestrictedDates;
window.fetchApprovedVacations = fetchApprovedVacations;
window.initializeVacationDetails = initializeVacationDetails;

// Load the script after DOM is ready
document.addEventListener("DOMContentLoaded", initializeVacationDetails);
