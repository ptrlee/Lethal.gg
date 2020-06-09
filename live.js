let input = document.getElementById("name-inputbox");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    event.preventDefault();

    let player = this.value;
    let temp = $.getValues(`https://127.0.0.1:2999/liveclientdata/Coolnoob215`);
    console.log(temp);

  }
});

// const axios = require('axios').default;

// var https = require('https');
// var fs  = require('fs');

// var options = {
//   hostname: 'example.com',
//   port: 83,
//   path: '/v1/api?a=b',
//   method: 'GET',
//   key: fs.readFileSync('/path/to/private-key/key.pem'),
//   cert: fs.readFileSync('/path/to/certificate/client_cert.pem'),  
//   passphrase: 'password'
// };

// var req = https.request(options, function(res) {
// console.log(res.statusCode);
// res.on('data', function(d) {
//   process.stdout.write(d);
//   });
// });

// req.end()

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

