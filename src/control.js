let userAction=0;
let choice=-1;
let sortedvertex=[];
let choiceGroup=[];
let choiceGroupNames=[];
let lookin="";
let cursorout=false;
let drag=false;
let timer=0;
//for control
let vertexMover=false;
canvas.addEventListener("pointermove",e=>{
    mousemover(e);
});
function mousemover(e){
    userAction=0;
    timer++;
    const v=[(2*e.offsetX-canvas.width)/canvas.height,(2*e.offsetY-canvas.height)/canvas.height];
    if(projid==2){
        cursor=vectorsub([e.offsetX,e.offsetY],[canvas.width,canvas.height/2]);
    }else{
    if(vectorlength(v)<1){
        cursor=v.slice();
        cursorout=false;
    }else{
        cursorout=true;
    }
}
    if(vertexMover && choice!=-1){
        //選ばれた頂点、choice
        const p=vertex[choice];
        p.pos=cursor;
    }
    if(drag){
        if(projid==2){
            moveVector=vectormul(vectornormalize([e.movementX,e.movementY]),0.03);
        }else{
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
    }
}
canvas.addEventListener("pointerup",e=>{
    mouseupper(e);
});
canvas.addEventListener("contextmenu",e=>{
    if(!cursorout){
        e.preventDefault();
    }
});
function mouseupper(e){
        userAction=0;
    if(timer<4){
        if(sortedvertex.length>0){
            sortedvertex=[];
        }
        if(e.button==0){
const choosen=vertex.findIndex(e=>geo.distance(projected(e.pos),cursor)<0.1);
            if(choosen==choice){
                choice=-1;
            }else{
                choice=choosen;
            }
            if(choice!=-1 && lookin!=vertex[choice].name){
                let link="https://wikiwiki.jp/yume2kki-t/";
                if(localized=="en"){
                    link="https://yume.wiki/2kki/";
                }
                ifm.src=`${link}${vertex[choice].name}`;
                lookin=vertex[choice].name;
            }
        if(choice==-1){
            urobtn.disabled=true;
        }else{
            urobtn.disabled=false;
        }
    }else if(e.button==2){
        //右クリック
        const choosen=vertex.findIndex(e=>geo.distance(projected(e.pos),cursor)<0.1);
        if(choosen!=-1){
            const id=choiceGroup.indexOf(choosen);
            if(id==-1){
            choiceGroup.push(choosen);
            choiceGroupNames.push(vertex[choosen].name);
            }else{
                choiceGroup=deleteIndex(choiceGroup,id);
                choiceGroupNames=deleteIndex(choiceGroupNames,id);
            }
        }
    }
    }
    if(drag){
        if(geo.length(vertex[nexusid].pos)>8.4){
            maigo.innerHTML="<input type='button' value='"+translate("☆めだまばくだん☆")+"' onclick='kyuusai()' />";
        }else{
            maigo.innerHTML="";
        }
    }
    drag=false;
    //render();
}
function kyuusai(){
    maigo.innerHTML="";
    moveVector=vectorneg(vertex[nexusid].pos);
}
function urobutton(){
    //その頂点にうろつきを立たせる。
    urotsuki.mapid=choice;
    urobtn.disabled=true;
}
canvas.addEventListener("pointerdown",e=>{
    mousedowner(e);
});
function mousedowner(e){
    userAction=0;
    timer=0;
    //vertex.push({pos:cursor});
    drag=true;
    const v=[(2*e.offsetX-canvas.width)/canvas.height,(2*e.offsetY-canvas.height)/canvas.height];
    if(vectorlength(v)<1){
        cursor=v.slice();
    }
}
document.querySelector(".jumper").addEventListener("keydown", (e) => {
  e.stopPropagation();  // 親の keydown を発火させない
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
            break;
        case "KeyH":
            pathfinding();
            break;
        case "KeyR":
            pathlist=[];
            break;
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
function sort(names){
    const res=[];
    for(const v of vertex){
        if(v.name){
        if(v.name.indexOf(names)!=-1){
            res.push(v);
        }
    }
    }
    return res;
}
function jump(name){
    const exp=sort(name);
    if(exp.length==0){
        alert(translate("結果は見つかりませんでした"));
    }
    if(exp.length==1){
        moveVector=vectorneg(exp[0].pos);
        choice=exp[0].index;
    }else{
    //sortedvertexに書き込み
    sortedvertex=exp;
    }
}
frame();

