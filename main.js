const $root = $("#root");
const $champs = $("#champs");

renderSummonerSearchbar();
renderChampionOne();
renderChampionTwo();

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
    $("#calc-button").removeAttr('disabled');
    $(this).attr('disabled', "disabled");
    renderSummonerSearchbar();

    e.preventDefault();
});

function renderChampStats(num) {
    let hold = `
    <div class="column">
        <div id="champ-name-${num}">
            Ahri
        </div>

        <div>
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



