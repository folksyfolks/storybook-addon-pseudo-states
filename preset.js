function managerEntries(entry = []) {
    return [...entry, require.resolve("./dist/cjs/preset/manager")]
}

function config(entry = []) {
    return [...entry, require.resolve("./dist/cjs/preset/preview")]
}

module.exports = { managerEntries, config };
