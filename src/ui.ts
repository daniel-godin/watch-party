// Imports:
import { randomIdGenerator } from "./utils";
import { createRandomTVEpisodeUI } from "./random-TV-episode";
import { createDemoPageUI } from "./watch-party-demo";
import { createWatchPartyUI } from "./watch-party";
import { createAuthPageUI } from "./auth";

// Firebase Imports:
import { auth, db,  } from "./firebase";
import { setDoc, doc, onSnapshot } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged, signOut, } from "firebase/auth";

// Global Variables:

export const pageContainer = document.getElementById('pageContainer'); // This is on every html page.  Maybe change to use body later?

// Code / Functionality:

onAuthStateChanged(auth, (user) => {
    if (user) {
        buildUI(user);
    }
    if (!user) {
        signInAnonymously(auth)
        .then((user) => {
            // Signed in..
            console.log('Sign In Anonymously Triggered');
            console.log('Anonymous User: ', user.user.uid);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
        });
    }
})

function buildUI(user) {
    createNavUI();
    createMainUI(user);
    createFooterUI(user);
}

function createNavUI() {

    pageContainer?.insertAdjacentHTML('beforebegin', `
        <nav id='navTopBar'>
            <a href='./index.html'>Home/Create Watch Party</a>
            <a href='./demo.html'>Demo</a>
            <a href='./watch.html'>Find Watch Party</a>
            <a href='./random.html'>Random TV Episode</a>
            <a href='./auth.html'>Sign In / Sign Up</a>
        </nav>
    `)
}

function createMainUI(user) {
    const pathname = window.location.pathname; // Finding pathname to sort which UI function to trigger.
    if (pathname == '/index.html' ||  pathname == '/' || pathname.length === 0) { createIndexPageUI(); };  
    if (pathname == '/demo.html') { createDemoPageUI(); };
    if (pathname == '/watch.html') { createWatchPartyUI(); };
    if (pathname == '/random.html') { createRandomTVEpisodeUI(user); };
    if (pathname == '/auth.html') { createAuthPageUI(user); };
}

function createFooterUI(user) {
    let userID = user.uid;
    // if (!userID) { userID = 'Not Logged In'; }
    pageContainer?.insertAdjacentHTML('afterend', `
    <footer>
        <p>Created by <a href='http://danielgodin.org' target='_blank'>Daniel Godin</a></p>
        <p>All Movie and TV Data is from <a href='https://themoviedb.org' target="_blank">The Movie DB</a></p>
        <p>Your User ID:  ${userID}</p>
        <button type='button' id='btnSignOut'>Sign Out</button>
    </footer>
    `)

    const btnSignOut = document.getElementById('btnSignOut');
    btnSignOut?.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
            console.log('Sign-out Successful');
            pageContainer.innerHTML = '';
            pageContainer?.insertAdjacentHTML('afterbegin', `
                <p>Signed Out Successfully.  This page is refreshing in 3 seconds.</p>
            `)
            setTimeout(() => {
                location.reload();
            }, (3000));
            // Sign-out successful.
          }).catch((error) => {
            console.error('Sign Out Error: ', error.code, error.message);
            // An error happened.
          });
    })
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