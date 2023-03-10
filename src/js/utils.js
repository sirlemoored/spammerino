class Copypasta {
    
    text = "";
    tags = [];
    added = "";

    constructor(text, tags, added) {
        this.text = text;
        this.tags = tags;
        this.added = added;
    }

}

class Dataset {
    
    data = [];

    constructor(data) {
        if (data == null)
            this.data = [];
        else
            this.data = data;
    }

    addCopypasta(pasta) {
        if (pasta != null)
            this.data.push(pasta);
    }

    addCopypastaBegin(pasta) {
        if (pasta != null)
            this.data.unshift(pasta);
    }

    removeCopypastaAt(index) {
        if (this.data.length > index)
            this.data.splice(index, 1);
    }

    setCopypastaAt(index, copypasta) {
        if (this.data.length > index)
            this.data[index] = copypasta;
    }

}

function containsTagsAll(element, tags) {
    let containsAllTags = true;
    for (let i = 0; i < tags.length && containsAllTags; i++) {
        let tagMatching = false;
        for (let j = 0; j < element.tags.length && !tagMatching; j++) {
            if (element.tags[j].includes(tags[i].toLowerCase()))
                tagMatching = true;
        }
        if (!tagMatching)
            containsAllTags = false;
    }
    return containsAllTags;
}

function containsTagsAny(element, tags) {
    let containsAnyTag = false;
    for (let i = 0; i < tags.length && !containsAnyTag; i++) {
        let tagMatching = false;
        for (let j = 0; j < element.tags.length && !tagMatching; j++) {
            if (element.tags[j].includes(tags[i].toLowerCase()))
                tagMatching = true;
        }
        if (tagMatching)
            containsAnyTag = true;
    }
    return containsAnyTag;
}

function containsTextAll(element, words) {
    let containsAllWords = true;
    for (let i = 0; i < words.length && containsAllWords; i++) {
        if (!element.text.toLowerCase().includes(words[i].toLowerCase()))
            containsAllWords = false;
    }
    return containsAllWords;
}

function containsTextAny(element, words) {
    let containsAnyWord = false;
    for (let i = 0; i < words.length && !containsAnyWord; i++) {
        if (element.text.toLowerCase().includes(words[i].toLowerCase()))
            containsAnyWord = true;
    }
    return containsAnyWord;
}