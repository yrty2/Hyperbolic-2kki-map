const projname=["ポアンカレの円盤","クラインの円盤"];
let projid=0;
const urocheck=new Image();
const ifm=document.querySelector(".ifm");
urocheck.src="urocheck.png";
const canvas=document.querySelector(".canvas");
const ctx=canvas.getContext("2d");
let moveVector=[0,0];
const geo=new geometry("H2");
let cursor=[0,0];
const vertex=[];
const segment=[];
function render(){
    ifm.width=(window.innerWidth-window.innerHeight)/2-30;
    ifm.height=window.innerHeight;
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(urocheck,0,0,canvas.width,canvas.height);
    ctx.fillStyle="#000000";//#231d24
    point([0,0],1);
    /*ctx.fillStyle="#342b30";
    point([0,0],Math.tanh(2));
    ctx.fillStyle="#4b4354";
    point([0,0],Math.tanh(1.5));
    ctx.fillStyle="#574e63";
    point([0,0],Math.tanh(1));
    ctx.fillStyle="#514758";
    point([0,0],Math.tanh(0.5));
    ctx.fillStyle="#000000";*/
    pointStroke(cursor,0.01);
    ctx.strokeStyle="#ffffff";
    pointStroke([0,0],1);
    ctx.strokeStyle="#000000";
    ctx.font="32px solid";
    ctx.fillStyle="#ffffff";
    ctx.fillText("Hyperbolic Map of Yume2kki",30,50);
    ctx.fillText("ゆめ2っき双曲地図",30,90);
    ctx.font="12px solid";
    ctx.fillText(`投影:${projname[projid]}`,30,canvas.height-100);
    ctx.fillText(`Pで変更`,30,canvas.height-70);
    ctx.fillStyle="#000000";

    for(const s of segment){
        if(s.index[0]!=-1 && s.index[1]!=-1){
            const p=vertex[s.index[0]].pos;
            const q=vertex[s.index[1]].pos;
            const dist=geo.distance(p,q);
                if(choice==-1){
                ctx.strokeStyle=`hsla(0, 0%, 100%, ${Math.max(Math.min(1/dist,1),0.1)})`;
                }else{
                    if(s.index.indexOf(choice)!=-1){
                        ctx.strokeStyle=`hsla(120, 100%, 50%, 1)`;
                    }else{
                        ctx.strokeStyle=`hsla(0, 0%, 100%, 0.05)`;
                    }
                }
        geodesic(p,q);
    }
    }
    for(const v of vertex){
        if(choice==-1 || (v.connect.indexOf(choice)!=-1 || v.name==vertex[choice].name)){
        let scl;
        scl=hyperscale(v.pos,0.05);
        ctx.fillStyle="#000000";
        point(v.pos,scl);
        ctx.strokeStyle="#ffffff5f";
        pointStroke(v.pos,scl);
        ctx.fillStyle="#ffffff";
        hyperText(v.name,v);
        }
        v.pos=geo.translate(v.pos,moveVector);
    }
    keyframe();
    requestAnimationFrame(render);
}
function point(p,siz){
    ctx.beginPath();
    const v=fix(p);
    ctx.arc(v[0],v[1],Math.round(siz*canvas.height/2),0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
}
function pointStroke(p,siz){
    ctx.beginPath();
    const v=fix(p);
    ctx.arc(v[0],v[1],Math.round(siz*canvas.height/2),0,2*Math.PI);
    ctx.stroke();
    ctx.closePath();
}
function geodesic(p,q){
    if(projid==0){
    const d=16;
    const pq=geo.translate(p,vectorneg(q));
    const t=vectorlength(pq);
    ctx.beginPath();
    for(let k=0; k<=d; ++k){
        const c=vectormul(geo.translate(vectormul(pq,k/d),q),canvas.height/2);
        ctx.lineTo(c[0]+canvas.width/2,c[1]+canvas.height/2);
    }
    ctx.stroke();
    ctx.closePath();
    }
    if(projid==1){
        ctx.beginPath();
        const u=[fix(p),fix(q)];
        ctx.lineTo(u[0][0],u[0][1]);
        ctx.lineTo(u[1][0],u[1][1]);
        ctx.stroke();
        ctx.closePath();
    }
}
function fix(p){
    let v=projected(p);
    return [v[0]*canvas.height/2+canvas.width/2,v[1]*canvas.height/2+canvas.height/2];
}
function hyperText(text,p){
    const v=fix(p.pos);
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    if(vectordot(p.pos,p.pos)<0.9){
    ctx.font=`${Math.round(50*hyperscale(p.pos,0.3))}px solid`;
    ctx.fillText(text,v[0],v[1]);
    }
}
function hyperscale(pos,radius){
    const dot=vectordot(pos,pos);
    return (1-dot)*radius/(1-dot*radius*radius);
}
function projected(p){
    if(projid==0){
        return p;
    }
    if(projid==1){
        return projection.klein(p);
    }
    if(projid==2){
        return p;
    }
    if(projid==3){
        return p;
    }
}