// Firebase Configuration
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

// Department Colors
const departmentColors = {
    technical: { reserved: "#FFCC00", approved: "#0000FF" },
    analytics: { reserved: "#FFCC00", approved: "#0000FF" },
    vip: { reserved: "#FFCC00", approved: "#00FF00" }
};

// Track Selected Dates
let selectedDates = [];

// Helper: Get Dates in a Range
function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        dates.push(currentDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

const employees = {
    technical: [
        { name: "Aleksandrs Potreba", value: "Aleksandrs Potreba|technical" },
        { name: "Jūlija Baluta", value: "Jūlija Baluta|technical" },
        { name: "Anastasija Vinogradova", value: "Anastasija Vinogradova|technical" }
    ],
    analytics: [
        { name: "Ruslans Pirimovs", value: "Ruslans Pirimovs|analytics" },
        { name: "Jelizaveta Migunova", value: "Jelizaveta Migunova|analytics" },
        { name: "Daniels Pušķis", value: "Daniels Pušķis|analytics" }
    ],
    vip: [
        { name: "Aleksandrs Potreba", value: "Aleksandrs Potreba|vip" },
        { name: "Anastasija Kirkiča", value: "Anastasija Kirkiča|vip" },
		{ name: "Gatis J.", value: "Gatis Janauskis|vip" },
        { name: "Ivo Jegorovs", value: "Ivo Jegorovs|vip" },
		{ "name": "Jevgenijs Bondarenko", "value": "Jevgenijs Bondarenko|vip" },
        { name: "Jūlija Jurčenko", value: "Jūlija Jurčenko|vip" },
        { name: "Jurijs Kuļikovs", value: "Jurijs Kuļikovs|vip" },
        { name: "Krystsina Liber", value: "Krystsina Liber|vip" },
        { name: "Kyada Hirenkumar Himmatbhai", value: "Kyada Hirenkumar Himmatbhai|vip" },
        { name: "Laura Pāvulāne", value: "Laura Pāvulāne|vip" },
        { name: "Mari Otagiri", value: "Mari Otagiri|vip" },
        { name: "Monyque Alves Vieira", value: "Monyque Alves Vieira|vip" },
        { name: "Nadezhda Berneva", value: "Nadezhda Berneva|vip" },
        { name: "Nataļja Triputina", value: "Nataļja Triputina|vip" },
        { name: "Nikolajs Pavickis", value: "Nikolajs Pavickis|vip" },
        { name: "Olga Dudareva", value: "Olga Dudareva|vip" },
        { name: "Olga Violeta Šerstņova", value: "Olga Violeta Šerstņova|vip" },
        { name: "Tatjana Tukuma", value: "Tatjana Tukuma|vip" },
        { name: "Thaisa Xavier", value: "Thaisa Xavier|vip" },
        { name: "Achraf Tobal Nafae", value: "Achraf Tobal Nafae|vip" },
        { name: "Edgars Seleznevs", value: "Edgars Seleznevs|vip" },
        { name: "Dēvids Balodis", value: "Dēvids Balodis|vip" },
        { name: "Laura Santana Saenz", value: "Laura Santana Saenz|vip" },
        { name: "Aleksandrs Tkačenko", value: "Aleksandrs Tkačenko|vip" },
        { name: "Vjaceslavs Volodins", value: "Vjaceslavs Volodins|vip" }
    ],
    other: [
        { name: "Aliaksandryna Ivanova", value: "Aliaksandryna Ivanova|other" },
        { name: "Vladislavs", value: "Vladislavs|other" },
        { name: "Aliaksandr Liber", value: "Aliaksandr Liber|other" },
        { name: "Eduards Popovskis", value: "Eduards Popovskis|other" }
    ]
};

function populateEmployeeDropdown() {
    const employeeSelect = document.getElementById("employee-select");
    employeeSelect.innerHTML = ""; // Clear existing options

    Object.entries(employees).forEach(([department, members]) => {
        const group = document.createElement("optgroup");
        group.label = department.charAt(0).toUpperCase() + department.slice(1); // Capitalize department name

        members.forEach(({ name, value }) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = name;
            group.appendChild(option);
        });

        employeeSelect.appendChild(group);
    });
}


// Generate Calendar
function generateCalendar(year) {
    const calendarContainer = document.getElementById("calendar");
    if (!calendarContainer) {
        console.error("Calendar container not found!");
        return;
    }

    calendarContainer.innerHTML = "";

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let month = 0; month < 12; month++) {
        const monthContainer = document.createElement("div");
        monthContainer.classList.add("month-container");

        const monthHeader = document.createElement("h2");
        monthHeader.textContent = months[month];
        monthContainer.appendChild(monthHeader);

        const weekdaysRow = document.createElement("div");
        weekdaysRow.classList.add("weekdays-container");
        weekdays.forEach(day => {
            const dayCell = document.createElement("div");
            dayCell.textContent = day;
            dayCell.classList.add("weekday-cell");
            weekdaysRow.appendChild(dayCell);
        });
        monthContainer.appendChild(weekdaysRow);

        const daysContainer = document.createElement("div");
        daysContainer.classList.add("days-container");

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            const blankCell = document.createElement("span");
            blankCell.classList.add("day-cell", "blank");
            daysContainer.appendChild(blankCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement("span");
            dayCell.textContent = day;
            dayCell.dataset.date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            dayCell.classList.add("day-cell");

            dayCell.addEventListener("click", () => {
                const date = dayCell.dataset.date;
                if (selectedDates.includes(date)) {
                    selectedDates = selectedDates.filter(d => d !== date);
                    dayCell.style.backgroundColor = "";
                } else {
                    selectedDates.push(date);
                    dayCell.style.backgroundColor = "rgba(255, 204, 0, 0.5)";
                }
                console.log("Selected Dates:", selectedDates);
            });

            const dotIndicator = document.createElement("div");
            dotIndicator.classList.add("dot-indicator");
            dotIndicator.style.display = "none";
            dayCell.appendChild(dotIndicator);
            daysContainer.appendChild(dayCell);
        }

        monthContainer.appendChild(daysContainer);
        calendarContainer.appendChild(monthContainer);
    }
    console.log("Calendar generated successfully!");
}

// Load Vacations and Update UI
async function loadReservedVacations() {
    try {
        const ref = database.ref("vacations");
        const snapshot = await ref.get();
        const vacationData = snapshot.val() || {};

        const reservedList = document.getElementById("reserved-vacations-list");
        const approveDropdown = document.getElementById("approve-dropdown");
        const approvedList = document.getElementById("approved-vacations-list");
        const approvedDropdown = document.getElementById("delete-approved-dropdown");

        reservedList.innerHTML = "";
        approveDropdown.innerHTML = '<option value="" disabled selected>Select a Reserved Vacation</option>';
        approvedDropdown.innerHTML = '<option value="" disabled selected>Select an Approved Vacation</option>';
        approvedList.innerHTML = "";

        const vacationMap = {};

        Object.entries(vacationData).forEach(([employee, info]) => {
            const employeeName = employee.split("_").join(" ");
            const department = info.department || "other";

            if (info.dates) {
                info.dates.forEach(range => {
                    const [startDate, endDate] = range.split(" to ") || [range, range];
                    const dates = getDatesInRange(startDate, endDate);
                    dates.forEach(date => {
                        if (!vacationMap[date]) vacationMap[date] = [];
                        vacationMap[date].push({ employee: employeeName, status: "reserved", department });
                    });

                    const listItem = document.createElement("li");
                    listItem.textContent = `${employeeName} - ${range}`;
                    reservedList.appendChild(listItem);

                    const option = document.createElement("option");
                    option.value = `${employee}|${range}`;
                    option.textContent = `${employeeName} - ${range}`;
                    approveDropdown.appendChild(option);
                });
            }

            if (info.approved) {
                info.approved.forEach(range => {
                    const [startDate, endDate] = range.split(" to ") || [range, range];
                    const dates = getDatesInRange(startDate, endDate);
                    dates.forEach(date => {
                        if (!vacationMap[date]) vacationMap[date] = [];
                        vacationMap[date].push({ employee: employeeName, status: "approved", department });
                    });

                    const listItem = document.createElement("li");
                    listItem.textContent = `${employeeName} - ${range}`;
                    approvedList.appendChild(listItem);

                    const option = document.createElement("option");
                    option.value = `${employee}|${range}`;
                    option.textContent = `${employeeName} - ${range}`;
                    approvedDropdown.appendChild(option);
                });
            }
        });

        updateCalendar(vacationMap);

        console.log("Reserved and Approved Vacations loaded successfully.");
    } catch (error) {
        console.error("Error loading vacations:", error);
    }
}

// Update Calendar with Vacations
// Update Calendar with Vacations
function updateCalendar(vacationMap) {
    const dayCells = document.querySelectorAll(".day-cell");

    dayCells.forEach(dayCell => {
        const date = dayCell.dataset.date;

        if (vacationMap[date]) {
            const tooltipContent = vacationMap[date]
                .map(v => `${v.employee} (${v.status})`)
                .join("\n");
            dayCell.setAttribute("data-tooltip", tooltipContent);

            const departmentStatuses = vacationMap[date].map(v => ({
                department: v.department,
                status: v.status
            }));

            // Apply background colors or gradients
            if (departmentStatuses.length === 1) {
                const { department, status } = departmentStatuses[0];
                dayCell.style.backgroundColor = departmentColors[department]?.[status] || "#CB04A5";
            } else {
                const gradientColors = departmentStatuses
                    .map(({ department, status }) => departmentColors[department]?.[status] || "#CB04A5")
                    .join(", ");
                dayCell.style.background = `linear-gradient(to bottom right, ${gradientColors})`;
            }

            // Red Dot Indicator for Overlaps
            const departmentCounts = {
                analytics: 0,
                technical: 0,
                vip: 0
            };

            // Count bookings per department
            vacationMap[date].forEach((vacation) => {
                departmentCounts[vacation.department] += 1;
            });

            // Red Dot Conditions
            const analyticsOrTechnical = departmentCounts.analytics + departmentCounts.technical;
            const vip = departmentCounts.vip;

            const redDotNeeded =
                departmentCounts.analytics > 1 || // More than 1 analytics
                departmentCounts.technical > 1 || // More than 1 technical
                vip > 1 || // More than 1 VIP
                analyticsOrTechnical > 1; // At least 1 analytics or technical AND another booking

            const dotIndicator = dayCell.querySelector(".dot-indicator");
            if (redDotNeeded) {
                if (dotIndicator) {
                    dotIndicator.style.display = "block";
                    dotIndicator.style.backgroundColor = "red";
                }
            } else if (dotIndicator) {
                dotIndicator.style.display = "none"; // Remove the red dot if conditions are not met
            }
        }
    });
}


// Approve Vacation
document.getElementById("approve-button").addEventListener("click", async () => {
    const selectedOption = document.getElementById("approve-dropdown").value;
    if (!selectedOption) {
        alert("Please select a vacation to approve.");
        return;
    }

    const [employee, range] = selectedOption.split("|");

    try {
        const ref = database.ref(`vacations/${employee}`);
        const snapshot = await ref.get();

        if (snapshot.exists()) {
            const vacationData = snapshot.val();
            vacationData.dates = vacationData.dates.filter(d => d !== range);
            if (!vacationData.approved) vacationData.approved = [];
            vacationData.approved.push(range);

            await ref.set(vacationData);
            alert(`Vacation ${range} approved successfully!`);
            await loadReservedVacations();
        }
    } catch (error) {
        console.error("Error approving vacation:", error);
    }
});

// Delete Vacation
document.getElementById("delete-button").addEventListener("click", async () => {
    const reservedOption = document.getElementById("approve-dropdown").value;
    const approvedOption = document.getElementById("delete-approved-dropdown").value;

    const selectedOption = reservedOption || approvedOption;
    const type = reservedOption ? "reserved" : "approved";

    if (!selectedOption) {
        alert("Please select a vacation to delete.");
        return;
    }

    const [employee, range] = selectedOption.split("|");

    try {
        const ref = database.ref(`vacations/${employee}`);
        const snapshot = await ref.get();

        if (snapshot.exists()) {
            const vacationData = snapshot.val();
            if (type === "reserved") vacationData.dates = vacationData.dates.filter(d => d !== range);
            else vacationData.approved = vacationData.approved.filter(d => d !== range);

            if (!vacationData.dates.length && !vacationData.approved.length) await ref.remove();
            else await ref.set(vacationData);

            alert(`Vacation ${range} deleted successfully!`);
            await loadReservedVacations();
        }
    } catch (error) {
        console.error("Error deleting vacation:", error);
    }
});

// Initialize App
async function initialize() {
    generateCalendar(2025); // Generate calendar
    await loadReservedVacations(); // Load vacations from Firebase
	populateEmployeeDropdown();
  
}

initialize();

document.getElementById("add-vacation").addEventListener("click", async () => {
    const employeeValue = document.getElementById("employee-select").value;

    if (!employeeValue) {
        alert("Please select an employee.");
        return;
    }

    if (!selectedDates.length) {
        alert("Please select at least one date.");
        return;
    }

    const [employee, department] = employeeValue.split("|");
    selectedDates.sort((a, b) => new Date(a) - new Date(b));
    const startDate = selectedDates[0];
    const endDate = selectedDates[selectedDates.length - 1];
    const dateRange = startDate === endDate ? startDate : `${startDate} to ${endDate}`;

    try {
        const ref = database.ref(`vacations/${employee}`);
        const snapshot = await ref.get();

        let vacationData = snapshot.val() || { dates: [], approved: [], department, status: "reserved" };

        // Ensure dates is an array
        if (!Array.isArray(vacationData.dates)) vacationData.dates = [];

        // Add new date range
        vacationData.dates.push(dateRange);

        await ref.set(vacationData);

        alert(`Vacation ${dateRange} added successfully!`);
        selectedDates = [];
        await loadReservedVacations(); // Refresh lists and calendar
    } catch (error) {
        console.error("Error adding vacation:", error);
        alert("Failed to add vacation.");
    }
});

document.getElementById("delete-button").addEventListener("click", async () => {
    const reservedOption = document.getElementById("approve-dropdown").value;
    const approvedOption = document.getElementById("delete-approved-dropdown").value;

    const selectedOption = reservedOption || approvedOption;
    const type = reservedOption ? "reserved" : "approved";

    if (!selectedOption) {
        alert("Please select a vacation to delete.");
        return;
    }

    const [employee, range] = selectedOption.split("|");

    try {
        const ref = database.ref(`vacations/${employee}`);
        const snapshot = await ref.get();

        if (snapshot.exists()) {
            const vacationData = snapshot.val();

            // Ensure dates and approved arrays exist
            vacationData.dates = vacationData.dates || [];
            vacationData.approved = vacationData.approved || [];

            if (type === "reserved") {
                // Remove the range from reserved dates
                vacationData.dates = vacationData.dates.filter(d => d !== range);
            } else {
                // Remove the range from approved dates
                vacationData.approved = vacationData.approved.filter(d => d !== range);
            }

            if (!vacationData.dates.length && !vacationData.approved.length) {
                // If both arrays are empty, remove the entire record
                await ref.remove();
            } else {
                // Otherwise, update the record
                await ref.set(vacationData);
            }

            alert(`Vacation ${range} deleted successfully!`);
            await loadReservedVacations(); // Refresh lists and calendar
        } else {
            console.error("No data found for the selected employee.");
            alert("Failed to find the selected vacation.");
        }
    } catch (error) {
        console.error("Error deleting vacation:", error);
        alert("Failed to delete vacation.");
    }
});

// Load Employee Data and Populate Dropdown
