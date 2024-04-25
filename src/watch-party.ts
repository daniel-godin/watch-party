// Imports:
import { copyToClipboard, randomIdGenerator } from "./utils";
import { TMDBOptions, getTMDBImage } from "./tmdbUtilities";

// Firebase Imports:
import { auth, db,  } from "./firebase";
import { setDoc, doc, onSnapshot, collection, deleteDoc, } from "firebase/firestore";


// export async function createWatchPartyUI(mainContentContainer: HTMLElement, user: object) {

//     let watchPartyIDFromURL = window.location.search;
//     watchPartyIDFromURL = watchPartyIDFromURL.slice(1);

//     if (watchPartyIDFromURL.length < 1) { watchPartyIDFromURL = '?watchPartyNotDetected'; } // This is to fix the firestore check with an empty string.

//     const docRef = doc(db, 'watchParties', watchPartyIDFromURL);
//     onSnapshot(docRef, (snapshot) => { // Live Listener that watches the main Watch Party Doc.  Sub-Coll under it with title docs.  That is in it's on onSnapshot Listener.
//         mainContentContainer.innerHTML = '';

//         if (snapshot.exists()) {
//             const data = snapshot.data();

//             const watchPartyID = data.watchPartyID;
//             const watchPartyName = data.watchPartyName;
//             const dateCreated = data.dateCreated;
//             const dateOfWatchParty = data.dateOfWatchParty;

//             const watchPartyURL = window.location.href;

//             mainContentContainer.insertAdjacentHTML('afterbegin', `
//                 <div id='demoWatchPartyContainer' class='main-container'>
//                     <h1>Welcome to the ${watchPartyName} Watch Party Page</h1>
//                     <p>Date of Party: ${dateOfWatchParty}</p>
//                     <p>Watch Party Unique ID:  <span id='txtWatchPartyID'>${watchPartyID}</span></p>
//                         <button id='btnCopyWatchPartyID' type='button'>Copy ID</button>
//                     <p>Watch Party Unique URL:  <span id='txtWatchPartyURL'>${watchPartyURL}</span></p>
//                         <button id='btnCopyWatchPartyURL' type='button'>Copy URL</button>
//                     <form id='watchPartyForm'>
//                     </form>
//                 </div>
//             `)

//             const copyWatchPartyIDText = document.getElementById('txtWatchPartyID')?.innerText;
//             const copyWatchPartyURLText = document.getElementById('txtWatchPartyURL')?.innerText;
//             const btnCopyWatchPartyID = document.getElementById('btnCopyWatchPartyID') as HTMLButtonElement;
//             const btnCopyWatchPartyURL = document.getElementById('btnCopyWatchPartyURL') as HTMLButtonElement;

//             copyToClipboard(btnCopyWatchPartyID, copyWatchPartyIDText);
//             copyToClipboard(btnCopyWatchPartyURL, copyWatchPartyURLText);



//         } else {
//             // Watch Page Didn't Find the document.  Load a quick page with a search form, a header, and a way to go back to index.
//             mainContentContainer.insertAdjacentHTML('afterbegin', `
//                 <h1>Watch Page Not Found</h1>
//                 <p>Please search below, or <a href='./index.html'>Go Back To Home Page</a>.</p>
//                 <form id='formSearchForWatchPartyID'>
//                     <input id='inputSearchForWatchPartyID' type='text' placeholder='Put Your Unique ID Here'>
//                     <button id='btnSearchForWatchPartyID' type='submit'>
//                 </form>
//             `)

//             const formSearchForWatchPartyID = document.getElementById('formSearchForWatchPartyID');
//             const inputSearchForWatchPartyID = document.getElementById('inputSearchForWatchPartyID');

//             formSearchForWatchPartyID?.addEventListener('submit', (e) => {
//                 e.preventDefault();
//                 // Needs to redirect to url.com/watch.html?{Unique ID Here}.
//                 let baseURL = 'http://127.0.0.1:5050/';  // This honestly should change and not be hard coded.

//                 let watchPartyURL = 'watch.html?' + inputSearchForWatchPartyID.value;

//                 let findPartyURL = new URL(watchPartyURL, baseURL);

//                 window.location.replace(findPartyURL);
//             })
//         }
//     })

//     const colRef = collection(db, 'watchParties', watchPartyIDFromURL, 'titleOptions');

//     onSnapshot(colRef, (snapshot) => {
//         let count = 0; // Count to keep titles to 10 or less.  Check if(statements) below.


//         const watchPartyForm = document.getElementById('watchPartyForm') as HTMLFormElement;
//         watchPartyForm.innerHTML = '';
//         snapshot.forEach((document) => {
//             count++;
//             const data = document.data();

//             const title = data.title;
//             const id = data.id;

//             watchPartyForm.insertAdjacentHTML('beforeend', `
//                 <div class='option-container'>
//                     <div class='vote-container'>
//                         <button type='button' class="vote-buttons">Yes</button>
//                         <button type='button' class="vote-buttons">Maybe/Indifferent</button>
//                         <button type='button' class="vote-buttons">No</button>
//                     </div>
                    
//                     <div class='title-container'>
//                         <p>${title}</p>
//                     </div>
                    
//                     <div class='add-or-remove-button-container'>
//                         <button type='button' class='button-remove-title' data-id='${id}'>-</button>
//                     </div>
//                 </div>
//             `)
//         });

//         const arrayOfBtnRemoveTitle = document.getElementsByClassName('button-remove-title');
//         for (let i = 0; i < arrayOfBtnRemoveTitle.length && i < 11; i++) {
//             arrayOfBtnRemoveTitle[i].addEventListener('click', async (e) => {
//                 await deleteDoc(doc(db, "watchParties", watchPartyIDFromURL, 'titleOptions', e.target.dataset.id));
//             });
//         };

//         if (count < 5) {
//             watchPartyForm.insertAdjacentHTML('beforeend', `
//                     <div id='addTitleContainer'>
//                         <form id='formAddTitle'>
//                             <input type='text' id='addTitleInput' placeholder='Add Another Title Here' />
//                             <button type='submit' id='btnAddTitle'>+</button>
//                         </form>
//                     </div>
//                 `)
    
//                 const addTitleInput = document.getElementById('addTitleInput') as HTMLInputElement;
//                 const btnAddTitle = document.getElementById('btnAddTitle') as HTMLButtonElement;
//                 const formAddTitle = document.getElementById('formAddTitle') as HTMLFormElement;

                

//                 formAddTitle.addEventListener('submit', async (e) => {
//                     e.preventDefault();

//                     let searchURL = new URL('https://api.themoviedb.org/3/search/movie');
//                     searchURL.searchParams.append('query', addTitleInput.value);
                    
//                     fetch(searchURL, TMDBOptions)
//                     .then(response => response.json())
//                     .then(response => chooseMovieAfterSearch(response))
//                     .catch(err => console.error(err));

//                     function chooseMovieAfterSearch(searchObj) {

//                         console.log('chooseMovie function triggered.  Here is the Object: ', searchObj);
//                         console.log('array of search results: ', searchObj.results); // This is an array of Objects.



//                         for (let i = 0; i < 5; i++) {

//                             let title = searchObj.results[i].title;
//                             let imgSRC = 'https://image.tmdb.org/t/p/w92' + searchObj.results[i].poster_path;


//                             mainContentContainer.insertAdjacentHTML('beforeend', `
//                                 <div class='search-result-container'>
//                                     <img src='${imgSRC}' class='search-img'>
//                                     <p>${title}</p>
//                                 </div>
//                             `)
//                         }
//                     }


//                     const id = randomIdGenerator();
    
//                     const newTitleObject = {
//                         id: id,
//                         title: addTitleInput.value,
//                         links: {
//                             tmdb: "https://link.com",
//                         },
//                         votes: {
//                             yes: 0,
//                             maybe: 0,
//                             no: 0
//                         }
//                     }

//                     try {
//                         setDoc(doc(db, 'watchParties', watchPartyIDFromURL, 'titleOptions', id), newTitleObject);
//                     } catch (e) {
//                         console.error("Eerror adding document: ", e);
//                     }
//                 })
//         }

//         if (count >= 5) { console.log('Only 5 options allowed at this time.  Please remove a title if you wish to add a different one.')}

//     })
// }

// *** Watch Party Demo Page ***

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

export async function createDemoPageUI(mainContentContainer: HTMLElement, user: object) {
    // This should look through the 00-demoWatchParty document in the Firestore database 
    // and create an editable UI.

    // Later... Creates a shallow copy to play around with on a local level.  Does not alter main firebase doc, this way others can play with it too.

    const docRef = doc(db, "watchParties", "00-demoWatchParty"); // Firestore Document Reference to Demo Page.

    onSnapshot(docRef, (snapshot) => {

        mainContentContainer.innerHTML = '';
        if (snapshot.exists()) {
            const data = snapshot.data();
    
            const watchPartyID = data.watchPartyID;
            const watchPartyName = data.watchPartyName;
            const dateCreated = data.dateCreated;
            const dateOfWatchParty = data.dateOfWatchParty;
    
            mainContentContainer.insertAdjacentHTML('afterbegin', `
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
            mainContentContainer.insertAdjacentHTML('afterbegin', `
                <p>Error:  Document not loading.  Please go back to <a href='./index.html'>Main Page</a>.</p>
            `)
        }
    });

    const colRef = collection(db, 'watchParties', '00-demoWatchParty', 'titleOptions');
    onSnapshot(colRef, (snapshot) => {

        const watchPartyForm = document.getElementById('watchPartyForm') as HTMLFormElement;

        watchPartyForm.innerHTML = ''; // Resets DOM every time onSnapshot is triggered.  Prevents duplicates.

        let count = 0; // Count to keep titles to 10 and below.  If statements below.

        snapshot.forEach((document) => {
            count++;
            const data = document.data();

            const title = data.title;
            const id = data.id;

            watchPartyForm.insertAdjacentHTML('beforeend', `
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
            watchPartyForm.insertAdjacentHTML('beforeend', `
                <div id='addTitleContainer'>
                    <input type='text' id='addTitleInput' placeholder='Add Another Title Here' />
                    <button type='button' id='btnAddTitle'>+</button>
                </div>
            `)
    
            const addTitleInput = document.getElementById('addTitleInput') as HTMLInputElement;
            const btnAddTitle = document.getElementById('btnAddTitle') as HTMLButtonElement;
    
            btnAddTitle.addEventListener('click', async (e) => {
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

        if (count >= 5) { console.log('Only 5 options allowed at this time.  Please remove a title if you wish to add a different one.')}
    })
}


// OLD INDEX PAGE, MOVING THE CREATION OF A MOVIE WATCH PARTY TO HERE, AND PULL IN THE FUNCTION TO DO SO ON INDEX LATER.

// async function OLDINDEXUIPAGE(mainContentContainer: HTMLElement, user: object) {

//     mainContentContainer.innerHTML = '';
//     mainContentContainer.insertAdjacentHTML('afterbegin', `
//         <div id='newWatchPartyContainer' class='main-container'>
//             <h1>Create Your Watch Party (save the link/unique watch party id)</h1>
//             <form id='newWatchPartyForm'>
//                 <label>Add Your First Movie:
//                     <input id='inputTitle' type='text' required>
//                 </label>
//                 <button id='btnCreateWatchParty' type='submit'>Create Watch Party</button>
//             </form>
//         </div>
//     `)

//     const newWatchPartyForm = document.getElementById('newWatchPartyForm') as HTMLFormElement;
//     const inputTitle = document.getElementById('inputTitle') as HTMLInputElement;

//     newWatchPartyForm.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         const watchPartyID = randomIdGenerator();

//         const watchPartyObj = {
//             watchPartyID: watchPartyID,
//             dateCreated: "date string",
//             dateOfWatchParty: 'date string',
//             guests: 'array of guest names in strings',            
//         }

//         const titleID = randomIdGenerator();

//         const newTitleObject: object = {
//             id: titleID,
//             title: inputTitle.value,
//             links: {
//                 tmdb: "https://link.com",
//             },
//             votes: {
//                 yes: 0,
//                 maybe: 0,
//                 no: 0
//             }
//         } 

//         try {
//             setDoc(doc(db, 'watchParties', watchPartyID), watchPartyObj);
//             setDoc(doc(db, 'watchParties', watchPartyID, 'titleOptions', titleID), newTitleObject);
//             console.log("Watch Party Document written with ID: ", watchPartyID);
//             console.log("Title Doc created with ID: ", titleID);

//             // Should redirect to newly created watch party page.

//             mainContentContainer.innerHTML = '';

//             mainContentContainer.insertAdjacentHTML('afterbegin', `
//                 <p>Creating Your Watch Party Page.  You will be redirected in 3 seconds.</p>
//             `)

//             setTimeout(() => { 

//                 const docRef = doc(db, 'watchParties', watchPartyID); 
//                 onSnapshot(docRef, (snapshot) => {
//                     if (snapshot.exists()) {    
//                         let baseURL = window.location.origin;
//                         let partyURL = 'watch.html?' + watchPartyID;
//                         let fullPartyURL = new URL(partyURL, baseURL);
//                         window.location.replace(fullPartyURL);
//                     } else {
//                         console.log('snapshot did not load correctly');
//                     }
//                 })
//             }, 3000)

//         } catch (e) {
//             console.error("Error adding document: ", e);
//         }
//     })
// }

// New createWatchPartyUI page function:

export async function newcreateWatchPartyUI(mainContentContainer: HTMLElement, user: Object) {

    // Creates scaffolding for the watch party page.
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

    const watchPartyInfo = document.getElementById('watchPartyInfo') as HTMLElement;
    const watchPartySearch = document.getElementById('watchPartySearch') as HTMLElement;
    const watchPartyNewWatchParty = document.getElementById('watchPartyNewWatchParty') as HTMLElement;

    createWatchPartyInfoUI(watchPartyInfo);
    createWatchPartySearchUI(watchPartySearch);
    createWatchPartyNewWatchPartyUI(watchPartyNewWatchParty);

}

function createWatchPartyInfoUI(watchPartyInfo: HTMLElement) {

    let watchPartyIDFromURL = window.location.search;
    watchPartyIDFromURL = watchPartyIDFromURL.slice(1); // Slicing off the "?", so I can search for it in Firestore Docs.

    if (watchPartyIDFromURL.length < 1) { watchPartyIDFromURL = '?watchPartyNotDetected'; } // This is to fix the firestore check with an empty string.

    const watchPartyDocRef = doc(db, 'watchParties', watchPartyIDFromURL);
    onSnapshot(watchPartyDocRef, (snapshot) => { // Live Listener that watches the main Watch Party Doc.  Sub-Coll under it with title docs.  That is in it's on onSnapshot Listener.
        // If... Else:  If Document Found matching ?search URL param, create the watch party page, else, create a "Not Found" Message.
        if(snapshot.exists()) {
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
                <p>Watch Party Unique ID:  <span id='txtWatchPartyID'>${watchPartyID}</span></p>
                    <button id='btnCopyWatchPartyID' type='button'>Copy ID</button>
                <p>Watch Party Unique URL:  <span id='txtWatchPartyURL'>${watchPartyURL}</span></p>
                    <button id='btnCopyWatchPartyURL' type='button'>Copy URL</button>
                <div id='watchPartyMoviesContainer'>
                </div>
            `)

            const copyWatchPartyIDText = document.getElementById('txtWatchPartyID')?.innerText;
            const copyWatchPartyURLText = document.getElementById('txtWatchPartyURL')?.innerText;
            const btnCopyWatchPartyID = document.getElementById('btnCopyWatchPartyID') as HTMLButtonElement;
            const btnCopyWatchPartyURL = document.getElementById('btnCopyWatchPartyURL') as HTMLButtonElement;

            copyToClipboard(btnCopyWatchPartyID, copyWatchPartyIDText);
            copyToClipboard(btnCopyWatchPartyURL, copyWatchPartyURLText);

            // const collectionOfMoviesRef = collection(db, 'watchParties', watchPartyIDFromURL, 'titleOptions');
            const collectionOfMoviesRef = collection(watchPartyDocRef, 'titleOptions');
            createWatchPartyFromDB(collectionOfMoviesRef);


        } else {
            // const watchPartyInfo = document.getElementById('watchPartyInfo') as HTMLElement;
            watchPartyInfo.innerHTML = '';
            watchPartyInfo.insertAdjacentHTML('afterbegin', `
                <h1>Watch Page Not Found</h1>
                <p>Please search below, or <a href='./index.html'>Go Back To Home Page</a>.</p>
            `)
        }



    });
}

function createWatchPartySearchUI(watchPartySearch: HTMLElement) {

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

function createWatchPartyNewWatchPartyUI(watchPartyNewWatchParty: HTMLElement) {

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

async function createWatchPartyFromDB(collectionOfMoviesRef) {

    const watchPartyMoviesContainer = document.getElementById('watchPartyMovies') as HTMLElement;
    watchPartyMoviesContainer.innerHTML = ''
    watchPartyMoviesContainer.insertAdjacentHTML('afterbegin', `
        <div id='watchPartyMovies'>
        </div>
        <div id='watchPartyMovieSearchResults'>
        </div>
    `)

    onSnapshot(collectionOfMoviesRef, (snapshot) => {
        let count = 0; // Count to keep titles to 5 or less.  Check if(statements) below.

        // Start of creating the Watch Party movies section in UI.
        const watchPartyMovies = document.getElementById('watchPartyForm') as HTMLElement;
        watchPartyMovies.innerHTML = '';
        snapshot.forEach((document: any) => {
            count++; // Adds one to count.  Keep number of movies in a watch party's options to 5 or less.

            const data = document.data();

            const title = data.title;
            const id = data.id;
            // NEEDS MORE DATA HERE FROM THE MOVIE DB.  JUST LIKE RANDOM TV SHOW APP.

            // Creates a box container for each title.  Starting at before end, so first created is at the top in DOM/UI.
            watchPartyMovies.insertAdjacentHTML('beforeend', `
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

async function createWatchPartyInDB() {
    
}