(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

document.addEventListener('DOMContentLoaded', function () {
    // Get the alert element by its ID
    var alertElement = document.getElementById('myAlert');

    // Use setTimeout to close the alert after 3000 milliseconds (3 seconds)
    setTimeout(function () {
        // Check if the alert element exists (to avoid errors if it's already closed)
        if (alertElement) {
            // Close the alert by adding the 'd-none' class (Bootstrap class for hiding an element)
            alertElement.style.display = 'none';
        }
    }, 2500); // Adjust the time as needed
});


/* Booking */

// document.getElementById('bookingForm').addEventListener('submit', function (event) {
//     // let bookingStatusNo = false
//     event.preventDefault(); // Prevent form submission

//     // Get form values
//     var checkInDate = document.getElementById('checkInDate').value;
//     var checkOutDate = document.getElementById('checkOutDate').value;
//     var guests = document.getElementById('guests').value;

//     // Simulate booking process
//     setTimeout(function () {
//         // Display booking status
//         var bookingStatus = document.getElementById('bookingStatus');
//         bookingStatus.textContent = 'Your booking from ' + checkInDate + ' to ' + checkOutDate + ' for ' + guests + ' guests is available.!';
//         const div = document.getElementById('confirmBooking');

//         div.style.removeProperty('display');
//     }, 1000); // Simulating asynchronous operation
// });

document.addEventListener('DOMContentLoaded', function () {
    var checkInDateInput = document.getElementById('checkInDate');
    var checkOutDateInput = document.getElementById('checkOutDate');

    // Set min date for check-in to today
    var today = new Date();
    var todayFormatted = today.toISOString().split('T')[0];
    checkInDateInput.setAttribute('min', todayFormatted);

    // Event listener for check-in date change
    checkInDateInput.addEventListener('change', function () {
        var checkInDate = new Date(checkInDateInput.value);
        var checkOutDate = new Date(checkOutDateInput.value);

        // If check-out date is before check-in date, reset it
        if (checkOutDate < checkInDate) {
            checkOutDateInput.value = '';
        }

        // Set min date for check-out to the selected check-in date
        var checkInDateFormatted = checkInDate.toISOString().split('T')[0];
        checkOutDateInput.setAttribute('min', checkInDateFormatted);
    });

    // Event listener for check-out date change
    checkOutDateInput.addEventListener('change', function () {
        var checkInDate = new Date(checkInDateInput.value);
        var checkOutDate = new Date(checkOutDateInput.value);

        // If check-out date is before check-in date, reset it
        if (checkOutDate < checkInDate) {
            checkOutDateInput.value = '';
        }
    });
});


document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    cursor.style.top = e.clientY + 'px';
    cursor.style.left = e.clientX + 'px';

    // Create particles
    const particleContainer = document.querySelector('.particles');
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.top = e.clientY + 'px';
    particle.style.left = e.clientX + 'px';
    particleContainer.appendChild(particle);

    // Remove particles after a short delay
    setTimeout(() => {
        particle.remove();
    }, 1000);
});


'use strict';

/**
 * navbar toggle
 */

const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

const navToggleEvent = function (elem) {
    for (let i = 0; i < elem.length; i++) {
        elem[i].addEventListener("click", function () {
            navbar.classList.toggle("active");
            overlay.classList.toggle("active");
        });
    }
}

navToggleEvent(navElemArr);
navToggleEvent(navLinks);



/**
 * header sticky & go to top
 */

const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {

    if (window.scrollY >= 200) {
        header.classList.add("active");
        goTopBtn.classList.add("active");
    } else {
        header.classList.remove("active");
        goTopBtn.classList.remove("active");
    }

});