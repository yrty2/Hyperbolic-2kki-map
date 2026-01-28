//JSON解析
let nexusid;
let translation=[];
let rawmap={vertex:[],segment:[]};
async function initialize(){
    userlang();
    const data=await fetch("rawData/yume.json");
    const txt=await data.text();
    const parsedJSON=JSON.parse(txt);
    for(const p of parsedJSON.locations){
        rawmap.vertex.push(...p.locations);
    }
    const Tdata=await fetch("lang/en.json");
    const Ttxt=await Tdata.text();
    translation=JSON.parse(Ttxt);
    urobtn.value=translate("うろつく");
    document.querySelector(".jumper").placeholder=translate("名前ソート");
    //頂点の生成(配置ランダム)
    for(const v of rawmap.vertex){
        const theta=2*Math.PI*Math.random();
        const maxdist=10;
        const randpos=vectormul([Math.cos(theta),Math.sin(theta)],Math.tanh(maxdist*((vertex.length+100)/rawmap.vertex.length)));
        let vertname=v.originalName;
        if(localized=="en"){
            if(v.title=="Nexus"){
                vertname="The Nexus";
            }else{
            vertname=v.title;
            }
            ifm.src="https://yume2kki.fandom.com/wiki/Yume_2kki_Wiki";
        }
        vertex.push({title:v.title,name:vertname,pos:randpos,neighbors:[],connect:[],image:v.locationImage,cat:[],catey:[],index:vertex.length});
    }
    nexusid=parsename("Nexus");
    for(const p of parsedJSON.connections){
        //重複は不要
        for(const q of p.connections){
            const isdup=rawmap.segment.findIndex(e=>e.origin==q.destination && e.destination==q.origin)==-1;
            const uid=parsename(q.destination);
            const vid=parsename(q.origin);
            if(uid!=-1 && vid!=-1){
                //v->u
                vertex[vid].connect.push(uid);
                vertex[vid].cat.push(q.attributes);
                vertex[uid].connect.push(vid);
                let attr=q.attributes.slice();
                for(let k=0; k<attr.length; ++k){
                    if(attr[k]=="No Entry"){
                        attr[k]="Illegal";
                    }
                }
                vertex[uid].cat.push(q.attributes);
                vertex[vid].neighbors.push(uid);
                vertex[vid].catey.push(attr);//なぜか長さの不一致が起こることがある。(cateyのほうが長い)
            }
            q.hide=!isdup;
            rawmap.segment.push(q);
        }
    }
    generator();
}
initialize();

function generator(){
    segmentMaker();
    nexusCenterProjection();
}
function segmentMaker(){
    //rawmapの辺情報を使いやすくする
    for(const s of rawmap.segment){
        const ind=[parsename(s.origin),parsename(s.destination)];
        segment.push({attributes:s.attributes,index:ind,hide:s.hide});
    }
}
function parsename(name){
    return vertex.findIndex(e=>e.title==name);
}
function exp(r,t){
    return [r*Math.cos(t),r*Math.sin(t)];
}
function vectorarg(v){
    return Math.atan2(v[1],v[0]);
}
function nexusCenterProjection(){
    for(const v of vertex){
        v.pos=[1,0];
    }
    //nexus中心の配置により、ある程度効率的に配置できると思って。
    const projected=[];
    const projectedName=["Nexus"];
    vertex[nexusid].pos=[0,0];
    projected.push(vertex[nexusid]);
    const bunsan=0.9;
    //再起アルゴリズム
    let branch=[vertex[nexusid]];
    function expand(){
        let stk=[];
        if(projected.length==1){
            for(let k=0; k<branch[0].neighbors.length; ++k){
                vertex[branch[0].neighbors[k]].pos=geo.translate(exp(0.6,2*Math.PI*k/branch[0].neighbors.length),branch[0].pos);
                vertex[branch[0].neighbors[k]].arg=vectorarg(geo.translate(vertex[branch[0].neighbors[k]].pos,vectorneg(branch[0].pos)));
                /*const id=vertex[branch[0].neighbors[k]].neighbors.indexOf(parsename(branch[0].title));
                if(id!=-1){
                    vertex[branch[0].neighbors[k]].neighbors=deleteIndex(vertex[branch[0].neighbors[k]].neighbors,id);
                }*/
                projectedName.push(vertex[branch[0].neighbors[k]].title);
                stk.push(vertex[branch[0].neighbors[k]]);
            }
        }else{
            for(const b of branch){
                for(let k=0; k<b.neighbors.length; ++k){
                    if(projectedName.indexOf(vertex[b.neighbors[k]].title)==-1){
                    vertex[b.neighbors[k]].pos=geo.translate(exp(Math.random()*0.3+0.4,(2*k-(b.neighbors.length-1))*bunsan/(Math.max(b.neighbors.length-1,1))+b.arg),b.pos);
                    //位置重複を避けようとする
                    let dup=vertex.findIndex(e=>geo.distance(e.pos,vertex[b.neighbors[k]].pos)<0.3 && e.name!=vertex[b.neighbors[k]].name);
                    while(dup!=-1){
                        vertex[b.neighbors[k]].pos=geo.translate(exp(Math.random()*0.7,Math.random()*2*Math.PI),vertex[b.neighbors[k]].pos);
                        dup=vertex.findIndex(e=>geo.distance(e.pos,vertex[b.neighbors[k]].pos)<0.3 && e.name!=vertex[b.neighbors[k]].name);
                    }
                    vertex[b.neighbors[k]].arg=vectorarg(geo.translate(vertex[b.neighbors[k]].pos,vectorneg(b.pos)));
                    /*const id=vertex[b.neighbors[k]].neighbors.indexOf(parsename(b.title));
                    if(id!=-1){
                        vertex[b.neighbors[k]].neighbors=deleteIndex(vertex[b.neighbors[k]].neighbors,id);
                    }*/
                    projectedName.push(vertex[b.neighbors[k]].title);
                    stk.push(vertex[b.neighbors[k]]);
                    }
                }
            }
        }
        branch=stk;
        projected.push(...branch);
        //頂点数と同値にならない
        if(projected.length<1515){
            expand();
        }
    }
    expand();
}
function loadFromStorage(){

}
function storageWrite(){
}
function dijkstra(p,q){
    //ダイクストラ法(最短経路探索アルゴリズム)
    const heap=[{vertex:p,path:[p],checked:true}];//ある頂点への最短経路と手数
    //最初の経路探索
    //すべての辺の重みを1とする。
    let timeToQ=9999999;
    for(let k=0; k<p.neighbors.length; ++k){
        const s=p.neighbors[k];
        if(p.catey[k].indexOf("Illegal")==-1){
        const way={vertex:vertex[s],checked:false,path:[parsename(p.title),s]};
        const id=heap.findIndex(e=>e.vertex.name==vertex[s].name);
        if(id==-1){
            heap.push(way);
        }
        }
    }
    while(true){//あるpathが最短経路であることが確定するまで。
        let end=true;
        const stack=[];
        for(const h of heap){
            if(!h.checked){
        //戻る必要はない
        for(let k=0; k<h.vertex.neighbors.length; ++k){
            const s=h.vertex.neighbors[k];
            const at=h.vertex.catey[k];
            //道が到達地でなくDead Endであるならやめておく
            //道が一方通行であり、不可逆であるならやめておく。
            let safe=vertex[s].name==q.name || (at.indexOf("Dead End")==-1);
            safe=safe && (at.indexOf("Illegal")==-1);//不可逆であり逆走
            if(h.path.length+1<timeToQ && safe){
                end=false;
        const frontier=(h.path.indexOf(s)==-1);
        if(frontier){
            const v=vertex[s];
        const path={vertex:v,path:[...h.path,s],checked:false};
        if(v.name==q.name && timeToQ>h.path.length+1){
                timeToQ=h.path.length+1;
        }
        const id=heap.findIndex(e=>e.vertex.name==vertex[s].name);
        if(id==-1){
            stack.push(path);
        }else{
            //以前ここを訪れた。
            if(heap[id].path.length>path.path.length){
                //発見した経路のほうが近い
                heap[id]=path.slice();
            }
        }
        }
    }
    }
    h.checked=true;
}
    }
    heap.push(...stack);
    if(end){
        break;
    }
    }
    const id=heap.findIndex(e=>e.vertex.name==q.name);
    return heap[id];
}
function finder(name){

}
//for debug
function parseAttributes(){
    const alist=[];
    for(const s of segment){
        for(const a of s.attributes){
            if(alist.indexOf(a)==-1){
                alist.push(a);
            }
        }
    }
    return alist;
}
function pathfinding(){
    if(choiceGroup.length>=2){
    //choiceGroupを順番に pathlistに追加。
    const res=[];
    for(let k=0; k<choiceGroup.length-1; ++k){
        res.push(...dijkstra(vertex[choiceGroup[k]],vertex[choiceGroup[k+1]]).path);
    }
    pathlist.push(res);
    choiceGroup=[];
    choiceGroupNames=[];
    }else{
        alert(translate("頂点数が足りていません！"));
    }
}
function userlang(){
    const language=navigator.language;
    localized="ja";
    if(language!="ja"){
        localized="en";
    }
}
