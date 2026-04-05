const e_baseurl = $('.baseurl');
const e_apikey = $('.apikey');
const e_modelname = $('.modelname');
const e_message = $('.message');
const e_request = $('mdui-button');
const e_card = $('mdui-card');

mdui.setColorScheme('#000080');
e_request.on('click', function(){
    let baseurl = e_baseurl.val();
    let apikey = e_apikey.val();
    let modelname = e_modelname.val();
    let message = e_message.val();
    if(baseurl && apikey && modelname && message){
        e_card.html('');
            $.ajax({
                // OpenAI
                url: baseurl + '/chat/completions',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + apikey,
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    model: modelname,
                    messages: [{role: 'user', content: message}],
                    stream: true,
                }),
            xhrFields: {onprogress: function(e){
                let raw = e.currentTarget.responseText;
                let chunks = raw.split('\n\n').filter(Boolean);
                let res_text = '';
                for(let chunk of chunks){
                    if(chunk.startsWith('data: ')){
                        if(chunk.includes('[DONE]')){
                            res_text += '\n[DONE]';
                            break;
                        };
                        let data = JSON.parse(chunk.slice(6));
                        let delta = data.choices[0].delta;
                        // if(delta.reasoning){
                        //     if(!res_text.startsWith('<think>')){
                        //         res_text += '<think>\n' + delta.reasoning;
                        //     };
                        // }else if(delta.reasoning_content){
                        //     if(!res_text.startsWith('<think>')){
                        //         res_text += '<think>\n' + delta.reasoning_content;
                        //     };
                        // };
                        if(delta.content){
                            // if(!res_text.includes('</think>') && res_text){
                            //     res_text += '\n</think>\n';
                            // };
                            res_text += delta.content;
                        };
                    };
                    e_card.text(res_text);
                };
            }},
            error: function(xhr, status, error){
                console.error(error);
                let err_txt = 'Something went wrong:\n';
                err_txt += 'Status: ' + status + '\n';
                err_txt += 'Error: ' + error.message + '\n';
                e_card.text(err_txt);
            },
        });
    };
});