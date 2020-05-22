import { spellDamage } from "./Champions.js";
import { getDefChamp, getAtkChamp } from "./Champions.js";
import { renderRunes } from "./runes.js"

const $root = $("#root");
const $champs = $("#champs");
let champions;
let itemIdsOne=[];
let itemIdsTwo=[]

/**
 * Renders the two champion lists
 */
function renderChampLists() {
    let hold = `
    <div id="champ-lists" class=columns>
        <div id="champ-one" class="column">
            <input value="Ahri" id="champ-input-list-one" type="text" list="champions-one"/>
            <datalist id="champions-one">
                ${createChampionList()}
            </datalist>    
        </div>

        <div id="middle-ofchamps" class="column">
        </div>
        

        <div id="champ-two" class="column">
            <input value="Ahri" id="champ-input-list-two" type="text" list="champions-two" />
            <datalist id="champions-two">
                ${createChampionList()}
            </datalist>
        </div>
    </div>
    `;
    
    $root.append(hold);  

    $(function(ready){
        $('#champ-input-list-one').change(function() {
            championChangeStats("one");
            getAbilities("one");
            spellDamage();
            VSColumn();
        });

        $('#champ-input-list-one').on("click", function() {
            this.value="";
        });

        $('#champ-input-list-two').on("click", function() {
            this.value="";
        });

        $('#champ-input-list-two').change(function() {
            championChangeStats("two");
            getAbilities("two");
            spellDamage();
        });

        $('#champ-level-list-one').change(function() {
            championChangeStats("one");
        });

        $('#champ-level-list-two').change(function() {
            championChangeStats("two");
        });
    });

}


/**
 * Handles Damage Calculator button press
 */
$('#calc-button').on('click', function(e) {        
    $("#live-game").remove();
    $("#name-inputbox").remove();
    levelChange("one");
    levelChange("two");
    $("#live-game-button").removeAttr('disabled');
    $(this).attr('disabled', "disabled");
    renderChampLists();
    renderItemChoices("one");
    renderItemChoices("two");
    renderRunesAndStatsButton("one");
    renderRunesAndStatsButton("two")

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
        temp += `<option>${champions[i]}</option>`;
    }
    return temp;
}

function levelChange(num) {
    const $stats = $("#champ-stats-" + num);
    $(`#level-` + num).remove();

    let hold = `
        <div id="input-level-${num}">
            <label> Level: </label>
            <input placeholder="Enter Level" id="champ-level-list-${num}" value = 1 type="text"/>
        </div>
    `;
    $stats.prepend(hold);
}

function championChangeStats(num) {
    let x = document.getElementById("champ-input-list-" + num).value;
    document.getElementById("image-" + num).src = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${x}_0.jpg`;
    document.getElementById("champ-name-" + num).innerHTML = x;

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
    for (let i = 0; i < 4; i++) {
        spells += `<image width=32px length=32px src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/spell/${y[i].id}.png"> </image>`;
    }
    let hold = ` 
    <div id="champ-spell-${num}">
        <span>
        <image width=32px length=32px src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/passive/${champ[x].passive.image.full}"> </image>
            ${spells}
        </span>
    </div>
    `;
    $champPics.append(hold);
}

function VSColumn() {
    $(`champ-spell-middle`).remove();
    let x = document.getElementById("champ-name-one").textContent;
    let champ = $.getValues(`http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/${x}.json`);
   
    let y = champ[x].spells;
    
    let spells = ["","","",""];
    for (let i = 0; i < 4; i++) {
        spells[i] += `<image class=dumbocss width=48px length=48px src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/spell/${y[i].id}.png"> </image>`;
    }
    let hold = `
        <div>
            <image class=dumbocss width=48px length=48px src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/passive/${champ[x].passive.image.full}"> </image>\
            <div>${spells[0]}</div>
            <div>${spells[1]}</div>
            <div>${spells[2]}</div>
            <div>${spells[3]}</div>
        </div>
    `;

    $("#dumbocss5123").append(hold)
}


/**
 * Render the item input box 
 */
export function getItemsList(num) {
    const $champPics = $(`#champ-pictures-${num}`);
    let temp = "";
    let item = $.getValues("http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/item.json");
    let items = Object.keys(item);
    for (let i =0; i < items.length; i++) {
        
        temp += `<option>${item[items[i]].name}</option>`;
    }

    let itemInput = `
    <input id="item-input-list-${num}" type="text" list="items-${num}"/>
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
    const $champPics = $(`#champ-pictures-${num}`);
    let id;
    let imgOne="";
    let imgTwo="";
    for (let i = 0; i < array2.length; i++) {
        if (array1[array2[i]].name === item) {
            id = array2[i];
        }
    }

    if (num === "one") {
        itemIdsOne.push(id);
        for (let i = 0; i < itemIdsOne.length; i++) {
            imgOne = `
                <img class="clickable pic-${num}" id="champ-one-${i}" src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/${itemIdsOne[i]}.png">
            `;
            $champPics.append(imgOne);
            removeImage("one", itemIdsOne, i);
        }
        championChangeStats("one");
        //console.log("Items add-", itemIdsOne);
     }
     
     else if (num === "two") {
        itemIdsTwo.push(id);
        for (let i = 0; i < itemIdsTwo.length; i++) {
            imgTwo = `
                <img class="clickable pic-${num}" id="champ-two-${i}" src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/${itemIdsTwo[i]}.png">
            `;
            $champPics.append(imgTwo);
            removeImage("two", itemIdsTwo, i);
        }
        championChangeStats("two");
        //console.log("Items add-", itemIdsTwo);
    }

}

/**
 * Removes the images of the items by clicking on them
 */
function removeImage(num, array, i) {
    const $champPics = $(`#champ-pictures-${num}`);
    let imgOne="";
    $(`#champ-${num}-${i}`).on('click', function(e) {   
        this.remove();     
        array.splice(i, 1);
        $(`.pic-${num}`).remove();
        for (let j = 0; j < array.length; j++) {
            imgOne = `
                <img class="pic-${num}" id="champ-one-${j}" src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/${array[j]}.png">
            `;
            $champPics.append(imgOne);
            removeImage(num, array, j);
        }

        //console.log("Items delete- ", array);
        championChangeStats(num);
        e.preventDefault();
        return true;
    });
}

//Render the Add Items button
function renderItemChoices(num){
    const $champPics = $(`#champ-stats-${num}`);
    let hold = `
    <div id="champ-items-${num}">
        <button id="add-item-button-${num}"> Add Item </button>
    </div>
    `;
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
    const $champPics = $(`#champ-pictures-${num}`);
    let hold = `
    <div>
        <button id="stats-button"> Stats </button>

        <button id="runes-button-${num}"> Runes </button>
    </div>
    `;
    $champPics.append(hold)

    $(`#runes-button-${num}`).on('click', function(e) {        
        renderRunes(num);
        $(`#champ-stats-${num}`).remove();
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

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};







