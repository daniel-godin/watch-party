// Imports:
import { TMDBOptions, getTMDBImage } from "./tmdbUtilities";

// Firebase Imports:
import { auth, db,  } from "./firebase";
import { setDoc, doc, onSnapshot, updateDoc, collection, getDoc, deleteDoc, } from "firebase/firestore";

export async function createRandomTVEpisodeUI() {

    pageContainer?.insertAdjacentHTML('afterbegin', `
        <div id='randomTVShowPageContainer'>
            <div id='randomResultContainer'>
            </div>
            <div id='randomAllButtonContainer'>
                <button id='btnRandomAll'>Random Episode From All Your Shows</button>
            </div>
            <div id='favoriteShowsContainer' class='random-tv-show-content-container'>
            </div>
            <div id='searchResultsAddFavoriteTVShowContainer' class='random-tv-show-content-container'>
            </div>
        </div>
    `)
    const randomTVShowPageContainer = document.getElementById('randomTVShowPageContainer');
    const randomAllButtonContainer = document.getElementById('randomAllButtonContainer');
    const btnRandomAll = document.getElementById('btnRandomAll');
    const favoriteShowsContainer = document.getElementById('favoriteShowsContainer');
    const randomResultContainer = document.getElementById('randomResultContainer');
    const searchResultsAddFavoriteTVShowContainer = document.getElementById('searchResultsAddFavoriteTVShowContainer');

    const arrayOfFavoriteShowsByID = [];

    const colRef = collection(db, 'users', 'testUser', 'favoriteTVShows');
    onSnapshot(colRef, (snapshot) => {
        favoriteShowsContainer.innerHTML = '';

        snapshot.forEach((document) => {
            const data = document.data();

            arrayOfFavoriteShowsByID.push(data.id);

            const title = data.name;
            const id = data.id;
            const showPosterPath = data.posterPath;

            const showPoster = getTMDBImage('w154', showPosterPath);

            favoriteShowsContainer?.insertAdjacentHTML('beforeend', `
                <div class='favorite-show-card'>
                    <img src='${showPoster}' class='image-favorite-tv-show-posters'>
                    <p>${title}</p>
                    <button type='button' class='random-tv-button random-tv-button-style' data-show-id='${id}'>Random ${title} Episode</button>
                </div>
            `)
        })

        favoriteShowsContainer?.insertAdjacentHTML('beforeend', `
            <div id='addFavoriteTVShowContainer' class='favorite-show-card'>
                <form id='formAddFavoriteTVShow'>
                    <img height='231' width='154'>
                    <input id='inputAddFavoriteTVShow' type='text' placeholder='Add A Favorite Show'>
                    <button id='btnAddFavoriteTVShow' class='random-tv-button-style' type='submit'>Search</button>
                </form>
            </div>
        `)

        btnRandomAll?.addEventListener('click', async (e) => {
            e.preventDefault();
            const randomShow = arrayOfFavoriteShowsByID[Math.floor(Math.random() * arrayOfFavoriteShowsByID.length)];
            displayRandomEpisode(randomShow, randomResultContainer);
        })

        const randomEpisodeButtons = document.getElementsByClassName('random-tv-button');
        for (let i = 0; i < randomEpisodeButtons.length; i++) { // Logic for buttons to choose random episode for that show.
            randomEpisodeButtons[i].addEventListener('click', async (e) => {
                e.preventDefault();

                displayRandomEpisode(e.target.dataset.showId, randomResultContainer);
            })
        }

        const formAddFavoriteTVShow = document.getElementById('formAddFavoriteTVShow');
        const inputAddFavoriteTVShow = document.getElementById('inputAddFavoriteTVShow');    
    
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
    
                console.log('tv data object: ', dataObj);
    
                const results = dataObj.results;
    
                for (let i = 0; i < results.length; i++) {
    
                    let title = results[i].name;
                    let showID = results[i].id;
                    let posterPath = results[i].poster_path;
    
                    let showPoster = getTMDBImage('w154', posterPath);
    
                    searchResultsAddFavoriteTVShowContainer?.insertAdjacentHTML('beforeend', `
                        <div class='favorite-show-card red-border'>
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
                          
                          fetch(`https://api.themoviedb.org/3/tv/${showId}?language=en-US`, TMDBOptions)
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
}

async function displayRandomEpisode(showID, DOMAttachmentPoint) {
    // console.log('displayRandomEpisode Function Triggered: ', showID, DOMAttachmentPoint);

    DOMAttachmentPoint.innerHTML = '';

    showID = String(showID); // Needed to change this into a string because docRef wouldn't take a number.

    const docRef = doc(db, 'users', 'testUser', 'favoriteTVShows', showID);
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

            DOMAttachmentPoint.insertAdjacentHTML('afterbegin', `
                <div id='randomResultIMGContainer'>
                    <img src='${getShowPoster}' href='${showURL}' class='image-favorite-tv-show-posters'>
                </div>
                <div id='randomResultInfoContainer'>
                    <p>${show}</p>
                    <p>Season ${season} Episode ${epNum}</p>
                    <p>${name} - Runtime: ${length}</p>
                    <p>${description}</p>
                    <p>Original Air Date: ${airDate}</p>
                    <p><a target='_blank' href='${showURL}'>Link to The Movie DB Page For Full Information</a></p>
                </div>

            `)
        })
        .catch(err => console.error(err));
}

function getRandom (max: number) {
    const minCeiled = Math.ceil(1);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}