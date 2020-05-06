jQuery.extend({
    getValues: function(url) {
        var result = null;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'JSON',
            async: false,
            success: function(data) {
                result = data;
            }
        });
       return result;
    }
});

export let Champions = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/Ahri.json');
//console.log(Champions);

