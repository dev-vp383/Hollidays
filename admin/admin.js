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
let database;
try {
firebase.initializeApp(firebaseConfig);
    database = firebase.database();
} catch (error) {
    console.error("Firebase initialization failed:", error);
    database = null;
}

// Make database available globally
window.database = database;

// Department Colors (matching vacations folder)
const departmentColors = {
    technical: { reserved: "#E49B0F", approved: "#6699CC" },
    analytics: { reserved: "#E49B0F", approved: "#6699CC" },
    vip: { reserved: "#E49B0F", approved: "#32CD32" }
};

// Track Selected Dates
let selectedDates = [];
// Use window.currentYear to avoid conflicts with other files
window.currentYear = window.currentYear || 2025;

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
        // Handle both single dates and date ranges
        if (range.includes(" to ")) {
            const [start, end] = range.split(" to ");
            return {
                start: new Date(start),
                end: new Date(end),
                original: range
            };
        } else {
            // Single date - treat as start and end being the same
            const date = new Date(range);
            return {
                start: date,
                end: date,
                original: range
            };
        }
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
        // If start and end are the same, return just the date, otherwise return range
        return startStr === endStr ? startStr : `${startStr} to ${endStr}`;
    });
}

const employees = {
    technical: [
        { name: "Aleksandrs P", value: "Aleksandrs_P|technical" },
        { name: "Jūlija B", value: "Jūlija_B|technical" },
        { name: "Anastasija V", value: "Anastasija_V|technical" },
        { name: "Daniels P", value: "Daniels_P|technical" },
        { name: "Elīna T", value: "Elīna_T|technical" },
		{ name: "Daniels T", value: "Daniels_T|technical" }
    ],
    KPI: [
        { name: "Ruslans P", value: "Ruslans_P|analytics" },
        { name: "Jelizaveta M", value: "Jelizaveta_M|analytics" }
    ],
    vip: [
        { name: "Anastasija K", value: "Anastasija_K|vip" },
		{ name: "Gatis J", value: "Gatis_J|vip" },
        { name: "Ivo J", value: "Ivo_J|vip" },
		{ name: "Jevgenijs B", value: "Jevgenijs_B|vip" },
        { name: "Jūlija J", value: "Jūlija_J|vip" },
        { name: "Jurijs K", value: "Jurijs_K|vip" },
        { name: "Kyada H", value: "Kyada_H|vip" },
        { name: "Laura P", value: "Laura_P|vip" },
        { name: "Monyque A V", value: "Monyque_A_V|vip" },
        { name: "Nadezhda B", value: "Nadezhda_B|vip" },
        { name: "Nataļja T", value: "Nataļja_T|vip" },
        { name: "Nikolajs P", value: "Nikolajs_P|vip" },
        { name: "Olga D", value: "Olga_D|vip" },
        { name: "Olga V Š", value: "Olga_V_Š|vip" },
        { name: "Tatjana T", value: "Tatjana_T|vip" },
        { name: "Achraf T N", value: "Achraf_T_N|vip" },
        { name: "Dēvids B", value: "Dēvids_B|vip" },
        { name: "Laura S S", value: "Laura_S_S|vip" },
        { name: "Aleksandrs T", value: "Aleksandrs_T|vip" },
        { name: "Vjaceslavs V", value: "Vjaceslavs_V|vip" },
        { name: "Jekaterina C", value: "Jekaterina_C|vip" },
        { name: "Maksim R", value: "Maksim_R|vip" },
        { name: "Shakhnozakhon N", value: "Shakhnozakhon_N|vip" },
        { name: "Andrejs K", value: "Andrejs_K|vip" },
        { name: "Kirills K", value: "Kirills_K|vip" },
        { name: "Sanita B", value: "Sanita_B|vip" },
        { name: "Vladislavs R", value: "Vladislavs_R|vip" },
        { name: "Aleksejs B", value: "Aleksejs_B|vip" },
        { name: "Kezia R J", value: "Kezia_R_J|vip" },
        { name: "Beate L S", value: "Beate_L_S|vip" },
        { name: "Ruhong C", value: "Ruhong_C|vip" },
        { name: "Davids B", value: "Davids_B|vip" },
		{ name: "Diana N", value: "Diana_N|vip" },
		{ name: "Bogdans G", value: "Bogdans_G|vip" },
		{ name: "Jean D D", value: "Jean_D_D|vip" }
    ],
    other: [
        { name: "Aliaksandryna I", value: "Aliaksandryna_I|other" },
        { name: "Vladislavs", value: "Vladislavs|other" }
    ],
    Design: [
        { name: "Romans S", value: "Romans_S|design" },
        { name: "Eduard E", value: "Eduard_E|design" },
        { name: "Eduards P", value: "Eduards_P|design" },
		{ name: "Gustavs N", value: "Gustavs_N|design" },
		{ name: "Polina G", value: "Polina_G|design" }
        
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
            dayCell.setAttribute('data-date-number', day);
            dayCell.classList.add("day-cell");
            // Debug: Add a temporary visible text to verify the attribute is set
            dayCell.setAttribute('title', `Date: ${day} (debug)`);

            dayCell.addEventListener("click", () => {
                const date = dayCell.dataset.date;
                if (selectedDates.includes(date)) {
                    selectedDates = selectedDates.filter(d => d !== date);
                    dayCell.style.backgroundColor = "";
                    dayCell.classList.remove("selected");
                } else {
                    selectedDates.push(date);
                    dayCell.style.backgroundColor = "rgba(255, 204, 0, 0.5)";
                    dayCell.classList.add("selected");
                }
        
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
    
}

// Load Vacations and Update UI
async function loadReservedVacations() {
    try {
        const ref = window.database.ref("vacations");
        const snapshot = await ref.get();
        const vacationData = snapshot.val() || {};
        
        // Filter vacations by date strings instead of year field
        const yearFilteredData = {};

        
        Object.entries(vacationData).forEach(([employee, info]) => {

            
            // Create a filtered version of the employee data
            const filteredInfo = { ...info };
            let hasRelevantData = false;
            
            // Filter dates array (reserved)
            if (info.dates && Array.isArray(info.dates)) {
                filteredInfo.dates = info.dates.filter(dateRange => {
                    const isRelevant = dateRange.startsWith(`${window.currentYear}-`);
    
                    return isRelevant;
                });
                if (filteredInfo.dates.length > 0) hasRelevantData = true;
            }
            
            // Filter approved array
            if (info.approved && Array.isArray(info.approved)) {
                filteredInfo.approved = info.approved.filter(dateRange => {
                    const isRelevant = dateRange.startsWith(`${window.currentYear}-`);
    
                    return isRelevant;
                });
                if (filteredInfo.approved.length > 0) hasRelevantData = true;
            }
            
            // Only include employee if they have relevant data for the current year
            if (hasRelevantData) {
                yearFilteredData[employee] = filteredInfo;
               
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
        
        // Store all vacation data for filtering dropdowns
        window.allReservedVacations = [];
        window.allApprovedVacations = [];

        Object.entries(yearFilteredData).forEach(([employee, info]) => {
            const employeeName = employee.split("_").join(" ");
            const department = info.department || "other";

            if (info.dates) {
                // Merge consecutive reserved ranges
                const mergedReservedRanges = mergeConsecutiveRanges(info.dates);
                
                mergedReservedRanges.forEach(range => {
                    // Handle both single dates and date ranges
                    let startDate, endDate;
                    if (range.includes(" to ")) {
                        [startDate, endDate] = range.split(" to ");
                    } else {
                        // Single date - use the same date for start and end
                        startDate = range;
                        endDate = range;
                    }
                    const dates = getDatesInRange(startDate, endDate);
                    dates.forEach(date => {
                        if (!vacationMap[date]) vacationMap[date] = [];
                        vacationMap[date].push({ employee: employeeName, status: "reserved", department });
                    });

                    const listItem = document.createElement("li");
                    listItem.textContent = `${employeeName} - ${range}`;
                    reservedList.appendChild(listItem);

                    // Store reserved vacation data
                    window.allReservedVacations.push({
                        employee: employeeName,
                        range: range,
                        startDate: startDate,
                        endDate: endDate,
                        department: department
                    });
                });
            }

            if (info.approved) {
                // Merge consecutive approved ranges
                const mergedApprovedRanges = mergeConsecutiveRanges(info.approved);
                
                mergedApprovedRanges.forEach(range => {
                    // Handle both single dates and date ranges
                    let startDate, endDate;
                    if (range.includes(" to ")) {
                        [startDate, endDate] = range.split(" to ");
                    } else {
                        // Single date - use the same date for start and end
                        startDate = range;
                        endDate = range;
                    }
                    
                    const dates = getDatesInRange(startDate, endDate);
                    dates.forEach(date => {
                        if (!vacationMap[date]) {
                            vacationMap[date] = [];
                        }
                        vacationMap[date].push({ employee: employeeName, status: "approved", department });
                    });

                    const listItem = document.createElement("li");
                    listItem.textContent = `${employeeName} - ${range}`;
                    approvedList.appendChild(listItem);

                    // Store approved vacation data
                    window.allApprovedVacations.push({
                        employee: employeeName,
                        range: range,
                        startDate: startDate,
                        endDate: endDate,
                        department: department
                    });
                });
            }
        });

        updateCalendar(vacationMap);

      
        
        // Setup month selectors after data is loaded
        setupMonthSelectors();
        
        // Apply month filtering after data is loaded
        filterVacationsByMonth('reserved');
        filterVacationsByMonth('approved');
        filterVacationsByMonth('approve');
        filterVacationsByMonth('delete-approved');
        
        // Populate dropdowns with filtered data
        populateDropdowns();
    } catch (error) {
        console.error("Error loading vacations:", error);
    }
}

// Update Calendar with Vacations (matching vacations folder logic)
function updateCalendar(vacationMap) {
    // Convert vacationMap to the format expected by applyCellColoring
    const approvedVacations = [];
    
    Object.entries(vacationMap).forEach(([date, vacations]) => {
        vacations.forEach(vacation => {
            approvedVacations.push({
                employee: vacation.employee,
                department: vacation.department,
                dateRange: date, // Single date for admin side
                status: vacation.status || 'reserved'
            });
        });
    });
    
    // Apply the improved cell coloring system
    applyCellColoring(approvedVacations);
}




// Initialize App
async function initialize() {
            generateCalendar(window.currentYear); // Generate calendar
    await loadReservedVacations(); // Load vacations from Firebase
    populateEmployeeDropdown();
    setupYearSelector();
    setupTooltips(); // Setup tooltip functionality
    setupEventListeners(); // Setup all event listeners
}

// Setup Event Listeners
function setupEventListeners() {
    
   
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
            const ref = window.database.ref(`vacations/${employee}`);
            const snapshot = await ref.get();

            let vacationData = snapshot.val() || { dates: [], approved: [], department, status: "reserved", year: window.currentYear };

            // Ensure dates is an array
            if (!Array.isArray(vacationData.dates)) vacationData.dates = [];

            // Add new date range
            vacationData.dates.push(dateRange);
            
            // Ensure year field is set
            vacationData.year = window.currentYear;

            await ref.set(vacationData);

            alert(`Vacation ${dateRange} added successfully!`);
            selectedDates = [];
            // Clear selected class from all cells
            document.querySelectorAll('.day-cell.selected').forEach(cell => {
                cell.classList.remove('selected');
                cell.style.backgroundColor = '';
            });
            await loadReservedVacations(); // Refresh lists and calendar
        } catch (error) {
            console.error("Error adding vacation:", error);
            alert("Failed to add vacation.");
        }
    });

    // Approve Vacation Button
    const approveButton = document.getElementById("approve-button");
    if (approveButton) {
        approveButton.addEventListener("click", async () => {
        const selectedOption = document.getElementById("approve-dropdown").value;
            
        if (!selectedOption) {
            alert("Please select a vacation to approve.");
            return;
        }

        const [employee, range] = selectedOption.split("|");
            // Convert employee name from "Aleksandrs P" to "Aleksandrs_P" for Firebase
            const firebaseEmployee = employee.replace(/\s+/g, "_");
            try {
                const ref = window.database.ref(`vacations/${firebaseEmployee}`);
            const snapshot = await ref.get();

            if (snapshot.exists()) {
                const vacationData = snapshot.val();
                    
                vacationData.dates = vacationData.dates.filter(d => d !== range);
                if (!vacationData.approved) vacationData.approved = [];
                vacationData.approved.push(range);
                
                // Preserve year field
                if (!vacationData.year) vacationData.year = window.currentYear;

                await ref.set(vacationData);
                    
                alert(`Vacation ${range} approved successfully!`);
                await loadReservedVacations();
                }
        } catch (error) {
            console.error("Error approving vacation:", error);
                alert(`Error: ${error.message}`);
        }
    });
    }

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
        // Convert employee name from "Aleksandrs P" to "Aleksandrs_P" for Firebase
        const firebaseEmployee = employee.replace(/\s+/g, "_");

        try {
            const ref = window.database.ref(`vacations/${firebaseEmployee}`);
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
       
        const selectedOption = document.getElementById("delete-approved-dropdown").value;
      
        if (!selectedOption) {
            alert("Please select an approved vacation to delete.");
            return;
        }

        const [employee, range] = selectedOption.split("|");
        // Convert employee name from "Aleksandrs P" to "Aleksandrs_P" for Firebase
        const firebaseEmployee = employee.replace(/\s+/g, "_");

        try {
            const ref = window.database.ref(`vacations/${firebaseEmployee}`);
            const snapshot = await ref.get();

            if (snapshot.exists()) {
                const vacationData = snapshot.val();
           
                vacationData.approved = vacationData.approved.filter(d => d !== range);
              

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
       
        const selectedOption = document.getElementById("delete-approved-dropdown").value;
       
        if (!selectedOption) {
            alert("Please select an approved vacation to force reserve.");
            return;
        }

        const [employee, range] = selectedOption.split("|");
        // Convert employee name from "Aleksandrs P" to "Aleksandrs_P" for Firebase
        const firebaseEmployee = employee.replace(/\s+/g, "_");

        try {
            const ref = window.database.ref(`vacations/${firebaseEmployee}`);
            const snapshot = await ref.get();

            if (snapshot.exists()) {
                const vacationData = snapshot.val();
                
                // Move from approved to reserved
                vacationData.approved = vacationData.approved.filter(d => d !== range);
                if (!vacationData.dates) vacationData.dates = [];
                vacationData.dates.push(range);
               

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
        // Only show tooltip if it's not a vacation tooltip, not a restricted date, and has data-tooltip attribute
        if (event.target.classList.contains("day-cell") && 
            event.target.hasAttribute("data-tooltip") && 
            !event.target.querySelector('.vacation-tooltip') &&
            !event.target.classList.contains('restricted-date')) {
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
            window.currentYear = parseInt(tab.dataset.year);
            
            // Clear selected dates
            selectedDates = [];
            
            // Clear selected class from all cells
            document.querySelectorAll('.day-cell.selected').forEach(cell => {
                cell.classList.remove('selected');
                cell.style.backgroundColor = '';
            });
            
            // Regenerate calendar for new year
            generateCalendar(window.currentYear);
            
            // Reload vacations for new year
            await loadReservedVacations();
            
            // Reapply date highlighting after vacations are loaded
            if (window.highlightVacationNotAllowed) {
                window.highlightVacationNotAllowed();
            }
            if (window.highlightLatvianHolidays) {
                window.highlightLatvianHolidays();
            }
            if (window.highlightSpecialDates) {
                window.highlightSpecialDates();
            }
        });
    });
}

// Setup Month Selectors
function setupMonthSelectors() {
    const reservedMonthSelector = document.getElementById('reserved-month-selector');
    const approvedMonthSelector = document.getElementById('approved-month-selector');
    const approveMonthSelector = document.getElementById('approve-month-selector');
    const deleteApprovedMonthSelector = document.getElementById('delete-approved-month-selector');
    
    if (reservedMonthSelector) {
        reservedMonthSelector.addEventListener('change', () => {
            filterVacationsByMonth('reserved');
            populateDropdowns(); // Update dropdowns when month changes
        });
    }
    
    if (approvedMonthSelector) {
        approvedMonthSelector.addEventListener('change', () => {
            filterVacationsByMonth('approved');
            populateDropdowns(); // Update dropdowns when month changes
        });
    }
    
    if (approveMonthSelector) {
        approveMonthSelector.addEventListener('change', () => {
            filterVacationsByMonth('approve');
            populateDropdowns(); // Update dropdowns when month changes
        });
    }
    
    if (deleteApprovedMonthSelector) {
        deleteApprovedMonthSelector.addEventListener('change', () => {
            filterVacationsByMonth('delete-approved');
            populateDropdowns(); // Update dropdowns when month changes
        });
    }
}

// Filter vacations by month
function filterVacationsByMonth(type) {
    let monthSelector, vacationList;
    
    // Map type to the correct month selector and vacation list
    if (type === 'reserved') {
        monthSelector = document.getElementById('reserved-month-selector');
        vacationList = document.getElementById('reserved-vacations-list');
    } else if (type === 'approved') {
        monthSelector = document.getElementById('approved-month-selector');
        vacationList = document.getElementById('approved-vacations-list');
    } else if (type === 'approve') {
        monthSelector = document.getElementById('approve-month-selector');
        vacationList = document.getElementById('reserved-vacations-list'); // Use reserved list for approve section
    } else if (type === 'delete-approved') {
        monthSelector = document.getElementById('delete-approved-month-selector');
        vacationList = document.getElementById('approved-vacations-list'); // Use approved list for delete-approved section
    }
    
    if (!monthSelector || !vacationList) return;
    
    const selectedMonth = parseInt(monthSelector.value);
    const currentYear = window.currentYear || 2025;
    
    // Get all vacation items
    const allItems = vacationList.querySelectorAll('li');
    
    // If "Show All" is selected (value 0), show all items
    if (selectedMonth === 0) {
        allItems.forEach(item => {
            item.style.display = 'block';
        });
        return;
    }
    
    allItems.forEach(item => {
        const itemText = item.textContent;
        
        // Extract the date range from the item text (format: "Employee Name - YYYY-MM-DD to YYYY-MM-DD" or "Employee Name - YYYY-MM-DD")
        const dateRangeMatch = itemText.match(/(\d{4}-\d{2}-\d{2})(?:\s+to\s+(\d{4}-\d{2}-\d{2}))?/);
        
        if (dateRangeMatch) {
            const startDate = new Date(dateRangeMatch[1]);
            const startMonth = startDate.getMonth() + 1; // getMonth() returns 0-11
            const startYear = startDate.getFullYear();
            
            let shouldShow = false;
            
            if (dateRangeMatch[2]) {
                // Date range - check if the selected month falls within the range
                const endDate = new Date(dateRangeMatch[2]);
                const endMonth = endDate.getMonth() + 1;
                const endYear = endDate.getFullYear();
                
                // Check if the selected month/year falls within the range
                if (startYear === currentYear && endYear === currentYear) {
                    // Same year range
                    if (selectedMonth >= startMonth && selectedMonth <= endMonth) {
                        shouldShow = true;
                    }
                } else if (startYear === currentYear && endYear > currentYear) {
                    // Range spans to next year
                    if (selectedMonth >= startMonth) {
                        shouldShow = true;
                    }
                } else if (startYear < currentYear && endYear === currentYear) {
                    // Range spans from previous year
                    if (selectedMonth <= endMonth) {
                        shouldShow = true;
                    }
                }
            } else {
                // Single date - check if it matches the selected month and year
                if (startMonth === selectedMonth && startYear === currentYear) {
                    shouldShow = true;
                }
            }
            
            // Show/hide item based on the result
            item.style.display = shouldShow ? 'block' : 'none';
        } else {
            // If no date pattern found, hide the item
            item.style.display = 'none';
        }
    });
}

// Populate dropdowns based on month selection
function populateDropdowns() {
    const approveDropdown = document.getElementById("approve-dropdown");
    const deleteApprovedDropdown = document.getElementById("delete-approved-dropdown");
    
    if (!approveDropdown || !deleteApprovedDropdown) return;
    
    // Clear existing options
    approveDropdown.innerHTML = '<option value="" disabled selected>Select a Reserved Vacation</option>';
    deleteApprovedDropdown.innerHTML = '<option value="" disabled selected>Select an Approved Vacation</option>';
    
    // Get selected months
    const reservedMonth = parseInt(document.getElementById('reserved-month-selector')?.value || 0);
    const approvedMonth = parseInt(document.getElementById('approved-month-selector')?.value || 0);
    const approveMonth = parseInt(document.getElementById('approve-month-selector')?.value || 0);
    const deleteApprovedMonth = parseInt(document.getElementById('delete-approved-month-selector')?.value || 0);
    
    // Populate approve dropdown (reserved vacations)
    if (window.allReservedVacations) {
        window.allReservedVacations.forEach(vacation => {
            if (shouldShowVacation(vacation, approveMonth)) {
                const option = document.createElement("option");
                option.value = `${vacation.employee}|${vacation.range}`;
                option.textContent = `${vacation.employee} - ${vacation.range}`;
                approveDropdown.appendChild(option);
            }
        });
    }
    
    // Populate delete approved dropdown (approved vacations)
    if (window.allApprovedVacations) {
        window.allApprovedVacations.forEach(vacation => {
            if (shouldShowVacation(vacation, deleteApprovedMonth)) {
                const option = document.createElement("option");
                option.value = `${vacation.employee}|${vacation.range}`;
                option.textContent = `${vacation.employee} - ${vacation.range}`;
                deleteApprovedDropdown.appendChild(option);
            }
        });
    }
}

// Helper function to check if vacation should be shown for selected month
function shouldShowVacation(vacation, selectedMonth) {
    if (selectedMonth === 0) return true; // Show All
    
    const startDate = new Date(vacation.startDate);
    const endDate = new Date(vacation.endDate);
    const startMonth = startDate.getMonth() + 1; // getMonth() returns 0-11
    const endMonth = endDate.getMonth() + 1;
    
    // Check if the selected month falls within the vacation range
    if (startMonth <= selectedMonth && selectedMonth <= endMonth) {
        return true;
    }
    
    return false;
}

// ============================================================================
// IMPROVED CELL COLORING FUNCTIONS (copied from vacations folder)
// ============================================================================

// Cell Coloring Functions
function applyCellColoring(approvedVacations) {
    
    // Clear all existing cell colors first
    clearAllCellColors();
    
    // Create a map of dates to vacations
    const dateVacationMap = {};
    
    approvedVacations.forEach(vacation => {
        const dates = generateDateRange(vacation.dateRange);
        
        dates.forEach(date => {
            if (!dateVacationMap[date]) {
                dateVacationMap[date] = [];
            }
            dateVacationMap[date].push(vacation);
        });
    });
    

    
    // Apply colors to calendar cells
    const dayCells = document.querySelectorAll('.day-cell');
    
    // Check what dates are available in the calendar
    const availableDates = [];
    dayCells.forEach(cell => {
        const date = cell.dataset.date;
        if (date) {
            availableDates.push(date);
        }
    });
    
    dayCells.forEach(cell => {
        const date = cell.dataset.date;
        if (!date) return;
        
        const vacations = dateVacationMap[date];
        if (vacations && vacations.length > 0) {
            colorCell(cell, vacations);
            // Skip tooltips for restricted dates - the red color already indicates they're not allowed
            if (!cell.classList.contains('restricted-date')) {
                addTooltip(cell, vacations);
            }
        }
    });
    
    // Re-apply restricted date highlighting to ensure they remain visible
    if (window.highlightVacationNotAllowed) {
        window.highlightVacationNotAllowed();
    }
}

function clearAllCellColors() {
    const dayCells = document.querySelectorAll('.day-cell');
    dayCells.forEach(cell => {
        // Only clear background color if it's not a restricted date
        if (!cell.classList.contains('restricted-date')) {
            cell.style.backgroundColor = '';
        }
        // Clear tooltip (but not for restricted dates since they don't have tooltips)
        if (!cell.classList.contains('restricted-date')) {
            cell.removeAttribute('data-tooltip');
        }
        
        // Remove vacation tooltips and their event listeners
        const vacationTooltips = document.querySelectorAll('.vacation-tooltip');
        vacationTooltips.forEach(tooltip => tooltip.remove());
        
        // Remove event listeners from cells
        if (cell._tooltipMouseEnter) {
            cell.removeEventListener('mouseenter', cell._tooltipMouseEnter);
            cell._tooltipMouseEnter = null;
        }
        if (cell._tooltipMouseLeave) {
            cell.removeEventListener('mouseleave', cell._tooltipMouseLeave);
            cell._tooltipMouseLeave = null;
        }
        
        // Clear any corner triangles
        const corners = cell.querySelectorAll('.corner-triangle');
        corners.forEach(corner => corner.remove());
        // Clear any cell coloring elements
        const coloringElements = cell.querySelectorAll('.cell-coloring-element');
        coloringElements.forEach(element => element.remove());
        // Clear any dot indicators
        const dotIndicators = cell.querySelectorAll('.dot-indicator');
        dotIndicators.forEach(dot => dot.remove());
        // Clear any date text elements (no longer used with CSS ::before approach)
        const dateTexts = cell.querySelectorAll('.date-text');
        dateTexts.forEach(text => text.remove());
        // Reset text color but preserve date number visibility
        cell.style.color = '';
        
        // Remove multiple-overlays class
        cell.classList.remove('multiple-overlays');
        
        // Ensure date number is still visible after clearing colors
        const dateNumber = cell.dataset.dateNumber || cell.textContent.trim();
        if (dateNumber) {
            cell.setAttribute('data-date-number', dateNumber);
        }
    });
}

function colorCell(cell, vacations) {
    // Skip coloring if this is a restricted date - let the red background show
    if (cell.classList.contains('restricted-date')) {
        return;
    }
    
    // Group vacations by department and status
    const departmentGroups = {};
    
    vacations.forEach(vacation => {
        let department = vacation.department;
        // Keep original department names
        
        // Create a key that includes both department and status
        const key = `${department}||${vacation.status || 'approved'}`;
        
        if (!departmentGroups[key]) {
            departmentGroups[key] = [];
        }
        departmentGroups[key].push(vacation);
    });
    
    const uniqueDepartments = Object.keys(departmentGroups);

    
    if (uniqueDepartments.length === 1) {
        // Single department - full cell color
        const department = uniqueDepartments[0];
        const color = getDepartmentColor(department);
        cell.style.backgroundColor = color;
        
        // Ensure date number is visible and on top
        const existingText = cell.textContent;
        if (existingText) {
            cell.setAttribute('data-date-number', existingText);
            cell.style.color = '#ffffff';
        }
        

    } else if (uniqueDepartments.length === 2) {
        // Two departments - diagonal split
        cell.style.position = 'relative';
        cell.style.background = 'none';
        
        // Get first two departments
        const firstDept = uniqueDepartments[0];
        const secondDept = uniqueDepartments[1];
        
        const color1 = getDepartmentColor(firstDept);
        const color2 = getDepartmentColor(secondDept);
        

        
        // Create diagonal split
        const diagonalSplit = document.createElement('div');
        diagonalSplit.className = 'cell-coloring-element';
        diagonalSplit.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, ${color1} 0%, ${color1} 49.9%, ${color2} 50%, ${color2} 100%);
            z-index: 1;
            pointer-events: none;
        `;
        cell.appendChild(diagonalSplit);
        
        // Ensure date number is visible
        const dateNumber = cell.textContent.trim();
        if (dateNumber) {
            cell.setAttribute('data-date-number', dateNumber);
            cell.style.color = 'transparent'; // Hide original text
            cell.classList.add('multiple-overlays'); // Add class for CSS targeting
        }
    } else if (uniqueDepartments.length >= 3) {
        // Three or more departments - triangular split
        cell.style.position = 'relative';
        cell.style.background = 'none';
        
        // Get first three departments
        const firstDept = uniqueDepartments[0];
        const secondDept = uniqueDepartments[1];
        const thirdDept = uniqueDepartments[2];
        
        const color1 = getDepartmentColor(firstDept);
        const color2 = getDepartmentColor(secondDept);
        const color3 = getDepartmentColor(thirdDept);
        
        
        // Create triangular split using CSS clip-path
        const triangularSplit = document.createElement('div');
        triangularSplit.className = 'cell-coloring-element';
        triangularSplit.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                linear-gradient(45deg, ${color1} 0%, ${color1} 33%, transparent 33%),
                linear-gradient(-45deg, ${color2} 0%, ${color2} 33%, transparent 33%),
                ${color3};
            z-index: 1;
            pointer-events: none;
        `;
        cell.appendChild(triangularSplit);
        
        // Ensure date number is visible
        const dateNumber = cell.textContent.trim();
        if (dateNumber) {
            cell.setAttribute('data-date-number', dateNumber);
            cell.style.color = 'transparent'; // Hide original text
            cell.classList.add('multiple-overlays'); // Add class for CSS targeting
        }
    }
    
    // Ensure date number is visible for all cases using CSS ::before pseudo-element
    const existingText = cell.textContent.trim();
    const dateNumber = cell.dataset.dateNumber || existingText;
    
    if (dateNumber && !cell.hasAttribute('data-date-number')) {
        cell.setAttribute('data-date-number', dateNumber);
    }
    
    // Always hide original text when using overlays to ensure ::before pseudo-element works
    if (uniqueDepartments.length > 1) {
        cell.style.color = 'transparent';
    }
    
    // Ensure date number is always visible regardless of coloring
    if (!cell.hasAttribute('data-date-number') && dateNumber) {
        cell.setAttribute('data-date-number', dateNumber);
    }
    

}



function addTooltip(cell, vacations) {
    // Remove any existing tooltip for this cell
    const existingTooltip = cell.querySelector('.vacation-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'vacation-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 5px;
        font-size: 12px;
        white-space: pre-line;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        max-width: 200px;
    `;
    
    // Create tooltip content
    let tooltipContent = vacations.map(vacation => {
        const status = vacation.status === 'reserved' ? 'reserved' : 'approved';
        
        // Hide "(other)" department and department labels for same department
        const department = vacation.department === 'other' ? '' : vacation.department;
        const departmentLabel = department ? ` (${department})` : '';
        
        return `${vacation.employee}${departmentLabel} - ${status}`;
    }).join('\n');
    
    // If this is a restricted date, add the "VACATION NOT ALLOWED" message
    if (cell.classList.contains('restricted-date')) {
        tooltipContent = 'VACATION NOT ALLOWED\n' + tooltipContent;
    }
    
    tooltip.textContent = tooltipContent;
    document.body.appendChild(tooltip);
    
    // Remove any existing event listeners to prevent duplicates
    cell.removeEventListener('mouseenter', cell._tooltipMouseEnter);
    cell.removeEventListener('mouseleave', cell._tooltipMouseLeave);
    
    // Create new event handlers
    cell._tooltipMouseEnter = (e) => {
        const rect = cell.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
        tooltip.style.opacity = '1';
    };
    
    cell._tooltipMouseLeave = () => {
        tooltip.style.opacity = '0';
    };
    
    // Add hover events
    cell.addEventListener('mouseenter', cell._tooltipMouseEnter);
    cell.addEventListener('mouseleave', cell._tooltipMouseLeave);
}

function getDepartmentColor(departmentKey) {
    // Parse the department and status from the key
    const [department, status] = departmentKey.split('||');
    
    // Reserved colors (all departments)
    if (status === 'reserved') {
        return '#FF8C00'; // Orange for all reserved departments
    }
    
    // Approved colors
    const colors = {
        'vip': 'rgb(50, 205, 50)', // Green for approved VIP
        'analytics': 'rgb(102, 153, 204)', // Blue for approved Analytics
        'technical': 'rgb(102, 153, 204)', // Blue for approved Technical
        'kpi': '#6699CC', // Blue for approved KPI
        'design': '#FF69B4', // Pink for approved Design
        'other': '#FF69B4' // Pink for approved Other
    };
    
    return colors[department] || '#FF8C00';
}

function generateDateRange(range) {
    const dates = [];
    
    // Handle both single dates and date ranges
    let start, end;
    if (range.includes(" to ")) {
        [start, end] = range.split(" to ");
    } else {
        // Single date - use the same date for start and end
        start = range;
        end = range;
    }
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
}

// Don't auto-initialize - let the HTML file call initialize() when ready
