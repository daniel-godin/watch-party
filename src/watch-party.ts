// Imports:
import { randomIdGenerator } from "./utils";
import { TMDBOptions, getTMDBImage } from "./tmdbUtilities";

// Firebase Imports:
import { auth, db,  } from "./firebase";
import { setDoc, doc, onSnapshot, collection, deleteDoc, } from "firebase/firestore";


export async function createWatchPartyUI() {

    let watchPartyIDFromURL = window.location.search;
    watchPartyIDFromURL = watchPartyIDFromURL.slice(1);

    if (watchPartyIDFromURL.length < 1) { watchPartyIDFromURL = '?watchPartyNotDetected'; } // This is to fix the firestore check with an empty string.

    console.log('createWatchPartyUI function triggered: ', watchPartyIDFromURL);

    const docRef = doc(db, 'watchParties', watchPartyIDFromURL);
    onSnapshot(docRef, (snapshot) => { // Live Listener that watches the main Watch Party Doc.  Sub-Coll under it with title docs.  That is in it's on onSnapshot Listener.
        pageContainer.innerHTML = ''; // Resets pageContainer DOM.  Needs a better solution later.

        if (snapshot.exists()) {
            const data = snapshot.data();

            const watchPartyID = data.watchPartyID;
            const watchPartyName = data.watchPartyName;
            const dateCreated = data.dateCreated;
            const dateOfWatchParty = data.dateOfWatchParty;

            const watchPartyURL = window.location.href;

            pageContainer?.insertAdjacentHTML('afterbegin', `
                <div id='demoWatchPartyContainer' class='main-container'>
                    <h1>Welcome to the ${watchPartyName} Watch Party Page</h1>
                    <p>Date of Party: ${dateOfWatchParty}</p>
                    <p>Watch Party Unique ID:  <span id='txtWatchPartyID'>${watchPartyID}</span></p>
                        <button id='btnCopyWatchPartyID' type='button'>Copy ID</button>
                    <p>Watch Party Unique URL:  <span id='txtWatchPartyURL'>${watchPartyURL}</span></p>
                        <button id='btnCopyWatchPartyURL' type='button'>Copy URL</button>
                    <form id='watchPartyForm'>
                    </form>
                </div>
            `)

            const copyWatchPartyIDText = document.getElementById('txtWatchPartyID')?.innerText;
            const copyWatchPartyURLText = document.getElementById('txtWatchPartyURL')?.innerText;
            const btnCopyWatchPartyID = document.getElementById('btnCopyWatchPartyID');
            const btnCopyWatchPartyURL = document.getElementById('btnCopyWatchPartyURL');

            btnCopyWatchPartyID.addEventListener('click', () => {
                navigator.clipboard.writeText(copyWatchPartyIDText);
                console.log('Copied Unique Watch Party ID');
            })

            btnCopyWatchPartyURL.addEventListener('click', () => {
                navigator.clipboard.writeText(copyWatchPartyURLText);
                console.log('Copied Unique Watch Party URL');
            })

        } else {
            // Watch Page Didn't Find the document.  Load a quick page with a search form, a header, and a way to go back to index.
            pageContainer?.insertAdjacentHTML('afterbegin', `
                <h1>Watch Page Not Found</h1>
                <p>Please search below, or <a href='./index.html'>Go Back To Home Page</a>.</p>
                <form id='formSearchForWatchPartyID'>
                    <input id='inputSearchForWatchPartyID' type='text' placeholder='Put Your Unique ID Here'>
                    <button id='btnSearchForWatchPartyID' type='submit'>
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
    })

    const colRef = collection(db, 'watchParties', watchPartyIDFromURL, 'titleOptions');

    onSnapshot(colRef, (snapshot) => {
        const watchPartyForm = document.getElementById('watchPartyForm');

        watchPartyForm.innerHTML = '';

        let count = 0; // Count to keep titles to 10 or less.  Check if(statements) below.

        snapshot.forEach((document) => {
            count++;
            const data = document.data();

            const title = data.title;
            const id = data.id;

            watchPartyForm?.insertAdjacentHTML('beforeend', `
                <div class='option-container'>
                    <div class='vote-container'>
                        <button type='button' class="vote-buttons">Yes</button>
                        <button type='button' class="vote-buttons">Maybe/Indifferent</button>
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
        });

        const arrayOfBtnRemoveTitle = document.getElementsByClassName('button-remove-title');

        for (let i = 0; i < arrayOfBtnRemoveTitle.length && i < 11; i++) {
            arrayOfBtnRemoveTitle[i].addEventListener('click', async (e) => {
                await deleteDoc(doc(db, "watchParties", watchPartyIDFromURL, 'titleOptions', e.target.dataset.id));
            });
        };

        if (count < 5) {
            watchPartyForm?.insertAdjacentHTML('beforeend', `
                    <div id='addTitleContainer'>
                        <form id='formAddTitle'>
                            <input type='text' id='addTitleInput' placeholder='Add Another Title Here' />
                            <button type='submit' id='btnAddTitle'>+</button>
                        </form>
                    </div>
                `)
    
                const addTitleInput = document.getElementById('addTitleInput');
                const btnAddTitle = document.getElementById('btnAddTitle');
                const formAddTitle = document.getElementById('formAddTitle');

                

                formAddTitle?.addEventListener('submit', async (e) => {
                    e.preventDefault();


                    let searchURL = new URL('https://api.themoviedb.org/3/search/movie');

                    searchURL.searchParams.append('query', addTitleInput.value);
                    
                    fetch(searchURL, TMDBOptions)
                    .then(response => response.json())
                    .then(response => chooseMovieAfterSearch(response))
                    .catch(err => console.error(err));

                    function chooseMovieAfterSearch(searchObj) {

                        console.log('chooseMovie function triggered.  Here is the Object: ', searchObj);
                        console.log('array of search results: ', searchObj.results); // This is an array of Objects.



                        for (let i = 0; i < 5; i++) {

                            let title = searchObj.results[i].title;
                            let imgSRC = 'https://image.tmdb.org/t/p/w92' + searchObj.results[i].poster_path;


                            pageContainer?.insertAdjacentHTML('beforeend', `
                                <div class='search-result-container'>
                                    <img src='${imgSRC}' class='search-img'>
                                    <p>${title}</p>
                                </div>
                            `)
                        }
                    }


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
                        setDoc(doc(db, 'watchParties', watchPartyIDFromURL, 'titleOptions', id), newTitleObject);
                    } catch (e) {
                        console.error("Eerror adding document: ", e);
                    }
                })
        }

        if (count >= 5) { console.log('Only 5 options allowed at this time.  Please remove a title if you wish to add a different one.')}

    })
}