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
console.log(att_champ);

function calculateDMG(phys, magic, trueDMG, armor, mr) {
    total = 0
    total += (phys * 100 / (100 + armor))
    total += (magic * 100 / (100 + mr))
    total += trueDMG
    return total;
}

let champA = {
    type: 0, //0 = burst, 1 = adc, 2 = dps not ADC, 3 = else
    level: 1,
    baseAD: 0,
    bonusAD: 0,
    crit: 0, 
    critMult: 1, 
    atkSpeed: 0,
    bonusAP: 0,
    p = 0, //not coded yet 
    aaDMG = 0,
    spelldmg = [0,0,0,0],
    lvlOfspell = [1,1,1,1],
    typeofSpell = [0,0,0,0], //physical 0, magic 1, true 2, neither 3
    ratiotypeofSpell = [0,0,0,0], // magic 0, totalAD 1, bonusAD 2, health 3, mana 4, 
    item: 0, //not coded yet 
    physical: 0,
    magical: 0,
    true: 0,
    damage_amp: 0 //not coded yet
}

let champD = { // abilities and runes
    level: 1,
    armor: 0,
    health: 0,
    mr: 0, 
    dmg_reduc: 0,
    hpregen: 0
}

//attk hero base stats 
// parameters needed: level
champA.baseAD = att_champ.Ahri.stats.attackdamage
champA.baseAD += att_champ.Ahri.stats.attackdamageperlevel
champA.atkSpeed += att_champ.Ahri.stats.attackspeed
champA.atkSpeed += att_champ.Ahri.stats.attackspeedperlevel * champA.level


// def hero
champD.armor += def_champ.stats.armor
champD.armor += champD.level * def_champ.stats.armorperlevel
champD.spellblock += def_champ.stats.spellblock
champD.spellblock += champD.level * def_champ.stats.spellblockperlevel
champD.health += def_champ.stats.hp
champD.health += champD.level * def_champ.stats.hpperlevel
champD.hpregen += def_champ.stats.hpregen
champD.hpregen += champD.level * def_champ.stats.hpregenperlevel

//attk hero damage calculations 
// necessary parameters lvl of abilities 
champA.spelldmg[0] += att_champ.Ahri.spells[0].effect[lvlOfspell[0]]
champA.spelldmg[1] += att_champ.Ahri.spells[1].effect[lvlOfspell[1]]
champA.spelldmg[2] += att_champ.Ahri.spells[2].effect[lvlOfspell[2]]
champA.spelldmg[3] += att_champ.Ahri.spells[3].effect[lvlOfspell[3]]

//scaling ability damage 
// do after items/runes have been calculated
for (i = 0; i < 4; i++) {
    if (champA.ratiotypeofSpell[i] == 0) { //magic scaling
        champA.spelldmg[i] += att_champ.Ahri.spells[i].vars[0].coeff * champA.bonusAP
    }
    else if (champA.ratiotypeSpell[i] == 1) { //tAD scaling
        champA.spelldmg[i] += att_champ.Ahri.spells[i].vars[0].coeff * (champA.bonusAD + champA.baseAD)
    }
    else if (champA.ratiotypeSpell[i] == 2) { //bAD scaling
        champA.spelldmg[i] += att_champ.Ahri.spells[i].vars[0].coeff * (champA.baseAD)
    }
    else if (champA.ratiotypeSpell[i] == 3) { //hp scaling
        //exception 
    }
    else if (champA.ratiotypeSpell[i] == 4) { //mana scaling
        //exception 
    }
    else if (champA.ratiotypeSpell[i] == 5) { //enemy hp scaling
        //exception 
    }
    else if (champA.ratiotypeSpell[i] == 6) { //mspd scaling (heca)
        //exception 
    }
}

//attack damage calculations
// do after items and runes
champA.aaDMG += champA.atkSpeed * (champA.baseAD + champA.bonusAD)
champA.aaDMG *= (1 + champA.crit)

