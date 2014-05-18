module Sample.Prefab {

    export class Flier extends AbstractEnemy {
        target: Phaser.Sprite;
        isActive: boolean = false;

        minDistance:number;
        damagePoints: number = 10;
        speed:number = 150;

        constructor(game:Phaser.Game, x:number, y:number) {
            super(game, x, y, 'flier');

            this.anchor.set(0.5, 0.5);
            this.health = 10;
        }

        setTarget(target: Phaser.Sprite) {
            this.minDistance = target.width / 2;

            this.target = target;
            this.isActive = true;
        }

        update() {
            if (!this.inCamera) return;
            if (!this.isActive) return;

            var distance = Phaser.Math.distance(this.x, this.y, this.target.x, this.target.y);

            if (distance > this.minDistance) {
                var rotation = Phaser.Math.angleBetween(this.x, this.y, this.target.x, this.target.y);

                this.body.velocity.x = Math.cos(rotation) * this.speed;
                this.body.velocity.y = Math.sin(rotation) * this.speed;
            } else {
                this.body.velocity.setTo(0, 0);
            }
        }
    }
}