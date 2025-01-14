document.addEventListener("DOMContentLoaded", () => {
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

    const reservedVacationsList = document.getElementById("reserved-vacations-list");
    const approvedVacationsList = document.getElementById("approved-vacations-list");

    // Fetch and display reserved vacations
  
function loadReservedVacations() {
    database.ref("vacations").once("value")
        .then((snapshot) => {
            const vacations = snapshot.val();

            if (!vacations) {
                reservedVacationsList.innerHTML = "<p>No reserved vacations found.</p>";
                return;
            }

            const reservedByMonth = {};

            // Helper function to split date range into month-specific ranges
            function splitDateRangeByMonth(startDate, endDate) {
                const splitRanges = [];
                let currentStart = new Date(startDate);

                while (currentStart <= endDate) {
                    const currentEnd = new Date(
                        currentStart.getFullYear(),
                        currentStart.getMonth() + 1,
                        0 // Last day of the current month
                    );

                    // Ensure the current end date doesn't exceed the actual end date
                    splitRanges.push({
                        start: new Date(currentStart),
                        end: currentEnd > endDate ? endDate : currentEnd,
                    });

                    // Move to the next month
                    currentStart = new Date(currentStart.getFullYear(), currentStart.getMonth() + 1, 1);
                }

                return splitRanges;
            }

            // Group vacations by month
            Object.entries(vacations).forEach(([employee, data]) => {
                if (data.dates && data.status === "reserved") {
                    data.dates.forEach((dateRange) => {
                        const [start, end] = dateRange.split(" to ");
                        const startDate = new Date(start);
                        const endDate = new Date(end);

                        const splitRanges = splitDateRangeByMonth(startDate, endDate);

                        splitRanges.forEach(({ start: rangeStart, end: rangeEnd }) => {
                            const monthName = rangeStart.toLocaleString('default', { month: 'long' });
                            const year = rangeStart.getFullYear();
                            const key = `${monthName} ${year}`;

                            if (!reservedByMonth[key]) {
                                reservedByMonth[key] = [];
                            }

                            reservedByMonth[key].push({
                                employee: employee.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2"),
                                startDate: rangeStart,
                                dateRange: `${rangeStart.toLocaleDateString("en-GB")} to ${rangeEnd.toLocaleDateString("en-GB")}`,
                            });
                        });
                    });
                }
            });

            // Sort months and entries within each month
            const sortedMonths = Object.keys(reservedByMonth).sort((a, b) => {
                const [monthA, yearA] = a.split(" ");
                const [monthB, yearB] = b.split(" ");
                const dateA = new Date(`${monthA} 1, ${yearA}`);
                const dateB = new Date(`${monthB} 1, ${yearB}`);
                return dateA - dateB;
            });

            // Sort entries within each month by start date
            Object.keys(reservedByMonth).forEach((monthKey) => {
                reservedByMonth[monthKey].sort((a, b) => a.startDate - b.startDate);
            });

            // Create columns for six months
            const leftColumn = document.createElement("div");
            const rightColumn = document.createElement("div");

            leftColumn.style.flex = "1";
            rightColumn.style.flex = "1";

            sortedMonths.forEach((monthKey, index) => {
    // Create a container for the month
    const monthWrapper = document.createElement("div");
    monthWrapper.classList.add("month-wrapper"); // Add a class for styling
    monthWrapper.style.padding = "10px";
    monthWrapper.style.border = "1px solid #444"; // Border to separate each month
    monthWrapper.style.borderRadius = "8px";
    monthWrapper.style.marginBottom = "20px"; // Spacing between months
    monthWrapper.style.backgroundColor = "#2c2c2c"; // Background color for clarity

    const monthHeader = document.createElement("h3");
    monthHeader.textContent = monthKey;

    const monthList = document.createElement("ul");
    reservedByMonth[monthKey].forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.employee} - ${item.dateRange}`;
        monthList.appendChild(listItem);
    });

    monthWrapper.appendChild(monthHeader);
    monthWrapper.appendChild(monthList);

    if (index % 2 === 0) {
        leftColumn.appendChild(monthWrapper);
    } else {
        rightColumn.appendChild(monthWrapper);
    }
});

            // Clear and populate the reserved vacations list
            reservedVacationsList.innerHTML = "";
            reservedVacationsList.style.display = "flex";
            reservedVacationsList.style.gap = "20px";
            reservedVacationsList.appendChild(leftColumn);
            reservedVacationsList.appendChild(rightColumn);
        })
        .catch((error) => {
            console.error("Error loading reserved vacations: ", error);
        });
}






    // Fetch and display approved vacations
    function loadApprovedVacations() {
        database.ref("vacations").once("value")
            .then((snapshot) => {
                const vacations = snapshot.val();

                if (!vacations) {
                    approvedVacationsList.innerHTML = "<p>No approved vacations found.</p>";
                    return;
                }

                const approvedList = [];

                Object.entries(vacations).forEach(([employee, data]) => {
                    if (data.approved) {
                        data.approved.forEach((dateRange) => {
                            approvedList.push({
                                employee: employee.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2"),
                                department: data.department,
                                dateRange
                            });
                        });
                    }
                });

                // Sort by start date
                approvedList.sort((a, b) => new Date(a.dateRange.split(" to ")[0]) - new Date(b.dateRange.split(" to ")[0]));

                // Create columns
                const leftColumn = document.createElement("div");
                const rightColumn = document.createElement("div");

                leftColumn.style.flex = "1";
                rightColumn.style.flex = "1";

                approvedList.forEach((item, index) => {
                    const formattedDateRange = item.dateRange.replace(/(\d{4})-(\d{2})-(\d{2})/g, "$3.$2.$1");
                    const listItem = document.createElement("li");
                    listItem.textContent = `${item.employee} - ${formattedDateRange}`;

                    if (index % 2 === 0) {
                        leftColumn.appendChild(listItem);
                    } else {
                        rightColumn.appendChild(listItem);
                    }
                });

                // Clear and populate the approved vacations list
                approvedVacationsList.innerHTML = "";
                approvedVacationsList.style.display = "flex";
                approvedVacationsList.style.gap = "20px";
                approvedVacationsList.appendChild(leftColumn);
                approvedVacationsList.appendChild(rightColumn);
            })
            .catch((error) => {
                console.error("Error loading approved vacations: ", error);
            });
    }

    // Initial load of reserved and approved vacations
    loadReservedVacations();
    loadApprovedVacations();
});
