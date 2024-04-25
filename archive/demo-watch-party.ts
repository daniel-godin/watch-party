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
