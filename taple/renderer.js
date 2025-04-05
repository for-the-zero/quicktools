function draw_text(ctx, text, x, y, width, height) {
    if (text.length > 0 && text.trim().length > 0) {
        // 自适应字体大小
        let font_family = 'Wanted Sans Std,Noto Sans SC';
        let font_size = '50'; // max
        let text_lines = [];
        let text_line = '';
        let chars = text.split('');
        let line_height = 0;
        let lines_height = 0;
        while (font_size > 1) {
            text_lines = [];
            text_line = '';
            ctx.font = `${font_size}px ${font_family}`;
            for (let char of chars) {
                if (char == '\n') {
                    text_lines.push(text_line);
                    text_line = '';
                }
                else if (ctx.measureText(text_line + char).width > width) {
                    text_lines.push(text_line);
                    text_line = char;
                } else {
                    text_line += char;
                };
            };
            text_lines.push(text_line);
            line_height = ctx.measureText('哈').width * 1.05;
            lines_height = line_height * text_lines.length;
            if (lines_height > height) {
                font_size -= 1;
            } else {
                break;
            };
        };
        // 后退一下并绘制文字
        font_size -= 3;
        ctx.font = `${font_size}px ${font_family}`;
        text_lines = [];
        text_line = '';
        for (let char of chars) {
            if (char == '\n') {
                text_lines.push(text_line);
                text_line = '';
            }
            else if (ctx.measureText(text_line + char).width > width) {
                text_lines.push(text_line);
                text_line = char;
            } else {
                text_line += char;
            };
        };
        text_lines.push(text_line);
        line_height = ctx.measureText('哈').width * 1.05;
        lines_height = line_height * text_lines.length;
        ctx.textBaseline = 'top';
        for (let i = 0; i < text_lines.length; i++) {
            ctx.fillText(text_lines[i], x + (width - ctx.measureText(text_lines[i]).width) / 2, y + i * line_height + (height - lines_height) / 2);
        };
    };
};
function draw_line(ctx, from_x, from_y, to_x, to_y, width) {
    ctx.beginPath();
    ctx.moveTo(from_x, from_y);
    ctx.lineTo(to_x, to_y);
    ctx.lineWidth = width;
    ctx.stroke();
};
function draw_point(ctx, x, y, size) {
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
};

function get_cell_pos(cell_index, head_obj) {
    let pos = 0;
    for (let i = 0; i < cell_index; i++) {
        pos += head_obj[i][1];
    };
    return pos;
};


function taple(ctx, table_obj, x, y, is_divider) {
    let vcursor = { x: x, y: y };

    // 画列头
    vcursor = { x: x, y: y };
    vcursor.x += table_obj.heads.rowh_height;
    for (let col of table_obj.heads.col) {
        draw_text(ctx, col[0], vcursor.x, vcursor.y, col[1], table_obj.heads.colh_height);
        if (table_obj.heads.col.indexOf(col) !== 0 && is_divider) {
            draw_line(ctx, vcursor.x, vcursor.y + table_obj.heads.colh_height, vcursor.x, vcursor.y + table_obj.heads.colh_height - 10, 4);
        };
        vcursor.x += col[1];
    };
    // 画列分割线
    vcursor.x = x + table_obj.heads.rowh_height;
    vcursor.y += table_obj.heads.colh_height;
    let total_width = table_obj.heads.col.reduce((acc, cur) => acc + cur[1], 0);
    draw_line(ctx, vcursor.x, vcursor.y, vcursor.x + total_width, vcursor.y, 4);

    // 画行头
    vcursor = { x: x, y: y };
    vcursor.y += table_obj.heads.colh_height;
    for (let row of table_obj.heads.row) {
        draw_text(ctx, row[0], vcursor.x, vcursor.y, table_obj.heads.rowh_height, row[1]);
        if (table_obj.heads.row.indexOf(row) !== 0 && is_divider) {
            draw_line(ctx, vcursor.x + table_obj.heads.rowh_height, vcursor.y, vcursor.x + table_obj.heads.rowh_height - 10, vcursor.y, 4);
        };
        vcursor.y += row[1];
    };
    // 画行分割线
    vcursor.x = x + table_obj.heads.rowh_height;
    vcursor.y = y + table_obj.heads.colh_height + table_obj.heads.row.reduce((acc, cur) => acc + cur[1], 0);
    total_width = table_obj.heads.row.reduce((acc, cur) => acc + cur[1], 0);
    draw_line(ctx, vcursor.x, vcursor.y, vcursor.x, vcursor.y - total_width, 4);
    // fix
    vcursor.x = x + table_obj.heads.rowh_height;
    vcursor.y = y + table_obj.heads.colh_height;
    draw_point(ctx, vcursor.x, vcursor.y, 4);

    // 画单元格
    let spcell_list = []; // list[n] = [parent_key, [child_key1, child_key2, ...]]
    for (let cell_key in table_obj.cells) {
        let cell_data = table_obj.cells[cell_key];
        if (!cell_data[1]) {
            let cell_index = { x: parseInt(cell_key.split('-')[1], 10), y: parseInt(cell_key.split('-')[0], 10) };
            let cell_width = table_obj.heads.col[cell_index.x][1];
            let cell_height = table_obj.heads.row[cell_index.y][1];
            vcursor.x = x + table_obj.heads.rowh_height;
            vcursor.x = vcursor.x + get_cell_pos(cell_index.x, table_obj.heads.col);
            vcursor.y = y + table_obj.heads.colh_height;
            vcursor.y = vcursor.y + get_cell_pos(cell_index.y, table_obj.heads.row);
            draw_text(ctx, cell_data[0], vcursor.x, vcursor.y, cell_width, cell_height);
            if (is_divider) {
                // 左上
                draw_line(ctx, vcursor.x, vcursor.y, vcursor.x, vcursor.y + 10, 4);
                draw_line(ctx, vcursor.x, vcursor.y, vcursor.x + 10, vcursor.y, 4);
                draw_point(ctx, vcursor.x, vcursor.y, 4);
                // 右上
                if (cell_index.x < table_obj.heads.col.length - 1) {
                    draw_line(ctx, vcursor.x + cell_width, vcursor.y, vcursor.x + cell_width - 10, vcursor.y, 4);
                    draw_line(ctx, vcursor.x + cell_width, vcursor.y, vcursor.x + cell_width, vcursor.y + 10, 4);
                    draw_point(ctx, vcursor.x + cell_width, vcursor.y, 4);
                };
                // 左下
                if (cell_index.y < table_obj.heads.row.length - 1) {
                    draw_line(ctx, vcursor.x, vcursor.y + cell_height, vcursor.x, vcursor.y + cell_height - 10, 4);
                    draw_line(ctx, vcursor.x, vcursor.y + cell_height, vcursor.x + 10, vcursor.y + cell_height, 4);
                    draw_point(ctx, vcursor.x, vcursor.y + cell_height, 4);
                };
                // 右下
                if (cell_index.x < table_obj.heads.col.length - 1 && cell_index.y < table_obj.heads.row.length - 1) {
                    draw_line(ctx, vcursor.x + cell_width, vcursor.y + cell_height, vcursor.x + cell_width, vcursor.y + cell_height - 10, 4);
                    draw_line(ctx, vcursor.x + cell_width, vcursor.y + cell_height, vcursor.x + cell_width - 10, vcursor.y + cell_height, 4);
                    draw_point(ctx, vcursor.x + cell_width, vcursor.y + cell_height, 4);
                };
            };
        } else {


            let find_index = find_it_in_spcell_list(cell_data[2], spcell_list);
            if (cell_data[2] === 'parent' && find_it_in_spcell_list(cell_key, spcell_list) === -1) {
                spcell_list.push([cell_key, [cell_key]]);
            } else if (cell_data[2] !== 'parent' && find_index === -1) {
                spcell_list.push([cell_data[2], [cell_data[2], cell_key]]);
            } else {
                let find_index = find_it_in_spcell_list(cell_data[2], spcell_list);
                if (cell_data[2] === 'parent' && find_it_in_spcell_list(cell_key, spcell_list) === -1) {
                    spcell_list.push([cell_key, [cell_key]]);
                } else if (cell_data[2] !== 'parent' && find_index === -1) {
                    spcell_list.push([cell_data[2], [cell_data[2], cell_key]]);
                } else {
                    if (find_index !== -1) {
                        spcell_list[find_index][1].push(cell_key);
                    }
                };
            };
        };
    };
    handle_spcell_list(ctx, table_obj, x, y, is_divider, spcell_list);
};
function find_it_in_spcell_list(cell_key, spcell_list) {
    for (let i = 0; i < spcell_list.length; i++) {
        if (spcell_list[i][0] === cell_key) {
            return i;
        };
    };
    return -1;
};
function handle_spcell_list(ctx, table_obj, x, y, is_divider, spcell_list) {
    for (let spcell_obj of spcell_list) {
        let spcell_text = table_obj.cells[spcell_obj[0]][0];
        let top = Infinity, left = Infinity, bottom = -Infinity, right = -Infinity;
        for (let cell_key of spcell_obj[1]) {
            let [row, col] = cell_key.split('-').map(Number);
            top = Math.min(top, row);
            left = Math.min(left, col);
            bottom = Math.max(bottom, row);
            right = Math.max(right, col);
        };
        let center_x = Math.round((left + right) / 2);
        let center_y = Math.round((top + bottom) / 2);
        let closest = `${center_y}-${center_x}`;
        if (!spcell_obj[1].includes(closest)) {
            let min_dist = Infinity;
            for (let cell_key of spcell_obj[1]) {
                let [row, col] = cell_key.split('-').map(Number);
                let dist = Math.sqrt((row - center_y) ** 2 + (col - center_x) ** 2);
                if (dist < min_dist) {
                    closest = cell_key;
                    min_dist = dist;
                };
            };
        };
        let [row, col] = closest.split('-').map(Number);
        let allincluded_cells = [];
        let hor_cells = [];
        allincluded_cells.push(closest);
        while (spcell_obj[1].includes(`${row}-${col - 1}`)) {
            col--;
            allincluded_cells.push(`${row}-${col}`);
        };
        while (spcell_obj[1].includes(`${row}-${col + 1}`)) {
            col++;
            allincluded_cells.push(`${row}-${col}`);
        };
        hor_cells = [...allincluded_cells];
        while (true) {
            let canExpandUp = true;
            for (let hor_cell of hor_cells) {
                let [hor_row, hor_col] = hor_cell.split('-').map(Number);
                if (!spcell_obj[1].includes(`${hor_row - 1}-${hor_col}`)) {
                    canExpandUp = false;
                    break;
                };
            };
            if (canExpandUp) {
                for (let hor_cell of hor_cells) {
                    let [hor_row, hor_col] = hor_cell.split('-').map(Number);
                    allincluded_cells.push(`${hor_row - 1}-${hor_col}`);
                };
                hor_cells = hor_cells.map(cell => {
                    let [hor_row, hor_col] = cell.split('-').map(Number);
                    return `${hor_row - 1}-${hor_col}`;
                });
            } else {
                break;
            };
        };
        while (true) {
            let canExpandDown = true;
            for (let hor_cell of hor_cells) {
                let [hor_row, hor_col] = hor_cell.split('-').map(Number);
                if (!spcell_obj[1].includes(`${hor_row + 1}-${hor_col}`)) {
                    canExpandDown = false;
                    break;
                };
            };
            if (canExpandDown) {
                for (let hor_cell of hor_cells) {
                    let [hor_row, hor_col] = hor_cell.split('-').map(Number);
                    allincluded_cells.push(`${hor_row + 1}-${hor_col}`);
                };
                hor_cells = hor_cells.map(cell => {
                    let [hor_row, hor_col] = cell.split('-').map(Number);
                    return `${hor_row + 1}-${hor_col}`;
                });
            } else {
                break;
            };
        };
        top = Infinity, left = Infinity, bottom = -Infinity, right = -Infinity;
        for (let cell_key of allincluded_cells) {
            let [row, col] = cell_key.split('-').map(Number);
            top = Math.min(top, row);
            left = Math.min(left, col);
            bottom = Math.max(bottom, row);
            right = Math.max(right, col);
        };
        left = x + table_obj.heads.rowh_height + get_cell_pos(left, table_obj.heads.col);
        top = y + table_obj.heads.colh_height + get_cell_pos(top, table_obj.heads.row);
        right = x + table_obj.heads.rowh_height + get_cell_pos(right, table_obj.heads.col) + table_obj.heads.col[right][1];
        bottom = y + table_obj.heads.colh_height + get_cell_pos(bottom, table_obj.heads.row) + table_obj.heads.row[bottom][1];
        draw_text(ctx, spcell_text, left, top, right - left, bottom - top);

        if (is_divider) {
            for (let cell_key of spcell_obj[1]) {
                let vcursor = { x: x, y: y };
                let cell_index = { x: parseInt(cell_key.split('-')[1], 10), y: parseInt(cell_key.split('-')[0], 10) };
                let cell_width = table_obj.heads.col[cell_index.x][1];
                let cell_height = table_obj.heads.row[cell_index.y][1];
                vcursor.x = x + table_obj.heads.rowh_height;
                vcursor.x = vcursor.x + get_cell_pos(cell_index.x, table_obj.heads.col);
                vcursor.y = y + table_obj.heads.colh_height + get_cell_pos(cell_index.y, table_obj.heads.row);
                // 左上
                if (
                    (cell_index.x > 0 && !spcell_obj[1].includes(`${cell_index.y}-${cell_index.x - 1}`)) &&
                    (cell_index.y > 0 && !spcell_obj[1].includes(`${cell_index.y - 1}-${cell_index.x}`))
                ) {
                    draw_line(ctx, vcursor.x, vcursor.y, vcursor.x, vcursor.y + 10, 4);
                    draw_line(ctx, vcursor.x, vcursor.y, vcursor.x + 10, vcursor.y, 4);
                    draw_point(ctx, vcursor.x, vcursor.y, 4);
                };
                // 右上
                if (
                    cell_index.x < table_obj.heads.col.length - 1 &&
                    (cell_index.y > 0 && !spcell_obj[1].includes(`${cell_index.y - 1}-${cell_index.x}`)) &&
                    !spcell_obj[1].includes(`${cell_index.y}-${cell_index.x + 1}`)
                ) {
                    draw_line(ctx, vcursor.x + cell_width, vcursor.y, vcursor.x + cell_width - 10, vcursor.y, 4);
                    draw_line(ctx, vcursor.x + cell_width, vcursor.y, vcursor.x + cell_width, vcursor.y + 10, 4);
                    draw_point(ctx, vcursor.x + cell_width, vcursor.y, 4);
                };

                // 左下
                if (
                    (cell_index.x > 0 && !spcell_obj[1].includes(`${cell_index.y}-${cell_index.x - 1}`)) &&
                    (cell_index.y < table_obj.heads.row.length - 1 && !spcell_obj[1].includes(`${cell_index.y + 1}-${cell_index.x}`))
                ) {
                    draw_line(ctx, vcursor.x, vcursor.y + cell_height, vcursor.x, vcursor.y + cell_height - 10, 4);
                    draw_line(ctx, vcursor.x, vcursor.y + cell_height, vcursor.x + 10, vcursor.y + cell_height, 4);
                    draw_point(ctx, vcursor.x, vcursor.y + cell_height, 4);
                };
                // 右下
                if (
                    cell_index.x < table_obj.heads.col.length - 1 &&
                    (cell_index.y < table_obj.heads.row.length - 1 && !spcell_obj[1].includes(`${cell_index.y + 1}-${cell_index.x}`)) &&
                    !spcell_obj[1].includes(`${cell_index.y}-${cell_index.x + 1}`)
                ) {
                    draw_line(ctx, vcursor.x + cell_width, vcursor.y + cell_height, vcursor.x + cell_width - 10, vcursor.y + cell_height, 4);
                    draw_line(ctx, vcursor.x + cell_width, vcursor.y + cell_height, vcursor.x + cell_width, vcursor.y + cell_height - 10, 4);
                    draw_point(ctx, vcursor.x + cell_width, vcursor.y + cell_height, 4);
                };
            };
        };
    };
};