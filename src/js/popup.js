
/* UI handling */
function reloadList(dataset, util, ui) {
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
            util["selected"] = index;
            updateHighlight(dataset, util, ui);
            toggleHighlight(ui);
        });

        cloned.querySelector(".spm-list-remove-btn").addEventListener("click", () => {
            var index = Array.prototype.indexOf.call(list.childNodes, cloned);
            removeCopypastaAt(index, dataset).then((_) => {
            loadDataset(dataset);
            reloadList(dataset, util, ui);
            });
        });

        let tagBox = cloned.querySelector(".spm-list-tags");
        element.tags.forEach(tag => {
            let tagNode = document.createElement("span");
            tagNode.innerText = tag;
            tagBox.appendChild(tagNode);
        });
        
    });
}

function toggleHighlight(ui) {
    ui["highlight"].classList.toggle("spm-highlight-out");
    ui["highlight"].classList.toggle("spm-highlight-in");
}

function updateHighlight(dataset, util, ui) {
    let index = util["selected"];
    ui["highlight_text"].innerHTML = dataset.data[index].text;
    
    let tagList = ui["highlight_tag_list"];
    let tagListChildren = ui["highlight_tag_list"].children;
    while(tagListChildren.length > 1) {
        console.log(tagListChildren);
        tagList.removeChild(tagList.firstChild);
    }

    dataset.data[index].tags.slice().reverse().forEach((tag) => {
        let newTag = document.createElement("span");
        newTag.innerHTML = tag;
        tagList.insertBefore(newTag, tagList.firstChild);
    });
}

function getInterfaceElements() {
    let interface = {};
    interface["list"] = document.querySelector("#spm-list");
    interface["template"] = document.querySelector("#spm-list-template").content;
    interface["highlight"] = document.querySelector("#spm-highlight");
    interface["highlight_text"] = document.querySelector("#spm-highlight-txt");
    interface["highlight_tag_list"] = document.querySelector("#spm-highlight-tag-list");
    interface["highlight_tag_input"] = document.querySelector("#spm-highlight-tag-input");
    interface["button_add"] = document.querySelector("#spm-btn-add");
    interface["button_close"] = document.querySelector("#spm-btn-close");
    return interface;
}

function getUtilData() {
    let data = {};
    data["selected"] = -1;
    return data; 
}

function setEventListeners(dataset, util, ui) {
    reloadList(dataset, util, ui);
    ui["button_add"].addEventListener("click", () => {
        insertCopypasta(new Copypasta("(empty)", [], ""), dataset).then((_) => {
            loadDataset(dataset);
            reloadList(dataset, util, ui);
        });
    });

    ui["button_close"].addEventListener("click", () => {
        ui["highlight"].classList.toggle("spm-highlight-out");
        ui["highlight"].classList.toggle("spm-highlight-in");
    });


    ui["highlight_text"].addEventListener("focusout", () => {
        let copypasta = new Copypasta("", [], "");
        copypasta.text = ui["highlight_text"].innerHTML;
        setCopypastaAt(util["selected"], copypasta, dataset).then((_) => {
            loadDataset(dataset);
            reloadList(dataset, util, ui);
        });
    });
}

async function main() {

    const dataset     = await loadDataset();
    const util        = getUtilData();
    const ui = getInterfaceElements();

    setEventListeners(dataset, util, ui);


};

main();
