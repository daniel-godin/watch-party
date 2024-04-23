// Imports:
import { pageContainer } from "./ui";

// Firebase Imports:
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { 
    signInWithEmailAndPassword, 
    EmailAuthProvider,
    linkWithCredential,
    updateProfile,
} from "firebase/auth";

// Global Variables:


// Code/Functionality:

export async function createAuthPageUI(mainContentContainer: HTMLElement, user) {
    // There are two different things I want to display:  Sign In, and Sign Up.

    mainContentContainer.innerHTML = '';
    mainContentContainer.insertAdjacentHTML('afterbegin', `
        <div id='authContainer'>
            <div id='authChooseSignInSignUpContainer'>
                <button type='button' id='btnLogIn'>Sign In</button>
                <button type='button' id='btnSignUp'>Sign Up</button>
            </div>
            <div id='authFormContainer'>
            </div>
        </div>
    `)

    const btnSignUp = document.getElementById('btnSignUp') as HTMLButtonElement;
    btnSignUp.addEventListener('click', (e) => {
        e.preventDefault();
        createAuthForm('Sign Up');
    });

    const btnLogIn = document.getElementById('btnLogIn') as HTMLButtonElement;
    btnLogIn.addEventListener('click', (e) => {
        e.preventDefault();
        createAuthForm('Log In');
    })

    function createAuthForm(form: string) {
        const authFormContainer = document.getElementById('authFormContainer') as HTMLFormElement;
        authFormContainer.innerHTML = '';
        if (form === 'Sign Up') {
            authFormContainer.insertAdjacentHTML('afterbegin', `
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
            const formAuth = document.getElementById('formAuth') as HTMLFormElement;
            formAuth.addEventListener('submit', (e) => {
                e.preventDefault();

                const inputEmail = document.getElementById('inputEmail') as HTMLInputElement;
                const inputPassword = document.getElementById('inputPassword') as HTMLInputElement;
        
                const email: string = inputEmail.value;
                const password: string  = inputPassword.value;
                const displayName: string = 'Anonymous User';
        
                // I should probably have some kind of REGEX check on email and passwords, in case user changed code then submitted.
        
                const credential = EmailAuthProvider.credential(email, password);
                linkWithCredential(auth.currentUser, credential)
                    .then((usercred) => {
                        const user = usercred.user;
                        console.log("Anonymous Acount Successfully Upgraded.  User: ", user);

                            // updateProfile called here to added a displayName property to Firebase Auth User Object.
                            updateProfile(usercred.user, {
                                displayName: displayName,
                            }).then(() => {
                                // Profile updated!
                                console.log('Updated Profile.  Display Name Added:', usercred.user);
                            }).catch((error) => {
                                // An Error Occured 
                                console.error('updated profile error: ', error);
                            });

                        const userDocObj = {
                            displayName: displayName,
                            email: email,
                            userID: user.uid,
                        }

                        // Create/Update a user account in my firestore database.

                        setDoc(doc(db, 'users', user.uid), userDocObj);

                        mainContentContainer.innerHTML = '';
                        mainContentContainer.insertAdjacentHTML('afterbegin', `
                            <p>Successfully Signed Up.  You are being redirected in 3 seconds.</p>
                        `)

                        setTimeout(() => {
                            history.back(); // FOR NOW... This will redirect the user to the previous part of the site they were on.
                            // Later... Redirect to profile.html.
                        }, 3000)

                    }).catch((error) => {
                        console.log("Error Upgrading Anonymous Account.  Error: ", error);
                    });
            })
            return; // Returning here so it doesn't automatically load up the "log in" page.
        } else {
        authFormContainer.insertAdjacentHTML('afterbegin', `
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
        const formAuthLogIn = document.getElementById('formAuthLogIn') as HTMLFormElement;
        const inputEmail = document.getElementById('inputEmail') as HTMLInputElement;
        const inputPassword = document.getElementById('inputPassword') as HTMLInputElement;

        formAuthLogIn.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email: string = inputEmail.value;
            const password: string = inputPassword.value;
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in 
              const user = userCredential.user;
              // ...
              mainContentContainer.innerHTML = '';
              mainContentContainer.insertAdjacentHTML('afterbegin', `
                  <p>Successfully Logged In.  You are being redirected in 3 seconds.</p>
              `)

              setTimeout(() => {
                  history.back(); // This redirects user to their previous page.  Likely watch.html, random-tv.html, etc.  Or index.html.
              }, 3000)

            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
            });
        })
        }
    }
    createAuthForm('Log In');

}