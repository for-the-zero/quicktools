const ele_move_btn = $('.controls-bar button#move-btn');
const ele_edit_btn = $('.controls-bar button#edit-btn');
const ele_merge_btn = $('.controls-bar button#merge-btn');
const ele_split_btn = $('.controls-bar button#split-btn');
const ele_add_btn = $('.controls-bar button#add-btn');
const ele_del_btn = $('.controls-bar button#del-btn');

const ele_add_bar = $('.add-bar');
const ele_add_down = $('.add-bar button#add-down');
const ele_add_right = $('.add-bar button#add-right');

const ele_menu_btn = $('.controls-bar button#menu-btn');
const ele_menu = $('.menu');
const ele_saveimg = $('.as-list #save-img');
const ele_savejson = $('.as-list #save-json');
const ele_loadjson= $('.as-list #load-json');
const ele_divider_switch = $('.as-list #cell-divider');
// const ele_cp_json = $('.as-list #copypaste-json');
const ele_default = $('.as-list #default-table');
const ele_openaipanel = $('.as-list #open-aipanel');

const ele_fmt = $('.floating-merge-tip');

const ele_ce_text = $('.celledit-text-input');
const ele_ce_width = $('.celledit-size-input-x');
const ele_ce_height = $('.celledit-size-input-y');
const ele_ce_btn = $('.celledit-btn');
const ele_ce_panel = $('.editpanel');

const ele_aipanel = $('.aipanel');

const natele_canvas = document.getElementById('canvas');

var view_x = 0;
var view_y = 90;
const dpr = window.devicePixelRatio || 1.5;

// tool selection
var tool = 'move';
natele_canvas.style.cursor = 'move';
ele_move_btn.addClass('selected-controls');
ele_add_bar.hide();
ele_move_btn.on('click', function(){
    tool = 'move';
    ele_move_btn.addClass('selected-controls');
    ele_edit_btn.removeClass('selected-controls');
    ele_merge_btn.removeClass('selected-controls');
    ele_split_btn.removeClass('selected-controls');
    ele_add_btn.removeClass('selected-controls');
    ele_del_btn.removeClass('selected-controls');
    ele_add_bar.hide();
    natele_canvas.style.cursor = 'move';
});
ele_edit_btn.on('click', function(){
    tool = 'edit';
    ele_move_btn.removeClass('selected-controls');
    ele_edit_btn.addClass('selected-controls');
    ele_merge_btn.removeClass('selected-controls');
    ele_split_btn.removeClass('selected-controls');
    ele_add_btn.removeClass('selected-controls');
    ele_del_btn.removeClass('selected-controls');
    ele_add_bar.hide();
    natele_canvas.style.cursor = 'cell';
});
ele_merge_btn.on('click', function(){
    tool = 'merge';
    ele_move_btn.removeClass('selected-controls');
    ele_edit_btn.removeClass('selected-controls');
    ele_merge_btn.addClass('selected-controls');
    ele_split_btn.removeClass('selected-controls');
    ele_add_btn.removeClass('selected-controls');
    ele_del_btn.removeClass('selected-controls');
    ele_add_bar.hide();
    natele_canvas.style.cursor = 'pointer';
});
ele_split_btn.on('click', function(){
    tool = 'split';
    ele_move_btn.removeClass('selected-controls');
    ele_edit_btn.removeClass('selected-controls');
    ele_merge_btn.removeClass('selected-controls');
    ele_split_btn.addClass('selected-controls');
    ele_add_btn.removeClass('selected-controls');
    ele_del_btn.removeClass('selected-controls');
    ele_add_bar.hide();
    natele_canvas.style.cursor = 'pointer';
});
ele_add_btn.on('click', function(){
    tool = 'add';
    ele_move_btn.removeClass('selected-controls');
    ele_edit_btn.removeClass('selected-controls');
    ele_merge_btn.removeClass('selected-controls');
    ele_split_btn.removeClass('selected-controls');
    ele_add_btn.addClass('selected-controls');
    ele_del_btn.removeClass('selected-controls');
    ele_add_bar.css('flex-direction','row');
    ele_add_bar.show();
    natele_canvas.style.cursor = 'pointer';
});
ele_del_btn.on('click', function(){
    tool = 'del';
    ele_move_btn.removeClass('selected-controls');
    ele_edit_btn.removeClass('selected-controls');
    ele_merge_btn.removeClass('selected-controls');
    ele_split_btn.removeClass('selected-controls');
    ele_add_btn.removeClass('selected-controls');
    ele_del_btn.addClass('selected-controls');
    ele_add_bar.css('flex-direction','row-reverse');
    ele_add_bar.show();
    natele_canvas.style.cursor = 'pointer';
});

// add selection
var add_direction = 'down';
ele_add_down.on('click',function(){add_direction = 'down';ele_add_down.addClass('selected-add');ele_add_right.removeClass('selected-add');});
ele_add_right.on('click',function(){add_direction = 'right';ele_add_down.removeClass('selected-add');ele_add_right.addClass('selected-add');});

// menu
ele_menu_btn.on('click',function(){
    if(ele_menu.hasClass('show')){
        ele_menu.removeClass('show');
    }else{
        ele_menu.addClass('show');
    };
});
ele_saveimg.on('click',function(){
    let width = 20 + now_table.heads.rowh_height;
    let height = 20 + now_table.heads.colh_height;
    for(let i in now_table.heads.col){
        width += now_table.heads.col[i][1];
    };
    for(let i in now_table.heads.row){
        height += now_table.heads.row[i][1];
    };
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');
    taple(ctx,now_table,10,10,cell_divider);
    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = canvas.toDataURL();
    a.download = `${Date.now()}.png`;
    a.click();
    a.remove();
});
ele_savejson.on('click',function(){
    let json_str = JSON.stringify(now_table);
    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = URL.createObjectURL(new Blob([json_str], {type: 'application/json'}));
    a.download = `${Date.now()}.json`;
    a.click();
    a.remove();
}); 
ele_loadjson.on('click',function(){
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e){
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = function(e){
            let json_str = e.target.result;
            let json_obj = JSON.parse(json_str);
            now_table = json_obj;
            new_change();
        };
        reader.readAsText(file);
    };
    input.click();
    input.remove();
});
var cell_divider = true;
ele_divider_switch.on('click',function(){
    let val = ele_divider_switch.find('#scd_text').text();
    val = val.split(' : ')[1];
    if(val == 'ON'){
        cell_divider = false;
        ele_divider_switch.find('#scd_text').text('Cell Divider : OFF');
    } else {
        cell_divider = true;
        ele_divider_switch.find('#scd_text').text('Cell Divider : ON');
    };
});
// ele_cp_json.on('click',function(){
//     let pasted = prompt('Copy or Paste JSON here:',JSON.stringify(now_table));
//     if(pasted){
//         try{
//             pasted = pasted.trim();
//             console.dir(pasted); //太长了
//             let json_obj = JSON.parse(pasted);
//             taple(cvs_ctx,json_obj,0,0,cell_divider)
//             now_table = json_obj;
//             new_change();
//         } catch(e){
//             alert(e.message);
//         };
//     };
// });
ele_default.on('click',function(){
    let d1 = {heads:{col:[['c1',300],['c2',200],['c3',150],],row: [['r1',100],['r2',100],['r3',100],],colh_height: 80,rowh_height: 70},cells: {'0-0': ['cell1',true,'parent'],'0-1': ['cell2',false,null],'0-2': ['cell3',false,null],'1-0': ['cell9',true,'0-0'],'1-1': ['cell4',false,null],'1-2': ['cell5',false,null],'2-0': ['cell6',false,null],'2-1': ['cell8',false,null],'2-2': ['cell7',false,null],}};
    let d2 = {heads:{col:[['col',100]],row:[['row',100]],colh_height:100,rowh_height:100},cells:{"0-0":["cell",false,null]}};
    if(Math.random() < 0.5){
        now_table = d1;
    } else {
        now_table = d2;
    };
    new_change();
});
ele_openaipanel.on('click',function(){
    if(ele_aipanel.hasClass('show')){
        ele_aipanel.removeClass('show');
    } else {
        ele_menu.removeClass('show');
        ele_aipanel.addClass('show');
    };
});

var undo_history = [];
var undo_index = -1;
function new_change(){
    if(JSON.stringify(now_table) !== undo_history[undo_history.length + undo_index]){
        if(undo_index !== -1){
            undo_history = undo_history.slice(0,undo_index + 1);
            undo_index = -1;
        };
        undo_history.push(JSON.stringify(now_table));
        localStorage.setItem('taple_table',JSON.stringify(now_table));
    };
};
$(document).on('keydown',function(e){
    if(e.ctrlKey){
        if(e.key === 'z' || e.key === 'Z'){
            if(undo_index > -(undo_history.length)){
                undo_index--;
                now_table = JSON.parse(undo_history[undo_history.length + undo_index]);
            };
        } else if(e.key === 'y' || e.key === 'Y'){
            if(undo_index < -1){
                undo_index++;
                now_table = JSON.parse(undo_history[undo_history.length + undo_index]);
            };
        };
    };
});

const cvs_ctx = natele_canvas.getContext('2d');
var now_table = {};
if(localStorage.getItem('taple_table')){
    now_table = JSON.parse(localStorage.getItem('taple_table'));
} else {
    now_table = {
        heads: {
            col: [
                ['c1',300],
                ['c2',200],
                ['c3',150],
            ], 
            row: [
                ['r1',100],
                ['r2',100],
                ['r3',100],
            ],
            colh_height: 80,
            rowh_height: 70
        },
        cells: {
            '0-0': ['cell1',true,'parent'],
            '0-1': ['cell2',false,null],
            '0-2': ['cell3',false,null],
            '1-0': ['cell9',true,'0-0'],
            '1-1': ['cell4',false,null],
            '1-2': ['cell5',false,null],
            '2-0': ['cell6',false,null],
            '2-1': ['cell8',false,null],
            '2-2': ['cell7',false,null],
        }
    };
    localStorage.setItem('taple_table',JSON.stringify(now_table));
};
undo_history.push(JSON.stringify(now_table));
natele_canvas.width = window.innerWidth * dpr;
natele_canvas.height = window.innerHeight * dpr;
window.addEventListener('resize',function(){
    natele_canvas.width = window.innerWidth * dpr;
    natele_canvas.height = window.innerHeight * dpr;
});
function draw(){
    cvs_ctx.clearRect(0,0,natele_canvas.width,natele_canvas.height);
    cvs_ctx.strokeStyle = 'black';
    try{
        taple(cvs_ctx,now_table,view_x,view_y,cell_divider);
    }catch(e){
        // Fuck U man
    };
    let testing = false;
    if(!testing){
        requestAnimationFrame(draw);
    };
};
draw();

var mouse_down = false;
natele_canvas.addEventListener('mousedown',()=>{mouse_down = true;});
natele_canvas.addEventListener('mouseup',()=>{mouse_down = false;});
natele_canvas.addEventListener('mousemove',function(e){
    if(tool == 'move' && mouse_down){
        e.preventDefault();
        view_x += e.movementX * dpr;
        view_y += e.movementY * dpr;
    };
});
var last_pos_x = 0;
var last_pos_y = 0;
natele_canvas.addEventListener('touchstart',function(e){
    mouse_down = true;
    last_pos_x = e.touches[0].clientX;
    last_pos_y = e.touches[0].clientY;
});
natele_canvas.addEventListener('touchend',function(e){mouse_down = false;});
natele_canvas.addEventListener('touchmove',function(e){
    if(tool == 'move' && mouse_down){
        e.preventDefault();
        view_x += (e.touches[0].clientX - last_pos_x) * dpr;
        view_y += (e.touches[0].clientY - last_pos_y) * dpr;
        last_pos_x = e.touches[0].clientX;
        last_pos_y = e.touches[0].clientY;
    };
});

var merge_select = null;
var editing_cell = '';
function get_clicked_cell(ox,oy){
    let x = ox * dpr - view_x;
    let y = oy * dpr - view_y;
    let clicked_cell = { x: -1, y: -1 };
    let col_head_height = now_table.heads.colh_height;
    let row_head_width = now_table.heads.rowh_height;
    let vcursor_x = row_head_width;
    let vcursor_y = col_head_height;
    for (let i = 0; i < now_table.heads.col.length; i++) {
        if (x >= vcursor_x && x < vcursor_x + now_table.heads.col[i][1]) {
            clicked_cell.x = i;
            break;
        };
        vcursor_x += now_table.heads.col[i][1];
    };
    for (let j = 0; j < now_table.heads.row.length; j++) {
        if (y >= vcursor_y && y < vcursor_y + now_table.heads.row[j][1]) {
            clicked_cell.y = j;
            break;
        };
        vcursor_y += now_table.heads.row[j][1];
    };
    return clicked_cell;
};
natele_canvas.addEventListener('contextmenu',function(e){
    if(tool == 'edit' || tool == 'move'){
        e.preventDefault();
        let clicked_cell = get_clicked_cell(e.offsetX,e.offsetY);
        if(clicked_cell.x !== -1 && clicked_cell.y !== -1){
            if(now_table.cells[`${clicked_cell.y}-${clicked_cell.x}`][1] === false){
                navigator.clipboard.writeText(
                    now_table.cells[`${clicked_cell.y}-${clicked_cell.x}`][0]
                );
            } else {
                navigator.clipboard.writeText(
                    now_table.cells[now_table.cells[`${clicked_cell.y}-${clicked_cell.x}`][2]][0]
                );
            };
        } else if (clicked_cell.x !== -1 && clicked_cell.y === -1){
            navigator.clipboard.writeText(
                now_table.heads.col[clicked_cell.x][0]
            );
        } else {
            navigator.clipboard.writeText(
                now_table.heads.row[clicked_cell.y][0]
            );
        };
    };
});
natele_canvas.addEventListener('click',function(e){
    let clicked_cell = get_clicked_cell(e.offsetX,e.offsetY);

    if(tool == 'merge'){
        if(merge_select){
            ele_fmt.removeClass('show');
            if(clicked_cell.x !== -1 && clicked_cell.y !== -1 && merge_select.x !== -1 && merge_select.y !== -1 && merge_select !== clicked_cell){
                let x_diff = Math.abs(merge_select.x - clicked_cell.x);
                let y_diff = Math.abs(merge_select.y - clicked_cell.y);
                if((x_diff === 1 && y_diff === 0) || (x_diff === 0 && y_diff === 1)){
                    let clicked_cell_key = clicked_cell.y + '-' + clicked_cell.x;
                    let merge_select_key = merge_select.y + '-' + merge_select.x;
                    if(now_table.cells[clicked_cell_key][1] === false && now_table.cells[merge_select_key][1] === false){ //两者都为false
                        now_table.cells[clicked_cell_key][1] = true;
                        now_table.cells[clicked_cell_key][2] = 'parent';
                        now_table.cells[merge_select_key][1] = true;
                        now_table.cells[merge_select_key][2] = clicked_cell_key;
                    } else if(now_table.cells[clicked_cell_key][1] === true && now_table.cells[merge_select_key][1] === false){ //clicked_cell为true，merge_select为false
                        let parentKey = now_table.cells[clicked_cell_key][2] === 'parent' ? clicked_cell_key : now_table.cells[clicked_cell_key][2];
                        now_table.cells[merge_select_key][1] = true;
                        now_table.cells[merge_select_key][2] = parentKey;
                    } else if(now_table.cells[clicked_cell_key][1] === false && now_table.cells[merge_select_key][1] === true){ //clicked_cell为false，merge_select为true
                        let parentKey = now_table.cells[merge_select_key][2] === 'parent' ? merge_select_key : now_table.cells[merge_select_key][2];
                        now_table.cells[clicked_cell_key][1] = true;
                        now_table.cells[clicked_cell_key][2] = parentKey;
                    } else if(now_table.cells[clicked_cell_key][1] === true && now_table.cells[merge_select_key][1] === true){ //两者都为true
                        let root1 = clicked_cell_key;
                        while(now_table.cells[root1] && now_table.cells[root1][2] !== 'parent'){
                            root1 = now_table.cells[root1][2];
                        };
                        let root2 = merge_select_key;
                        while(now_table.cells[root2] && now_table.cells[root2][2] !== 'parent'){
                            root2 = now_table.cells[root2][2];
                        };
                        if(root1 !== root2){
                            now_table.cells[root2][2] = root1;
                            for(let k in now_table.cells){
                                if(now_table.cells[k][1] === true && now_table.cells[k][2] === root2){
                                    now_table.cells[k][2] = root1;
                                };
                            };
                        };
                    };
                    new_change();
                };
            };
            merge_select = null;
        } else {
            merge_select = clicked_cell;
            ele_fmt.find('span').text(merge_select.x + ',' + merge_select.y);
            ele_fmt.addClass('show');
        };
    } else {
        merge_select = null;
        ele_fmt.removeClass('show');
        if(tool == 'edit'){
            editing_cell = clicked_cell;
            if(editing_cell.x == -1){
                ele_ce_text.val(now_table.heads.row[editing_cell.y][0]);
                ele_ce_width.val(now_table.heads.rowh_height);
                ele_ce_width.parent().find('p span').text(now_table.heads.rowh_height);
                ele_ce_height.val(now_table.heads.row[editing_cell.y][1]);
                ele_ce_height.parent().find('p span').text(now_table.heads.row[editing_cell.y][1]);
                ele_ce_panel.addClass('show');
            } else if (editing_cell.y == -1){
                ele_ce_text.val(now_table.heads.col[editing_cell.x][0]);
                ele_ce_width.val(now_table.heads.col[editing_cell.x][1]);
                ele_ce_width.parent().find('p span').text(now_table.heads.col[editing_cell.x][1]);
                ele_ce_height.val(now_table.heads.colh_height);
                ele_ce_height.parent().find('p span').text(now_table.heads.colh_height);
                ele_ce_panel.addClass('show');
            } else {
                let cellKey = editing_cell.y + '-' + editing_cell.x;
                if (now_table.cells[cellKey][1] === true && now_table.cells[cellKey][2] !== 'parent') {
                    let parentCellKey = now_table.cells[cellKey][2];
                    ele_ce_text.val(now_table.cells[parentCellKey][0]);
                } else {
                    ele_ce_text.val(now_table.cells[cellKey][0]);
                };
                if(editing_cell.x == -1){
                    ele_ce_width.val(now_table.heads.rowh_height);
                    ele_ce_width.parent().find('p span').text(now_table.heads.rowh_height);
                    ele_ce_height.val(now_table.heads.row[editing_cell.y][1]);
                    ele_ce_height.parent().find('p span').text(now_table.heads.row[editing_cell.y][1]);
                } else if (editing_cell.y == -1){
                    ele_ce_width.val(now_table.heads.col[editing_cell.x][1]);
                    ele_ce_width.parent().find('p span').text(now_table.heads.col[editing_cell.x][1]);
                    ele_ce_height.val(now_table.heads.colh_height);
                    ele_ce_height.parent().find('p span').text(now_table.heads.colh_height);
                } else {
                    ele_ce_width.val(now_table.heads.col[editing_cell.x][1]);
                    ele_ce_width.parent().find('p span').text(now_table.heads.col[editing_cell.x][1]);
                    ele_ce_height.val(now_table.heads.row[editing_cell.y][1]);
                    ele_ce_height.parent().find('p span').text(now_table.heads.row[editing_cell.y][1]);
                };
                ele_ce_panel.addClass('show');
            };
            ele_ce_text.focus();
        } else if(tool == 'split'){
            if(now_table.cells[clicked_cell.y + '-' + clicked_cell.x][1]){
                let parentCellKey = now_table.cells[clicked_cell.y + '-' + clicked_cell.x][2];
                if(parentCellKey === 'parent'){
                    parentCellKey = clicked_cell.y + '-' + clicked_cell.x;
                };
                now_table.cells[parentCellKey][1] = false;
                now_table.cells[parentCellKey][2] = null;
                for(let key in now_table.cells){
                    if(now_table.cells[key][2] === parentCellKey){
                        now_table.cells[key][1] = false;
                        now_table.cells[key][2] = null;
                    };
                };
            };
            new_change();
        } else if(tool == 'add'){
            let new_table = JSON.parse(JSON.stringify(now_table));
            new_table.cells = {};
            if(add_direction == 'down'){ //向下添加一行
                new_table.heads.row.splice(clicked_cell.y+1,0,['new_row',125]);
                for(let key in now_table.cells){
                    let key_x = parseInt(key.split('-')[1]);
                    let key_y = parseInt(key.split('-')[0]);
                    if(key_y > clicked_cell.y){
                        key_y += 1;
                    };
                    let value = now_table.cells[key];
                    if(value !== null && value !== undefined && value[1] === true && value[2] !== 'parent'){
                        let parent_x = parseInt(value[2].split('-')[1]);
                        let parent_y = parseInt(value[2].split('-')[0]);
                        if(parent_y > clicked_cell.y){
                            parent_y += 1;
                        };
                        value[2] = parent_y+'-'+parent_x;
                    };
                    new_table.cells[key_y+'-'+key_x] = value;
                };
                for(let i=0;i<new_table.heads.col.length;i++){
                    let cellpos2beadd = {x:i,y:clicked_cell.y+1};
                    let cellkey2beadd = cellpos2beadd.y+'-'+cellpos2beadd.x;
                    let need_merge = false;
                    let merge_parent = null;
                    if( (cellpos2beadd.y-1)+'-'+cellpos2beadd.x in new_table.cells && (cellpos2beadd.y+1)+'-'+cellpos2beadd.x in new_table.cells ){
                        let upone = new_table.cells[(cellpos2beadd.y-1)+'-'+cellpos2beadd.x];
                        let downone = new_table.cells[(cellpos2beadd.y+1)+'-'+cellpos2beadd.x];
                        if(upone[1] === true && downone[1] === true){
                            if(upone[2] === downone[2] 
                                && upone[2] !== 'parent'
                            ){
                                need_merge = true;
                                merge_parent = upone[2];
                            } else if (upone[2] === 'parent' 
                                && downone[2] !== 'parent' 
                                && downone[2] === ((cellpos2beadd.y-1)+'-'+cellpos2beadd.x)
                            ){
                                need_merge = true;
                                merge_parent = downone[2];
                            } else if (upone[2] !== 'parent' 
                                && downone[2] === 'parent' 
                                && upone[2] === ((cellpos2beadd.y+1)+'-'+cellpos2beadd.x)
                            ){
                                need_merge = true;
                                merge_parent = upone[2];
                            };
                        };
                    };
                    new_table.cells[cellkey2beadd] = ['',need_merge,merge_parent];
                };
            }else if(add_direction == 'right'){ //向右添加一列
                new_table.heads.col.splice(clicked_cell.x+1,0,['new_col',125]);
                for(let key in now_table.cells){
                    let key_x = parseInt(key.split('-')[1]);
                    let key_y = parseInt(key.split('-')[0]);
                    if(key_x > clicked_cell.x){
                        key_x += 1;
                    };
                    let value = now_table.cells[key];
                    if(value !== null && value !== undefined && value[1] === true && value[2] !== 'parent'){
                        let parent_x = parseInt(value[2].split('-')[1]);
                        let parent_y = parseInt(value[2].split('-')[0]);
                        if(parent_x > clicked_cell.x){
                            parent_x += 1;
                        };
                        value[2] = parent_y+'-'+parent_x;
                    };
                    new_table.cells[key_y+'-'+key_x] = value;
                };
                for(let i=0;i<new_table.heads.row.length;i++){
                    let cellpos2beadd = {x:clicked_cell.x+1,y:i};
                    let cellkey2beadd = cellpos2beadd.y+'-'+cellpos2beadd.x;
                    let need_merge = false;
                    let merge_parent = null;
                    if( cellpos2beadd.y+'-'+(cellpos2beadd.x-1) in new_table.cells && cellpos2beadd.y+'-'+(cellpos2beadd.x+1) in new_table.cells ){
                        let leftone = new_table.cells[cellpos2beadd.y+'-'+(cellpos2beadd.x-1)];
                        let rightone = new_table.cells[cellpos2beadd.y+'-'+(cellpos2beadd.x+1)];
                        if(leftone[1] === true && rightone[1] === true){
                            if(leftone[2] === rightone[2] 
                                && leftone[2] !== 'parent'
                            ){
                                need_merge = true;
                                merge_parent = leftone[2];
                            } else if (leftone[2] === 'parent' 
                                && rightone[2] !== 'parent' 
                                && rightone[2] === cellpos2beadd.y+'-'+(cellpos2beadd.x-1)
                            ){
                                need_merge = true;
                                merge_parent = rightone[2];
                            } else if (leftone[2] !== 'parent' 
                                && rightone[2] === 'parent' 
                                && leftone[2] === cellpos2beadd.y+'-'+(cellpos2beadd.x+1)
                            ){
                                need_merge = true;
                                merge_parent = leftone[2];
                            };
                        };
                    };
                    new_table.cells[cellkey2beadd] = ['',need_merge,merge_parent];
                };
            };
            now_table = new_table;
            new_change();
        } else if(tool == 'del'){
            let new_table = JSON.parse(JSON.stringify(now_table));
            new_table.cells = {};
            if(add_direction == 'down'){ //向下删除一行
                if(clicked_cell.x !== -1){
                    let new_table = JSON.parse(JSON.stringify(now_table));
                    new_table.cells = {};
                    new_table.heads.col.splice(clicked_cell.x, 1);
                    let parents2del = [];
                    for(let key in now_table.cells){
                        let key_x = parseInt(key.split('-')[1]);
                        let key_y = parseInt(key.split('-')[0]);
                        let value = [...now_table.cells[key]];
                        if (key_x === clicked_cell.x){continue;};
                        if (key_x > clicked_cell.x) {
                            key_x -= 1;
                        };
                        if (key_x === clicked_cell.x && value[1] && value[2] === 'parent') {
                            parents2del.push(`${key_y}-${clicked_cell.x}`);
                        };
                        if (value[1] === true && value[2] !== null && value[2] !== 'parent') {
                            let [parent_y, parent_x] = value[2].split('-').map(Number);
                            if (parent_x === clicked_cell.x) {
                                value[1] = false;
                                value[2] = null;
                            } else if (parent_x > clicked_cell.x) {
                                value[2] = `${parent_y}-${parent_x - 1}`;
                            };
                        };
                        new_table.cells[`${key_y}-${key_x}`] = value;
                    };
                    for (let key in new_table.cells) {
                        let value = new_table.cells[key];
                        if (value[1] === true && value[2] !== null && parents2del.includes(value[2])) {
                            value[1] = false;
                            value[2] = null;
                        };
                    };
                    now_table = {...new_table};
                };
            }else if(add_direction == 'right'){ //向右删除一列
                if(clicked_cell.y !== -1){
                    let new_table = JSON.parse(JSON.stringify(now_table));
                    new_table.cells = {};
                    new_table.heads.row.splice(clicked_cell.y, 1);
                    let parents2del = [];
                    for(let key in now_table.cells){
                        let key_x = parseInt(key.split('-')[1]);
                        let key_y = parseInt(key.split('-')[0]);
                        let value = [...now_table.cells[key]];
                        if (key_y === clicked_cell.y){continue;};
                        if (key_y > clicked_cell.y) {
                            key_y -= 1;
                        };
                        if (key_y === clicked_cell.y && value[1] && value[2] === 'parent') {
                            parents2del.push(`${clicked_cell.y}-${key_x}`);
                        };
                        if (value[1] === true && value[2] !== null && value[2] !== 'parent') {
                            let [parent_y, parent_x] = value[2].split('-').map(Number);
                            if (parent_y === clicked_cell.y) {
                                value[1] = false;
                                value[2] = null;
                            } else if (parent_y > clicked_cell.y) {
                                value[2] = `${parent_y - 1}-${parent_x}`;
                            };
                        };
                        new_table.cells[`${key_y}-${key_x}`] = value;
                    };
                    for (let key in new_table.cells) {
                        let value = new_table.cells[key];
                        if (value[1] === true && value[2] !== null && parents2del.includes(value[2])) {
                            value[1] = false;
                            value[2] = null;
                        };
                    };
                    now_table = {...new_table};
                };
            };
            new_change();
        };
    };
});

// edit
/* ele_ce_btn.on('click',function(){ele_ce_panel.removeClass('show');let cell_index=editing_cell.y+'-'+editing_cell.x;let cell_text=ele_ce_text.val();let cell_width=parseInt(ele_ce_width.val());let cell_height=parseInt(ele_ce_height.val());if(editing_cell.x==-1){now_table.heads.row[editing_cell.y][0]=cell_text;now_table.heads.row[editing_cell.y][1]=cell_height;now_table.heads.rowh_height=cell_width}else if(editing_cell.y==-1){now_table.heads.col[editing_cell.x][0]=cell_text;now_table.heads.col[editing_cell.x][1]=cell_width;now_table.heads.colh_height=cell_height}else{if(now_table.cells[cell_index][1]===true&&now_table.cells[cell_index][2]!=='parent'){let parentCellKey=now_table.cells[cell_index][2];now_table.cells[parentCellKey][0]=cell_text}else{now_table.cells[cell_index][0]=cell_text};now_table.heads.col[editing_cell.x][1]=cell_width;now_table.heads.row[editing_cell.y][1]=cell_height}}); */
ele_ce_width.on('input',function(){
    let val = parseInt($(this).val());
    $(this).parent().find('p span').text(val);
    if(editing_cell.x == -1){
        now_table.heads.rowh_height = val;
    } else if (editing_cell.y == -1){
        now_table.heads.col[editing_cell.x][1] = val;
    } else {
        now_table.heads.col[editing_cell.x][1] = val;
    };
});
ele_ce_height.on('input',function(){
    let val = parseInt($(this).val());
    $(this).parent().find('p span').text(val);
    if(editing_cell.x == -1){
        now_table.heads.row[editing_cell.y][1] = val;
    } else if (editing_cell.y == -1){
        now_table.heads.colh_height = val;
    } else {
        now_table.heads.row[editing_cell.y][1] = val;
    };
});
ele_ce_text.on('input',function(){
    let val = $(this).val();
    if(editing_cell.x == -1){
        now_table.heads.row[editing_cell.y][0] = val;
    } else if (editing_cell.y == -1){
        now_table.heads.col[editing_cell.x][0] = val;
    } else {
        let cell_index = editing_cell.y + '-' + editing_cell.x;
        if(now_table.cells[cell_index][1] === true && now_table.cells[cell_index][2] !== 'parent'){
            let parentCellKey = now_table.cells[cell_index][2];
            now_table.cells[parentCellKey][0] = val;
        } else {
            now_table.cells[cell_index][0] = val;
        };
    };
});
ele_ce_btn.on('click',function(){
    ele_ce_panel.removeClass('show');
    new_change();
});
