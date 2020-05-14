import {getChampOneItems, getChampionTwoItems} from "./calc.js";

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
    },
    getJSON: function(ChampionName) {
        var champ = null;
        $.ajax({
            url: '/ChampSpellDamage.json',
            type: 'get',
            dataType: 'JSON',
            async: false,
            success: function(data) {
                champ = data[ChampionName];
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

export function spellDamage() {
    let exceptions = [];
    let champD = getDefChamp();
    let champA = getAtkChamp();

    let spellsChamp = $.getJSON(document.getElementById("champ-name-one").innerHTML);
    console.log(spellsChamp);
    for (let i = 0; i < champA.abilities.length + 1; i++) {
        let type = 0; // If 0 == physical; 1 == magical; 2 == true 
        let level = 5; //level of spell placeholder
        let spell;
        let spellEffect;
        let spellVar;
        if (i!=0) {
            spell = champA.abilities[i-1];
            spellEffect = spell.effect[1];
            spellVar = spell.vars;
        }
        let totalDamage = [0,0,0,0,0];
        let aaDMG;
       
        //test for print
        if (i != 0)
        break;

        console.log(spellsChamp[0]); 
        if (i == 0 || !spellsChamp[i].useParseToolTip) {
        }

        // type of damage
        if (i!= 0) {
        let tooltip = parseTooltip(spell.tooltip);
        for (let j = 0; j < tooltip.length; j++) { //2x for ahri q 
            let shorten = tooltip[j].toString().split(" ");
            for (let k = 0; k < shorten.length; k++) { 
                if (shorten[k] === "magic" || shorten[k] === "magical") {
                    type = 1;
                    break;
                } else if (shorten[k] === "true") {
                    type = 2;
                    break;
                }
            }
            
            //calls calculateDMG for every type of dmg 
            if (type === 1) {
                if (spellVar.length === 0) {
                    exceptions.push(spell);
                    break;
                }

                let damage = spellEffect[level-1] + champA.bonusAP*spellVar[0].coeff;
                totalDamage[i] += calculateDMG(damage,champD.mr,0,0);
            } else if (type == 2) {
                if (spellVar.length === 0) {
                    exceptions.push(spell);
                    break;
                }

                totalDamage[i] += spellEffect[level-1] + champA.bonusAP*spellVar[0].coeff;
            } else if (type == 0) { 
                if (spellVar.length === 0) {
                    exceptions.push(spell);
                    break;
                }

                let damage = spellVar[0].coeff * (champA.baseAD+champA.bonusAD);
                // or let damage = spellVar[0].coeff * (champA.bonusAD) for bonus AD scaling
                // have to implement this
                totalDamage[i] += calculateDMG(damage,champD.armor,0,0);
            }
        }
        }
        /// aa dmg calculator (needs to factor in abilities that steroid ex trist q)
        aaDMG += (champA.atkSpeed*(1+champA.bAtkSpeed)) * (champA.baseAD + champA.bonusAD);
        aaDMG = (champA.aaDMG * ((1+champA.critMult)*champA.crit+1))
 
    }
}

/**
 * calculates damage done based on reduction
 * @param all self-explanatory
 * does not factor in total damage reduction or percentile conversion like conqueror
 */
function calculateDMG(damage, reduction, flatPen, percentPen) {
    let total = 0;
    reduction *= (1-percentPen);
    reduction -= flatPen;
    total += (damage * 100 / parseFloat((100 + reduction)));
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
    return value;
    
}

function itemSearch(itemIndex) {
    let itemArray = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/item.json');
    return itemArray[itemIndex].stats;
}

//attacking champion
export function getAtkChamp() {
    let x = document.getElementById("champ-name-one").innerHTML;
    let att_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/' + x + '.json');
    let champ = att_champ[x];
    let champA = {
        type: 0, //0 = burst, 1 = adc, 2 = dps not ADC, 3 = else
        abilities: champ.spells,
        level: document.getElementById("champ-level-list-one").value,
        mana: 0,
        baseAD: 0,
        bonusAD: 0,
        crit: 0, //crit chance
        critMult: 0,  //IE = .5
        atkSpeed: 0,
        bAtkSpeed: 0,
        bonusAP: 0,
        spelldmg: [[0,0,0], [0,0,0], [0,0,0],[0,0,0]],
        lvlOfspell: [1,1,1,1],
        item: 0, //not coded yet 
        physical: 0,
        magical: 0,
        true: 0,
        damage_amp: 0, //not coded yet
        health: 0,
        armor: 0,
        mr: 0,
        mana: 0,
    }
    if (champA.level == undefined) {
        champA.level = 1;
    }
    champA.item = getChampOneItems();
    changeAtkStats(champA, champ);
    changeDefStats(champA, champ);
    changeAtkSpeedStats(champA, champ);
    itemStats(champA.item,champA);
    return champA;
}

//defending champion
export function getDefChamp() { 
    let y = document.getElementById("champ-name-two").innerHTML;
    let def_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/' + y + '.json');
    let champ = def_champ[y];

    let champD = { // abilities and runes
        level: document.getElementById("champ-level-list-two").value,
        abilities: champ.abilities,
        armor: 0,
        health: 0,
        mana: 0,
        mr: 0,
        item: getChampionTwoItems(), 
        dmg_reduc: 0,
        hpregen: 0,
        bonusAP: 0,
        baseAD: 0,
        bonusAD: 0,
        mana: 0,
    }
    if (champD.level == undefined) {
        champD.level = 1;
    }
    changeAtkStats(champD,champ);
    changeDefStats(champD,champ);
    changehpregenStats(champD, champ);
    itemStats(champD.item,champD);
    return champD;
}

/**
 * calculations for base stats depending on @param level
 * ---------------------------------------------------
 */

//constant growth parameter -- applies to all perlevel values

function growth(level) {
    return (level-1)*(.7025 + (.0175*(level-1)));
}

function changeAtkStats(champion, champ) { 
    champion.baseAD = champ.stats.attackdamage;
    champion.baseAD += champ.stats.attackdamageperlevel * growth(champion.level);
    champion.mana = champ.stats.mp; 
    champion.mana += champ.stats.mpperlevel * growth(champion.level); 
}

function changeAtkSpeedStats(champion, champ) { //only for champA
    champion.atkSpeed += champ.stats.attackspeed;
    champion.bAtkSpeed += champ.stats.attackspeedperlevel/parseFloat(100) * growth(champion.level);   
}

function changehpregenStats(champion, champ) { //only for champD
    champion.hpregen += champ.stats.hpregen;
    champion.hpregen += growth(champion.level) * champ.stats.hpregenperlevel; 
}


// def hero
function changeDefStats (champion, champ) {
    champion.armor += champ.stats.armor;
    champion.armor += growth(champion.level) * champ.stats.armorperlevel;
    champion.mr += champ.stats.spellblock;
    champion.mr += growth(champion.level) * champ.stats.spellblockperlevel;
    champion.health += champ.stats.hp;
    champion.health += growth(champion.level) * champ.stats.hpperlevel;
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
    for (let i = 0; i < items.length; i++) {
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
        if (itemWanted.PercentAttackSpeedMod != null && champion.bAtkSpeed != null) {
            champion.bAtkSpeed += itemWanted.PercentAttackSpeedMod;
        }
        if (itemWanted.FlatPhysicalDamageMod != null) {
            champion.bonusAD += itemWanted.FlatPhysicalDamageMod;
        }
        if (itemWanted.FlatMagicDamageMod != null) {
            champion.bonusAP += itemWanted.FlatMagicDamageMod;
        }
        if (itemWanted.FlatCritChanceMod != null && champion.crit != null) {
            champion.crit += itemWanted.FlatCritChanceMod;
        }
        if (itemWanted.FlatMPPoolMod != null) {
            champion.mana += itemWanted.FlatMPPoolMod;
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


//total = calculateDMG(champA.physical, champA.magic, champA.true, champion.armor, champion.mr)
