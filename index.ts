import Phaser from 'phaser';

// Import stylesheets
import './style.css';

/* ----------------------------------- START SCENE --------------------------------- */
class BootLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'BootLevel' });
  }

  preload() {
    // CHANGE BASE URL!!!!
    this.add.text(20, 20, 'Boot Sequence Initiated.');
    this.load.baseURL =
      'https://neoalchemy.github.io/starting-boilerplate-phaser-zcqxxx/';
    this.load.bitmapFont({
      key: 'Oswald',
      textureURL: 'static/assets/font/OswaldLightRed.png',
      fontDataURL: 'static/assets/font/OswaldLightRed.xml',
    });
    this.load.image('logo', 'static/assets/logo.png');
    this.load.image('splashscreen', 'static/assets/splashscreen.png');
  }

  create() {
    this.scene.start('SplashLevel');
  }
}

/* ----------------------------------- START SCENE --------------------------------- */
class SplashLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'SplashLevel' });
  }

  preload() {
    const splashScreen = this.add.image(200, 200, 'splashscreen');

    const logo = this.add.image(200, 100, 'logo');
    logo.setScale(0.3);
    this.logo = logo;

    const text1 = this.add.bitmapText(-300, 200, 'Oswald', 'NeoAlchemy', 32);
    this.companyLine1 = text1;
    const text2 = this.add.bitmapText(-300, 230, 'Oswald', 'Indie Games', 32);
    this.companyLine2 = text2;

    const loading = this.add.text(180, 300, ['Loading...'], {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: 'black',
      align: 'center',
    });

    /* START PRELOAD ITEMS */
    this.load.baseURL =
      'https://neoalchemy.github.io/quetzalcoatl-phaser-zapeax/';
    this.load.image('head', 'static/assets/quetzalcoatl-head.png');
    this.load.image('tail', 'static/assets/quetzalcoatl-tail.png');
    this.load.image('body', 'static/assets/quetzalcoatl-body.png');
    this.load.image('corner', 'static/assets/quetzalcoatl-corner-v2.png');
    this.load.image('mayanFood', 'static/assets/mayan-food.png');
    /* END PRELOAD ITEMS */
  }
  private logo: Phaser.GameObjects.Image;
  private companyLine1: Phaser.GameObjects.BitmapText;
  private companyLine2: Phaser.GameObjects.BitmapText;

  create() {
    this.tweens.add({
      targets: this.logo, //your image that must spin
      rotation: 2 * Math.PI, //rotation value must be radian
      ease: 'Bounce',
      delay: 600,
      duration: 600, //duration is in milliseconds
    });

    this.tweens.add({
      targets: this.companyLine1, //your image that must spin
      x: '140',
      ease: 'Elastic',
      duration: 500, //duration is in milliseconds
    });
    this.tweens.add({
      targets: this.companyLine2, //your image that must spin
      x: '140',
      ease: 'Elastic',
      duration: 500, //duration is in milliseconds
    });

    setTimeout(() => {
      this.scene.start('MainLevel');
    }, 2000);
  }

  update() {}
}

/* ----------------------------------- MAIN SCENE --------------------------------- */
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

class MainLevel extends Phaser.Scene {
  constructor() {
    super({ key: 'MainLevel' });
  }

  preload() {}

  create() {
    this.cameras.main.setBackgroundColor(0xffdead);

    var headPosition = 200;
    const head = this.physics.add.sprite(headPosition, 200, 'head'); //113
    head.scale = 0.5;
    head.setCollideWorldBounds(true);
    this.head = head;

    const bodyGroup = this.physics.add.group();
    const body1 = this.physics.add.sprite(0, 200, 'body');
    body1.scale = 0.5;
    body1.x = head.x + head.displayWidth / 2 + body1.displayWidth / 2;
    bodyGroup.add(body1);

    const body2 = this.physics.add.sprite(0, 200, 'body');
    body2.scale = 0.5;
    body2.x = body1.x + body1.displayWidth / 2 + body2.displayWidth / 2;
    bodyGroup.add(body2);
    this.bodyGroup = bodyGroup;

    const corner = this.physics.add.sprite(-200, -200, 'corner'); //95
    corner.scale = 0.6;
    this.corner = corner;

    const tail = this.physics.add.sprite(0, 200, 'tail'); //95
    tail.scale = 0.5;
    tail.x = body2.x + body2.displayWidth / 2 + tail.displayWidth / 2;
    this.tail = tail;

    const mayanFood = this.physics.add.sprite(100, 100, 'mayanFood');

    const cursorKeys = this.input.keyboard.createCursorKeys();
    this.cursorKeys = cursorKeys;
  }

  private head: Phaser.GameObjects.Sprite;
  private tail: Phaser.GameObjects.Sprite;
  private corner: Phaser.GameObjects.Sprite;
  private bodyGroup: Phaser.GameObjects.Group;
  private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  private direction: Direction = Direction.Left;

  update() {
    if (this.cursorKeys.left.isDown) {
      this.head.x -= 1;
      this.tail.x -= 1;
      this.bodyGroup
        .getChildren()
        .forEach((body: Phaser.GameObjects.Sprite) => {
          body.x -= 1;
        });
    }
    if (this.cursorKeys.down.isDown) {
      this.direction = Direction.Down;
      this.turn();
      this.cursorKeys.down.reset();
    }
  }

  turn() {
    if (this.direction == Direction.Down) {
      let previousChild: Phaser.GameObjects.Sprite = null;

      if (this.head.angle == 0) {
        previousChild = this.head;
      }

      //let cornerSet = false;
      this.bodyGroup
        .getChildren()
        .forEach((child: Phaser.GameObjects.Sprite, index: number) => {
          if (previousChild == this.head) {
            this.corner.x = previousChild.x + 5;
            this.corner.y = previousChild.y + 5;
            this.corner.angle = -90;
            //cornerSet = true;
            previousChild = child;
          } else if (child.angle == -90) {
            child.y += child.displayHeight / 2;
            child.x = this.head.x;
            previousChild = child;
          } else if (previousChild) {
            child.x = previousChild.x;
            child.y = previousChild.y;
            child.angle = -90;
          }
          console.log(
            index +
              ' - ' +
              child.angle +
              ' - ' +
              this.bodyGroup.getChildren()[index]
          );
          if (
            index + 1 == this.bodyGroup.getChildren().length &&
            child.angle == -90
          ) {
            this.tail.angle = -90;
            this.tail.x = previousChild.x;
            this.tail.y = previousChild.y;
            this.corner.x = -200;
            this.corner.y = -200;
          }
        });

      if (this.head.angle == 0) {
        this.head.angle = -90;
        this.head.y += this.head.displayHeight / 2;
      } else {
        this.head.y += previousChild.displayHeight / 2;
      }

      this.tail.x -= previousChild.displayWidth;
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                RUN GAME.                                   */
/* -------------------------------------------------------------------------- */

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  backgroundColor: '0x000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  scene: [BootLevel, SplashLevel, MainLevel],
};

const game = new Phaser.Game(config);
