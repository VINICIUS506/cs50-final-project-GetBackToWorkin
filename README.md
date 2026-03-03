# GetBackToWorkin
#### Video Demo: https://youtu.be/_eEswpE0U_U
#### Description:
What my project does:
GetBackToWorkin is essentially a very agressive productivity tool for developers and other people who work using their browsers, and tend to procrastinate or get into distracting websites during work hours, implemented as a Google Chrome Extension. GetBackToWorkin functions in the following way: The user installs the extension, clicks the icon to open a 'settings' interface, in which they can add distracting sites to a 'banned list'. Users should also add their work schedule, meaning work hours and work days, through time and checkbox inputs. Users also have the option to change the color of the 'banned site' pop-up, which is set to red by default.

After saving their settings, every time a user enters one of the URLs on the 'banned list', any clicks on such website will make it so the 'banned site' pop-up appears, alongside one of six loud sounds and one of six messages related to the audio, basically throwing a gag sentence at the user and telling them to go back to work. The extension makes sure to also block the banned website completely, as any clicks will be overwritten by the 'Show Popup' command, which, as the name implies, instantly makes the pop-up message appear. Any subsequent clicks on the website will be blocked, and the user's only option is to click the 'Close' button in the middle of the popup. The 'close' button then redirects them immediately away from the distraction, back to 'google.com'.

In short, what BackToWorkin does is keep you in check during you work hours and work days, using a funny gag message and sound, to be slightly annoying and funny in design. Basically, what differentiates BackToWorkin from other site blocker extensions, is that it is designed to keep your procrastination during work in check, while also calling you out, and trying to get a laugh out of you in the process.


Files:
In total, my project contains five code files: manifest.json, content.js, popup.html, popup.js and styles.css.
And an assets folder for the mp3 files that play alongside the popup message.

manifest.json:
When doing this project, I've learned Chrome extensions need a minimum of two files to work, the manifest.json file, always mandatory, works as the 'blueprint' for the extension, in which all metadata, such as name, version, description, permissions and references to other files, is contained. I've also made sure my project matches '<all-urls>', so it can virtually work on any website the user inputs.

content.js:
This is the other mandatory file, the content script. Its primary function is to interact with the current page in the browser, it is here that we are able to modify content, appearance, and behavior of a web page, using DOM. In the context of my project, this file contains: the code for checking all the conditions of a 'banned' website, the event listener for clicks on banned websites as well as the function to make the pop-up actually appear, with conditions to customize color, read and randomize the audio and message combinations, and finally, append the pop-up to the screen, taking over all other activity in the site, making it essentially obsolete, except, of course, for the 'close' button, which is programmed to redirect them back to 'google.com', as explained previously. Content.js also makes use of the Shadow DOM, which is a web standard that allows for creating hidden DOM trees attached to regular elements. In essence, Shadow DOM prevents the CSS of the own website we are in to leak inside the pop-up DOM, and vice-versa. It is important to note that the Shadow DOM method requires all html and css for the red pop-up to be written inside this 'content.js' file, due to its 'hidden' property.

popup.html:
This file contains all the HTML for the settings page, which, as explained previously, is opened by pressing this extension's icon. Different input types, buttons and other tags inside allow for the following: Writing a URL (ONLY URL formats can be submitted), submitting a URL to the banned list by clicking the 'Add' button, Showing the current banned list (as well as a small 'x' button to remove websites from the list), entering in your work hours through 'time' type inputs, entering in your work days through 'checkbox' type inputs, and saving these time settings with a 'Save Schedule Settings' button. As well as a small customization feature I decided to add last minute, the ability to change the color of the red warning pop-up through a 'color' type input, as well as a button to reset the color back to the default (red).

popup.js:
This file contains all the code directly related to the previously mentioned HTML file, as well as all code directly related to chrome.storage, which is basically the closest thing we have to a NoSQL database in this project. The following logic blocks actually allow the settings page to function as expected:

A logic block for listening to clicking events regarding the 'add-site' button, which checks if the input is empty, then checks if they pasted a valid URL format using Regex, shortens the link if they copy-pasted the whole URL, checks the current list for duplicates, and finally, if all those tests are passed successfully, adds the banned site to the 'banned list' through chrome storage, which will actually make it so 'content.js' can work later.

A logic block to simply remove the sites from the 'banned list', as well as from the interface of our html file, through a small 'x' button, saving the list as a new list to chrome storage and then refreshing the HTML page behind the hood.

A logic block for adding both work hours and days, effectively sending them back to chrome.storage. It filters through the 'days of the week' checkboxes through a loop, and set the starting hour and end wour of a work routine as 'start' and 'end' parameters, which will later also be used by 'content.js' to validate whether the red pop-up should show up or not.


As well as the functions for displaying sites in the banned list, displaying the hours, the days, the customization option for the colors and making sure the reset to default button actually works, and finally making sure changes across different tabs are saved, as well as a small feature to let users submit URLs by pressing 'enter' instead of clicking 'Add'.

styles.css:
The styling page, of course! Specifically for the settings page. I decided to go with a more slick, short, modern vibe. Lots of shades of mostly dark gray and green for the buttons, as well as trying to make sure the divs were well divided and spaced nicely. For the red pop-up, I had to use the style tag inside the Shadow Dom, as I've said earlier. For it, I decided to go for a more 'urgent' feel, a large h1 and p tag, a big close button. As well as making the 'rectangle' be centered in the very middle of the screen, and make it big enough to make sure there is no possible way to ignore it, but not too big to not make it take up the whole screen. I also styled the cursor to indicate the user can only click the red button inside the Shadow DOM. I originally made the pop-up red, to give it even more of an urgent feel, but I decided to give a small customization option to the user and just set red by default, as I said before.

Overall, this was a very nice to make final project, I feel like I'll be using it a lot, and I am grateful for CS50x for helping me start my Computer Science Journey :D

This project was made with the assistance of Google Gemini.

