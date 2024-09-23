// Variable Declarations
let userName = "";
let allBookingData = [];
let allInhouseData = [];
let allArchiveData = [];
let allCashData = [];
let allArchiveCashData = [];
let logOutButton = document.querySelector('.button2');
let bookingForm = document.querySelector('.booking-form');
let inHouseForm = document.querySelector('.inhouse-form');
let allBookingInput = bookingForm.querySelectorAll('input');
let allInhouseInput = inHouseForm.querySelectorAll('input');
let inHouseTextArea = inHouseForm.querySelector('textarea');
let bookingTextArea = bookingForm.querySelector('textarea');
let registrationClose = document.querySelectorAll('.registration-close');
let bookingList = document.querySelector('.bookinglist');
let inhouseList = document.querySelector('.inhouselist');
let archiveList = document.querySelector('.archivelist')
let navLinks = document.querySelectorAll('.nav-link')
let searchInput = document.querySelector('.search-input')
let cashierButton = document.querySelector('.cashier-button');
let cashierTab = document.querySelector('#cashier')
let allTabButton = document.querySelectorAll('.tab-pane');
let cashierForm = document.querySelector('.cashier-form')
let allCashierInput = cashierForm.querySelectorAll('input');
let cashButton = document.querySelector('.cash-button');
let cashierTbody = document.querySelector('.cashier-list');
let totalCash = document.querySelector('.money');
let closeCashierButton = document.querySelector('.close-cashier')
let printButton = document.querySelectorAll('.print');
let totalButton = document.querySelectorAll('.total-button')
let showBRoom = document.querySelector('.show-booking-room')
let showIRoom = document.querySelector('.show-inhouse-room')

// code for print button
for (let button of printButton) {
    button.addEventListener('click', () => {
        window.print()
    })
}

// Check if user is logged in
if (sessionStorage.getItem("__devData__") === null) {
    window.location = "../index.html";
} else {
    let navBar = document.querySelector('.navbar-brand');
    let userDisplay = document.querySelector('.userdisplay');
    userName = JSON.parse(sessionStorage.getItem("__devData__"));
    navBar.innerHTML = userName.hotelName;
    userDisplay.innerHTML = userName.fullName;
}

const user = userName.email.split("@")[0];

// Logout functionality
logOutButton.addEventListener('click', () => {
    logOutButton.textContent = "Please Wait..";
    setTimeout(() => {
        sessionStorage.clear(); // Clear all session storage
        window.location = "../index.html";
    }, 1000);
});


// Function to handle form submissions and save data
const registrationFunction = (textarea = null, input, array, key) => {
    const data = {
        notice: textarea && textarea.value,
        inHouse: false,
        registeredDate: new Date().toLocaleDateString(), // Format date
    };

    input.forEach(el => {
        const key = el.name;
        const value = el.value;
        data[key] = value; // Only add if key is defined
    });

    array.unshift(data);
    localStorage.setItem(key, JSON.stringify(array));
};

// Handle booking form submission
bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    registrationFunction(
        bookingTextArea, allBookingInput, allBookingData, `${user}__allBookingData`
    );
    // Show registration complete alert
    setTimeout(() => {
        swal('Registration complete.', "Good Work!", 'success');
        // Clear form fields
        bookingForm.reset();
        registrationClose[0].click();
        showData(bookingList, allBookingData, user + "__allBookingData"); // Update the display
        showBookingRooms();
    }, 1000);
});

// Fetching the data that is stored in local storage
const fetchData = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error parsing data from local storage:", e);
        return [];
    }
};

allBookingData = fetchData(`${user}__allBookingData`);
allInhouseData = fetchData(`${user}__allInhouseData`);
allArchiveData = fetchData(`${user}allArchiveData`);
allCashData = fetchData(`${user}__allCashierData`);
allArchiveCashData = fetchData(`${user}__allArchiveCashData`)


// Function to render data to the table
const showData = (element, array, key) => {
    element.innerHTML = '';
    array.forEach((item, index) => {
        const date = new Date();
        const formattedDate = date.toLocaleDateString();
        element.innerHTML += `
        <tr>
            <td class="no-print">${index + 1}</td>
            <td>${item.location}</td>
            <td>${item.roomno}</td>
            <td>${item.fullname}</td>
            <td>${item.checkindate}</td>
            <td>${item.checkoutdate}</td>
            <td>${item.totalpeople}</td>
            <td>${item.mobileno}</td>
            <td>${item.Price}</td>
            <td>${item.notice}</td>
            <td class="no-print">${formattedDate}</td>
            <td class="no-print">
                <button class="edit-btn btn btn-primary">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="checkin-btn btn btn-primary">
                    <i class="fa fa-check"></i>
                </button>
                <button class="btn btn-primary trash-btn">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });

    // Add event listeners after rendering
    deleteFunction(element, array, key);
    editFunction(element, array, key);
    checkinFunction(element, array, key);
};
// code for deleting the booking
const deleteFunction = (element, array, key) => {
    // Select all the delete buttons
    let DeleteButton = element.querySelectorAll(".trash-btn");

    // Add event listeners to each delete button
    DeleteButton.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('tr'); // Find the closest row
            const index = Array.from(element.querySelectorAll('tr')).indexOf(row); // Calculate index

            // Confirm deletion
            if (confirm('Are you sure you want to delete this booking?')) {
                // Remove item from allBookingData
                array.splice(index, 1);
                localStorage.setItem(key, JSON.stringify(array));

                // Update the display
                showData(element, array, key);
            }
        });
    });
};

// code for editing the booking data
let editFunction = (element, array, key) => {
    // select all the edit buttons
    let editButton = element.querySelectorAll('.edit-btn');
    let registerButton = document.querySelector('.register-button');
    let row = document.querySelector('.rowx');
    let updateButton = row.querySelector('#updatebutton');
    let registerButton2 = row.querySelector('#registerbutton');
    let registrationHeading = document.querySelector('#registration-heading');


    // code for the edit button to edit the booking and update the data
    editButton.forEach((btn, index) => {
        btn.onclick = () => {
            registerButton.click();
            updateButton.style.display = "block";
            registerButton2.style.display = "none";
            registrationHeading.innerText = "Updation Form";
            let obj = allBookingData[index];
            allBookingInput.forEach(input => {
                input.value = obj[input.name] || '';
            });
            updateButton.addEventListener('click', () => {
                let formData = {
                    notice: bookingTextArea.value,
                    registeredAt: new Date().toLocaleDateString(),
                };
                allBookingInput.forEach(el => {
                    formData[el.name] = el.value;
                });
                allBookingData[index] = formData;
                localStorage.setItem(`${user}__updatedData`, JSON.stringify(allBookingData));
                registrationClose[0].click();
                showData(bookingList, allBookingData);
                updateButton.style.display = "none";
                registerButton2.style.display = "block";
                registrationHeading.innerText = "Registration Form";
                bookingForm.reset();
            });
        };
    });
}

//code to checkin the guest
let checkinFunction = (element, array, key) => {
    // select all the checkin buttons
    let checkinButton = element.querySelectorAll('.checkin-btn');

    // code for the checkin button to push the data in inhouse from booking form 
    checkinButton.forEach((button, index) => {

        button.addEventListener('click', (e) => {
            let tmp = key.split("_")[2];
            let data = array[index]
            array.splice(index, 1);
            localStorage.setItem(key, JSON.stringify(array));
            if (tmp == "allBookingData") {
                if (confirm("Do you want to confirm this Booking")) {
                    allInhouseData.unshift(data)
                    localStorage.setItem(user + "__allInhouseData", JSON.stringify(allInhouseData))
                    showData(element, array, key);
                    showBookingRooms();
                }
            }
            else {
                if (confirm("Do you want to Checkout this Booking")) {
                    allArchiveData.unshift(data)
                    localStorage.setItem(user + "allArchiveData", JSON.stringify(allArchiveData))
                    showData(element, array, key)
                }
            }
        })
    })
}

// Handle in-house form submission
inHouseForm.addEventListener('submit', function (e) {
    e.preventDefault();
    registrationFunction(
        inHouseTextArea, allInhouseInput, allInhouseData, `${user}__allInhouseData`
    );
    // Show registration complete for in-house form
    setTimeout(() => {
        swal('Registration Complete.', "Thanks For Booking", 'success');
        // Clear form fields
        inHouseForm.reset();
        registrationClose[1].click();
        showData(inhouseList, allInhouseData, user + "__allInhouseData"); // Update the display
        showInhouseRooms();
    }, 1000);
});

// this part is to refresh the data
for (let button of navLinks) {
    button.onclick = () => {
        // Initial data rendering
        showData(bookingList, allBookingData, user + "__allBookingData");
        showData(inhouseList, allInhouseData, user + "__allInhouseData");
        showData(archiveList, allArchiveData, user + "__allArchiveData");
    }
}
// this code is written for search bar to filter the data of the customer
const searchFunction = () => {
    let value = searchInput.value.toLowerCase();
    let tableElement = document.querySelector('.tab-content .search-pane.active');
    let tr = tableElement.querySelectorAll('tbody tr');
    for (let el of tr) {
        let location = el.querySelectorAll('td')[1].innerText;
        let roomno = el.querySelectorAll('td')[2].innerText;
        let fullname = el.querySelectorAll('td')[3].innerText;
        let checkindate = el.querySelectorAll('td')[4].innerText;
        let mobileno = el.querySelectorAll('td')[7].innerText;
        if (location.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none')
        }
        else if (roomno.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none')
        }
        else if (fullname.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none')
        }
        else if (checkindate.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none')
        }
        else if (mobileno.toLowerCase().indexOf(value) != -1) {
            el.classList.remove('d-none')
        }
        else {
            el.classList.add('d-none')
        }
    }
}
searchInput.oninput = () => {
    searchFunction()
}
// Function to display cashier data
const showCashierFunction = () => {
    //to format the date
    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    // to display the total cash amount collected by cashier
    let totalAmount = 0;
    cashierTbody.innerHTML = ''; // Clear existing content
    allCashData.forEach((item, index) => {
        totalAmount += Number(item.Amount)
        cashierTbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.roomno}</td>
                <td>${item.Amount}</td>
                <td>${item.cashiername}</td>
                <td>${formattedDate}</td>
            </tr>
        `;
        totalCash.innerHTML = "<i class='fa fa-rupee'></i> " + totalAmount
    });
}

// Initialize cashier data display
showCashierFunction();
cashButton.onclick = () => {
    allCashierInput[2].value = sessionStorage.getItem("cashier_name");
}
cashierButton.addEventListener('click', () => {
    let bookingTab = document.getElementById('booking');
    if (sessionStorage.getItem("cashier_name") == null) {
        let name = window.prompt("Enter Your Name")
        if (name) {
            sessionStorage.setItem("cashier_name", name);
        }
        else {
            allTabButton[0].classList.add("active");
            bookingTab.classList.add("active");
            cashierButton.classList.remove("active")
            cashierTab.classList.remove('active');
        }
    }
    else {
        allCashierInput[2].value = sessionStorage.getItem("cashier_name");
    }
})

// Handle cashier code
cashierForm.addEventListener('submit', function (e) {
    e.preventDefault();
    registrationFunction(
        null, allCashierInput, allCashData, `${user}__allCashierData`
    );
    // Show registration complete alert
    setTimeout(() => {
        swal('Registration complete.', "Good Work!", 'success');
        // Clear form fields
        cashierForm.reset();
        registrationClose[2].click();
        showCashierFunction();
    }, 1000);
});
// close cashier button
closeCashierButton.addEventListener('click', () => {
    let data = {
        cashierName: sessionStorage.getItem("cashier_name"),
        total: totalCash.innerHTML,
        createdAt: new Date()
    }
    allCashData = [];
    localStorage.removeItem(`${user}__allCashierData`)
    localStorage.setItem(`${user}__allArchiveCashData`, JSON.stringify(data))
    totalCash.innerHTML = ''
    showCashierFunction();
})
// to show totalBookingData
showTotal = () => {
    totalButton[0].innerText += "Total Booking = " + allBookingData.length;
    totalButton[1].innerText += "Total Inhouse = " + allInhouseData.length;
    totalButton[2].innerText += "Total Archive = " + allArchiveData.length;

}
showTotal();

// this code is written to check whether the gusest is in the room or not
const showBookingRooms = () => {
    showBRoom.innerHTML = "";
    allBookingData.forEach((item, index) => {
        showBRoom.innerHTML += `
        <div class="card px-0 text-center col-md-2">
            <div class="card-header bg-danger text-white fw-bold">${item.roomno}</div>
            <div class="card-body bg-success text-white fw-bold">
                <p>${item.checkindate}</p>
                <p>to</p>
                <p>${item.checkoutdate}</p>
            </div>
        </div>
`
    });
}
showBookingRooms()
const showInhouseRooms = () => {
    showIRoom.innerHTML = "";
    allInhouseData.forEach((item, index) => {
        showIRoom.innerHTML += `
        <div class="card px-0 text-center col-md-2">
            <div class="card-header bg-danger text-white fw-bold">${item.roomno}</div>
            <div class="card-body">
                <img src="${item.inhouse ? '/assets/person-icon-on-white-background-260nw-1699358734.webp' : '/assets/images.jpg'}" class="w-100" alt="">
            </div>
            <div class="card-footer">
                <button class="action-btn in-btn" style="width:80px; border-radius:10px; color:white; border:none; background-color:#3366FF;">In</button>
                <button class="action-btn out-btn" style="width:80px; border-radius:10px; color:white; border:none; background-color:#3366FF">Out</button>
            </div>
        </div>
`
        
    });
    //in coding
    let allInbutton = showIRoom.querySelectorAll('.in-btn')
    allInbutton.forEach((btn,index)=>{
        btn.addEventListener('click',()=>{
            let data = allInhouseData[index];
            data.inhouse = true;
            allInhouseData[index] = data;
            localStorage.setItem(`${user}__allInhouseData`,JSON.stringify(allInhouseData))
            showInhouseRooms();
        })
    })
    let allOutbutton =showIRoom.querySelectorAll('.out-btn');
    allOutbutton.forEach((btn,index)=>{
        btn.addEventListener('click',()=>{
            let data = allInhouseData[index];
            data.inhouse = false;
            allInhouseData[index] = data;
            localStorage.setItem(`${user}__allInhouseData`,JSON.stringify(allInhouseData))
            showInhouseRooms();
        })
    })
}
showInhouseRooms()
