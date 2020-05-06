const $root = $("#root");
const $champs = $("#champs");

renderLiveGame();
renderChampionOne();
renderChampionTwo();


function renderLiveGame() {
    let hold = `
        <div id="live-game">
            <input placeholder="Enter Summoner's Name" id="name-inputbox"> </input>

        </div>
    `;
    $root.append(hold);
}

function renderChampionOne() {
    let hold = `
    <div class="column">
        Ahri
    
        <div>
        <img src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/Ahri.png">  </img>
        </div>
    </div>

    <div class=column>
    VS
    </div>
    `;
    $champs.append(hold);
}

function renderChampionTwo() {
    let hold = `
    <div class="column">
        Aatrox

        <div>
        <img src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/Aatrox.png">  </img>
        </div>
    </div>
    `;
    $champs.append(hold);
}

$('#live-game-button').on('click', function(e) {        
    $("#calc").remove();
    $("#champ-input-list").remove();
    renderLiveGame();

    e.preventDefault();
});



