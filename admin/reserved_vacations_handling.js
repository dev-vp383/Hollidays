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

    const reserveDropdown = document.getElementById("approve-dropdown");
    const approveButton = document.getElementById("approve-button");
    const deleteButton = document.getElementById("delete-button");

    // Load all reserved vacations into the dropdown
    function loadReservedVacations() {
        reserveDropdown.innerHTML = "<option value='' disabled selected>Select a Reserved Vacation</option>";

        database.ref("vacations").once("value")
            .then((snapshot) => {
                const vacations = snapshot.val();

                if (!vacations) {
                    return;
                }

                const reservedList = [];

                Object.entries(vacations).forEach(([employee, data]) => {
                    if (data.dates) {
                        data.dates.forEach((dateRange) => {
                            reservedList.push({
                                employee,
                                department: data.department,
                                dateRange,
                                status: data.status
                            });
                        });
                    }
                });

                reservedList
                    .filter((item) => item.status === "reserved")
                    .sort((a, b) => new Date(a.dateRange.split(" to ")[0]) - new Date(b.dateRange.split(" to ")[0]))
                    .forEach((item) => {
                        const option = document.createElement("option");
                        option.value = JSON.stringify(item);
                        option.textContent = `${item.employee} (${item.department}) - ${item.dateRange}`;
                        reserveDropdown.appendChild(option);
                    });
            })
            .catch((error) => {
                console.error("Error loading reserved vacations: ", error);
            });
    }

    // Approve selected vacation
    approveButton.addEventListener("click", () => {
        const selectedOption = reserveDropdown.value;

        if (!selectedOption) {
            alert("Please select a vacation to approve.");
            return;
        }

        const selectedVacation = JSON.parse(selectedOption);

        const vacationRef = database.ref(`vacations/${selectedVacation.employee}`);

        vacationRef.once("value")
            .then((snapshot) => {
                const data = snapshot.val();

                if (!data || !data.dates) {
                    return;
                }

                // Move the selected date range to approved list
                const remainingDates = data.dates.filter((range) => range !== selectedVacation.dateRange);
                const approvedList = data.approved || [];

                approvedList.push(selectedVacation.dateRange);

                return vacationRef.set({
                    ...data,
                    dates: remainingDates,
                    approved: approvedList
                });
            })
            .then(() => {
                alert("Vacation approved successfully!");
                loadReservedVacations();
            })
            .catch((error) => {
                console.error("Error approving vacation: ", error);
            });
    });

    // Delete selected vacation
    deleteButton.addEventListener("click", () => {
        const selectedOption = reserveDropdown.value;

        if (!selectedOption) {
            alert("Please select a vacation to delete.");
            return;
        }

        const selectedVacation = JSON.parse(selectedOption);

        const vacationRef = database.ref(`vacations/${selectedVacation.employee}`);

        vacationRef.once("value")
            .then((snapshot) => {
                const data = snapshot.val();

                if (!data || !data.dates) {
                    return;
                }

                // Remove the selected date range
                const remainingDates = data.dates.filter((range) => range !== selectedVacation.dateRange);

                // Only update the database with remaining dates, do not delete the entire record
                return vacationRef.set({
                    ...data,
                    dates: remainingDates
                });
            })
            .then(() => {
                alert("Vacation deleted successfully!");
                loadReservedVacations();
            })
            .catch((error) => {
                console.error("Error deleting vacation: ", error);
            });
    });

    // Initial load of reserved vacations
    loadReservedVacations();
});
