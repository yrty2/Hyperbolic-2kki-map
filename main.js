
const projname=["ポアンカレの円盤","クラインの円盤"];//上半平面ほしい
let projid=0;
const urocheck=new Image();
const uro=new Image();
uro.src="uro.png";
const ifm=document.querySelector(".ifm");
const urobtn=document.querySelector(".urobtn");
const maigo=document.querySelector(".maigo");
urocheck.src="urocheck.png";
const urogif=[new Image(),new Image(),new Image(),new Image()];
for(let k=0; k<4; ++k){
    urogif[k].src=`Urowalk/uw${k}.png`;
}
let pathlist=[];//specialPath
const canvas=document.querySelector(".canvas");
const ctx=canvas.getContext("2d");
let moveVector=[0,0];
const geo=new geometry("H2");
let cursor=[0,0];
const vertex=[];
const segment=[];
let t=0;
const urotsuki={
    mapid:-1,//disabled
    anim:0
}
function render(){
    userAction++;
    ctx.textAlign="left";
    ctx.textBaseline="bottom";
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(urocheck,0,0,canvas.width,canvas.height);
    ctx.fillStyle="#000000";//#231d24
    point([0,0],1);
    //pointStroke(cursor,0.01);
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
    //description
    ctx.fillText(`右クリックで頂点を選択`,30,canvas.height-230);
    ctx.fillText(`Hで経路探索(最短経路)`,30,canvas.height-200);
    ctx.fillText(`Rで経路リストをすべて削除`,30,canvas.height-170);
    ctx.fillStyle="#000000";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    for(const s of segment){
        //0->1へ
        if(s.index[0]!=-1 && s.index[1]!=-1 && (choice!=-1 || !s.hide)){
            let draw=true;
            const p=vertex[s.index[0]].pos;
            const q=vertex[s.index[1]].pos;
            const dist=geo.distance(p,q);
            function mark(){
                let stack="";
                const m=geo.midpoint([p,q]);
                if(s.attributes.indexOf("Needs Effect")!=-1){
                    stack+="✨";
                }
                if(s.attributes.indexOf("Chance")!=-1){
                    stack+="🍀";
                }
                if(s.attributes.indexOf("Dead End")!=-1){
                    stack+="🔙";
                }
                if(s.attributes.indexOf("Unlockable")!=-1){
                    stack+="🔑";
                }
                if(s.attributes.indexOf("Locked")!=-1){
                    stack+="🔒";
                }
                ctx.fillStyle="#000000";
                if(stack!=""){
                hyperText(stack,{pos:m});
                }
            }
            let directional=false;
                if(choice==-1){
                ctx.strokeStyle=`hsla(0, 0%, 100%, ${Math.max(Math.min(1/dist,1),0.1)})`;
                mark();
                }else{
                    let alpha=1;
                    if(s.index[0]==choice || s.index[1]==choice){
                        if(s.index[1]==choice){
                            draw=false;
                        }
                        ctx.strokeStyle=`hsla(120, 100%, 50%, 1)`;
                        if(s.attributes.indexOf("No Return")!=-1){
                            if(s.index[1]==choice){
                                alpha=0.2;
                            }
                            directional=true;
                            draw=true;
                        }
                        if(s.attributes.length>0){
                        ctx.strokeStyle=`rgba(0, 255, 217,${alpha})`;
                        }
                        if(s.attributes.indexOf("Dead End")!=-1){
                        ctx.strokeStyle=`rgba(137, 0, 0,${alpha})`;
                        }
                        if(s.attributes.indexOf("Return")!=-1){
                        ctx.strokeStyle=`rgba(137, 0, 0,${alpha})`;
                        }
                        if(s.attributes.indexOf("Needs Effect")!=-1){
                        ctx.strokeStyle=`rgba(234, 255, 0,${alpha})`;
                        }
                        if(s.attributes.indexOf("No Entry")!=-1){
                            draw=false;
                        }
                        if(s.attributes.indexOf("Locked")!=-1){
                            ctx.strokeStyle=`rgba(50, 50, 50,${alpha})`;
                        }
                        if(draw){
                        mark();
                        }
                    }else{
                        if(s.hide){
                            draw=false;
                        }
                        ctx.strokeStyle=`hsla(0, 0%, 100%, 0.05)`;
                    }
                }
                //!これも重い
                if(draw){
                if(directional){
                    geodesicdot(p,q);
                }else{
                    geodesic(p,q);
                }
                }
    }
    }
    if(choice==-1){
    let pind=0;
    for(const p of pathlist){
        ctx.strokeStyle=`hsl(${pind*60},100%,50%)`;
        for(let k=0; k<p.length-1; ++k){
            geodesic(vertex[p[k]].pos,vertex[p[k+1]].pos);
        }
        pind++;
    }
}
    for(const v of vertex){
        if(choice==-1 || (v.connect.indexOf(choice)!=-1 || v.name==vertex[choice].name)){
        let scl;
        scl=hyperscale(v.pos,0.05);
        ctx.fillStyle="#000000";
        if(choiceGroupNames.indexOf(v.name)==-1){
        ctx.strokeStyle="#ffffff5f";
        }else{
            ctx.strokeStyle="#ff903b";
        }
        if(choice==-1){
        const plind=pathlist.findIndex(e=>e.indexOf(v.index)!=-1);
        if(plind!=-1){
            ctx.strokeStyle=`hsl(${plind*60},100%,50%)`;
        }
    }
        mapPoint(v.pos,scl);
        ctx.fillStyle="#ffffff";
        hyperText(v.name,v);
        }
        if(Math.abs(moveVector[0])>0 && Math.abs(moveVector[1])>0){
            v.pos=geo.translate(v.pos,moveVector);
        }
    }
    if(urotsuki.mapid!=-1){
        ctx.imageSmoothingEnabled=false;
        //うろ
        const gif=urogif[Math.floor(urotsuki.anim)%4];
        const pos=fix(vertex[urotsuki.mapid].pos);
        const a=hyperscale(vertex[urotsuki.mapid].pos,0.2)*10;
        if(a>0.6){
            ctx.drawImage(gif,pos[0]-a*gif.width/2,pos[1]-a*gif.height/2-20*a,gif.width*a,gif.height*a);
        }else{
            const uropos=vectorsum(exp(1.05*canvas.height/2,vectorarg(vertex[urotsuki.mapid].pos)),[canvas.width/2,canvas.height/2]);
            const c=2;
            ctx.drawImage(uro,uropos[0]-c*gif.width/2,uropos[1]-c*gif.height/2,c*gif.width,c*gif.height);
        }
        urotsuki.anim+=0.1;
    }
    ctx.imageSmoothingEnabled=true;
}
function frame(){
    t+=1/60;
    if(ifm.height!=window.innerHeight || ifm.width!=window.innerWidth){
    ifm.width=Math.max(0,(window.innerWidth-window.innerHeight)/2-30);
    ifm.height=window.innerHeight;
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    }
    //15秒間操作がなければ停止する(バックグラウンドでCPUを圧迫しないため)
    if(userAction<15*60){
    render();
    }
    keyframe();
    requestAnimationFrame(frame);
}
function point(p,siz){
    const size=Math.round(siz*canvas.height/2);
    if(size>0){
    ctx.beginPath();
    const v=fix(p);
    ctx.arc(v[0],v[1],size,0,2*Math.PI);
    ctx.fill();
    ctx.closePath();
    }
}
function mapPoint(p,siz){
    const size=Math.round(siz*canvas.height/2);
    if(size>0){
    ctx.beginPath();
    const v=fix(p);
    ctx.arc(v[0],v[1],size,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    }
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
    const d=8;
    const pq=geo.translate(p,vectorneg(q));
    const t=vectorlength(pq);
    ctx.beginPath();
    for(let k=0; k<=d; ++k){
        const c=vectormul(geo.translate(vectormul(pq,Math.tanh(k/d*Math.atanh(t))/t),q),canvas.height/2);
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
function geodesicdot(p,q){
    const d=16;//いくつの点で描かれるか
    const pq=geo.translate(p,vectorneg(q));
    const T=vectorlength(pq);
    for(let k=0; k<d; ++k){
        const c=geo.translate(vectormul(pq,Math.tanh(math.mod((-t/6+k/d),1)*Math.atanh(T))/T),q);
        ctx.fillStyle=ctx.strokeStyle;
        point(c,hyperscale(c,0.008));
    }
}
function fix(p){
    let v=projected(p);
    return [v[0]*canvas.height/2+canvas.width/2,v[1]*canvas.height/2+canvas.height/2];
}
function hyperText(text,p){
    const size=Math.round(50*hyperscale(p.pos,0.3));
        if(size>1){
    const v=fix(p.pos);
    ctx.font=`${size}px solid`;
    //filltextが重いのでほどほどに
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
