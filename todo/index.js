var todolist;
todolist = localStorage.getItem('todo');
if(todolist == null){
    todolist = [];
    localStorage.setItem('todo',JSON.stringify(todolist))
};
todolist = JSON.parse(todolist);
reflashlist();

document.getElementsByTagName('form')[0].addEventListener('submit',
    function(e){
        e.preventDefault();
        //console.log(e);
        addtodo()
    }
);
function addtodo(){
    let inputval = $('input').val();
    if (inputval != ''){todolist.unshift([inputval,false]);};
    localStorage.setItem('todo',JSON.stringify(todolist))
    $('input').val('');
    reflashlist();
};
function reflashlist(){
    $('ul').off()
    $('ul').empty()
    todolist.forEach(function(i,index,all){
        let liele = $('<li>').text(i[0]);
        if(i[1]){
            liele.attr('class','done');
        }
        $('ul').append(liele);
        /*
        $('li:last').on('mousedown',
            function(event){
                if (event.which === 1) {
                    swichthis(index);
                } else if (event.which === 3) {
                    event.preventDefault();
                    delthis(index);
                    event.preventDefault();
                }
                reflashlist();
            }
        );
        */
        $('li:last').click(function(){swichthis(index);reflashlist();});
        $('li:last').contextmenu(function(){event.preventDefault();delthis(index);reflashlist();});
    });
};
function swichthis(index){
    todolist[index][1] = !todolist[index][1];
    localStorage.setItem('todo',JSON.stringify(todolist))
};
function delthis(index){
    todolist.splice(index,1);
    localStorage.setItem('todo',JSON.stringify(todolist))
};