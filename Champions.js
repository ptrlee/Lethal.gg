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

function calculateDMG(phys, magic, trueDMG, armor, mr) {
    total = 0
    total += (phys * 100 / (100 + armor))
    total += (magic * 100 / (100 + mr))
    total += trueDMG
    return total;
}
/** 
 * let level = 3;
let armor = (Champions.Aatrox.stats.armor + (Champions.Aatrox.stats.armorperlevel *level ))
let hp = (Champions.Aatrox.stats.hp + (Champions.Aatrox.stats.hpperlevel * level))
let mr = (Champions.Aatrox.stats.spellblock+ (Champions.Aatrox.stats.spellblockperlevel * level))
let hpregen = (Champions.Aatrox.stats.hpregen+ (Champions.Aatrox.stats.hpregenperlevel * level))

 */
var champA = {
    type: 0, //0 = burst, 1 = adc, 2 = dps not ADC, 3 = else
    level: 1,
    baseAD: 0,
    bonusAD: 0,
    crit: 0,
    critMult: 0,
    atkSpeed: 0,
    bonusAP: 0,
    q: 0,
    qtype: 0, //physical 0, magic 1, true 2, neither 3
    w: 0,
    wtype: 0, 
    e: 0,
    etype: 0,
    r: 0,
    rtype: 0,
    item: 0,
    physical: 0,
    magical: 0,
    true: 0,
    dps: 0,
    damage_amp: 0
}

var champD = {
    level = 1,
    armor: 0,
    health: 0,
    mr: 0, 
    dmg_reduc: 0,
    hpregen: 0
}


champA.baseAD = att_champ.stats.attackdamage
champA.baseAD += att_champ.stats.attackdamageperlevel
champA.atkSpeed += att_champ.stats.attackspeed
champA.atkSpeed += att_champ.stats.attackspeedperlevel * champA.level


champD.armor += def_champ.stats.armor
champD.armor += champD.level * def_champ.stats.armorperlevel
champD.spellblock += def_champ.stats.spellblock
champD.spellblock += champD.level * def_champ.stats.spellblockperlevel
champD.health += def_champ.stats.hp
champD.health += champD.level * def_champ.stats.hpperlevel
champD.hpregen += def_champ.stats.hpregen
champD.hpregen += champD.level * def_champ.stats.hpregenperlevel

