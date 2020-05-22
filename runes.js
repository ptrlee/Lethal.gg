export function renderRunes(num) {
    const $champPics = $(`#champ-pictures-${num}`);
    let hold = `
    <div id="runes-${num}">
        <image id="Precision-${num}" class="clickable runes runes-${num}" src="Assets/Runes/Precision.png"></image>
        <image id="Domination-${num}" class="clickable runes runes-${num}" src="Assets/Runes/Domination.png"></image>
        <image id="Sorcery-${num}" class="clickable runes runes-${num}" src="Assets/Runes/Sorcery.png"></image>
        <image id="Resolve-${num}" class="clickable runes runes-${num}" src="Assets/Runes/Resolve.png"></image>
        <image id="Inspiration-${num}" class="clickable runes runes-${num}" src="Assets/Runes/Inspiration.png"></image>

        <div id="primary-runes-${num}">
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
        $(`#primary-runes-${num}`).remove();
        switch(l) {
            case "Precision": 
            renderImages(l, num);
                break;
            case "Domination":
            renderImages(l, num);
                break;
            case "Sorcery":
            renderImages(l, num);
                break;
            case "Resolve": 
            renderImages(l, num);
                break;
            case "Inspiration":
            renderImages(l, num);
                break;
        }
        $(`.runes-${num}`).removeClass('active');        
        $(this).addClass('active');
        e.preventDefault();
    });
}

function renderImages(type, num) {
    const $runePics = $(`#runes-${num}`);
    let keystoneLength = 3;
    let hold = "";
    let make = `<div id="primary-runes-${num}"></div>`;
    $runePics.append(make)
    const $primaryPics = $(`#primary-runes-${num}`);

    if (type == "Precision" || type == "Domination") {
        keystoneLength = 4;
    }

    for (let i = 0; i < keystoneLength; i++) {
        hold += `<image id="keyStone-${i}-${num}" class="clickable runes" width=50px length=50px src="Assets/Runes/${type}/Keystones/${i}.png"> </image>`
    }
 
    $primaryPics.append(hold)

    let subs = `
    <div>
        ${subRunes(type, "LineOne", num)}
    </div>

    <div>
        ${subRunes(type, "LineTwo", num)}
    </div>

    <div>
        ${subRunes(type, "LineThree", num)}
    </div>
    `;

    $primaryPics.append(subs);
}

function subRunes(type, line, num){
    let hold = "";
    let length = 3;
    if (type == "Domination" && line == "LineThree") {
        length = 4;
    }
    for (let i = 0; i < length; i++) {
        hold += `<image class="clickable runes ${line}" id="${type}-${line}-${i}-${num}" src="Assets/Runes/${type}/${line}/${i}.png">`
    }
    return hold;
}
