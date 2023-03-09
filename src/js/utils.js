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