const DATA_KEY = "data";


/* Local storage handling */
function fetchData(key) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
            if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError)
            else
                resolve(result[key] ? result[key] : [])
        })
    });
}

function setData(key, value) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({[key]: value}, () => {
            if (chrome.runtime.lastError)
                reject(chrome.runtime.lastError)
            else
                resolve(true)
        })
    });
}

/* Scoped dataset handling */
async function loadDataset() {
    let result = await fetchData(DATA_KEY);
    return new Dataset(result[DATA_KEY]);
}

async function insertCopypasta(copypasta, dataset) {
    dataset.addCopypasta(copypasta);
    return setData(DATA_KEY, dataset);
}

async function setCopypastaAt(index, copypasta, dataset) {
    dataset.setCopypastaAt(index, copypasta);
    return setData(DATA_KEY, dataset);
}

async function removeCopypastaAt(index, dataset) {
    dataset.removeCopypastaAt(index);
    return setData(DATA_KEY, dataset);
}