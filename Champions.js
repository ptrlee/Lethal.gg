import {getChampOneItems, getChampionTwoItems} from "./calc.js"

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

/** 
let x = document.getElementById("champ-name-one").innerHTML;
let att_champ = $.getValues(`http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/${x}.json`);
let def_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/Garen.json');
*/ 
let y = 'Ahri'; //kaisa needs general fix
let att_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/' + y + '.json');
let def_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/Garen.json');


export function easyCheck() {
    let x = document.getElementById("champ-name-one").innerHTML;
    let y = document.getElementById("champ-name-two").innerHTML;
    let att_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/' + x + '.json');
    let def_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/' + y + '.json');
    let attack = att_champ[x];
    let defend = def_champ[y];

    let attackSpells = attack.spells;
    //console.log(defend);
    let pstring = placeholder1.spells[0].tooltip;
    //console.log(attackSpells[0]);

    for (let i = 0; i < attackSpells.length; i++) {
        let type = 0; // If 0 == physical; 1 == magical; 2 == true 
        let level = 1; //level of spell
        let spell = attackSpells[i];
        let spellEffect = spell.effect[1];
        let spellVar = attackSpells[i].vars;
        //console.log(spellVar);
       

        for (let j = 0; j < parseTooltip(placeholder1.spells[i].tooltip).length; j++) {
            let shorten = parseTooltip(placeholder1.spells[i].tooltip)[j].toString().split(" ");
            for (let k = 0; k < shorten.length; k++) {
                if (shorten[k] === "magic" || shorten[k] === "magical") {
                    type = 1;
                    break;
                } else if (shorten[k] === "true") {
                    type = 2;
                    break;
                }
                
            }

            console.log(shorten);
            console.log(type);
            
            if (type === 1) {
                let damage = spellEffect[level-1]*spellVar[0].coeff;
                let dmg = calculateDMG(damage,defend.stats.spellblock,0,0);
                //console.log(spell + dmg);
            }
        }
 
    }
    
    //console.log(baseSpellDamage1);
    //console.log(defend);
    //console.log(shorten);
}

/**
 * calculates damage done based on reduction
 * @param all self-explanatory
 * does not factor in total damage reduction or percentile conversion like conqueror
 */
function calculateDMG(damage, reduction, flatPen, percentPen) {
    total = 0;
    reduction *= (1-percentPen);
    reduction -= flatPen;
    total += (damage * 100 / parseFloat((100 + reduction)));
    //console.log(reduction);
    return total;
}

/**
 * parses the tooltip for important damage part
 * @param {*} tooltip string given by the ability of interes
 */
function parseTooltip(tooltip) {
    let value = [""]
    let abilityIndex = 0;
    for (let i = 0; i < tooltip.length; i++) { 
        if (tooltip.charAt(i) == '<') {

            //fail if <sc appears <scaleAP or <scaleAD
            //fail if <p appears <physicalDamage>
            //pass if sp appears
            //right now sp fails
            if ((tooltip.charAt(i+1) != 's'
                && tooltip.charAt(i+2) != 'c')
                && tooltip.charAt(i+1) != 'p' 
                || tooltip.charAt(i+1) == 's' 
                && tooltip.charAt(i+2) == 'p') {
                i++;
                continue;
            }

            let j = i; //index of 'd'

            //finds potential 'damage' candidate
            for (j; j < tooltip.length-5; j++) {
                if (tooltip.charAt(j) == 'd' 
                && tooltip.charAt(j-1) == ' ' //can't be part of a variable
                && tooltip.charAt(j+5) == 'e') {  //checks if 'd' string ends with 'e'
                    break;
                }
            }

            if (tooltip.charAt(j+5) != 'e') { //breaks loop if 'd...e' string not found
                break;
            }

            if (tooltip.charAt(i-2) == '}') { //{{var}} checker 
                for (i; i > 0; i--) {
                    if (tooltip.charAt(i) == '{') {
                        i--;
                        break;
                    }
                }
            }
            value[abilityIndex] = tooltip.substring(i, j+6)
            abilityIndex++;
            i = j+6;
        }
    }
    //console.log(value);
    return value;
    
}

function itemSearch(itemIndex) {
    let itemArray = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/item.json');
    return itemArray[itemIndex].stats;
}

//attacking champion
console.log(att_champ.Ahri);
export function getAtkChamp() {
    let x = document.getElementById("champ-name-one").innerHTML;
    let att_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/' + x + '.json');
    let champ = att_champ[x];

    let champA = {
        type: 0, //0 = burst, 1 = adc, 2 = dps not ADC, 3 = else
        abilities: [[""]],
        level: 1,
        baseAD: champ.stats.attackdamage,
        bonusAD: 0,
        crit: 0, //crit chance
        critMult: 0,  //IE = .5
        atkSpeed: 0,
        bAtkSpeed: 0,
        bonusAP: 0,
        aaDMG: 0,
        spelldmg: [[0,0,0], [0,0,0], [0,0,0],[0,0,0]],
        lvlOfspell: [1,1,1,1],
        item: getChampOneItems(), //not coded yet 
        physical: 0,
        magical: 0,
        true: 0,
        damage_amp: 0, //not coded yet
        health: champ.stats.hp,
        armor: champ.stats.armor,
        mr: champ.stats.spellblock,
        mana: champ.stats.mp,
    }
    changeAtkStats(champA);
    changeDefStats(champA);
    itemStats(champA.item,champA);
    console.log(champA);
    return champA;
}

//defending champion
export function getDefChamp() { 
    let y = document.getElementById("champ-name-two").innerHTML;
    let def_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/' + y + '.json');
    let champ = def_champ[y];

    let champD = { // abilities and runes
        level: 1,
        armor: champ.stats.armor,
        health: champ.stats.hp,
        mr: champ.stats.spellblock,
        item: getChampionTwoItems(), 
        dmg_reduc: 0,
        hpregen: 0,
        AP: 0,
        baseAD: 0,
        mana: champ.stats.mp,
    }
    //changeAtkStats(champD);
    changeDefStats(champD);
    itemStats(champD.item,champD);
    console.log(champD);
    return champD;
}

/**
 * placeholders for input champions, items and (later runes)
 * need to reroute to calc.js 
 */
let placeholder1 = att_champ[y];
let placeholder2 = def_champ.Garen;
let itemplaceholder1 = getChampOneItems(); //attk champ
let itemplaceholder2 = getChampionTwoItems(); //def champ

let pstring = placeholder1.spells[0].tooltip;
//console.log(parseTooltip(pstring));


/**
 * calculations for base stats depending on @param level
 * ---------------------------------------------------
 */

//constant growth parameter -- applies to all perlevel values

function growth(champion) {
    return (champion.level-1)*(.7025 + (.0175*(champion.level-1)));
}

//attk hero base stats
function changeAtkStats(champion) { 
    champion.baseAD = placeholder1.stats.attackdamage;
    champion.bonusAD += placeholder1.stats.attackdamageperlevel * growth(champion);
    champion.atkSpeed += placeholder1.stats.attackspeed;
    champion.bAtkSpeed += placeholder1.stats.attackspeedperlevel/parseFloat(100) * growth(champion);    
}


// def hero
function changeDefStats (champion) {
    champion.armor += placeholder2.stats.armor;
    champion.armor += growth(champion) * placeholder2.stats.armorperlevel;
    champion.mr += placeholder2.stats.spellblock;
    champion.mr += growth(champion) * placeholder2.stats.spellblockperlevel;
    champion.health += placeholder2.stats.hp;
    champion.health += growth(champion) * placeholder2.stats.hpperlevel;
    //champion.hpregen += placeholder2.stats.hpregen;
    //champion.hpregen += growth(champion) * placeholder2.stats.hpregenperlevel;
}

/**
 * Item calculations
 * -----------------------------------------
 */

/*item calculations def champ
* gargoyle's stoneplate needs exception
* ninja tabi's exceptions
* shield items like hexdrinker, steraks exceptions
* takes into account hp, armor, mr
*/

function itemStats(items, champion) {
    for (i = 0; i < items.length; i++) {
        let itemWanted = itemSearch(items[i]);
        if (itemWanted.FlatHPPoolMod != null) {
            champion.health += itemWanted.FlatHPPoolMod;
        }
        if (itemWanted.FlatArmorMod != null) {
            champion.armor += itemWanted.FlatArmorMod;
        }       
        if (itemWanted.FlatSpellBlockMod != null) {
            champion.mr += itemWanted.FlatSpellBlockMod;
        }
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

// att champion item calculations
// exception bloodrazor, bork, hydra, roa, any active items, armor/ap penetration items, leth items
// sheen items, rab, ie mod
// takes into acount ad, ap, as, and crit 

// let itemplaceholder1 = [3029, 3022, 3046, 1000, 1000, 1000]; // 1000 is no item, attk champ
// let itemplaceholder2 = [3029, 3022, 3065, 3110, 1000, 1000]; // 1000 is no item, def champ
//3029 = roa, 3022 = froze mallet, 3065 spirit visage, 3046 phandtom dancer, 3110 frozen heart


/**
 * Ability calculations
 * @param tooltip parsed by func parseTooltip 
 * parsing the return value for important values
 * separates based on damage
 * calculates scaling/base damage @param level, @param allstats
 */

/** 
 for (i = 0; i < 4; i++) { //iterates for every spell
    let bigString = parseTooltip(placeholder1.spells[i].tooltip)

    for (let j = 0; j < bigString.length; j++) { //iterates for every damage calculation
        */
        /**
         * looks for '<' to find the base damage, general case {{e1}}
         */
/*
         let k = 0;
         let cont = true;
         while (cont) {
            break;
         }
         break;
    }
    break;
 }
 */

//attk hero damage calculations 
// necessary parameters: lvl of abilities 
//champA.spelldmg[0] += placeholder1.spells[0].effect[champA.lvlOfspell[0]];
//champA.spelldmg[1] += placeholder1.spells[1].effect[champA.lvlOfspell[1]];
//champA.spelldmg[2] += placeholder1.spells[2].effect[champA.lvlOfspell[2]];
//champA.spelldmg[3] += placeholder1.spells[3].effect[champA.lvlOfspell[3]];

//scaling ability damage 
// do after items/runes have been calculated
// need to add champs with multiple scaling damage
/** 
for (i = 0; i < 4; i++) {
    if (champA.ratiotypeofSpell[i] == 0) { //magic scaling
        if (placeholder1.spells[i].vars[0] != null) {
            //champA.spelldmg[i] += placeholder1.spells[i].vars[0].coeff * champA.bonusAP;
        }
    }
    else if (champA.ratiotypeSpell[i] == 1) { //tAD scaling
        if (placeholder1.spells[i].vars[0] != null) {
            //champA.spelldmg[i] += placeholder1.spells[i].vars[0].coeff * (champA.bonusAD + champA.baseAD);
        }
    }
    else if (champA.ratiotypeSpell[i] == 2) { //bAD scaling
        if (placeholder1.spells[i].vars[0] != null) {
           // champA.spelldmg[i] += placeholder1.spells[i].vars[0].coeff * (champA.baseAD);
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
**/

// calculates what type of damage each spell is
// need to figure out
/*
for (i = 0; i < 4; i++) {
    i = 5;
}
*/

/* 
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

*/

//attack damage calculations
// do after items and runes


//Commented this out temperarily
//champA.aaDMG += (champA.atkSpeed*(1+champA.bAtkSpeed)) * (champA.baseAD + champA.bonusAD);
//champA.aaDMG = (champA.aaDMG * ((1+champA.critMult)*champA.crit+1))

let total;




//total = calculateDMG(champA.physical, champA.magic, champA.true, champion.armor, champion.mr)
