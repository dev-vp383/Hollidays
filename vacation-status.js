document.addEventListener("DOMContentLoaded", () => {
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

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    const departmentColors = {
        technical: { reserved: "#ffcc00", approved: "#0000ff" },
        analytics: { reserved: "#ffcc00", approved: "#0000ff" },
        vip: { reserved: "#ffcc00", approved: "#00ff00" }
    };

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

    // Fetch vacation data from Firebase
    async function fetchVacationData() {
        try {
            const snapshot = await database.ref("vacations").get();
            if (snapshot.exists()) {
                console.log("Vacation data fetched successfully:", snapshot.val());
                return snapshot.val();
            } else {
                console.warn("No data found in 'vacations' node.");
                return {};
            }
        } catch (error) {
            console.error("Error fetching vacation data from Firebase:", error);
            return {};
        }
    }

    // Apply vacation statuses
    async function applyVacationStatuses() {
        console.log("Starting to apply vacation statuses...");

        // Fetch data
        const vacationData = await fetchVacationData();

        // Map to track colors for overlapping statuses
        const dateDetails = {};

        // Process each employee's vacation data
        Object.entries(vacationData).forEach(([employee, details]) => {
            const { dates = [], approved = [], department } = details;

            // Process approved dates first
            approved.forEach((range) => {
                const [start, end] = range.split(" to ");
                const dateRange = generateDateRange(start, end);

                dateRange.forEach((date) => {
                    const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
                    if (!dayCell) return;

                    const newEntry = `${employee.split("_").join(" ")} - Department: ${department} (Approved)`;
                    const existingTooltip = dayCell.getAttribute("data-tooltip") || "";
                    const combinedTooltip = [existingTooltip, newEntry].filter(Boolean).join("\n");
                    dayCell.setAttribute("data-tooltip", combinedTooltip);

                    // Track approved color
                    if (!dateDetails[date]) dateDetails[date] = new Set();
                    dateDetails[date].add(departmentColors[department]?.approved || "blue");
                });
            });

            // Process reserved dates
            if (details.status === "reserved") {
                dates.forEach((range) => {
                    const [start, end] = range.split(" to ");
                    const dateRange = generateDateRange(start, end);

                    dateRange.forEach((date) => {
                        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
                        if (!dayCell) return;

                        const newEntry = `${employee.split("_").join(" ")} - Department: ${department} (Reserved)`;
                        const existingTooltip = dayCell.getAttribute("data-tooltip") || "";
                        const combinedTooltip = [existingTooltip, newEntry].filter(Boolean).join("\n");
                        dayCell.setAttribute("data-tooltip", combinedTooltip);

                        // Track reserved color
                        if (!dateDetails[date]) dateDetails[date] = new Set();
                        dateDetails[date].add(departmentColors[department]?.reserved || "yellow");
                    });
                });
            }
        });

        // Apply colors to the calendar
        const dayCells = document.querySelectorAll(".day-cell");
        dayCells.forEach((dayCell) => {
            const date = dayCell.dataset.date;
            if (!date || !dateDetails[date]) return;

            const colors = Array.from(dateDetails[date]);
            if (colors.length === 1) {
                dayCell.style.backgroundColor = colors[0];
            } else {
                // Apply gradient for overlapping statuses
                dayCell.style.background = `linear-gradient(to bottom right, ${colors.join(", ")})`;
            }
        });

        console.log("Vacation statuses applied successfully.");
    }

    // Initialize the process
    applyVacationStatuses();
});
