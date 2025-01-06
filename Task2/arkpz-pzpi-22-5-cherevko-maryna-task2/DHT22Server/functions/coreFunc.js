function fnv1aHash(str) {
    const prime = 0x811C9DC5;
    let hash = prime;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
}

module.exports = {
    fnv1aHash
};