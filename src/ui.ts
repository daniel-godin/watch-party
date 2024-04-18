// Imports:
import { randomIdGenerator } from "./utils";

// Firebase Imports:
import { auth, db,  } from "./firebase";
import { setDoc, doc, getDoc, getDocs, onSnapshot, updateDoc, arrayUnion, arrayRemove, query, where, collection, deleteDoc } from "firebase/firestore";

const pageContainer = document.getElementById('pageContainer');

function buildUI() {
    console.log('buildUI function triggered');
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
    // console.log(pathname);


    if (pathname == '/index.html' ||  pathname == '/' || pathname.length === 0) {
        // console.log('createMainUI index Page Activated');
        createIndexPageUI();
    }
    if (pathname == '/demo.html') {
        // console.log('createMainUI Demo Page Activated');
        createDemoPageUI();
    }
    if (pathname == '/watch-party.html') {
        // console.log('createMainUI Watch Party Page Activated');
        createWatchPartyUI();
    }


}

function createFooterUI() {
    const footerDOM = document.getElementById('footer');

    footerDOM?.insertAdjacentHTML('afterend', `
        <p>Created by <a href='http://danielgodin.org'>Daniel Godin</p>
    `)
}

async function createIndexPageUI() {
    console.log('createIndexPageUI triggered');
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
    const btnCreateWatchParty = document.getElementById('btnCreateWatchParty');


    newWatchPartyForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
          // console.log('newWatchPartyForm submitted');
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



    onSnapshot(docRef, (snapshot) => {

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
    
            pageContainer?.insertAdjacentHTML('afterbegin', `
                <div id='demoWatchPartyContainer' class='main-container'>
                    <h1>Welcome to the ${watchPartyName} Watch Party Page</h1>
                    <p>Date of Party: ${dateOfWatchParty}</p>
                    <form id='watchPartyForm'>
                    </form>
                </div>
            `)
    
        } else {
            // Demo Page UI not working.  Make UI that says "error, not working, go back to index page."
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
    
            pageContainer?.insertAdjacentHTML('afterbegin', `
                <p>Error:  Document not loading.  Please go back to <a href='./index.html'>Main Page</a>.</p>
            `)
        }
    });

    const colRef = collection(db, 'watchParties', '00-demoWatchParty', 'titleOptions');

    onSnapshot(colRef, (snapshot) => {


        const watchPartyForm = document.getElementById('watchPartyForm');

        watchPartyForm.innerHTML = '';

        let count = 0;

        snapshot.forEach((document) => {
            count++;
            const data = document.data();

            const title = data.title;
            const id = data.id;

            watchPartyForm?.insertAdjacentHTML('beforeend', `
                <div class='option-container'>
                    <div class='vote-container'>
                        <button type='button' class="vote-buttons">Yes</button>
                        <button type='button' class="vote-buttons">Maybe</button>
                        <button type='button' class="vote-buttons">No</button>
                    </div>
                    
                    <div class='title-container'>
                        <p>${title}</p>
                    </div>
                    
                    <div class='add-or-remove-button-container'>
                        <button type='button' class='button-remove-title' data-id='${id}'>-</button>
                    </div>
                </div>
            `)
            
            console.log(document.id, " =>", document.data());
        })

        const arrayOfBtnRemoveTitle = document.getElementsByClassName('button-remove-title');

        for (let i = 0; i < arrayOfBtnRemoveTitle.length && i < 11; i++) {
            arrayOfBtnRemoveTitle[i].addEventListener('click', async (e) => {
                console.log('Minus Clicked: ', e.target.dataset.id);

                await deleteDoc(doc(db, "watchParties", "00-demoWatchParty", 'titleOptions', e.target.dataset.id));
            });
        }

        if (count < 10) {
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

                    const id = randomIdGenerator();
    
                    const newTitleObject = {
                        id: id,
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

                    try {
                        setDoc(doc(db, 'watchParties', '00-demoWatchParty', 'titleOptions', id), newTitleObject);
                    } catch (e) {
                        console.error("Eerror adding document: ", e);
                    }
                })
        }

        if (count >= 10) { console.log('Only 10 options allowed at this time.  Please remove a title if you wish to add a different one.')}
    })
}

function createWatchPartyUI() {
    pageContainer?.insertAdjacentHTML('afterbegin', `
    
    `)
}