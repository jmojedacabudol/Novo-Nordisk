$(() => {
    firebase.auth().onAuthStateChanged(function (user) {

        if (user) {
            // console.log("A User is logged");
            window.location.replace("homepage.html");
        }
    })
})