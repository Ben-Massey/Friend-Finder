$(document).ready(function() {
    // Questions listed in an array so they can be inserted into the survey.
    var questions = [
        'You are relaxed under pressure.',
        'You would rather stay inside than go hang out with friends.',
        'You like to be the center of attention.',
        'You are usually highly motivateda and entergetic.',
        'You are more practical than creative.',
        'You have a good relationship with my family.',
        'You let other people influence your actions.',
        'You misplace your things often.',
        'You are more a dog person than a cat person.',
        'You procrastinate more often than not.'
    ];

    // Choices array.
    var choices = [
        '1 (Strongly Disagree)',
        '2 (Disagree)',
        '3 (Neutral)',
        '4 (Agree)',
        '5 (Strongly Agree)'
    ];

    var questionDiv = $('#questions');
    i = 0;

    // Creates a div for each question.
    questions.forEach(function (question) {
        i++;
        // Fill that div with a header, the question, and the choices selector.
        var item = $('<div class="question">');
        var headline = $('<h4>').text('Question ' + i);
        var questionText = $('<p>').text(question);
        var dropDown = $('<div class="form-group">');
        var select = $('<select class="form-control selector">');
        // Create an option for each choice.
        choices.forEach(function(choice) {
            var option = $('<option>').text(choice);
            select.append(option);
        });
        select.attr('id', 'select' + i);
        // Add the dropdown to the item, then add the item to the questions div.
        dropDown.append(select);
        item.append(headline, questionText, dropDown);
        var br = $('<br>');
        questionDiv.append(item, br);
    });

    // Event handler for when the form is submitted.
    $('#submit').on('click', function(event) {

        event.preventDefault();

        // Take in the username and image link values.
        var userName = $('#userName').val();
        var imageLink = $('#imageLink').val();

        // If both of those items were filled out, gather other answers and submit.
        if (userName.length > 0 && imageLink.length >0) {
            var answers = [];

            // Add the response for each selector to the array of answers.
            Object.keys($('.selector')).forEach(function(key) {
                if (answers.length < questions.length) {
                    // Take only the number from the answer.
                    answers.push($('.selector')[key].value.charAt(0));
                }
            });

            // place the data into an object.
            var surveyData = {
                name: userName,
                photo: imageLink,
                answers: answers
            };

            // POST that data to /api/friends.
            $.post('/api/friends', surveyData, function(data) {

                // Use data callback to display result.
                if (data) {

                    // Empty out modal and username and link fields.
                    $('#modalContent').empty();
                    $('#userName').val('');
                    $('#imageLink').val('');

                    data.forEach(function(profile) {
                        var profileDiv = $('<div class="profile">');
                        var name = profile.name;
                        var photoURL = profile.photo;
                        var nameHeader = $('<h3>').text(name);
                        var photo = $('<img>').attr('src', photoURL);
                        profileDiv.append(nameHeader, photo);

                        $('#modalContent').append(profileDiv);
                    });

                    // If there is a tie for the best match.
                    if (data.length > 1) {
                        $('.modal-title').text('Here are your new friends');
                    } else {
                        $('.modal-title').text('Here is your new friend');
                    }

                    $('#resultModal').modal();
                }
            });
        // If either name or URL is missing, show the error modal.
        } else {
            $('#errorModal').modal();
            // The error modal can be dismissed but it will also disappear after 2 seconds.
            setTimeout(function() {
                $('#errorModal').modal('hide');
            }, 2000);
        }
    });
});