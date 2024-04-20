// Imports:
import { randomIdGenerator } from "./utils";
import { stargateSG1TestObject } from "./data";
import { getTMDBImage } from "./tmdbUtilities";
import { TMDBAPIKEY } from '../api-keys.ts';

// Firebase Imports:
import { auth, db,  } from "./firebase";
import { setDoc, doc, onSnapshot, updateDoc, collection, getDoc, deleteDoc } from "firebase/firestore";

const pageContainer = document.getElementById('pageContainer'); // This is on every html page.  Maybe change to use body later?

function buildUI() {
    // console.log('buildUI function triggered');
    createNavUI();
    createMainUI();
    createFooterUI();
}

buildUI(); // Triggers the UI build.

function createNavUI() {
    pageContainer?.insertAdjacentHTML('beforebegin', `
        <nav>
            <a href='./index.html'>Home/Create Watch Party</a>
            <a href='./demo.html'>Demo</a>
            <a href='./watch.html'>Find Watch Party</a>
            <a href='./random.html'>Random TV Episode</a>
        </nav>
    `)
}

function createMainUI() {
    const pathname = window.location.pathname; // Finding pathname to sort which UI function to trigger.
    if (pathname == '/index.html' ||  pathname == '/' || pathname.length === 0) { createIndexPageUI(); };  
    if (pathname == '/demo.html') { createDemoPageUI(); };
    if (pathname == '/watch.html') { createWatchPartyUI(); };
    if (pathname == '/random.html') { createRandomTVEpisodeUI(); };
}

function createFooterUI() {
    const footerDOM = document.getElementById('footer');

    footerDOM?.insertAdjacentHTML('afterend', `
        <p>Created by <a href='http://danielgodin.org'>Daniel Godin</p>
    `)
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


function createDemoPartyDocument() {

	const demoPartyObject = {
		watchPartyID: "00-demoWatchParty",
		watchPartyName: "Demo Watch Party",
		dateCreated: "",
		dateOfWatchParty: "",
	}

	const title0 = {
		id: randomIdGenerator(),
		title: "1917",
		links: {
			tmdb: "https://www.themoviedb.org/movie/530915-1917",
		},
		votes: {
			yes: 0,
			maybe: 0,
			no: 0
		}
	}
	
	const title1 = {
		id: randomIdGenerator(),
		title: "Ex Machina",
		links: {
			tmdb: "https://www.themoviedb.org/movie/264660-ex-machina",
		},
		votes: {
			yes: 0,
			maybe: 0,
			no: 0
		},
	}
	
	const title2 = {
		id: randomIdGenerator(),
		title: "Lord of the Rings: Return of the King",
		links: {
			tmdb: "https://www.themoviedb.org/movie/122-the-lord-of-the-rings-the-return-of-the-king",
		},
		votes: {
			yes: 0,
			maybe: 0,
			no: 0
		},
	}

	try {
		setDoc(doc(db, 'watchParties', '00-demoWatchParty'), demoPartyObject);
		setDoc(doc(db, 'watchParties', '00-demoWatchParty', 'titleOptions', title0.id), title0);
		setDoc(doc(db, 'watchParties', '00-demoWatchParty', 'titleOptions', title1.id), title1);
		setDoc(doc(db, 'watchParties', '00-demoWatchParty', 'titleOptions', title2.id), title2);
		console.log('demo watch party doc created');
	} catch (e) {
		console.error("Error adding document: ", e);
	}
}

// createDemoPartyDocument(); // This is to create temporarily the demo doc.

async function createDemoPageUI() {
    // This should look through the 00-demoWatchParty document in the Firestore database 
    // and create an editable UI.

    // Later... Creates a shallow copy to play around with on a local level.  Does not alter main firebase doc, this way others can play with it too.

    const docRef = doc(db, "watchParties", "00-demoWatchParty");

    onSnapshot(docRef, (snapshot) => {

        pageContainer.innerHTML = ''; // This resets the pageContainer DOM so it doesn't duplicate when it's updated.
        
        if (snapshot.exists()) {
            const data = snapshot.data();
    
            const watchPartyID = data.watchPartyID;
            const watchPartyName = data.watchPartyName;
            const dateCreated = data.dateCreated;
            const dateOfWatchParty = data.dateOfWatchParty;
    
            pageContainer?.insertAdjacentHTML('afterbegin', `
                <div id='demoWatchPartyContainer' class='main-container'>
                    <h1>Welcome to the ${watchPartyName} Watch Party Page</h1>
                    <p>Date of Party: ${dateOfWatchParty}</p>
                    <p>Watch Party Unique ID:  ${watchPartyID}</p>
                    <form id='watchPartyForm'>
                    </form>
                </div>
            `)
    
        } else {
            // snapshot does not exist.  Creates an Error on the DOM and link to go back to home page.
            pageContainer?.insertAdjacentHTML('afterbegin', `
                <p>Error:  Document not loading.  Please go back to <a href='./index.html'>Main Page</a>.</p>
            `)
        }
    });

    const colRef = collection(db, 'watchParties', '00-demoWatchParty', 'titleOptions');
    onSnapshot(colRef, (snapshot) => {

        const watchPartyForm = document.getElementById('watchPartyForm');

        watchPartyForm.innerHTML = ''; // Resets DOM every time onSnapshot is triggered.  Prevents duplicates.

        let count = 0; // Count to keep titles to 10 and below.  If statements below.

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
        })

        const arrayOfBtnRemoveTitle = document.getElementsByClassName('button-remove-title');
        for (let i = 0; i < arrayOfBtnRemoveTitle.length && i < 11; i++) {
            arrayOfBtnRemoveTitle[i].addEventListener('click', async (e) => {
                await deleteDoc(doc(db, "watchParties", "00-demoWatchParty", 'titleOptions', e.target.dataset.id));
            });
        }

        if (count < 5) {
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

        if (count >= 5) { console.log('Only 10 options allowed at this time.  Please remove a title if you wish to add a different one.')}
    })
}

async function createWatchPartyUI() {

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

                    const options = {
                        method: 'GET',
                        headers: {
                          accept: 'application/json',
                          Authorization: TMDBAPIKEY
                        }
                    };
                    
                    fetch(searchURL, options)
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

async function createRandomTVEpisodeUI() {

    pageContainer?.insertAdjacentHTML('afterbegin', `
        <div id='randomTVShowPageContainer'>
            <div id='randomResultContainer'>
            </div>
            <div id='favoriteShowsContainer' class='random-tv-show-content-container'>
            </div>
            <div id='searchResultsAddFavoriteTVShowContainer' class='random-tv-show-content-container'>
            </div>
        </div>
    `)
    const randomTVShowPageContainer = document.getElementById('randomTVShowPageContainer');
    const favoriteShowsContainer = document.getElementById('favoriteShowsContainer');
    const randomResultContainer = document.getElementById('randomResultContainer');
    const searchResultsAddFavoriteTVShowContainer = document.getElementById('searchResultsAddFavoriteTVShowContainer');

    const colRef = collection(db, 'users', 'testUser', 'favoriteTVShows');

    onSnapshot(colRef, (snapshot) => {
        favoriteShowsContainer.innerHTML = '';

        snapshot.forEach((document) => {
            const data = document.data();

            const title = data.name;
            const id = data.id;
            const showPosterPath = data.posterPath;

            const showPoster = getTMDBImage('w154', showPosterPath);

            favoriteShowsContainer?.insertAdjacentHTML('beforeend', `
                <div class='favorite-show-card'>
                    <img src='${showPoster}'>
                    <p>${title}</p>
                    <button type='button' class='random-tv-button' data-show-id='${id}'>Random ${title} Episode</button>
                </div>
            `)
        })

        favoriteShowsContainer?.insertAdjacentHTML('beforeend', `
            <div id='addFavoriteTVShowContainer' class='favorite-show-card'>
                <form id='formAddFavoriteTVShow'>
                    <img height='231' width='154'>
                    <input id='inputAddFavoriteTVShow' type='text' placeholder='Add A Favorite Show'>
                    <button id='btnAddFavoriteTVShow' type='submit'>Search</button>
                </form>
            </div>
        `)

        const randomEpisodeButtons = document.getElementsByClassName('random-tv-button');

        for (let i = 0; i < randomEpisodeButtons.length; i++) {
            randomEpisodeButtons[i].addEventListener('click', async (e) => {
                e.preventDefault();
    
                randomResultContainer.innerHTML = '';
    
                const docRef = doc(db, 'users', 'testUser', 'favoriteTVShows', e.target.dataset.showId);
                const docSnap = await getDoc(docRef);

                const showObject = docSnap.data();

                const showID = showObject.id;
                const numOfSeasons = showObject.numOfSeasons;
                const randomSeason = getRandom(numOfSeasons);
                const randomEpisode = getRandom(showObject.seasons[randomSeason].episode_count);
        
                let TVSearchURL = new URL(`https://api.themoviedb.org/3/tv/${showID}/season/${randomSeason}/episode/${randomEpisode}?language=en-US`);
        
                const options = {
                    method: 'GET',
                    headers: {
                      accept: 'application/json',
                      Authorization: TMDBAPIKEY
                    }
                  };
                  
                  fetch(TVSearchURL, options)
                    .then(response => response.json())
                    .then(response => displayRandomEpisode(response))
                    .catch(err => console.error(err));
        
        
                function displayRandomEpisode(ep) {

                    console.log('displayRandomEpisodeTriggered.  Object: ', ep);


                    let show: string = showObject.name;
                    let showID: number = showObject.id;
                    let name: string = ep.name;
                    let description: string = ep.overview;
                    let airDate: string = ep.air_date;
            
                    let season: number = ep.season_number;
                    let epNum: number = ep.episode_number;
                    let length: number = ep.runtime;
        
                    let episodePoster: string = ep.still_path;
                    let showPoster: string = showObject.posterPath;
        
                    let getEpisodePoster = getTMDBImage('w185', episodePoster);
                    let getShowPoster = getTMDBImage('w185', showPoster);
                    let showURL: string = `https://themoviedb.org/tv/${showID}-stargate-sg-1/season/${season}/episode/${epNum}`;
        
                    randomResultContainer.insertAdjacentHTML('afterbegin', `
                        <div id='randomResultIMGContainer'>
                            <img src='${getShowPoster}' href='${showURL}'>
                        </div>
                        <div id='randomResultInfoContainer'>
                            <p>${show}</p>
                            <p>Season ${season} Episode ${epNum}</p>
                            <p>${name} - Runtime: ${length}</p>
                            <p>${description}</p>
                            <p>Original Air Date: ${airDate}</p>
                            <p><a target='_blank' href='${showURL}'>Link to The Movie DB Page For Full Information</a></p>
                            <button id='btnReRandom'>Random Again</button>
                        </div>
        
                    `)
                };
            })
        }

        const formAddFavoriteTVShow = document.getElementById('formAddFavoriteTVShow');
        const inputAddFavoriteTVShow = document.getElementById('inputAddFavoriteTVShow');    
    
        formAddFavoriteTVShow.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = inputAddFavoriteTVShow.value;
    
            let searchURL = new URL('https://api.themoviedb.org/3/search/tv');
            searchURL.searchParams.append('query', searchTerm);
            
            const options = {
                method: 'GET',
                headers: {
                  accept: 'application/json',
                  Authorization: TMDBAPIKEY
                }
              };
              
              fetch(searchURL, options)
                .then(response => response.json())
                .then(response => createAddFavoriteTVShowSection(response))
                .catch(err => console.error(err));
    
    
            function createAddFavoriteTVShowSection (dataObj) {
    
                // console.log('tv data object: ', dataObj);
    
                const results = dataObj.results;
    
                for (let i = 0; i < results.length; i++) {
    
                    let title = results[i].name;
                    let showID = results[i].id;
                    let posterPath = results[i].poster_path;
    
                    let showPoster = getTMDBImage('w154', posterPath);
    
                    searchResultsAddFavoriteTVShowContainer?.insertAdjacentHTML('beforeend', `
                        <div class='favorite-show-card'>
                            <img src='${showPoster}'>
                            <p>${title}</p>
                            <button class='btn-add-favorite-tv-show' data-show-id='${showID}'>Add To Favorites</button>
                        </div>
                    `)
    
                }
    
                const arrayOfAddFavoriteShowButtons = document.getElementsByClassName('btn-add-favorite-tv-show');
    
                for (let i = 0; i < arrayOfAddFavoriteShowButtons.length; i++) {
                    arrayOfAddFavoriteShowButtons[i].addEventListener('click', (e) => {
                        console.log('Added Favorite Show!');
                        console.log(e.target.dataset.showId);
    
                        const showId = e.target.dataset.showId;
    
                        const options = {
                            method: 'GET',
                            headers: {
                              accept: 'application/json',
                              Authorization: TMDBAPIKEY
                            }
                          };
                          
                          fetch(`https://api.themoviedb.org/3/tv/${showId}?language=en-US`, options)
                            .then(response => response.json())
                            .then(response => getTVShow(response))
                            .catch(err => console.error(err));
    
                        // Add show to my users/ favorite shows docs.  Use showID as it's doc name.
    
                        async function getTVShow(showObject) {
                            // console.log(showObject);
    
                            const dataObject = {
                                name: showObject.name,
                                id: showObject.id,
                                numOfSeasons: showObject.number_of_seasons,
                                numOfEpisodes: showObject.number_of_episodes,
                                description: showObject.overview,
                                posterPath: showObject.poster_path,
                                seasons: showObject.seasons,
                            }
    
                            // console.log('dataObject', dataObject)
    
                            try {
                                setDoc(doc(db, 'users', 'testUser', 'favoriteTVShows', showId), dataObject);
                                console.log('Favorite TV Show Added to FireStore', dataObject);
                            } catch (e) {
                                console.error ("Error Adding TV to Favorites: ", e);
                            }
                        }
                    })
                }
            }
        })
    })

    function getRandom (max: number) {
        const minCeiled = Math.ceil(1);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
    }
}