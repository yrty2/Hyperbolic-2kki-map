let userAction=0;
let choice=-1;
let lookin="";
let drag=false;
let timer=0;
//for control
let vertexMover=false;
canvas.addEventListener("mousemove",e=>{
    userAction=0;
    timer++;
    const v=[(2*e.offsetX-canvas.width)/canvas.height,(2*e.offsetY-canvas.height)/canvas.height];
    if(vectorlength(v)<1){
        cursor=v.slice();
    }
    if(vertexMover && choice!=-1){
        //選ばれた頂点、choice
        const p=vertex[choice];
        p.pos=cursor;
    }
    if(drag){
        if(vectorlength(cursor)<0.9){
        const v=[2*e.movementX/canvas.height,2*e.movementY/canvas.height];
        const p=vectorsub(cursor,v);//p -> cursor
        const u=geo.translate(vectorneg(cursor),p);
        //移動角
        const arg=vectorarg(geo.translate(cursor,vectorneg(p)));
        let factor=24;
        if(projid==1){
            factor=10;
        }
        if(geo.length(u)<0.99){
        moveVector=vectormul(exp(factor*geo.length(u),arg),1/50);
        }
        }
    }
});
canvas.addEventListener("mouseup",e=>{
    userAction=0;
    if(timer<4){
const choosen=vertex.findIndex(e=>geo.distance(projected(e.pos),cursor)<0.1);
            if(choosen==choice){
                choice=-1;
            }else{
                choice=choosen;
            }
            if(choice!=-1 && lookin!=vertex[choice].name){
                ifm.src=`https://wikiwiki.jp/yume2kki-t/${vertex[choice].name}`;
                lookin=vertex[choice].name;
            }
    }
    drag=false;
    //render();

});
canvas.addEventListener("mousedown",e=>{
    userAction=0;
    timer=0;
    //vertex.push({pos:cursor});
            drag=true;
});
const key={};
window.addEventListener("keydown",e=>{
    userAction=0;
    switch (e.code){
        case "KeyW":
            key.w=true;
            break;
        case "KeyA":
            key.a=true;
            break;
        case "KeyS":
            key.s=true;
            break;
        case "KeyD":
            key.d=true;
            break;
        case "KeyP":
            projid=(projid+1)%(projname.length);
    }
});
window.addEventListener("keyup",e=>{
    userAction=0;
    switch (e.code){
        case "KeyW":
            key.w=false;
            break;
        case "KeyA":
            key.a=false;
            break;
        case "KeyS":
            key.s=false;
            break;
        case "KeyD":
            key.d=false;
            break;
    }
});
function keyframe(){
    const v=[0,0];
    if(key.w){
        v[1]--;
    }
    if(key.a){
        v[0]--;
    }
    if(key.s){
        v[1]++;
    }
    if(key.d){
        v[0]++;
    }
    if(!(v[0]==0 && v[1]==0)){
        moveVector=vectormul(vectornormalize(v),-0.02);
    }else{
        moveVector=[0,0];
    }
}
frame();