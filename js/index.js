$(() => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user != null) {
            user.providerData.forEach(function (profile) {
                var provider = profile.providerId;
                switch (provider) {
                    case "password":
                        if (user.emailVerified !== false) {
                            window.location.href = "homepage.html";
                        }
                        break;
                    case "google.com":
                        // console.log(user.uid)
                    var userRef=firebase.database().ref("User").child(user.uid);
                    userRef.once("value").then(result=>{
                        if(result.exists()){
                            console.log("exists")
                            window.location.href = "homepage.html";
                        }
                    })
                        break;
                    case "facebook.com":
                        if (user.emailVerified !== false) {
                            window.location.href = "homepage.html";
                        }
                        break;
                }

            });
        }
    })
})