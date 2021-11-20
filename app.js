const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

//mouse position
let mouse = {
    x: null,
    y: null,
    radius: (canvas.height/100) * (canvas.width/100)
}

//mouse current positon
window.addEventListener('mousemove',
    function(event){
        mouse.x = event.x
        mouse.y = event.y
    }
);

//particle creation
class particle{
    constructor(x,y,directionX,directionY,size,color){
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    //method to draw individual particles
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle ='#096e6f';
        ctx.fill();
    }
    
    //check mouse and patticle positions, move the particle, draw the partcle
    update(){

        //check if particle is still withing canvas
        if(this.x > canvas.width || this.x < 0){
            this.directionX = -this.directionX;
        }
        if(this.y > canvas.height || this.y <0){
            this.directionY = -this.directionY;
        }

        //Check collision detection: mouse postion , particle position 
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt((dx*dx) + (dy*dy));
        
        if(distance < mouse.radius + this.size){
            if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
                this.x += 5;
            }
            if(mouse.x > this.x && this.x > this.size * 10){
                this.x -= 5;
            }
            if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
                this.y += 5;
            }
            if(mouse.y > this.y && this.y > this.size * 10){
                this.y -= 5;
            }
        }

        //move particle
        this.x += this.directionX;
        this.y += this.directionY;

        //draw praticles
        this.draw();
    }
}

//create particle array
function init(){
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 8000;
    for(let i = 0; i < numberOfParticles; i++){
        let size = (Math.random() * 5 ) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size* 2 );
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size* 2 );
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = '#8c5523';

        particlesArray.push(new particle(x, y, directionX, directionY, size, color));
    }
}

//check if particles are close enough to draw line between the
function connect(){
    let opacityValue = 1;
    for(let a = 0; a < particlesArray.length; a++){
        for(let b = a; b < particlesArray.length; b++){
            let distance = (( particlesArray[a].x - particlesArray[b].x) 
            * (particlesArray[a].x - particlesArray[b].x)) 
            + ((particlesArray[a].y - particlesArray[b].y) 
            * (particlesArray[a].y - particlesArray[b].y));
            if(distance < (canvas.width / 7) * (canvas.height / 7)){
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(140,85,31,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

//animation loop
function animate(){
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for(let i =0; i < particlesArray.length; i++){
        particlesArray[i].update();
    }
    connect();
}

// resize event
window.addEventListener('resize',
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 80) * (canvas.width /80));
        init();
    }
);

//mouse out event
window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

init();
animate();
