// Imports:
import { randomIdGenerator } from "./utils";

// Firebase Imports:
import { auth, db,  } from "./firebase";
import { setDoc, doc, getDoc, onSnapshot, updateDoc, arrayUnion } from "firebase/firestore";

const pageContainer = document.getElementById('pageContainer');

function buildUI() {
    createNavUI();
    createMainUI();
    createFooterUI();
}

buildUI();

function createNavUI() {
    pageContainer?.insertAdjacentHTML('beforebegin', `
        <nav>
            <a href='./index.html'>Home/Create Watch Party</a>
            <a href='./demo.html'>Demo</a>
            <a href='./watch.html'>Find Watch Party</a>
        </nav>
    `)
}

function createMainUI() {
    // if statements to decide which html to load.  if url is... index.html, demo.html, watch-party.html.
    const pathname = window.location.pathname;
    console.log(pathname);


    if (pathname == '/index.html' ||  pathname == '/' || pathname.length === 0) {
        console.log('createMainUI index Page Activated');
        createIndexPageUI();
    }
    if (pathname == '/demo.html') {
        console.log('createMainUI Demo Page Activated');
        createDemoPageUI();
    }
    if (pathname == '/watch-party.html') {
        console.log('createMainUI Watch Party Page Activated');
        createWatchPartyUI();
    }


}

function createFooterUI() {
    const footerDOM = document.getElementById('footer');

    footerDOM?.insertAdjacentHTML('afterend', `
        <p>Created by <a href='http://danielgodin.org'>Daniel Godin</p>
    `)
}

function createIndexPageUI() {
    pageContainer?.insertAdjacentHTML('afterbegin', `
        <div id='newWatchPartyContainer' class='main-container'>
            <h1>Create Your Watch Party (save the link/unique watch party id)</h1>
            <form id='newWatchPartyForm'>
                <label>Add Your First Movie:
                    <input id='inputMovie0' type='text' required>
                </label>
                <button id='btnCreateWatchParty' type='submit'>Create Watch Party</button>
            </form>
        </div>
    `)

    const newWatchPartyForm = document.getElementById('newWatchPartyForm');
    const inputMovie0 = document.getElementById('inputMovie0');
    const btnCreateWatchParty = document.getElementById('btnCreateWatchParty');


    newWatchPartyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
          // console.log('newWatchPartyForm submitted');
        const id = randomIdGenerator();
    
        const obj = {
            watchPartyID: id,
            dateCreated: "date string",
            dateOfWatchParty: 'date string',
            guests: 'array of guest names in strings',
            movies: {
                movie0: inputMovie0.value,
            },
            
        }
    
        // console.log(obj);
        try {
            setDoc(doc(db, 'watchParties', id), obj);
            console.log("Document written with ID: ", id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
          
    })
}

async function createDemoPageUI() {

    // This should look through the 00-demoWatchParty document in the Firestore database 
    // and create an editable UI.

    const docRef = doc(db, "watchParties", "00-demoWatchParty");
    // const docSnap = await getDoc(docRef);

    await onSnapshot(docRef, (snapshot) => {

        pageContainer.innerHTML = ''; // This resets the pageContainer DOM so it doesn't duplicate when it's updated.
        
        console.log("onSnapshot function triggered: ", snapshot);
        if (snapshot.exists()) {
            // Create the Demo Page UI.
            // console.log("Document data:", docSnap.data());
    
            const data = snapshot.data();
    
            const watchPartyID = data.watchPartyID;
            const watchPartyName = data.watchPartyName;
            const dateCreated = data.dateCreated;
            const dateOfWatchParty = data.dateOfWatchParty;
            const titlesOptions = data.titleOptions;
    
            pageContainer?.insertAdjacentHTML('afterbegin', `
                <div id='demoWatchPartyContainer' class='main-container'>
                    <h1>Welcome to the ${watchPartyName} Watch Party Page</h1>
                    <p>Date of Party: ${dateOfWatchParty}</p>
                    <form id='watchPartyForm'>
                    </form>
                </div>
            
            
            `)
    
            const watchPartyForm = document.getElementById('watchPartyForm');
    
            for (let i = 0; i < titlesOptions.length; i++) {
                watchPartyForm?.insertAdjacentHTML('beforeend', `
                    <div class='option-container'>
                        <div class='vote-container'>
                            <button type='button' class="vote-buttons">Yes</button>
                            <button type='button' class="vote-buttons">Maybe</button>
                            <button type='button' class="vote-buttons">No</button>
                        </div>
                        
                        <div class='title-container'>
                            <p>${titlesOptions[i].title}</p>
                        </div>
                        
                        <div class='add-or-remove-button-container'>
                            <button type='button' class='button-remove-title'>-</button>
                        </div>
                    </div>
                `)
            }
    
            if (titlesOptions.length < 10) {
                watchPartyForm?.insertAdjacentHTML('beforeend', `
                    <div id='addTitleContainer'>
                        <input type='text' id='addTitleInput' placeholder='Add Another Title Here' />
                        <button type='button' id='btnAddTitle'>+</button>
                    </div>
                `)
    
                const addTitleInput = document.getElementById('addTitleInput');
                const btnAddTitle = document.getElementById('btnAddTitle');
    
                btnAddTitle?.addEventListener('click', async (e) => {
                    e.preventDefault();
                    console.log('add title button clicked');
    
                    const newObj = {
                        title: addTitleInput.value,
                        links: {
                            tmdb: "https://link.com",
                        },
                        votes: {
                            yes: 0,
                            maybe: 0,
                            no: 0
                        }
                    }
    
                    await updateDoc(docRef, {
                        titleOptions: arrayUnion(newObj)
                    });
                })
            };
    
            if (titlesOptions >= 10) { console.log("Only 10 titles allowed at once") };
    
        } else {
            // Demo Page UI not working.  Make UI that says "error, not working, go back to index page."
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
    
            pageContainer?.insertAdjacentHTML('afterbegin', `
                <p>Error:  Document not loading.  Please go back to <a href='./index.html'>Main Page</a>.</p>
            `)
        }
    });
}

function createWatchPartyUI() {
    pageContainer?.insertAdjacentHTML('afterbegin', `
    
    `)
}