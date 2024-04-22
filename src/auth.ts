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

    if (user.isAnonymous == true) { console.log('ANONYMOUS USER'); };
    if (user.isAnonymous == false) { console.log('Signed Up User.  NOT ANONYMOUS'); };

    // There are two different things I want to display:  Sign In, and Sign Up.

    pageContainer?.insertAdjacentHTML('afterbegin', `
        <div id='authContainer'>
            <div id='authChooseSignInSignUpContainer'>
                <button type='button' id='btnLogIn'>Sign In</button>
                <button type='button' id='btnSignUp'>Sign Up</button>
            </div>
            <div id='authFormContainer'>
            </div>
        </div>
    `)

    const authContainer = document.getElementById('authContainer');
    const authChooseSignInSignUpContainer = document.getElementById('authChooseSignInSignUpContainer');
    const btnLogIn = document.getElementById('btnLogIn');
    const btnSignUp = document.getElementById('btnSignUp');
    const authFormContainer = document.getElementById('authFormContainer');


    btnSignUp?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('sign up button clicked.  Switch to sign up form');
        createAuthForm('Sign Up');
    });

    btnLogIn?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('log in button clicked.  Switch to sign up form');
        createAuthForm('Log In');
    })

    function createAuthForm(type) {
        authFormContainer.innerHTML = '';
        if (type == 'Sign Up') {
            authFormContainer?.insertAdjacentHTML('afterbegin', `
                <form id='formAuth' class='form-auth'>
                    <label>Email:
                        <input type='email' id='inputEmail' class='auth-input' required>
                    </label>
                    <label>Password:
                        <input type='password' id='inputPassword' class='auth-input' min='8' max='64' required>
                    </label>
                    <button type='submit' id='btnAuthSignup' class='btn-auth'>Sign Up</button>
                </form>
            `)
            return;
        }

        authFormContainer?.insertAdjacentHTML('afterbegin', `
            <form id='formAuthLogIn' class='form-auth'>
                <label>Email:
                    <input type='email' id='inputEmail' class='auth-input' required>
                </label>
                <label>Password:
                    <input type='password' id='inputPassword' class='auth-input required'>
                </label>
                <button type='submit' id='btnAuthLogin' class='btn-auth'>Log In</buton>
            </form>
        `)
    }

    const formAuth = document.getElementById('formAuth');
    const formAuthLogIn = document.getElementById('formAuthLogIn');
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
                    displayName: 'Test User Display Name',
                    email: userCredential.user.email,
                    userID: userCredential.user.uid
                }
                setDoc(doc(db, 'users', userCredential.user.uid), userObject);

                setTimeout(() => {
                    history.back();
                }, 3000)

                // Create a document in Firebase:  users > userID.
                
                
            })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('Error Creating User with Email/PW.', 'Error Code: ', errorCode, 'Error Message: ', errorMessage);
            // ..
            });
    })

    formAuthLogIn?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email: string = inputEmail.value;
        const password: string = inputPassword.value;
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('log in user function triggered');
          // Signed in 
          const user = userCredential.user;
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    })

}

console.log('TESTING: end of auth page triggered');