
/* UI handling */
function addListItem(dataset, util, ui) {
    const list = ui["list"];
    const template = ui["template"];
    
    let item = template.cloneNode(true).querySelector(".spm-list-item");
    setupListItem(item, dataset, util, ui);
    list.appendChild(item);

}

function removeListItem(dataset, util, ui) {
    removeCopypastaAt(util["index"], dataset).then(_ => {
        let list = ui["list"];
        list.removeChild(list.children[util["index"]]);
    });
}

function setupListItem(item, dataset, util, ui) {

    const list = ui["list"];
    let content = dataset.data[util["index"]];
    item.querySelector(".spm-list-txt").innerText = content.text;
    item.querySelector(".spm-list-edit-btn").addEventListener("click", () => {
        var index = Array.prototype.indexOf.call(list.childNodes, item);
        util["index"] = index;
        updateHighlight(dataset, util, ui);
        toggleHighlight(ui);
    });

    item.querySelector(".spm-list-remove-btn").addEventListener("click", () => {
        var index = Array.prototype.indexOf.call(list.childNodes, item);
        util["index"] = index;

        if (util["deletable_item"] == index) {
            removeListItem(dataset, util, ui);
            util["deletable_item"] = -1;
            item.querySelector(".spm-list-remove-btn").classList.remove("btn-remove");
            item.querySelector(".spm-list-remove-btn").classList.add("btn-normal");
        }

        else {
            util["deletable_item"] = index;
            item.querySelector(".spm-list-remove-btn").classList.add("btn-remove");
            item.querySelector(".spm-list-remove-btn").classList.remove("btn-normal");
        }

    });

    item.querySelector(".spm-list-remove-btn").addEventListener("focusout", () => {
        util["deletable_item"] = -1;
        item.querySelector(".spm-list-remove-btn").classList.remove("btn-remove");
        item.querySelector(".spm-list-remove-btn").classList.add("btn-normal");
    });
}

function reloadList(dataset, util, ui) {
    const list      = ui["list"];

    while(list.firstChild)
        list.removeChild(list.firstChild);
    
    let counter = 0;
    dataset.data.forEach(_ => {
        util["index"] = counter;
        addListItem(dataset, util, ui);
        counter++;
    });

}

function addTag(tag, util, ui) {
    let tagList = ui["highlight_tag_list"];
    let item = ui["tag_template"].cloneNode(true).querySelector(".spm-tag");
    setupTag(item, tag, util, ui);
    if (tagList.children.length > 0) {
        let lastChild = tagList.children[tagList.children.length - 1];
        tagList.insertBefore(item, lastChild);
    }
    else {
        tagList.appendChild(item);
    }
}

function setupTag(item, tag, util, ui) {
    let tagList = ui["highlight_tag_list"];
    let temporary = util["temporary_tags"];
    temporary.push(tag.toLowerCase());
    item.querySelector(".spm-tag-txt").innerText = tag;
    item.querySelector(".spm-tag-remove").addEventListener("click", () => {
        let i = Array.prototype.indexOf.call(tagList.children, item);
        removeTag(i, util, ui);
    });
}

function removeTag(index, util, ui) {
    let tagList = ui["highlight_tag_list"];
    let temporary = util["temporary_tags"];

    tagList.removeChild(tagList.children[index]);
    temporary.splice(index, 1);
}

function toggleHighlight(ui) {
    ui["highlight"].classList.toggle("spm-highlight-out");
    ui["highlight"].classList.toggle("spm-highlight-in");
    ui["highlight_tag_input"].value = "";
}

function updateHighlight(dataset, util, ui) {
    let index = util["index"];
    ui["highlight_text"].value = dataset.data[index].text;
    util["temporary_tags"] = [];
    
    let tagList = ui["highlight_tag_list"];
    let tagListChildren = ui["highlight_tag_list"].children;
    while(tagListChildren.length > 1) {
        tagList.removeChild(tagList.firstChild);
    }

    dataset.data[index].tags.slice().forEach((tag) => {
        addTag(tag, util, ui);
    });
}

function getInterfaceElements() {
    let interface = {};
    interface["list"]                = document.querySelector("#spm-list");
    interface["template"]            = document.querySelector("#spm-list-template").content;
    interface["tag_template"]        = document.querySelector("#spm-tag-template").content;
    interface["highlight"]           = document.querySelector("#spm-highlight");
    interface["highlight_text"]      = document.querySelector("#spm-highlight-txt");
    interface["highlight_tag_list"]  = document.querySelector("#spm-highlight-tag-list");
    interface["highlight_tag_input"] = document.querySelector("#spm-highlight-tag-input");
    interface["highlight_save"]      = document.querySelector("#spm-btn-save");
    interface["button_add"]          = document.querySelector("#spm-btn-add");
    interface["button_close"]        = document.querySelector("#spm-btn-close");
    interface["tag_filter_input"]    = document.querySelector("#spm-tag-filter");
    interface["button_tag_clear"]    = document.querySelector("#spm-tag-clear");
    return interface;
}

function getUtilData() {
    let data = {};
    data["index"] = -1;
    data["temporary_tags"] = [];
    data["tag"] = "";
    data["deletable_item"] = -1;
    return data; 
}

function setEventListeners(dataset, util, ui) {
    ui["button_add"].addEventListener("click", () => {
        unshiftCopypasta(new Copypasta("(empty)", [], ""), dataset).then((_) => {
            loadDataset(dataset);
            reloadList(dataset, util, ui);
        });
    });

    ui["button_close"].addEventListener("click", () => {
        toggleHighlight(ui);
    });


    ui["highlight_save"].addEventListener("click", () => {
        let copypasta = new Copypasta("", [], "");
        copypasta.text = ui["highlight_text"].value;
        copypasta.tags = util["temporary_tags"];
        setCopypastaAt(util["index"], copypasta, dataset).then((_) => {
            loadDataset(dataset);
            reloadList(dataset, util, ui);
            toggleHighlight(ui);
        });
    });

    ui["tag_filter_input"].addEventListener("input", key => {
        let tags = key.target.value.split(/[\s,;]+/).filter(t => {
            return t !== "";
        });
        let filteredData = [...dataset.data];
        if (tags.length > 0) {
            dataset.data.forEach(element => {
                let containsAllTags = true;
                for (let i = 0; i < tags.length && containsAllTags; i++) {
                    let tagMatching = false;
                    for (let j = 0; j < element.tags.length && !tagMatching; j++) {
                        if (element.tags[j].includes(tags[i]))
                            tagMatching = true;
                    }
                    if (!tagMatching)
                        containsAllTags = false;
                }
                if (!containsAllTags) {
                    let index = filteredData.indexOf(element);
                    if (index > -1)
                        filteredData.splice(index, 1);
                }
            });
        }
        reloadList(new Dataset(filteredData), util, ui);
    });

    ui["highlight_tag_input"].addEventListener("keyup", key => {
        switch(key.key){
            case ",":
                let v = ui["highlight_tag_input"].value.replaceAll(",","").toLowerCase();
                ui["highlight_tag_input"].value = "";
                if (v != "")
                    addTag(v, util, ui);
                break;
            case "Backspace":
                if(ui["highlight_tag_input"].value == "") {
                    let i = util["temporary_tags"].length;
                    if (i > 0) {
                        ui["highlight_tag_input"].value = util["temporary_tags"][i - 1];
                        removeTag(i - 1, util, ui);
                    }
                }
                break;
            default:
        }
    });

    ui["highlight_tag_input"].addEventListener("focusout", () => {
        let v = ui["highlight_tag_input"].value.replaceAll(",","").toLowerCase();
        ui["highlight_tag_input"].value = "";
        if (v != "")
            addTag(v, util, ui);
    });
}

async function main() {

    const dataset     = await loadDataset();
    const util        = getUtilData();
    const ui          = getInterfaceElements();

    reloadList(dataset, util, ui);
    setEventListeners(dataset, util, ui);

};

main();
