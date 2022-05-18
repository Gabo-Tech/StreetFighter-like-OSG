function rectangularCollision({rectangle1, rectangle2}){
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId)
    if(player.health===enemy.health){
        gameMessage.innerHTML = `<h1>Tie!</h1><br>
        <button onclick="location.reload();">Restart game</button>`
    } else if(player.health>enemy.health){
        gameMessage.innerHTML = `<h1>Player 1 wins!</h1><br>
                              <button onclick="location.reload();">Restart game</button>`
    } else {
        gameMessage.innerHTML = `<h1>Player 2 wins!</h1><br>
        <button onclick="location.reload();">Restart game</button>`
    }
}

let timerTime = 100
let timerId
function decreaseTimer(){
    if(timerTime>0){
        timerId = setTimeout(decreaseTimer, 1000)
        timerTime--
        time.innerHTML = timerTime
    }
    if(timerTime===0){
       determineWinner({player, enemy, timerId})
    }
}
