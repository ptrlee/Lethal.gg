import { getAtkChamp } from "./MathCalculation.js";
import { getDamage } from "./DamageCalculatorUI.js";
//s
export function damageColumn() {
    let atkChamp = getAtkChamp();
    document.getElementById("P-damage").innerHTML = `<image style="width:64px;height:64px;" src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/passive/${atkChamp.passive}"> </image>`;
    document.getElementById("Q-damage").innerHTML = `<image style="width:64px;height:64px;" src="http://ddragon.leagueoflegends.com/cdn/10.10.3216176/img/spell/${atkChamp.abilities[0].id}.png" > </image>`;
    document.getElementById("W-damage").innerHTML = `<image style="width:64px;height:64px;" src="http://ddragon.leagueoflegends.com/cdn/10.10.3216176/img/spell/${atkChamp.abilities[1].id}.png" > </image>`;
    document.getElementById("E-damage").innerHTML = `<image style="width:64px;height:64px;" src="http://ddragon.leagueoflegends.com/cdn/10.10.3216176/img/spell/${atkChamp.abilities[2].id}.png" > </image>`;
    document.getElementById("R-damage").innerHTML = `<image style="width:64px;height:64px;" src="http://ddragon.leagueoflegends.com/cdn/10.10.3216176/img/spell/${atkChamp.abilities[3].id}.png" > </image>`;
    
}

export function showDamage(){
    //0 - normal; 1 - Q + Amp; 2 - R-Q-Normal; 3 - R-Q-Amp

    $(`#P-ability-damage`).remove(); 
    $(`#Q-ability-damage`).remove(); 
    $(`#W-ability-damage`).remove(); 
    $(`#E-ability-damage`).remove(); 
    $(`#R-ability-damage`).remove(); 
    shortenedDamage("P", 0);
    shortenedDamage("Q", 1);
    shortenedDamage("W", 2);
    shortenedDamage("E", 3);
    shortenedDamage("R", 4);
}

function shortenedDamage(letter, num){
    $(`#${letter}-tick-damage`).remove(); 
    let x = document.getElementById("champ-name-one").innerHTML;
    let $letterDamage = $(`#${letter}-damage`);
    $letterDamage.append(`<div id="${letter}-ability-damage"></div>`);
    let $abDamage = $(`#${letter}-ability-damage`);
    let ldama = "";
    let totalDamage = getDamage()[0];
    let normalDamage = [];
    let ampDamage = [];
    let statChangeDamage = [];
    let combinedDamage = [];


    for (let i = 0; i < totalDamage[num].length; i++) {
            if (totalDamage[num][i].length == 1) {
                ldama += `<div> ${Math.round(totalDamage[num][i][0])} </div>`;
            } else {
                normalDamage.push(Math.round(totalDamage[num][i][0]));
                ampDamage.push(Math.round(totalDamage[num][i][1]));
                statChangeDamage.push(Math.round(totalDamage[num][i][2]));
                combinedDamage.push(Math.round(totalDamage[num][i][3]));
                 
            }
    }

    if (normalDamage.length != 0) {
        for (let i = 0; i < normalDamage.length; i++) {
            if (!isNaN(normalDamage[i])) {
                ldama += `<div> ${letter}${i + 1} ${Math.round(normalDamage[i])} </div>`;
            }
        }
    }

    if (ampDamage.length != 0) {
        for (let i = 0; i < ampDamage.length; i++) {
            if (!isNaN(ampDamage[i])) {
                if (x === "Aatrox") {
                    ldama += `<div> ${letter}${i + 1} Sweetspot: ${Math.round(ampDamage[i])} </div>`;
                } else if (x === "Ahri") {
                    ldama += `<div> ${letter}${i + 1} Charmed: ${Math.round(ampDamage[i])} </div>`;
                } else {
                    ldama += `<div> ${letter}${i + 1} ${Math.round(ampDamage[i])} </div>`;
                }
            }
        }
    }

    if (statChangeDamage.length != 0) {
        for (let i = 0; i < statChangeDamage.length; i++) {
            if (!isNaN(statChangeDamage[i])) {
                ldama += `<div> ${letter}${i + 1} ${Math.round(statChangeDamage[i])} </div>`;
            }
        }
    }

    if (combinedDamage.length != 0) {
        for (let i = 0; i < combinedDamage.length; i++) {
            if (!isNaN(combinedDamage[i])) {
                ldama += `<div> ${letter}${i + 1} ${Math.round(combinedDamage[i])} </div>`;
            }
        }
    }
    $abDamage.append(ldama);
}

function showTickDamage(array, letter, num) {
    //4 - total damage, 2 - tick rate, 3 - per sec, 1 - damage per tick
    $(`#${letter}-ability-damage`).remove();
    
    let $letterDamage = $(`#${letter}-damage`);
    $letterDamage.append(`<div id="${letter}-tick-damage"></div>`);
    let $tickDamage = $(`#${letter}-tick-damage`);
    if (array[num][0].length > 1) {
        $tickDamage.append(`<div>Total Damage: ${Math.round(array[num][0][4])}</div>`);
        $tickDamage.append(`<div>Damage per tick: ${Math.round(array[num][0][0])}</div>`);
        $tickDamage.append(`<div>Damage per second: ${Math.round(array[num][0][2])}</div>`);
        $tickDamage.append(`<div>Tickrate: ${array[num][0][1]}</div>`);
        $tickDamage.append(`<div>Time: ${array[num][0][3]}</div>`);
    } else {
        $tickDamage.append(`<div>N/A</div>`);
    }
}

export function renderAbilityDamageButtons() {
    const $damage = $("#ability-damage-buttons");
    let hold = `
    <button id="base-damage-button"> Base Damage </button>
    <button id="tick-damage-button"> Tick Damage </button>
    <button id="total-damage-button"> Total Damage </button>
    `;
    $damage.append(hold);

    $('#tick-damage-button').on('click', function(e) {    
        let DoT = getDamage()[1];    
        showTickDamage(DoT, "P", 0);
        showTickDamaqge(DoT, "Q", 1);
        showTickDamage(DoT, "W", 2);
        showTickDamage(DoT, "E", 3);
        showTickDamage(DoT, "R", 4);
        e.preventDefault();
    });

    $('#base-damage-button').on('click', function(e) {   
        showDamage()
       /*  shortenedDamage("P", 0);
        shortenedDamage("Q", 1);
        shortenedDamage("W", 2);
        shortenedDamage("E", 3);
        shortenedDamage("R", 4); */
        e.preventDefault();
    });
}