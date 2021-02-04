function loginFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    firebase.auth().useDeviceLanguage();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
        var userId = user.uid;
        //    console.log(user);
        //     console.log(user.uid);
        // console.log(user.displayName);
        // console.log(user.email);
        var userRef = firebase.database().ref("Users").child(userId);
        userRef.once("value").then(result => {
            if (result.exists()) {
                if (user.emailVerified === false) {
                    Swal.close();
                    Swal.fire({
                        icon: 'info',
                        title: 'Account not Verified',
                        text: 'Please verify your account through your email.',
                        footer: "<a onclick='verificationResend()' href='javascript:void(0)'>I did not receive any Verification Email.</a>"

                    })
                }
            } else {
                Swal.fire({
                    icon: "info",
                    title: "User is not registered",
                    text: 'You can register your facebook by clicking "Okay" button.'
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
                            "tagged": "Facebook"
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
    })
}

function verificationResend() {
    var user = firebase.auth().currentUser;
    // console.log(user)

    user.sendEmailVerification().then(function () {
        Swal.fire({
            icon: "success",
            title: "Email Verification sent to your account",
            text: "Note:Please check your email. Check your 'Spams' if nothing appears to your email."
        })
    }).catch(function (error) {
        Swal.fire({
            icon: "error",
            title: error.code,
            text: error.message
        })
    });
}



function extraSpecializationNotValid(specialization) {
    //Name should only consists of alphabets
    var letters = /^[A-Za-z ]+$/;
    if(specialization!==""){
        if (specialization.match(letters)) {
            return true;
        } else {
            $("#registration-extraError").html('<div class="alert alert-danger" role="alert">Invalid Specialization</div>');
            return false;
        }
    }
    else{
        $("#registration-extraError").html('<div class="alert alert-danger" role="alert">Invalid Specialization</div>');
        return false;
    }
  

}


function extraMobileNumberValidation(number) {
    var regex = /^(09|\+639)\d{9}$/;
    if(number!==""){
        if (number.match(regex)) {
            return true;
        } else {
            $("#registration-extraError").html('<div class="alert alert-danger" role="alert">Invalid Mobile Number</div>');
            return false;
        }
    }
  else{
    $("#registration-extraError").html('<div class="alert alert-danger" role="alert">Invalid Mobile Number</div>');
    return false;
  }
}