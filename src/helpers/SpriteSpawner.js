
export default class SpriteSpawner {
    constructor(config) {
        this.hero = config.hero;
        this.scene = config.scene;
        this.animation = config.animation;
        this.name = config.name;

        let _sprite = this.scene.add.sprite(this.hero.x + this.hero.isFacingLeft * 10 , this.hero.y + 10, this.animation)
        _sprite.on(`animationcomplete-${ this.animation }`, () => {
            _sprite.destroy();
        });

        return _sprite;
    }
}