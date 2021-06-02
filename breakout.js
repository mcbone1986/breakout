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
    this.load.image('ball', '/assets/images/ball_32_32.png')
    this.load.image('brick1', '/assets/images/brick1_64_32.png')
    this.load.image('brick2', '/assets/images/brick2_64_32.png')
    this.load.image('brick3', '/assets/images/brick3_64_32.png')
    this.load.image('paddle', '/assets/images/paddle_128_32.png')
    this.load.image('starbg', '/assets/images/preview-4.jpg')
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
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '45px',
            fill: '#fff'    
        }
    );
        
openingText.setOrigin(0.5);

/// GAME OVER, MAN! GAME OVER!
gameOverText = this.add.text(
    this.physics.world.bounds.width / 2,
    this.physics.world.bounds.height / 2,
    'GAME OVAH',
    {
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '45px',
        fill: '#fff'
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
        fontFamily: 'Monaco, Courier, monospace',
        fontSize: '45px',
        fill: '#fff'
    }
);

playerWonText.setOrigin(0.5);
playerWonText.setVisible(false)

}

function update ()
{

    if (isGameOver(this.physics.world)) {
        //TODO -- game over splash, post to hi-score
        gameOverText.setVisible(true)
        ball.disableBody(true, true)
    } else if (isWon()) {
        //TODO -- game won, refresh bricks? game over?
        playerWonText.setVisible(true)
        ball.disableBody(true, true)

    } else {
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
        //add scoring here, 
        
    }

}


function isGameOver(world) {
    return ball.body.y > world.bounds.height;

}

function isWon() {
    return violetBricks.countActive() + yellowBricks.countActive() + redBricks.countActive() === 0 
}

function hitBrick(ball, brick) {
    brick.disableBody(true, true)  //looks for the ball / brick argument, if both true then make brick inactive

    if (ball.body.velocity.x === 0) {
        randNum = Math.random();
        if (randNum >= 0.5) {
            ball.body.setVelocityX(150);
        } else {
            ball.body.setVelocityX(-150);
        }
    }
}

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

