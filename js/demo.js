//全局变量
var scene,camera,renderer,mesh;
var meshFloor;
var keyboard={};
var player={height:1.8,speed:0.01,turnSpeed:Math.PI*0.01};//玩家
var playerController={matrix:new THREE.Matrix4()};//玩家控制器
var crate,crateTexture,crateNormalMap,crateBumpMap;
function init() {
    scene=new THREE.Scene();
     //渲染
    renderer=new THREE.WebGLRenderer();
    renderer.setSize(1280,720);
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.BasicShadowMap;
    document.body.appendChild(renderer.domElement);

    player.rootComponent=new THREE.Object3D();

    //材质贴图
    var textureLoader=new THREE.TextureLoader();
    crateTexture=textureLoader.load("texture/crate1_diffuse.png");
    crateBumpMap=textureLoader.load("texture/crate1_bump.png");
    crateNormalMap=textureLoader.load("texture/crate1_normal.png");

    var gltfLoader=new THREE.GLTFLoader();
    gltfLoader.load("models/glTF/testScene.gltf",function (scene1) {
        scene.add(scene1.scene);


    });

    var boxmat=new THREE.MeshPhongMaterial({color:0xff4444, wireframe:false});//红色BOX的材质
    //添加物体
    mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),boxmat);
    mesh.castShadow=true;
    scene.add(mesh);
    meshFloor=new THREE.Mesh(new THREE.PlaneGeometry(10,10,10,10),new THREE.MeshPhongMaterial({color:0x888888,wireframe:false}));
    meshFloor.receiveShadow=true;
    meshFloor.rotation.x-=Math.PI*0.5;
    scene.add(meshFloor);
    mesh.position.y+=1;
    scene.add(new THREE.AxisHelper(10));
    //灯光
    scene.add(new THREE.AmbientLight(0xffffff,0.5));
    PointLight1=new THREE.PointLight(0xffffff,1,200);
    PointLight1.castShadow=true;
    PointLight1.position.y=100;
    PointLight1.lookAt(new THREE.Vector3(0,0,0));
    scene.add(PointLight1);

    crate=new THREE.Mesh(new THREE.BoxGeometry(3,3,3),new THREE.MeshPhongMaterial({color:0xffffff,map:crateTexture,bumpMap:crateBumpMap,normalMap:crateNormalMap}));
    crate.position.set(2.5,3/2,2.5);
    crate.castShadow=true;
    crate.receiveShadow=true;
    scene.add(crate);
     //相机
    camera=new THREE.PerspectiveCamera(90,1280/720,0.1,1000);
    camera.position.set(0,100,-50);
    camera.lookAt(new THREE.Vector3(0,0,0));
    //重置PlayerController
    //camera.matrixWorld=playerController.matrix;

     //场景循环
    animate();
}
function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x+=0.01;
    mesh.rotation.y+=0.02;
    var rotMat=new THREE.Matrix4();//旋转增量
    if(keyboard[37]){//左方向键
        camera.rotation.y-=player.turnSpeed;
        //更新Controller

        playerController.matrix.multiply(new THREE.Matrix4().makeRotationY(-player.turnSpeed));
    }
    if(keyboard[39]){//右方向键
        camera.rotation.y+=player.turnSpeed;
        //更新Controller

        playerController.matrix.multiply(new THREE.Matrix4().makeRotationY(player.turnSpeed));

    }
    if(keyboard[87]){//W键
        //camera.position.add(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,2).negate().multiplyScalar(player.speed));
        camera.position.add(new THREE.Vector3().setFromMatrixColumn(playerController.matrix,2).negate().setComponent(1,0).normalize().multiplyScalar(player.speed));
    }
    if(keyboard[83]){//S键
        //camera.position.add(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,2).multiplyScalar(player.speed));
        camera.position.add(new THREE.Vector3().setFromMatrixColumn(playerController.matrix,2).setComponent(1,0).normalize().multiplyScalar(player.speed));

    }
    if(keyboard[65]){//A键
        camera.position.add(new THREE.Vector3().setFromMatrixColumn(playerController.matrix,0).setComponent(1,0).normalize().negate().multiplyScalar(player.speed));
    }
    if(keyboard[68]){//D键
        camera.position.add(new THREE.Vector3().setFromMatrixColumn(playerController.matrix,0).setComponent(1,0).normalize().multiplyScalar(player.speed));

    }
    renderer.render(scene,camera);
}
//控制器类型的定义
Controller=function() {
    this.roll=0.0;
    this.pitch=0.0;
    this.yaw=0.0;
};

Controller.prototype={
    constructor:Controller,
    addPitch:function (deltaValue) {
        this.pitch+=deltaValue;
    },
    addYaw:function (deltaValue) {
        this.yaw+=deltaValue;
    },
    addRoll:function (deltaValue) {
        this.roll+=deltaValue;
    },
    type:"controller",
    getRotMatrix:function () {//取得旋转矩阵
        return new THREE.Matrix4().makeRotationX(this.roll).
        premultiply(new THREE.Matrix4().makeRotationY(this.pitch)).
        premultiply(new THREE.Matrix4().makeRotationZ(this.yaw));
    }
};
var controller1=new Controller();
console.log(controller1);



function keyDown(event) {
    keyboard[event.keyCode]=true;
}
function keyUp(event) {
     keyboard[event.keyCode]=false;
    
}



window.addEventListener("keydown",keyDown);
window.addEventListener("keyup",keyUp);
window.onload=init;