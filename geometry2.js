class geometry{
    constructor(type){
        if(["S","E","H"].indexOf(type[0])==-1){
            console.warn(`球面、平面、双曲面しかありません！${type[0]}とはなんですか？`);
        }else{
            this.type=type;
        }
    }
    get dim(){
        return parseInt(this.type.slice(1));
    }
    length(p){
        if(this.type[0]=="S"){
            return 2*Math.atan(vectorlength(p));
        }
        if(this.type[0]=="E"){
            return vectorlength(p);
        }
        if(this.type[0]=="H"){
            return 2*Math.atanh(vectorlength(p));
        }
    }
    distance(p,q){
        return this.length(this.translate(p,vectorneg(q)));
    }
    translate(p,a){
        if(this.type[0]=="S"){
            if(this.dim==2){
                return c128.quot(c128.sum(p,a),c128.sub([1,0],c128.mul(p,c128.conjugate(a))));
            }
            if(this.dim==3){
                const qq=vectordot(a,a);
                if(qq>0){
                    const pq=vectordot(p,a);
                    const pp=vectordot(p,p);
                return vectormul(
                        vectorsum(vectormul(p,1-qq-2*pq),vectormul(a,(1+pp))),
                    1/(1-2*pq+pp*qq)
                );
                }
                return p;
            }
        }
        if(this.type[0]=="E"){
            const res=Array(this.dim);
            for(let k=0; k<p.length; ++k){
                res.push(p[k],a[k]);
            }
            return res;
        }
        if(this.type[0]=="H"){
            if(this.dim==2){
                return c128.quot(c128.sum(p,a),c128.sum([1,0],c128.mul(p,c128.conjugate(a))));
            }
            if(this.dim==3){
                const t=vectorlength(a);
                if(t>0){
                const pabs=vectordot(p,p);
                const u=vectornormalize(p);
                return vectormul(
                    vector.mul(
                        vectorsum(vectormul(p,1+t*t+2*t*vectordot(p,u)),vectormul(u,t*(1-pabs)))
                    ),
                    1/(1+2*t*vectordot(p,u)+t*t*pabs)
                );
                }
                return p;
            }
        }
    }
    scale(p,s){
        if(this.type[0]=="S"){
            const a=vectorlength(p);
            return vectormul(p,Math.tan(s*Math.atan(a))/a);
        }
        if(this.type[0]=="E"){
            return vectormul(p,s);
        }
        if(this.type[0]=="H"){
            return vectormul(p,s);
        }
    }
    midpoint(P){
        if(this.type[0]=="S"){
            if(this.dim==3){
                let ls=[0,0,0,0];
                for(let k=0; k<P.length; ++k){
                    ls=vectorsum(ls,vectormul(
                        [2*P[k][0],2*P[k][1],2*P[k][2],vectordot(P[k],P[k])-1],
                        1/(vectordot(P[k],P[k])+1)
                    ));
                }
                const lm=vectornormalize(ls);
                return vectormul(lm.slice(0,3),1/(1-lm[3]));
            }
        }
    }
    refrection(P,m){
        const res=[];
        if(this.type[0]=="S"){
            if(this.dim==3){
                const vn=vectornormalize(m);
                const m2=this.scale(m,2);
                for(const p of P){
                    const mirrored=vectorsub(p,vectormul(vn,2*vectordot(p,vn)));
                    res.push(this.translate(m2,mirrored));
                }
                return res;
            }
        }
    }
}
function vectormul(v,a){
    const res=[];
    for(let k=0; k<v.length; ++k){
        res.push(v[k]*a);
    }
    return res;
}
function vectorneg(v){
    const res=[];
    for(let k=0; k<v.length; ++k){
        res.push(-v[k]);
    }
    return res;
}
function vectorsum(v,u){
    const res=[];
    for(let k=0; k<v.length; ++k){
        res.push(v[k]+u[k]);
    }
    return res;
}
function vectorsub(v,u){
    const res=[];
    for(let k=0; k<v.length; ++k){
        res.push(v[k]-u[k]);
    }
    return res;
}
function vectorlength(a){
    let res=0;
    for(let k=0; k<a.length; ++k){
        res+=a[k]*a[k];
    }
    return Math.sqrt(res);
}
function vectordot(a,b){
    let res=0;
    for(let k=0; k<a.length; ++k){
        res+=a[k]*b[k];
    }
    return res;
}
function vectormot(a,b){
    let res=a[0]*b[0];
    for(let k=1; k<a.length; ++k){
        res-=a[k]*b[k];
    }
    return res;
}
function vectornormalize(a){
    const s=vectorlength(a);
    if(s>0){
        const res=[];
        for(let k=0; k<a.length; ++k){
            res.push(a[k]/s);
        }
        return res;
    }
    return Array(a.length).fill(0)
}
class topology{
}
const projection={
    //射影
    orthogonal(cart){
        if(cart.z>0){
        return new cartesian2D(cart.x,cart.y);
        }
    },
    perspective(cart){
        if(cart.z>0){
            return new cartesian2D(cart.x/cart.z,cart.y/cart.z);
        }
    },
    spherical(p,r){
        if(!r){
            r=1;
        }
        const len2=vectordot(p,p);
        const v=vectormul(p,2);
        v.push(len2-1);
        return vectormul(v,1/(len2+1));
    },
    stereographic(p,r){
        if(!r){
            r=1;
        }
        return vectormul(p.slice(0,p.length-1),1/(1-p[p.length-1]/r));
    },
    poincareDisk(hyp){
        return hyp;
    },
    klein(hyp){
        //ベルトラミ・クラインモデル
        const abs=c128.abs(hyp);
        return c128.prod(c128.prod(hyp,2),1/(1+abs*abs));
    },
    upperhalf(hyp){
        //上半平面
        const z=c32.const(hyp[1],-hyp[0]);   
        return c32.sub(c32.mul(c32.quot(c32.sum(c32.one,z),c32.sub(c32.one,z)),c32.i),c32.i);
    },
    disk(hyp,f){
        //0でクライン、1でポアンカレ
        const abs=c32.abs(hyp)[0];
        return c32.prod(c32.prod(hyp,2),1/(1+f+abs*abs*(1-f)));
    }
}
function Cl(hyperbolic,imaginary){
    let V=Array(hyperbolic).fill(1);
    V.push(...Array(imaginary).fill(-1));
    //v is like [1,1,-1] [-1,-1,-1]
    const n=hyperbolic+imaginary;
    let cl=Array(n);
    for(let k=0; k<n; k++){
        cl[k]=k;
    }
    cl=maths.power(cl);
    //返すのは数式
    function Clmul(u,v){
        //u,v->[0,1,2] これは基底の積。最終的に昇順に。
        let a=[...u,...v];//[0,1,1,2],[1]^2は？
        let h=1;
        //入れ替えソート(符号反転が行われる。)
        while(true){
            let zyun=true;
            let hold=0;
            for(let k=0; k<a.length; ++k){
                if(hold<=a[k]){
                }else{
                    zyun=false;
                    break;
                }
                hold=a[k];
            }
            if(zyun){
                break;
            }
            //ここに処理
            for(let k=1; k<a.length; ++k){
                if(a[k-1]>a[k]){
                    const holder=a[k-1];
                    a[k-1]=a[k];
                    a[k]=holder;
                    h*=(-1);
                }
            }
        }
        //2乗項を探す。(場合によっては符号反転が行われる)
        for(let k=1; k<a.length; ++k){
            if(a[k-1]==a[k]){
                h*=V[a[k]];
                a=[...a.slice(0,k-1),...a.slice(k+1,a.ength)]
                k--;
            }
        }
        return [a,h];
    }
    const tapes=Array(cl.length).fill("");
    //冪集合の積
    let tape="return [";
    for(let i=0; i<cl.length; ++i){
    for(let j=0; j<cl.length; ++j){
        const a=Clmul(cl[i],cl[j]);
        const id=cl.findIndex(e=>e.join()==a[0].join());
        if(id!=-1){
            let hugou="+";
            if(a[1]==-1){
                hugou="-";
            }else if(tapes[id].length==0){
                hugou="";
            }
            tapes[id]+=`${hugou}p[${i}]*q[${j}]`;
        }else{
            console.warn("おい！おかしいぞ！");
        }
    }
    }
    for(let k=0; k<tapes.length; ++k){
        tape+=tapes[k];
        if(k+1<tapes.length){
            tape+=",";
        }
    }
    return tape+"]";
}
const c128={
    const(a,b){
        return [a,b];
    },
    one:[1,0],
    real(a){
        return [a,0];
    },
    imag(a){
        return [0,a];
    },
    i:[0,1],
    zero:[0,0],
    neg(z){
        return [-z[0],-z[1]];
    },
    poler(radius,theta){
        return [radius*Math.cos(theta),radius*Math.sin(theta)];
    },
    prod(z,x){
        return [z[0]*x,z[1]*x];
    },
    exp(z){
        const r=Math.exp(z[0]);
        return [r*Math.cos(z[1]),r*Math.sin(z[1])];
    },
    mul(z,w){
        return [z[0]*w[0]-z[1]*w[1],z[0]*w[1]+z[1]*w[0]]
    },
    sum(z,w){
        return [z[0]+w[0],z[1]+w[1]];
    },
    sub(z,w){
        return [z[0]+w[0],z[1]+w[1]];
    },
    abs(z){
        return Math.sqrt(z[0]*z[0]+z[1]*z[1]);
    },
    normalize(z){
        return this.prod(z,1/Math.sqrt(z[0]*z[0]+z[1]*z[1]));
    },
    conjugate(z){
        return [z[0],-z[1]];
    },
    quot(z,w){
        if(w[1]==0){
            return [z[0]/w[0],z[1]/w[0]];
        }
        return this.prod(this.mul(z,this.conjugate(w)),1/(w[0]*w[0]+w[1]*w[1]));
    },
    arg(z){
        return Math.atan2(z[1],z[0]);
    },
    log(z){
        return [Math.log(z[0]*z[0]+z[1]*z[1])/2,Math.atan2(z[1],z[0])];
    },
    pow(z,w){
        if(w[1]==0){
            const theta=w[0]*Math.atan2(z[1],z[0]);
            const r=Math.pow(z[0]*z[0]+z[1]*z[1],w[0]/2);
            return [r*Math.cos(theta),r*Math.sin(theta)];
        }else{
            const theta=Math.atan2(z[1],z[0]);
            const lnr=Math.log(z[0]*z[0]+z[1]*z[1])/2;
            const r=Math.exp(w[0]*lnr-w[1]*theta);
            const phi=w[0]*theta+w[1]*lnr;
            return [r*Math.cos(phi),r*Math.sin(phi)];
        }
    }
}
//!for rendering
const GPUworkflow=[];
class WGPU{
    constructor(geometry,uniformsize,wgsl,method){
        this.method=method;
        if(["instance","point","segment","raymerch"].indexOf(this.method)==-1){
            console.warn(`methodはinstance,raymerch,point,segmentのいずれかである必要があります。\n'${this.method}'が見つかりました。`);
            this.method="instance";
        }
        if(this.method=="instance"){
            this.webGPUtopology="triangle-list";
        }
        if(this.method=="raymerch"){
            this.webGPUtopology="triangle-strip";
        }
        if(this.method=="point"){
            this.webGPUtopology="point-list";
        }
        if(this.method=="segment"){
            this.webGPUtopology="line-list";
        }
        this.inst=[];
        this.geometry=geometry;
        this.uniform=Array(uniformsize).fill(0);
        this.wgsl=wgsl;
        this.inst=new Float32Array(1);
        this.vertex=new Float32Array(1);
        this.index=new Uint16Array(1);
    }
    bindvertex(v){
        this.vertex=new Float32Array(v);
    }
    bindindex(u){
        this.index=new Uint16Array(u);
    }
    async initialize(canvas,vertconfig,instanceconfig){
        canvas.width=screen.width;
        canvas.height=screen.height;
        this.vertconfig=vertconfig;
        this.instanceconfig=instanceconfig;
        this.canvas=canvas;
        this.background=[1,1,1];
        this.context=canvas.getContext('webgpu');
        this.adapter=await navigator.gpu.requestAdapter();
        this.device=await this.adapter.requestDevice();
        this.presentationFormat=navigator.gpu.getPreferredCanvasFormat();
        this.context.configure({
            device: this.device,
            format: this.presentationFormat,
            alphaMode: 'opaque'
        });
        this.depthTexture=this.device.createTexture({
            size: [this.canvas.width,this.canvas.height],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
        //ランタイムで内容を変化させたい。
        let bufferposition=0;
        let shaderLocations=0;
        const pipelinebuffers={vertex:{arrayStride:0,attributes:[]},instance:{arrayStride:0,stepMode:"instance",attributes:[]}}
        for(let k=0; k<this.vertconfig.length; ++k){
            pipelinebuffers.vertex.attributes.push({shaderLocation:shaderLocations,offset:bufferposition,format:this.vertconfig[k]});
            switch (this.vertconfig[k]){
                case "float32":
                    bufferposition+=4;
                    break;
                case "float32x2":
                    bufferposition+=8;
                    break;
                case "float32x3":
                    bufferposition+=12;
                    break;
                case "float32x4":
                    bufferposition+=16;
                    break;
            }
            shaderLocations++;
        }
        pipelinebuffers.vertex.arrayStride=bufferposition;
        bufferposition=0;
        if(this.method=="instance"){
        for(let k=0; k<this.instanceconfig.length; ++k){
            pipelinebuffers.instance.attributes.push({shaderLocation:shaderLocations,offset:bufferposition,format:this.instanceconfig[k]});
            switch (this.instanceconfig[k]){
                case "float32":
                    bufferposition+=4;
                    break;
                case "float32x2":
                    bufferposition+=8;
                    break;
                case "float32x3":
                    bufferposition+=12;
                    break;
                case "float32x4":
                    bufferposition+=16;
                    break;
            }
            shaderLocations++;
        }
        pipelinebuffers.instance.arrayStride=bufferposition;
        }
        let bufferstructure;
        if(this.method=="instance"){
            bufferstructure=[pipelinebuffers.vertex,pipelinebuffers.instance];
        }else{
            bufferstructure=[pipelinebuffers.vertex];
        }
        this.inststructurecount=pipelinebuffers.instance.arrayStride/4;
        this.vertstructurecount=pipelinebuffers.vertex.arrayStride/4;
        this.pipeline=this.device.createRenderPipeline({
            layout:'auto',
            vertex:{
                module:this.device.createShaderModule({code: this.wgsl}),
                entryPoint:'main',
                buffers:bufferstructure,
            },
            fragment:{
                module:this.device.createShaderModule({code:this.wgsl}),
                entryPoint:'fragmain',
                targets:[
                    {
                        format:this.presentationFormat,
                        blend:{
                            color:{
                                srcFactor:'one',
                                dstFactor:'one-minus-src-alpha'
                            },
                            alpha:{
                                srcFactor: 'one',
                                dstFactor: 'one-minus-src-alpha'
                            }
                        }
                    }
                ]
            },
            primitive:{
                topology:this.webGPUtopology
            },
            depthStencil:{
                depthWriteEnabled:true,
                depthCompare:'less',
                format:'depth24plus',
            }
        });
        this.verticesBuffer=this.device.createBuffer({
            size: this.vertex.byteLength,
            usage: GPUBufferUsage.VERTEX,
            mappedAtCreation: true,
        });
        new Float32Array(this.verticesBuffer.getMappedRange()).set(this.vertex);
        this.verticesBuffer.unmap();
        if(this.method=="instance"){
        this.indicesBuffer=this.device.createBuffer({
            size: this.index.byteLength,
            usage: GPUBufferUsage.INDEX,
            mappedAtCreation: true,
        });
        new Uint16Array(this.indicesBuffer.getMappedRange()).set(this.index);
        this.indicesBuffer.unmap();
        this.instanceBuffer=this.device.createBuffer({size:268435456/10,usage:GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST});
        }
    }
    //毎フレーム呼び出される。
    render(inst){
        const uniformBuffer=this.device.createBuffer({
            size:4*this.uniform.length,
            usage:GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        const p=new Float32Array(this.uniform);
        this.device.queue.writeBuffer(
            uniformBuffer,
            0,
            p.buffer,
            p.byteOffset,
            p.byteLength
        );
        if(this.method=="instance"){
            const instp=new Float32Array(inst);
            this.device.queue.writeBuffer(this.instanceBuffer,0,instp);
        }
        const bindGroup=this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [{binding:0,resource:{buffer:uniformBuffer}}]
        });
        const commandEncoder=this.device.createCommandEncoder();
        const renderPassDescriptor={
            colorAttachments: [
                {
                    view:this.context.getCurrentTexture().createView(),
                    clearValue:{r:this.background[0],g:this.background[1],b:this.background[2],a:1},loadOp:'clear',storeOp:'store'
                }
            ],
            depthStencilAttachment:{view: this.depthTexture.createView(),depthClearValue: 1,depthLoadOp: 'clear',depthStoreOp: 'store'}
        };
        const passEncoder=commandEncoder.beginRenderPass(renderPassDescriptor);
        passEncoder.setPipeline(this.pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.setVertexBuffer(0,this.verticesBuffer);
        if(this.method=="instance"){
            passEncoder.setIndexBuffer(this.indicesBuffer,"uint16");
            passEncoder.setVertexBuffer(1,this.instanceBuffer);
            passEncoder.drawIndexed(this.index.length,instp.length/this.inststructurecount);
        }
        if(this.method=="segment"){
            passEncoder.draw(this.vertex.length/this.vertstructurecount);
        }
        passEncoder.end();
        this.device.queue.submit([commandEncoder.finish()]);
    }
    library(geometry){
        if(geometry.type[0]=="E"){
            if(geometry.dim==2){
            }
            if(geometry.dim==3){
            }
        }
    }
}
