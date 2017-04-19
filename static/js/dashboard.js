var form = document.getElementById('newAppointment');
// Time ranges count
var timeRanges = 1;
// Adding new time ranges
var addTimeRangeButton = document.getElementById('addTimeRange');
addTimeRangeButton.addEventListener('click', function(e) {
    timeRanges += 1
    var timeRange = String(timeRanges)
    var newTimeFrom = "<input class='form-control' type='time' name=timeFrom" + timeRange + ">";
    var newTimeTill = "<input class='form-control' type='time' name=timeTill" + timeRange + ">";
    // Creating new DOM elements
    var newTimeFromInput = document.createElement("div");
    newTimeFromInput.innerHTML = newTimeFrom;
    newTimeFromInput = newTimeFromInput.firstChild;
    var labelFrom = document.createElement("label");
    labelFrom.setAttribute('for', 'timeFrom' + timeRange);
    labelFrom.innerHTML = 'TimeFrom';

    var newTimeTillInput = document.createElement("div");
    newTimeTillInput.innerHTML = newTimeTill;
    newTimeTillInput = newTimeTillInput.firstChild;
    var labelTill = document.createElement("label");
    labelTill.setAttribute('for', 'timeTill' + timeRange);
    labelTill.innerHTML = 'Time Till';
    var hr = document.createElement('hr')
        //
    form.appendChild(labelFrom);
    form.appendChild(newTimeFromInput);
    form.appendChild(labelTill);
    form.appendChild(newTimeTillInput);
    form.appendChild(hr);
});
// Remove last time range
var removeTimeRangeButton = document.getElementById('removeTimeRange');
removeTimeRangeButton.addEventListener('click', function(e) {
    if (timeRanges > 1) {
        //Removing last 4 elements
        for (var i = 0; i < 5; i++) {
            form.removeChild(form.lastChild);
        }
        timeRanges -= 1;
    }
});
// Send out form to server
var formButton = document.getElementById('submitForm');
formButton.addEventListener('click', function(e) {
    if(validateForm(form)){
        var formData = new FormData(form);
        formData.append('data_ranges', timeRanges)
        var request = new XMLHttpRequest();
        request.open('POST', '/appointment')
        request.send(formData);
        form.reset();
        var message = document.getElementById("message-box_appointment_add");
        message.className = "show";
        setTimeout(function() { message.className = message.className.replace("show", ""); }, 3000);
    }else {
        var message = document.getElementById("message-box_appointment_error");
        message.className = "show";
        setTimeout(function() { message.className = message.className.replace("show", ""); }, 3000);
    }

});

function validateForm(form) {
    var inputs = form.getElementsByTagName('input');
    for (i in inputs) {
        if (inputs[i].value == '') {
            return false;
        }
    }
    return true;
}
