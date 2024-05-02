// Imports:
import { TMDBOptions, getTMDBImage } from "./tmdbUtilities";
import './delete-fav-show.svg';

// Firebase Imports:
import { db } from "./firebase";
import { setDoc, doc, onSnapshot, updateDoc, collection, getDoc, deleteDoc, } from "firebase/firestore";

// Code/Functionality:

export async function createRandomTVEpisodeUI(mainContentContainer: HTMLElement, user: any) {

    const userID:string = user.uid;

    mainContentContainer.innerHTML = '';
    mainContentContainer.insertAdjacentHTML('afterbegin', `
        <main id='randomTVShowPageContainer'>
            <div id='randomResultContainer'>
            </div>
            <div id='randomAllButtonContainer' class=''>
            </div>
            <div id='favoriteShowsContainer' class='random-tv-show-content-container'>
            </div>
            <div id='searchResultsAddFavoriteTVShowContainer' class='random-tv-show-content-container'>
            </div>
        </main>
    `)
    const randomResultContainer = document.getElementById('randomResultContainer') as HTMLElement;
    const searchResultsAddFavoriteTVShowContainer = document.getElementById('searchResultsAddFavoriteTVShowContainer') as HTMLElement;

    const colRef = collection(db, 'users', userID, 'favoriteTVShows'); 
    onSnapshot(colRef, (snapshot) => {

        const arrayOfFavoriteShowsByID: any[] = [];

        const favoriteShowsContainer = document.getElementById('favoriteShowsContainer') as HTMLElement;
        favoriteShowsContainer.innerHTML = '';
        snapshot.forEach((document) => {
            const data = document.data();

            arrayOfFavoriteShowsByID.push(data.id);

            const title: string = data.name;
            const id = data.id;
            const showPosterPath: string = data.posterPath;

            const TMDBTVShowLink = new URL(`https://www.themoviedb.org/tv/${id}`);

            const showPoster = getTMDBImage('w185', showPosterPath);

            favoriteShowsContainer.insertAdjacentHTML('beforeend', `
                <div class='favorite-show-card'>
                    <a href='${TMDBTVShowLink}' class='link-img-poster' target='_blank'><img src='${showPoster}' class='image-favorite-tv-show-posters'></a>
                    <div class='favorite-show-name-and-remove-btn-container'>
                        <p>${title}</p>
                        <button type='button' class='button-remove-favorite-show' data-show-id='${id}'>
                            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="40px" height="40px" data-show-id='${id}' data-show-name='${title}'>
                                <path fill="#f44336" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z" data-show-id='${id}'  data-show-name='${title}'/>
                                <path fill="#fff" d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z" data-show-id='${id}'  data-show-name='${title}'/>
                                <path fill="#fff" d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z" data-show-id='${id}'  data-show-name='${title}'/>
                            </svg>
                        </button>
                    </div>
                    <button type='button' class='random-tv-button btn-style-default' data-show-id='${id}' data-show-name='${title}'>Random ${title} Episode</button>
                </div>
            `)
        })

        console.log('array of fav shows array length: ', arrayOfFavoriteShowsByID.length);

        favoriteShowsContainer.insertAdjacentHTML('beforeend', `
            <div id='addFavoriteTVShowContainer' class='favorite-show-card'>
                <form id='formAddFavoriteTVShow'>
                    <img height='231' width='154'>
                    <input id='inputAddFavoriteTVShow' type='text' placeholder='Add A Favorite Show'>
                    <button id='btnAddFavoriteTVShow' class='random-tv-button-style btn-style-default' type='submit'>Search</button>
                </form>
            </div>
        `)

        const randomAllButtonContainer = document.getElementById('randomAllButtonContainer') as HTMLElement;
        if (arrayOfFavoriteShowsByID.length < 2) { 
            randomAllButtonContainer.classList.add('hidden'); // Hides the Random All Container.  No need to have a Random All if there are fewer than 2 shows.
        };
        if (arrayOfFavoriteShowsByID.length >= 2) { 
            randomAllButtonContainer.insertAdjacentHTML('afterbegin', `
                <button id='btnRandomAll' class='btn-style-default'>Random Episode From All Your Shows</button>
            `)

            const btnRandomAll = document.getElementById('btnRandomAll') as HTMLButtonElement;
            btnRandomAll.addEventListener('click', async (e) => {
                e.preventDefault();
                const randomShow = arrayOfFavoriteShowsByID[Math.floor(Math.random() * arrayOfFavoriteShowsByID.length)];
                const arrayOfShows: any[] = [...arrayOfFavoriteShowsByID];
                displayRandomEpisode(arrayOfShows, userID, randomShow, randomResultContainer);
            })
        }

        const randomEpisodeButtons = document.getElementsByClassName('random-tv-button');
        for (let i = 0; i < randomEpisodeButtons.length; i++) { // Logic for buttons to choose random episode for that show.
            randomEpisodeButtons[i].addEventListener('click', async (e) => {
                e.preventDefault();
                const showID: number = e.target.dataset.showId;
                const showArray: number[] = [showID];

                displayRandomEpisode(showArray, userID, showID, randomResultContainer);
            })
        }

        const removeFavoriteShowButtons = document.getElementsByClassName('button-remove-favorite-show');
        for (let i = 0; i < removeFavoriteShowButtons.length; i++) {
            removeFavoriteShowButtons[i].addEventListener('click', async (e) => {
                const showID = e.target.dataset.showId;
                const showName = e.target.dataset.showName;

                if (window.confirm(`Do you want to remove ${showName}?`)) {
                    // Remove show from the user's Firestore DB Collection of Favorited Shows.
                    // Use showID to search through arrayOfFavoriteShowsByID and remove it from the array.
                    const deleteIndex = arrayOfFavoriteShowsByID.indexOf(Number(showID));
                    arrayOfFavoriteShowsByID.splice(deleteIndex, 1);
                    await deleteDoc(doc(colRef, showID)); // This worked in testing.  Would prefer not to have to re-write this if I need to change colRef at top.
                };
            })
        }

        const formAddFavoriteTVShow = document.getElementById('formAddFavoriteTVShow') as HTMLFormElement;
        const inputAddFavoriteTVShow = document.getElementById('inputAddFavoriteTVShow') as HTMLInputElement;    
    
        formAddFavoriteTVShow.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchTerm = inputAddFavoriteTVShow.value;
    
            let searchURL = new URL('https://api.themoviedb.org/3/search/tv');
            searchURL.searchParams.append('query', searchTerm);
              
              fetch(searchURL, TMDBOptions)
                .then(response => response.json())
                .then(response => createAddFavoriteTVShowSection(response))
                .catch(err => console.error(err));
    
    
            function createAddFavoriteTVShowSection (dataObj) {
                searchResultsAddFavoriteTVShowContainer.innerHTML = '';
    
                const results = dataObj.results;
    
                for (let i = 0; i < results.length; i++) {
    
                    let title = results[i].name;
                    let showID = results[i].id;
                    let posterPath = results[i].poster_path;
    
                    let showPoster = getTMDBImage('w154', posterPath);
    
                    searchResultsAddFavoriteTVShowContainer.insertAdjacentHTML('beforeend', `
                        <div class='favorite-show-card red-border'>
                            <img src='${showPoster}'>
                            <p>${title}</p>
                            <button class='btn-add-favorite-tv-show btn-style-default' data-show-id='${showID}'>Add To Favorites</button>
                        </div>
                    `)
                }
    
                const arrayOfAddFavoriteShowButtons = document.getElementsByClassName('btn-add-favorite-tv-show');
    
                for (let i = 0; i < arrayOfAddFavoriteShowButtons.length; i++) {
                    arrayOfAddFavoriteShowButtons[i].addEventListener('click', (e) => {
    
                        const showId = e.target.dataset.showId;
                          
                          fetch(`https://api.themoviedb.org/3/tv/${showId}?language=en-US`, TMDBOptions)
                            .then(response => response.json())
                            .then(response => getTVShow(response))
                            .catch(err => console.error(err));
    
                        // Add show to my users/ favorite shows docs.  Use showID as it's doc name.
    
                        async function getTVShow(showObject) {
    
                            const dataObject = {
                                name: showObject.name,
                                id: showObject.id,
                                numOfSeasons: showObject.number_of_seasons,
                                numOfEpisodes: showObject.number_of_episodes,
                                description: showObject.overview,
                                posterPath: showObject.poster_path,
                                seasons: showObject.seasons,
                            }

                            try {
                                setDoc(doc(db, 'users', userID, 'favoriteTVShows', showId), dataObject); // Adds a doc to user > favoriteShows (coll) > doc.
                            } catch (e) {
                                console.error ("Error Adding TV to Favorites: ", e);
                            }
                        }
                    })
                }
            }
        })
    })
}

async function displayRandomEpisode(arrayOfShows: number[], userID, showID, randomResultContainer: HTMLElement) {

    randomResultContainer.innerHTML = '';
    randomResultContainer.insertAdjacentHTML('afterbegin', `
        <p>Your Random Show Is Loading.  Please Wait 1 Second Before Trying Again</p>
    `)

    showID = String(showID); // Needed to change this into a string because docRef wouldn't take a number.

    const docRef = doc(db, 'users', userID, 'favoriteTVShows', showID);
    const docSnap = await getDoc(docRef);

    const showData = docSnap.data();

    const numOfSeasons = showData.numOfSeasons;
    const randomSeason = getRandom(numOfSeasons);
    const randomEpisode = getRandom(showData.seasons[randomSeason].episode_count);

    let TVSearchURL = new URL(`https://api.themoviedb.org/3/tv/${showID}/season/${randomSeason}/episode/${randomEpisode}?language=en-US`);

    fetch(TVSearchURL, TMDBOptions)
        .then(response => response.json())
        .then(response => {
            // This part saves the variables and then creates the DOM from this data.
        
            const episodeData = response;

            let show: string = showData.name;
            let name: string = episodeData.name;
            let description: string = episodeData.overview;
            let airDate: string = episodeData.air_date;
    
            let season: number = episodeData.season_number;
            let epNum: number = episodeData.episode_number;
            let length: number = episodeData.runtime;

            let episodePoster: string = episodeData.still_path;
            let showPoster: string = showData.posterPath;

            let getEpisodePoster = getTMDBImage('w185', episodePoster);
            let getShowPoster = getTMDBImage('w185', showPoster);
            let showURL: string = `https://themoviedb.org/tv/${showID}-stargate-sg-1/season/${season}/episode/${epNum}`;

            setTimeout(() => {
                randomResultContainer.innerHTML = '';
                randomResultContainer.insertAdjacentHTML('afterbegin', `
                    <div id='randomResultIMGContainer'>
                        <img src='${getShowPoster}' href='${showURL}' class='image-favorite-tv-show-posters'>
                    </div>
                    <div id='randomResultInfoContainer'>
                        <header>${show}</header>
                        <ul>
                            <li>Season ${season}</li>
                            <li>Episode ${epNum}</li>
                            <li>${name}</li>
                            <li>${description}</li>
                            <li>Original Air Date: ${airDate}</li>
                            <li>Runtime: ${length}</li>
                            <li><a target='_blank' href='${showURL}'>Link to The Movie DB Page For Full Information</a></li>
                        </ul>
                        <button type='button' id='btnRandomAgain' class='btn-default'>Random Again</button>
                    </div>
                `)

                const btnRandomAgain = document.getElementById('btnRandomAgain') as HTMLButtonElement;
                btnRandomAgain.addEventListener('click', (e) => {
                    e.preventDefault();
                    const randomShowForReRandomButton = arrayOfShows[Math.floor(Math.random() * arrayOfShows.length)];
                    displayRandomEpisode(arrayOfShows, userID, randomShowForReRandomButton, randomResultContainer);
                })
            }, 1000)

        })
        .catch(err => {
            console.error(err)
            randomResultContainer.innerHTML = '';
            randomResultContainer.insertAdjacentHTML('afterbegin', `
                <p>Error Loading Random Episode From <a href='https://www.themoviedb.org'>The Movie Database</a>.  Please try again later.</p>
            `)
        });
}

function getRandom (max: number) {
    const minCeiled = Math.ceil(1);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}