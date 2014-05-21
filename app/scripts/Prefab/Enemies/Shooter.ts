module Sample.Prefab {
    export class Shooter extends AbstractEnemy {
        gravity:number = 300;

        target: Phaser.Sprite;

        lastBulletShotAt: number = 0;
        bullets: Phaser.Group;
        countBullets: number = 1;
        shotDelay: number = 3000;

        damagePoints: number = 10;

        constructor(game:Phaser.Game, x:number, y:number) {
            super(game, x, y, 'shooter');

            this.body.gravity.y = this.gravity;

            this.bullets = this.game.add.group();
            for(var i = 0; i < this.countBullets; i++) {
                var bullet = new Prefab.Bullet(game, 0, 0);
                this.bullets.add(bullet);
            }
            this.health = 10;
        }

        setTarget(target: Phaser.Sprite) {
            this.target = target;
        }

        update() {
            if (!this.inCamera) return;
            if (!this.alive) return;

            if (this.game.time.now - this.lastBulletShotAt < this.shotDelay) return;
            this.lastBulletShotAt = this.game.time.now;

            var bullet = this.bullets.getFirstDead();

            if (bullet === null || bullet === undefined) return;

            bullet.revive();
            bullet.reset(this.x, this.y);

            if (this.x > this.target.x) {
                bullet.body.velocity.x = -bullet.speed;
            } else {
                bullet.body.velocity.x = bullet.speed;
            }
        }
    }
}