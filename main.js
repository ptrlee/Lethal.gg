import {getAbilities} from "./calc.js"
const $root = $("#root");
const $champs = $("#champs");


renderSummonerSearchbar();
renderChampionOne();
renderDamageNumbers();
renderChampionTwo();
getAbilities("one");
getAbilities("two");


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
    let hold = `${renderChampStats("one")}`;
    $champs.append(hold);
}

function renderDamageNumbers() {
    let hold = `
    <div id='total-damage' class="column ">
        VS
        <div id="ability-damage" class= columns> 
            <div id="Passive-Damage" class="column"> Passive </div>
            <div id="Q-damage" class="column damage"> Q </div>
            <div id="W-damage" class="column damage"> W </div>
            <div id="E-damage" class="column damage"> E </div>
            <div id="R-damage" class="column damage"> R </div>
        </div>
    </div>`
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
    $(`#add-item-button-one`).remove();
    $(`#add-item-button-two`).remove();
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

        <div id="champ-buttons-${num}">

        </div>

        <div id="champ-stats-${num}">
            <div id="level-${num}">
                Level: 1
            </div>

            <div id="HP-${num}">
                HP: 526
            </div>

            <div id="MP-${num}">
                MP: 418/418
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



