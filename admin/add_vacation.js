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

    const employees = {
        technical: [
            { name: "Aleksandrs P.", value: "Aleksandrs_P|technical" },
            { name: "Jūlija B.", value: "Jūlija_B|technical" },
            { name: "Anastasija V.", value: "Anastasija_V|technical" }
        ],
        analytics: [
            { name: "Ruslans P.", value: "Ruslans_P|analytics" },
            { name: "Jelizaveta M.", value: "Jelizaveta_M|analytics" },
            { name: "Daniels P.", value: "Daniels_P|analytics" }
        ],
        vip: [
            { name: "Aleksandrs P.", value: "Aleksandrs_P|vip" },
            { name: "Anastasija K.", value: "Anastasija_K|vip" },
            { name: "Gatis J.", value: "Gatis_J|vip" },
            { name: "Ivo J.", value: "Ivo_J|vip" },
            { name: "Jevgenijs B.", value: "Jevgenijs_B|vip" },
            { name: "Jūlija J.", value: "Jūlija_J|vip" },
            { name: "Jurijs K.", value: "Jurijs_K|vip" },
            { name: "Kyada Hirenkumar H.", value: "Kyada_Hirenkumar_H|vip" },
            { name: "Laura P.", value: "Laura_P|vip" },
            { name: "Mari O.", value: "Mari_O|vip" },
            { name: "Monyque A. V.", value: "Monyque_A_V|vip" },
            { name: "Nadezhda B.", value: "Nadezhda_B|vip" },
            { name: "Nataļja T.", value: "Nataļja_T|vip" },
            { name: "Nikolajs P.", value: "Nikolajs_P|vip" },
            { name: "Olga D.", value: "Olga_D|vip" },
            { name: "Olga V. Š.", value: "Olga_V_Š|vip" },
            { name: "Tatjana T.", value: "Tatjana_T|vip" },
            { name: "Thaisa X.", value: "Thaisa_X|vip" },
            { name: "Achraf T. N.", value: "Achraf_T_N|vip" },
            { name: "Edgars S.", value: "Edgars_S|vip" },
            { name: "Dēvids B.", value: "Dēvids_B|vip" },
            { name: "Laura S. S.", value: "Laura_S_S|vip" },
            { name: "Aleksandrs T.", value: "Aleksandrs_T|vip" },
            { name: "Vjaceslavs V.", value: "Vjaceslavs_V|vip" },
            { name: "Ilja N.", value: "Ilja_N|vip" },
            { name: "Eduard E.", value: "Eduard_E|vip" },
            { name: "Maksims R.", value: "Maksims_R|vip" },
            { name: "Eriks K.", value: "Eriks_k|vip" },
        ],
        other: [
            { name: "Aliaksandryna I.", value: "Aliaksandryna_I|other" },
            { name: "Vladislavs", value: "Vladislavs|other" },
            { name: "Krystina L.", value: "Krystina L.|other" },
            { name: "Aliaksandr L.", value: "Aliaksandr_L|other" },
            { name: "Eduards P.", value: "Eduards_P|other" },
            { name: "Romans S.", value: "Romans_S|other" }
        ]
    };

    // Populate the employee select dropdown
    const employeeSelect = document.getElementById("employee-select");

    Object.keys(employees).forEach((department) => {
        const optGroup = document.createElement("optgroup");
        optGroup.label = department.charAt(0).toUpperCase() + department.slice(1);

        employees[department].forEach((employee) => {
            const option = document.createElement("option");
            option.value = employee.value;
            option.textContent = employee.name;
            optGroup.appendChild(option);
        });

        employeeSelect.appendChild(optGroup);
    });

    // Handle calendar cell selection
    const selectedDates = new Set();
    document.getElementById("calendar").addEventListener("click", (event) => {
        if (event.target.classList.contains("day-cell")) {
            const date = event.target.dataset.date;

            if (selectedDates.has(date)) {
                selectedDates.delete(date);
                event.target.style.backgroundColor = ""; // Reset color
            } else {
                selectedDates.add(date);
                event.target.style.backgroundColor = "yellow"; // Highlight selected date
            }
        }
    });

    // Handle the Add Vacation button click
    const addVacationButton = document.getElementById("add-vacation");

    addVacationButton.addEventListener("click", () => {
        const selectedEmployee = employeeSelect.value;

        if (!selectedEmployee) {
            alert("Please select an employee before adding a vacation.");
            return;
        }

        if (selectedDates.size === 0) {
            alert("Please select at least one date from the calendar.");
            return;
        }

        const [employeeName, department] = selectedEmployee.split("|");

        // Convert selected dates to a single range
        const sortedDates = Array.from(selectedDates).sort((a, b) => new Date(a) - new Date(b));
        const startDate = sortedDates[0];
        const endDate = sortedDates[sortedDates.length - 1];
        const dateRange = `${startDate} to ${endDate}`;

        const ref = database.ref(`vacations/${employeeName}`);

        ref.once("value")
            .then((snapshot) => {
                const existingData = snapshot.val() || { dates: [], department, status: "reserved" };

                // Ensure dates is an array
                if (!Array.isArray(existingData.dates)) {
                    existingData.dates = [];
                }

                // Append new date range to existing dates
                existingData.dates.push(dateRange);

                return ref.set(existingData);
            })
            .then(() => {
                alert(`Vacation added for ${employeeName}!`);
                selectedDates.clear();

                // Refresh the page to reapply calendar coloring
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error adding vacation: ", error);
                alert("Failed to add vacation. Please try again.");
            });
    });
});
