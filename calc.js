const $root = $("#root");
const $champs = $("#champs");

function renderCalculator() {
    let hold = `
        <div id="calc">
            <input placeholder="First Champ's Name" id="champ-input-list" type="text" list="champions" />
            <datalist id="champions">
                <option>Ahri</option>
        <div>
    `;
    
    $root.append(hold);
}

$('#calc-button').on('click', function(e) {        
    $("#live-game").remove();
    $("#name-inputbox").remove();
    renderCalculator();

    e.preventDefault();
});

