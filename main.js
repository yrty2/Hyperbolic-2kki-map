const urocheck=new Image();
urocheck.src="urocheck.png";
const canvas=document.querySelector(".canvas");
const ctx=canvas.getContext("2d");
let moveVector=[0,0];
const geo=new geometry("H2");
let cursor=[0,0];
const vertex=[];
const segment=[];
function render(){
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
    ctx.fillStyle="#000000";

    for(const s of segment){
        if(s.index[0]!=-1 && s.index[1]!=-1){
            const p=vertex[s.index[0]].pos;
            const q=vertex[s.index[1]].pos;
            const dist=geo.distance(p,q);
            if(dist<10){
                ctx.strokeStyle=`hsla(0, 0%, 100%, ${Math.max(1/dist,0.1)})`;
        geodesic(p,q);
            }
    }
    }
    for(const v of vertex){
        ctx.fillStyle="#000000";
        point(v.pos,1/(5+50*geo.length(v.pos)));
        ctx.fillStyle="#ffffff3f";
        pointStroke(v.pos,1/(5+50*geo.length(v.pos)));
        ctx.fillStyle="#ffffff";
        v.pos=geo.translate(v.pos,moveVector);
        hyperText(v.name,v);
    }
    keyframe();
    requestAnimationFrame(render);
}
function point(p,siz){
    ctx.beginPath();
    const v=fix(p);
    ctx.arc(v[0],v[1],siz*canvas.height/2,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
}
function pointStroke(p,siz){
    ctx.beginPath();
    const v=fix(p);
    ctx.arc(v[0],v[1],siz*canvas.height/2,0,2*Math.PI);
    ctx.stroke();
    ctx.closePath();
}
function geodesic(p,q){
    const d=32;
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
function fix(p){
    return [p[0]*canvas.height/2+canvas.width/2,p[1]*canvas.height/2+canvas.height/2];
}
function hyperText(text,p){
    const v=fix(p.pos);
    const len=geo.length(p.pos);
    if(len<7){
    ctx.textAlign="center";
    ctx.font=`${Math.round(20/(len+1))}px solid`;
    ctx.fillText(text,v[0],v[1]);
    }
}