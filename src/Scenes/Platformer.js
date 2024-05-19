class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 800;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -450;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.MAX_VELOCITY = 150;
        this.spin = 0;
        this.inAir = false;
        this.score = 0;
        this.scoreboard;
        this.text1;
        this.text2;
        this.finished = false;
    }

    create() {
        this.map = this.add.tilemap("platformer_level", 16, 16, 60, 20);
        this.tileset = this.map.addTilesetImage("pixel_line_platformer", "tilemap_tiles");

        // Create a layer
        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 0, 100).setScrollFactor(0.5);
        this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        //create objects
        this.bees = this.map.createFromObjects("Objects", {
            name: "Bee",
            key: "tilemap_sheet",
            frame: 52
        });
        for(let bee of this.bees){
            bee.anims.play('beesFly');
        }

        this.flag = this.map.createFromObjects("Objects", {
            name: "Flag1",
            key: "extra_sheet",
            frame: 111
        })
        for(let flag of this.flag){
            flag.anims.play('flagFly');
        }
        this.pole = this.map.createFromObjects("Objects", {
            name: "Flag2",
            key: "extra_sheet",
            frame: 131
        })
        

        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.bees, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.pole, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.beeGroup = this.add.group(this.bees);
        this.flagGroup = this.add.group(this.pole);
        

        // set up player avatar
        const p1Spawn = this.map.findObject("Objects", obj => obj.name === "P1 Spawn");
        my.sprite.player = this.physics.add.sprite(p1Spawn.x, p1Spawn.y, "timemap_sheet", 42);
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.beeGroup, (obj1, obj2) => {
            obj2.destroy();
            this.score += 100;
        });

        this.text1 = this.add.text(375, 275, "Nice One!",
        {
            fontSize: 64,
            fontFamily: 'Patrick Hand SC',
            color: "#125"
        });
        this.text2 = this.add.text(375, 325, "Final Score: " ,
        {
            fontSize: 40,
            fontFamily: 'Patrick Hand SC',
            color: "#125"
        });
        this.text1.scrollFactorX = 0;
        this.text1.scrollFactorY = 0;
        this.text2.scrollFactorX = 0;
        this.text2.scrollFactorY = 0;
        this.text1.visible = false;
        this.text2.visible = false;

        //display text at end of level
        this.physics.add.overlap(my.sprite.player, this.flagGroup, (obj1, obj2) => {
            this.text1.visible = true;
            this.text2.visible = true;
            this.scoreboard.visible = false;
            this.text2.setText("Final Score: " + this.score);
            this.finished = true;
        });
        
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.qKey = this.input.keyboard.addKey('Q');
        this.eKey = this.input.keyboard.addKey('E');
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //walking particles
        my.vfx.walking = this.add.particles(0, 0, "smoke", {
            scale: {start: 0.01, end: 0.05},
            lifespan: 350,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.walking.stop();

        //jumping particles
        my.vfx.jumping = this.add.particles(0, 0, "smoke", {
            quantity: 10,
            stopAfter: 10,
            scale: {start: 0.01, end: 0.05},
            lifespan: 350,
            alpha: {start: 1, end: 0.1}, 
            radial: true,
            angle: {min: 0, max: 180}
        });
        my.vfx.jumping.stop();

        //player config
        my.sprite.player.setSize(16, 16, true);
        my.sprite.player.setOffset(0, 0);
        my.sprite.player.setMaxVelocity(this.MAX_VELOCITY, 10000000);

        //camera config
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(20, 20);
        this.cameras.main.setZoom(3);

        //score hud
        this.scoreboard = this.add.text(325, 215, "Score: " + this.score,
        {
            fontSize: 16,
            fontFamily: 'Patrick Hand SC',
            color: "#125"
        });
        this.scoreboard.scrollFactorX = 0;
        this.scoreboard.scrollFactorY = 0;
    }

    update() {
        this.scoreboard.setText("Score: " + this.score);

        if(cursors.left.isDown && this.finished == false) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-1, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }
            

        } else if(cursors.right.isDown && this.finished == false) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-1, false);
            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        if(this.qKey.isDown && this.inAir == true){
            my.sprite.player.setAngularVelocity(-750);
        }
        else if(this.eKey.isDown && this.inAir == true){
            my.sprite.player.setAngularVelocity(750);
        }
        else{
            my.sprite.player.setAngularVelocity(0);
        }
        //check for flips in the air  
        if(this.inAir == true){
            my.vfx.walking.stop();
            if((my.sprite.player.rotation > 3 || my.sprite.player.rotation < -3) && (this.spin % 2 == 0)){
                this.spin++;
            }
            if((my.sprite.player.rotation > -0.5 && my.sprite.player.rotation < 0.5) && (this.spin % 2 == 1)){
                this.spin++;
            }
        }
        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
            this.inAir = true;
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)  && this.finished == false) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("jumpSound");
            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-1, false);
            my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.jumping.start();
        }
        //reset rotation and add score
        if(my.sprite.player.body.blocked.down){
            if(my.sprite.player.rotation > -0.5 && my.sprite.player.rotation < 0.5 && this.spin > 0){
                this.score += (this.spin * 100);
                this.sound.play("flipSound");
            }
            my.sprite.player.rotation = 0;
            this.spin = 0;
            this.inAir = false;
        }

        if(Phaser.Input.Keyboard.JustDown(this.space) && this.finished == true){
            this.scene.start("TitleScreen");
        }
    }

    init_game(){
        this.spin = 0;
        this.inAir = false;
        this.score = 0;
        this.scoreboard.visible = true;
        this.text1.visible = false;
        this.text2.visible = false;
        this.finished = false;
    }
}