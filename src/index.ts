// Imports:
import { randomIdGenerator } from "./utils";

// Firebase Imports:
import { db,  } from "./firebase";
import { setDoc, doc, onSnapshot,   } from "firebase/firestore";


// Code/Functionality:

export async function createIndexPageUI(mainContentContainer: HTMLElement, user: object) {

    mainContentContainer.innerHTML = '';
    mainContentContainer.insertAdjacentHTML('afterbegin', `
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

    const newWatchPartyForm = document.getElementById('newWatchPartyForm') as HTMLFormElement;
    const inputTitle = document.getElementById('inputTitle') as HTMLInputElement;

    newWatchPartyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const watchPartyID = randomIdGenerator();

        const watchPartyObj = {
            watchPartyID: watchPartyID,
            dateCreated: "date string",
            dateOfWatchParty: 'date string',
            guests: 'array of guest names in strings',            
        }

        const titleID = randomIdGenerator();

        // const newTitleObject: object = {
        //     id: titleID,
        //     title: inputTitle.value,
        //     links: {
        //         tmdb: "https://link.com",
        //     },
        //     votes: {
        //         yes: 0,
        //         maybe: 0,
        //         no: 0
        //     }
        // } 

        try {
            setDoc(doc(db, 'watchParties', watchPartyID), watchPartyObj);
            setDoc(doc(db, 'watchParties', watchPartyID, 'titleOptions', titleID), newTitleObject);
            console.log("Watch Party Document written with ID: ", watchPartyID);
            console.log("Title Doc created with ID: ", titleID);

            // Should redirect to newly created watch party page.

            mainContentContainer.innerHTML = '';

            mainContentContainer.insertAdjacentHTML('afterbegin', `
                <p>Creating Your Watch Party Page.  You will be redirected in 3 seconds.</p>
            `)

            setTimeout(() => { 

                const docRef = doc(db, 'watchParties', watchPartyID); 
                onSnapshot(docRef, (snapshot) => {
                    if (snapshot.exists()) {    
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