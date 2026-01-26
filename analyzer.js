//JSON解析
let nexusid;
let rawmap={vertex:[],segment:[]};
async function initialize(){
    const data=await fetch("yume.json");
    const txt=await data.text();
    const parsedJSON=JSON.parse(txt);
    for(const p of parsedJSON.locations){
        rawmap.vertex.push(...p.locations);
    }
    //頂点の生成(配置ランダム)
    for(const v of rawmap.vertex){
        const theta=2*Math.PI*Math.random();
        const maxdist=10;
        const randpos=vectormul([Math.cos(theta),Math.sin(theta)],Math.tanh(maxdist*((vertex.length+100)/rawmap.vertex.length)));
        vertex.push({title:v.title,name:v.originalName,pos:randpos,neighbors:[],connect:[],image:v.locationImage});
    }
    nexusid=parsename("Nexus");
    for(const p of parsedJSON.connections){
        //重複は不要
        for(const q of p.connections){
            const isdup=rawmap.segment.findIndex(e=>e.origin==q.destination && e.destination==q.origin)==-1;
            const uid=parsename(q.destination);
            const vid=parsename(q.origin);
            if(uid!=-1 && vid!=-1){
                vertex[vid].connect.push(uid);
                vertex[uid].connect.push(vid);
                vertex[vid].neighbors.push(uid);
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
                const id=vertex[branch[0].neighbors[k]].neighbors.indexOf(parsename(branch[0].title));
                if(id!=-1){
                    vertex[branch[0].neighbors[k]].neighbors=deleteIndex(vertex[branch[0].neighbors[k]].neighbors,id);
                }
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
                    const id=vertex[b.neighbors[k]].neighbors.indexOf(parsename(b.title));
                    if(id!=-1){
                        vertex[b.neighbors[k]].neighbors=deleteIndex(vertex[b.neighbors[k]].neighbors,id);
                    }
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

}
function finder(name){

}