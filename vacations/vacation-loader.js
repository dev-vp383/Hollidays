// Firebase configuration and initialization
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

// Global variable to store all approved vacations
let allApprovedVacations = [];

// Initialize current year
window.currentYear = 2025;

// Load approved vacations when page loads
document.addEventListener("DOMContentLoaded", () => {
    // Check if there's an active year tab and set the current year accordingly
    const activeYearTab = document.querySelector('.year-tab.active');
    if (activeYearTab) {
        window.currentYear = parseInt(activeYearTab.dataset.year);
    }
    
    loadApprovedVacations(); // This will call setupMonthSelector after data is loaded
});

function loadApprovedVacations() {
    const approvedList = document.getElementById('approved-vacations-list');
    if (!approvedList) return;

    database.ref('vacations').once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            
            if (!data) {
                approvedList.innerHTML = '<li>No approved vacations found</li>';
                return;
            }

            const approvedVacations = [];
            const currentYear = window.currentYear || 2025;
            console.log('Loading vacations for year:', currentYear);
            
            // Process all employees
            Object.keys(data).forEach(employeeKey => {
                const employeeData = data[employeeKey];
                const employeeName = employeeKey.replace(/_/g, ' ');
                console.log(`Processing employee: ${employeeKey} -> ${employeeName}`);
                
                // Get approved vacations - filter by year
                if (employeeData.approved && Array.isArray(employeeData.approved)) {
                    employeeData.approved.forEach(range => {
                        // Filter by year - check if the date range contains the current year
                        if (range.includes(`${currentYear}-`)) {
                            approvedVacations.push({
                                employee: employeeName,
                                department: employeeData.department || 'unknown',
                                dateRange: range,
                                status: 'approved'
                            });
                        } else {
                            console.log(`Skipping approved range "${range}" for year ${currentYear}`);
                        }
                    });
                }
                
                // Get reserved vacations (dates field) - filter by year
                if (employeeData.dates && Array.isArray(employeeData.dates)) {
                    employeeData.dates.forEach(range => {
                        // Filter by year - check if the date range contains the current year
                        if (range.includes(`${currentYear}-`)) {
                            approvedVacations.push({
                                employee: employeeName,
                                department: employeeData.department || 'unknown',
                                dateRange: range,
                                status: 'reserved'
                            });
                        } else {
                            console.log(`Skipping reserved range "${range}" for year ${currentYear}`);
                        }
                    });
                }
            });

            // Sort by date range
            approvedVacations.sort((a, b) => {
                // Handle both single dates and date ranges
                const dateA = a.dateRange.includes(" to ") ? a.dateRange.split(' to ')[0] : a.dateRange;
                const dateB = b.dateRange.includes(" to ") ? b.dateRange.split(' to ')[0] : b.dateRange;
                return new Date(dateA) - new Date(dateB);
            });

            console.log('Total vacations found for year', currentYear, ':', approvedVacations.length);
            console.log('Vacations for year', currentYear, ':', JSON.stringify(approvedVacations, null, 2));
            
            // Store all vacations globally
            allApprovedVacations = approvedVacations;
            
            // Setup month selector after data is loaded
            setupMonthSelector();
            
            // Display approved vacations for current month
            displayApprovedVacations(approvedVacations);
            
            // Apply cell coloring to calendar
            applyCellColoring(approvedVacations);
        })
        .catch((error) => {
            console.error("Error loading approved vacations:", error);
            approvedList.innerHTML = '<li>Error loading approved vacations</li>';
        });
}

function displayApprovedVacations(vacations) {
    const approvedList = document.getElementById('approved-vacations-list');
    const monthSelector = document.getElementById('month-selector');
    
    if (!approvedList || !monthSelector) return;

    const selectedMonth = parseInt(monthSelector.value);
    
    console.log(`Selected month: ${selectedMonth}`);
    console.log(`Selected year: ${window.currentYear || 2025}`);
    
    // Filter vacations by selected month (only show vacations that actually have dates within the month)
    const filteredVacations = vacations.filter(vacation => {
        // Handle both single dates and date ranges
        let startDate, endDate;
        if (vacation.dateRange.includes(" to ")) {
            [startDate, endDate] = vacation.dateRange.split(" to ");
        } else {
            // Single date - use the same date for start and end
            startDate = vacation.dateRange;
            endDate = vacation.dateRange;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Use the selected year from the year tabs
        const selectedYear = window.currentYear || 2025;
        const monthStart = new Date(selectedYear, selectedMonth - 1, 1); // Month start (0-indexed)
        const monthEnd = new Date(selectedYear, selectedMonth, 0); // Month end (0-indexed)
        
        console.log(`Month boundaries: ${monthStart.toISOString().split('T')[0]} to ${monthEnd.toISOString().split('T')[0]}`);
        
        // First check if the vacation is in the selected year
        const vacationYear = start.getFullYear();
        if (vacationYear !== selectedYear) {
            return false; // Skip vacations from different years
        }
        
        // Check if the vacation actually has dates within the selected month
        // A vacation should be shown if ANY of its dates fall within the month
        const hasDatesInMonth = (
            // Start date is within the month
            (start >= monthStart && start <= monthEnd) ||
            // End date is within the month  
            (end >= monthStart && end <= monthEnd) ||
            // Vacation spans across the entire month (starts before month and ends after month)
            (start <= monthStart && end >= monthEnd)
        );
        
        // Debug logging to see what's happening
        console.log(`Vacation: ${vacation.dateRange}`);
        console.log(`  Start: ${start.toISOString().split('T')[0]}, Month start: ${monthStart.toISOString().split('T')[0]}, Month end: ${monthEnd.toISOString().split('T')[0]}`);
        console.log(`  Has dates in month: ${hasDatesInMonth}`);
        
        return hasDatesInMonth;
    });
    


    if (filteredVacations.length === 0) {
        approvedList.innerHTML = '<li>No approved vacations for this month</li>';
        return;
    }

    // Group consecutive date ranges
    const groupedVacations = mergeConsecutiveRanges(filteredVacations);
    
    approvedList.innerHTML = '';
    groupedVacations.forEach(vacation => {
        const li = document.createElement('li');
        
        // Hide "(other)" department labels
        const department = vacation.department === 'other' ? '' : vacation.department;
        const departmentLabel = department ? ` (${department})` : '';
        
        if (vacation.status === 'reserved') {
            li.innerHTML = `<strong>${vacation.employee}</strong>${departmentLabel}: ${vacation.dateRange} <span style="color: red; font-weight: bold; font-size: 0.8em;">❌ NOT YET APPROVED</span>`;
        } else {
            li.innerHTML = `<strong>${vacation.employee}</strong>${departmentLabel}: ${vacation.dateRange} <span style="color: green; font-weight: bold; font-size: 0.8em;">✅ APPROVED</span>`;
        }
        
        // Add hover functionality to highlight calendar cells
        li.addEventListener('mouseenter', () => {
            highlightVacationDates(vacation.dateRange, true);
        });
        
        li.addEventListener('mouseleave', () => {
            highlightVacationDates(vacation.dateRange, false);
        });
        
        approvedList.appendChild(li);
    });
}

function mergeConsecutiveRanges(vacations) {
    if (vacations.length === 0) return [];
    
    const sorted = [...vacations].sort((a, b) => {
        // Handle both single dates and date ranges
        const dateA = a.dateRange.includes(" to ") ? a.dateRange.split(' to ')[0] : a.dateRange;
        const dateB = b.dateRange.includes(" to ") ? b.dateRange.split(' to ')[0] : b.dateRange;
        return new Date(dateA) - new Date(dateB);
    });

    const merged = [];
    let current = { ...sorted[0] };

    for (let i = 1; i < sorted.length; i++) {
        const next = sorted[i];
        
        // Handle both single dates and date ranges for current
        let currentStart, currentEnd;
        if (current.dateRange.includes(" to ")) {
            [currentStart, currentEnd] = current.dateRange.split(" to ");
        } else {
            currentStart = current.dateRange;
            currentEnd = current.dateRange;
        }
        
        // Handle both single dates and date ranges for next
        let nextStart, nextEnd;
        if (next.dateRange.includes(" to ")) {
            [nextStart, nextEnd] = next.dateRange.split(" to ");
        } else {
            nextStart = next.dateRange;
            nextEnd = next.dateRange;
        }
        
        const currentEndDate = new Date(currentEnd);
        const nextStartDate = new Date(nextStart);
        
        // Check if dates are consecutive (next day)
        const dayDiff = (nextStartDate - currentEndDate) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1 && current.employee === next.employee && current.department === next.department) {
            // Merge the ranges
            current.dateRange = `${currentStart} to ${nextEnd}`;
        } else {
            merged.push(current);
            current = { ...next };
        }
    }
    
    merged.push(current);
    return merged;
}

function loadRestrictedDates() {
    const restrictedList = document.getElementById('restricted-dates-list');
    if (!restrictedList) return;

    // Load restricted dates from the date-highlighting.js file
    if (window.vacationNotAllowedRanges) {
        restrictedList.innerHTML = '';
        
        // Check if it's an array or object
        if (Array.isArray(window.vacationNotAllowedRanges)) {
            // If it's an array, use forEach
            window.vacationNotAllowedRanges.forEach(range => {
                const li = document.createElement('li');
                li.textContent = range;
                restrictedList.appendChild(li);
            });
        } else if (typeof window.vacationNotAllowedRanges === 'object') {
            // If it's an object, convert to array or handle differently
            const rangesArray = Object.values(window.vacationNotAllowedRanges);
            rangesArray.forEach(range => {
                const li = document.createElement('li');
                li.textContent = range;
                restrictedList.appendChild(li);
            });
        }
    } else {
        restrictedList.innerHTML = '<li>No restricted dates found</li>';
    }
}

function setupMonthSelector() {
    const monthSelector = document.getElementById('month-selector');
    const yearTabs = document.querySelectorAll('.year-tab');
    if (!monthSelector) return;

    // Set current month as default
    const currentMonth = new Date().getMonth() + 1;
    monthSelector.value = currentMonth;

    // Add event listener for month changes
    monthSelector.addEventListener('change', () => {
        // Filter existing data instead of reloading from Firebase
        displayApprovedVacations(allApprovedVacations);
        // Re-apply cell coloring when month changes - use only current year vacations
        applyCellColoring(allApprovedVacations);
    });

    // Add year selector functionality
    yearTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            yearTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            const selectedYear = parseInt(tab.dataset.year);
            console.log('Year changed to:', selectedYear);
            
            // Update the current year for filtering
            window.currentYear = selectedYear;
            
            // Clear existing data first
            allApprovedVacations = [];
            
            // Regenerate calendar for the new year
            generateCalendar(selectedYear);
            
            // Reload data from Firebase for the new year
            loadApprovedVacations();
            
            // Reapply date highlighting after calendar is generated and data is loaded
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

// Cell Coloring Functions
function applyCellColoring(approvedVacations) {
    console.log('Applying cell coloring for vacations:', approvedVacations);
    
    // Clear all existing cell colors first
    clearAllCellColors();
    
    // Create a map of dates to vacations
    const dateVacationMap = {};
    
    approvedVacations.forEach(vacation => {
        const dates = generateDateRange(vacation.dateRange);
        console.log(`Generated dates for ${vacation.dateRange}:`, dates);
        dates.forEach(date => {
            if (!dateVacationMap[date]) {
                dateVacationMap[date] = [];
            }
            dateVacationMap[date].push(vacation);
        });
    });
    
    console.log('Date vacation map:', dateVacationMap);
    
    // Apply colors to calendar cells
    const dayCells = document.querySelectorAll('.day-cell');
    console.log('Found', dayCells.length, 'day cells');
    
    // Check what dates are available in the calendar
    const availableDates = [];
    dayCells.forEach(cell => {
        const date = cell.dataset.date;
        if (date) {
            availableDates.push(date);
        }
    });
    console.log('Available dates in calendar (first 10):', availableDates.slice(0, 10));
    console.log('Looking for dates:', Object.keys(dateVacationMap));
    
    // Check if our target dates exist in the calendar
    const targetDates = Object.keys(dateVacationMap);
    targetDates.forEach(targetDate => {
        const found = availableDates.includes(targetDate);
        console.log(`Date ${targetDate} found in calendar: ${found}`);
    });
    
    dayCells.forEach(cell => {
        const date = cell.dataset.date;
        if (!date) return;
        
        const vacations = dateVacationMap[date];
        if (vacations && vacations.length > 0) {
            console.log(`Coloring cell for date ${date} with vacations:`, vacations);
            colorCell(cell, vacations);
            addTooltip(cell, vacations);
        }
    });
}

function clearAllCellColors() {
    const dayCells = document.querySelectorAll('.day-cell');
    dayCells.forEach(cell => {
        // Clear background color
        cell.style.backgroundColor = '';
        // Clear tooltip
        cell.removeAttribute('data-tooltip');
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
        
        // Ensure date number is still visible after clearing colors
        const dateNumber = cell.dataset.dateNumber || cell.textContent.trim();
        if (dateNumber) {
            cell.setAttribute('data-date-number', dateNumber);
        }
    });
}

function colorCell(cell, vacations) {
    // Check if this date is fully booked
    const isFullyBooked = checkIfFullyBooked(vacations);
    
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
    
    // Add red dot if fully booked
    if (isFullyBooked) {
        const redDot = document.createElement('div');
        redDot.className = 'dot-indicator';
        redDot.style.cssText = `
            width: 8px;
            height: 8px;
            background-color: red;
            border-radius: 50%;
            position: absolute;
            bottom: 5px;
            right: 5px;
            pointer-events: none;
            z-index: 30;
        `;
        cell.appendChild(redDot);
    }
}

function checkIfFullyBooked(vacations) {
    if (vacations.length < 2) return false;
    
    // Group by department
    const departmentGroups = {};
    vacations.forEach(vacation => {
        let department = vacation.department;
        if (department === 'technical' || department === 'analytics') {
            department = 'tech_analytics';
        }
        
        if (!departmentGroups[department]) {
            departmentGroups[department] = [];
        }
        departmentGroups[department].push(vacation);
    });
    
    // Check rule 1: 2 VIP managers request the same week
    if (departmentGroups['vip'] && departmentGroups['vip'].length >= 2) {
        return true;
    }
    
    // Check rule 2: One Analytical and one Technical team member request the same week
    if ((departmentGroups['analytics'] && departmentGroups['analytics'].length >= 1) && 
        (departmentGroups['technical'] && departmentGroups['technical'].length >= 1)) {
        return true;
    }
    
    // Check rule 3: Two or more employees from the same department request the same dates
    for (const department in departmentGroups) {
        if (departmentGroups[department].length >= 2) {
            return true;
        }
    }
    
    return false;
}

function addTooltip(cell, vacations) {
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
    const tooltipContent = vacations.map(vacation => {
        const status = vacation.status === 'reserved' ? 'reserved' : 'approved';
        
        // Hide "(other)" department and department labels for same department
        const department = vacation.department === 'other' ? '' : vacation.department;
        const departmentLabel = department ? ` (${department})` : '';
        
        return `${vacation.employee}${departmentLabel} - ${status}`;
    }).join('\n');
    
    tooltip.textContent = tooltipContent;
    document.body.appendChild(tooltip);
    
    // Add hover events
    cell.addEventListener('mouseenter', (e) => {
        const rect = cell.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
        tooltip.style.opacity = '1';
        
        // Highlight corresponding vacation list items
        highlightVacationListItems(vacations, true);
    });
    
    cell.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        
        // Remove highlight from vacation list items
        highlightVacationListItems(vacations, false);
    });
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

function highlightVacationDates(dateRange, highlight) {
    const dates = generateDateRange(dateRange);
    
    dates.forEach(date => {
        const cell = document.querySelector(`[data-date="${date}"]`);
        if (cell) {
            if (highlight) {
                // Add glow effect
                cell.style.boxShadow = '0 0 10px 3px rgba(255, 255, 0, 0.8)';
                cell.style.transform = 'scale(1.05)';
                cell.style.transition = 'all 0.2s ease';
                cell.style.zIndex = '100';
            } else {
                // Remove glow effect
                cell.style.boxShadow = '';
                cell.style.transform = '';
                cell.style.zIndex = '';
            }
        }
    });
}

function highlightVacationListItems(vacations, highlight) {
    const approvedList = document.getElementById('approved-vacations-list');
    if (!approvedList) return;
    
    const listItems = approvedList.querySelectorAll('li');
    
    listItems.forEach(li => {
        // Check if this list item corresponds to any of the hovered vacations
        const liText = li.textContent;
        const shouldHighlight = vacations.some(vacation => {
            return liText.includes(vacation.employee) && liText.includes(vacation.dateRange);
        });
        
        if (shouldHighlight) {
            if (highlight) {
                // Add highlight effect
                li.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
                li.style.border = '2px solid #FFD700';
                li.style.borderRadius = '5px';
                li.style.padding = '8px';
                li.style.margin = '2px 0';
                li.style.transition = 'all 0.2s ease';
            } else {
                // Remove highlight effect
                li.style.backgroundColor = '';
                li.style.border = '';
                li.style.borderRadius = '';
                li.style.padding = '';
                li.style.margin = '';
            }
        }
    });
}

// Helper functions for handling single dates and date ranges
function getStartDate(dateRange) {
    if (dateRange.includes(" to ")) {
        return dateRange.split(" to ")[0];
    } else {
        return dateRange; // Single date
    }
}

function getDateRange(dateRange) {
    if (dateRange.includes(" to ")) {
        return dateRange.split(" to ");
    } else {
        // Single date - return the same date for start and end
        return [dateRange, dateRange];
    }
}
