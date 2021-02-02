$(() => {
    firebase.auth().onAuthStateChanged(function (user) {

        if (user.emailVerified!==false) {
            // console.log("A User is logged");
            window.location.replace("homepage.html");
          
        }
    })
})