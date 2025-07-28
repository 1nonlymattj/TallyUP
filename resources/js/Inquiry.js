const FUZZY_DESIGN = document.getElementById("fuzzyWebDesign");
const MAIN_BUG_REPORT = document.getElementById("mainBugReport");
const INQUIRY_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby496xFOH9y6aVv928OshrDCe6HmdCUQV2-clxyYns7d7AaI4PosynTM6SG8DDH34ttUg/exec";
const BUG_REPORT = document.getElementById("bugReport");
const BUG_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzQJDjxIg697x9B3Vocnuc-RwERNJH2PtRfDA-XHM8IDiDZBmztqrwd2QQNl5GXosPYrw/exec";
 
FUZZY_DESIGN.addEventListener("click", function () {
    InquiryDialog();
});

function InquiryDialog() {
    let message = 'Thank you for Reaching out, Please fill out the form and we will contact you as soon as we can';
    $('<div id = dialog align =center > ' + '<h3>' + message + '</h3>' + '<br>' +
        '<form id = inquiryForm class= form-group>' + ' <input type= name name= InquiryName class= form-control id= inquiryName placeholder= Name required>' + '<br><br>'
        + '<input type= email name= InquiryEmail class= form-control id= inquiryEmail placeholder= Email Address required>' + '<br><br> ' +
        '<textarea name= InquiryMessage class= form-control-textfield rows = 5 col = 10 maxlength= 400 id= inquiryMessage placeholder= "Message" resize:none required></textarea>' + '<br><br><br><br><br>' +
        ' </form>' + ' </div>'
    ).dialog({
        title: 'Web Design Inquiry',
        autoOpen: true,
        modal: true,
        width: $(window).width() > 400 ? 400 : 'auto',
        resizable: false,
        draggable: false,
        buttons: {
            'Ok': {
                text: 'Send Inquiry',
                'class': 'dialogButton',
                'id': 'confim',
                click: function () {
                    if (document.getElementById("inquiryName").value != "" && document.getElementById("inquiryEmail").value != "" && document.getElementById("inquiryMessage").value != "") {
                        let form = document.getElementById('inquiryForm');
                        let data = new FormData(form);
                        fetch(INQUIRY_SCRIPT_URL, {
                            method: 'POST',
                            body: data,
                        }).then(() => {
                            $(this).dialog('destroy');
                            contactThankYouDialog();
                        })
                    } else {
                        InquiryInfoDialog();
                    }
                }
            },
            'Close': {
                text: 'Close',
                'class': 'dialogButton',
                'id': 'confim',
                click: function () {
                    $(this).dialog('destroy');
                }
            }
        }
    });
}

function InquiryInfoDialog() {
    let message = 'Please fill out Information before submitting inquiry';
    $('<div id = dialog align =center > ' + '<h3>' + '<span class = caution> &#9888; </span>' + message + '</h3>' + '<br>' + ' </div>'
    ).dialog({
        title: 'Error Information Missing',
        autoOpen: true,
        modal: true,
        width: $(window).width() > 400 ? 400 : 'auto',
        resizable: false,
        draggable: false,
        buttons: {
            'Close': {
                text: 'Close',
                'class': 'dialogButton',
                'id': 'confim',
                click: function () {
                    $(this).dialog('destroy');
                }
            }
        }
    });
}

function contactThankYouDialog() {
    let message = 'Thank you for your inquiry, We will be in contact with you soon.';
    $('<div id = dialog align =center > ' + '<h3>' + message + '</h3>' + '<br>' + ' </div>'
    ).dialog({
        title: 'Thank you for you inquiry',
        autoOpen: true,
        modal: true,
        width: $(window).width() > 400 ? 400 : 'auto',
        resizable: false,
        draggable: false,
        buttons: {
            'Close': {
                text: 'Close',
                'class': 'dialogButton',
                'id': 'confim',
                click: function () {
                    $(this).dialog('destroy');
                }
            }
        }
    });
}


// MAIN_BUG_REPORT.addEventListener("click", function () {
//     createBugDialog();
// });

// function createBugDialog() {
//     let message = 'Please report where issue was found';
//     $('<div id = dialog align =center > ' + '<h3>' + message + '</h3>' + '<br>' +
//         '<form id = issueForm class= form-group>' + ' <input type= name name= Name class= form-control id= name placeholder= Name required>' + '<br><br>'
//         + '<input type= email name= Email class= form-control id= emailAddress placeholder= Email Address required>' + '<br><br> ' +
//         '<textarea name= Issue class= form-control-textfield rows = 5 col = 10 maxlength= 400 id= reportBugField placeholder= "Where was issue found" resize:none required></textarea>' + '<br><br>' +
//         ' </form>' + ' </div>'
//     ).dialog({
//         title: 'Report An Issue',
//         autoOpen: true,
//         modal: true,
//         width: $(window).width() > 400 ? 400 : 'auto',
//         resizable: false,
//         draggable: false,
//         buttons: {
//             'Ok': {
//                 text: 'Report Issue',
//                 'class': 'dialogButton',
//                 'id': 'confim',
//                 click: function () {
//                     if (document.getElementById("name").value != "" && document.getElementById("emailAddress").value != "" && document.getElementById("reportBugField").value != "") {
//                         let form = document.getElementById('issueForm');
//                         let data = new FormData(form);
//                         // sendBug();
//                         fetch(BUG_SCRIPT_URL, {
//                             method: 'POST',
//                             body: data,
//                         }).then(() => {
//                             $(this).dialog('destroy');
//                             thankYouDialog();
//                         })
//                     } else {
//                         createBugInfoDialog();
//                     }
//                 }
//             },
//             'Close': {
//                 text: 'Close',
//                 'class': 'dialogButton',
//                 'id': 'confim',
//                 click: function () {
//                     $(this).dialog('destroy');
//                 }
//             }
//         }
//     });
// }

// function createBugInfoDialog() {
//     let message = 'Please fill out Information before submitting issue report';
//     $('<div id = dialog align =center > ' + '<h3>' + '<span class = caution> &#9888; </span>' + message + '</h3>' + '<br>' + ' </div>'
//     ).dialog({
//         title: 'Error Information Missing',
//         autoOpen: true,
//         modal: true,
//         width: $(window).width() > 400 ? 400 : 'auto',
//         resizable: false,
//         draggable: false,
//         buttons: {
//             'Close': {
//                 text: 'Close',
//                 'class': 'dialogButton',
//                 'id': 'confim',
//                 click: function () {
//                     $(this).dialog('destroy');
//                 }
//             }
//         }
//     });
// }

// function thankYouDialog() {
//     let message = 'Thank you for your feedback, We appreciate your support.';
//     $('<div id = dialog align =center > ' + '<h3>' + message + '</h3>' + '<br>' + ' </div>'
//     ).dialog({
//         title: 'Thank you for you submission',
//         autoOpen: true,
//         modal: true,
//         width: $(window).width() > 400 ? 400 : 'auto',
//         resizable: false,
//         draggable: false,
//         buttons: {
//             'Close': {
//                 text: 'Close',
//                 'class': 'dialogButton',
//                 'id': 'confim',
//                 click: function () {
//                     $(this).dialog('destroy');
//                 }
//             }
//         }
//     });
// }