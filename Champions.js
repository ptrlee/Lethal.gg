jQuery.extend({
    getValues: function(url, meow) {
        var champ = null;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'JSON',
            async: false,
            success: function(data) {
                champ = data.data;
            }
        });
       return champ;
    },
    getValues: function(url) {
        var champ = null;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'JSON',
            async: false,
            success: function(data) {
                champ = data.data;
            }
        });
       return champ;
    }
});

let att_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/Ahri.json', 0);
let def_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/Garen.json', 0);
console.log(def_champ);
console.log(att_champ);

function calculateDMG(phys, magic, trueDMG, armor, mr) {
    total = 0;
    total += (phys * 100 / parseFloat((100 + armor)));
    total += (magic * 100 / parseFloat((100 + mr)));
    total += trueDMG;
    return total;
}

let champA = {
    type: 0, //0 = burst, 1 = adc, 2 = dps not ADC, 3 = else
    level: 1,
    baseAD: 0,
    bonusAD: 0,
    crit: 0, //crit chance
    critMult: 0,  //IE = .5
    atkSpeed: 0,
    bonusAP: 0,
    p: 0, //not coded yet 
    aaDMG: 0,
    spelldmg: [0,0,0,0],
    lvlOfspell: [1,1,1,1],
    typeofSpell: [0,0,0,0], //physical 0, magic 1, true 2, neither 3
    ratiotypeofSpell: [0,0,0,0], // magic 0, totalAD 1, bonusAD 2, health 3, mana 4, 
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

let placeholder1 = att_champ.Ahri;
let placeholder2 = def_champ.Garen;
console.log(placeholder1.spells[0].vars[0]);

//attk hero base stats 
// parameters needed: level
champA.baseAD = placeholder1.stats.attackdamage;
champA.baseAD += placeholder1.stats.attackdamageperlevel;
champA.atkSpeed += placeholder1.stats.attackspeed;
champA.atkSpeed += placeholder1.stats.attackspeedperlevel * champA.level;


// def hero
champD.armor += placeholder2.stats.armor;
champD.armor += champD.level * placeholder2.stats.armorperlevel;
champD.spellblock += placeholder2.stats.spellblock;
champD.spellblock += champD.level * placeholder2.stats.spellblockperlevel;
champD.health += placeholder2.stats.hp;
champD.health += champD.level * placeholder2.stats.hpperlevel;
champD.hpregen += placeholder2.stats.hpregen;
champD.hpregen += champD.level * placeholder2.stats.hpregenperlevel;

//attk hero damage calculations 
// necessary parameters: lvl of abilities 
champA.spelldmg[0] += placeholder1.spells[0].effect[champA.lvlOfspell[0]];
champA.spelldmg[1] += placeholder1.spells[1].effect[champA.lvlOfspell[1]];
champA.spelldmg[2] += placeholder1.spells[2].effect[champA.lvlOfspell[2]];
champA.spelldmg[3] += placeholder1.spells[3].effect[champA.lvlOfspell[3]];

//scaling ability damage 
// do after items/runes have been calculated
// need to add champs with multiple scaling damage
let i;
for (i = 0; i < 4; i++) {
    if (champA.ratiotypeofSpell[i] == 0) { //magic scaling
        try {
            champA.spelldmg[i] += placeholder1.spells[i].vars[0].coeff * champA.bonusAP;
        }
        catch (err) {
        }
    }
    else if (champA.ratiotypeSpell[i] == 1) { //tAD scaling
        try {
            champA.spelldmg[i] += placeholder1.spells[i].vars[0].coeff * (champA.bonusAD + champA.baseAD);
        }
        catch (err) {
        }
    }
    else if (champA.ratiotypeSpell[i] == 2) { //bAD scaling
        try {
            champA.spelldmg[i] += placeholder1.spells[i].vars[0].coeff * (champA.baseAD);
        }
        catch (err) {
        }

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

// calculates what type of damage each spell is
// need to figure out
for (i = 0; i < 4; i++) {
    i = 5;
}

//attack damage calculations
// do after items and runes
champA.aaDMG += champA.atkSpeed * (champA.baseAD + champA.bonusAD);
champA.aaDMG = (champA.aaDMG / parseFloat(champA.crit))*(2+champA.critMult)*(champA.crit);


