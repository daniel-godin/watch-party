import "./style.css";
import './fav-96.png';
// import "./demo.html";
import './ui.ts';

// Firebase Imports:
import { app, db, auth } from "./firebase.ts";
import { doc, setDoc } from "firebase/firestore";
// import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

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



