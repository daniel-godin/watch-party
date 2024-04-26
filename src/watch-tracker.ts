// Imports

// Firebase Imports:

// Code/Functionality

export function createWatchTrackerUI(mainContentContainer: HTMLElement, user) {

    mainContentContainer.innerHTML = '';
    mainContentContainer.insertAdjacentHTML('afterbegin', `
        <h1>Welcome To Watch Tracker</h1>
        <p>The aim of this part of the website is to give users the ability to track their progress in tv shows, movies, and more.  Also re-watches, which is it's key feature.</p>
    `)

}