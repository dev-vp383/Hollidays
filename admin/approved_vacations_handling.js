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

    const approvedDropdown = document.getElementById("delete-approved-dropdown");
    const deleteApprovedButton = document.getElementById("delete-approved-button");
    const forceReserveButton = document.getElementById("force-reserve-button");

    // Load all approved vacations into the dropdown
    function loadApprovedVacations() {
        approvedDropdown.innerHTML = "<option value='' disabled selected>Select an Approved Vacation</option>";

        database.ref("vacations").once("value")
            .then((snapshot) => {
                const vacations = snapshot.val();

                if (!vacations) {
                    return;
                }

                const approvedList = [];

                Object.entries(vacations).forEach(([employee, data]) => {
                    if (data.approved) {
                        data.approved.forEach((dateRange) => {
                            approvedList.push({
                                employee,
                                department: data.department,
                                dateRange
                            });
                        });
                    }
                });

                approvedList
                    .sort((a, b) => new Date(a.dateRange.split(" to ")[0]) - new Date(b.dateRange.split(" to ")[0]))
                    .forEach((item) => {
                        const option = document.createElement("option");
                        option.value = JSON.stringify(item);
                        option.textContent = `${item.employee} (${item.department}) - ${item.dateRange}`;
                        approvedDropdown.appendChild(option);
                    });
            })
            .catch((error) => {
                console.error("Error loading approved vacations: ", error);
            });
    }

    // Handle delete approved vacation
    deleteApprovedButton.addEventListener("click", () => {
        const selectedOption = approvedDropdown.value;

        if (!selectedOption) {
            alert("Please select an approved vacation to delete.");
            return;
        }

        const selectedVacation = JSON.parse(selectedOption);
        const vacationRef = database.ref(`vacations/${selectedVacation.employee}`);

        vacationRef.once("value")
            .then((snapshot) => {
                const data = snapshot.val();

                if (!data || !data.approved) {
                    return;
                }

                // Remove the selected date range from the approved list
                const remainingApproved = data.approved.filter((range) => range !== selectedVacation.dateRange);

                // Update the database with the remaining approved vacations
                return vacationRef.set({
                    ...data,
                    approved: remainingApproved
                });
            })
            .then(() => {
                alert("Approved vacation deleted successfully!");
                loadApprovedVacations();
            })
            .catch((error) => {
                console.error("Error deleting approved vacation: ", error);
            });
    });

    // Handle force reserve vacation
    forceReserveButton.addEventListener("click", () => {
        const selectedOption = approvedDropdown.value;

        if (!selectedOption) {
            alert("Please select an approved vacation to force reserve.");
            return;
        }

        const selectedVacation = JSON.parse(selectedOption);
        const vacationRef = database.ref(`vacations/${selectedVacation.employee}`);

        vacationRef.once("value")
            .then((snapshot) => {
                const data = snapshot.val();

                if (!data || !data.approved) {
                    return;
                }

                // Remove the selected date range from the approved list
                const remainingApproved = data.approved.filter((range) => range !== selectedVacation.dateRange);

                // Add the selected date range to the reserved list
                const updatedReserved = data.dates || [];
                updatedReserved.push(selectedVacation.dateRange);

                // Update the database with the new approved and reserved vacations
                return vacationRef.set({
                    ...data,
                    approved: remainingApproved,
                    dates: updatedReserved,
                    status: "reserved"
                });
            })
            .then(() => {
                alert("Vacation successfully changed to reserved!");
                loadApprovedVacations();
            })
            .catch((error) => {
                console.error("Error changing vacation to reserved: ", error);
            });
    });

    // Initial load of approved vacations
    loadApprovedVacations();
});
