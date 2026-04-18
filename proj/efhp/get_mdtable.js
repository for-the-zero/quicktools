async function fetchJson(url) {
    const response = await fetch(url);
    const text = await response.text();
    return JSON.parse(text);
};
function formatItemList(items, itemNames) {
    if (!items || Object.keys(items).length === 0) return '无';
    return Object.entries(items)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([itemId, count]) => `${itemNames[itemId] || itemId} x${count}`)
        .join(' ');
};
export default async function get_mdtable(recipes_url, i18n_url) {
    let data, i18n;
    try{
        data = await fetchJson(recipes_url);
        i18n = await fetchJson(i18n_url);
    }catch(e){
        console.error(e);
        return [e.message, '', false];
    };
    const itemNames = i18n.items || {};
    const version = data.version?.['arknights-endfield'] || 'unknown';
    const recipesByProducer = {};
    data.recipes.forEach(recipe => {
        recipe.producers.forEach(producer => {
            if (!recipesByProducer[producer]) {
                recipesByProducer[producer] = [];
            }
            recipesByProducer[producer].push(recipe);
        });
    });
    const lines = [];
    for (const producer of Object.keys(recipesByProducer).sort()) {
        const recipes = recipesByProducer[producer];
        const producerName = itemNames[producer] || producer;
        lines.push(`### ${producerName}：`);
        lines.push('');
        lines.push('原料 | 用时 | 产物');
        lines.push(':--: | :--: | :--:');
        recipes.sort((a, b) => a.id.localeCompare(b.id)).forEach(recipe => {
            const inputs = formatItemList(recipe.in, itemNames);
            const outputs = formatItemList(recipe.out, itemNames);
            const time = `${recipe.time}s`;
            lines.push(`${inputs} | ${time} | ${outputs}`);
        });

        lines.push('');
    };
    return [version, lines.join('\n'), true];
};