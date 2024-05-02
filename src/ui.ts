// Imports:


// UI/App Imports:
import { createIndexPageUI } from "./index.ts";
import { createRandomTVEpisodeUI } from "./random-TV-episode";
import { createWatchPartyUI } from "./watch-party";
import { createAuthPageUI, createProfilePageUI } from "./auth";
import { createWatchTrackerUI } from './watch-tracker.ts';

// Firebase Imports:
import { auth, } from "./firebase";
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
    createNavUI(user);
    createMainUI(user);
    createFooterUI(user);
}

export const pageContainer = document.getElementById('root') as HTMLElement; // This is on every html page.  Maybe change to use body later?
function buildSkeletonUI() {
    pageContainer.innerHTML = '';
    pageContainer.insertAdjacentHTML('afterbegin', `
        <nav id='navContainer'></nav>
        <div id='mainContentContainer'></div>
        <div id='footerContainer'></div>
    `)
}

function createNavUI(user:any) {
    
    let anonStatus: boolean = user.isAnonymous; // Checks whether there is a full user, or a firebase anon user.

    let profileStatus:string = 'hidden';
    let authStatus:string = '';
    if (anonStatus === true || user === null || user === false) { 
        profileStatus = 'hidden';
        authStatus = ''; 
    }
    if (anonStatus === false) { 
        profileStatus = '';
        authStatus = 'hidden';
    }

    const navContainer = document.getElementById('navContainer') as HTMLElement;
    navContainer.innerHTML= '';

    // if (screen 500px or less.  Hamburger Menu)
    // if (screen 501px or more.  Desktop Menu.  I think)


    navContainer.insertAdjacentHTML('afterbegin', `
        <a href='./index.html'>Home</a>
        <a href='./watch.html'>Watch Party</a>
        <a href='./random.html'>Random TV Episode</a>
        <a href='./watch-tracker.html'>Watch Tracker</a>
        <a href='./profile.html' class='${profileStatus}'>Profile</a>
        <a href='./auth.html' class='${authStatus}'>Sign In / Sign Up</a>
    `)

    // navContainer.insertAdjacentHTML('afterbegin', `
    //     <nav id='navMobileMenu' class='nav-menu'>
            

    //     </nav>
    // `)
}

function createMainUI(user: object) {
    const mainContentContainer = document.getElementById('mainContentContainer') as HTMLDivElement;
    const pathname: string = window.location.pathname; // Finding pathname to sort which UI function to trigger.
    if (pathname == '/index.html' ||  pathname == '/' || pathname.length === 0) { createIndexPageUI(mainContentContainer, user); };  
    if (pathname == '/watch.html') { createWatchPartyUI(mainContentContainer, user); };
    if (pathname == '/random.html') { createRandomTVEpisodeUI(mainContentContainer, user); };
    if (pathname == '/watch-tracker.html') {createWatchTrackerUI(mainContentContainer, user); };
    if (pathname == '/auth.html') { createAuthPageUI(mainContentContainer, user); };
    if (pathname == '/profile.html') {createProfilePageUI(mainContentContainer, user); };
    
}

function createFooterUI(user: Object) {

    let userCheck: string = '';
    if (user.isAnonymous === true) { userCheck = 'hidden'; }; // Checks whether a user isAnonymous.  If yes... applies 'hidden' class to signOut button.

    const footerContainer = document.getElementById('footerContainer') as HTMLDivElement;
    footerContainer.innerHTML = '';
    footerContainer.insertAdjacentHTML('afterbegin', `
        <footer>
            <p>Created by <a href='http://danielgodin.org' target='_blank'>Daniel Godin</a></p>
            <p>All Movie and TV Data is from <a href='https://themoviedb.org' target="_blank">The Movie DB</a></p>
            <button type='button' id='btnSignOut' class='${userCheck}'>Sign Out</button>
        </footer>
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

