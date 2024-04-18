// Imports:
import { randomIdGenerator } from "./utils";

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
            console.error("Error adding documenet: ", e);
        }
          
    })
}

function createDemoPageUI() {
    pageContainer?.insertAdjacentHTML('afterbegin', `
        <div id='watchPartyContainer' class='main-container'>
            <h1>Welcome To "Name" Watch Party</h1>
            <form id='watchPartyForm'>
                <div class='option-container'>
                    <div class='vote-container'>
                        <button type='button' class="vote-buttons">Yes</button>
                        <button type='button' class="vote-buttons">Maybe</button>
                        <button type='button' class="vote-buttons">No</button>
                    </div>
                    
                    <div class='title-container'>
                        <p>Movie Title</p>
                    </div>
                    
                    <div class='add-or-remove-button-container'>
                        <button type='button' class='button-remove-title'>-</button>
                    </div>
                </div>
                <div id='addTitleContainer'>
                    <input type='text' placeholder='Add Another Title Here' />
                    <button type='button' class='button-add-title'>+</button>
                </div>
            </form>
        </div>
        </div>
    `)
}

function createWatchPartyUI() {
    pageContainer?.insertAdjacentHTML('afterbegin', `
    
    `)
}