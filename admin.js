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

// Department Colors (matching vacations folder)
const departmentColors = {
    technical: { reserved: "#E49B0F", approved: "#6699CC" },
    analytics: { reserved: "#E49B0F", approved: "#6699CC" },
    vip: { reserved: "#E49B0F", approved: "#32CD32" }
};

// Track Selected Dates
let selectedDates = [];
let currentYear = 2025;

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

const employees = {
    technical: [
        { name: "Aleksandrs Potreba", value: "Aleksandrs Potreba|technical" },
        { name: "Jūlija Baluta", value: "Jūlija Baluta|technical" },
        { name: "Anastasija Vinogradova", value: "Anastasija Vinogradova|technical" },
        { name: "Daniels Pušķis", value: "Daniels Pušķis|technical" }
    ],
    analytics: [
        { name: "Ruslans Pirimovs", value: "Ruslans Pirimovs|analytics" },
        { name: "Jelizaveta Migunova", value: "Jelizaveta Migunova|analytics" }
    ],
    vip: [
        { name: "Aleksandrs Potreba", value: "Aleksandrs Potreba|vip" },
        { name: "Anastasija Kirkiča", value: "Anastasija Kirkiča|vip" },
		{ name: "Gatis J.", value: "Gatis Janauskis|vip" },
        { name: "Ivo Jegorovs", value: "Ivo Jegorovs|vip" },
		{ "name": "Jevgenijs Bondarenko", "value": "Jevgenijs Bondarenko|vip" },
        { name: "Jūlija Jurčenko", value: "Jūlija Jurčenko|vip" },
        { name: "Jurijs Kuļikovs", value: "Jurijs Kuļikovs|vip" },
        { name: "Kyada Hirenkumar Himmatbhai", value: "Kyada Hirenkumar Himmatbhai|vip" },
        { name: "Laura Pāvulāne", value: "Laura Pāvulāne|vip" },
        { name: "Monyque Alves Vieira", value: "Monyque Alves Vieira|vip" },
        { name: "Nadezhda Berneva", value: "Nadezhda Berneva|vip" },
        { name: "Nataļja Triputina", value: "Nataļja Triputina|vip" },
        { name: "Nikolajs Pavickis", value: "Nikolajs Pavickis|vip" },
        { name: "Olga Dudareva", value: "Olga Dudareva|vip" },
        { name: "Olga Violeta Šerstņova", value: "Olga Violeta Šerstņova|vip" },
        { name: "Tatjana Tukuma", value: "Tatjana Tukuma|vip" },
        { name: "Achraf Tobal Nafae", value: "Achraf Tobal Nafae|vip" },

        { name: "Dēvids Balodis", value: "Dēvids Balodis|vip" },
        { name: "Laura Santana Saenz", value: "Laura Santana Saenz|vip" },
        { name: "Aleksandrs Tkačenko", value: "Aleksandrs Tkačenko|vip" },
        { name: "Vjaceslavs Volodins", value: "Vjaceslavs Volodins|vip" },
        { name: "Jekaterina Chistakova", value: "Jekaterina Chistakova|vip" },
        { name: "Elīna Tretjaka", value: "Elīna Tretjaka|vip" },
        { name: "Andrejs Kots", value: "Andrejs Kots|vip" },
        { name: "Kirills Kļesarevs", value: "Kirills Kļesarevs|vip" },
        { name: "Sanita Bite", value: "Sanita Bite|vip" },
        { name: "Vladislavs Rubcovs", value: "Vladislavs Rubcovs|vip" },
        { name: "Aleksejs Bugrišovs", value: "Aleksejs Bugrišovs|vip" },
        { name: "Kezia Raichel James", value: "Kezia Raichel James|vip" }
    ],
    other: [
        { name: "Aliaksandryna Ivanova", value: "Aliaksandryna Ivanova|other" },
        { name: "Vladislavs", value: "Vladislavs|other" },
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
        
        // Filter vacations by current year
        const yearFilteredData = {};
        Object.entries(vacationData).forEach(([employee, info]) => {
            // Only include vacations that have year field matching current year, or no year field (legacy 2025 data)
            if (!info.year || info.year === currentYear) {
                yearFilteredData[employee] = info;
            }
        });

        const reservedList = document.getElementById("reserved-vacations-list");
        const approveDropdown = document.getElementById("approve-dropdown");
        const approvedList = document.getElementById("approved-vacations-list");
        const approvedDropdown = document.getElementById("delete-approved-dropdown");

        reservedList.innerHTML = "";
        approveDropdown.innerHTML = '<option value="" disabled selected>Select a Reserved Vacation</option>';
        approvedDropdown.innerHTML = '<option value="" disabled selected>Select an Approved Vacation</option>';
        approvedList.innerHTML = "";

        const vacationMap = {};

        Object.entries(yearFilteredData).forEach(([employee, info]) => {
            const employeeName = employee.split("_").join(" ");
            const department = info.department || "other";

            if (info.dates) {
                // Merge consecutive reserved ranges
                const mergedReservedRanges = mergeConsecutiveRanges(info.dates);
                
                mergedReservedRanges.forEach(range => {
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
                // Merge consecutive approved ranges
                const mergedApprovedRanges = mergeConsecutiveRanges(info.approved);
                
                mergedApprovedRanges.forEach(range => {
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

// Update Calendar with Vacations (matching vacations folder logic)
function updateCalendar(vacationMap) {
    const dayCells = document.querySelectorAll(".day-cell");

    dayCells.forEach(dayCell => {
        const date = dayCell.dataset.date;
        if (!date) return;

        // Check if this date has vacation data
        const hasVacationData = vacationMap[date];
        const isRestrictedDate = window.restrictedDates && window.restrictedDates.includes(date);

        if (!hasVacationData && !isRestrictedDate) return;

        // Remove any existing corner elements
        const existingCorners = dayCell.querySelectorAll(".corner-triangle");
        existingCorners.forEach((corner) => corner.remove());

        if (hasVacationData) {
            // Create tooltip content
            const tooltipContent = vacationMap[date]
                .map(v => `${v.employee} (${v.status})`)
                .join("\n");
            dayCell.setAttribute("data-tooltip", tooltipContent);

            // Handle vacation colors with corner triangles
            const departmentStatuses = vacationMap[date].map(v => ({
                department: v.department,
                status: v.status
            }));

            // Apply the base color (first department)
            const firstStatus = departmentStatuses[0];
            dayCell.style.backgroundColor = departmentColors[firstStatus.department]?.[firstStatus.status] || "#CB04A5";

            // Add corner triangles for additional departments
            if (departmentStatuses.length > 1) {
                if (departmentStatuses[1]) {
                    const topLeftTriangle = document.createElement("div");
                    topLeftTriangle.classList.add("corner-triangle");
                    topLeftTriangle.style.backgroundColor = departmentColors[departmentStatuses[1].department]?.[departmentStatuses[1].status] || "#CB04A5";
                    topLeftTriangle.style.clipPath = "polygon(0 0, 100% 0, 0 100%)"; // Top-left triangle
                    topLeftTriangle.style.position = "absolute";
                    topLeftTriangle.style.top = "0";
                    topLeftTriangle.style.left = "0";
                    topLeftTriangle.style.width = "50%";
                    topLeftTriangle.style.height = "50%";
                    dayCell.appendChild(topLeftTriangle);
                }
                if (departmentStatuses[2]) {
                    const topRightTriangle = document.createElement("div");
                    topRightTriangle.classList.add("corner-triangle");
                    topRightTriangle.style.backgroundColor = departmentColors[departmentStatuses[2].department]?.[departmentStatuses[2].status] || "#CB04A5";
                    topRightTriangle.style.clipPath = "polygon(100% 0, 100% 100%, 0 0)"; // Top-right triangle
                    topRightTriangle.style.position = "absolute";
                    topRightTriangle.style.top = "0";
                    topRightTriangle.style.right = "0";
                    topRightTriangle.style.width = "50%";
                    topRightTriangle.style.height = "50%";
                    dayCell.appendChild(topRightTriangle);
                }
            }

            // If this is also a restricted date, add restricted color as a corner triangle
            if (isRestrictedDate) {
                const restrictedTriangle = document.createElement("div");
                restrictedTriangle.classList.add("corner-triangle");
                restrictedTriangle.style.backgroundColor = "#e69500"; // Restricted date color
                restrictedTriangle.style.clipPath = "polygon(100% 0, 100% 100%, 0 100%)"; // Bottom-right triangle
                restrictedTriangle.style.position = "absolute";
                restrictedTriangle.style.bottom = "0";
                restrictedTriangle.style.right = "0";
                restrictedTriangle.style.width = "50%";
                restrictedTriangle.style.height = "50%";
                dayCell.appendChild(restrictedTriangle);
            }
        } else if (isRestrictedDate) {
            // Only restricted date, no vacation - fill the whole cell
            dayCell.style.backgroundColor = "#e69500";
            dayCell.setAttribute("data-tooltip", "VACATION NOT ALLOWED");
        }

        // Red Dot Logic
        const departmentCounts = { analytics: 0, technical: 0, vip: 0 };
        vacationMap[date]?.forEach(({ department }) => {
            departmentCounts[department] += 1;
        });

        const analyticsOrTechnical = departmentCounts.analytics + departmentCounts.technical;
        const vip = departmentCounts.vip;

        const redDotNeeded =
            departmentCounts.analytics > 1 ||
            departmentCounts.technical > 1 ||
            vip > 1 ||
            analyticsOrTechnical > 1;

        let dotIndicator = dayCell.querySelector(".dot-indicator");
        if (!dotIndicator) {
            dotIndicator = document.createElement("div");
            dotIndicator.classList.add("dot-indicator");
            dayCell.appendChild(dotIndicator);
        }

        dotIndicator.style.display = redDotNeeded ? "block" : "none";
    });
}




// Initialize App
async function initialize() {
    generateCalendar(currentYear); // Generate calendar
    await loadReservedVacations(); // Load vacations from Firebase
    populateEmployeeDropdown();
    setupYearSelector();
    setupTooltips(); // Setup tooltip functionality
    setupEventListeners(); // Setup all event listeners
}

// Setup Event Listeners
function setupEventListeners() {
    console.log("Setting up event listeners...");
    
    // Check if buttons exist
    const deleteApprovedButton = document.getElementById("delete-approved-button");
    const forceReserveButton = document.getElementById("force-reserve-button");
    const deleteApprovedDropdown = document.getElementById("delete-approved-dropdown");
    
    console.log("Delete Approved Button found:", !!deleteApprovedButton);
    console.log("Force Reserve Button found:", !!forceReserveButton);
    console.log("Delete Approved Dropdown found:", !!deleteApprovedDropdown);
    // Add Vacation Button
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

            let vacationData = snapshot.val() || { dates: [], approved: [], department, status: "reserved", year: currentYear };

            // Ensure dates is an array
            if (!Array.isArray(vacationData.dates)) vacationData.dates = [];

            // Add new date range
            vacationData.dates.push(dateRange);
            
            // Ensure year field is set
            vacationData.year = currentYear;

            await ref.set(vacationData);

            alert(`Vacation ${dateRange} added successfully!`);
            selectedDates = [];
            await loadReservedVacations(); // Refresh lists and calendar
        } catch (error) {
            console.error("Error adding vacation:", error);
            alert("Failed to add vacation.");
        }
    });

    // Approve Vacation Button
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
                
                // Preserve year field
                if (!vacationData.year) vacationData.year = currentYear;

                await ref.set(vacationData);
                alert(`Vacation ${range} approved successfully!`);
                await loadReservedVacations();
            }
        } catch (error) {
            console.error("Error approving vacation:", error);
        }
    });

    // Delete Vacation Button
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

                // Ensure both arrays exist before checking length
                const datesLength = vacationData.dates ? vacationData.dates.length : 0;
                const approvedLength = vacationData.approved ? vacationData.approved.length : 0;

                if (datesLength === 0 && approvedLength === 0) await ref.remove();
                else await ref.set(vacationData);

                alert(`Vacation ${range} deleted successfully!`);
                await loadReservedVacations();
            }
        } catch (error) {
            console.error("Error deleting vacation:", error);
        }
    });

    // Delete Approved Vacation Button
    document.getElementById("delete-approved-button").addEventListener("click", async () => {
        console.log("Delete Approved button clicked");
        const selectedOption = document.getElementById("delete-approved-dropdown").value;
        console.log("Selected option:", selectedOption);
        if (!selectedOption) {
            alert("Please select an approved vacation to delete.");
            return;
        }

        const [employee, range] = selectedOption.split("|");
        console.log("Employee:", employee, "Range:", range);

        try {
            const ref = database.ref(`vacations/${employee}`);
            const snapshot = await ref.get();

            if (snapshot.exists()) {
                const vacationData = snapshot.val();
                console.log("Current vacation data:", vacationData);
                vacationData.approved = vacationData.approved.filter(d => d !== range);
                console.log("Updated vacation data:", vacationData);

                // Ensure both arrays exist before checking length
                const datesLength = vacationData.dates ? vacationData.dates.length : 0;
                const approvedLength = vacationData.approved ? vacationData.approved.length : 0;

                if (datesLength === 0 && approvedLength === 0) await ref.remove();
                else await ref.set(vacationData);

                alert(`Approved vacation ${range} deleted successfully!`);
                await loadReservedVacations();
            }
        } catch (error) {
            console.error("Error deleting approved vacation:", error);
        }
    });

    // Force Reserve Button
    document.getElementById("force-reserve-button").addEventListener("click", async () => {
        console.log("Force Reserve button clicked");
        const selectedOption = document.getElementById("delete-approved-dropdown").value;
        console.log("Selected option:", selectedOption);
        if (!selectedOption) {
            alert("Please select an approved vacation to force reserve.");
            return;
        }

        const [employee, range] = selectedOption.split("|");
        console.log("Employee:", employee, "Range:", range);

        try {
            const ref = database.ref(`vacations/${employee}`);
            const snapshot = await ref.get();

            if (snapshot.exists()) {
                const vacationData = snapshot.val();
                console.log("Current vacation data:", vacationData);
                // Move from approved to reserved
                vacationData.approved = vacationData.approved.filter(d => d !== range);
                if (!vacationData.dates) vacationData.dates = [];
                vacationData.dates.push(range);
                console.log("Updated vacation data:", vacationData);

                await ref.set(vacationData);
                alert(`Vacation ${range} moved from approved to reserved successfully!`);
                await loadReservedVacations();
            }
        } catch (error) {
            console.error("Error force reserving vacation:", error);
        }
    });
}

// Setup Tooltip Functionality (matching vacations folder)
function setupTooltips() {
    // Tooltip Initialization and Event Handlers
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);

    document.addEventListener("mouseover", (event) => {
        if (event.target.classList.contains("day-cell") && event.target.hasAttribute("data-tooltip")) {
            const tooltipText = event.target.getAttribute("data-tooltip");
            tooltip.textContent = tooltipText;

            // Get mouse position
            const mouseX = event.pageX;
            const mouseY = event.pageY;

            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Get tooltip dimensions
            tooltip.style.opacity = 1; // Make tooltip visible to calculate dimensions
            const tooltipRect = tooltip.getBoundingClientRect();

            // Calculate tooltip position
            let tooltipX = mouseX + 10; // Offset from mouse
            let tooltipY = mouseY + 10;

            // Adjust position if tooltip goes off screen
            if (tooltipX + tooltipRect.width > viewportWidth) {
                tooltipX = mouseX - tooltipRect.width - 10; // Move to the left of the cursor
            }
            if (tooltipY + tooltipRect.height > viewportHeight) {
                tooltipY = mouseY - tooltipRect.height - 10; // Move above the cursor
            }

            // Apply position
            tooltip.style.left = `${tooltipX}px`;
            tooltip.style.top = `${tooltipY}px`;
        }
    });

    document.addEventListener("mousemove", (event) => {
        if (tooltip.style.opacity === "1") {
            const mouseX = event.pageX;
            const mouseY = event.pageY;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const tooltipRect = tooltip.getBoundingClientRect();

            let tooltipX = mouseX + 10;
            let tooltipY = mouseY + 10;

            if (tooltipX + tooltipRect.width > viewportWidth) {
                tooltipX = mouseX - tooltipRect.width - 10;
            }
            if (tooltipY + tooltipRect.height > viewportHeight) {
                tooltipY = mouseY - tooltipRect.height - 10;
            }

            tooltip.style.left = `${tooltipX}px`;
            tooltip.style.top = `${tooltipY}px`;
        }
    });

    document.addEventListener("mouseout", (event) => {
        if (event.target.classList.contains("day-cell") && event.target.hasAttribute("data-tooltip")) {
            tooltip.style.opacity = 0;
        }
    });
}

// Setup Year Selector
function setupYearSelector() {
    const yearTabs = document.querySelectorAll('.year-tab');
    
    yearTabs.forEach(tab => {
        tab.addEventListener('click', async () => {
            // Remove active class from all tabs
            yearTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Update current year
            currentYear = parseInt(tab.dataset.year);
            window.currentYear = currentYear; // Set global variable for highlighting functions
            
            // Clear selected dates
            selectedDates = [];
            
            // Regenerate calendar for new year
            generateCalendar(currentYear);
            
            // Reload vacations for new year
            await loadReservedVacations();
        });
    });
}

initialize();
