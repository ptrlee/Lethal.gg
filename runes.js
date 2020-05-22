export function renderRunes(num) {
    const $champPics = $(`#champ-pictures-${num}`);
    let hold = `
    <div id="primary-runes-${num}">
        <image id="Precision-${num}" class="clickable runes" src="Assets/Runes/Precision.png"></image>
        <image id="Domination-${num}" class="clickable runes" src="Assets/Runes/Domination.png"></image>
        <image id="Sorcery-${num}" class="clickable runes" src="Assets/Runes/Sorcery.png"></image>
        <image id="Resolve-${num}" class="clickable runes" src="Assets/Runes/Resolve.png"></image>
        <image id="Inspiration-${num}" class="clickable runes" src="Assets/Runes/Inspiration.png"></image>

        <div id="keystones-${num}">

        </div>
    </div>
    `;
    $champPics.append(hold);

    renderKeystones(`Precision-${num}`, num);
    renderKeystones(`Domination-${num}`, num);
    renderKeystones(`Sorcery-${num}`, num);
    renderKeystones(`Resolve-${num}`, num);
    renderKeystones(`Inspiration-${num}`, num);
}

function renderKeystones(runes, num){
    let l = runes.split("-")[0];
    console.log(l);
    $("#"+ runes).on('click', function(e) {
        switch(l) {
            case "Precision": 
            renderImages(l, 4, num);
                break;
            case "Domination":
            renderImages(l, 4, num);
                break;
            case "Sorcery":
            renderImages(l, 3, num);
                break;
            case "Resolve": 
            renderImages(l, 3, num);
                break;
            case "Inspiration":
            renderImages(l, 3, num);
                break;

        }        
        e.preventDefault();
    });
}

function renderImages(type, length, num) {
    const $runePics = $(`#keystones-${num}`);
    let hold = "";
    for (let i = 0; i < length; i++) {
        hold += `<image width=50px length=50px src="Assets/Runes/${type}/Keystones/${i}.png"> </image>`
    }
    $runePics.append(hold)
}
