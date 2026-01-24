const canvas=document.querySelector(".canvas");
const ctx=canvas.getContext("2d");
let moveVector=[0,0];
const geo=new geometry("H2");
let cursor=[0,0];
const vertex=[];
const segment=[];
function render(){
    canvas.width=screen.width;
    canvas.height=screen.height;
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#ffffff";
    point([0,0],1);
    ctx.fillStyle="#000000";
    pointStroke(cursor,0.01);
    for(const s of segment){
        geodesic(vertex[s.index[0]].pos,vertex[s.index[1]][1].pos);
    }
    for(const v of vertex){
        point(v.pos,0.01);
        v.pos=geo.translate(v.pos,moveVector);
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