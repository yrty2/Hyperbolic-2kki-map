let mode=1;//move vertex
canvas.addEventListener("mousemove",e=>{
    const v=[(2*e.offsetX-canvas.width)/canvas.height,(2*e.offsetY-canvas.height)/canvas.height];
    if(vectorlength(v)<1){
        cursor=v.slice();
    }
});
canvas.addEventListener("click",e=>{
    vertex.push({pos:cursor});
});
const key={};
window.addEventListener("keydown",e=>{
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
    }
});
window.addEventListener("keyup",e=>{
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
render();