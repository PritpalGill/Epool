var destinationCity, departureCity, routeName, userIDr, dateS, timeS, radioValue;

var autocomplete, autocomplete2;

$(document).ready(function () {
    /** 
     * Enables the Departure and Destination Text inputs boxes to autocomplete the user's geographical location,. 
     */
    initAutocomplete();


    $("#autocomplete2").focus(geolocate());
    $("#autocomplete").focus(geolocate());


/**
 * Checks if the user has signed in, does not give access if user is not signed in.
 */
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //console.log(user.uid);
            userIDr = user.uid;
            writeProfileName();
        } else {
            // No user is signed in.
        }
    });
    user = firebase.auth().currentUser;

/**
 * Click Event used to sign out user.
 */
    document.getElementById('signOut').addEventListener('click', signOut, false);
    //document.getElementById('singlebutton').addEventListener('click', createCityPool);
    $("#singlebutton").click(function (event) {
        event.preventDefault();
        createCityPool();
    });

});

/** 
 * Enables the Departure and Destination Text inputs boxes to autocomplete the user's geographical location,. 
 */
function geolocate() {

    var geolocation = {
        lat: 49.25,
        lng: -122.8
    };
    var circle = new google.maps.Circle({
        center: geolocation,
        radius: 80000
    });
    autocomplete.setBounds(circle.getBounds());
    autocomplete2.setBounds(circle.getBounds());

}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    var place2 = autocomplete2.getPlace();
    //console.log("Geocode output: ", place);
    //console.log("Geocode output: ", place2);
    console.log(place.address_components["locality"]);
    departureCity = extractFromObject(place.address_components, "locality");
    destinationCity = extractFromObject(place2.address_components, "locality");
    departureAddress = "" + extractFromObject(place.address_components, "street_number") + " " +
        extractFromObject(place.address_components, "route") + ", " +
        extractFromObject(place.address_components, "locality");

    destinationAddress = "" + extractFromObject(place2.address_components, "street_number") + " " +
        extractFromObject(place2.address_components, "route") + ", " +
        extractFromObject(place2.address_components, "locality");

    /*var componentForm = {
        locality: 'long_name',

    };
    console.log(place.geometry.location.lat());
    console.log(place.address_components)
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            console.log(val);
        }
    } */
}
/** 
 * Enables the Departure and Destination Text inputs boxes to autocomplete the user's geographical location. 
 */
function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('autocomplete')), {
            types: ['geocode']
        });
    autocomplete.setFields(['address_components', 'geometry']);


    //autocomplete.addListener('place_changed', fillInAddress);
    autocomplete2 = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementById('autocomplete2')), {
            types: ['geocode']
        });
    autocomplete2.setFields(['address_components', 'geometry']);


    //autocomplete2.addListener('place_changed', fillInAddress);
}
/** 
 * Extracts the Adress typed into the location text-box. 
 */
function extractFromAddress(components, type) {
    return components.filter((component) => component.types.indexOf(type) === 0).map((item) => item.long_name).pop() || null;
}
/** 
 * Extracts the Adress typed into the location text-box. 
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
 * Saves the route input information into the database, in order to be retrieved later. 
 */
function createCityPool() {
    // Add a new message entry to the Firebase database.
    fillInAddress();
    timeS = $("#timeinput").val();
    dateS = $("#dateinput").val();
    routeName = $("#textinput").val();
    radioValue = $("input[name='radios']:checked").val();

    var postData = {
        "departureCity": departureCity,
        "departureAddress": departureAddress,
        "destinationCity": destinationCity,
        "destinationAddress": destinationAddress,
        "time": timeS,
        "date": dateS,
        "user name": user.uid,
        "Pool Name": routeName,
        "Type": radioValue
    };


    // console.log(departureCity);
    var newPostKey = firebase.database().ref().child('posts').push();

    var updates = {};
    //console.log(routeName);
    //console.log(newPostKey.key);

    updates['/rides/' + departureCity + "/" + newPostKey.key] = postData;
    firebase.database().ref('/users/' + user.uid + "/userRides/" + newPostKey.key).set({
        "departureCity": departureCity,
        "departureAddress": departureAddress,
        "destinationCity": destinationCity,
        "destinationAddress": destinationAddress,
        "time": timeS,
        "date": dateS,
        "Pool Name": routeName,
        "Type": radioValue
    });

    return firebase.database().ref().update(updates).then(() => {
        window.location.href = 'rides.html';

    });
    /*return firebase.database().ref('/rides/' + departureCity).push({
        "departureCity": departureCity,
        "departureAddress": departureAddress,
        "destinationCity": destinationCity,
        "destinationAddress": destinationAddress,
        "time": timeS,
        "date": dateS,
        "user name": userIDr,
        "Pool Name": routeName
    }).catch(function (error) {
        console.error('Error writing new message to Firebase Database', error);
    });*/
}

/** 
 * Enables the user to sign out, and go back to the sign in page. 
 */
function signOut() {
    var promise = firebase.auth().signOut(); // Firebase Authenticated User Signout 
    promise.then(function () {
        window.location.href = '../index.html';
    });

}