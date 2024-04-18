import "./style.css";
import './fav-96.png';
// import "./demo.html";
import './ui.ts';
import './data.ts';

// Firebase Imports:
import { app, db, auth } from "./firebase.ts";
import { doc, setDoc } from "firebase/firestore";
import { demoPartyObject } from "./data.ts";
// import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

function createDemoPartyDocument() {
	try {
		setDoc(doc(db, 'watchParties', '00-demoWatchParty'), demoPartyObject);
		console.log('demo watch party doc created');
	} catch (e) {
		console.error("Error adding document: ", e);
	}
}

createDemoPartyDocument();

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



