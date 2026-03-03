document.addEventListener('DOMContentLoaded', () => {
    // Logic for reading/displaying sites, hours, and days on startup:
    displaySites();
    displayHours();
    displayDays();

    // Logic for adding sites to the banned list:
    document.getElementById("add-site").addEventListener("click", () => {
        const input = document.getElementById("site-input");
        let newSite = input.value.trim().toLowerCase();

        // Check if it's empty
        if (!newSite) {
            alert("Please enter a website URL.");
            return;
        }

        // If they pasted a full URL, extract just the hostname
        try {
                if (newSite.includes("://")) {
                    newSite = new URL(newSite).hostname;
                }
                else if (newSite.includes("/")) {
                    // Handles cases such as 'youtube.com/shorts'
                    newSite = newSite.split('/')[0];
                }
            } catch (e) {
                console.log("Not a full URL, treat as plain text.");
            }

            // Remove "www." or other subdomains
            const parts = newSite.split('.');
            if (parts.length > 2) {
                const secondToLast = parts[parts.length - 2];
                const multiPartTLDs = ["co", "com", "org", "net", "edu", "gov"];

                if (multiPartTLDs.includes(secondToLast)) {
                    // For example: keep google.co.uk. For sites that need multi-part domains to work.
                    newSite = parts.slice(-3).join('.');
                } else {
                    newSite = parts.slice(-2).join('.');
                }
            }
            // Test with regex to ensure it at least looks like a website URL
            const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,24}$/;
            if (!domainRegex.test(newSite)) {
                alert("Please enter a valid domain (e.g., youtube.com).");
                input.value = "";
                return;
            }

            // Get the current list
            chrome.storage.local.get(["bannedSites"]).then((result) => {
                const currentList = result.bannedSites || [];

                // Check the storage for duplicates
                if(currentList.includes(newSite)) {
                    alert("This site is already in your banned list!");
                    input.value = "";
                    return;
                }

                // Save, then send the new updated list back to storage
                currentList.push(newSite);
                chrome.storage.local.set({ bannedSites: currentList }).then(() => {
                    console.log("New site saved: ", newSite);
                    input.value = ""; // Clear the input field so user can keep adding sites

                    // Display function call goes here!
                    displaySites();
                });
                
            });
        });
    });

    // Option to add site by pressing the enter key
    document.getElementById("site-input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            document.getElementById("add-site").click();
        }
    });

    // Remove site logic:
    // Listen for clicks on the container
    document.getElementById("site-list").addEventListener("click", (event) => {
        // Identify the target (if click was on class remove-btn)
        if (event.target.classList.contains("remove-btn")) {
            const siteToRemove = event.target.getAttribute("data-site");

            // If it was a delete button, get the site name from "data-site"
            // then pull the current list we stored
            chrome.storage.local.get(["bannedSites"]).then((result) => {
                let currentList = result.bannedSites || [];

                // Filter out that specific site by keeping every other site that is not it
                currentList = currentList.filter(site => site !== siteToRemove);

                // Save the new list and refresh (aka calling displaySites() again)
                chrome.storage.local.set({ bannedSites: currentList }).then(() => {
                    console.log("Site removed: ", siteToRemove);
                    displaySites();
                });
            });
        }
    });

    // Logic for adding work hours (start-end) and days
    document.getElementById("save-settings").addEventListener("click", () => {
        // Hours:
        const start = document.getElementById("start-hour").value;
        const end = document.getElementById("end-hour").value;

        // Days:
        const dayCheckboxes = document.querySelectorAll(".day-checkbox");
        const selectedDays = []; // Days should be stored in an array

        // Filter for checked boxes (loop)
        dayCheckboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                selectedDays.push(checkbox.value); // Store the name of the day inside the list
            }
        });

        // Make sure inputs aren't empty!!
        if (start !== "" && end !== ""){
            const settings = {
                workHours: { start: start, end: end },
                workDays: selectedDays
            };

            // Save
            chrome.storage.local.set(settings).then(() => {
                console.log("Work hours set!");
                alert("Settings saved!"); // Let user know their input was a success
            });

        } else {
            alert("Please enter both start and end hours");
        }
    });

// Read and display logic:
function displaySites() {
    chrome.storage.local.get(["bannedSites"]).then((result) => {
        const list = result.bannedSites || [];
        const listDiv = document.getElementById("site-list");

        // Clear whatever is currently showing in the HTML
        listDiv.innerHTML = "";

        // Loop through the list and create a "site row" for each site
        list.forEach((site) => {
            const item = document.createElement("div");
            item.className = "site-item";
            item.innerHTML = `
                <span>${site}</span>
                <span class="remove-btn" data-site="${site}">x</span>
            `;
            listDiv.appendChild(item);
        });
    });
}

// Logic for reading/displaying hours:
function displayHours() {
    chrome.storage.local.get(["workHours"]).then((result) => {
        if (result.workHours) {
            document.getElementById("start-hour").value = result.workHours.start;
            document.getElementById("end-hour").value = result.workHours.end;
        }
    });
}

// Logic for reading/displaying days:
function displayDays() {
    chrome.storage.local.get(["workDays"]).then((result) => {
        const savedDays = result.workDays || [];
        const dayCheckboxes = document.querySelectorAll(".day-checkbox");

        dayCheckboxes.forEach((checkbox) => {
            if (savedDays.includes(checkbox.value)) {
                checkbox.checked = true;
            }
            else {
                checkbox.checked = false;
            }
        });
    });
}

// Make sure all changes on the settings page are universal across different tabs
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.bannedSites) {
        displaySites(); // Refresh the list automatically
    }
});


// Load saved color on startup
chrome.storage.local.get(["themeColor"]).then((result) => {
    if (result.themeColor) {
        document.getElementById("theme-color-picker").value = result.themeColor;
    }
});

// Save color as soon as user picks one
document.getElementById("theme-color-picker").addEventListener("input", (e) => {
    const newColor = e.target.value;
    chrome.storage.local.set({ themeColor: newColor});
});

// Reset to default
document.getElementById("reset-color").addEventListener("click", () => {
    const defaultRed = "#ff0000";
    document.getElementById("theme-color-picker").value = defaultRed;
    chrome.storage.local.set({ themeColor: defaultRed });
});