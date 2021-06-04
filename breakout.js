let player, ball, violetBricks, yellowBricks, redBricks, starbg, cursors;

let openingText, gameOverText, playerWonText;

let gameStarted = false;

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter:Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false,
            // debug: true
        },
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', '/assets/images/BoneBreakout_Ball.png')
    this.load.image('brick1', '/assets/images/BoneBreakout_BrickL1.png')
    this.load.image('brick2', '/assets/images/BoneBreakout_BrickL2.png')
    this.load.image('brick3', '/assets/images/BoneBreakout_BrickL3.png')
    this.load.image('paddle', '/assets/images/BoneBreakout_Paddle.png')
    this.load.image('starbg', '/assets/images/BoneBreakout_BG_800x640_2.png')
}

function create ()
{
    //// CREATING IMAGES ON PAGE 
    //// CREATING IMAGES ON PAGE 
    
    this.add.image(400, 320, 'starbg')

    player = this.physics.add.sprite(
        400, // x position
        600, // y position
        'paddle', // key for sprite image
    )
    

    ball = this.physics.add.sprite(
        400, // x position
        560, // y position
        'ball', // key for ball sprite image
    )

    violetBricks = this.physics.add.group({
        key: 'brick1',
        repeat: 9,
        immovable: true,
        setXY: {
            x: 80,
            y: 140,
            stepX: 70
        }
    });

    yellowBricks = this.physics.add.group({
        key: 'brick2',
        repeat: 9,
        immovable: true,
        setXY: {
            x: 80,
            y: 90,
            stepX: 70
        }
    });

    redBricks = this.physics.add.group({
        key: 'brick3',
        repeat: 9,
        immovable: true,
        setXY: {
            x: 80,
            y: 190,
            stepX: 70
        }
    });

    /// ENABLE KEYBOARD
    /// ENABLE KEYBOARD
    cursors = this.input.keyboard.createCursorKeys()

    /// COLLISION DETECTION
    player.setCollideWorldBounds(true);
    ball.setCollideWorldBounds(true);

    ball.setBounce(1, 1) // setting up a bounce, 1, 1 equates to 0 to float 1, 1 being same velocity back anything less is a softer, each (1, 1) is the x/y

    this.physics.world.checkCollision.down = false;

        /// BRICK COLLISION
        this.physics.add.collider(ball, violetBricks, hitBrick, null, this)
        this.physics.add.collider(ball, yellowBricks, hitBrick, null, this)
        this.physics.add.collider(ball, redBricks, hitBrick, null, this)

        /// PLAYER COLLISION
        player.setImmovable(true)
        this.physics.add.collider(ball, player, hitPlayer, null, this)


/// OPENER TEXT
openingText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'PRESS SPACE TO SHOOT YER BALL',
        {
            fontFamily:  'Poppins, sans-serif',
            fontSize: '45px',
            fill: '#000'    
        }
    );
        
openingText.setOrigin(0.5);

/// GAME OVER, MAN! GAME OVER!
gameOverText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'GAME OVAH',
    {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '45px',
        fill: '#000'
    }
);

gameOverText.setOrigin(0.5);
gameOverText.setVisible(false);

// GAME WON, GOOD... JOB? fetch / post here!
playerWonText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'YOU ARE A WEINER',
    {
        fontFamily: ' Poppins, sans-serif;',
        fontSize: '45px',
        fill: '#000'
    }
);

playerWonText.setOrigin(0.5);
playerWonText.setVisible(false)

var score = 0
var scoreText = this.add.text(3,3, 'Score: 0', {
        fontFamily: ' Poppins, sans-serif;',
        fontSize: '50px',
        fill: '#000' 
        }); 
    
scoreText.setText('Score: ' + score)


function hitBrick(ball, brick) {
    brick.disableBody(true, true)  //looks for the ball / brick argument, if both true then make brick inactive

    score += 10;
    scoreText.setText('Score: ' + score)

    if (ball.body.velocity.x === 0) {
        randNum = Math.random();
        if (randNum >= 0.5) {
            ball.body.setVelocityX(150);
        } else {
            ball.body.setVelocityX(-150);
        }
    }

    if (violetBricks.countActive(true) + yellowBricks.countActive(true) + redBricks.countActive(true) === 0) {
        
        score += 100
        violetBricks.children.iterate(function (child) {
            child.enableBody(true, child.x, child.y, true, true)
        });
        yellowBricks.children.iterate(function (child) {
            child.enableBody(true, child.x, child.y, true, true)
        });
        redBricks.children.iterate(function (child) {
            child.enableBody(true, child.x, child.y, true, true)
        });
       
    }
    
       
    
}



}

function update ()
{

    if (isGameOver(this.physics.world)) {
        //TODO -- game over splash, post to hi-score
        gameOverText.setVisible(true)
        ball.disableBody(true, true)
    } 
    // else if (isWon()) {
        //TODO -- game won, refresh bricks? game over?
        // score += 100
        // playerWonText.setVisible(true)
        // ball.disableBody(true, true)
        // violetBricks.callAll('revive');
        // yellowBricks.callAll('revive');
        // redBricks.callAll('revive');
    // } 
    else {
        //TODO -- regular game time, 

        if (!gameStarted) {
            ball.setX(player.x);
            if (cursors.space.isDown) {
                gameStarted = true;
                openingText.setVisible(false);
                ball.setVelocityY(-200);
            }
        }

        player.body.setVelocityX(0);

        if (cursors.left.isDown || cursors.up.isDown) {
            player.body.setVelocityX(-350);
        } else if (cursors.right.isDown || cursors.down.isDown) {
            player.body.setVelocityX(350);
        }
        
        
    }

}


function isGameOver(world) {
    return ball.body.y > world.bounds.height;

}

function isWon() {
    return violetBricks.countActive() + yellowBricks.countActive() + redBricks.countActive() === 0 
    
}

// function hitBrick(ball, brick) {
//     brick.disableBody(true, true)  //looks for the ball / brick argument, if both true then make brick inactive

    

//     if (ball.body.velocity.x === 0) {
//         randNum = Math.random();
//         if (randNum >= 0.5) {
//             ball.body.setVelocityX(150);
//         } else {
//             ball.body.setVelocityX(-150);
//         }
//     }
// }

function hitPlayer(ball, player) {
    //increase velocity
    ball.setVelocityY(ball.body.velocity.y - 15);

    let newXVelocity = Math.abs(ball.body.velocity.x) + 5;
    if (ball.x < player.x) {
        ball.setVelocityX(-newXVelocity);
    } else {
        ball.setVelocityX(newXVelocity);
    }
}

// function hiScores () {
//     return fetch('http://localhost:3000/hiscores')
//     .then(response => response.json())
//     .then(scores => console.log(scores))
// }

fetch('http://localhost:3000/hiscores')
  .then(response => response.json())
  .then(data => {
        console.log(data);
    
        // const hiScores = document.getElementById('hi_scores');
        // hiScores.innerHTML= "";
        // data.scores.forEach(newScores => {
        //     const li = document.createElement('li')
        //     li.textContent = newScores.textContent
        //     hiScores.append(li)
        // })


  })