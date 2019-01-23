$(document).ready(function () {

    /**
     * Checks if the user has signed in, does not give access if user is not signed in.
     */
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //console.log(user.uid);
            userIDr = user.uid;
            writeProfileName();
            displayRouteNames();

        } else {
            // No user is signed in.
        }
    });
    user = firebase.auth().currentUser;

    /**
     * Click Event used to sign out user.
     */
    document.getElementById('signOut').addEventListener('click', signOut, false);


});

/**
 * Displays all the routes that poteantailly match up with the users route based on location.
 */
var pill_template =
    '<a class="nav-item nav-link" data-toggle="tab" role="tab" aria-controls="nav-contact" aria-selected="false">loading3</a>';

function displayRouteNames() {
    firebase.database().ref("users/" + user.uid + "/userRides/").once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {

            var temp = childSnapshot.val();
            var key = childSnapshot.key;
            var nameofRide = temp["Pool Name"];
            var cityofRide = temp["departureCity"];
            var tabPane = '<div id="' + key + '" class="tab-pane fade" role="tabpanel" style="max-height:1000px;overflow-y: scroll;"></div>';
            var navtabadd = '<li class="border nav-item mr-2"><a style="display:inline-block;" class="nav-link" id="nav' + key + '" data-toggle="tab" href="#' + key + '"role="tab" aria-controls="nav-home" aria-selected="true" >' + nameofRide + '</a>  <button class="btn" href="#" id="delete' + key + '" value="' + key + '"><i class="fas fa-trash-alt"></i></button></li>';
            if ($("#nav-tab").children().length == 0) {
                navtabadd = '<li class="border nav-item active mr-2"><a style="display:inline-block;" class="nav-link active" id="nav' + key + '" data-toggle="tab" href="#' + key + '"role="tab" aria-controls="nav-home" aria-selected="true" >' + nameofRide + '</a>  <button class="btn deletebtn" href="#" id="delete' + key + '" value="' + key + '"><i class="fas fa-trash-alt"></i></button></li>';
                tabPane = '<div id="' + key + '" class="tab-pane fade active show" role="tabpanel" style="max-height:1000px;overflow-y: scroll;"></div>';
            }

            $("#nav-tab").append(navtabadd);
            $("#nav-tabContent").append(tabPane);
            $('#' + key).append('<div id="noridefound' + key + '"><h3>No Rides found</h3></div>');
            //console.log($('"#noridefound' + key + '"').length);

            firebase.database().ref("rides/" + cityofRide).once("value").then(function (snapshot2) {
                snapshot2.forEach(function (childSnapshot2) {
                    var tempchild = childSnapshot2.val();
                    var key2 = childSnapshot2.key;
                    var tempid;
                    var tempphone;
                    if (key2 != key && tempchild["Type"] != temp["Type"] && tempchild["user name"] != user.uid && temp["destinationCity"] == tempchild["destinationCity"]) {
                        $('#noridefound' + key).remove();

                        //if ($('"#noridefound' + key + '"')) {
                        //  $('"#noridefound' + key + '"').remove();
                        //}
                        firebase.database().ref("users/" + tempchild["user name"]).once("value").then(function (snap) {
                            tempid = snap.val()["username"];
                            tempphone = snap.val()["phonenumber"];
                            tempphoto = snap.val()["photourl"];

                            if (!tempphoto) {
                                tempphoto = "../images/user.png";
                            }
                        }).then(function () {
                            if (tempchild["Type"] == "Driver" || tempchild["Type"] == "driver") {
                                var cardinfo = '<div class="card mt-3"> <div class="card-body"> <img width="84px" src="' + tempphoto + '" class="img-fluid float-right align-text-middle rounded-circle alt=" ...">' +
                                    '<h2 class="card-title">From ' + tempchild["departureCity"] + ' to ' + tempchild["destinationCity"] + ' </h2><p class="card-text">From  ' + tempchild["departureAddress"] +
                                    '  to  ' + tempchild["destinationAddress"] +
                                    ' at ' + tempchild["time"] + ' on ' + tempchild["date"] + '</p><a href="#" class="btn btn-info" data-toggle="collapse" data-target="#' + key2 + '"aria-expanded="false" aria-controls="collapseExample">' +
                                    'Info</a><h3 class="float-right">' + tempid + ' - ' + tempchild["Type"] + '</h3><div class="collapse" id="' + key2 + '"><div class="card card-body">Phone Number: ' +
                                    tempphone + '</div><div class="google-maps"><iframe width="900" height="500" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyDSCpyFxZFE_ncGP7Pyrzzdi6tGelJCziU&origin=' + tempchild["departureAddress"] + '&destination=' + tempchild["destinationAddress"] + '&waypoints=' + temp["departureAddress"] + '|' + temp["destinationAddress"] + '" allowfullscreen> </iframe></div></div></div></div>';

                                $('#' + key).append(cardinfo);
                            } else if (tempchild["Type"] == "Passenger" || tempchild["Type"] == "passenger") {
                                var cardinfo = '<div class="card mt-3"> <div class="card-body"> <img width="84px" src="' + tempphoto + '" class="img-fluid float-right align-text-middle rounded-circle alt=" ...">' +
                                    '<h2 class="card-title">From ' + tempchild["departureCity"] + ' to ' + tempchild["destinationCity"] + ' </h2><p class="card-text">From  ' + tempchild["departureAddress"] +
                                    '  to  ' + tempchild["destinationAddress"] +
                                    ' at ' + tempchild["time"] + ' on ' + tempchild["date"] + '</p><a href="#" class="btn btn-info" data-toggle="collapse" data-target="#' + key2 + '"aria-expanded="false" aria-controls="collapseExample">' +
                                    'Info</a><h3 class="float-right">' + tempid + ' - ' + tempchild["Type"] + '</h3><div class="collapse" id="' + key2 + '"><div class="card card-body">Phone Number: ' +
                                    tempphone + '</div><div class="google-maps"><iframe width="900" height="500" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/directions?key=AIzaSyDSCpyFxZFE_ncGP7Pyrzzdi6tGelJCziU&origin=' + temp["departureAddress"] + '&destination=' + temp["destinationAddress"] + '&waypoints=' + tempchild["departureAddress"] + '|' + tempchild["destinationAddress"] + '" allowfullscreen> </iframe></div></div></div></div>';

                                $('#' + key).append(cardinfo);
                            }

                        });


                    }
                });
            });


            /**
             * Adds a mouse click event to delete a route from the database.
             */
            $('#delete' + key).click(function (e) {
                console.log($(this).val());
                var rideIdnametemp = $(this).val();
                console.log(cityofRide);
                console.log(user.uid);
                var rideRef = firebase.database().ref('rides/' + cityofRide + '/' + rideIdnametemp);
                var rideuserRef = firebase.database().ref('users/' + user.uid + '/' + "userRides/" + rideIdnametemp);
                rideRef.remove().then(function () {
                    rideuserRef.remove().then(function () {
                        location.reload();
                    });
                });
                /*adaRef.remove()
                    .then(function () {
                        console.log("Remove succeeded.")
                    })
                    .catch(function (error) {
                        console.log("Remove failed: " + error.message)
                    }); */

            });
        });

    }).then(function () {
        displayEmptyRouteName();
    });

}

/**
 * Lets the user know if they have no current rides.
 */
function displayEmptyRouteName() {

    if ($("#nav-tab").children().length == 0) {
        var noRidesTab = '<h3>No Rides Found Please <a style="color:blue;" href="./createapool.html">Create a ride</a> </h3>';
        $("#nav-tab").append(noRidesTab);
    }
    //var test123 = $("#nav-tabContent").children();

    //console.log(test123[0]);
}

/** 
 * Extracts the Adress of the users lacation. 
 */
function extractFromAddress(components, type) {
    return components.filter((component) => component.types.indexOf(type) === 0).map((item) => item.long_name).pop() || null;
}

/** 
 * Extracts the Adress of the users lacation. 
 */
function extractFromObject(object, key) {
    return object.filter((component) => component.types.indexOf(key) ===
        0).map((item) => item.long_name).pop() || null;
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