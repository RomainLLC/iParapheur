$(document).ready(function () {
    var strength = {
        0: "Très faible ☹",
        1: "faible ☹",
        2: "Moyen ☹",
        3: "Bon",
        4: "Fort"
    };

    var password = document.getElementById('password');
    var meter = document.getElementById('password-strength-meter');
    var text = document.getElementById('password-strength-text');

    password.addEventListener('input', function()
    {
        var val = password.value;
        var result = zxcvbn(val);

        // Update the password strength meter
        meter.value = result.score + 1;

        // Update the text indicator
        if(val !== "") {
            text.setAttribute("class", "force-" + result.score);
            text.innerHTML = "Force : " + "<strong>" + strength[result.score] + "</strong>";
            if(result.score < 3) {
                text.innerHTML += "<span class='feedback'>&nbsp;La force du mot de passe doit être minimum 'Bon'.</span>";
            }
            text.innerHTML += "<span class='feedback'>" + result.feedback.warning + "</span>";
        }
        else {
            meter.value = 0;
            text.setAttribute("class", "");
            text.innerHTML = "";
        }
    });
});