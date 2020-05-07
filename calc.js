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
            <input placeholder="First Champ's Name" id="champ-input-list-one" type="text" list="champions-one" />
            <datalist id="champions-one">
                ${createChampionList()}
            </datalist>    
        </div>

        <div class="column">
        </div>

        <div id="champ-two" class="column">
            <input placeholder="Second Champ's Name" id="champ-input-list-two" type="text" list="champions-two" />
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
    });
}


/**
 * Handles Damage Calculator button press
 */
$('#calc-button').on('click', function(e) {        
    $("#live-game").remove();
    $("#name-inputbox").remove();
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

/**
 * Gets the champion that was selected
 */
function championChange(num) {
    let x = document.getElementById("champ-input-list-" + num);
    document.getElementById("image-" + num).src = `http://ddragon.leagueoflegends.com/cdn/10.9.1/img/champion/${x.value}.png`;
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






