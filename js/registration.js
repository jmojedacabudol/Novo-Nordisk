$(() => {
    $("#registration-Form").submit(function (event) {
        event.preventDefault();
        // console.log("yeah")
        var formData = new FormData(this);

        // for (var value of formData.keys()) {
        //     console.log(value);
        // }

        var emailAgreement = document.getElementById("receiveEmail");
        var temrsAgreement = document.getElementById("agreeToTerms");

        var fname = formData.get('fname');
        var lname = formData.get('lname');
        var email = formData.get('email');
        var contact = formData.get('contact');
        var password = formData.get('password');
        var password_confirmation = formData.get('password_confirmation');
        var specialization = formData.get('specialization');

        if (emailAgreement.checked && temrsAgreement.checked) {
            if (informationEmpty(fname, lname, email, password, password_confirmation, specialization)) {
                if (nameNotValid(fname, lname)) {
                    emailValidation(email).then((emailResult) => {
                        if (emailResult === "No User") {
                            if (passwordValidation(password, password_confirmation, 6, 12)) {
                                if (specializationNotValid(specialization)) {
                                    if (mobileNumberValidation(contact)) {
                                        $("#registration-error").html(``);
                                        Swal.fire({
                                            text: "Please Wait....",
                                            allowOutsideClick: false,
                                            showConfirmButton: false,

                                            onBeforeOpen: () => {
                                                Swal.showLoading();
                                            },
                                        });
                                        firebase.auth().createUserWithEmailAndPassword(email, password).then(function (userCreds) {
                                            var createdUser = userCreds.user
                                            createdUser.sendEmailVerification().then(function () {
                                                //convert Formdata to JSON
                                                var userData = {
                                                    "userId": userCreds.user.uid,
                                                    "fname": fname,
                                                    "lname": lname,
                                                    "email": email,
                                                    "password": password,
                                                    "specialization": specialization,
                                                    "contact": contact
                                                };

                                                var userRef = firebase.database().ref(`Users/${userCreds.user.uid}`);
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
                                                        Swal.close();
                                                        Swal.fire({
                                                            position: 'center',
                                                            icon: 'success',
                                                            title: 'Successfully Registered!',
                                                            text: 'Please wait for the Admin verification and Email Verification through your Email.',
                                                            showConfirmButton: true,
                                                        }).then(function (result) {
                                                            if (result.value) {
                                                                window.location.href = "index.html"
                                                            }
                                                        })
                                                    }
                                                });
                                            })

                                        })
                                    }
                                }
                            }
                        } else {
                            $("#registration-error").html(`<div class="alert alert-danger" role="alert">${emailResult}</div>`);
                        }
                    })

                }
            }
            return false;
        } else {
            $("#registration-error").html('<div class="alert alert-warning" role="alert">Please Read Our Terms and Conditions.</div>');
        }


    })

})


function informationEmpty(firstname, lastname, email, password, repeatpassword, specialization) {
    if (firstname !== "" || lastname !== "" || email !== "" || password !== "" || repeatpassword !== "" || specialization !== "") {
        return true;
    } else {
        $("#registration-error").html('<div class="alert alert-danger" role="alert">Fillup Fields</div>');
        return false;
    }

}

function nameNotValid(firstname, lastname) {

    //Name should only consists of alphabets
    var letters = /^[A-Za-z ]+$/;
    if (firstname.match(letters) && lastname.match(letters)) {
        return true;
    } else {
        $("#registration-error").html('<div class="alert alert-danger" role="alert">Invalid Firstname or Lastname</div>');
        return false;
    }
}



function specializationNotValid(specialization) {

    //Name should only consists of alphabets
    var letters = /^[A-Za-z ]+$/;
    if (specialization.match(letters)) {
        return true;
    } else {
        $("#registration-error").html('<div class="alert alert-danger" role="alert">Invalid Specialization</div>');
        return false;
    }

}



function passwordValidation(password, confirmpassword, min, max) {
    var passwordformat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/

    if (password.length >= min && password.length < max && confirmpassword.length >= min && confirmpassword.length < max) {
        if (password === confirmpassword) {
            if (password.match(passwordformat) && confirmpassword.match(passwordformat)) {
                return true;
            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Password Error',
                    text: 'Your Password must contain at least 1 capital Letter, at leat 1 small letter, at least 1 number, and at least 1 special characters'
                })
                return false;
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Password Error',
                text: 'Password and Confirm password must be the same. Try checking "show password" to confirm your passwords matches'
            })
            return false;
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Password length Error',
            text: 'Password and Confirm password must be 6 or more unique characters.'
        })
        return false;
    }

}

//EMAIL VALIDATION
function emailValidation(email) {
    return new Promise((resolve) => {
        //email format validation values
        var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var emailRef = firebase.database().ref("Users");
        var resultEmail;
        if (email.match(regex)) {
            emailRef.orderByChild('email').equalTo(email).once("value", function (snapshot) {
                if (snapshot.exists()) {
                    resolve("Email is already taken.")
                } else {
                    resolve("No User");
                }
            })
        } else {
            resolve('Email address should in "@ + any valid emails like gmail or yahoo."');
        }


    })
}

function mobileNumberValidation(number) {
    var regex = /^(09|\+639)\d{9}$/;
    if (number.match(regex)) {
        return true;
    } else {
        $("#registration-error").html('<div class="alert alert-danger" role="alert">Invalid Mobile Number</div>');
        return false;
    }
}