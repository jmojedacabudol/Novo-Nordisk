  var preferenceForm;
  var userId;
  var userEmail;
  $(() => {


      firebase.auth().onAuthStateChanged(function (user) {

          if (!user) {
              // console.log("A User is logged");
              window.location.replace("index.html");
          } else {
              userId = user.uid;
              userEmail = user.email;
          }
      })

      $("#preferencesForm").submit(function (event) {
          event.preventDefault();
          preferenceForm = new FormData(this);
          var preferencesRef = firebase.database().ref('Preferences').child(userId);
          var counter = 0;
          var preferences = new Map();
          // preferenceForm.append('userId', userId);

          for (var value of preferenceForm.values()) {
              if (value !== "") {
                  preferences[`preference${counter}`] = value;
                  counter++;
              }
          }
          // console.log(preferences);
          Swal.fire({
              text: "Please Wait....",
              allowOutsideClick: false,
              showConfirmButton: false,

              onBeforeOpen: () => {
                  Swal.showLoading();
              },
          });

          //check if preference table have user`s preferences
          preferencesRef.once("value").then(result => {
              if (result.exists()) {
                  //user have old preferences and needs to be updated
                  Swal.close();
                  Swal.fire({
                      icon: "info",
                      title: "Update your old Preference/s?",
                      text: "Your old Preferences will be replaced.",
                      confirmButtonText: 'Yes,Update it'
                  }).then(result => {
                      if (result.value) {
                          Swal.fire({
                              text: "Please Wait....",
                              allowOutsideClick: false,
                              showConfirmButton: false,

                              onBeforeOpen: () => {
                                  Swal.showLoading();
                              },
                          });

                          insertpreferencesWithOld(preferencesRef, preferences).then(() => {
                              Swal.close();
                              Swal.fire({
                                  position: 'center',
                                  icon: 'success',
                                  title: 'Successfully Updated Your Preferences!',
                                  text: '',
                                  showConfirmButton: true,
                              }).then(function (result) {
                                  if (result.value) {
                                      window.location.href = "homepage.html"
                                  }
                              })
                          }).catch(error => {
                              Swal.close();
                              var errorCode = error.code;
                              var errorMessage = error.message;
                              Swal.fire({
                                  icon: 'error',
                                  title: errorCode,
                                  text: errorMessage
                              })
                          })

                      }
                  })


              } else {
                  //user dont have an old preference
                  insertPreferences(preferencesRef, preferences).then(() => {
                      Swal.close();
                      Swal.fire({
                          position: 'center',
                          icon: 'success',
                          title: 'Successfully Updated Your Preferences!',
                          text: '',
                          showConfirmButton: true,
                      }).then(function (result) {
                          if (result.value) {
                              window.location.href = "homepage.html"
                          }
                      })
                  }).catch(error => {
                      Swal.close();
                      var errorCode = error.code;
                      var errorMessage = error.message;
                      Swal.fire({
                          icon: 'error',
                          title: errorCode,
                          text: errorMessage
                      })
                  });
              }
          })
      })

  })





  function discardPreferences() {
      preferenceForm = $("#preferencesForm").serializeArray();
      var formPreference = new Map();
      var preferences = new Map();
      var counter = 0;
      var preferencesRef = firebase.database().ref('Preferences').child(userId);;

      //   $(preferenceForm).each(function (i, field) {
      //       if (field.value !== "") {
      //           preferences[`preference${counter}`] = field.value;
      //           counter++;
      //       }
      //   });
      //   console.log(preferences)
      //   console.log(preferences.length)
      $(preferenceForm).each(function (i, field) {
          if (field.value !== "") {
              formPreference.set(`preference${counter}`, field.value);
              preferences[`preference${counter}`] = field.value;
              counter++;
          }
      });
      //   console.log(preferences)
      //   console.log(preferences.size)
      if (formPreference.size !== 0) {
          Swal.fire({
              icon: "info",
              title: "There are unsaved changes in your Preferences, would you like to save them?",
              confirmButtonText: 'Yes',
              showCancelButton: true,
              cancelButtonText: 'Discard',
              cancelButtonColor: 'red'
          }).then(result => {
              if (result.value !== true) {
                  //discard is false
                  location.reload();
              } else {
                  Swal.fire({
                      text: "Checking Your Past Preference...",
                      allowOutsideClick: false,
                      showConfirmButton: false,

                      onBeforeOpen: () => {
                          Swal.showLoading();
                      },
                  });

                  //check if preference table have user`s preferences
                  preferencesRef.once("value").then(preferencesResult => {
                      if (preferencesResult.exists()) {
                          //user have old preferences and needs to be updated
                          Swal.close();
                          Swal.fire({
                              icon: "info",
                              title: "Update your old Preference/s?",
                              text: "Your old Preferences will be replaced.",
                              confirmButtonText: 'Yes,Update it'
                          }).then(result => {
                              if (result.value) {
                                  var oldPreferenceForm = new Map();
                                  var i = 0;
                                  preferencesResult.forEach(function (_child) {
                                      oldPreferenceForm.set(`preference${i}`, _child.val());
                                      i++;
                                  });
                                  console.log(oldPreferenceForm)
                                  sendPreferenceWithOldRecordEmail(userEmail, formPreference, oldPreferenceForm).then(() => {
                                      insertpreferencesWithOld(preferencesRef, preferences).then(() => {
                                          Swal.close();
                                          Swal.fire({
                                              position: 'center',
                                              icon: 'success',
                                              title: 'Successfully Updated Your Preferences!',
                                              text: '',
                                              showConfirmButton: true,
                                          }).then(function (result) {
                                              if (result.value) {
                                                  window.location.href = "homepage.html"
                                              }
                                          })
                                      }).catch(error => {
                                          Swal.close();
                                          var errorCode = error.code;
                                          var errorMessage = error.message;
                                          Swal.fire({
                                              icon: 'error',
                                              title: errorCode,
                                              text: errorMessage
                                          })
                                      })
                                  }).catch(error => {
                                      console.log(error)
                                  })
                              }
                          })


                      } else {
                          //user dont have an old preference
                          Swal.fire({
                              text: "Please Wait....",
                              allowOutsideClick: false,
                              showConfirmButton: false,

                              onBeforeOpen: () => {
                                  Swal.showLoading();
                              },
                          });
                          sendNewPreferenceEmail(userEmail, formPreference).then(() => {
                              insertPreferences(preferencesRef, preferences).then(() => {
                                  Swal.close();
                                  Swal.fire({
                                      position: 'center',
                                      icon: 'success',
                                      title: 'Successfully Updated Your Preferences!',
                                      text: '',
                                      showConfirmButton: true,
                                  }).then(function (result) {
                                      if (result.value) {
                                          window.location.href = "homepage.html"
                                      }
                                  })
                              }).catch(error => {
                                  Swal.close();
                                  var errorCode = error.code;
                                  var errorMessage = error.message;
                                  Swal.fire({
                                      icon: 'error',
                                      title: errorCode,
                                      text: errorMessage
                                  })
                              });
                          }).catch(error => {
                              console.log(error)
                          })
                      }
                  })
              }
          })

      } else {
          $("#editPreferences").modal('hide');
      }

  }


  function insertpreferencesWithOld(preferencesRef, preferences) {
      return new Promise((resolve, reject) => {
          preferencesRef.remove()
              .then(function () {
                  // console.log("Remove succeeded.")
                  preferencesRef.set(preferences, function (error) {
                      if (error) {
                          reject(error)
                      } else {
                          resolve("Success");
                      }
                  });
              })
              .catch(function (error) {
                  reject(error.message);
                  //   console.log("Remove failed: " + error.message)
              });
      })
  }

  function insertPreferences(preferencesRef, preferences) {
      return new Promise((resolve, reject) => {
          preferencesRef.set(preferences, function (error) {
              if (error) {
                  reject(error)
              } else {
                  resolve("Success");
              }
          });
      })
  }



  function logOut() {
      Swal.fire({
          icon: "info",
          title: "You are about to logout.",
          text: "Thank you for Visiting Us.",
          confirmButtonText: "Logout"
      }).then(result => {
          if (result.value) {
              firebase.auth().signOut().then(() => {
                  window.location.replace("index.html");
              }).catch((error) => {
                  Swal.fire({
                      icon: "error",
                      title: "Opps Something happened.",
                      text: error,
                      confirmButtonText: "Reload"
                  }).then(result => {
                      if (result.value) {
                          Location.reload();
                      }
                  })
              });
          }
      })
  }



  function sendPreferenceWithOldRecordEmail(userEmail, preferencesFormNew, preferencesFormOld) {
      return new Promise((resolve, reject) => {
          Swal.fire({
              text: "Please Wait....",
              allowOutsideClick: false,
              showConfirmButton: false,

              onBeforeOpen: () => {
                  Swal.showLoading();
              },
          });
          //   console.log(preferencesFormold.entries)

          var oldPreferenceTable = '';
          var newPreferenceTable = '';

          for (var i = 0; i < preferencesFormOld.size; i++) {
              oldPreferenceTable += `<tr>${preferencesFormOld.get('preference'+i)}</tr>`;
          }
          for (var i = 0; i < preferencesFormNew.size; i++) {
              newPreferenceTable += `<tr>${preferencesFormNew.get('preference'+i)}</tr>`;
          }
          //   console.log(newPreferenceTable)

          Email.send({
              Host: "smtp.elasticemail.com",
              Username: "novonordiskvirtualtour@gmail.com",
              Password: "0747CE9E00E382CB2BCB91149DB524B04A6B",
              port: 2525,
              To: "novonordiskvirtualtour@gmail.com",
              From: "novonordiskvirtualtour@gmail.com",
              Subject: "System Notification/s", //            
              Body: `A user with email  "${userEmail}" has made some changes with the preferences. See the Details below.<br><br>` +
                  `<table>` +
                  `<tr>` +
                  `<th>Old Preference/s</th>` +
                  `</tr>` +
                  oldPreferenceTable +
                  `</table>` +

                  `<table>` +
                  `<tr>` +
                  `<th>New Preference/s</th>` +
                  `</tr>` +
                  newPreferenceTable +
                  `</table>`

          }).then(function (message) {
              if (message === "OK") {
                  Swal.close();
                  resolve();
              } else {
                  Swal.close();
                  reject(message);
              }
          });

          //   console.log(table);

          //   switch (preferencesFormOld.size) {
          //       case 1:

          //           break;
          //   }


      })
  }


  function sendNewPreferenceEmail(userEmail, preferenceFormNew) {
      return new Promise((resolve, reject) => {
          var newPreferenceTable = '';
          for (var i = 0; i < preferenceFormNew.size; i++) {
              newPreferenceTable += `<tr>${preferenceFormNew.get('preference'+i)}</tr>`;
          }

          Email.send({
              Host: "smtp.elasticemail.com",
              Username: "novonordiskvirtualtour@gmail.com",
              Password: "0747CE9E00E382CB2BCB91149DB524B04A6B",
              port: 2525,
              To: "novonordiskvirtualtour@gmail.com",
              From: "novonordiskvirtualtour@gmail.com",
              Subject: "System Notification/s", //     
              Body: `A user with email  "${userEmail}" has update his/her preferences. See the Details below.<br><br>` +
                  `<table>` +
                  `<tr>` +
                  `<th>New Preference/s</th>` +
                  `</tr>` +
                  newPreferenceTable +
                  `</table>`
          }).then(function (message) {
              if (message === "OK") {

                  resolve();
              } else {

                  reject(message);
              }
          });

      })
  }