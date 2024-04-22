// Imports:
// import { pageContainer } from "./ui";

// Firebase Imports:
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Global Variables:
const pageContainer = document.getElementById('pageContainer');



// Code/Functionality:

console.log('auth.ts triggered, top of page');

export async function createAuthPageUI(user) {
    console.log("TESTING:  createAuthPageUI function triggered. TOP.");


    // There are two different things I want to display:  Sign In, and Sign Up.

    // if (NOT SIGNED IN AKA NO FULL ACCOUNT)

    // if (anon account active or no account at all...)





    pageContainer?.insertAdjacentHTML('afterbegin', `
        <form id='formAuth'>
            <label>Email:
                <input type='email' id='inputEmail' class='auth-input' required>
            </label>
            <label>Password:
                <input type='password' id='inputPassword' class='auth-input' min='8' max='64' required>
            </label>
            <button type='submit' id='btnAuth'>Sign Up</button>
        </form>
    `)

    const formAuth = document.getElementById('formAuth');
    const inputEmail = document.getElementById('inputEmail');
    const inputPassword = document.getElementById('inputPassword');
    const btnAuth = document.getElementById('btnAuth');


    formAuth?.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('TESTING:  formAuth submit triggered');

        const email: string = inputEmail.value;
        const password: string  = inputPassword.value;

        // I should probably have some kind of REGEX check on email and passwords, in case user changed code then submitted.

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('userCredential: ', userCredential);
                // Signed up 
                const userObject = {
                    displayName: '',
                    email: userCredential.user.email,
                    userID: userCredential.user.uid
                }
                // Create a document in Firebase:  users > userID.
                setDoc(doc(db, 'users', userCredential.user.uid), userObject);
            })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Error Creating User with Email/PW.', 'Error Code: ', errorCode, 'Error Message: ', errorMessage);
            // ..
            });
    })



}

// function createSignInUI(user) {

// }

// function createSignUpUI(user) {

// }

const userDocObject = {
    displayName: '',
    email: '',
    // Anything Else?
}

console.log('TESTING: end of auth page triggered');