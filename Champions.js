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

    let spellsChamp = $.getJSON(document.getElementById("champ-input-list-one").value);
    //console.log(spellsChamp);
    let totalDamage = [ [[0]] , [[0]] , [[0]] , [[0]] , [[0]] ];
    let damageOverTime = [ [[0]] , [[0]] , [[0]] , [[0]] , [[0]] , [[0]]];
    let combinedDamage = [totalDamage, damageOverTime];
    let aaDMG;
    for (let i = 0; i < 5; i++) {
        let type = 0; // If 0 == physical; 1 == magical; 2 == true 
        let level = [5,1,1,1]; //level of spell placeholder
        let spell;
        let spellEffect;
        let spellVar;
        //test for print
        
        //yikes
        let spellString;
        if (i == 0)
            spellString = 'Passive';
        else if (i == 1)
            spellString = 'QBaseDamage';
        else if (i == 2)
            spellString = 'WBaseDamage';
        else if (i == 3)
            spellString = 'EBaseDamage';
        else 
            spellString = 'RBaseDamage';

        if (i == 0 || !spellsChamp[i][spellString].worksForAPI) {
            type = spellsChamp[i][spellString].type;

            //renames spellsChamp to access data
            if (i == 0) { //passive
                spellsChamp[i]=spellsChamp[i].Passive;
            }
            else if (i == 1) { //q
                spellsChamp[i]=spellsChamp[i].QBaseDamage;
            }
            else if (i == 2) { //w
                spellsChamp[i]=spellsChamp[i].WBaseDamage;
            }
            else if (i == 3) { //e
                spellsChamp[i]=spellsChamp[i].EBaseDamage;
            }
            else if (i == 4) { //r
                spellsChamp[i] = spellsChamp[i].RBaseDamage;
            }

            //w is the index of the levelOFSpell -- replace with input later
            // w = 1 is for the passive where you can't level it 
            let w = i-1;
            if (i == 0)
                w = 1;

            //calls calculate spell
            let j = 0; //keeps track of the parts of a spell (ahri q will have 2)
            let count = 0; //tracker used for .push and assignment  

            let condition = spellsChamp[i]; //recursive definition of spellsChamp used for conditions(parts)
            while (true) {
                if (count > 0) {
                    condition = condition.Condition; //recursive def 
                    j++; //increments index of part 
                    if (condition == null) //breaks if the next part doesnt exist
                        break;
                    type = condition.type;
                }
                if (condition.TickRate == null) { //not a DoT ability
                    if (j == 0) { //assigns to pre-existing index
                        totalDamage[i][0][0] = calculateSpell(champA, champD, condition, level,w);
                    }
                    else //index doesn't exist -- dynamic array
                        totalDamage[i].push([calculateSpell(champA, champD, condition, level,w)]);
                }
                else { //DoT ability
                    if (j==0) { // pre-existing index 
                        /**
                         * 0 = native damage / tick rate
                         * 1 = tick rate
                         * 2 = damage / second
                         * 3 = total duration
                         * 4 = total damage 
                         */
                        damageOverTime[i][0][0] = calculateSpell(champA, champD, condition, level,w);
                        damageOverTime[i][0][1] = condition.TickRate;
                        damageOverTime[i][0][2] = damageOverTime[i][0][0] /damageOverTime[i][0][1];
                        damageOverTime[i][0][3] = condition.Time;
                        if (damageOverTime[i][0][3] != 50) 
                            damageOverTime[i][0][4] = damageOverTime[i][0][2] * damageOverTime[i][0][3];
                        else 
                            damageOverTime[i][0][4] = undefined;
                    }
                    else { //push if more than one DoT condition
                        if (damageOverTime[i][j-1] == undefined) { //lazy solution to everything
                            for (let m = 0; m < j; m++)
                                if (damageOverTime[i][m] == undefined)
                                    damageOverTime[i][m] = [0];
                        }
                        damageOverTime[i].push([calculateSpell(champA, champD, condition, level,w)]);
                        damageOverTime[i][j].push(condition.TickRate);
                        damageOverTime[i][j].push(damageOverTime[i][j][0] /damageOverTime[i][j][1]);
                        damageOverTime[i][j].push(condition.Time);
                        if (damageOverTime[i][j][3] != 50) 
                            damageOverTime[i][j].push(damageOverTime[i][j][2] * damageOverTime[i][j][3]);
                        else 
                            damageOverTime[i][j].push(undefined);
                    }
                }
                count++;

            //Sorts type and sends to calculate based on resistances
            if (condition.TickRate == null) { //burst
                totalDamage[i][j][0] = sortType(totalDamage[i][j][0],type,champD.armor,champD.mr)
            }
            else {  //DoT
                    damageOverTime[i][j][0] = sortType(damageOverTime[i][j][0],type,champD.armor,champD.mr)
                    damageOverTime[i][j][2] = sortType(damageOverTime[i][j][2],type,champD.armor,champD.mr)
                    if (damageOverTime[i][j][4] != undefined) 
                        damageOverTime[i][j][4] = sortType(damageOverTime[i][j][4],type,champD.armor,champD.mr)
            }
            let count2 = 0; //checker for static array 
            let ampob = condition.amp; //recursive definition of amp (special effect multiplier like ahri e)
            while (condition.amp != undefined) { //if the amp exists
                if (count2 > 0) {
                    ampob = ampob.amp; //recursive definition
                    if (ampob == undefined) //breaks if next amp object doesnt exist
                        break;
                }
                if (ampob.statChange != undefined) { //stat change is defined 
                    if (ampob.statChange.percentileAD != undefined) { //percent AD increase (aatrox ex)
                        champA.baseAD *= 1+ampob.statChange.percentileAD[level[ampob.statChange.StatSpell-1]-1];
                        champA.bonusAD *= 1+ampob.statChange.percentileAD[level[ampob.statChange.StatSpell-1]-1];
                    }
                    if (ampob.statChange.flatADPerLevel != undefined) { //flat ad increase darius ex
                        champA.bonusAD += ampob.statChange.flatADPerLevel[champA.level-1];
                    }
                    if (ampob.statChange.flatBonusAD != undefined) { //flat bnus AD inc nocturne ex
                        if (ampob.statChange.flatBonusADScale != undefined) {
                            champA.bonusAD +=ampob.statChange.flatBonusADScale * (champA.bonusAD+champA.baseAD);
                        }
                        champA.bonusAD += ampob.statChange.flatBonusAD[level[ampob.statChange.ADSpell]-1];
                    }
                    if (ampob.statChange.flatBonusAP != undefined) {
                        champA.bonusAP += ampob.statChange.flatBonusAP[level[ampob.statChange.APSpell]-1];
                    }
                    if (ampob.statChange.TickRate == undefined) { //calculates dmg 
                        totalDamage[i][j].push(sortType(calculateSpell(champA,champD,ampob.statChange,level,w),ampob.statChange.type,champD.armor,champD.mr));
                    }
                    else { //calculates DoT
                        damageOverTime[i].push([sortType(calculateSpell(champA,champD,ampob.statChange,level,w),ampob.statChange.type,champD.armor,champD.mr)]);
                        damageOverTime[i][j+1].push(ampob.statChange.TickRate);
                        damageOverTime[i][j+1].push(damageOverTime[i][j+1][0] /damageOverTime[i][j+1][1]);
                        damageOverTime[i][j+1].push(ampob.statChange.Time);
                        if (damageOverTime[i][j+1][3] != 50) 
                            damageOverTime[i][j+1].push(damageOverTime[i][j+1][2] * damageOverTime[i][j+1][3]);
                        else 
                            damageOverTime[i][j+1].push(undefined);
                    }
                    if (ampob.statChange.flatBonusAP != undefined) {
                        champA.bonusAP -= ampob.statChange.flatBonusAP[level[ampob.statChange.APSpell]-1];
                    }
                    if (ampob.statChange.flatBonusAD != undefined) { //flat bnus AD inc nocturne ex
                        champA.bonusAD -= ampob.statChange.flatBonusAD[level[ampob.statChange.ADSpell]-1];
                        if (ampob.statChange.flatBonusADScale != undefined) {
                            champA.bonusAD -=ampob.statChange.flatBonusADScale * (champA.baseAD);
                            champA.bonusAD /= (1+ampob.statChange.flatBonusADScale);
                        }
                    }
                    if (ampob.statChange.percentileAD !=undefined) { //undoes percent ad change
                        champA.baseAD /= 1+ampob.statChange.percentileAD[level[ampob.statChange.StatSpell-1]-1];
                        champA.bonusAD /= 1+ampob.statChange.percentileAD[level[ampob.statChange.StatSpell-1]-1];
                    }
                    if (ampob.statChange.flatADPerLevel != undefined) { //undoes flat ad change
                        champA.bonusAD -= ampob.statChange.flatADPerLevel[champA.level-1]
                    }
                }
                if (ampob.flatAmp != undefined) { //flat bonus damage (eve e)
                    if (ampob.flatAmp.TickRate == undefined)
                        totalDamage[i][j].push(sortType(calculateSpell(champA,champD,ampob.flatAmp,level,w),ampob.flatAmp.type,champD.armor,champD.mr));
                    else {
                        damageOverTime[i].push([sortType(calculateSpell(champA,champD,ampob.flatAmp,level,w),ampob.flatAmp.type,champD.armor,champD.mr)]);
                        damageOverTime[i][j+1].push(ampob.flatAmp.TickRate);
                        damageOverTime[i][j+1].push(damageOverTime[i][j+1][0] /damageOverTime[i][j+1][1]);
                        damageOverTime[i][j+1].push(ampob.flatAmp.Time);
                        if (damageOverTime[i][j+1][3] != 50) 
                            damageOverTime[i][j+1].push(damageOverTime[i][j+1][2] * damageOverTime[i][j+1][3]);
                        else 
                            damageOverTime[i][j+1].push(undefined);
                    }
                }
                if (ampob.ampMult != undefined) { //multiplier damage (ahri e)
                    if (condition.TickRate == null)
                        totalDamage[i][j].push(totalDamage[i][j][0]*ampob.ampMult.value);
                    else {
                        damageOverTime[i].push([damageOverTime[i][0][0]*ampob.ampMult.value]);
                        damageOverTime[i][j+1].push(condition.TickRate);
                        damageOverTime[i][j+1].push(damageOverTime[i][j+1][0] /damageOverTime[i][j+1][1]);
                        damageOverTime[i][j+1].push(condition.Time);
                        if (damageOverTime[i][j+1][3] != 50) 
                            damageOverTime[i][j+1].push(damageOverTime[i][j+1][2] * damageOverTime[i][j+1][3]);
                        else 
                            damageOverTime[i][j+1].push(undefined);
                    }
                    if (ampob.ampMult.statChange != undefined) { //stat change w/ amp 
                        /*
                        hasn't been bug tested
                        */
                        if (ampob.ampMult.statChange.percentileAD != undefined) {
                            champA.baseAD *= 1+ampob.ampMult.statChange.percentileAD[level[ampob.statChange.StatSpell-1]-1];
                            champA.bonusAD *= 1+ampob.ampMult.statChange.percentileAD[level[ampob.statChange.StatSpell-1]-1];
                        }
                        if (ampob.ampMult.statChange.flatADPerLevel != undefined) {
                            champA.bonusAD += ampob.ampMult.statChange.flatADPerLevel[champA.level-1];
                        }
                        if (ampob.ampMult.statChange.TickRate == undefined) {
                            totalDamage[i][j].push(ampob.ampMult.value*sortType(calculateSpell(champA,champD,ampob.ampMult.statChange,level,w),ampob.ampMult.statChange.type,champD.armor,champD.mr));
                        }
                        else {
                            damageOverTime[i].push([ampob.ampMult.value*sortType(calculateSpell(champA,champD,ampob.ampMult.statChange,level,w),ampob.ampMult.statChange.type,champD.armor,champD.mr)]);
                            damageOverTime[i][j+1].push(ampob.statChange.TickRate);
                            damageOverTime[i][j+1].push(damageOverTime[i][j+1][0] /damageOverTime[i][j+1][1]);
                            damageOverTime[i][j+1].push(ampob.statChange.Time);
                            if (damageOverTime[i][j+1][3] != 50) 
                                damageOverTime[i][j+1].push(damageOverTime[i][j+1][2] * damageOverTime[i][j+1][3]);
                            else 
                                damageOverTime[i][j+1].push(undefined);
                        }
                        if (ampob.ampMult.statChange.percentileAD !=undefined) {
                            champA.baseAD /= 1+ampob.ampMult.statChange.percentileAD[level[ampob.statChange.StatSpell-1]-1];
                            champA.bonusAD /= 1+ampob.ampMult.statChange.percentileAD[level[ampob.statChange.StatSpell-1]-1];
                        }
                        if (ampob.ampMult.statChange.flatADPerLevel != undefined) {
                            champA.bonusAD -= ampob.ampMult.statChange.flatADPerLevel[champA.level-1]
                        }
                    }
                }
                count2++;
            }
        }
    }
        else {
            spell = champA.abilities[i-1];
            spellEffect = spell.effect[1]; //base value
            spellVar = spell.vars; // scaling value

        // type of damage
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
                    let damage = spellEffect[level[i-1]-1] + champA.bonusAP*spellVar[0].coeff;
                    totalDamage[i][0][0] += calculateDMG(damage,champD.mr,0,0);
                } else if (type == 2) {
                    if (spellVar.length === 0) {
                        exceptions.push(spell);
                        break;
                    }

                    totalDamage[i][0][0] += spellEffect[level[i-1]-1] + champA.bonusAP*spellVar[0].coeff;
                } else if (type == 0) { 
                    if (spellVar.length === 0) {
                        exceptions.push(spell);
                        break;
                    }

                    let damage = spellVar[0].coeff * (champA.baseAD+champA.bonusAD);
                    // or let damage = spellVar[0].coeff * (champA.bonusAD) for bonus AD scaling
                    // have to implement this
                    totalDamage[i][0][0] += calculateDMG(damage,champD.armor,0,0);
                }
            }
        }
    }   
    //aa dmg calculator (needs to factor in abilities that steroid ex trist q)
    aaDMG = (champA.baseAD + champA.bonusAD) * (1+champA.critMult)*(champA.crit+1);
    damageOverTime[5][0][0] = aaDMG; //dmg per aa
    aaDMG = aaDMG* champA.atkSpeed*(1+champA.bAtkSpeed);
    damageOverTime[5][0][1] = (1/(champA.atkSpeed*(1+champA.bAtkSpeed))); //tick rate 
    damageOverTime[5][0][2] = aaDMG * damageOverTime[5][0][1]; //dmg per second
    damageOverTime[5][0][3] = 50;
    damageOverTime[5][0][4] = undefined;

    //no 'total damage' value

   console.log(totalDamage);
   console.log(damageOverTime);
   return combinedDamage;
}

/** type sorter
 * @param totalDamage/tickDamage 
 * @param allresists self-explanatory
 */
function sortType(damage, type, armor, mr) {
    if (type == 0) //phys dmg
        return calculateDMG(damage, armor, 0, 0);
    else if (type == 1) //magic damage
        return calculateDMG(damage, mr, 0, 0);
    else if (type == 2) //true damage
        return damage;
    else if (type == undefined) //too lazy to fix if type isn't defined 
        return damage;
}

/**
 * calculates damage done based on reduction
 * @param damage
 * @param reduction -- mr / armor
 * @param penetration -- mag pen, arm pen, leth 
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
 * Calculates spell damage with scaling values and stuff
 * @param {} tooltip 
 */
function calculateSpell(champA, champD, spellsChampSpell, level, w) {
    let totalDamage = 0;

    //enemy max hp scale

    if (spellsChampSpell.targetHPScale != null) {
        if (spellsChampSpell.targetHPScalePerLevel != null) {
            if (spellsChampSpell.targetHPScalePerLevel.length == 18) 
                totalDamage += (champD.health)*(spellsChampSpell.targetHPScale + spellsChampSpell.targetHPScalePerLevel[champA.level]);
            else
                totalDamage += (champD.health)*(spellsChampSpell.targetHPScale + spellsChampSpell.targetHPScalePerLevel * champA.level);
        }
        else {
            if (spellsChampSpell.targetHPScale.length == undefined) {
                if (spellsChampSpell.targetHPScalePer100AP == null) 
                    totalDamage += (champD.health)*(spellsChampSpell.targetHPScale);
                else 
                    totalDamage += (champD.health)*(spellsChampSpell.targetHPScale + (spellsChampSpell.targetHPScalePer100AP*(Math.floor(champA.bonusAP/100))));
            }
            else {
                if (spellsChampSpell.targetHPScalePer100AP == null && spellsChampSpell.targetHPScalePer100BAD == null && spellsChampSpell.targetHPScalePer100AD == null && spellsChampSpell.targetHPScalePer35BAD == null)
                    totalDamage += (champD.health)*(spellsChampSpell.targetHPScale[level[w]-1]);
                else if (spellsChampSpell.targetHPScalePer100AD != null) 
                    totalDamage += (champD.health)*(spellsChampSpell.targetHPScale[level[w]-1] + (spellsChampSpell.targetHPScalePer100AD*(Math.floor((champA.bonusAD + champA.baseAD)/100))));
                else if (spellsChampSpell.targetHPScalePer100AP != null)
                    totalDamage += (champD.health)*(spellsChampSpell.targetHPScale[level[w]-1] + (spellsChampSpell.targetHPScalePer100AP*(Math.floor(champA.bonusAP/100))));
                else if (spellsChampSpell.targetHPScalePer100BAD != null)
                    totalDamage += (champD.health)*(spellsChampSpell.targetHPScale[level[w]-1] + (spellsChampSpell.targetHPScalePer100BAD*(Math.floor(champA.bonusAD/100))));
                else 
                    totalDamage += (champD.health)*(spellsChampSpell.targetHPScale[level[w]-1] +  spellsChampSpell.targetHPScalePer35BAD*(Math.floor(champA.bonusAD/35)))
            }
        }
    }
    //my max hp scale

    if (spellsChampSpell.myHPScale != null) {
        if (spellsChampSpell.myHPScalePerLevel == null) {
            if (spellsChampSpell.myHPScalePer100BAD != null)
                totalDamage += (champA.health)*(spellsChampSpell.myHPScale + (spellsChampSpell.myHPScalePer100BAD*(Math.floor(champA.bonusAD/100))));
            else
                totalDamage += (champA.health)*(spellsChampSpell.myHPScale);
        }
        else {
            totalDamage += (champA.health)*(spellsChampSpell.myHPScale + spellsChampSpell.myHPScalePerLevel * champA.level);
        }
    }

    if (spellsChampSpell.myBonusHPScale != null) {
        totalDamage += (champA.bonushealth)*(spellsChampSpell.myBonusHPScale);
    }

    if (spellsChampSpell.ManaScale) {
        totalDamage += (spellsChampSpell.ManaScale * champA.mana);
    }

    // bonus AD scale 
    if (spellsChampSpell.BADScale != null) {
        if (spellsChampSpell.ADDamage != null) {
            if (spellsChampSpell.ADDamage.length != 18) {
                if (spellsChampSpell.BADScale.length == undefined) {
                    totalDamage += (spellsChampSpell.ADDamage[level[w]-1]+(spellsChampSpell.BADScale*(champA.bonusAD)));
                }
                else 
                    totalDamage += (spellsChampSpell.ADDamage[level[w]-1]+(spellsChampSpell.BADScale[level[w]-1]*(champA.bonusAD)));
            }
            else 
                totalDamage += spellsChampSpell.ADDamage[champA.level-1] + (spellsChampSpell.BADScale*(champA.bonusAD))
        }
        else 
            totalDamage+= spellsChampSpell.BADScale*(champA.bonusAD)
    }

    // total AD Scale 
    if (spellsChampSpell.ADScale != null) {
        if (spellsChampSpell.ADDamage != null) {
            if (spellsChampSpell.ADDamage.length != 18) {
                if (spellsChampSpell.ADScale.length == undefined) {
                    totalDamage += (spellsChampSpell.ADDamage[level[w]-1]+(spellsChampSpell.ADScale*(champA.bonusAD+champA.baseAD)));
                }
                else 
                    totalDamage += (spellsChampSpell.ADDamage[level[w]-1]+(spellsChampSpell.ADScale[level[w]-1]*(champA.bonusAD+champA.baseAD)));
            }
            else {
                if (spellsChampSpell.ADScale.length != 18) 
                    totalDamage += spellsChampSpell.ADDamage[champA.level-1] + (spellsChampSpell.ADScale*(champA.bonusAD+champA.baseAD));
                else 
                    totalDamage += spellsChampSpell.ADDamage[champA.level-1] + (spellsChampSpell.ADScale[champA.level-1]*(champA.bonusAD+champA.baseAD));
            }
        }
        else { 
            if (spellsChampSpell.ADScale.length != 18) {
                if (spellsChampSpell.ADScale.length!= undefined) 
                    totalDamage+= spellsChampSpell.ADScale[level[w]-1]*(champA.bonusAD+champA.baseAD);
                else
                    totalDamage+= spellsChampSpell.ADScale*(champA.bonusAD+champA.baseAD);
            } else
                totalDamage+= spellsChampSpell.ADScale[champA.level-1]*(champA.bonusAD+champA.baseAD);
        }
    }

    //aatrox  q
    if (spellsChampSpell.FirstADScale != null) {
        totalDamage += (spellsChampSpell.FirstCast[level[w]-1]+(spellsChampSpell.FirstADScale[level[w]-1]*(champA.bonusAD+champA.baseAD)));
    }

    // AP Scale
    if (spellsChampSpell.APScale !=null) {
        if (spellsChampSpell.APDamage != null) {
            if (spellsChampSpell.APDamage.length != 18) {
                if (spellsChampSpell.APScale.length == undefined) {
                    if (spellsChampSpell.APDamageBasedOnOtherAbility != undefined) {
                        totalDamage += spellsChampSpell.APDamage[level[w]-1]+spellsChampSpell.APScale*(champA.bonusAP) + spellsChampSpell.APDamageBasedOnOtherAbility[level[spellsChampSpell.OtherAbility]-1];
                        console.log(spellsChampSpell.APDamageBasedOnOtherAbility)
                    }
                    else
                        totalDamage += (spellsChampSpell.APDamage[level[w]-1]+(spellsChampSpell.APScale*(champA.bonusAP)));
                }
                else
                    totalDamage += (spellsChampSpell.APDamage[level[w]-1]+(spellsChampSpell.APScale[level[w]-1]*(champA.bonusAP)));
            }
            else {
                if (spellsChampSpell.APScale.length!= 18) {
                    if (spellsChampSpell.APDamageBasedOnOtherAbility != undefined) {
                        totalDamage += spellsChampSpell.APDamage[champA.level-1]+spellsChampSpell.APScale*(champA.bonusAP) + spellsChampSpell.APDamageBasedOnOtherAbility[level[spellsChampSpell.OtherAbility]-1];
                    }
                    else if (spellsChampSpell.BonusAPDamage != undefined) 
                        totalDamage += spellsChampSpell.APDamage[champA.level-1]+spellsChampSpell.APScale*(champA.bonusAP) + spellsChampSpell.BonusAPDamage[level[w]-1];
                    else 
                        totalDamage += spellsChampSpell.APDamage[champA.level-1]+spellsChampSpell.APScale*(champA.bonusAP);
                }
                else 
                    totalDamage += spellsChampSpell.APDamage[champA.level-1]+spellsChampSpell.APScale[champA.level-1]*(champA.bonusAP);
            }
        }
        else { 
            totalDamage += spellsChampSpell.APScale*(champA.bonusAP);
            if (spellsChampSpell.APDamageBasedOnOtherAbilityPercentile != null) 
                totalDamage *= spellsChampSpell.APDamageBasedOnOtherAbilityPercentile[level[spellsChampSpell.OtherAbility]-1];
        }
    }
        return totalDamage;
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
    let x = document.getElementById("champ-input-list-one").value;
    let att_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/' + x + '.json');
    let champ = att_champ[x];
    let champA = {
        passive: champ.passive.image.full,
        type: 0, //0 = burst, 1 = adc, 2 = dps not ADC, 3 = else
        abilities: champ.spells,
        level: document.getElementById("champ-level-list-one").value,
        bonusArmor: 0,
        bonusMR: 0,
        mana: 0,
        baseAD: 0,
        bonusAD: 0,
        crit: 0, //crit chance
        critMult: 0,  //IE = .5
        atkSpeed: 0,
        bAtkSpeed: 0,
        bonusAP: 0,
        lvlOfspell: [1,1,1,1],
        item: 0, //not coded yet 
        health: 0,
        bonushealth: 0,
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
    let y = document.getElementById("champ-input-list-two").value;
    let def_champ = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/' + y + '.json');
    let champ = def_champ[y];

    let champD = { // abilities and runes
        level: document.getElementById("champ-level-list-two").value,
        abilities: champ.abilities,
        armor: 0,
        bonusArmor: 0,
        bonusMR: 0,
        health: 0,
        bonushealth: 0,
        mana: 0,
        mr: 0,
        item: getChampionTwoItems(), 
        dmg_reduc: 0,
        hpregen: 0,
        bonusAP: 0,
        baseAD: 0,
        bonusAD: 0,
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
            champion.bonushealth += itemWanted.FlatHPPoolMod;
        }
        if (itemWanted.FlatArmorMod != null) {
            champion.armor += itemWanted.FlatArmorMod;
            champion.bonusArmor += itemWanted.FlatArmorMod;
        }       
        if (itemWanted.FlatSpellBlockMod != null) {
            champion.mr += itemWanted.FlatSpellBlockMod;
            champion.bonusMr += itemWanted.FlatArmorMod;
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
