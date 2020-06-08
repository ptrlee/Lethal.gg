let input = document.getElementById("name-inputbox");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    event.preventDefault();

    let player = this.value;
    let temp = $.getValues(`https://127.0.0.1:2999/liveclientdata/${player}`);
    console.log(temp);

  }
});

jQuery.extend({
    getValues: function(url) {
        var att_champ = null;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'JSON',
            async: false,
            success: function(data) {
                att_champ = data;
            }
        });
       return att_champ;
    }
});

