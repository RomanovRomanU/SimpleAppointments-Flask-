var form = document.getElementById('appointmentForm');
var formButton = document.getElementById('submitForm');
formButton.addEventListener('click', function(e) {
    if (validateForm(form)) {
        var formData = new FormData(form);
        var request = new XMLHttpRequest();
        request.open('POST', '/appointmentRegister')
        request.send(formData);

        form.reset();
        var message = document.getElementById("message-box_appointment_add");
        message.className = "show";
        setTimeout(function() { message.className = message.className.replace("show", ""); }, 3000);
    } else {
        var message = document.getElementById("message-box_appointment_error");
        message.className = "show";
        setTimeout(function() { message.className = message.className.replace("show", ""); }, 3000);
    }

})

function validateForm(form) {
    if (form['fullname'] == '' || form['email'] == '') {
        return false;
    }
    var checkedDate = false;
    var dates = form['date'];
    for (index in dates) {
        if (dates[index].checked == true) {
            checkedDate = true;
            break;
        }
    }
    var checkedTime = false;
    var times = form['time'];
    // If we found only one time
    if (typeof times == "object"){
        times = [times];
    }
    for (index in times) {
        if (times[index].checked == true) {
            checkedTime = true;
            break;
        }
    }
    if (checkedTime || checkedDate) {
        return true;
    } else {
        return false;
    }
}
