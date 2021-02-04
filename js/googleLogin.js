function loginGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            var credential = result.credential;

            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            var user = result.user;
            var userId = user.uid;
            // console.log(user);
            // console.log(user.uid);
            // console.log(user.displayName);
            // console.log(user.email);

            var userRef = firebase.database().ref("Users").child(userId);
            userRef.once("value").then(result => {
                if (result.exists()) {
             window.location.href="homepage.html";
                } else {
                    // console.log("Not Registered")
                    Swal.fire({
                        icon: "info",
                        title: "User is not registered",
                        text: 'You can register your Google Account by clicking "Okay" button.'
                    }).then(result => {
                        if (result.value) {
                            $('#loginModal').modal('hide');
                            // $('#extraModal').modal('show',{backdrop: 'static', keyboard: false});
                            $('#extraModal').modal({
                                backdrop: 'static',
                                keyboard: false
                              });
    
                          $("#fbExtra").click(function(){
                              var specialization=document.getElementById("extraSpecialization").value;
                              var contact=document.getElementById("extraContact").value;
                              
                            if (extraSpecializationNotValid(specialization)) {
                                if (extraMobileNumberValidation(contact)) {
                                  Swal.fire({
                                text: "Please Wait....",
                                allowOutsideClick: false,
                                showConfirmButton: false,
    
                                onBeforeOpen: () => {
                                    Swal.showLoading();
                                },
                            });
                            var userData = {
                                "useid": userId,
                                "displayName": user.displayName,
                                "email": user.email,
                                "contact":contact,
                                "specialization":specialization,
                                "tagged": "Google"
                            }
    
                            var userRef = firebase.database().ref(`Users/${userId}`);
                            userRef.set(userData, function (error) {
                                if (error) {
                                    Swal.close();
                                    var errorCode = error.code;
                                    var errorMessage = error.message;
                                    Swal.fire({
                                        icon: 'error',
                                        title: errorCode,
                                        text: errorMessage
                                    })
                                } else {
                                    var preferenceData = {
                                        "preference0": "diabetes",
                                        "preference1": "obesity",
                                        "preference2": "biopharm",
                                        "preference3": "patient",
                                        "preference4": "promotional",
                                        "preference5": "sms",
                                        "preference6": "meeting",
                                        "preference7": "newsletters",
                                        "preference8": "oneweek",
                                    };
    
                                    var preferencesRef = firebase.database().ref(`Preferences/${userId}`);
                                    preferencesRef.set(preferenceData, function (error) {
                                        if (error) {
                                            Swal.close();
                                            var errorCode = error.code;
                                            var errorMessage = error.message;
                                            Swal.fire({
                                                icon: 'error',
                                                title: errorCode,
                                                text: errorMessage
                                            })
                                        } else {
                                            Swal.close();
                                            Swal.fire({
                                                position: 'center',
                                                icon: 'success',
                                                title: 'Successfully Registered!',
                                                text: 'Please wait check your Email for Verification.',
                                                showConfirmButton: true,
                                            }).then(function (result) {
                                                if (result.value) {
                                                    window.location.href = "index.html"
                                                }
                                            });
                                        }
                                    })
    
                                }
                            })
                                }
                            }    return false;
                        
                          })
    
                          
                        }
                    })
                }
            })

        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });

}