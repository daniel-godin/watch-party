import "./style.css";
import { app, db, auth } from "./firebase.ts";
import { randomIdGenerator } from "./utils.ts";

// Firebase Imports:
import { doc, setDoc } from "firebase/firestore";
// import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

const currentURL = window.location.href;
console.log(currentURL);

const pageContainer = document.getElementById('pageContainer');

const newWatchPartyForm = document.getElementById('newWatchPartyForm');
const inputMovie0 = document.getElementById('inputMovie0');
const inputMovie1 = document.getElementById('inputMovie1');
const inputMovie2 = document.getElementById('inputMovie2');
const btnCreateWatchParty = document.getElementById('btnCreateWatchParty');

interface movie {
	title: string;
	// id: string;
	// links: {
	// 	trailer: string;
	// 	tmdb: string;
	// };
}

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


newWatchPartyForm.addEventListener('submit', async (e) => {
	e.preventDefault();
  	// console.log('newWatchPartyForm submitted');
	const id = randomIdGenerator();

	const obj = {
		watchPartyID: id,
		dateCreated: "date string",
		dateOfWatchParty: 'date string',
		guests: 'array of guest names in strings',
		movies: {
			movie0: inputMovie0.value,
			movie1: inputMovie1.value,
			movie2: inputMovie2.value,
		},
		
	}

	// console.log(obj);
	try {
		setDoc(doc(db, 'watchParties', id), obj);
		console.log("Document written with ID: ", id);
	} catch (e) {
		console.error("Error adding documenet: ", e);
	}
  	
})
