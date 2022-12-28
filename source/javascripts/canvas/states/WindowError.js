import '../../helpers/events';
import CustomState from "./CustomState";
require('@hughsk/fulltilt/dist/fulltilt.min.js');
import GyroNorm from 'gyronorm';

class MouseTrail1 extends CustomState {
    init(data) {
        this.imageUrl = data.image;
        this.imageScale = data.scale;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.gyro = new GyroNorm();
    }

    preload() {
        this.game.load.image('window', this.imageUrl);
    }

    create() {
        this.texture = this.game.add.renderTexture(this.game.world.width, this.game.world.height, 'texture');
        this.cara = this.game.make.sprite(this.clientX, this.clientY, 'window');
        this.cara.anchor.set(0.5);
        this.cara.scale.setTo(this.imageScale);
        this.game.add.sprite(0, 0, this.texture);

        this.caraDimensions = {width: this.cara.width * this.imageScale, height: this.cara.height * this.imageScale};

        if (!this.game.device.desktop) {
            this.gyro = new GyroNorm();
            this.clientX = this.world.centerX;
            this.clientY = this.world.centerY;

            this.gyro.init({
                frequency: 5,                   // ( How often the object sends the values - milliseconds )
                gravityNormalized: true,         // ( If the garvity related values to be normalized )
                orientationBase: GyroNorm.GAME,      // ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
                decimalCount: 2,                 // ( How many digits after the decimal point will there be in the return values )
                logger: false,                    // ( Function to be called to log messages from gyronorm.js )
                screenAdjusted: false            // ( If set to true it will return screen adjusted values. )
            }).then(() => {
                this.gyro.start((data)=> {
                    let speedScale = 1.8;

                    this.clientX += data.dm.gx * speedScale;
                    this.clientY -= data.dm.gy * speedScale;
                });
            });
        }
    }

    update() {
        if (this.clientX > (this.world.width + this.caraDimensions.width)) {
            this.clientX = -this.caraDimensions.width;
        }

        if (this.clientX < -this.caraDimensions.width) {
            this.clientX = this.world.width;
        }

        if (this.clientY > (this.world.height + this.caraDimensions.height)) {
            this.clientY = -this.caraDimensions.height;
        }

        if (this.clientY < -this.caraDimensions.height) {
            this.clientY = this.world.height;
        }

        if (this.game.device.desktop) {
            this.clientX = global.MOUSE_X << 1; //bit shifting 1 to the left equals times 2 ;-)
            this.clientY = global.MOUSE_Y << 1;
        }

        this.texture.renderXY(this.cara, this.clientX, this.clientY);
    }

    shutdown() {
        if (this.texture) {
            this.texture.destroy(true);
        }

        if (this.cara) {
            this.cara.destroy();
        }

        if (!this.game.device.desktop) {
            this.gyro.stopLogging();
        }
    }
}

export default MouseTrail1;
