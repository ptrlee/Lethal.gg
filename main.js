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
    <div class="column">
        Ahri
        <div>
        <img id="image-one" src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/Ahri.png">  </img>
        </div>
    </div>

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
    let hold = `
    <div class="column">
        Aatrox

        <div>
        <img id="image-two" src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/Aatrox.png">  </img>
        </div>
    </div>
    `;
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



