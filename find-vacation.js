// One-time script to find your last added reserved vacation
// Run this in the browser console on your admin page

// Firebase Configuration (same as your admin)
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

// Function to find your recent reserved vacations
async function findMyLastVacation() {
    try {
        console.log("🔍 Searching for your recent reserved vacations...");
        
        const ref = database.ref("vacations");
        const snapshot = await ref.get();
        const vacationData = snapshot.val() || {};
        
        console.log("📅 === YOUR RECENT RESERVED VACATIONS (2025) ===");
        
        let foundAny = false;
        
        // Look for recent reserved vacations (2025 dates)
        Object.entries(vacationData).forEach(([employee, info]) => {
            if (info.dates && info.dates.length > 0) {
                info.dates.forEach(dateRange => {
                    if (dateRange.includes("2025")) {
                        console.log(`👤 ${employee}: ${dateRange} (reserved)`);
                        foundAny = true;
                    }
                });
            }
        });
        
        if (!foundAny) {
            console.log("❌ No reserved vacations found for 2025");
        } else {
            console.log("✅ Found the above reserved vacations!");
        }
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

// Run the function
findMyLastVacation();
