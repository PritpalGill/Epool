$(document).ready(function () {


    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(user.uid);
            writeProfileName();
        } else {
            // No user is signed in.
        }
    });
    user = firebase.auth().currentUser;

    document.getElementById('signOut').addEventListener('click', signOut, false);
    document.getElementById('singlebutton').addEventListener('click', createCityPool);


});

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

function signOut() {
    var promise = firebase.auth().signOut(); // Firebase Authenticated User Signout 
    promise.then(function () {
        window.location.href = '../index.html';
    });

}



function searchCity() {


    ref.child('rides').equalTo('Surrey').on("value", function (snapshot) {
        console.log(snapshot.val());
        snapshot.forEach(function (data) {
            console.log(data.key);
        });
    });
}