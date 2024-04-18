import "./style.css";
import './fav-96.png';
// import "./demo.html";
import './ui.ts';
import './data.ts';

// Firebase Imports:
import { app, db, auth } from "./firebase.ts";
import { doc, setDoc, collection } from "firebase/firestore";
import { randomIdGenerator } from "./utils.ts";
// import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

export const demoPartyObject = {
    watchPartyID: "00-demoWatchParty",
    watchPartyName: "Demo Watch Party",
    dateCreated: "",
    dateOfWatchParty: "",
    titleOptions: [
        {
            title: "1917",
            links: {
                tmdb: "https://www.themoviedb.org/movie/530915-1917",
            },
            votes: {
                yes: 0,
                maybe: 0,
                no: 0
            }
        },
        {
            title: "Ex Machina",
            links: {
                tmdb: "https://www.themoviedb.org/movie/264660-ex-machina",
            },
            votes: {
                yes: 0,
                maybe: 0,
                no: 0
            },
        },
        {
            title: "Lord of the Rings: Return of the King",
            links: {
                tmdb: "https://www.themoviedb.org/movie/122-the-lord-of-the-rings-the-return-of-the-king",
            },
            votes: {
                yes: 0,
                maybe: 0,
                no: 0
            },
        },
    ],
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


function createDemoPartyDocument() {
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

// signInAnonymously(auth)
// 	.then(() => {
// 		console.log("anon signed in.")
// 		// Signed in..
// 	})
// 	.catch((error) => {
// 		const errorCode = error.code;
// 		const errorMessage = error.message;
// 		// ...
// 		console.log("Anon Sign-In Error:", errorCode, errorMessage);
// });

// onAuthStateChanged(auth, (user) => {
// 	if (user) {
// 		// User is signed in, see docs for a list of available properties
// 		// https://firebase.google.com/docs/reference/js/auth.user
// 		const uid = user.uid;
// 		// ...
// 	} else {
// 		// User is signed out
// 		// ...
// 	}
// });



