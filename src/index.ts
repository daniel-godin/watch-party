// Imports:


// Firebase Imports:


// Code/Functionality:

export async function createIndexPageUI(mainContentContainer: HTMLElement, user: object) {

    mainContentContainer.innerHTML = '';
    mainContentContainer.insertAdjacentHTML('afterbegin', `
        <main id='mainIndexPageContainer'>
            <h1>Watch Party App</h1>
            <p>There are a number of different, but related, apps on this website.</p>
            <ul>
                <li>Watch Party - Create a watch party page for you and your friends.  Send them the link and they can vote on which movies they'd like to see!  No account needed!</li>
                <li>Random TV Episode - Have trouble figuring out what to watch?  Random between all your favorite shows, or just one.  Make an account to save your favorites long-term.</li>
                <li>More coming soon!</li>
            </ul>
        </main>
    `)
}