import '../../helpers/events';
import CustomState from './CustomState';
require('@hughsk/fulltilt/dist/fulltilt.min.js');
import GyroNorm from 'gyronorm';

var segment, nextSegment, vector;

class MouseTrail1 extends CustomState {
    init(data) {
        this.sentence = " " + data.text || "UNDEFINED";
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.gyro = new GyroNorm();
    }

    preload() {
        this.game.load.bitmapFont('monoSpace', 'assets/images/bitmapfont/spacemono-regular_regular_48.PNG', 'assets/images/bitmapfont/spacemono-regular_regular_48.fnt');
        this.target = new Phaser.Point();
        this.letterArray = this.sentence.split('');
    }

    create() {
        if (this.game.device.desktop) {
            this.clientX = this.game.world.width;
        } else {
            this.clientX = this.game.world.width / 2;
        }

        this.clientY = 0;

        this.snakeGroup = this.game.add.group();

        if (this.snakeGroup.children.length == 0) {
            this.drawChain();
        }

    }

    drawChain() {
        this.points = this.letterArray.length;
        this.distance = 28;
        this.path = [];

        this.snakeHead = this.game.add.bitmapText(this.clientX, this.clientY, 'monoSpace', this.letterArray[0], 30, this.snakeGroup);
        this.snakeHead.anchor.set(0.5, 0.5);

        if (!this.game.device.desktop) {
            this.game.physics.enable(this.snakeHead, Phaser.Physics.ARCADE);
            this.snakeHead.body.collideWorldBounds = true;
        }

        this.path.push(this.snakeHead);

        for (var i = 1; i < this.points; i++) {
            this.path.push(this.game.add.bitmapText(this.clientX + i * this.distance, this.clientY, 'monoSpace', this.letterArray[i], 30, this.snakeGroup));
        }

        if (!this.game.device.desktop) {
            this.gyro = new GyroNorm();

            this.gyro.init({
                frequency: 10,                   // ( How often the object sends the values - milliseconds )
                gravityNormalized: true,         // ( If the garvity related values to be normalized )
                orientationBase: GyroNorm.GAME,      // ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
                decimalCount: 2,                 // ( How many digits after the decimal point will there be in the return values )
                logger: false,                    // ( Function to be called to log messages from gyronorm.js )
                screenAdjusted: false            // ( If set to true it will return screen adjusted values. )
            }).then(() => {
                this.gyro.start((data)=> {
                    let speedScale = 1.8;

                    if (this.snakeHead) {
                        this.snakeHead.x += data.dm.gx * speedScale;
                        this.snakeHead.y -= data.dm.gy * speedScale;
                    }
                });
            });
        }
    }

    update() {
        if (this.game.device.desktop) {
            this.clientX = global.MOUSE_X << 1; //bit shifting 1 to the left equals times 2 ;-)
            this.clientY = global.MOUSE_Y << 1;
            this.snakeHead.x = this.clientX;
            this.snakeHead.y = this.clientY;
        }

        let length = this.points - 1;
        let i = 0;
        while (i < length) {
            segment = this.path[i];
            nextSegment = this.path[i + 1];

            if (nextSegment) {
                vector = new Phaser.Point(segment.x - nextSegment.x, segment.y - nextSegment.y);
                vector.setMagnitude(this.distance);
                nextSegment.position = new Phaser.Point(segment.x - vector.x, segment.y - vector.y);
            }
            i++;
        }
    }

    shutdown() {
        if (this.snakeGroup) {
            this.snakeGroup.destroy(true);
        }

        if (this.snakeHead) {
            this.snakeHead.destroy();
        }

        if (!this.game.device.desktop) {
            this.gyro.stopLogging();
        }
    }
}

export default MouseTrail1;
