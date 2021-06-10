import styles from './css/labelPrompt.css';

const storage = require("storage");

document.querySelector("#iconInside").addEventListener("click", createNew);

/**
 * Function that create a pop-up window for user to select label name and color
 */
function createNew() {
    if (document.getElementById('label_prompt_window')) {
        let prompt = document.getElementById('label_prompt_window');
        prompt.parentNode.removeChild(prompt);
    }

    var prompt = document.createElement('div')
    prompt.id = "label_prompt_window";
    var question = document.createElement('p')
    question.id = "nameColorQ"
    question.innerText = "Please name your label and choose a color.";
    // uncomment this if grid-template-columns turned on
    /*
    var nullP = document.createElement('p');
    prompt.appendChild(nullP)
    */
    var nameInput = document.createElement('input')
    nameInput.id = "nameInput";
    nameInput.type = "text"
    var colorInput = document.createElement('input')
    colorInput.id = "colorInput";
    colorInput.type = "color"
    prompt.appendChild(question)
    prompt.appendChild(nameInput)
    prompt.appendChild(colorInput)

    var createButton = document.createElement("button")
    createButton.id = "createLabelButton";
    createButton.innerText = "Confirm";
    createButton.className = "labelButton";
    prompt.appendChild(createButton)

    var cancelButton = document.createElement("button")
    cancelButton.id = "cancelLabelButton";
    cancelButton.innerText = "Cancel";
    cancelButton.className = "labelButton";
    prompt.appendChild(cancelButton)

    var main_area = document.getElementById('editingMainPage')
    main_area.insertBefore(prompt, main_area.children[1]);

    document.querySelector("#createLabelButton").addEventListener("click", () => {
        createLabel(nameInput.value, colorInput.value);
        storage.journals.labelDate(storage.currentDate, nameInput.value, {color: colorInput.value});
        
        prompt.parentNode.removeChild(prompt);  // Close the window
    });

    document.querySelector("#cancelLabelButton").addEventListener("click", () => {
        prompt.parentNode.removeChild(prompt);  // Close the window
    });
}

/**
 * Creates label element on the page
 * @param  {String} name Holds the name of the label
 * @param  {String} color Holds the hexcode for the color of the label
 */
function createLabel(name, color) {
    var oneLabel = document.createElement('a');
    oneLabel.href = "#";
    oneLabel.innerText = name;
    oneLabel.className = "oneLabel"
    // Make sure that our use won't choose color == background color, though chance == 0.01%
    if (color != "#daf5ff") {
        oneLabel.style.background = color;
    }
    var labelArea = document.getElementsByClassName('pcolor')[0];
    labelArea.appendChild(oneLabel);
    // make our newly created label editable
    oneLabel.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        editLabel(oneLabel);
    });
    oneLabel.addEventListener('click', (e) => e.preventDefault());
    document.querySelector("#iconInside").addEventListener("click", createNew);
}

/**
 * Opens interface to edit label when it is right-clicked
 * @param  {HTMLElement<a>} oneLabel HTML Anchor tag whose label is to be edited
 */
function editLabel(oneLabel) {
    if (document.getElementById('label_prompt_window')) {
        let prompt = document.getElementById('label_prompt_window');
        prompt.parentNode.removeChild(prompt);
    }

    var prompt = document.createElement('div')
    prompt.id = "label_prompt_window";
    var question = document.createElement('p');
    question.id = "nameColorQ";
    question.innerText = "Change your label name and color."
    var nameInput = document.createElement('input')
    nameInput.id = "nameInput";
    nameInput.type = "text";
    nameInput.value = oneLabel.innerText;
    var colorInput = document.createElement('input')
    colorInput.id = "colorInput";
    colorInput.type = "color";
    // This line isn't working.
    colorInput.defaultValue = oneLabel.style.background
    prompt.appendChild(question)
    prompt.appendChild(nameInput)
    prompt.appendChild(colorInput)

    var changeButton = document.createElement("button")
    changeButton.id = "changeLabelButton";
    changeButton.innerText = "Confirm";
    prompt.appendChild(changeButton);
    var cancelButton = document.createElement("button")
    cancelButton.id = "cancelLabelButton";
    cancelButton.innerText = "Cancel";
    prompt.appendChild(cancelButton)

    var main_area = document.getElementById('editingMainPage')
    main_area.insertBefore(prompt, main_area.children[1]);

    document.querySelector("#changeLabelButton").addEventListener("click", () => {
        prompt.parentNode.removeChild(prompt);  // Close the window
        oneLabel.href = "#";
        if (oneLabel.innerText !== nameInput.value) {
            storage.journals.removeLabelDate(storage.currentDate, oneLabel.innerText);
        }
        oneLabel.innerText = nameInput.value;
        // Make sure that our use won't choose color == background color, though chance == 0.01%
        if (colorInput.value != "#daf5ff") {
            oneLabel.style.background = colorInput.value;
        }
        storage.journals.labelDate(storage.currentDate, nameInput.value, {color: colorInput.value});
    });

    document.querySelector("#cancelLabelButton").addEventListener("click", () => {
        prompt.parentNode.removeChild(prompt);  // Close the window
    });

}

module.exports = {
    createLabel: createLabel
}