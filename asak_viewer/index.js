mdui.setColorScheme('#000000');

const e_search = mdui.$('mdui-text-field');
const e_load = mdui.$('.load');
const e_container = mdui.$('.models');

var config = null;
var keyword = '';

function search(){
    models = [...config.models];
    if(keyword){
        models = models.filter(model => {
            return model.model.toLowerCase().includes(keyword.toLowerCase());
        });
    };
    generate_ele(models);
};
function generate_ele(models){
    e_container.html('');
    models.forEach(model => {
        let ele = `
        <mdui-card class="mdui-prose" clickable>
            <div class="line-group">
                <h3>${model.model}</h3>
                <mdui-button-icon icon="content_copy" onclick="
                    navigator.clipboard.writeText('${model.model}');
                    mdui.snackbar({message: 'Copied!', closeable: true})
                "></mdui-button-icon>
            </div>
            <p>Provider: ${model.provider}</p>
            <div class="line-group">
                <mdui-button variant="outlined" icon="content_copy" onclick="
                    navigator.clipboard.writeText('${config.providers[model.provider].base_url}');
                    mdui.snackbar({message: 'Copied!', closeable: true})
                ">Copy Base URL</mdui-button>
                <mdui-button variant="outlined" icon="content_copy" onclick="
                    navigator.clipboard.writeText('${config.providers[model.provider].key}');
                    mdui.snackbar({message: 'Copied!', closeable: true})
                ">Copy API Key</mdui-button>
            </div>
            <div class="line-group"><mdui-chip>RPM: ${model.rate_limit.rpm}</mdui-chip><mdui-chip>RPD: ${model.rate_limit.rpd}</mdui-chip></div>
            <div class="line-group">
        `;
        if(model.tags){
            model.tags.forEach(tag => {
                ele += `<mdui-chip>${tag}</mdui-chip>`;
            });
        };
        ele += `</div></mdui-card>`;
        e_container.append(ele);
    });
};

e_search.on('input', function(){
    keyword = e_search.val().trim();
    search();
    generate_ele(models);
});
e_load.on('click', function(){
    mdui.prompt({
        headline: 'Paste Your Config',
        closeOnEsc: true,
        closeOnOverlayClick: true,
        onConfirm: function(value){
            try{
                config = JSON.parse(value);
                localStorage.setItem('asak', value);
                search();
                generate_ele(models);
            }catch(e){
                console.error(e);
                mdui.alert('Invalid Config');
            };
        }
    });
});

if(localStorage.getItem('asak')){
    config = JSON.parse(localStorage.getItem('asak'));
    search();
    generate_ele(models);
};