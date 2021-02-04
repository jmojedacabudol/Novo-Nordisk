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
                        window.location.href = "homepage.html";
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