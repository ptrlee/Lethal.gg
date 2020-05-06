const $root = $("#root");


function renderButtons() {
    let hold = `
        <div>
            <button id="live-game-button"> Live Game </button>
            <button id="calc-button"> Damage Calculator </button>
        </div>
    `;
    $root.append(hold);
}

function renderLiveGame() {
    let hold = `
        <div>
            <input placeholder="Enter Summoner's Name" id="name-inputbox"> </input>

        </div>

        <div>
            <img src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/Ahri.png">  </img>
            VS                                   
            <img src="http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/Aatrox.png">  </img>    

        </div>
    `;
    $root.append(hold);
}

renderButtons();
renderLiveGame();