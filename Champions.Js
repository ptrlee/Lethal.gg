console.log('test1')
let Champions

$.ajax({
    url : 'http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion.json',
    type : 'GET',
    data : {
    },
    dataType:'json',
    success : function(data) {
        alert('Data: '+data);
        Champions = data
    },
    error : function(request,error)
    {
        alert("Request: "+JSON.stringify(request));
    }

})
console.log(Champions)