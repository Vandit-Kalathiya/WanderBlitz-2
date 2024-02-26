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
