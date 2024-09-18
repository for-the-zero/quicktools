const ele_genbtn = $('.gen-btn');
const ele_input = $('.input-text');
const ele_r1 = $('.r1');
const ele_r2 = $('.r2');
const ele_r3 = $('.r3');
const natele_table = document.querySelector('table');


ele_genbtn.on('click',()=>{
    ele_r1.empty();
    ele_r2.empty();
    ele_r3.empty();
    let val = ele_input.val();
    val = to_pkarray(val);
    create_table(val);
    create_cvs();
});

const code_0 = ['0','1','2','3','4','5','6','7','8','9'];
const code_1 = [' ','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const code_2 = ['.',',','(',')',':','!','?'];
const code_3 = ['=','[',']'];
function to_pkarray(input){
    let arr = [];
    input = input.split('');
    for(let i=0;i<input.length;i++){
        if(code_0.includes(input[i])){
            arr.push([0,0,parseInt(input[i])]);
        } else if(code_1.includes(input[i])){
            let pos = code_1.indexOf(input[i]);
            if(pos<10){
                arr.push([1,0,pos]);
            }else{
                pos = pos.toString();
                arr.push([1,parseInt(pos.charAt(0)),parseInt(pos.charAt(1))]);
            };
        } else if(code_2.includes(input[i])){
            arr.push([2,0,code_2.indexOf(input[i])]);
        } else if(code_3.includes(input[i])){
            arr.push([3,0,code_3.indexOf(input[i])]);
        };
    };
    return arr;
};

function create_table(arr){
    for(let i=0;i<arr.length;i++){
        let val = arr[i];
        ele_r1.append($(`<td><img height="64" src="${val[0]}.svg"></td>`));
        ele_r2.append($(`<td><img height="64" src="${val[1]}.svg"></td>`));
        ele_r3.append($(`<td><img height="64" src="${val[2]}.svg"></td>`));
    };
};

function create_cvs(){
    $('canvas').remove();
    $('body').append($('<canvas></canvas>'));
    html2canvas(natele_table,{
        useCORS:true,
    }).then(canvas => {
        $('canvas').replaceWith(canvas);
    });
};