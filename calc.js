import { spellDamage } from "./Champions.js";
import { getDefChamp, getAtkChamp } from "./Champions.js";
import { renderRunes } from "./runes.js";
import { damageColumn, showDamage, renderAbilityDamageButtons } from "./damage.js";
import { getChamps } from "./main.js";
//s
const $root = $("#root");
const $champs = $("#input-champs");
let champions;
let itemIdsOne=[];
let itemIdsTwo=[]
let spellPointsOne = 1;
let spellPointsTwo = 1;
let damage;
let clicked = false;


/**
 * Renders the two champion lists
 */
function renderChampLists() {
    let holdOne = `
        <div id="champ-one" class="column">
            <input value="Ahri" class="champ-input" id="champ-input-list-one" type="text" list="champions-one"/>
            <datalist id="champions-one">
                ${createChampionList()}
            </datalist>    
        </div>`;

    let holdTwo = ` <div id="champ-two" class="column">
            <input value="Ahri" class="champ-input" id="champ-input-list-two" type="text" list="champions-two" />
            <datalist id="champions-two">
                ${createChampionList()}
            </datalist>
        </div>`;
    

    $(`#champ-name-one`).append(holdOne); 
    $(`#champ-name-two`).prepend(holdTwo); 

    $(function(ready){
        $('#champ-input-list-one').change(function() {
            championChangeStats("one");
            //getAbilities("one");
            damage = spellDamage();
            damageColumn();
            showDamage();

        });

        $('#champ-input-list-one').on("click", function() {
            this.value="";
        });

        $('#champ-input-list-two').on("click", function() {
            this.value="";
        });

        $('#champ-input-list-two').change(function() {
            championChangeStats("two");
            //getAbilities("two");
            damage = spellDamage();
        });

        $('#champ-level-list-one').change(function() {
            if (this.value <= 0) {
                alert("Your level cannot be below zero");
                this.value = 1;
            } else if (this.value > 18) {
                alert("Maximum possible level is 18");
                this.value = 18;
            }
            spellPointsOne = this.value;
            championChangeStats("one");
        });

        $('#champ-level-list-two').change(function() {
            if (this.value <= 0) {
                alert("Your level cannot be below zero");
                this.value = 1;
            } else if (this.value > 18) {
                alert("Maximum possible level is 18");
                this.value = 18;
            }
            spellPointsTwo = this.value;
            championChangeStats("two");
        });
    });

}


/**
 * Handles Damage Calculator button press
 */
$('#calc-button').on('click', function(e) {    
    $("#live-game-button").removeClass('disable');
    $(this).addClass('disable');
    $("#live-game").remove();
    if (!clicked) {
        $("#live-game").remove();
        $("#name-inputbox").remove();
        // document.getElementById("champ-name-one").innerHTML = "Ahri";
        // document.getElementById("champ-name-two").innerHTML = "Ahri";
        levelChange("one");
        levelChange("two");
        renderChampLists();
        renderItemChoices("one");
        renderItemChoices("two");
        renderRunesAndStatsButton("one");
        renderRunesAndStatsButton("two");
        renderAbilityDamageButtons();
        championChangeStats("one");
        championChangeStats("two");
        $(`#P-damage`).addClass("damage");
        $(`#Q-damage`).addClass("damage");
        $(`#W-damage`).addClass("damage");
        $(`#E-damage`).addClass("damage");
        $(`#R-damage`).addClass("damage");
        $("#bottom-one").addClass("stats-and-runes");
        $("#bottom-two").addClass("stats-and-runes");
        $("#champ-column-one").addClass("champ-column");
        $("#champ-column-two").addClass("champ-column");
        $("#stats-button-one").addClass("clicked");
        $("#stats-button-two").addClass("clicked");

        $("#champ-one-item-0").addClass("item");
        $("#champ-one-item-1").addClass("item");
        $("#champ-one-item-2").addClass("item");
        $("#champ-one-item-3").addClass("item");
        $("#champ-one-item-4").addClass("item");
        $("#champ-one-item-5").addClass("item");

        $("#champ-two-item-0").addClass("item");
        $("#champ-two-item-1").addClass("item");
        $("#champ-two-item-2").addClass("item");
        $("#champ-two-item-3").addClass("item");
        $("#champ-two-item-4").addClass("item");
        $("#champ-two-item-5").addClass("item");

        //getAbilities("one");
        //getAbilities("two");
        clicked = true;
    } else {
        $root.append(getChamps());
    }
    e.preventDefault();
});




/**
 * Gets the list of champions
 */
function createChampionList() {
    let temp = "";
    let champs = $.getValues('http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion.json');
    champions = Object.keys(champs);
    for (let i =0; i < champions.length; i++) {
        if (champions[i] != "MonkeyKing") {
            temp += `<option>${champions[i]}</option>`;
        } 
        
        if (champions[i] == "Warwick") {
            temp += `<option>${champions[i]}</option>`;
            temp += `<option> Wukong </option>`;
        }
    }
    return temp;
}

function levelChange(num) {
    const $stats = $("#champ-stats-" + num);
    $(`#level-` + num).remove();

    let hold = `
        <div id="input-level-${num}">
            <label> Level: </label>
            <input class="level-input" id="champ-level-list-${num}" value=1 type="text"/>
        </div>
    `;
    $stats.prepend(hold);
}

function championChangeStats(num) {
    let x = document.getElementById("champ-input-list-" + num).value;
    if (x == "Wukong") {
        x = "MonkeyKing";
    }
    document.getElementById("image-" + num).src = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${x}_0.jpg`;
    //document.getElementById("champ-name-" + num).innerHTML = x;

    if (num == "one") {
        let champA = getAtkChamp();
        //console.log(champA);
        document.getElementById("HP-" + num).innerHTML = "HP: " + champA.health;
        document.getElementById("MP-" + num).innerHTML = "MP: " + champA.mana;
        document.getElementById("AD-" + num).innerHTML = "AD: " + (champA.baseAD + champA.bonusAD);
        document.getElementById("AP-" + num).innerHTML = "AP: " + champA.bonusAP;
        document.getElementById("MR-" + num).innerHTML = "MR: " + champA.mr;
        document.getElementById("armor-" + num).innerHTML = "Armor: " + champA.armor;
    }
    else if (num == "two") {
        let champD = getDefChamp();
        //console.log(champD);
        document.getElementById("HP-" + num).innerHTML = "HP: " + champD.health;
        document.getElementById("MP-" + num).innerHTML = "MP: " + champD.mana;
        document.getElementById("AD-" + num).innerHTML = "AD: " + (champD.baseAD + champD.bonusAD);
        document.getElementById("AP-" + num).innerHTML = "AP: " + champD.bonusAP;
        document.getElementById("MR-" + num).innerHTML = "MR: " + champD.mr;
        document.getElementById("armor-" + num).innerHTML = "Armor: " + champD.armor;
    }
}

jQuery.extend({
    getValues: function(url) {
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
    }
});

/**
 * Renders the abilities of the champs  
 */
export function getAbilities(num){
    $(`#champ-spell-${num}`).remove();
    let x = document.getElementById("champ-name-" + num).textContent;
    let champ = $.getValues(`http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/${x}.json`);
   
    const $champPics = $(`#champ-pictures-${num}`);
    let y = champ[x].spells;
    let spells = "";
    let levels = "";
    for (let i = 0; i < 4; i++) {
        spells += `
        <div class="column is-narrow spells">
            <image class="clickable ability" id="champ-spell-${i}-${num}" width=32px length=32px src="http://ddragon.leagueoflegends.com/cdn/10.10.3216176/img/spell/${y[i].id}.png"> </image>
        
            <div>
                <label id="champ-spell-level-${i}-${num}"> 0 </label>
            </div>
        </div>
        
        `;
    }

    
    // for (let i = 0; i < 4; i++) {
    //     levels += ;
    // }


    let hold = ` 
    <div class="columns is-gapless" id="champ-spell-${num}">
        <div class="column is-narrow spells">
            <image class="ability" width=32px length=32px src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/passive/${champ[x].passive.image.full}"> </image>
        </div>    
        ${spells}

        <div>
            ${levels}
        </div>

    </div>
    `;
    $champPics.append(hold);
    increaseSpellLevel(0 , num);
    increaseSpellLevel(1 , num);
    increaseSpellLevel(2 , num);
    increaseSpellLevel(3 , num);
}

function increaseSpellLevel(i, num) {
    $(`#champ-spell-${i}-${num}`).mousedown(function(event) {
        switch (event.which) {
            case 1: 
            if (document.getElementById(`champ-spell-level-${i}-${num}`).innerHTML == 5) {
                alert("Left: " + "You cannot level up this spell anymore");
            } else if (i == 3 && document.getElementById(`champ-spell-level-${i}-${num}`).innerHTML == 3) {
                alert("Left: " + "You cannot level up this spell anymore");
            } else if (spellPointsOne == 0 || spellPointsTwo == 0) {
                alert("You have no spell points to level up any spells");
            } else {
                document.getElementById(`champ-spell-level-${i}-${num}`).innerHTML++;
                if (num == "one")
                    spellPointsOne--;
                else if (num == "two")
                    spellPointsTwo--;
            }
                break;
            case 3: 
            if (document.getElementById(`champ-spell-level-${i}-${num}`).innerHTML == 0) {
                alert("Right: " + "you cannot level down anymore");
            }
            else {
                document.getElementById(`champ-spell-level-${i}-${num}`).innerHTML--;
                if (num == "one")
                    spellPointsOne++;
                else if (num == "two")
                    spellPointsTwo++;   
            }
            break;
        }
    });
}


/**
 * Render the item input box 
 */
export function getItemsList(num) {
    const $champPics = $(`#champ-items-button-${num}`);
    let temp = "";
    let item = $.getValues("http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/item.json");
    let items = Object.keys(item);
    for (let i = 0; i < items.length; i++) {
        temp += `<option>${item[items[i]].name}</option>`;
    }

    let itemInput = `
    <input style="margin-bottom:10px" id="item-input-list-${num}" type="text" list="items-${num}"/>
        <datalist id="items-${num}">
            ${temp}
        </datalist> 
    `;
    $champPics.append(itemInput);


    $(function(ready){
        $(`#item-input-list-${num}`).change(function() {
            let selectedItem = document.getElementById("item-input-list-" + num).value;
            makeItemImages(selectedItem, item, items, num);
            $(`#item-input-list-${num}`).remove();
            renderItemChoices(num);
        });
    });
}

/**
 * Render the image of the items onscreen
 */
function makeItemImages(item, array1, array2, num) {
    $(`.pic-${num}`).remove();
    const $champPics = $(`#champ-items-${num}`);
    let id;
    let imgOne="";
    let imgTwo="";
    for (let i = 0; i < array2.length; i++) {
        if (array1[array2[i]].name === item) {
            id = array2[i];
        }
    }

    if (num === "one") {
        //for (let i = 0; i < itemIdsOne.length; i++) {
            //console.log(`champ-${num}-item` + i);
            for (let i = 0; i < 6; i++) {
                if (document.getElementById(`champ-${num}-item-` + i).getAttribute("data-userid") == "no") {
                    if (itemIdsOne[i] == undefined) {
                        itemIdsOne[i] = id;
                    } else {
                        itemIdsOne.push(id);
                    }
                    console.log("zzz", itemIdsOne);
                    document.getElementById(`champ-${num}-item-` + i).src = `http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/${id}.png`;
                    document.getElementById(`champ-${num}-item-` + i).classList.add("clickable");
                    document.getElementById(`champ-${num}-item-` + i).setAttribute("data-userid", "yes");
                    removeImage("one", itemIdsOne, i);
                    break;
                }
            }
            // imgOne = `
            //     <img class="clickable pic-${num}" id="champ-one-${i}" src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/${itemIdsOne[i]}.png">
            // `;
            // $champPics.append(imgOne);
            
        //}
        championChangeStats("one");
        //console.log("Items add-", itemIdsOne);
     }
     
     else if (num === "two") {
        for (let i = 0; i < 6; i++) {
            if (document.getElementById(`champ-${num}-item-` + i).getAttribute("data-userid") == "no") {
                if (itemIdsTwo[i] == undefined) {
                    itemIdsTwo[i] = id;
                } else {
                    itemIdsOne.push(id);
                }
                //console.log("zzz", itemIdsOne);
                document.getElementById(`champ-${num}-item-` + i).src = `http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/${id}.png`;
                document.getElementById(`champ-${num}-item-` + i).classList.add("clickable");
                document.getElementById(`champ-${num}-item-` + i).setAttribute("data-userid", "yes");
                removeImage("two", itemIdsTwo, i);
                break;
            }
        }
        championChangeStats("two");
        //console.log("Items add-", itemIdsTwo);
    }

}

/**
 * Removes the images of the items by clicking on them
 */
function removeImage(num, array, i) {
    $(`#champ-${num}-item-${i}`).on('click', function(e) { 
        $(this).replaceWith(`<image data-userid="no" class="item" id="champ-${num}-item-${i}"></image>`);     
        
        delete array[i];
        console.log("items", array);
        // $(`.pic-${num}`).remove();
        //for (let j = 0; j < array.length; j++) {
            //document.getElementById(`champ-${num}-item-` + j).src = `http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/${array[i]}.png`;
            // imgOne = `
            //     <img class="pic-${num} clickable" id="champ-one-${j}" src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/${array[j]}.png">
            // `;
            //$champPics.append(imgOne);
            //removeImage(num, array, j);
        //}
        
        //console.log("Items delete- ", array);
        championChangeStats(num);
        e.preventDefault();
        //return true;
    });
}

//Render the Add Items button
function renderItemChoices(num){
    const $champPics = $(`#champ-items-button-${num}`);
    let hold = `<button id="add-item-button-${num}"> Add Item </button>`;
    $champPics.prepend(hold);



    /**
     * Handles Add Item button press
     */
    $(`#add-item-button-${num}`).on('click', function(e) {        
        $(`#add-item-button-${num}`).remove();
        getItemsList(num);
        e.preventDefault();
    });
}

function renderRunesAndStatsButton(num) {
    const $champPics = $(`#champ-buttons-${num}`);
    let statsDiv = "";
    let runesDiv = "";
    let clicked = false;
    let hold = `
    <div>
        <button class="s-r-button" id="stats-button-${num}"> Stats </button>

        <button class="s-r-button" id="runes-button-${num}"> Runes </button>
    </div>
    `;
    $champPics.append(hold)

    $(`#runes-button-${num}`).on('click', function(e) {      
        if (!clicked) {  
            renderRunes(num);
            clicked = true;
        }
        //statsDiv = $(`#champ-stats-${num}`).detach();
        //$champPics.append(runesDiv);
        $(`#bottom-${num}`).hide();
        $(`#runes-${num}`).show();
        $(`#stats-button-${num}`).removeAttr('disabled');
        $(this).attr('disabled', "disabled");
        $(this).addClass('clicked');
        $(`#stats-button-${num}`).removeClass('clicked');
        e.preventDefault();
    });

    $(`#stats-button-${num}`).on('click', function(e) {
        //$champPics.append(statsDiv)
        //runesDiv = $(`#runes-${num}`).detach();
        $(`#runes-${num}`).hide();
        $(`#bottom-${num}`).show();
        $(`#runes-button-${num}`).removeAttr('disabled');
        $(this).attr('disabled', "disabled");
        $(this).addClass("clicked");
        $(`#runes-button-${num}`).removeClass('clicked');
        e.preventDefault();
    });
    
}

//Gets the first champion's items
export function getChampOneItems(){
    return itemIdsOne;
}

//Gets the second champion's items
export function getChampionTwoItems(){
    return itemIdsTwo;
}

export function getDamage() {
    return damage;
}






