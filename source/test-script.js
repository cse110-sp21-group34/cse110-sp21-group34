/**
 * Takes a string value only to return it
 *
 * @param  {string} text - The text to be outputted
 * @return {string} - The text that is outputted
 */
function generateText(text) {
  return text;
}

document.getElementById("test_button").addEventListener("click", () => {
  const newElem = document.createElement("p");
  newElem.textContent = generateText("Welcome!");
  newElem.id = "test_content";
  document.body.appendChild(newElem);
});
