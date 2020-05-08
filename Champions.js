jQuery.extend({
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

let att_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/Ahri.json');
let def_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/Garen.json');

function calculateDMG(phys, magic, trueDMG, armor, mr) {
    total = 0;
    total += (phys * 100 / parseFloat((100 + armor)));
    total += (magic * 100 / parseFloat((100 + mr)));
    total += trueDMG;
    return total;
}

function itemSearch(itemIndex) {
    let itemArray = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/item.json');
    return itemArray[itemIndex].stats;
}

let champA = {
    type: 0, //0 = burst, 1 = adc, 2 = dps not ADC, 3 = else
    level: 1,
    baseAD: 0,
    bonusAD: 0,
    crit: 0, //crit chance
    critMult: 0,  //IE = .5
    atkSpeed: 0,
    bAtkSpeed: 0,
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
let itemplaceholder1 = [3029, 3022, 3046, 1000, 1000, 1000]; // 1000 is no item, attk champ
let itemplaceholder2 = [3029, 3022, 3065, 3110, 1000, 1000]; // 1000 is no item, def champ
    //3029 = roa, 3022 = froze mallet, 3065 spirit visage, 3046 phandtom dancer, 3110 frozen heart


//constant growth parameter
let growthA = (champA.level-1)*(.7025 + (.0175*(champA.level-1)));
let growthD = (champD.level-1)*(.7025 + (.0175*(champD.level-1)));
//attk hero base stats 
// parameters needed: level
champA.baseAD = placeholder1.stats.attackdamage;
champA.baseAD += placeholder1.stats.attackdamageperlevel * growthA;
champA.atkSpeed += placeholder1.stats.attackspeed;
champA.bAtkSpeed += placeholder1.stats.attackspeedperlevel/parseFloat(100) * growthA;    


// def hero
champD.armor += placeholder2.stats.armor;
champD.armor += growthD * placeholder2.stats.armorperlevel;
champD.mr += placeholder2.stats.spellblock;
champD.mr += growthD * placeholder2.stats.spellblockperlevel;
champD.health += placeholder2.stats.hp;
champD.health += growthD * placeholder2.stats.hpperlevel;
champD.hpregen += placeholder2.stats.hpregen;
champD.hpregen += growthD * placeholder2.stats.hpregenperlevel;

//attk hero damage calculations 
// necessary parameters: lvl of abilities 
champA.spelldmg[0] += placeholder1.spells[0].effect[champA.lvlOfspell[0]];
champA.spelldmg[1] += placeholder1.spells[1].effect[champA.lvlOfspell[1]];
champA.spelldmg[2] += placeholder1.spells[2].effect[champA.lvlOfspell[2]];
champA.spelldmg[3] += placeholder1.spells[3].effect[champA.lvlOfspell[3]];

//item calculations def champ
// gargoyle's stoneplate needs exception
// ninja tabi's
// shield items like hexdrinker, steraks

let i;
for (i = 0; i < 6; i++) {
    if (itemplaceholder2[i] != 1000) {
        let itemWanted = itemSearch(itemplaceholder2[i]);
        if (itemWanted.FlatHPPoolMod != null) {
            champD.health += itemWanted.FlatHPPoolMod;
        }
        if (itemWanted.FlatArmorMod != null) {
            champD.armor += itemWanted.FlatArmorMod;
        }       
        if (itemWanted.FlatSpellBlockMod != null) {
            champD.mr += itemWanted.FlatSpellBlockMod;
        }
    }
}

// att champion item calculations
// exception bloodrazor, bork, hydra, roa, any active items, armor/ap penetration items, leth items
// sheen items, rab, ie mod


/**
 * let itemplaceholder1 = [3029, 3022, 3046, 1000, 1000, 1000]; // 1000 is no item, attk champ
let itemplaceholder2 = [3029, 3022, 3065, 3110, 1000, 1000]; // 1000 is no item, def champ
    //3029 = roa, 3022 = froze mallet, 3065 spirit visage, 3046 phandtom dancer, 3110 frozen heart
 */
for (i = 0; i < 6; i++) {
    if (itemplaceholder1[i] != 1000) {
        let itemWanted = itemSearch(itemplaceholder1[i]);
        if (itemWanted.PercentAttackSpeedMod != null) {
            champA.bAtkSpeed += itemWanted.PercentAttackSpeedMod;
        }
        if (itemWanted.FlatPhysicalDamageMod != null) {
            champA.bonusAD += itemWanted.FlatPhysicalDamageMod;
        }
        if (itemWanted.FlatMagicDamageMod != null) {
            champA.bonusAP += itemWanted.FlatMagicDamageMod;
        }
        if (itemWanted.FlatCritChanceMod != null) {
            champA.crit += itemWanted.FlatCritChanceMod;
        }
    }
}

//scaling ability damage 
// do after items/runes have been calculated
// need to add champs with multiple scaling damage
for (i = 0; i < 4; i++) {
    if (champA.ratiotypeofSpell[i] == 0) { //magic scaling
        if (placeholder1.spells[i].vars[0] != null) {
            champA.spelldmg[i] += placeholder1.spells[i].vars[0].coeff * champA.bonusAP;
        }
    }
    else if (champA.ratiotypeSpell[i] == 1) { //tAD scaling
        if (placeholder1.spells[i].vars[0] != null) {
            champA.spelldmg[i] += placeholder1.spells[i].vars[0].coeff * (champA.bonusAD + champA.baseAD);
        }
    }
    else if (champA.ratiotypeSpell[i] == 2) { //bAD scaling
        if (placeholder1.spells[i].vars[0] != null) {
            champA.spelldmg[i] += placeholder1.spells[i].vars[0].coeff * (champA.baseAD);
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
champA.aaDMG += (champA.atkSpeed*(1+champA.bAtkSpeed)) * (champA.baseAD + champA.bonusAD);
champA.aaDMG = (champA.aaDMG * ((1+champA.critMult)*champA.crit+1))

//type separator damage 
//physical 0, magic 1, true 2, neither 3
for (i=0;i<5;i++) {
    if(champA.typeofSpell[i] == 0) {
        champA.physical += champA.spelldmg[i];
    }
    else if (champA.typeofSpell[i] == 1) {
        champA.magic += champA.spelldmg[i];
    }
    else if (champA.typeofSpell[i] == 2) {
        champA.true += champA.spelldmg[i];
    }
}
champA.physical += champA.aaDMG;

let total;
total = calculateDMG(champA.physical, champA.magic, champA.true, champD.armor, champD.mr)
