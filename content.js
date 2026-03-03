function getMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
}

// Check the logbook
chrome.storage.local.get(["bannedSites", "workHours", "workDays", "themeColor"]).then((result) => {
    // Get the banned list (or an empty list if it does not exist yet)
    const bannedList = result.bannedSites || [];
    // Get the current website
    const currentSite = window.location.hostname;

    // Get the current day of the week and hour of day, from the user's computer
    const now = new Date();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = daysOfWeek[now.getDay()]; // returns 0 (Sunday) to 6 (Saturday)
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes(); // Returns e.g. "09:30" into 570 (total minutes)

    // Conditons for event listener:
    const isBannedSite = bannedList.some(site => currentSite.includes(site));
    const isWorkDay = result.workDays ? result.workDays.includes(currentDay) : true;
    const isWorkHour = result.workHours ? (currentTotalMinutes >= getMinutes(result.workHours.start) &&
                                           currentTotalMinutes < getMinutes(result.workHours.end)) : true;
    const userColor = result.themeColor || "#ff0000";

    console.log("Checking conditions...");
    console.log("Site matches:", isBannedSite);
    console.log("Day matches:", isWorkDay, `(Today is ${currentDay})`);
    console.log("Hour matches:", isWorkHour, `(Total Minutes: ${currentTotalMinutes})`);

    // Only IF all conditions are met, set up event listener for clicks
    // And then show the red pop-up
    if (isBannedSite && isWorkDay && isWorkHour) {
        console.log("Banned site detected. Should activate logic.");
        document.addEventListener("click", function(event) {
            const host = document.getElementById("get-back-to-workin-host");

            if (!host) {
                event.stopImmediatePropagation();
                event.preventDefault();
            }

            showPopup(userColor);

        }, true);
    }
});


// Pop-up logic:
function showPopup(bgColor) {
    // Check if the pop-up already exists
    if (document.getElementById("get-back-to-workin-host")) {
        return; // Exit if pop-up is already on the screen
    }

    // Logic to handle contrast (Color settings)
    // Calculate if color is "light" or "dark"
    const r = parseInt(bgColor.substr(1,2), 16);
    const g = parseInt(bgColor.substr(3,2), 16);
    const b = parseInt(bgColor.substr(5,2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    const textColor = (brightness > 125) ? "black" : "white";
    const buttonBg = (brightness > 125) ? "black" : "white";
    const buttonText = bgColor; // Text on the button should also match background color

    // Define the rotation of (sounds + messages)
    const rotations = [
        {
            msg: "GET BACK TO WORK!",
            sub: "Stop slacking or you're fired!",
            sound: "assets/benson.mp3"
        },
        {
            msg: "HOW MANY TIMES?!",
            sub: "When are you going to learn your lesson, old man?! Back to work!",
            sound:"assets/oldman.mp3"
        },
        {
            msg: "JUMPSCARE!",
            sub: "Procrastinating again? Get jumpscared. Back to work!",
            sound: "assets/fnaf.mp3"
        },
        {
            msg: "GAME OVER",
            sub: "Slackers don't get any 1-ups, game over.",
            sound: "assets/mario.mp3"
        },
        {
            msg: "BUSTED!",
            sub: "Caught you in the middle of the act again, eh?",
            sound: "assets/gta.mp3"
        },
        {
            msg: "I KNOW IT!",
            sub: "You're trying to doom scroll during work hours again, I just can't prove it yet...",
            sound: "assets/dexter.mp3"
        }
    ];

    // Pick a random option from the rotation
    const choice = rotations[Math.floor(Math.random() * rotations.length)];

    // Play the sound
    const audio = new Audio(chrome.runtime.getURL(choice.sound));
    // Some websites might block sound, especially if you haven't clicked anything yet
    audio.play().catch(error => console.log("Audio play blocked until user interacts with page."));

    // Actually create the pop-up
    const host = document.createElement("div");
    host.id = "get-back-to-workin-host";
    host.tabIndex = 0;
    document.body.appendChild(host);
    host.focus();

    // Create a shadow root (prevents css from leaking in or out)
    const shadow = host.attachShadow({mode: "closed"});

    // Create the overlay inside the shadow
    const overlay = document.createElement("div");
    overlay.id = "popup-overlay";
    overlay.innerHTML = `
    <style>
        #popup-overlay {
            all: initial !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            height: 100vh !important;
            width: 100vw !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            background-color: transparent !important;
            z-index: 2147483647 !important;  /* Make sure the z-index is high enough to be on top of the other elements of the screen */
            pointer-events: auto !important; /* Ensures the user needs to interact with the close button! */
            cursor: not-allowed !important;
            margin: 0 !important;
            padding: 0 !important;
        }   

        .popup-content {
            all: initial !important;
            background-color: ${bgColor} !important;
            color: ${textColor} !important;
            width: 70vw !important;
            max-width: 1000px;
            height: 800px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 60px !important;
            text-align: center !important;
            border-radius: 60px !important; /* Rounded corners */
            cursor: default !important;
            box-sizing: border-box !important;
            border: none !important;
        }

        .popup-content h1 {
            all: initial !important;
            display: block !important;
            color: ${textColor} !important;
            font-size: 100px !important;
            line-height: 1.1 !important;
            margin: 0 0 20px 0 !important;
            text-transform: uppercase !important;
            font-family: 'Arial Black', sans-serif !important;
            letter-spacing: -2px !important!;
            text-align: center !important;
        }

        .popup-content p {
            all: initial !important;
            display: block !important;
            color: ${textColor} !important;
            font-size: 70px !important;
            line-height: 1.4 !important;
            margin: 0 0 40px 0 !important;
            font-family: sans-serif !important;
            text-align: center !important;
            max-width: 80% !important;
        }

        #close-popup {
            all: initial !important;
            display: inline-block !important;
            background-color: ${buttonBg} !important;
            color: ${buttonText} !important;
            font-weight: bold !important;
            padding: 20px 40px !important;
            border: none !important;
            cursor: pointer !important;
            font-size: 24px !important;
            margin-top: 30px !important;
            border-radius: 10px !important;
            font-family: sans-serif !important;
        }
    </style>
    <div class="popup-content">
        <h1>${choice.msg}</h1>
        <p>${choice.sub}</p>
        <button id="close-popup">CLOSE</button>
    </div>
    `;

    shadow.appendChild(overlay);

    // Make sure the button closes the pop-up and redirects the user to google
    shadow.getElementById("close-popup").addEventListener("click", function(e) {
        e.stopPropagation();
        window.location.href = "https://www.google.com";
    });
}
