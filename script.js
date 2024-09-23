let allUserInfo = [];
const regForm = document.querySelector(".reg-form");
const passWord = document.getElementById('password');
const eyePassword = document.querySelector('svg');
//this variable is for login password showing
let passWord2 = document.getElementById('password2');
let eyePassword2= document.getElementById('svg2')
const regButton = regForm.querySelector('button');
const logInForm = document.querySelector(".login-form");
const logInInput = logInForm.querySelectorAll('input');
const logInButton = logInForm.querySelector('button');


// Retrieve data from localStorage
if (localStorage.getItem("allUserInfo") !== null) {
    allUserInfo = JSON.parse(localStorage.getItem("allUserInfo"));
}

// Function to check if email or mobile number already exists
function checkEmail(data) {
    return allUserInfo.some(user => user.email === data.email || user.mobileNo === data.mobileNo);
}

// Add event listener for registration form submission
regForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Gather data from form inputs
    const allSignInput = regForm.querySelectorAll('input');
    const data = {
        fullName: allSignInput[0].value.trim(),
        hotelName: allSignInput[1].value.trim(),
        totalRoom: allSignInput[2].value.trim(),
        mobileNo: allSignInput[3].value.trim(),
        email: allSignInput[4].value.trim(),
        password: allSignInput[5].value.trim()
    };

    // Check if any field is empty
    if (Object.values(data).some(value => value === "")) {
        swal("Please Fill the Details", "Provide Your Information", 'warning');
        return;
    }

    // Check for duplicate email or mobile number
    if (checkEmail(data)) {
        swal("Error!", "Mobile number or email already in use.", "error");
        return; // Exit the function to prevent further processing
    }

    regButton.innerHTML = "Processing...";

    // Simulate processing time
    setTimeout(() => {
        regButton.innerHTML = "Registered";

        // Add the new data to the array
        allUserInfo.push(data);
        console.log(allUserInfo);

        // Store updated data in localStorage
        localStorage.setItem("allUserInfo", JSON.stringify(allUserInfo));

        // Show a success message using SweetAlert
        swal("Good job!", "Registration Complete!", "success");
        regForm.reset('')
    }, 2000);
});

// Function to show and hide password
eyePassword.addEventListener('click', function () {
    if(passWord.type==="password"){
        passWord.type= "text"
    }else{
        passWord.type = "password"
    }
});

// to show and hide the password
eyePassword2.addEventListener('click',function(){
    if(passWord2.type==="password"){
        passWord2.type="text"
    }else{
        passWord2.type="password"
    }
})

// Add event listener for login form submission
logInForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = logInInput[0].value.trim();
    const password = logInInput[1].value.trim();

    if (email === "") {
        swal("Warning", "Email is empty!", "warning");
        return;
    }

    if (password === "") {
        swal("Warning", "Password is empty!", "warning");
        return;
    }

    // Check if the email exists in the user info array
    const user = allUserInfo.find((data) => data.email === email);

    if (user !== undefined) {
        if (user.password === password) {
            // Handle successful login
            logInButton.innerHTML = "Please Wait...";
            setTimeout(() => {
                logInButton.innerHTML = "Log In";
                swal("Success!", "Login successful!", "success");
                window.location = "profile/profile.html";

                // Store relevant user data in sessionStorage
                sessionStorage.setItem("__devData__", JSON.stringify(user));
            }, 1000);
        } else {
            swal("Warning!", "Incorrect password.", "warning");
        }
    } else {
        swal("Warning!", "Email is not registered or incorrect.", "warning");
    }
});
