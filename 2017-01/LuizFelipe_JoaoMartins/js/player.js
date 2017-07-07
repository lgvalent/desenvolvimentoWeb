
class Player extends Phaser.Sprite {
    constructor (game, cursors, x, y, asset) {
        super(game, x, y, asset)
        this.keys = cursors /* Define os cursores (cima, baixo, esquerda, direita) */
        this.game.physics.enable(this, Phaser.Physics.ARCADE) /* Habilita a física do tipo ARCADE */
        this.body.collideWorldBounds = true /* Permite colisão contra objetos */
        this.body.setSize(25, 22, 3, 8) /* Tamanho padrão do corpo */
        this.anchor.setTo(0.5, 0.5) /* Define o eixo do sprite (x, y) */

        /* Definições gerais de movimentação */
        this.walkspeed = 150
        this.jumpheight = -200

        /* Animações: Andar, correr, latir, pular, aguardar, dormir */
        this.animations.add('walk', [1,2,3,4], 10, true)
        this.animations.add('run', [1,2,3,4,5,6,7,8], 13, true)
        this.animations.add('jump', [14,15,16], 2, true)
        this.animations.add('idle', [1], true)
        this.animations.add('sleep', [21,22], 10, true)

        /* Botões especiais */
        this.jumpButton = this.game.input.keyboard.addKey(
            Phaser.Keyboard.SPACEBAR)
        this.double_jump = false
        this.jumpButton.onDown.add(this.jump, this)

        this.barkButton = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
        this.barkButton.onDown.add(this.bark, this)

        this.runButton = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL)
    }

    jump() {
        /* Responsável por realizar o pulo do corpo */
        /* Se o corpo estiver no chão (evita que ele flutue) */
        if (this.body.onFloor()) {
            this.body.velocity.y = this.jumpheight
            this.double_jump = true
          /* Caso um pulo já tenha sido realizado, execute o pulo duplo */  
        } else if(this.double_jump == true) {
            this.body.velocity.y = this.jumpheight
            this.double_jump = false
        }
    }

    bark() {
        /* Responsável por reproduzir o latido do cachorro */
        var bark;
        bark = this.game.add.audio('bark');
        bark.play();
    }

    update() {
        this.body.velocity.x = 0

        /* 
        Movimenta o corpo de acordo com os direcionais 
        (Se o botão de correr estiver pressioando, a velocidade é multiplicada por 1.85) 
        */
        if (this.keys.left.isDown)
            if(this.runButton.isDown) {
                this.body.velocity.x = -(this.walkspeed * 1.35)
            }
            else
                this.body.velocity.x = -(this.walkspeed)
        else
        if (this.keys.right.isDown)
            if(this.runButton.isDown)
                this.body.velocity.x = +(this.walkspeed * 1.35)
            else
                this.body.velocity.x = +(this.walkspeed)

        /* Realiza as animações */
        this.animate()
    }

    animate() {
        /* O tamanho do corpo é reiniciado a cada iteração (o tamanho muda em algumas ações) */
        this.body.setSize(25, 22, 3, 8)

        /* Caso o corpo não esteja parado, exiba a animação de andar ou correr */
        if (this.body.velocity.x != 0) {
            if(this.runButton.isDown)
                this.animations.play('run')
            else
                this.animations.play('walk')
        }
        else {
            /* Caso contrário, exiba a animação dele parado */
            this.animations.play('idle')
            /* Caso o botão para baixo esteja pressionado, o faça dormir */
            if(this.keys.down.isDown){
                this.body.velocity.y = 25
                this.body.setSize(25, 15, 3, 7)
                this.animations.play('sleep')
            }
        }

        /* Caso o corpo não esteja no chão, exiba a animação de pular */
        if (this.body.velocity.y != 0) {
            if(!this.keys.down.isDown)
                this.animations.play('jump')
        }

        /* Caso a velocidade seja positiva, exiba o personagem para esquerda */
        if (this.body.velocity.x > 0)
            this.scale.x = 1
        else
        /* Caso contrário, para direita */    
        if (this.body.velocity.x < 0)
            this.scale.x = -1
    }
}