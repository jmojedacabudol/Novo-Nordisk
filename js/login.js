function forgotPassword() {
    swal("Enter Your Email Address", {
            content: "input",
        })
        .then((value) => {
            if (value === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Cannot be empty',
                    text: 'Something went wrong!',

                })
            } else {
                firebase.auth().sendPasswordResetEmail(value).then(function () {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Please check your email',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }).catch(function (error) {
                    Swal.fire({
                        icon: 'error',
                        title: error.code,
                        text: error.message,
                    })
                });
            }
        });
}


$(() => {

    $("#loginUserForm").submit(function (event) {
        event.preventDefault();
        // login - error
        var formData = new FormData(this);

        var email = formData.get('email');
        var password = formData.get('password');
        // for (var value of formData.keys()) {
        //     console.log(value);
        // }


        if (userInformationVerification(email, password)) {
            firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
                Swal.fire({
                    text: "Please Wait....",
                    allowOutsideClick: false,
                    showConfirmButton: false,

                    onBeforeOpen: () => {
                        Swal.showLoading();
                    },
                });
                if (user.user.emailVerified === false) {
                    Swal.close();
                    Swal.fire({
                        icon: 'info',
                        title: 'Account no Verified',
                        text: 'Please verify your account through your email.',
                        footer: "<a onclick='verificationResend()' href='javascript:void(0)'>I did not receive any Verification Email.</a>"

                    })
                } else {
                    //when success, currentUser.uid function is called to get the user 
                    //uid and use it a one of the reference in database.
                    var userID = firebase.auth().currentUser.uid;
                    var reference = firebase.database().ref().child(`Users/${userID}`);

                    reference.once('value', function (loginUser) {
                        //if exist the query will check if the user is approved or still Pending
                        if (loginUser.exists()) {
                            console.log(userID)
                            const Toast = Swal.mixin({
                                toast: true,
                                position: 'center',
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                onOpen: (toast) => {
                                    toast.addEventListener('mouseenter', Swal.stopTimer)
                                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                                }

                            })

                            Toast.fire({
                                icon: 'success',
                                title: 'Signed in successfully'
                            })
                            if (loginUser.val().typeStatus == "Pending") {
                                Swal.fire({
                                    position: 'center',
                                    icon: 'info',
                                    title: 'Please wait for the Admin Verification',
                                    showConfirmButton: false,
                                    timer: 1500
                                })
                            } else {
                                window.location.replace("homepage.html");

                            }
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Something went wrong!',

                            })
                        }
                    })
                }

            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                Swal.fire({
                    icon: 'error',
                    title: errorCode,
                    text: errorMessage,

                })

            });
        }
        return false;

    })
    //Login Function
})



function userInformationVerification(email, password) {
    if (email != "" && password != "") {
        return true;
    } else {
        $("#registration-error").html('<div class="alert alert-warning" role="alert">Fillup the Fields!</div>');
        return false;
    }
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



function showpassword() {
    var x = document.getElementById("userPassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }

}