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

    runesClick(`Precision-${num}`, num);
    runesClick(`Domination-${num}`, num);
    runesClick(`Sorcery-${num}`, num);
    runesClick(`Resolve-${num}`, num);
    runesClick(`Inspiration-${num}`, num);
}

function runesClick(runes, num){
    let l = runes.split("-")[0];
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

/**
 * Renders keystones and all the runes of a certain rune type, as well as apply 
 * click events to the pictures
 */
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
        hold = `<image id="${type}-keystone-${i}-${num}" class="clickable runes keystones-${num}" width=50px length=50px src="Assets/Runes/${type}/Keystones/${i}.png"> </image>`
        $primaryPics.append(hold)
        keystoneClick(type, i, num);
    }
 
    

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
    for (let i=0; i<3; i++) {
        lineClick(type, "LineOne", i, num);
        lineClick(type, "LineTwo", i, num);
        lineClick(type, "LineThree", i, num);    
    }
    lineClick(type, "LineThree", 3, num);
}

/**
 * Renders the images of the sub runes
 */
function subRunes(type, line, num){
    let hold = "";
    let length = 3;
    if (type == "Domination" && line == "LineThree") {
        length = 4;
    }
    for (let i = 0; i < length; i++) {
        hold += `<image class="clickable runes ${line}-${num}" id="${type}-${line}-${i}-${num}" src="Assets/Runes/${type}/${line}/${i}.png"></image>`
    }
    return hold;
}

/**
 * Creates onclick events for the keystone pictures given their ids
 */
function keystoneClick(type, i, num) {
    $(`#${type}-keystone-${i}-${num}`).on('click', function(e) {
        $(`.keystones-${num}`).removeClass('active');        
        $(this).addClass('active');
        e.preventDefault();
    });
}

/**
 * Creates onclick events for the sub runes pictures given their ids
 */
function lineClick(type, line, i, num) {
    $(`#${type}-${line}-${i}-${num}`).on('click', function(e) {
        $(`.${line}-${num}`).removeClass('active');        
        $(this).addClass('active');
        e.preventDefault();
    });
} 