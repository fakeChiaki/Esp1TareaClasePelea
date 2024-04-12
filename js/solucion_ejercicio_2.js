//Objeto base para los personajes
class Character {
    constructor(name) {
        //Atributos
        this.name = name;
        // Randomize level from 1 to 100
        this.level = Math.floor(Math.random() * 100) + 1;
        // Calculate health, damage, and attack based on level
        this.health = this.calculateHealth();
        this.maxhealth = this.health;
        // Randomize attack value from 5 to 10
        this.damage = Math.floor(Math.random() * 6) + 5;
    }

    // Calculate health based on level
    calculateHealth() {
        return Math.floor(Math.random() * (this.level * 5)) + 50;
    }

    // Calculate attack within the range of 5 to 10
    calculateAttack() {
        return Math.floor(Math.random() * 6) + 5;
    }

    //Verifica si el personaje esta vivo
    isAlive() {
        return this.health > 0;
    }

    // Ataca a otro personaje seleccionado
    attack(target) {
        console.log(`${this.name} is attacking ${target.name}`);
        // Determine if it's a critical hit (25% chance)
        const isCriticalHit = Math.random() < 0.25;
        // Calculate damage
        const damage = isCriticalHit ? this.damage * 2 : this.damage;
        // Apply damage to the target
        target.health -= damage;
        // Log the attack and damage
        const attackEvent = new CustomEvent('attack', {
            detail: {
                attacker: this.name,
                target: target.name,
                damage: damage,
                isCritical: isCriticalHit
            }
        });
        document.dispatchEvent(attackEvent);
    }

    //Retorna la información actual del personaje
    status() {
        return `${this.name} - HP ${this.health}/${this.maxhealth}`;
    }
}

// Create Heroe character
const hero = new Character("Heroe");
const limo = new Character("Limo");

// Set up event listeners for key presses
document.addEventListener('keydown', function(event) {
    console.log('Key pressed:', event.key); // Log the pressed key
    // If the user presses the 'X' key, let Heroe attack
    if (event.key === 'x') {
        console.log('X key pressed');
        if (hero.isAlive() && limo.isAlive()) {
            hero.attack(limo);
            updateHealth(hero, document.getElementById('hero-health-bar'), document.getElementById('hero-health'));
            updateHealth(limo, document.getElementById('enemy-health-bar'), document.getElementById('enemy-health'));
        }
    }

    // If the user presses the 'N' key, let Limo attack
    if (event.key === 'n') {
        console.log('N key pressed');
        if (limo.isAlive() && hero.isAlive()) {
            limo.attack(hero);
            updateHealth(hero, document.getElementById('hero-health-bar'), document.getElementById('hero-health'));
            updateHealth(limo, document.getElementById('enemy-health-bar'), document.getElementById('enemy-health'));
        }
    }
});

// Function to update health bars and health text
function updateHealth(character, healthBarElement, healthTextElement) {
    const healthPercentage = (character.health / character.maxhealth) * 100;
    healthBarElement.querySelector('.health').style.width = `${healthPercentage}%`;
    healthTextElement.textContent = `HP ${character.health}/${character.maxhealth}`;
}

// Add battle log functionality
document.addEventListener('attack', function(event) {
    const attacker = event.detail.attacker;
    const target = event.detail.target;
    const damage = event.detail.damage;
    const isCritical = event.detail.isCritical;

    // Create list item for battle log
    const listItem = document.createElement('li');
    if (isCritical) {
        // If it's a critical hit, display in red
        listItem.innerHTML = `<span style="color: red;">${attacker} dealt ${damage} DMG to ${target}! (Critical Hit)</span>`;
    } else {
        listItem.textContent = `${attacker} dealt ${damage} DMG to ${target}!`;
    }

    // Append the list item to the battle log
    document.getElementById('battle-log').appendChild(listItem);
});

// Start the fight
console.log("Press 'X' for Heroe to attack, and 'N' for Limo to attack.");
