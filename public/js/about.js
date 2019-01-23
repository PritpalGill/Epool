$(document).ready(function () {
/**
 * Checks if the user has signed in, does not give access if user is not signed in.
 */
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //console.log(user.uid);
            writeProfileName();
            displaySchedule();
        } else {
            // No user is signed in.
        }
    });


/**
 * Click Event used to sign out user.
 */
    document.getElementById('signOut').addEventListener('click', signOut, false);

});

/**
 * Displays the user-name of the user and the profile picture they imported.
 */
function writeProfileName() {
    var database = firebase.database();
    user = firebase.auth().currentUser;

    database.ref("users/" + user.uid).once("value").then(function (snapshot) {
        var name = snapshot.child("username").val();
        //console.log(name);
        var urlphoto = snapshot.child("photourl").val();
        if (urlphoto) {
            $("#profilephotodash").attr('src', urlphoto);
        }

        $("#profileNameText").html(name);
    });

}

/**
 * Enables the user to sign out, and go to the login page.
 */
function signOut() {
    var promise = firebase.auth().signOut(); // Firebase Authenticated User Signout
    promise.then(function () {
        window.location.href = '../index.html';
    });
}