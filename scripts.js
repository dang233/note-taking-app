var list = document.getElementById("note-list");
var tagList = document.querySelectorAll(".note-tag-list");

function noteAddTest() {
    // use this to test the note adding functionality
    var note = document.createElement("div");
    note.classList.add("note-el");
    note.innerText = "NOOT"
    list.appendChild(note);
}

for(element of tagList) {
    element.addEventListener("wheel", (event) => {
    event.preventDefault();
    element.scrollLeft += event.deltaY;
})
}
