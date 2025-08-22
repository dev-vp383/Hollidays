document.addEventListener("DOMContentLoaded", () => {
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

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    const departmentColors = {
        technical: { reserved: "#E49B0F", approved: "#6699CC" },
        analytics: { reserved: "#E49B0F", approved: "#6699CC" },
        vip: { reserved: "#E49B0F", approved: "#32CD32" }
    };

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

    // Helper: Generate all dates in a range
    function generateDateRange(start, end) {
        const dates = [];
        let currentDate = new Date(start);
        const endDate = new Date(end);

        while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split("T")[0]);
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

    // Fetch vacation data from Firebase
    async function fetchVacationData() {
        try {
            const snapshot = await database.ref("vacations").get();
            if (snapshot.exists()) {
                const allVacationData = snapshot.val();
                console.log("All vacation data fetched successfully:", allVacationData);
                
                // Filter by current year
                const currentYear = window.currentYear || 2025;
                const yearFilteredData = {};
                
                Object.entries(allVacationData).forEach(([employee, info]) => {
                    // Only include vacations that have year field matching current year, or no year field (legacy 2025 data)
                    if (!info.year || info.year === currentYear) {
                        yearFilteredData[employee] = info;
                    }
                });
                
                console.log(`Filtered vacation data for year ${currentYear}:`, yearFilteredData);
                return yearFilteredData;
            } else {
                console.warn("No data found in 'vacations' node.");
                return {};
            }
        } catch (error) {
            console.error("Error fetching vacation data from Firebase:", error);
            return {};
        }
    }

    // Apply vacation statuses and red dot logic
    async function applyVacationStatuses() {
        console.log("Starting to apply vacation statuses...");

        const vacationData = await fetchVacationData();

        const dateDetails = {};
        const vacationMap = {};

        Object.entries(vacationData).forEach(([employee, details]) => {
            const { dates = [], approved = [], department } = details;

            // Merge consecutive approved ranges
            const mergedApprovedRanges = mergeConsecutiveRanges(approved);
            mergedApprovedRanges.forEach((range) => {
                const [start, end] = range.split(" to ");
                const dateRange = generateDateRange(start, end);

                dateRange.forEach((date) => {
                    const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
                    if (!dayCell) return;

                    const tooltip = `${employee.split("_").join(" ")} - ${department} (Approved)`;
                    const existingTooltip = dayCell.getAttribute("data-tooltip") || "";
                    const combinedTooltip = [existingTooltip, tooltip].filter(Boolean).join("\n");
                    dayCell.setAttribute("data-tooltip", combinedTooltip);

                    if (!dateDetails[date]) dateDetails[date] = new Set();
                    dateDetails[date].add(departmentColors[department]?.approved || "#0000FF");

                    if (!vacationMap[date]) vacationMap[date] = [];
                    vacationMap[date].push({ employee, department, status: "approved" });
                });
            });

            if (details.status === "reserved") {
                // Merge consecutive reserved ranges
                const mergedReservedRanges = mergeConsecutiveRanges(dates);
                mergedReservedRanges.forEach((range) => {
                    const [start, end] = range.split(" to ");
                    const dateRange = generateDateRange(start, end);

                    dateRange.forEach((date) => {
                        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
                        if (!dayCell) return;

                        const tooltip = `${employee.split("_").join(" ")} - ${department} (Reserved)`;
                        const existingTooltip = dayCell.getAttribute("data-tooltip") || "";
                        const combinedTooltip = [existingTooltip, tooltip].filter(Boolean).join("\n");
                        dayCell.setAttribute("data-tooltip", combinedTooltip);

                        if (!dateDetails[date]) dateDetails[date] = new Set();
                        dateDetails[date].add(departmentColors[department]?.reserved || "#7700ff");

                        if (!vacationMap[date]) vacationMap[date] = [];
                        vacationMap[date].push({ employee, department, status: "reserved" });
                    });
                });
            }
        });

        const dayCells = document.querySelectorAll(".day-cell");
        dayCells.forEach((dayCell) => {
    const date = dayCell.dataset.date;
    if (!date) return;

    // Check if this date has vacation data
    const hasVacationData = dateDetails[date];
    const isRestrictedDate = window.restrictedDates && window.restrictedDates.includes(date);

    if (!hasVacationData && !isRestrictedDate) return;

    // Remove any existing corner elements
    const existingCorners = dayCell.querySelectorAll(".corner-triangle");
    existingCorners.forEach((corner) => corner.remove());

    if (hasVacationData) {
        // Handle vacation colors
        const colors = Array.from(dateDetails[date]);
        
        // Apply the base color (first department)
        dayCell.style.backgroundColor = colors[0];

        // Add top-left and top-right triangles for additional departments
        if (colors.length > 1) {
            if (colors[1]) {
                const topLeftTriangle = document.createElement("div");
                topLeftTriangle.classList.add("corner-triangle");
                topLeftTriangle.style.backgroundColor = colors[1];
                topLeftTriangle.style.clipPath = "polygon(0 0, 100% 0, 0 100%)"; // Top-left triangle
                topLeftTriangle.style.position = "absolute";
                topLeftTriangle.style.top = "0";
                topLeftTriangle.style.left = "0";
                topLeftTriangle.style.width = "50%";
                topLeftTriangle.style.height = "50%";
                dayCell.appendChild(topLeftTriangle);
            }
            if (colors[2]) {
                const topRightTriangle = document.createElement("div");
                topRightTriangle.classList.add("corner-triangle");
                topRightTriangle.style.backgroundColor = colors[2];
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
    }

    // Red Dot Logic (unchanged)
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


        console.log("Vacation statuses with diagonal division and red dot logic applied successfully.");
    }

    // Make function globally available for year switching
    window.applyVacationStatuses = applyVacationStatuses;
    
    applyVacationStatuses();
});
