// Imports:
import { pageContainer } from "./ui";

// Firebase Imports:
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    EmailAuthProvider,
    linkWithCredential,
    Unsubscribe,
} from "firebase/auth";

// Global Variables:


// Code/Functionality:

export async function createAuthPageUI(user) {
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
        createAuthForm('Sign Up');
    });

    btnLogIn?.addEventListener('click', (e) => {
        e.preventDefault();
        createAuthForm('Log In');
    })

    function createAuthForm(form) {
        authFormContainer.innerHTML = '';
        if (form === 'Sign Up') {
            authFormContainer?.insertAdjacentHTML('afterbegin', `
                <form method='POST' id='formAuth' class='form-auth'>
                    <label>Email:
                        <input type='email' id='inputEmail' class='auth-input' required>
                    </label>
                    <label>Password:
                        <input type='password' id='inputPassword' class='auth-input' min='8' max='64' required>
                    </label>
                    <button type='submit' id='btnAuthSignup'>Sign Up</button>
                </form>
            `)
            const formAuth = document.getElementById('formAuth');
            formAuth?.addEventListener('submit', (e) => {
                e.preventDefault();

                const inputEmail = document.getElementById('inputEmail');
                const inputPassword = document.getElementById('inputPassword');
        
                const email: string = inputEmail.value;
                const password: string  = inputPassword.value;
        
                // I should probably have some kind of REGEX check on email and passwords, in case user changed code then submitted.
        
                const credential = EmailAuthProvider.credential(email, password);
                linkWithCredential(auth.currentUser, credential)
                    .then((usercred) => {
                        const user = usercred.user;
                        console.log("Anonymous Acount Successfully Upgraded.  User: ", user);
                    }).catch((error) => {
                        console.log("Error Upgrading Anonymous Account.  Error: ", error);
                    });
            })
            return; // Returning here so it doesn't automatically load up the "log in" page.
        }

        authFormContainer?.insertAdjacentHTML('afterbegin', `
            <form id='formAuthLogIn' class='form-auth'>
                <label>Email:
                    <input type='email' id='inputEmail' class='auth-input' required>
                </label>
                <label>Password:
                    <input type='password' id='inputPassword' class='auth-input required'>
                </label>
                <button type='submit' id='btnAuthLogin'>Log In</buton>
            </form>
        `)
        const formAuthLogIn = document.getElementById('formAuthLogIn');
        const inputEmail = document.getElementById('inputEmail');
        const inputPassword = document.getElementById('inputPassword');

        formAuthLogIn?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email: string = inputEmail.value;
            const password: string = inputPassword.value;
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
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
    createAuthForm('Log In');

}