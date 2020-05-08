import {getItemsList, getSpells} from "./calc.js"
const $root = $("#root");
const $champs = $("#champs");


renderSummonerSearchbar();
renderChampionOne();
renderChampionTwo();
renderSpells("one");
renderSpells("two");

/**
 * Renders the summoner searchbar
 */
function renderSummonerSearchbar() {
    let hold = `
        <div id="live-game">
            <input placeholder="Enter Summoner's Name" id="name-inputbox"> </input>
        </div>
    `;
    $root.append(hold);
}

/**
 * Renders the first champion
 */
function renderChampionOne() {
    let hold = `
    ${renderChampStats("one")}
    <div class=column>
    VS
    </div>
    `;
    $champs.append(hold);
}

/**
 * Renders the second champion
 */
function renderChampionTwo() {
    let hold = `${renderChampStats("two")}`;
    $champs.append(hold);
}

/**
 * Handles Live Game button press
 */
$('#live-game-button').on('click', function(e) {        
    $("#champ-lists").remove();
    $(`#input-level-one`).remove();
    $(`#input-level-two`).remove();
    $("#calc-button").removeAttr('disabled');
    $(this).attr('disabled', "disabled");
    renderSummonerSearchbar();

    e.preventDefault();
});

function renderChampStats(num) {
    let hold = `
    <div class="column">
        <div id="champ-name-${num}">Ahri</div>

        <div id="champ-pictures-${num}">
            <img width=150px length=300px id="image-${num}" src="http://ddragon.leagueoflegends.com/cdn/img/champion/loading/Ahri_0.jpg">  </img>
        </div>

        <div id="champ-stats-${num}">
            <div id="level-${num}">
                Level: 1
            </div>

            <div id="HP-${num}">
                HP: 1200/1200
            </div>

            <div id="MP-${num}">
                MP: 1000/1000
            </div>

            <div id="damage-${num}">
                <div id="AD-${num}">
                    AD: 45
                </div>

                <div id="AP-${num}">
                    AP: 0
                </div>
            </div>
        
            <div id="defense-${num}">
                <div id="MR-${num}">
                    MR: 54
                </div>

                <div id="armor-${num}">
                    Armor: 45
                </div>
            </div>
        </div>
    </div>
    `
    return hold;
}

function renderItems(num) {

    let hold = `
        <div id="champ-items-${num}" height: 206px;>
            <label> Items: </label>

            <select height: 150px; id="itemf-champ-${num}">
                ${getItemsList()}
                <option selected="selected" title="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/1001.png">Boots of Speed</option>
            </select>

            <select id="items-champ-${num}">
                ${getItemsList()}
                <option selected="selected" title="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/1001.png">Boots of Speed</option>
            </select>

            <select id="itemt-champ-${num}">
                ${getItemsList()}
                <option selected="selected" title="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/1001.png">Boots of Speed</option>
            </select>

            <select id="itemfo-champ-${num}">
                ${getItemsList()}
                <option selected="selected" title="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/1001.png">Boots of Speed</option>
            </select>

            <select id="itemfi-champ-${num}">
                ${getItemsList()}
                <option selected="selected" title="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/1001.png">Boots of Speed</option>
            </select>

            <select id="itemsi-champ-${num}">
                ${getItemsList()}
                <option selected="selected" title="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/item/1001.png">Boots of Speed</option>
            </select>

        </div>
    `;
    return hold;
}

export function renderSpells(num) {
    $(`#champ-spell-${num}`).remove();
    const $champPics = $(`#champ-pictures-${num}`);
    let x = getSpells(num);
    console.log(x);
    
    let spells = "";
    for (let i = 0; i < 4; i++) {
        console.log(x[i].name);
        spells += `<image width=32px length=32px src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/spell/${x[i].id}.png"> </image>`;
    }

    let hold = ` 
    <div id="champ-spell-${num}">
        <span>
            ${spells}
        </span>
    </div>
    `;
    $champPics.append(hold);
}




