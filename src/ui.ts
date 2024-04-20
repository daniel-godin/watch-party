// Imports:
import { randomIdGenerator } from "./utils";
import { createRandomTVEpisodeUI } from "./random-TV-episode";
import { createDemoPageUI } from "./watch-party-demo";
import { createWatchPartyUI } from "./watch-party";

// Firebase Imports:
import { auth, db,  } from "./firebase";
import { setDoc, doc, onSnapshot } from "firebase/firestore";

const pageContainer = document.getElementById('pageContainer'); // This is on every html page.  Maybe change to use body later?

function buildUI() {
    // console.log('buildUI function triggered'); // For Debugging Purposes.
    createNavUI();
    createMainUI();
    createFooterUI();
}

buildUI(); // Triggers the UI build.

function createNavUI() {
    pageContainer?.insertAdjacentHTML('beforebegin', `
        <nav id='navTopBar'>
            <a href='./index.html'>Home/Create Watch Party</a>
            <a href='./demo.html'>Demo</a>
            <a href='./watch.html'>Find Watch Party</a>
            <a href='./random.html'>Random TV Episode</a>
        </nav>
    `)
}

function createMainUI() {
    const pathname = window.location.pathname; // Finding pathname to sort which UI function to trigger.
    if (pathname == '/index.html' ||  pathname == '/' || pathname.length === 0) { createIndexPageUI(); };  
    if (pathname == '/demo.html') { createDemoPageUI(); };
    if (pathname == '/watch.html') { createWatchPartyUI(); };
    if (pathname == '/random.html') { createRandomTVEpisodeUI(); };
}

function createFooterUI() {
    const footerDOM = document.getElementById('footer');

    footerDOM?.insertAdjacentHTML('afterend', `
        <p>Created by <a href='http://danielgodin.org'>Daniel Godin</p>
    `)
}

async function createIndexPageUI() {

    pageContainer?.insertAdjacentHTML('afterbegin', `
        <div id='newWatchPartyContainer' class='main-container'>
            <h1>Create Your Watch Party (save the link/unique watch party id)</h1>
            <form id='newWatchPartyForm'>
                <label>Add Your First Movie:
                    <input id='inputTitle' type='text' required>
                </label>
                <button id='btnCreateWatchParty' type='submit'>Create Watch Party</button>
            </form>
        </div>
    `)

    const newWatchPartyForm = document.getElementById('newWatchPartyForm');
    const inputTitle = document.getElementById('inputTitle');

    newWatchPartyForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const watchPartyID = randomIdGenerator();
    
        const watchPartyObj = {
            watchPartyID: watchPartyID,
            dateCreated: "date string",
            dateOfWatchParty: 'date string',
            guests: 'array of guest names in strings',            
        }

        const titleID = randomIdGenerator();

        const newTitleObject = {
            id: titleID,
            title: inputTitle.value,
            links: {
                tmdb: "https://link.com",
            },
            votes: {
                yes: 0,
                maybe: 0,
                no: 0
            }
        } 

        try {
            setDoc(doc(db, 'watchParties', watchPartyID), watchPartyObj);
            setDoc(doc(db, 'watchParties', watchPartyID, 'titleOptions', titleID), newTitleObject);
            console.log("Watch Party Document written with ID: ", watchPartyID);
            console.log("Title Doc created with ID: ", titleID);

            // Should redirect to newly created watch party page.

            pageContainer.innerHTML = '';

            pageContainer?.insertAdjacentHTML('afterbegin', `
                <p>Creating Your Watch Party Page.  You will be redirected in 3 seconds.</p>
            `)

            setTimeout(() => {

                const docRef = doc(db, 'watchParties', watchPartyID); 
                onSnapshot(docRef, (snapshot) => {
                    if (snapshot.exists()) {
                        console.log('what is the origin: ', window.location.origin);
    
                        let baseURL = window.location.origin;
                    
                        let partyURL = 'watch.html?' + watchPartyID;
                    
                        let fullPartyURL = new URL(partyURL, baseURL);
                    
                        window.location.replace(fullPartyURL);
                    } else {
                        console.log('snapshot did not load correctly');
                    }
                })

            }, 3000)





        } catch (e) {
            console.error("Error adding document: ", e);
        }


    })
}