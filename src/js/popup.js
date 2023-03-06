
/* UI handling */
function updateList(dataset, lastSelected, ui) {
    const list      = ui["list"];
    const template  = ui["template"];

    while(list.firstChild)
        list.removeChild(list.firstChild);

    dataset.data.forEach(element => {
        let cloned = template.cloneNode(true).querySelector(".spm-list-item");
        list.appendChild(cloned);       
        
        cloned.querySelector(".spm-list-txt").innerHTML = element.text;
        cloned.querySelector(".spm-list-edit-btn").addEventListener("click", () => {
            var index = Array.prototype.indexOf.call(list.childNodes, cloned);
            lastSelected["val"] = index;
            updateHighlight(dataset, lastSelected, ui);
            toggleHighlight(ui);
        });
    });
}

function toggleHighlight(ui) {
    ui["highlight"].classList.toggle("spm-highlight-out");
    ui["highlight"].classList.toggle("spm-highlight-in");
}

function updateHighlight(dataset, lastSelected, ui) {
    ui["highlight_text"].innerHTML = dataset.data[lastSelected["val"]].text;
}

function getInterfaceElements(){
    let interface = {};
    interface["list"] = document.querySelector("#spm-list");
    interface["template"] = document.querySelector("#spm-list-template").content;
    interface["highlight"] = document.querySelector("#spm-highlight");
    interface["highlight_text"] = document.querySelector("#spm-highlight-txt");
    interface["button_add"] = document.querySelector("#spm-btn-add");
    interface["button_close"] = document.querySelector("#spm-btn-close");
    return interface;
}

async function main() {

    let mainDataset = await loadDataset();
    let lastSelected = { "val": -1 };
    const ui = getInterfaceElements();

    updateList(mainDataset, lastSelected, ui);

    const btnElement = document.querySelector("#spm-btn-add");
    const btnElementR = document.querySelector("#spm-btn-remove");
    const btnElementC = document.querySelector("#spm-btn-close");
    const highlight = document.querySelector("#spm-highlight");

    btnElement.addEventListener("click", () => {
        insertCopypasta(new Copypasta("(new copypasta)", [], ""), mainDataset).then((_) => {
            loadDataset(mainDataset);
            updateList(mainDataset, lastSelected, ui);
        });
    });

    btnElementR.addEventListener("click", () => {
        removeCopypastaAt(2, mainDataset).then((_) => {
            loadDataset(mainDataset);
            updateList(mainDataset, lastSelected, ui);
        });
    });

    btnElementC.addEventListener("click", () => {
        highlight.classList.toggle("spm-highlight-out");
        highlight.classList.toggle("spm-highlight-in");
    });


    let txt = highlight.querySelector("#spm-highlight-txt");
    txt.addEventListener("focusout", () => {
        console.log(lastSelected);
        let copypasta = new Copypasta("", [], "");
        copypasta.text = txt.innerHTML;
        setCopypastaAt(lastSelected["val"], copypasta, mainDataset).then((_) => {
            loadDataset(mainDataset);
            updateList(mainDataset, lastSelected, ui);
        });
    });


};

main();
