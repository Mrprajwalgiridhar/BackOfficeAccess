// Declare global variables
let userName = "";
let firstName = "";
let lastName = "";
let accessType = "";

function decodeProperties(event) {
    const inputElement = event.target;
    const email = inputElement.value;

    const [userNameRaw] = email.split('@');
    const [firstNamePart, lastNamePart] = userNameRaw.split('.');

    firstName = firstNamePart.charAt(0).toUpperCase() + firstNamePart.slice(1);
    lastName = lastNamePart.charAt(0).toUpperCase() + lastNamePart.slice(1);
    userName = userNameRaw.toLowerCase();

}

function handleSelectChange() {
    const selectElement = document.getElementById('mySelect');
    accessType = selectElement.value;

    console.log('accessType :', accessType);
}

function generateImpex() {
    // Fetch the Impex file content from the specified path
    fetch('./BackOffice Access Template.impex')
        .then(response => response.text())
        .then(impexContent => {
            
            const replacedImpex = impexContent
                .replace(/<userName>/g, userName)
                .replace(/<firstName>/g, firstName)
                .replace(/<lastName>/g, lastName)
                .replace(/<accessType>/g, accessType);

            // Display the replaced Impex in the textarea
            document.getElementById('floatingTextarea').value = replacedImpex;
        })
        .catch(error => {
            console.error('Error fetching or processing Impex file:', error);
        });
}

var textarea = document.getElementById('floatingTextarea');
textarea.spellcheck = false;

function refreshPage() {
    // Reload the current page
    location.reload();
}

function copyText() {
    var textToCopy = document.getElementById("floatingTextarea");
    textToCopy.select();
    document.execCommand("copy");

    var button = document.getElementById("copyButton");
    button.innerHTML = "<b> Copied!</b>";

    // Update count in Firebase
    var countRef = firebase.database().ref('copyCount');
    countRef.transaction(function (currentCount) {
        return (currentCount || 0) + 1;
    }, function (error, committed, snapshot) {
        if (error) {
            console.error('Transaction failed abnormally!', error);
        } else if (!committed) {
            console.log('Transaction aborted.');
        } else {
            console.log('Transaction committed.', snapshot.val());
            document.getElementById('copyCount').textContent =
                snapshot.val() + " times copied";
        }
    });

    setTimeout(function () {
        button.innerHTML = "<b> Copy</b>";
    }, 5000);
}

