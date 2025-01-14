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

                const reservedList = [];

                Object.entries(vacations).forEach(([employee, data]) => {
                    if (data.dates && data.status === "reserved") {
                        data.dates.forEach((dateRange) => {
                            reservedList.push({
                                employee: employee.replace(/_/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2"),
                                department: data.department,
                                dateRange
                            });
                        });
                    }
                });

                // Sort by start date
                reservedList.sort((a, b) => new Date(a.dateRange.split(" to ")[0]) - new Date(b.dateRange.split(" to ")[0]));

                // Create columns
                const leftColumn = document.createElement("div");
                const rightColumn = document.createElement("div");

                leftColumn.style.flex = "1";
                rightColumn.style.flex = "1";

                reservedList.forEach((item, index) => {
                    const formattedDateRange = item.dateRange.replace(/(\d{4})-(\d{2})-(\d{2})/g, "$3.$2.$1");
                    const listItem = document.createElement("li");
                    listItem.textContent = `${item.employee} - ${formattedDateRange}`;

                    if (index % 2 === 0) {
                        leftColumn.appendChild(listItem);
                    } else {
                        rightColumn.appendChild(listItem);
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