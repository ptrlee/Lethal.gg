const $root = $("#root");
const $champs = $("#champs");
let champions;

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

        <div class="column">
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
            championChange("one");
        });

        $('#champ-input-list-two').change(function() {
            championChange("two");
        });

        $('#champ-level-list-one').change(function() {
            lvlChange("one");
        });

        $('#champ-level-list-two').change(function() {
            lvlChange("two");
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
            <input placeholder="Enter Level" id="champ-level-list-${num}" type="text" list="levels-${num}" />
            <datalist id="levels-${num}">
               <option> 2 </option>
            </datalist>
        </div>
    `;
    $stats.prepend(hold);
}

/**
 * Gets the champion that was selected
 */
function championChange(num) {
    let x = document.getElementById("champ-input-list-" + num).value;
    let champ = $.getValues(`http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/${x}.json`);
    document.getElementById("image-" + num).src = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${x}_0.jpg`;
    document.getElementById("champ-name-" + num).innerHTML = x;
    document.getElementById("HP-" + num).innerHTML = "HP: " + champ[x].stats.hp + "/" + champ[x].stats.hp;
    document.getElementById("MP-" + num).innerHTML = "MP: " + champ[x].stats.mp + "/" + champ[x].stats.mp;
    document.getElementById("AD-" + num).innerHTML = "AD: " + champ[x].stats.attackdamage;
    document.getElementById("MR-" + num).innerHTML = "MR: " + champ[x].stats.spellblock;
    document.getElementById("armor-" + num).innerHTML = "Armor: " + champ[x].stats.armor;
}

function lvlChange(num) {
    let x = document.getElementById("champ-input-list-" + num).value;
    let l = document.getElementById("champ-level-list-" + num).value - 1;
    console.log(l);
    let champ = $.getValues(`http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/${x}.json`);
    console.log(champ);

    document.getElementById("HP-" + num).innerHTML = "HP: " + (champ[x].stats.hp + (champ[x].stats.hpperlevel*l)) + "/" + (champ[x].stats.hp + (champ[x].stats.hpperlevel*l));
    document.getElementById("MP-" + num).innerHTML = "MP: " + (champ[x].stats.mp + (champ[x].stats.mpperlevel*l)) + "/" + (champ[x].stats.mp + (champ[x].stats.mpperlevel*l));
    document.getElementById("AD-" + num).innerHTML = "AD: " + (champ[x].stats.attackdamage + (champ[x].stats.attackdamageperlevel*l));
    document.getElementById("MR-" + num).innerHTML = "MR: " + (champ[x].stats.spellblock + (champ[x].stats.spellblockperlevel*l));
    document.getElementById("armor-" + num).innerHTML = "Armor: " + (champ[x].stats.armor + (champ[x].stats.armorperlevel*l));
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

export function getItemsList() {
    let temp = "";
    let item = $.getValues("http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/item.json");
    let items = Object.keys(item);
    for (let i =0; i < items.length; i++) {
        temp += `<option value="a" data-image="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/${items[i]}.png">${items[i]}</option>`;
    }
    return temp; 
}

export function getSpells(num){
    let x = document.getElementById("champ-name-" + num).textContent;
    let champ = $.getValues(`http://ddragon.leagueoflegends.com/cdn/10.9.1/data/en_US/champion/${x}.json`);
    return champ[x].spells;
}





