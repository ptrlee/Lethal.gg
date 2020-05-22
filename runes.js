export function renderRunes(num) {
    const $champPics = $(`#champ-pictures-${num}`);
    let hold = `
    <div>
        <image id="Precision-${num}" class="clickable runes" src="Assets/Runes/Precision.png"></image>
        <image id="Domination-${num}" class="clickable runes" src="Assets/Runes/Domination.png"></image>
        <image id="Sorcery-${num}" class="clickable runes" src="Assets/Runes/Sorcery.png"></image>
        <image id="Resolve-${num}" class="clickable runes" src="Assets/Runes/Resolve.png"></image>
        <image id="Inspiration-${num}" class="clickable runes" src="Assets/Runes/Inspiration.png"></image>
    </div>
    `;
    $champPics.append(hold);
}