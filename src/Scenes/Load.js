class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        // this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');

        this.load.setPath("./assets/");

        // Load characters spritesheet
        // this.load.atlas("platformer_characters", "tilemap_packed.png", "pixel_line_platformer.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("platformer_level", "platformer_level.tmj");   // Tilemap in JSON

        this.load.image("extra_tiles", "tilemap_packed_2.png");

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 16,
            frameHeight: 16
        });

        this.load.spritesheet("extra_sheet", "tilemap_packed_2.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.audio("jumpSound", "tone1.ogg");
        this.load.audio("flipSound", "threeTone2.ogg");
        this.load.image("smoke", "smoke_02.png");

        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        // this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.anims.create({
            key: 'walk',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                {frame: 42},
                {frame: 41}
            ],
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                { frame: 42 }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                {frame: 41}
            ]
        });

        this.anims.create({
            key: 'beesFly',
            defaultTextureKey: "tilemap_sheet",
            frames: [
                {frame: 51},
                {frame: 52}
            ],
            frameRate: 3,
            repeat: -1
        })

        this.anims.create({
            key: 'flagFly',
            defaultTextureKey: "extra_sheet",
            frames: [
                {frame: 111},
                {frame: 112}
            ],
            frameRate: 3,
            repeat: -1
        })

        this.text1 = this.add.text(game.config.width/2, game.config.height/2 - 50, "Test",
        {
            fontSize: 64,
            fontFamily: 'Patrick Hand SC',
        });

         // ...and pass to the next Scene
         this.scene.start("TitleScreen");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}