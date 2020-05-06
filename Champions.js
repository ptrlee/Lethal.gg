jQuery.extend({
    getValues: function(url, meow) {
        var att_champ = null;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'JSON',
            async: false,
            success: function(data) {
                att_champ = data.data;
            }
        });
       return att_champ;
    },
    getValues: function(url) {
        var def_champ = null;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'JSON',
            async: false,
            success: function(data) {
                def_champ = data.data;
            }
        });
       return def_champ;
    }
});

let att_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/Annie.json', 0);
let def_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/Alistar.json', 0);
console.log(def_champ);

/** 
 * let level = 3;
let armor = (Champions.Aatrox.stats.armor + (Champions.Aatrox.stats.armorperlevel *level ))
let hp = (Champions.Aatrox.stats.hp + (Champions.Aatrox.stats.hpperlevel * level))
let mr = (Champions.Aatrox.stats.spellblock+ (Champions.Aatrox.stats.spellblockperlevel * level))
let hpregen = (Champions.Aatrox.stats.hpregen+ (Champions.Aatrox.stats.hpregenperlevel * level))

 */
var champA = {
    q: 0,
    w: 0,
    e: 0,
    r: 0,
    item: 0,
    physical: 0,
    magical: 0,
    true: 0,
    dps: 0
}

var champD = {
    armor: 0,
    health: 0,
    mr: 0, 
    dmg_reduc: 0,
    hpregen: 0
}




