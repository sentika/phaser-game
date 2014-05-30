module Sample.State {

    export class AbstractZone extends Phaser.State {
        currentLevel:string;
        nextLevel:string;

        map:Phaser.Tilemap;
        layer:Phaser.TilemapLayer;

        player:Prefab.Player;
        hud:Prefab.HUD;
        blackScreen:Prefab.BlackScreen;

        transparents:Phaser.Group;
        spikes:Phaser.Group;
        iceSpikes:Phaser.Group;
        exits:Phaser.Group;

        allPlatforms:Phaser.Group;
        platformsHorizontal:Phaser.Group;
        platformsVertical:Phaser.Group;

        allEnemies:Phaser.Group;
        shooters:Phaser.Group;
        shootersReject:Phaser.Group;
        runners:Phaser.Group;
        fliers:Phaser.Group;
        fliersCrash:Phaser.Group;

        allBottles:Phaser.Group;
        bottlesHP:Phaser.Group;
        bottlesMP:Phaser.Group;
        bottlesSuper:Phaser.Group;

        preload() {
            // All in preload file
            // Don't delete this function
        }

        create() {
            settings.storage.setCurrentLevel(this.currentLevel.toString());
            this.game.stage.backgroundColor = "#000000";

            // MAP AND LAYERS
            this.map = this.game.add.tilemap('map');
            this.map.addTilesetImage('ground');
            this.map.setCollisionBetween(1, 5);

            this.layer = this.map.createLayer('layer');
            this.layer.resizeWorld();

            // PREFABS SINGLE
            this.player = new Prefab.Player(this, 220, 100);
            this.hud = new Prefab.HUD(this, 0, 0);
            this.hud.alpha = 0;

            this.getPrefabsFromMap();

            // POST-SETTINGS
            this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

            this.blackScreen = new Prefab.BlackScreen(this);
            this.blackScreen.setText(this.currentLevel);
            this.game.add.tween(this.blackScreen)
                .to({ alpha: 0 }, Phaser.Timer.SECOND * 3, Phaser.Easing.Linear.None, true)
                .onComplete.add(()=> {
                    this.hud.alpha = 1;
                });
        }

        private getPrefabsFromMap() {

            // PREFABS MULTIPLE
            var index:number;

            this.transparents = this.game.add.group();
            index = this.map.getTilesetIndex('transparent');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'transparent', 0, true, false, this.transparents, Prefab.Transparent);
            }

            this.exits = this.game.add.group();
            index = this.map.getTilesetIndex('exit');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'exit', 0, true, false, this.exits, Prefab.Exit);
            }

            this.spikes = this.game.add.group();
            index = this.map.getTilesetIndex('spike');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'spike', 0, true, false, this.spikes, Prefab.Spike);
            }

            this.iceSpikes = this.game.add.group();
            index = this.map.getTilesetIndex('ice-spike');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'ice-spike', 0, true, false, this.iceSpikes, Prefab.IceSpike);
                this.iceSpikes.forEach((ice) => {
                    ice.target = this.player;
                }, null);
            }

            this.getBottlesPrefabsFromMap();
            this.getEnemiesPrefabsFromMap();
            this.getPlatformsPrefabsFromMap();
        }

        private getEnemiesPrefabsFromMap() {
            this.allEnemies = this.game.add.group();
            var index:number;

            this.shooters = this.game.add.group();
            index = this.map.getTilesetIndex('shooter');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'shooter', 0, true, false, this.shooters, Prefab.Shooter);
                this.shooters.forEach((shooter) => {
                    shooter.setTarget(this.player);
                }, null);
            }
            this.allEnemies.add(this.shooters);

            this.shootersReject = this.game.add.group();
            index = this.map.getTilesetIndex('shooter-reject');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'shooter-reject', 0, true, false, this.shootersReject, Prefab.ShooterReject);
                this.shootersReject.forEach((shooterReject) => {
                    shooterReject.setTarget(this.player);
                }, null);
            }
            this.allEnemies.add(this.shootersReject);

            this.runners = this.game.add.group();
            index = this.map.getTilesetIndex('runner');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'runner', 0, true, false, this.runners, Prefab.Runner);
            }
            this.allEnemies.add(this.runners);

            this.fliers = this.game.add.group();
            index = this.map.getTilesetIndex('flier');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'flier', 0, true, false, this.fliers, Prefab.Flier);
                this.fliers.forEach((flier) => {
                    flier.setTarget(this.player);
                }, null);
            }
            this.allEnemies.add(this.fliers);

            this.fliersCrash = this.game.add.group();
            index = this.map.getTilesetIndex('flier-crash');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'flier-crash', 0, true, false, this.fliersCrash, Prefab.FlierCrash);
                this.fliersCrash.forEach((flierCrash) => {
                    flierCrash.setTarget(this.player);
                }, null);
            }
            this.allEnemies.add(this.fliersCrash);
        }

        private getPlatformsPrefabsFromMap() {
            var index:number;

            this.platformsHorizontal = this.game.add.group();
            index = this.map.getTilesetIndex('platform-h');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'platform-h', 0, true, false, this.platformsHorizontal, Prefab.PlatformHorizontal);
            }

            this.platformsVertical = this.game.add.group();
            index = this.map.getTilesetIndex('platform-v');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'platform-v', 0, true, false, this.platformsVertical, Prefab.PlatformVertical);
            }

            this.allPlatforms = this.game.add.group();
            this.allPlatforms.add(this.platformsHorizontal);
            this.allPlatforms.add(this.platformsVertical);
        }

        private getBottlesPrefabsFromMap() {
            var index:number;

            this.bottlesHP = this.game.add.group();
            index = this.map.getTilesetIndex('bottle-hp');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'bottle-hp', 0, true, false, this.bottlesHP, Prefab.BottleHP);
            }

            this.bottlesMP = this.game.add.group();
            index = this.map.getTilesetIndex('bottle-mp');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'bottle-mp', 0, true, false, this.bottlesMP, Prefab.BottleMP);
            }

            this.bottlesSuper = this.game.add.group();
            index = this.map.getTilesetIndex('bottle-super');
            if (index) {
                this.map.createFromObjects('objects', this.map.tilesets[index].firstgid, 'bottle-super', 0, true, false, this.bottlesSuper, Prefab.BottleSuper);
            }

            this.allBottles = this.game.add.group();
            this.allBottles.add(this.bottlesHP);
            this.allBottles.add(this.bottlesMP);
            this.allBottles.add(this.bottlesSuper);
        }

        private doCollide() {
            this.game.physics.arcade.collide(this.player, this.layer);

            this.game.physics.arcade.collide(this.player, this.exits, (player, exit) => {
                this.startNextLevel();
            });

            this.game.physics.arcade.collide(this.player, this.spikes, (player, spike) => {
                if (!this.player.immortalState) {
                    this.player.makeDamage(spike.damagePoints);
                    this.hud.updateHealthState();
                }
            });

            this.game.physics.arcade.overlap(this.player, this.iceSpikes, (player, ice) => {
                if (!this.player.immortalState) {
                    this.player.makeDamage(ice.damagePoints);
                    this.hud.updateHealthState();
                }
            });

            this.game.physics.arcade.collide(this.shootersReject, this.layer);
            this.game.physics.arcade.collide(this.shooters, this.layer);
            this.game.physics.arcade.collide(this.runners, this.layer);

            this.game.physics.arcade.overlap(this.runners, this.transparents, (runner, transparent) => {
                runner.toggleDirection();
            });

            this.allEnemies.forEach((enemiesGroup) => {
                this.game.physics.arcade.overlap(this.player, enemiesGroup, (player, enemy)=> {
                    if (player.attackState) {
                        enemy.makeDamage(player.damagePoints);
                    } else if (!this.player.immortalState) {
                        this.player.makeDamage(enemy.damagePoints);
                        this.hud.updateHealthState();
                    }
                });
            }, null);

            this.shooters.forEach((shooter)=> {
                this.game.physics.arcade.collide(this.player, shooter.bullets, (player, bullet)=> {
                    bullet.kill();
                    if (!this.player.immortalState) {
                        this.player.makeDamage(bullet.damagePoints);
                        this.hud.updateHealthState();
                    }
                });
            }, null);

            this.shootersReject.forEach((shooterReject)=> {
                this.game.physics.arcade.overlap(this.player, shooterReject.bullets, (player, bulletReject)=> {
                    if (bulletReject.rejectState) return;

                    if (this.player.attackState) {
                        bulletReject.body.velocity.x = -bulletReject.body.velocity.x;
                        bulletReject.rejectState = true;

                    } else {
                        bulletReject.kill();
                        if (!this.player.immortalState) {
                            this.player.makeDamage(bulletReject.damagePoints);
                            this.hud.updateHealthState();
                        }
                    }
                });

                this.game.physics.arcade.overlap(shooterReject, shooterReject.bullets, (_shooterReject, bulletReject)=> {
                    if (bulletReject.rejectState) {
                        bulletReject.kill();
                        shooterReject.makeDamage(bulletReject.damageRejectPoints);
                    }
                });
            }, null);

            this.fliersCrash.forEach((flierCrash)=> {
                this.game.physics.arcade.collide(flierCrash.eggs, this.player, (player, egg)=> {
                    egg.kill();
                    if (!this.player.immortalState) {
                        this.player.makeDamage(egg.damagePoints);
                        this.hud.updateHealthState();
                    }
                });

                this.game.physics.arcade.collide(flierCrash.eggs, this.layer, (egg, layer)=> {
                    egg.setEggCrash();


                });
            }, null);

            this.allPlatforms.forEach((platformsGroup) => {
                this.game.physics.arcade.collide(this.player, platformsGroup, null, (player, platform) => {
                    if (player.y - platform.body.height > platform.y) {
                        return false;
                    }
                    return true;
                });
                this.game.physics.arcade.overlap(platformsGroup, this.transparents, (platform, transparent) => {
                        platform.toggleDirection(transparent);
                    }
                );
            }, null);

            this.allBottles.forEach((bottlesGroup) => {
                this.game.physics.arcade.overlap(this.player, bottlesGroup, (player, bottle) => {
                    bottle.makeAction(player);
                    bottle.kill();
                });
            }, null);
        }

        render() {
            //this.game.debug.spriteInfo(this.player, 100, 100);
        }

        update() {
            this.doCollide();

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.blackScreen.setText("");
                this.game.add.tween(this.blackScreen)
                    .to({ alpha: 1 }, Phaser.Timer.SECOND * 3, Phaser.Easing.Linear.None, true)
                    .onComplete.add(()=> {
                        this.startNextLevel();
                    });
            }
        }

        gameOver() {
            this.blackScreen.setText("Game Over. Reload Level.");
            this.game.add.tween(this.blackScreen)
                .to({ alpha: 1 }, Phaser.Timer.SECOND * 3, Phaser.Easing.Linear.None, true)
                .onComplete.add(()=> {
                    this.game.state.start(this.currentLevel);
                });
        }

        startNextLevel() {
            settings.storage.setHealthPoints(this.player.health.toString());
            settings.storage.setManaPoints(this.player.manaPoints.toString());
            this.game.state.start(this.nextLevel);
        }
    }
}