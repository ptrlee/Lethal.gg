export function renderRunes(num) {
    const $champPics = $(`#champ-buttons-${num}`);
    let runes = ["Precision", "Domination", "Sorcery", "Resolve", "Inspiration"];
    let images = "";
    for (let i = 0; i < runes.length; i++) {
        images += `<image id="primary-${runes[i]}-${num}" class="clickable runes runes-${num}" src="Assets/Runes/${runes[i]}.png"></image>`
    }
    let hold = `
    <div class="stats-and-runes columns is-marginless" id="runes-${num}">
        <div class="column" id="primary-runes-${num}">
            ${images}
        </div>
    </div>
    `;
    $champPics.append(hold);

    runesClick("#primary-", `Precision-${num}`, num);
    runesClick("#primary-", `Domination-${num}`, num);
    runesClick("#primary-", `Sorcery-${num}`, num);
    runesClick("#primary-", `Resolve-${num}`, num);
    runesClick("#primary-", `Inspiration-${num}`, num);
}

function runesClick(ary, runes, num){
    let l = runes.split("-")[0];
    $(ary + runes).on('click', function(e) {
        switch(l) {
            case "Precision": 
                if (ary == "#primary-") {
                    $(`#primary-runes-subs-${num}`).remove();
                    renderImages(l, num);
                    renderSecondaryRunes("Precision", num);
                } else if (ary == "#secondary-") {
                    renderSecondarySubs("Precision", num);
                }
                break;
            case "Domination":
                if (ary == "#primary-") {
                    $(`#primary-runes-subs-${num}`).remove();
                    renderImages(l, num);
                    renderSecondaryRunes("Domination", num);
                } else if (ary == "#secondary-") {
                    renderSecondarySubs("Domination", num);
                }
                break;
            case "Sorcery":
                if (ary == "#primary-") {
                    $(`#primary-runes-subs-${num}`).remove();
                    renderImages(l, num);
                    renderSecondaryRunes("Sorcery", num);
                } else if (ary == "#secondary-") {
                    renderSecondarySubs("Sorcery", num);
                }
                break;
            case "Resolve": 
                if (ary == "#primary-") {
                    $(`#primary-runes-subs-${num}`).remove();
                    renderImages(l, num);
                    renderSecondaryRunes("Resolve", num);
                } else if (ary == "#secondary-") {
                    renderSecondarySubs("Resolve", num);
                }
                break;
            case "Inspiration":
                if (ary == "#primary-") {
                    $(`#primary-runes-subs-${num}`).remove();
                    renderImages(l, num);
                    renderSecondaryRunes("Inspiration", num);
                } else if (ary == "#secondary-") {
                    renderSecondarySubs("Inspiration", num);
                }
                break;
        }
        if (ary == "#primary-") {
            $(`.runes-${num}`).removeClass('active');    
            $(this).addClass('active');
        } else {
            $(`.secondary-runes-${num}`).removeClass('active');   
            $(this).addClass(`active`);
        }

       

        e.preventDefault();
    });
}

/**
 * Renders keystones and all the runes of a certain rune type, as well as apply 
 * click events to the pictures
 */
function renderImages(type, num) {
    const $runePics = $(`#primary-runes-${num}`);
    let keystoneLength = 3;
    let hold = "";
    let make = `<div id="primary-runes-subs-${num}"></div>`;
    $runePics.append(make)
    const $primaryPics = $(`#primary-runes-subs-${num}`);

    if (type == "Precision" || type == "Domination") {
        keystoneLength = 4;
    }

    for (let i = 0; i < keystoneLength; i++) {
        hold = `<image id="${type}-keystone-${i}-${num}" class="keystones clickable runes keystones-${num}" src="Assets/Runes/${type}/Keystones/${i}.png"></image>`
        $primaryPics.append(hold)
        keystoneClick(type, i, num);
    }
 
    

    let subs = `
    <div>
        ${subRunes("primary", type, "LineOne", num)}
    </div>

    <div>
        ${subRunes("primary", type, "LineTwo", num)}
    </div>

    <div>
        ${subRunes("primary", type, "LineThree", num)}
    </div>
    `;

    $primaryPics.append(subs);
    for (let i=0; i<3; i++) {
        lineClick("primary", type, "LineOne", i, num);
        lineClick("primary", type, "LineTwo", i, num);
        lineClick("primary", type, "LineThree", i, num);    
    }
    lineClick("primary", type, "LineThree", 3, num);
}

/**
 * Renders the images of the sub runes
 */
function subRunes(ary, type, line, num){
    let hold = "";
    let length = 3;
    if (type == "Domination" && line == "LineThree") {
        length = 4;
    }
    for (let i = 0; i < length; i++) {
        hold += `<image class="subrunes clickable runes ${ary}-${line}-${num}" id="${ary}-${type}-${line}-${i}-${num}" src="Assets/Runes/${type}/${line}/${i}.png"></image>`
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
function lineClick(ary, type, line, i, num) {
    $(`#${ary}-${type}-${line}-${i}-${num}`).on('click', function(e) {
        $(`.${ary}-${line}-${num}`).removeClass('active');        
        $(this).addClass('active');
        e.preventDefault();
    });
} 

function renderSecondaryRunes(rune, num) {
    $(`#secondary-runes-${num}`).remove();
    const $runePics = $(`#runes-${num}`);
    let make = `<div class="column" id="secondary-runes-${num}"></div>`;
    $runePics.append(make)
    const $secondary = $(`#secondary-runes-${num}`);

    let array = ["Precision", "Domination", "Sorcery", "Resolve", "Inspiration"];
    let index = array.indexOf(rune);
    let images = "";
    array.splice(index, 1);

    for (let i = 0; i < array.length; i++) {
        images += `<image id="secondary-${array[i]}-${num}" class="clickable runes secondary-runes-${num}" src="Assets/Runes/${array[i]}.png"></image>`
    }

    $secondary.append(images);

    runesClick("#secondary-", `Precision-${num}`, num);
    runesClick("#secondary-", `Domination-${num}`, num);
    runesClick("#secondary-", `Sorcery-${num}`, num);
    runesClick("#secondary-", `Resolve-${num}`, num);
    runesClick("#secondary-", `Inspiration-${num}`, num);
}

function renderSecondarySubs(type, num) {
    $(`#secondary-runes-subs-${num}`).remove();
    const $runePics = $(`#secondary-runes-${num}`);
    let make = `<div id="secondary-runes-subs-${num}"></div>`;
    $runePics.append(make)
    const $secondaryPics = $(`#secondary-runes-subs-${num}`);
 
    let subs = `
    <div>
        ${subRunes("secondary", type, "LineOne", num)}
    </div>

    <div>
        ${subRunes("secondary", type, "LineTwo", num)}
    </div>

    <div>
        ${subRunes("secondary", type, "LineThree", num)}
    </div>
    `;

    $secondaryPics.append(subs);
    for (let i=0; i<3; i++) {
        lineClick("secondary", type, "LineOne", i, num);
        lineClick("secondary", type, "LineTwo", i, num);
        lineClick("secondary", type, "LineThree", i, num);    
    }
    lineClick("secondary", type, "LineThree", 3, num);
}