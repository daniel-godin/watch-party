// Imports:


// Firebase Imports:
import { auth, db } from "./firebase";
import { setDoc, doc, updateDoc } from "firebase/firestore";
import { 
    signInWithEmailAndPassword, 
    EmailAuthProvider,
    linkWithCredential,
    updateProfile,
    updateEmail,
    sendEmailVerification,

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
                        // Sends Verification Email
                        sendEmailVerification(auth.currentUser)
                            .then(() => {
                                console.log('Email Verification Sent');
                                // Email verification sent!
                                // ...
                            });

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
                        }, 5000)

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

export async function createProfilePageUI(mainContentContainer: HTMLElement, user) {

    if (user.isAnonymous === true || user === false) {
        mainContentContainer.innerHTML = '';
        mainContentContainer.insertAdjacentHTML('afterbegin', `
            <p>Please <a href='./auth.html'>Sign Up or Log In</a>.</p>
        `)
        return;
    }

    const emailVerified:boolean = user.emailVerified;
    let emailVerificationDisplay:string = "false";
    let hideVerifyEmailButton:string = '';
    if (emailVerified === true) { 
        emailVerificationDisplay = 'true';
        hideVerifyEmailButton = 'hidden';
    }

    const displayName:string = user.displayName;
    const email:string = user.email;

    mainContentContainer.innerHTML = '';
    mainContentContainer.insertAdjacentHTML('afterbegin', `
        <div id='profilePageContainer'>

            <form method='POST' id='formUpdateProfile' class='profile-forms'>

                <h2>Update Your Profile:</h2>

                <label>Display Name:
                    <input type='text' id='inputDisplayName' placeholder='${displayName}' minlength='2' maxlength='64'>
                </label>
                <label>Email:
                    <input type='email' id='inputEmail' placeholder='${email}'>
                </label>

                <div id='emailVerifyContainer'>
                    <p>Email Verification Status:  ${emailVerificationDisplay}</p>
                    <button id='btnSendVerificationEmail' class='${hideVerifyEmailButton}'>Resend Verify Email</button>
                </div>

                <button type='submit'>Update Profile</button>

            </form>

            <form id='formUpdatePassword' class='profile-forms'>

                <h2>Update Your Password:</h2>

                <label>Current Password:
                    <input type='password' id='inputCurrentPassword' required>
                </label>
                <label>New Password:
                    <input type='password' id='inputNewPassword1' required>
                </label>
                <label>Confirm New Password:
                    <input type='password' id='inputNewPassword2' required>
                </label>

                <button type='submit'>Update Password</button>

            </form>

        </div>
    `)

    const formUpdateProfile = document.getElementById('formUpdateProfile') as HTMLFormElement;
    formUpdateProfile.addEventListener('submit', (e) => {
        e.preventDefault();

        console.log('Update Profile Form Clicked/Submitted');

        const inputDisplayName = document.getElementById('inputDisplayName') as HTMLInputElement;
        const inputEmail = document.getElementById('inputEmail') as HTMLInputElement;

        const displayName = inputDisplayName.value;
        const email = inputEmail.value;

        updateProfile(auth.currentUser, {
            displayName: displayName, 
          }).then( async () => {
            console.log('profile updated');
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                displayName: displayName,
            })
            // Profile updated!
            // ...
          }).catch((error) => {
            console.error('Profile Update Failed. Error: ', error);
            // An error occurred
            // ...
          });

        updateEmail(auth.currentUser, email).then( async () => {
            console.log('email updated');
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                email: email,
            })
            // Email updated!
            // ...
          }).catch((error) => {
            console.error("Email Update Error: ", error);
            // An error occurred
            // ...
          });





    })

    const btnSendVerificationEmail = document.getElementById('btnSendVerificationEmail') as HTMLButtonElement;
    btnSendVerificationEmail.addEventListener('click', (e) => {
        e.preventDefault();
        sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log('Verification Email Sent');
                // Email verification sent!
                // ...
            });
    })
}