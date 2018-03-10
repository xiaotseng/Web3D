var scene,camera,renderer,mesh;
var meshFloor;
var keyboard={};
var player={height:1.8,speed:0.01,turnSpeed:Math.PI*0.01};//玩家
var playerController={matrix:new THREE.Matrix4()};//玩家控制器
function init() {
    scene=new THREE.Scene();
    player.rootComponent=new THREE.Object3D();
    camera=new THREE.PerspectiveCamera(90,1280/720,0.1,1000);
    mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xff4444,wireframe:true}));
    scene.add(mesh);
    meshFloor=new THREE.Mesh(new THREE.PlaneGeometry(10,10,10,10),new THREE.MeshBasicMaterial({color:0x888888,wireframe:false}));
    meshFloor.rotation.x-=Math.PI*0.5;
    scene.add(meshFloor);
    scene.add(new THREE.AxisHelper(10));

    camera.position.set(0,5,-5);
    camera.lookAt(new THREE.Vector3(0,0,0));
    //重置状态
    playerController.matrix=camera.matrixWorld;

    renderer=new THREE.WebGLRenderer();
    renderer.setSize(1280,720);
    document.body.appendChild(renderer.domElement);
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
        camera.position.add(new THREE.Vector3().setFromMatrixColumn(playerController.matrix,2).negate().multiplyScalar(player.speed));
    }
    if(keyboard[83]){//S键
        //camera.position.add(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,2).multiplyScalar(player.speed));
        camera.position.add(new THREE.Vector3().setFromMatrixColumn(playerController.matrix,2).multiplyScalar(player.speed));

    }
    if(keyboard[65]){//W键
        camera.position.add(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0).negate().multiplyScalar(player.speed));
    }
    if(keyboard[68]){//S键
        camera.position.add(new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0).multiplyScalar(player.speed));

    }
    renderer.render(scene,camera);
}
Actor=function () {
    this.name="1";
    this.rootComponent=new THREE.Object3D();
    this.beginPlay=function () {
    };

};
function keyDown(event) {
    keyboard[event.keyCode]=true;
}
function keyUp(event) {
     keyboard[event.keyCode]=false;
    
}
window.addEventListener("keydown",keyDown);
window.addEventListener("keyup",keyUp);
window.onload=init;