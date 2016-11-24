import '../../helpers/events';
import CustomState from "./CustomState";

class teamRotor extends CustomState {
    init(data) {
        this.face = data.face;
    }

    preload() {
        this.game.load.image('rotor-vincent', 'assets/images/team/flat-vincent.png');
        this.game.load.image('rotor-benni', 'assets/images/team/flat-benni.png');
        this.game.load.image('rotor-koray', 'assets/images/team/flat-koray.png');
    }

    create() {
        var fragmentSrc = [
            "precision mediump float;",

            "uniform float     time;",
            "uniform vec2      resolution;",
            "uniform sampler2D iChannel0;",

            "float speed = time * 0.1;",
            "float pi = 3.14159265;",

            "void main( void ) {",

            "vec2 position = vec2(640.0/2.0+640.0/2.0*sin(speed*2.0), 360.0/2.0+360.0/2.0*cos(speed*3.0));",
            "vec2 position2 = vec2(640.0/2.0+640.0/2.0*sin((speed+2000.0)*2.0), 360.0/2.0+360.0/2.0*cos((speed+2000.0)*3.0));",

            "vec2 offset = vec2(640.0/2.0, 360.0/2.0) ;",
            "vec2 offset2 = vec2(6.0*sin(speed*1.1), 3.0*cos(speed*1.1));",

            "vec2 oldPos = (gl_FragCoord.xy-offset);",

            "float angle = speed*2.0;",

            "vec2 newPos = vec2(oldPos.x *cos(angle) - oldPos.y *sin(angle),",
            "oldPos.y *cos(angle) + oldPos.x *sin(angle));",

            "newPos = (newPos)*(0.0024+0.004*sin(speed*3.0))-offset2;",
            "vec2 temp = newPos;",
            "newPos.x = temp.x + 0.4*sin(temp.y*2.0+speed*8.0);",
            "newPos.y = (-temp.y + 0.4*sin(temp.x*2.0+speed*8.0));",
            "vec4 final = texture2D(iChannel0,newPos);",
            "gl_FragColor = vec4(final.xyz, 1.0);",
            "}"
        ];

        var sprite = this.game.add.sprite(0, 0, 'rotor-' + this.face);
        sprite.width = this.game.width;
        sprite.height = this.game.height;

        var customUniforms = {
            iChannel0: {type: 'sampler2D', value: sprite.texture, textureData: {repeat: true}}
        };

        this.filter = new Phaser.Filter(this.game, customUniforms, fragmentSrc);
        this.filter.setResolution(this.game.width, this.game.height);

        sprite.filters = [this.filter];
    }

    update() {
        this.filter.update();
    }
}

export default teamRotor;
