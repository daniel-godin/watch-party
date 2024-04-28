// Imports:
import { copyToClipboard, randomIdGenerator } from "./utils";
import { TMDBOptions, getTMDBImage } from "./tmdbUtilities";

// Firebase Imports:
import { auth, db,  } from "./firebase";
import { setDoc, doc, onSnapshot, collection, deleteDoc, } from "firebase/firestore";


export async function createWatchPartyUI(mainContentContainer: HTMLElement, user: Object) {

    createWatchPartyScaffolding(mainContentContainer);

    const watchPartyInfo = document.getElementById('watchPartyInfo') as HTMLElement;
    const watchPartySearch = document.getElementById('watchPartySearch') as HTMLElement;
    const watchPartyNewWatchParty = document.getElementById('watchPartyNewWatchParty') as HTMLElement;

    createWatchPartyInfoUI(watchPartyInfo, watchPartySearch, watchPartyNewWatchParty);
    createWatchPartySearchUI(watchPartyInfo, watchPartySearch, watchPartyNewWatchParty);
    createWatchPartyNewWatchPartyUI(watchPartyInfo, watchPartySearch, watchPartyNewWatchParty);
}

function createWatchPartyScaffolding(mainContentContainer:HTMLElement){
        // Creates scaffolding for the watch party page.  All other UI elements attach to these points.
        mainContentContainer.innerHTML = '';
        mainContentContainer.insertAdjacentHTML('afterbegin', `
            <main id='watchPartyPageContainer'>
                <section id='watchPartyInfo'>
                </section>
                <section id='watchPartySearch'>
                </section>
                <section id='watchPartyNewWatchParty'>
                </section>
            </main>
        `)
}

function createWatchPartyInfoUI(watchPartyInfo: HTMLElement, watchPartySearch: HTMLElement, watchPartyNewWatchParty:HTMLElement) {

    let watchPartyIDFromURL = window.location.search;
    watchPartyIDFromURL = watchPartyIDFromURL.slice(1); // Slicing off the "?", so I can search for it in Firestore Docs.

    if (watchPartyIDFromURL.length < 1) { watchPartyIDFromURL = '?watchPartyNotDetected'; } // This is to fix the firestore check with an empty string.

    const watchPartyDocRef = doc(db, 'watchParties', watchPartyIDFromURL);
    onSnapshot(watchPartyDocRef, (snapshot) => { // Live Listener that watches the main Watch Party Doc.  Sub-Coll under it with title docs.  That is in it's on onSnapshot Listener.
        // If... Else:  If Document Found matching ?search URL param, create the watch party page, else, create a "Not Found" Message.
        if(snapshot.exists()) {

            // Hide these elements and their children if FireStore doc found.  No need for search or creation of a new watch party.
            watchPartySearch.style.display = 'none';
            watchPartyNewWatchParty.style.display = 'none';

            const data = snapshot.data();

            const watchPartyID:string = data.watchPartyID;
            const watchPartyName:string = data.watchPartyName;
            const dateCreated = data.dateCreated;
            const dateOfWatchParty = data.dateOfWatchParty;

            const watchPartyURL = window.location.href;

            const watchPartyInfo = document.getElementById('watchPartyInfo') as HTMLElement;
            watchPartyInfo.innerHTML = '';
            watchPartyInfo.insertAdjacentHTML('afterbegin', `
                <h1>Welcome to the ${watchPartyName} Watch Party Page</h1>
                <p>Date of Party: ${dateOfWatchParty}</p>
                <p>Watch Party Unique URL:  </p><button id='btnCopyWatchPartyURL' type='button'>Copy URL</button>
                <div id='watchPartyMoviesContainer'>
                </div>
            `)

            const copyWatchPartyURLText = document.getElementById('txtWatchPartyURL')?.innerText;
            const btnCopyWatchPartyURL = document.getElementById('btnCopyWatchPartyURL') as HTMLButtonElement;
            copyToClipboard(btnCopyWatchPartyURL, copyWatchPartyURLText);

            // const collectionOfMoviesRef = collection(db, 'watchParties', watchPartyIDFromURL, 'titleOptions');
            const collectionOfMoviesRef = collection(watchPartyDocRef, 'titleOptions');
            const watchPartyMoviesContainer = document.getElementById('watchPartyMoviesContainer') as HTMLElement;
            createWatchPartyFromDB(watchPartyMoviesContainer, collectionOfMoviesRef);


        } else {
            // const watchPartyInfo = document.getElementById('watchPartyInfo') as HTMLElement;
            watchPartyInfo.classList.add('hidden');
            // watchPartyInfo.innerHTML = '';
            // watchPartyInfo.insertAdjacentHTML('afterbegin', `
            //     <h1>Watch Page Not Found</h1>
            //     <p>Please search below, or <a href='./index.html'>Go Back To Home Page</a>.</p>
            // `)
        }



    });
}

function createWatchPartySearchUI(watchPartyInfo: HTMLElement, watchPartySearch: HTMLElement, watchPartyNewWatchParty:HTMLElement) {

    watchPartySearch.innerHTML = '';
    watchPartySearch.insertAdjacentHTML('afterbegin', `
        <form id='formSearchForWatchPartyID'>
            <input id='inputSearchForWatchPartyID' type='text' placeholder='Put Your Unique ID Here'>
            <button id='btnSearchForWatchPartyID' type='submit'>Search For Watch Party</button>
        </form>
    `)


    const formSearchForWatchPartyID = document.getElementById('formSearchForWatchPartyID');
    const inputSearchForWatchPartyID = document.getElementById('inputSearchForWatchPartyID');

    formSearchForWatchPartyID?.addEventListener('submit', (e) => {
        e.preventDefault();
        // Needs to redirect to url.com/watch.html?{Unique ID Here}.
        let baseURL = 'http://127.0.0.1:5050/';  // This honestly should change and not be hard coded.

        let watchPartyURL = 'watch.html?' + inputSearchForWatchPartyID.value;

        let findPartyURL = new URL(watchPartyURL, baseURL);

        window.location.replace(findPartyURL);
    })
}

export function createWatchPartyNewWatchPartyUI(watchPartyInfo: HTMLElement, watchPartySearch: HTMLElement, watchPartyNewWatchParty:HTMLElement) {

    watchPartyNewWatchParty.innerHTML = '';
    watchPartyNewWatchParty.insertAdjacentHTML('afterbegin', `
        <h1>Create Your Watch Party (save the link/unique watch party id)</h1>
        <form id='formNewWatchParty'>
            <label>Add Your First Movie:
                <input id='inputSearchTitle' type='text' required>
            </label>
            <button type='submit'>Search</button>
        </form>
        <div id='newWatchPartySearchResults'>
        </div>
    `)

    const formNewWatchParty = document.getElementById('formNewWatchParty') as HTMLFormElement;    
    formNewWatchParty.addEventListener('submit', async (e) => {
        e.preventDefault();

        let TMDBMovieSearchURL = new URL('https://api.themoviedb.org/3/search/movie');
        const inputSearchTitle = document.getElementById('inputSearchTitle') as HTMLInputElement;
        const searchTitle:string = inputSearchTitle.value;
        TMDBMovieSearchURL.searchParams.append('query', searchTitle);

        fetch(TMDBMovieSearchURL, TMDBOptions)
            .then(response => response.json())
            .then(response => {

                const results = response.results;

                createNewWatchPartySearchResultsUI(results) // This part is working.

                const btnCreateWatchPartyWithFirstTitle = document.getElementsByClassName('btn-create-watch-party-with-first-title');
                for (let i = 0; i < btnCreateWatchPartyWithFirstTitle.length; i++) {
                    btnCreateWatchPartyWithFirstTitle[i].addEventListener('click', async (e) => {
                        e.preventDefault();
                        console.log('create watch party button clicked');

                        const movieID = btnCreateWatchPartyWithFirstTitle[i].dataset.titleId;

                        // Fetch Movie Data From TMDB...

                        let TMDBMovieSearchURL = new URL(`https://api.themoviedb.org/3/movie/${movieID}`);

                        fetch(TMDBMovieSearchURL, TMDBOptions)
                            .then(response => response.json())
                            .then(response => {


                                console.log('response: ', response);


                                const watchPartyID = randomIdGenerator();

                                const watchPartyObj = {
                                    watchPartyID: watchPartyID,
                                    dateCreated: "date string",
                                    dateOfWatchParty: 'date string',
                                    guests: 'array of guest names in strings',            
                                }

                                const newMovieObject = {
                                    id: response.id,
                                    title: response.title,
                                    posterPath: response.poster_path,
                                    runtime: response.runtime,
                                    description: response.overview,
                                }



                                try {
                                    setDoc(doc(db, 'watchParties', watchPartyID, 'titleOptions', movieID), newMovieObject);
                                } catch (e) {
                                    console.error('Error Creating Movie Doc: ', e);
                                }

                                try {
                                    setDoc(doc(db, 'watchParties', watchPartyID), watchPartyObj);
                                } catch (e) {
                                    console.error("Error Creating Watch Party: ", e);
                                }

                                
                                watchPartyNewWatchParty.innerHTML = '';
                                watchPartyNewWatchParty.insertAdjacentHTML('afterbegin', `
                                    <p>Creating Your Watch Party.  You will be redirected after it loads.  (usually ~3 seconds).</p>
                                `)

                                setTimeout(() => {
                                    const newWatchPartyDocRef = doc(db, 'watchParties', watchPartyID);
                                    onSnapshot(newWatchPartyDocRef, (snapshot) => {
                                        if (snapshot.exists()) {    
                                            let baseURL = window.location.origin;
                                            let partyURL = 'watch.html?' + watchPartyID;
                                            let fullPartyURL = new URL(partyURL, baseURL);
                                            window.location.replace(fullPartyURL);
                                        } else {
                                            console.log('snapshot did not load correctly');
                                        }
                                    });
                                }, 3000);
                            })
                            .catch(err => console.error(err));
                    })
                }
            })
            .catch(err => console.error(err));
    })
}

async function createWatchPartyFromDB(watchPartyMoviesContainer: HTMLElement, collectionOfMoviesRef) {

    watchPartyMoviesContainer.innerHTML = '';
    watchPartyMoviesContainer.insertAdjacentHTML('afterbegin', `
        <div id='watchPartyMovies'>
        </div>
        <div id='watchPartyMovieSearchResults'>
        </div>
    `);

    onSnapshot(collectionOfMoviesRef, (snapshot) => {
        let count = 0; // Count to keep titles to 5 or less.  Check if(statements) below.

        // Start of creating the Watch Party movies section in UI.
        const watchPartyMovies = document.getElementById('watchPartyMovies') as HTMLElement;
        watchPartyMovies.innerHTML = '';
        snapshot.forEach((document: any) => {
            count++; // Adds one to count.  Keep number of movies in a watch party's options to 5 or less.

            const data = document.data();

            const title = data.title;
            const id = data.id;
            const moviePosterPath = data.posterPath;

            const TMDBMovieLink = new URL(`https://www.themoviedb.org/movie/${id}`);
            const TMDBMoviePoster = getTMDBImage('w154', moviePosterPath);

            // Creates a box container for each title.  Starting at before end, so first created is at the top in DOM/UI.
            watchPartyMovies.insertAdjacentHTML('beforeend', `
                <div class='movie-card'>
                    <a href='${TMDBMovieLink} target='_blank'><img src='${TMDBMoviePoster}' class='img-movie-watch-party'></a>
                    <div class='movie-title-container'>
                        <p>${title}</p>
                    </div>
                    <div class='movie-vote-container'>
                        <button type='button' class="vote-buttons">Yes</button>
                        <button type='button' class="vote-buttons">Maybe/Indifferent</button>
                        <button type='button' class="vote-buttons">No</button>
                    </div>
                    <div class='movie-vote-results-container'>
                    </div>
                </div>
            `)
        })

        // Insert "Add Title To Watch Party".  Limiting Watch Parties to 5 Options as of 2024-04-25.
        if (count < 5) { 
            // Create Simple UI.  Should mostly match the title cards to be seamless.
            watchPartyMovies.insertAdjacentHTML('beforeend', `
                <div class='option-container'>
                    <form id='formAddTitle'>
                        <input type='text' id='addTitleInput' placeholder='Add Another Title Here' />
                        <button type='submit' id='btnAddTitle'>+</button>
                    </form>
                </div>
            `)

            const formAddTitle = document.getElementById('formAddTitle') as HTMLFormElement;
            formAddTitle.addEventListener('submit', async (e) => {
                e.preventDefault();

                let TMDBMovieSearchURL = new URL('https://api.themoviedb.org/3/search/movie');
                const addTitleInput = document.getElementById('addTitleInput') as HTMLInputElement;
                const searchTitle:string = addTitleInput.value;
                TMDBMovieSearchURL.searchParams.append('query', searchTitle);

                fetch(TMDBMovieSearchURL, TMDBOptions)
                    .then(response => response.json())
                    .then(response => {
                        const results = response.results;

                        const watchPartyMovieSearchResults = document.getElementById('watchPartyMovieSearchResults') as HTMLElement;
                        watchPartyMovieSearchResults.innerHTML = ''; // Resets Container.

                        // Limiting display to first 5 results for now.
                        for (let i = 0; i < 5; i++) {
                            const title = results[i].title;
                            const movieID = results[i].id;
                            const moviePosterPath = results[i].poster_path;

                            const imgSRC = getTMDBImage('w154', moviePosterPath);

                            watchPartyMovieSearchResults.insertAdjacentHTML('beforeend', `
                                <div class='movie-search-results'>
                                    <img src='${imgSRC}' class='search-img'>
                                    <p>${title}</p>
                                    <button type='button' class='btn-add-movie-to-party' data-title='${title}' data-title-id='${movieID}'>Add ${title} To Watch Party</button>
                                </div>
                            `)
                        }

                        const btnAddMovieToParty = document.getElementsByClassName('btn-add-movie-to-party');
                        for (let i = 0; i < btnAddMovieToParty.length; i++) {
                            btnAddMovieToParty[i].addEventListener('click', async (e) => {
                                e.preventDefault();

                                const movieID = btnAddMovieToParty[i].dataset.titleId;

                                // Fetch Movie Data From TMDB...

                                let TMDBMovieSearchURL = new URL(`https://api.themoviedb.org/3/movie/${movieID}`);

                                
                                fetch(TMDBMovieSearchURL, TMDBOptions)
                                    .then(response => response.json())
                                    .then(response => {

                                        const newMovieObject = {
                                            id: response.id,
                                            title: response.title,
                                            posterPath: response.poster_path,
                                            runtime: response.runtime,
                                            description: response.overview,
                                        }

                                        setDoc(doc(collectionOfMoviesRef, movieID), newMovieObject);
                                        console.log('New Movie Added To Movie Watch Party Collection');
                                        
                                        
                            
                                    })
                                    .catch(err => console.error(err));


                            })
                        }


                    })
                    .catch(err => console.error(err));
            })
        }

        if (count >= 5) { console.log('Only 5 options allowed at this time.  Please remove a title if you wish to add a different one.')}

        const arrayOfBtnRemoveTitle = document.getElementsByClassName('button-remove-title');
        for (let i = 0; i < arrayOfBtnRemoveTitle.length && i < 11; i++) {
            arrayOfBtnRemoveTitle[i].addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                // await deleteDoc(doc(db, "watchParties", watchPartyIDFromURL, 'titleOptions', e.target.dataset.id));
                await deleteDoc(doc(collectionOfMoviesRef, id));
            });
        };
    })


}

function createNewWatchPartySearchResultsUI(results) {
    const newWatchPartySearchResults = document.getElementById('newWatchPartySearchResults') as HTMLElement;
    newWatchPartySearchResults.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const title = results[i].title;
        const movieID = results[i].id;
        const moviePosterPath = results[i].poster_path;

        const imgSRC = getTMDBImage('w154', moviePosterPath);

        newWatchPartySearchResults.insertAdjacentHTML('beforeend', `
            <div class='movie-search-results'>
                <img src='${imgSRC}' class='search-img'>
                <p>${title}</p>
                <button type='button' class='btn-create-watch-party-with-first-title' data-title='${title}' data-title-id='${movieID}'>Create Watch Party with ${title}</button>
            </div>
        `)
    }
}