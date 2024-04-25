// Imports:
import { randomIdGenerator } from "./utils";

// UI/App Imports:
import { createIndexPageUI } from "./index.ts";
import { createRandomTVEpisodeUI } from "./random-TV-episode";
import { createDemoPageUI, createWatchPartyUI, newcreateWatchPartyUI } from "./watch-party";
import { createAuthPageUI, createProfilePageUI } from "./auth";

// Firebase Imports:
import { auth, db,  } from "./firebase";
import { setDoc, doc, onSnapshot } from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged, signOut, } from "firebase/auth";

// Global Variables:


// Code / Functionality:

onAuthStateChanged(auth, (user) => {
    if (user) { buildUI(user); }; // If user == true, build UI with user data.
    if (!user) { // If user != true, initialize anonymous auth account, then it should re-trigger onAuthStateChanged, which will then have a user object to build the UI with.
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

function buildUI(user: object) {
    // console.log('What is the type of user: ', typeof(user))
    buildSkeletonUI();
    createNavUI();
    createMainUI(user);
    createFooterUI(user);
}

export const pageContainer = document.getElementById('pageContainer') as HTMLElement; // This is on every html page.  Maybe change to use body later?
function buildSkeletonUI() {
    pageContainer.innerHTML = '';
    pageContainer.insertAdjacentHTML('afterbegin', `
        <nav id='navTopBar'></nav>
        <main id='mainContentContainer'></main>
        <footer id='footerContainer'></footer>
    `)
}

function createNavUI() {
    const navTopBar = document.getElementById('navTopBar') as HTMLElement;
    navTopBar.innerHTML= '';
    navTopBar.insertAdjacentHTML('afterbegin', `
        <a href='./index.html'>Home/Create Watch Party</a>
        <a href='./demo.html'>Demo</a>
        <a href='./watch.html'>Find Watch Party</a>
        <a href='./random.html'>Random TV Episode</a>
        <a href='./profile.html'>Profile</a>
        <a href='./auth.html'>Sign In / Sign Up</a>
    `)
}

function createMainUI(user: object) {
    const mainContentContainer = document.getElementById('mainContentContainer') as HTMLElement;
    const pathname: string = window.location.pathname; // Finding pathname to sort which UI function to trigger.
    if (pathname == '/index.html' ||  pathname == '/' || pathname.length === 0) { createIndexPageUI(mainContentContainer, user); };  
    if (pathname == '/demo.html') { createDemoPageUI(mainContentContainer, user); };
    if (pathname == '/watch.html') { newcreateWatchPartyUI(mainContentContainer, user); };
    if (pathname == '/random.html') { createRandomTVEpisodeUI(mainContentContainer, user); };
    if (pathname == '/auth.html') { createAuthPageUI(mainContentContainer, user); };
    if (pathname == '/profile.html') {createProfilePageUI(mainContentContainer, user); };
}

function createFooterUI(user: Object) {

    let userCheck: string = '';
    if (user.isAnonymous === true) { userCheck = 'hidden'; }; // Checks whether a user isAnonymous.  If yes... applies 'hidden' class to signOut button.

    const footerContainer = document.getElementById('footerContainer') as HTMLElement;
    footerContainer.innerHTML = '';
    footerContainer.insertAdjacentHTML('afterbegin', `
        <p>Created by <a href='http://danielgodin.org' target='_blank'>Daniel Godin</a></p>
        <p>All Movie and TV Data is from <a href='https://themoviedb.org' target="_blank">The Movie DB</a></p>
        <button type='button' id='btnSignOut' class='${userCheck}'>Sign Out</button>
    `)

    const btnSignOut = document.getElementById('btnSignOut') as HTMLButtonElement;
    btnSignOut.addEventListener('click', (e) => {
        e.preventDefault();
        signOut(auth).then(() => {
            console.log('Sign-out Successful');
            pageContainer.innerHTML = '';
            pageContainer.insertAdjacentHTML('afterbegin', `
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

