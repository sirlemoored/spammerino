
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
    let content = dataset.data[util["index"]].text;
    let text = content == "" ? "Empty copypasta :(" : content;
    item.querySelector(".spm-list-txt").innerText = text;
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

    item.querySelector(".spm-list-txt").addEventListener("click", () => {
        navigator.clipboard.writeText(content);
        let copiedInfo = item.querySelector(".spm-list-copied-info");
        copiedInfo.classList.remove("spm-list-copied-info-disabled");
        copiedInfo.classList.add("spm-list-copied-info-active");
        setTimeout(() => {
            copiedInfo.classList.add("spm-list-copied-info-disabled");
            copiedInfo.classList.remove("spm-list-copied-info-active");
        }, 500);

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
    interface["button_settings"]     = document.querySelector("#spm-btn-settings");
    interface["file_input"]          = document.querySelector("#spm-file-input");
    interface["button_import"]       = document.querySelector("#spm-btn-import");
    interface["button_export"]       = document.querySelector("#spm-btn-export");
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
        unshiftCopypasta(new Copypasta("", [], ""), dataset).then((_) => {
            loadDataset(dataset);
            reloadList(dataset, util, ui);
            toggleHighlight(ui);
        });
    });

    ui["button_close"].addEventListener("click", () => {
        toggleHighlight(ui);
    });

    ui["button_settings"].addEventListener("click", () => {
        let dropdown = document.querySelector("#spm-dropdown");
        dropdown.classList.toggle("spm-settings-out");
        dropdown.classList.toggle("spm-settings-in");
    });


    ui["highlight_save"].addEventListener("click", () => {
        let copypasta = new Copypasta("", [], "");
        copypasta.text = ui["highlight_text"].value.replaceAll("\n","");
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
                if (!containsTagsAny(element, tags) && !containsTextAny(element, tags)) {
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
                let v = ui["highlight_tag_input"].value.replaceAll(/[,\n]/g,"").toLowerCase().substring(0,25);
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
        let v = ui["highlight_tag_input"].value.replaceAll(/[,\n]/g,"").toLowerCase().substring(0, 25);
        ui["highlight_tag_input"].value = "";
        if (v != "")
            addTag(v, util, ui);
    });

    ui["file_input"].addEventListener("change", event => {
        let fs = ui["file_input"].files
        if (fs.length > 0) {
            let file = fs[0];
            let reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = ev => {
                let text = ev.target.result;
                try {
                    let obj = JSON.parse(text);
                    setData(DATA_KEY, obj).then(async _ => {
                    dataset = await loadDataset();
                    reloadList(dataset, util, ui);
                });
                } catch (e) {
                    console.log("Invalid JSON!");
                }
            };
        }
    });

    ui["button_import"].addEventListener("click", () => {
        ui["file_input"].click();
        let dropdown = document.querySelector("#spm-dropdown");
        dropdown.classList.toggle("spm-settings-out");
        dropdown.classList.toggle("spm-settings-in");
    });

    ui["button_export"].addEventListener("click", () => {
        // This code yoinked from https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataset));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "copypasta" + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        let dropdown = document.querySelector("#spm-dropdown");
        dropdown.classList.toggle("spm-settings-out");
        dropdown.classList.toggle("spm-settings-in");
    });

    ui["button_tag_clear"].addEventListener("click", () => {
        ui["tag_filter_input"].value = "";
        reloadList(dataset, util, ui);
    })
}

async function main() {

    const dataset     = await loadDataset();
    const util        = getUtilData();
    const ui          = getInterfaceElements();

    reloadList(dataset, util, ui);
    setEventListeners(dataset, util, ui);

};

main();
