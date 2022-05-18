const canvas = document.querySelector('canvas')
const canvasContext = canvas.getContext('2d')
const enemyHealth = document.getElementById('enemy-health')
const playerHealth = document.getElementById('player-health')
const time = document.getElementById('timer')
const gameMessage = document.getElementById('game-message')

canvas.width = 1280
canvas.height = 720

canvasContext.fillRect(0,0, canvas.width, canvas.height)

const gravity = 0.2

const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: './assets/backgroundGood_resized2.png'
})
const shop = new Sprite({
    position: {
        x:1050,
        y:265
    },
    imageSrc: './assets/shop.png',
    scale: 3,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x:130,
        y:200
    },
    velocity: {
        x:0,
        y:0
    },
    offset: {
        x:-50 ,
        y:62
    },
    imageSrc: './assets/Wizard Pack/Idle.png',
    scale: 1.5,
    framesMax: 6,
    offset:{x:0,y:62},
    sprites:{
        idle:{
            imageSrc: './assets/Wizard Pack/Idle.png',
            framesMax: 6,
        },
        run:{
            imageSrc: './assets/Wizard Pack/Run.png',
            framesMax: 8,
        },
        jump:{
            imageSrc: './assets/Wizard Pack/Jump.png',
            framesMax: 2,
        },
        fall:{
            imageSrc: './assets/Wizard Pack/Fall.png',
            framesMax: 2,
        },
        attack2:{
            imageSrc: './assets/Wizard Pack/Attack2.png',
            framesMax: 8,
        },
        takeHit:{
            imageSrc: './assets/Wizard Pack/Hit.png',
            framesMax: 4,
        },
        death:{
            imageSrc: './assets/Wizard Pack/Death.png',
            framesMax: 7,
        }
    },
    attackBox: {
        offset:{
            x: -300,
            y: 0
        },
        width: 150,
        height: 50
    }
})


const enemy = new Fighter({
    position: {
        x:1110,
        y:200
    },
    velocity: {
        x:0,
        y:0
    },
    color: 'blue',
    offset: {
        x:0,
        y:167
    },
    imageSrc: './assets/Evil Wizard/Sprites/Idle.png',
    scale: 2.8,
    framesMax: 8,
    offset:{x:320,y:140},
    sprites:{
        idle:{
            imageSrc: './assets/Evil Wizard/Sprites/Idle.png',
            framesMax: 8,
        },
        run:{
            imageSrc: './assets/Evil Wizard/Sprites/Move.png',
            framesMax: 8,
        },
        jump:{
            imageSrc: './assets/Evil Wizard/Sprites/Idle.png',
            framesMax: 8,
        },
        fall:{
            imageSrc: './assets/Evil Wizard/Sprites/Idle.png',
            framesMax: 8,
        },
        attack2:{
            imageSrc: './assets/Evil Wizard/Sprites/Attack.png',
            framesMax: 8,
        },
        takeHit:{
            imageSrc: './assets/Evil Wizard/Sprites/Take Hit.png',
            framesMax: 4,
        },
        death:{
            imageSrc: './assets/Evil Wizard/Sprites/Death.png',
            framesMax: 5,
        }
    },
    attackBox: {
        offset:{
            x: 450,
            y: 0
        },
        width: 150,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },    
}

decreaseTimer()

function animation(){
    window.requestAnimationFrame(animation)
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0,0, canvas.width, canvas.height)
    background.update()
    shop.update()
    canvasContext.fillStyle = 'rgba(0,0,0,0.25)'
    canvasContext.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()
    player.velocity.x = 0
    enemy.velocity.x = 0
    //Player movement
    
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }
    if(player.velocity.y < 0){
        player.switchSprite('jump');
    } else if (player.velocity.y > 0){
        player.switchSprite('fall');
    }
    //Enemy movement

    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }
    if(enemy.velocity.y < 0){
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall');
    }
    //Detect for collision
    if (rectangularCollision({rectangle1:player, rectangle2:enemy}) && player.isAttacking){
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemy-health', {
            width: enemy.health + '%'
          })
    }

    if (rectangularCollision({rectangle1:enemy, rectangle2:player}) && enemy.isAttacking){
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#player-health', {
            width: player.health + '%'
          })
    }

    //End game based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }
}

animation()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
      switch (event.key) {
        case 'd':
          keys.d.pressed = true
          player.lastKey = 'd'
          break
        case 'a':
          keys.a.pressed = true
          player.lastKey = 'a'
          break
        case 'w':
          player.velocity.y = -10
          break
        case 's':
          player.attack()
          break
      }
    }
  
    if (!enemy.dead) {
      switch (event.key) {
        case 'ArrowRight':
          keys.ArrowRight.pressed = true
          enemy.lastKey = 'ArrowRight'
          break
        case 'ArrowLeft':
          keys.ArrowLeft.pressed = true
          enemy.lastKey = 'ArrowLeft'
          break
        case 'ArrowUp':
          enemy.velocity.y = -10
          break
        case 'ArrowDown':
          enemy.attack()
  
          break
      }
    }
  })
window.addEventListener('keyup', (e) => {
    switch (e.key){
        case 'd':
            keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break
    }
    switch (e.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
        break
    }
})