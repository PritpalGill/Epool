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



    document.getElementById('signOut').addEventListener('click', signOut, false);

});

/**
 * Displays all the routes currently created by the user.
 */
function displaySchedule() {
    firebase.database().ref("users/" + user.uid + "/userRides/").once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var temp = childSnapshot.val();
            var key = childSnapshot.key;
            var nameofRide = temp["Pool Name"];
            var cityofRide = temp["departureCity"];
            var cardinfo = '<div class="card mt-3">  <div class="card-header">Schedule </div> <div class="card-body"> ' +
                '<h2 class="card-title"> ' + temp["Pool Name"] + '</h2><p class="card-text">From  ' + temp["departureAddress"] +
                '  to  ' + temp["destinationAddress"] +
                ' at ' + temp["time"] + ' on ' + temp["date"] + ' as ' + temp["Type"] + '</p><a href="#" class="btn btn-info" data-toggle="collapse" data-target="#' + key + '"aria-expanded="false" aria-controls="collapseExample"> Directions' +
                '</a><h3 class="float-right">' + '</h3><div class="collapse" id="' + key + '"><div class="google-maps"> <iframe width="900" height="500" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyDSCpyFxZFE_ncGP7Pyrzzdi6tGelJCziU&origin=' + temp["departureAddress"] + '&destination=' + temp["destinationAddress"] + '" allowfullscreen> </iframe></div>' +
                '</div></div></div>';


            $("#content").append(cardinfo);
            /*firebase.database().ref("rides/" + cityofRide).once("value").then(function (snapshot2) {
                snapshot2.forEach(function (childSnapshot2) {
                    var tempchild = childSnapshot2.val();
                    var key2 = childSnapshot2.key;
                    var tempid;
                    var tempphone;
                    if (key2 != key && tempchild["Type"] != temp["Type"] && tempchild["user name"] != user.uid && temp["destinationCity"] == tempchild["destinationCity"]) {
                        firebase.database().ref("users/" + tempchild["user name"]).once("value").then(function (snap) {
                            tempid = snap.val()["username"];
                            tempphone = snap.val()["phonenumber"];
                        }).then(function () {
                            var cardinfo = '<div class="card mt-3"> <div class="card-body"> <img src="../images/user.png" class="img-fluid float-right align-text-middle rounded-circle alt=" ...">' +
                                '<h2 class="card-title">From ' + tempchild["departureCity"] + ' to ' + tempchild["destinationCity"] + ' </h2><p class="card-text">From  ' + tempchild["departureAddress"] +
                                '  to  ' + tempchild["destinationAddress"] +
                                ' at ' + tempchild["time"] + ' on ' + tempchild["date"] + '</p><a href="#" class="btn btn-info" data-toggle="collapse" data-target="#' + key2 + '"aria-expanded="false" aria-controls="collapseExample"> Contact' +
                                'Info</a><h3 class="float-right">' + tempid + '</h3><div class="collapse" id="' + key2 + '"><div class="card card-body">Phone Number: ' +
                                tempphone + '</div></div></div></div>';

                            $('#' + key).append(cardinfo);
                        });


                    }
                });
            }); */

        });

    });

}

/** 
 * Displays the User-name and photo of the user on the page. 
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