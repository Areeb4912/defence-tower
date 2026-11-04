import * as THREE from "three";

const CONFIG = {
  world: { size: 100, scale: 0.5, maxTowers: 30, spacing: 2.5, maxEnemies: 60, maxProjectiles: 300, spawnInterval: 1.5, prep: 20, break: 15 },
  economy: { credits: 1000, energy: 100, energyMax: 200, generation: 20, hp: 2000, hpMax: 2000, waveReward: 100, fifthReward: 200, bossWaveReward: 300, generatorCost: 300, generatorMax: 3 },
  difficulty: {
    easy: { name: "Easy", health: 0.7, damage: 0.7, credits: 1500 },
    normal: { name: "Normal", health: 1, damage: 1, credits: 1000 },
    hard: { name: "Hard", health: 1.3, damage: 1.25, credits: 900 },
    veryhard: { name: "Very Hard", health: 1.6, damage: 1.5, credits: 800 },
    insane: { name: "Insane", health: 2, damage: 2, credits: 700 }
  },
  towers: {
    machine: { name: "Machine Gun", cost: 150, damage: 12, rate: 5, range: 18, energy: 2, accuracy: 0.9, color: "#b7d674", symbol: "⌖", kind: "gun", antiAir: true },
    sniper: { name: "Sniper", cost: 250, damage: 100, rate: 0.8, range: 45, energy: 4, accuracy: 0.98, color: "#a9c5df", symbol: "⌁", kind: "sniper", antiAir: true },
    missile: { name: "Missile Launcher", cost: 350, damage: 160, rate: 0.4, range: 35, splash: 5, energy: 6, accuracy: 0.85, color: "#e5aa66", symbol: "➤", kind: "missile", antiAir: true },
    artillery: { name: "Artillery", cost: 450, damage: 220, rate: 0.2, range: 55, splash: 8, energy: 8, accuracy: 0.78, color: "#e37d66", symbol: "◉", kind: "artillery", antiAir: false },
    tesla: { name: "Tesla Tower", cost: 300, damage: 35, rate: 1.5, range: 22, energy: 10, chain: 3, accuracy: 1, color: "#82d6ce", symbol: "ϟ", kind: "tesla", antiAir: false },
    radar: { name: "Radar Tower", cost: 200, damage: 0, rate: 0, range: 50, energy: 5, accuracy: 1, color: "#b998e5", symbol: "⌑", kind: "radar", antiAir: false },
    laser: { name: "Laser Tower", cost: 500, damage: 55, rate: 1, range: 30, energy: 12, accuracy: 1, color: "#ec6f78", symbol: "╱", kind: "laser", antiAir: true },
    mortar: { name: "Mortar", cost: 275, damage: 120, rate: 0.35, range: 40, splash: 6, energy: 5, accuracy: 0.82, color: "#d8bc75", symbol: "◌", kind: "mortar", antiAir: false }
  },
  enemies: {
    infantry: { name: "Infantry", hp: 100, speed: 3, armor: 0, reward: 15, baseDamage: 20, color: "#d0ae76", shape: "person", air: false },
    scout: { name: "Scout Vehicle", hp: 180, speed: 5, armor: 0.05, reward: 25, baseDamage: 35, color: "#93a56f", shape: "car", air: false },
    armored: { name: "Armored Vehicle", hp: 450, speed: 2.5, armor: 0.2, reward: 45, baseDamage: 60, color: "#829174", shape: "car", air: false },
    heavy: { name: "Heavy Tank", hp: 1000, speed: 1.5, armor: 0.35, reward: 80, baseDamage: 120, color: "#616d58", shape: "tank", air: false },
    helicopter: { name: "Helicopter", hp: 350, speed: 4, armor: 0.1, reward: 60, baseDamage: 50, color: "#829eb0", shape: "heli", air: true },
    drone: { name: "Drone", hp: 120, speed: 6, armor: 0, reward: 30, baseDamage: 25, color: "#a1bbc7", shape: "drone", air: true },
    stealth: { name: "Stealth Unit", hp: 300, speed: 3.5, armor: 0.15, reward: 55, baseDamage: 50, color: "#758b95", shape: "stealth", air: false, stealth: true },
    boss: { name: "Siege Titan", hp: 5000, speed: 1, armor: 0.4, reward: 250, baseDamage: 400, color: "#b74f45", shape: "boss", air: false, boss: true }
  },
  maps: {
    desert: { name: "Desert Outpost", ground: "#817657", road: "#655e4a", sky: "#b2a47a", accent: "#c5a75d", weather: "CLEAR • 18:00", fog: 0x817657, props: "desert" },
    frozen: { name: "Frozen Front", ground: "#62757a", road: "#47585d", sky: "#9bb6bf", accent: "#a7d6df", weather: "LIGHT SNOW • -8°C", fog: 0x849ca2, props: "frozen" },
    jungle: { name: "Jungle Warzone", ground: "#3d5741", road: "#544d39", sky: "#708269", accent: "#95c079", weather: "HUMID • 27°C", fog: 0x536d50, props: "jungle" },
    industrial: { name: "Industrial Zone", ground: "#555953", road: "#3e4543", sky: "#8a9187", accent: "#d09b5f", weather: "SMOG • 21°C", fog: 0x68706b, props: "industrial" },
    mountain: { name: "Mountain Fortress", ground: "#5b6254", road: "#494d43", sky: "#86928c", accent: "#b3c4ba", weather: "WINDY • 6°C", fog: 0x77847e, props: "mountain" },
    urban: { name: "Urban Defense", ground: "#555751", road: "#424341", sky: "#898b82", accent: "#c99272", weather: "OVERCAST • 16°C", fog: 0x6a6e68, props: "urban" }
  },
  upgrades: [100, 175, 275, 400],
  tech: [
    { id: "weapon", title: "Weapon Systems", description: "+10% tower damage per rank (3 ranks).", cost: 1, max: 3 },
    { id: "ballistics", title: "Advanced Ballistics", description: "+10% tower range per rank (2 ranks).", cost: 2, max: 2 },
    { id: "fortification", title: "Fortification", description: "+250 maximum HQ integrity per rank (2 ranks).", cost: 2, max: 2 },
    { id: "power", title: "Power Routing", description: "Reduce all tower energy use by 10% per rank (2 ranks).", cost: 2, max: 2 },
    { id: "logistics", title: "Field Logistics", description: "+10% enemy bounty credits per rank (2 ranks).", cost: 1, max: 2 },
    { id: "research", title: "Applied Research", description: "Gain 1 extra research point per completed wave.", cost: 3, max: 1 }
  ]
};

const ROUTE = [
  new THREE.Vector3(-44, 0, -30), new THREE.Vector3(-31, 0, -30),
  new THREE.Vector3(-31, 0, 27), new THREE.Vector3(26, 0, 27),
  new THREE.Vector3(26, 0, -19), new THREE.Vector3(-2, 0, -19),
  new THREE.Vector3(-2, 0, 0)
];
const $ = (id) => document.getElementById(id);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const fmt = (value) => Math.floor(value).toLocaleString();
const distanceXZ = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);

class SaveManager {
  constructor() {
    this.data = { tech: {}, endlessBest: 0, totalKills: 0, missions: 0, settings: { quality: "high" } };
    try {
      const saved = localStorage.getItem("frontline-last-stand-save");
      if (saved) this.data = { ...this.data, ...JSON.parse(saved) };
    } catch (error) {
      console.warn("Could not load saved game data.", error);
    }
  }
  save() {
    try {
      localStorage.setItem("frontline-last-stand-save", JSON.stringify(this.data));
    } catch (error) {
      console.warn("Could not save game data.", error);
    }
  }
  rank(id) { return this.data.tech[id] || 0; }
}

class AudioManager {
  constructor() { this.context = null; }
  play(frequency = 440, duration = 0.06, type = "square", volume = 0.025) {
    try {
      this.context ||= new AudioContext();
      if (this.context.state === "suspended") this.context.resume();
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.context.currentTime);
      gain.gain.setValueAtTime(volume, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
      osc.connect(gain).connect(this.context.destination);
      osc.start();
      osc.stop(this.context.currentTime + duration);
    } catch (error) {
      console.warn("Audio is unavailable in this browser.", error);
    }
  }
}

class MapManager {
  constructor(game) { this.game = game; }
  createGroundTexture(baseColor, biome) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D is required to build the battlefield terrain.");
    const base = new THREE.Color(baseColor);
    let seed = 913 + ["desert", "frozen", "jungle", "industrial", "mountain", "urban"].indexOf(biome) * 31;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const hex = base.getHexString();
    const rgb = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
    const image = context.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < image.data.length; i += 4) {
      const grain = (random() - 0.5) * 24;
      image.data[i] = clamp(rgb[0] + grain, 0, 255);
      image.data[i + 1] = clamp(rgb[1] + grain, 0, 255);
      image.data[i + 2] = clamp(rgb[2] + grain, 0, 255);
      image.data[i + 3] = 255;
    }
    context.putImageData(image, 0, 0);
    for (let i = 0; i < 1450; i++) {
      const x = random() * canvas.width, y = random() * canvas.height;
      const radius = 0.5 + random() * (biome === "desert" ? 3.2 : 2.2);
      const light = random() > 0.52;
      context.fillStyle = light ? "rgba(231,220,190,0.12)" : "rgba(25,34,26,0.12)";
      context.beginPath();
      context.ellipse(x, y, radius * (1.3 + random()), radius, random() * Math.PI, 0, Math.PI * 2);
      context.fill();
    }
    if (biome === "desert" || biome === "mountain") {
      context.strokeStyle = "rgba(244,224,175,0.08)";
      context.lineWidth = 2;
      for (let i = 0; i < 24; i++) {
        const x = random() * canvas.width, y = random() * canvas.height;
        context.beginPath();
        context.moveTo(x, y);
        context.bezierCurveTo(x + 24, y - 12, x - 18, y + 28, x + 12, y + 44);
        context.stroke();
      }
    }
    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = canvas.width;
    bumpCanvas.height = canvas.height;
    const bumpContext = bumpCanvas.getContext("2d");
    if (!bumpContext) throw new Error("Canvas 2D is required to build terrain surface detail.");
    const bump = bumpContext.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < bump.data.length; i += 4) {
      const shade = 112 + Math.round(random() * 32);
      bump.data[i] = shade;
      bump.data[i + 1] = shade;
      bump.data[i + 2] = shade;
      bump.data[i + 3] = 255;
    }
    bumpContext.putImageData(bump, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2.2, 2.2);
    texture.anisotropy = Math.min(4, this.game.renderer.capabilities.getMaxAnisotropy());
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
    bumpTexture.wrapS = THREE.RepeatWrapping;
    bumpTexture.wrapT = THREE.RepeatWrapping;
    bumpTexture.repeat.copy(texture.repeat);
    return { texture, bumpTexture };
  }
  build(key) {
    const data = CONFIG.maps[key] || CONFIG.maps.desert;
    this.game.mapKey = key in CONFIG.maps ? key : "desert";
    this.game.mapData = data;
    const scene = this.game.scene;
    scene.background = new THREE.Color(data.sky);
    scene.fog = new THREE.Fog(data.fog, 72, 155);
    this.groundTexture?.dispose();
    this.groundBumpTexture?.dispose();
    const textures = this.createGroundTexture(data.ground, data.props);
    this.groundTexture = textures.texture;
    this.groundBumpTexture = textures.bumpTexture;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 48, 48), new THREE.MeshStandardMaterial({
      map: this.groundTexture,
      bumpMap: this.groundBumpTexture,
      bumpScale: data.props === "desert" ? 0.09 : 0.045,
      roughness: 0.96
    }));
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = "ground";
    scene.add(ground);
    const grid = new THREE.GridHelper(100, 40, 0x8c997b, 0x71806b);
    grid.position.y = 0.035;
    grid.material.transparent = true;
    grid.material.opacity = 0.15;
    scene.add(grid);
    this.addRoad(data.road);
    this.addBase(data.accent);
    this.addEnvironment(data.props, data.accent);
    this.addGroundCover(data.props);
    this.addWeather(data.props);
    $("mission-name").textContent = data.name;
    $("map-weather").textContent = data.weather;
  }
  addWeather(type) {
    if (this.weather) {
      this.game.scene.remove(this.weather);
      this.weather.geometry.dispose();
      this.weather.material.dispose();
    }
    const count = type === "frozen" ? 280 : type === "desert" || type === "mountain" ? 150 : 90;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    let seed = 391 + type.length * 17;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < count; i++) {
      positions[i * 3] = random() * 100 - 50;
      positions[i * 3 + 1] = random() * 26 + 1;
      positions[i * 3 + 2] = random() * 100 - 50;
      velocities[i] = 1.2 + random() * 2.4;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const snow = type === "frozen";
    const material = new THREE.PointsMaterial({
      color: snow ? 0xe7f4f3 : type === "desert" ? 0xe2c48a : type === "jungle" ? 0xc3d68b : 0xbfc4b7,
      size: snow ? 0.19 : 0.11,
      transparent: true,
      opacity: snow ? 0.76 : 0.35,
      depthWrite: false,
      sizeAttenuation: true
    });
    this.weather = new THREE.Points(geometry, material);
    this.weather.userData = { velocities, wind: type === "frozen" || type === "mountain" ? 2.5 : 0.8 };
    this.game.scene.add(this.weather);
  }
  updateWeather(dt) {
    if (!this.weather || !this.weather.visible) return;
    const positions = this.weather.geometry.attributes.position;
    const { velocities, wind } = this.weather.userData;
    for (let i = 0; i < velocities.length; i++) {
      positions.array[i * 3] += wind * dt;
      positions.array[i * 3 + 1] -= velocities[i] * dt;
      positions.array[i * 3 + 2] += wind * dt * 0.3;
      if (positions.array[i * 3 + 1] < 0) {
        positions.array[i * 3] = Math.random() * 100 - 50;
        positions.array[i * 3 + 1] = 24 + Math.random() * 5;
        positions.array[i * 3 + 2] = Math.random() * 100 - 50;
      }
      if (positions.array[i * 3] > 50) positions.array[i * 3] = -50;
      if (positions.array[i * 3 + 2] > 50) positions.array[i * 3 + 2] = -50;
    }
    positions.needsUpdate = true;
  }
  addRoad(color) {
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.98 });
    const shoulderMaterial = new THREE.MeshStandardMaterial({ color: 0x9a8d70, roughness: 1 });
    const rutMaterial = new THREE.MeshStandardMaterial({ color: 0x403b30, roughness: 1 });
    const stripe = new THREE.MeshStandardMaterial({ color: 0xd3c59a, roughness: 0.9, emissive: 0x17140e });
    for (let i = 0; i < ROUTE.length - 1; i++) {
      const a = ROUTE[i], b = ROUTE[i + 1], midpoint = a.clone().add(b).multiplyScalar(0.5);
      const length = distanceXZ(a, b);
      const road = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.08, length + 0.4), material);
      road.position.set(midpoint.x, 0.06, midpoint.z);
      road.rotation.y = -Math.atan2(b.z - a.z, b.x - a.x) + Math.PI / 2;
      road.receiveShadow = true;
      this.game.scene.add(road);
      for (const side of [-1, 1]) {
        const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.035, length), shoulderMaterial);
        shoulder.position.set(midpoint.x + Math.cos(road.rotation.y) * side * 2.25, 0.105, midpoint.z - Math.sin(road.rotation.y) * side * 2.25);
        shoulder.rotation.y = road.rotation.y;
        this.game.scene.add(shoulder);
        const rut = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.018, length - 0.5), rutMaterial);
        rut.position.set(midpoint.x + Math.cos(road.rotation.y) * side * 1.42, 0.108, midpoint.z - Math.sin(road.rotation.y) * side * 1.42);
        rut.rotation.y = road.rotation.y;
        this.game.scene.add(rut);
      }
      if (length > 7) {
        const direction = b.clone().sub(a).normalize();
        for (let distance = 2; distance < length - 1; distance += 5.5) {
          const center = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.018, 2.2), stripe);
          center.position.copy(a).addScaledVector(direction, distance + 1.1);
          center.position.y = 0.112;
          center.rotation.y = road.rotation.y;
          this.game.scene.add(center);
        }
      }
    }
    ROUTE.forEach((point) => {
      const marker = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.11, 12), new THREE.MeshStandardMaterial({ color: 0xe2a064, emissive: 0x452211 }));
      marker.position.set(point.x, 0.12, point.z);
      this.game.scene.add(marker);
    });
  }
  addBase(accent) {
    const group = new THREE.Group();
    const concrete = new THREE.MeshStandardMaterial({ color: 0x777e70, roughness: 0.82 });
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x525b50, roughness: 0.9 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x303a32, roughness: 0.72, metalness: 0.35 });
    const windowMat = new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.75, metalness: 0.15, roughness: 0.3 });
    const building = new THREE.Mesh(new THREE.BoxGeometry(9, 3.5, 7), concrete);
    building.position.set(1, 1.8, 5);
    building.castShadow = true;
    building.receiveShadow = true;
    group.add(building);
    const roof = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.45, 7.4), new THREE.MeshStandardMaterial({ color: 0x343d35 }));
    roof.position.set(1, 3.75, 5);
    roof.castShadow = true;
    group.add(roof);
    const roofRim = new THREE.Mesh(new THREE.BoxGeometry(9.7, 0.18, 7.7), trimMat);
    roofRim.position.set(1, 3.48, 5);
    group.add(roofRim);
    const entrance = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.1, 0.12), trimMat);
    entrance.position.set(1, 1.15, 8.57);
    group.add(entrance);
    for (const x of [-2.1, 0, 2.1, 4.1]) {
      const window = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.48, 0.1), windowMat);
      window.position.set(x, 2.45, 8.58);
      group.add(window);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.12, 0.13), trimMat);
      frame.position.set(x, 2.45, 8.64);
      group.add(frame);
    }
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 5, 8), wallMat);
    mast.position.set(3.8, 6, 3.2);
    group.add(mast);
    const antenna = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 8), new THREE.MeshBasicMaterial({ color: accent }));
    antenna.position.set(3.8, 8.6, 3.2);
    group.add(antenna);
    for (const [x, z] of [[-3.1, -3.2], [4.8, -3.2], [-3.1, 10.1], [4.8, 10.1]]) {
      const lamp = new THREE.Group();
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 2.7, 6), trimMat);
      post.position.y = 1.35;
      const lens = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), windowMat);
      lens.position.y = 2.75;
      lamp.add(post, lens);
      const fixtureLight = new THREE.PointLight(accent, 0.8, 9);
      fixtureLight.position.y = 2.75;
      lamp.add(fixtureLight);
      lamp.position.set(x, 0, z);
      group.add(lamp);
    }
    for (let i = 0; i < 5; i++) {
      const bag = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.38, 0.75, 3, 6),
        new THREE.MeshStandardMaterial({ color: i % 2 ? 0x77775c : 0x686b52, roughness: 1 })
      );
      bag.rotation.z = Math.PI / 2;
      bag.position.set(-3.2 + i * 0.78, 0.4, 12.1);
      group.add(bag);
    }
    for (const [x, z, w, d] of [[-5, 3, 1, 16], [6.5, 3, 1, 16], [0.7, -5.3, 13, 1], [0.7, 11, 13, 1]]) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(w, 1.5, d), wallMat);
      wall.position.set(x, 0.75, z);
      wall.castShadow = true;
      group.add(wall);
    }
    const shield = new THREE.Mesh(new THREE.SphereGeometry(10, 24, 16), new THREE.MeshBasicMaterial({ color: 0x70cbd0, transparent: true, opacity: 0.06, wireframe: true }));
    shield.position.set(0, 1.5, 4);
    shield.name = "baseShield";
    const beaconLight = new THREE.PointLight(accent, 1.4, 18, 1.8);
    beaconLight.position.set(1, 5.5, 5);
    group.add(shield, beaconLight);
    group.userData.shield = shield;
    this.game.baseShield = shield;
    this.game.scene.add(group);
  }
  addEnvironment(type, accent) {
    let seed = 113;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 95; i++) {
      const x = random() * 94 - 47, z = random() * 94 - 47;
      if (this.game.isNearRoute(x, z, 5) || Math.hypot(x, z - 4) < 12) continue;
      const group = new THREE.Group();
      if (type === "jungle" || type === "frozen") {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.25, 2.5, 6), new THREE.MeshStandardMaterial({ color: type === "frozen" ? 0x5b625c : 0x514b35 }));
        trunk.position.y = 1.25;
        trunk.castShadow = true;
        group.add(trunk);
        const foliage = type === "frozen" ? 0x829b9b : [0x38533b, 0x4c6443, 0x58683f][i % 3];
        for (let tier = 0; tier < 3; tier++) {
          const leaves = new THREE.Mesh(
            new THREE.ConeGeometry((type === "frozen" ? 1.15 : 1.35) - tier * 0.19, 2.1, 7),
            new THREE.MeshStandardMaterial({ color: foliage, roughness: 0.95 })
          );
          leaves.position.y = 2.1 + tier * 0.75;
          leaves.castShadow = true;
          group.add(leaves);
        }
      } else if (type === "urban" || type === "industrial") {
        const height = 1.2 + random() * 3;
        const block = new THREE.Mesh(new THREE.BoxGeometry(1.3 + random() * 2, height, 1.4 + random() * 1.5), new THREE.MeshStandardMaterial({ color: type === "urban" ? 0x77766b : 0x656c66, roughness: 0.9 }));
        block.position.y = height / 2;
        block.castShadow = true;
        group.add(block);
        if (type === "urban") {
          const windowMat = new THREE.MeshStandardMaterial({ color: 0x263531, metalness: 0.2, roughness: 0.35, emissive: 0x34433b, emissiveIntensity: 0.15 });
          for (let floor = 0.45; floor < height - 0.15; floor += 0.62) {
            for (const side of [-1, 1]) {
              const window = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.24, 0.035), windowMat);
              window.position.set(side * 0.42, floor - height / 2, 0.72 + random() * 0.04);
              block.add(window);
            }
          }
        }
        if (type === "industrial" && i % 4 === 0) {
          const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 4, 8), new THREE.MeshStandardMaterial({ color: accent, metalness: 0.5 }));
          pipe.position.y = 2.4;
          group.add(pipe);
        }
      } else if (type === "desert" && i % 3 === 0) {
        const cactusMat = new THREE.MeshStandardMaterial({ color: [0x526448, 0x65744a, 0x788052][i % 3], roughness: 0.88 });
        const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 2.4 + random(), 7), cactusMat);
        stalk.position.y = 1.25;
        stalk.castShadow = true;
        group.add(stalk);
        for (const side of [-1, 1]) {
          if (random() < 0.3) continue;
          const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.95, 6), cactusMat);
          arm.position.set(side * 0.42, 1.6 + random() * 0.3, 0);
          arm.rotation.z = side * -0.5;
          arm.castShadow = true;
          group.add(arm);
          const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.75, 6), cactusMat);
          tip.position.set(side * 0.7, 2.15 + random() * 0.3, 0);
          tip.castShadow = true;
          group.add(tip);
        }
      } else {
        const size = 0.5 + random() * (type === "mountain" ? 1.65 : 1.1);
        const rockMaterial = new THREE.MeshStandardMaterial({
          color: type === "desert" ? 0x998968 : type === "frozen" ? 0x899899 : type === "mountain" ? 0x747b73 : 0x6b7066,
          roughness: 1
        });
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(size, type === "mountain" ? 1 : 0), rockMaterial);
        rock.position.y = size * 0.34;
        rock.scale.set(1 + random() * 0.65, 0.55 + random(), 0.8 + random() * 0.4);
        rock.rotation.set(random(), random(), random());
        rock.castShadow = true;
        rock.receiveShadow = true;
        group.add(rock);
        if (type === "mountain" && i % 4 === 0) {
          const cap = new THREE.Mesh(
            new THREE.ConeGeometry(size * 0.46, size * 0.72, 5),
            new THREE.MeshStandardMaterial({ color: 0xc3cbc2, roughness: 0.96 })
          );
          cap.position.y = size * 0.84;
          cap.castShadow = true;
          group.add(cap);
        }
      }
      group.position.set(x, 0, z);
      group.rotation.y = random() * Math.PI;
      this.game.scene.add(group);
    }
  }
  addGroundCover(type) {
    const palette = {
      desert: [0x9b8054, 0x7d7548],
      frozen: [0x9ba9a4, 0x718680],
      jungle: [0x526d3e, 0x465b36],
      industrial: [0x73766d, 0x58635a],
      mountain: [0x818276, 0x747b6c],
      urban: [0x78776c, 0x595d54]
    }[type] || [0x77796c, 0x60695a];
    const seed = 1201 + type.length * 43;
    let state = seed;
    const random = () => {
      state = state * 16807 % 2147483647;
      return (state - 1) / 2147483646;
    };
    const tufts = new THREE.InstancedMesh(
      new THREE.ConeGeometry(0.2, 0.62, 5),
      new THREE.MeshStandardMaterial({ color: palette[0], roughness: 1 }),
      240
    );
    const stones = new THREE.InstancedMesh(
      new THREE.DodecahedronGeometry(0.22, 0),
      new THREE.MeshStandardMaterial({ color: palette[1], roughness: 1 }),
      180
    );
    const transform = new THREE.Object3D();
    let tuftCount = 0;
    let stoneCount = 0;
    for (let attempt = 0; attempt < 720 && (tuftCount < 240 || stoneCount < 180); attempt++) {
      const x = random() * 96 - 48;
      const z = random() * 96 - 48;
      if (this.game.isNearRoute(x, z, 4.1) || Math.hypot(x, z - 4) < 13) continue;
      const isTuft = random() > 0.42;
      const target = isTuft ? tufts : stones;
      const index = isTuft ? tuftCount : stoneCount;
      if (index >= target.count) continue;
      const scale = 0.45 + random() * 1.15;
      transform.position.set(x, isTuft ? 0.26 * scale : 0.07, z);
      transform.rotation.set(random() * 0.35, random() * Math.PI, random() * 0.35);
      transform.scale.set(
        scale * (0.75 + random() * 0.7),
        scale * (isTuft ? 0.75 + random() * 0.8 : 0.28 + random() * 0.35),
        scale * (0.75 + random() * 0.7)
      );
      transform.updateMatrix();
      target.setMatrixAt(index, transform.matrix);
      if (target === tufts) tuftCount++;
      else stoneCount++;
    }
    tufts.count = tuftCount;
    stones.count = stoneCount;
    tufts.instanceMatrix.needsUpdate = true;
    stones.instanceMatrix.needsUpdate = true;
    tufts.frustumCulled = false;
    stones.frustumCulled = false;
    this.game.scene.add(tufts, stones);
  }
}

class EconomyManager {
  constructor(game) {
    this.game = game;
    this.credits = CONFIG.economy.credits;
    this.energy = CONFIG.economy.energy;
    this.energyMax = CONFIG.economy.energyMax;
    this.generation = CONFIG.economy.generation;
    this.generators = 0;
    this.poweredTowers = new Set();
  }
  get energyUse() {
    return [...this.poweredTowers].reduce((sum, tower) => sum + tower.config.energy * this.game.energyCostMultiplier(), 0);
  }
  update(dt) {
    const towers = [...this.game.towerManager.items].sort((a, b) => {
      const radarPriority = Number(b.type === "radar") - Number(a.type === "radar");
      const priority = { high: 0, normal: 1, low: 2 };
      return radarPriority || priority[a.priority] - priority[b.priority];
    });
    let available = Math.min(this.energyMax, this.energy + this.generation * dt);
    this.poweredTowers.clear();
    const multiplier = this.game.energyCostMultiplier();
    for (const tower of towers) {
      const demand = tower.config.energy * multiplier * dt;
      if (demand <= available) {
        this.poweredTowers.add(tower);
        available -= demand;
      }
    }
    this.energy = clamp(available, 0, this.energyMax);
  }
  canPower(tower) { return this.poweredTowers.has(tower); }
  spend(amount) {
    if (this.credits < amount) return false;
    this.credits -= amount;
    return true;
  }
  reward(amount) { this.credits += Math.round(amount * this.game.rewardMultiplier()); }
  addGenerator() {
    if (this.generators >= CONFIG.economy.generatorMax || !this.spend(CONFIG.economy.generatorCost)) return false;
    this.generators++;
    this.generation += 10;
    this.energyMax += 25;
    this.energy = Math.min(this.energy + 25, this.energyMax);
    this.game.addGeneratorModel();
    return true;
  }
}

class CameraManager {
  constructor(game) {
    this.game = game;
    this.angle = Math.PI / 4;
    this.distance = 100;
    this.target = new THREE.Vector3(0, 0, 0);
    this.update();
  }
  update() {
    const camera = this.game.camera;
    camera.position.set(this.target.x + Math.sin(this.angle) * this.distance * 0.55, this.distance * 0.86, this.target.z + Math.cos(this.angle) * this.distance * 0.55);
    camera.lookAt(this.target);
  }
  zoom(amount) { this.distance = clamp(this.distance + amount, 45, 145); this.update(); }
  rotate(amount) { this.angle += amount; this.update(); }
  move(dx, dz) {
    const forward = new THREE.Vector3(-Math.sin(this.angle), 0, -Math.cos(this.angle));
    const right = new THREE.Vector3(Math.cos(this.angle), 0, -Math.sin(this.angle));
    this.target.addScaledVector(right, dx).addScaledVector(forward, dz);
    this.target.x = clamp(this.target.x, -30, 30);
    this.target.z = clamp(this.target.z, -30, 30);
    this.update();
  }
}

class EnemyManager {
  constructor(game) { this.game = game; this.items = []; this.projectiles = []; this.effects = []; this.kills = 0; }
  createModel(type, stealth) {
    const data = CONFIG.enemies[type], group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.68, metalness: data.air ? 0.3 : 0.12, transparent: stealth, opacity: stealth ? 0.42 : 1 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x30372e, roughness: 0.9 });
    const trim = new THREE.MeshStandardMaterial({ color: 0x8c9277, roughness: 0.66, metalness: 0.35 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x5b8590, roughness: 0.25, metalness: 0.45 });
    const lamp = new THREE.MeshStandardMaterial({ color: 0xffd18a, emissive: 0xf28d39, emissiveIntensity: 1.8 });
    const box = (w, h, d, y, mat = material) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.y = y;
      m.castShadow = true;
      group.add(m);
      return m;
    };
    if (data.shape === "person") {
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.9, 8), material);
      torso.position.y = 0.72;
      group.add(torso);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 7), dark);
      head.position.y = 1.35;
      group.add(head);
      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 7, 0, Math.PI * 2, 0, Math.PI * 0.62), trim);
      helmet.position.y = 1.42;
      group.add(helmet);
      const pack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.24), dark);
      pack.position.set(0, 0.78, -0.3);
      group.add(pack);
      const rifle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.94), dark);
      rifle.position.set(0.34, 0.94, 0.18);
      rifle.rotation.x = -0.16;
      group.add(rifle);
      for (const side of [-1, 1]) {
        const leg = box(0.16, 0.6, 0.18, 0.2, dark);
        leg.position.x = side * 0.14;
        leg.name = side < 0 ? "leftLeg" : "rightLeg";
        const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.18, 7, 6), trim);
        shoulder.position.set(side * 0.29, 0.98, 0);
        group.add(shoulder);
      }
    } else if (data.shape === "drone") {
      box(0.75, 0.3, 0.75, 1.7);
      const sensor = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), lamp);
      sensor.position.set(0, 1.58, 0.43);
      group.add(sensor);
      const belly = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.42, 8), dark);
      belly.rotation.x = Math.PI;
      belly.position.y = 1.42;
      group.add(belly);
      for (const [x, z] of [[-0.7, -0.7], [-0.7, 0.7], [0.7, -0.7], [0.7, 0.7]]) {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.06), dark);
        arm.position.set(x * 0.5, 1.75, z * 0.5);
        arm.rotation.y = Math.PI / 4;
        group.add(arm);
        const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 12), dark);
        rotor.position.set(x, 1.8, z);
        rotor.name = "rotor";
        group.add(rotor);
      }
    } else if (data.shape === "heli") {
      box(1.5, 0.65, 2.2, 1.8);
      const cockpit = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 0.85), new THREE.MeshStandardMaterial({ color: 0x526d78, metalness: 0.4, roughness: 0.25 }));
      cockpit.position.set(0, 1.95, 1.2);
      group.add(cockpit);
      const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.1, 0.88), glass);
      windshield.position.set(0, 2.15, 1.2);
      group.add(windshield);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 2), material);
      tail.position.set(0, 1.8, -1.9);
      group.add(tail);
      const tailRotor = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.08), trim);
      tailRotor.position.set(0, 1.8, -2.85);
      tailRotor.name = "tailRotor";
      group.add(tailRotor);
      for (const side of [-1, 1]) {
        const sponson = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 1.1), dark);
        sponson.position.set(side * 0.9, 1.6, 0.1);
        group.add(sponson);
        const navLight = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: side < 0 ? 0xe94e48 : 0x63d28e }));
        navLight.position.set(side * 1.04, 1.72, 0.1);
        group.add(navLight);
      }
      const rotor = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.07, 0.16), dark);
      rotor.position.y = 2.35;
      rotor.name = "rotor";
      group.add(rotor);
    } else {
      const width = data.boss ? 3.5 : 2;
      const hullLength = data.boss ? 4.3 : 2.9;
      const hullY = data.boss ? 1.25 : 0.72;
      box(width, data.boss ? 1.8 : 1.05, hullLength, hullY);
      const glacis = new THREE.Mesh(new THREE.BoxGeometry(width * 0.88, 0.42, 0.68), material);
      glacis.position.set(0, hullY + (data.boss ? 0.45 : 0.24), hullLength * 0.38);
      glacis.rotation.x = -0.18;
      glacis.castShadow = true;
      group.add(glacis);
      for (const side of [-1, 1]) {
        const track = new THREE.Mesh(
          new THREE.BoxGeometry(0.42, data.boss ? 1.04 : 0.66, hullLength * 0.9),
          dark
        );
        track.position.set(side * (width * 0.48), data.boss ? 0.62 : 0.43, 0);
        group.add(track);
        const trackRail = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, data.boss ? 0.78 : 0.48, hullLength * 0.82),
          trim
        );
        trackRail.position.set(side * (width * 0.48 + 0.23), data.boss ? 0.62 : 0.43, 0);
        group.add(trackRail);
        for (let wheelIndex = 0; wheelIndex < 4; wheelIndex++) {
          const wheel = new THREE.Mesh(new THREE.CylinderGeometry(data.boss ? 0.31 : 0.22, data.boss ? 0.31 : 0.22, 0.48, 10), dark);
          wheel.rotation.z = Math.PI / 2;
          wheel.position.set(side * (width * 0.48 + 0.03), data.boss ? 0.62 : 0.43, -hullLength * 0.34 + wheelIndex * hullLength * 0.22);
          group.add(wheel);
        }
        const headlamp = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.08), lamp);
        headlamp.position.set(side * width * 0.34, hullY + 0.1, hullLength * 0.51);
        group.add(headlamp);
      }
      const turret = new THREE.Mesh(new THREE.CylinderGeometry(data.boss ? 0.85 : 0.62, 0.7, data.boss ? 0.75 : 0.5, 8), material);
      turret.position.set(0, data.boss ? 2.35 : 1.5, 0);
      group.add(turret);
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, data.boss ? 2.3 : 1.4, 8), dark);
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, data.boss ? 2.35 : 1.5, 1.05);
      group.add(barrel);
      for (const x of [-0.78, 0.78]) for (const z of [-0.9, 0.9]) {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.22, 10), dark);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x, 0.38, z);
        group.add(wheel);
      }
      if (data.boss) {
        for (const side of [-1, 1]) {
          const armorPlate = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.05, 2.1), trim);
          armorPlate.position.set(side * 1.83, 1.45, -0.15);
          armorPlate.rotation.x = -0.08;
          group.add(armorPlate);
          const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 1.3, 8), dark);
          pod.rotation.x = Math.PI / 2;
          pod.position.set(side * 1.25, 2.4, -0.68);
          group.add(pod);
        }
        const commander = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 0.24), lamp);
        commander.position.set(0, 2.83, 0.04);
        group.add(commander);
      } else {
        for (const side of [-1, 1]) {
          const storage = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.24, 0.52), trim);
          storage.position.set(side * 0.82, 1.12, -0.92);
          group.add(storage);
        }
      }
    }
    if (data.boss) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.07, 6, 32), new THREE.MeshBasicMaterial({ color: 0xe05a48 }));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.2;
      group.add(ring);
    }
    if (data.air && data.shape !== "heli") {
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), lamp);
      beacon.position.y = 1.96;
      group.add(beacon);
    }
    group.userData.bodyMaterial = material;
    return group;
  }
  spawn(type, waveScale = 1) {
    if (this.items.length >= CONFIG.world.maxEnemies) return false;
    const config = CONFIG.enemies[type];
    if (!config) return false;
    const stealth = !!config.stealth;
    const model = this.createModel(type, stealth);
    model.position.copy(ROUTE[0]);
    if (config.air) model.position.y = 2.8;
    model.userData.entityType = "enemy";
    const health = config.hp * waveScale * this.game.difficulty.health;
    const enemy = {
      type, config, model, hp: health, maxHp: health,
      speed: config.speed * (this.game.mode === "endless" ? 1 + Math.floor(this.game.wave / 5) * 0.01 : 1),
      routeIndex: 0, reward: config.reward, slowedUntil: 0, disabledUntil: 0,
      progress: 0, healthBarGroup: this.createHealthBar(config.air)
    };
    if (config.boss && this.game.mode === "endless") {
      enemy.maxHp *= Math.pow(1.2, Math.max(0, Math.floor(this.game.wave / 10) - 1));
      enemy.hp = enemy.maxHp;
    } else if (config.boss && this.game.mode === "campaign" && this.game.wave >= 10) {
      enemy.maxHp *= 1.2;
      enemy.hp = enemy.maxHp;
    }
    model.userData.entity = enemy;
    this.game.scene.add(model);
    this.game.scene.add(enemy.healthBarGroup);
    this.items.push(enemy);
    return true;
  }
  createHealthBar(air) {
    const group = new THREE.Group();
    const background = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 0.14),
      new THREE.MeshBasicMaterial({ color: 0x241d19, transparent: true, opacity: 0.9, depthTest: false })
    );
    const fill = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 0.08),
      new THREE.MeshBasicMaterial({ color: 0x8bc76c, depthTest: false })
    );
    fill.position.z = 0.01;
    group.add(background, fill);
    group.renderOrder = 2;
    group.userData = { fill, air };
    return group;
  }
  removeEnemy(enemy) {
    this.game.scene.remove(enemy.model);
    this.game.scene.remove(enemy.healthBarGroup);
    for (const part of enemy.healthBarGroup.children) {
      part.geometry.dispose();
      part.material.dispose();
    }
  }
  isVisible(enemy) {
    return !enemy.config.stealth || this.game.hasRadarCoverage(enemy.model.position);
  }
  damage(enemy, rawDamage, source = null, critical = false) {
    if (!this.items.includes(enemy)) return;
    const techBonus = 1 + this.game.save.rank("weapon") * 0.1;
    const amount = Math.max(1, rawDamage * (1 - enemy.config.armor) * techBonus * (critical ? 1.75 : 1));
    enemy.hp -= amount;
    if (enemy.hp <= 0) {
      this.kill(enemy);
      return;
    }
    if (Math.random() < 0.22) this.makeEffect(enemy.model.position, 0xffc36e, 0.22);
  }
  kill(enemy) {
    const index = this.items.indexOf(enemy);
    if (index < 0) return;
    this.items.splice(index, 1);
    this.removeEnemy(enemy);
    this.game.economy.reward(enemy.reward);
    this.kills++;
    this.game.save.data.totalKills++;
    this.game.save.save();
    this.makeEffect(enemy.model.position, enemy.config.boss ? 0xff714e : 0xf3b568, enemy.config.boss ? 3 : 1.2);
    this.game.audio.play(enemy.config.boss ? 85 : 190, 0.12, "sawtooth", 0.025);
    this.game.log(`${enemy.config.name} neutralized. +${enemy.reward} credits`, "good");
  }
  reachBase(enemy) {
    const index = this.items.indexOf(enemy);
    if (index < 0) return;
    this.items.splice(index, 1);
    this.removeEnemy(enemy);
    if (this.game.shieldTimer > 0) {
      this.game.log("Headquarters shield absorbed incoming damage.", "good");
      return;
    }
    const damage = Math.round(enemy.config.baseDamage * this.game.difficulty.damage);
    this.game.hp = Math.max(0, this.game.hp - damage);
    this.game.audio.play(90, 0.3, "sawtooth", 0.05);
    this.game.log(`HQ hit for ${damage} integrity by ${enemy.config.name}.`, "alert");
    if (this.game.hp <= 0) this.game.endGame(false);
  }
  update(dt) {
    const now = this.game.elapsed;
    for (const enemy of [...this.items]) {
      if (enemy.disabledUntil > now) continue;
      const from = ROUTE[enemy.routeIndex], to = ROUTE[enemy.routeIndex + 1];
      if (!to) { this.reachBase(enemy); continue; }
      const direction = to.clone().sub(from);
      const length = direction.length();
      const velocity = enemy.speed * (enemy.slowedUntil > now ? 0.52 : 1) * CONFIG.world.scale;
      enemy.progress += velocity * dt;
      const t = Math.min(1, enemy.progress / length);
      enemy.model.position.set(THREE.MathUtils.lerp(from.x, to.x, t), enemy.config.air ? 2.8 + Math.sin(now * 3 + enemy.routeIndex) * 0.18 : 0, THREE.MathUtils.lerp(from.z, to.z, t));
      enemy.model.rotation.y = Math.atan2(direction.x, direction.z);
      enemy.model.traverse((part) => {
        if (part.name === "rotor") part.rotation.y += dt * 13;
        if (part.name === "tailRotor") part.rotation.z += dt * 18;
        if (part.name === "leftLeg") part.rotation.x = Math.sin(now * enemy.speed * 2.8) * 0.28;
        if (part.name === "rightLeg") part.rotation.x = -Math.sin(now * enemy.speed * 2.8) * 0.28;
      });
      enemy.healthBarGroup.position.set(enemy.model.position.x, enemy.model.position.y + (enemy.config.air ? 2.9 : 2.2), enemy.model.position.z);
      enemy.healthBarGroup.quaternion.copy(this.game.camera.quaternion);
      enemy.healthBarGroup.visible = this.isVisible(enemy);
      const fill = enemy.healthBarGroup.userData.fill;
      const healthRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);
      fill.scale.x = healthRatio;
      fill.position.x = -(1 - healthRatio) * 0.85;
      if (enemy.config.stealth) {
        const material = enemy.model.userData.bodyMaterial;
        material.opacity = this.isVisible(enemy) ? 1 : 0.28;
      }
      enemy.progress = t * length;
      if (t >= 1) {
        enemy.routeIndex++;
        enemy.progress = 0;
        if (enemy.routeIndex >= ROUTE.length - 1) this.reachBase(enemy);
      }
    }
    this.updateProjectiles(dt);
    this.updateEffects(dt);
  }
  fire(tower, target) {
    if (tower.config.kind === "laser") {
      this.damage(target, tower.damage * Math.min(this.game.delta, 0.1), tower);
      if (Math.random() < 0.15) this.makeBeam(tower.model.position, target.model.position, tower.config.color);
      return;
    }
    if (this.projectiles.length >= CONFIG.world.maxProjectiles) return;
    const origin = tower.model.position.clone();
    origin.y += 1.5;
    const targetPos = target.model.position.clone();
    if (Math.random() > tower.accuracy) targetPos.x += (Math.random() - 0.5) * 3;
    targetPos.y += target.config.air ? -0.5 : 0.3;
    const material = new THREE.MeshBasicMaterial({ color: tower.config.color });
    const geometry = tower.config.kind === "missile" || tower.config.kind === "mortar" || tower.config.kind === "artillery"
      ? new THREE.SphereGeometry(0.2, 8, 6) : new THREE.SphereGeometry(0.09, 6, 5);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(origin);
    this.game.scene.add(mesh);
    this.projectiles.push({ mesh, from: origin, to: targetPos, target, tower, progress: 0, speed: tower.config.kind === "sniper" ? 120 : 45 });
    if (tower.config.kind === "machine" || tower.config.kind === "sniper") this.makeBeam(origin, targetPos, tower.config.color, 0.08);
    this.game.audio.play(tower.config.kind === "missile" ? 125 : 300 + Math.random() * 120, 0.045, "square", 0.008);
  }
  updateProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.progress += p.speed * CONFIG.world.scale * dt;
      const length = p.from.distanceTo(p.to);
      const t = Math.min(1, p.progress / Math.max(length, 0.01));
      p.mesh.position.lerpVectors(p.from, p.to, t);
      p.mesh.position.y += Math.sin(t * Math.PI) * (p.tower.config.splash ? 2 : 0.1);
      if (t >= 1) {
        if (this.items.includes(p.target)) this.applyImpact(p.target, p.tower);
        else this.makeEffect(p.to, 0xe1b56c, 0.35);
        this.game.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.projectiles.splice(i, 1);
      }
    }
  }
  applyImpact(target, tower) {
    const config = tower.config;
    const critical = Math.random() < (tower.level >= 5 ? 0.18 : 0.08);
    this.damage(target, tower.damage, tower, critical);
    if (config.splash) {
      const radius = config.splash * CONFIG.world.scale * (1 + (tower.branch === "range" ? 0.1 : 0));
      for (const enemy of [...this.items]) {
        if (enemy !== target && distanceXZ(enemy.model.position, target.model.position) <= radius) this.damage(enemy, tower.damage * 0.62, tower, false);
      }
      this.makeEffect(target.model.position, 0xffa05c, radius);
    } else if (config.chain) {
      let candidates = this.items.filter((item) => item !== target && this.isVisible(item));
      let origin = target.model.position;
      for (let n = 0; n < config.chain - 1 && candidates.length; n++) {
        candidates.sort((a, b) => distanceXZ(a.model.position, origin) - distanceXZ(b.model.position, origin));
        const next = candidates.shift();
        if (distanceXZ(next.model.position, origin) > 5.5) break;
        this.damage(next, tower.damage * (0.72 - n * 0.12), tower);
        this.makeBeam(origin, next.model.position, "#82d6ce", 0.2);
        origin = next.model.position;
      }
    }
    if (tower.level >= 5 && config.kind === "machine") target.slowedUntil = this.game.elapsed + 1.2;
    if (tower.level >= 5 && config.kind === "missile") target.slowedUntil = this.game.elapsed + 2;
  }
  makeBeam(a, b, color, duration = 0.11) {
    const geometry = new THREE.BufferGeometry().setFromPoints([a.clone(), b.clone()]);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 });
    const line = new THREE.Line(geometry, material);
    this.game.scene.add(line);
    this.effects.push({ object: line, life: duration, max: duration });
  }
  makeEffect(position, color, size) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(Math.max(0.15, size * 0.36), 8, 6), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.72 }));
    mesh.position.copy(position);
    mesh.position.y += 0.4;
    this.game.scene.add(mesh);
    this.effects.push({ object: mesh, life: 0.32, max: 0.32, grow: size });
  }
  updateEffects(dt) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i];
      effect.life -= dt;
      if (effect.object.material) effect.object.material.opacity = Math.max(0, effect.life / effect.max);
      if (effect.grow && effect.object.scale) effect.object.scale.setScalar(1 + (1 - effect.life / effect.max) * effect.grow);
      if (effect.life <= 0) {
        this.game.scene.remove(effect.object);
        effect.object.geometry?.dispose();
        effect.object.material?.dispose();
        this.effects.splice(i, 1);
      }
    }
  }
  clear() {
    for (const enemy of this.items) this.removeEnemy(enemy);
    for (const projectile of this.projectiles) {
      this.game.scene.remove(projectile.mesh);
      projectile.mesh.geometry.dispose();
      projectile.mesh.material.dispose();
    }
    for (const effect of this.effects) this.game.scene.remove(effect.object);
    this.items.length = 0; this.projectiles.length = 0; this.effects.length = 0;
    this.kills = 0;
  }
}

class TowerManager {
  constructor(game) { this.game = game; this.items = []; this.generatorModels = []; }
  createModel(type, position) {
    const config = CONFIG.towers[type];
    const group = new THREE.Group();
    group.position.copy(position);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x434d42, roughness: 0.75, metalness: 0.4 });
    const color = new THREE.Color(config.color);
    const accentMat = new THREE.MeshStandardMaterial({ color, metalness: 0.5, roughness: 0.36, emissive: color, emissiveIntensity: 0.12 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.2, 0.45, 10), baseMat);
    base.position.y = 0.25;
    base.castShadow = true;
    group.add(base);
    for (let i = 0; i < 4; i++) {
      const support = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.48, 0.24), baseMat);
      support.position.set(Math.cos(i * Math.PI / 2) * 0.75, 0.5, Math.sin(i * Math.PI / 2) * 0.75);
      group.add(support);
    }
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.76, 0.92, 8), baseMat);
    body.position.y = 0.92;
    body.castShadow = true;
    group.add(body);
    const turret = new THREE.Group();
    turret.position.y = 1.45;
    group.add(turret);
    const dome = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.56, 0.45, 8), accentMat);
    dome.position.y = 0.2;
    turret.add(dome);
    if (type === "radar") {
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 2, 8), baseMat);
      mast.position.y = 1;
      turret.add(mast);
      const dish = new THREE.Mesh(new THREE.SphereGeometry(0.74, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), accentMat);
      dish.rotation.x = -Math.PI / 2;
      dish.position.set(0, 1.85, 0);
      turret.add(dish);
    } else if (type === "tesla") {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 1.55, 8), accentMat);
      pole.position.y = 0.95;
      turret.add(pole);
      for (let i = 0; i < 3; i++) {
        const orb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), new THREE.MeshBasicMaterial({ color: config.color }));
        orb.position.set(Math.cos(i * Math.PI * 2 / 3) * 0.48, 1.65, Math.sin(i * Math.PI * 2 / 3) * 0.48);
        turret.add(orb);
      }
    } else if (type === "laser") {
      const emitter = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.32, 1.35), accentMat);
      emitter.position.set(0, 0.15, 0.75);
      turret.add(emitter);
      const lens = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshBasicMaterial({ color: config.color }));
      lens.position.set(0, 0.16, 1.4);
      turret.add(lens);
    } else {
      const barrels = type === "machine" ? 2 : 1;
      for (let i = 0; i < barrels; i++) {
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(type === "sniper" ? 0.1 : 0.14, 0.17, type === "artillery" ? 2.3 : 1.35, 8), accentMat);
        barrel.rotation.x = Math.PI / 2;
        barrel.position.set((i - (barrels - 1) / 2) * 0.27, 0.24, 0.84);
        turret.add(barrel);
      }
      if (type === "missile") {
        for (const side of [-1, 1]) {
          const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.26, 1.2, 8), baseMat);
          pod.rotation.x = Math.PI / 2;
          pod.position.set(side * 0.54, 0.2, 0.45);
          turret.add(pod);
        }
      }
      if (type === "mortar") {
        const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.8, 8), accentMat);
        tube.rotation.x = Math.PI / 3;
        tube.position.set(0, 0.55, 0.25);
        turret.add(tube);
      }
    }
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.14, 1.2, 28), new THREE.MeshBasicMaterial({ color: config.color, transparent: true, opacity: 0.45, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.03;
    group.add(ring);
    group.userData = { entityType: "tower" };
    this.game.scene.add(group);
    return { group, turret };
  }
  build(type, position) {
    const config = CONFIG.towers[type];
    if (!config || this.items.length >= CONFIG.world.maxTowers || !this.game.economy.spend(config.cost)) return false;
    const { group, turret } = this.createModel(type, position);
    const tower = { type, config, model: group, turret, level: 1, invested: config.cost, cooldown: 0, branch: "damage", priority: "normal", targetMode: "first", damage: config.damage, range: config.range, rate: config.rate, accuracy: config.accuracy, branchRangeBonus: 0 };
    group.userData.tower = tower;
    this.items.push(tower);
    this.game.selected = tower;
    this.game.placement = null;
    this.game.audio.play(520, 0.08, "triangle");
    this.game.log(`${config.name} deployed.`, "good");
    this.game.notify(`${config.name} deployed.`);
    return true;
  }
  upgrade(tower) {
    if (!tower || tower.level >= 5) return;
    const cost = CONFIG.upgrades[tower.level - 1];
    if (!this.game.economy.spend(cost)) return this.game.notify("Not enough credits for this upgrade.");
    tower.invested += cost;
    tower.level++;
    const level = tower.level;
    if (level === 2) tower.damage *= 1.15;
    if (level === 3) tower.rate *= 1.15;
    if (level === 4) tower.range *= 1.2;
    if (level === 5) tower.damage *= 1.25;
    if (tower.branch === "damage") tower.damage *= 1.08;
    if (tower.branch === "range") tower.branchRangeBonus += 0.05;
    if (tower.branch === "speed") tower.rate *= 1.08;
    tower.model.scale.setScalar(1 + (level - 1) * 0.045);
    this.game.updateTowerAppearance(tower);
    this.game.audio.play(700, 0.1, "triangle");
    this.game.log(`${tower.config.name} upgraded to level ${level}.`, "good");
    this.game.updateSelection();
  }
  sell(tower) {
    const index = this.items.indexOf(tower);
    if (index < 0) return;
    this.game.economy.credits += Math.floor(tower.invested * 0.5);
    this.game.scene.remove(tower.model);
    this.items.splice(index, 1);
    this.game.selected = null;
    this.game.updateSelection();
    this.game.log(`${tower.config.name} sold.`, "alert");
  }
  update(dt) {
    for (const tower of this.items) {
      const powered = this.game.economy.canPower(tower);
      tower.model.userData.unpowered = !powered;
      tower.cooldown -= dt;
      if (tower.config.kind === "radar") {
        if (powered) tower.turret.rotation.y += dt * 0.55;
        continue;
      }
      if (!powered) continue;
      const effectiveRange = this.game.towerRange(tower) * CONFIG.world.scale;
      const targets = this.game.enemies.items.filter((enemy) =>
        this.game.enemies.isVisible(enemy) &&
        (!enemy.config.air || tower.config.antiAir) &&
        distanceXZ(enemy.model.position, tower.model.position) <= effectiveRange
      );
      if (!targets.length) continue;
      const target = this.target(tower, targets);
      if (tower.config.kind === "laser") {
        this.game.enemies.fire(tower, target);
      } else if (tower.cooldown <= 0) {
        this.game.enemies.fire(tower, target);
        tower.cooldown = 1 / Math.max(0.05, tower.rate);
      }
      const direction = target.model.position.clone().sub(tower.model.position);
      tower.turret.rotation.y = Math.atan2(direction.x, direction.z);
    }
  }
  target(tower, targets) {
    const progress = (enemy) => enemy.routeIndex + enemy.progress / Math.max(1, ROUTE[enemy.routeIndex]?.distanceTo(ROUTE[enemy.routeIndex + 1] || ROUTE[enemy.routeIndex]) || 1);
    switch (tower.targetMode) {
      case "last": return targets.reduce((a, b) => progress(a) < progress(b) ? a : b);
      case "strongest": return targets.reduce((a, b) => a.hp > b.hp ? a : b);
      case "weakest": return targets.reduce((a, b) => a.hp < b.hp ? a : b);
      case "closest": return targets.reduce((a, b) => distanceXZ(a.model.position, tower.model.position) < distanceXZ(b.model.position, tower.model.position) ? a : b);
      default: return targets.reduce((a, b) => progress(a) > progress(b) ? a : b);
    }
  }
  clear() {
    for (const tower of this.items) this.game.scene.remove(tower.model);
    for (const model of this.generatorModels) this.game.scene.remove(model);
    this.items.length = 0; this.generatorModels.length = 0;
  }
}

class WaveManager {
  constructor(game) { this.game = game; this.state = "ready"; this.timer = CONFIG.world.prep; this.spawnTimer = 0; this.total = 0; this.spawned = 0; this.completed = 0; }
  start() {
    if (this.state === "ready" || this.state === "break") {
      this.timer = 0;
      this.beginWave();
    }
  }
  beginWave() {
    const maxWaves = this.game.mode === "campaign" ? 10 : this.game.mode === "boss" ? 1 : Infinity;
    if (this.game.wave >= maxWaves) { this.game.endGame(true); return; }
    this.game.wave++;
    const wave = this.game.wave;
    const count = this.game.mode === "boss" ? 1 : Math.min(Number.MAX_SAFE_INTEGER, Math.max(5, Math.floor(5 * Math.pow(1.12, wave - 1))));
    this.total = count;
    this.spawned = 0;
    this.spawnTimer = 0;
    this.state = "spawning";
    this.game.log(`Wave ${wave} incoming. ${this.total} hostile contacts detected.`, "alert");
    this.game.audio.play(240, 0.24, "sawtooth", 0.04);
    this.game.notify(`WAVE ${wave} INCOMING`);
  }
  nextEnemyType(index, wave) {
    if (this.game.mode === "boss") return "boss";
    const bossWave = this.game.mode === "campaign" ? wave % 5 === 0 : wave % 10 === 0;
    if (bossWave && index === this.total - 1) return "boss";
    const types = ["infantry"];
    if (wave >= 2) types.push("scout");
    if (wave >= 3) types.push("drone");
    if (wave >= 4) types.push("armored");
    if (wave >= 5) types.push("stealth");
    if (wave >= 6) types.push("helicopter");
    if (wave >= 7) types.push("heavy");
    return types[Math.floor(Math.random() * types.length)];
  }
  completeWave() {
    this.state = "break";
    this.completed++;
    const boss = this.game.mode === "boss" || (this.game.mode === "campaign" ? this.game.wave % 5 === 0 : this.game.wave % 10 === 0);
    const reward = boss ? CONFIG.economy.bossWaveReward : this.game.wave % 5 === 0 ? CONFIG.economy.fifthReward : CONFIG.economy.waveReward;
    this.game.economy.reward(reward);
    this.game.research += 1 + this.game.save.rank("research");
    this.game.notify(`WAVE CLEAR • +${reward} CREDITS • +${1 + this.game.save.rank("research")} RP`);
    this.game.log(`Wave ${this.game.wave} cleared. +${reward} credits, research awarded.`, "good");
    if (this.game.mode === "campaign" && this.game.wave >= 10) {
      this.game.save.data.missions = Math.max(this.game.save.data.missions, this.game.mission);
      this.game.save.save();
      this.game.endGame(true);
      return;
    }
    if (this.game.mode === "boss") { this.game.endGame(true); return; }
    this.timer = CONFIG.world.break;
  }
  update(dt) {
    if (this.state === "ready" || this.state === "break") {
      this.timer -= dt;
      if (this.timer <= 0) this.beginWave();
    } else if (this.state === "spawning") {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0 && this.spawned < this.total) {
        const type = this.nextEnemyType(this.spawned, this.game.wave);
        const healthScale = this.game.mode === "endless" ? Math.pow(1.05, this.game.wave - 1) : 1 + (this.game.mission - 1) * 0.08;
        if (this.game.enemies.spawn(type, healthScale)) {
          this.spawned++;
          this.spawnTimer = CONFIG.world.spawnInterval;
        }
        else this.spawnTimer = 0.4;
      }
      if (this.spawned >= this.total && this.game.enemies.items.length === 0) this.completeWave();
    }
  }
  earlyStart() {
    if (this.state === "ready" || this.state === "break") this.start();
  }
}

class Game {
  constructor() {
    this.save = new SaveManager();
    this.audio = new AudioManager();
    this.mode = "campaign"; this.difficultyKey = "normal"; this.difficulty = CONFIG.difficulty.normal;
    this.mapKey = "desert"; this.mission = 1; this.wave = 0; this.research = 0; this.hp = CONFIG.economy.hp;
    this.elapsed = 0; this.delta = 0; this.paused = true; this.ended = false; this.shieldTimer = 0;
    this.shieldCharges = 2;
    this.cooldowns = { air: 0, emp: 0, repair: 0, shield: 0 };
    this.placement = null; this.selected = null; this.branchChoice = "damage";
    this.keys = new Set(); this.clock = new THREE.Clock();
    this.fps = 0; this.fpsTimer = 0; this.frameCount = 0;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 300);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.28;
    $("battlefield").appendChild(this.renderer.domElement);
    this.scene.add(new THREE.HemisphereLight(0xeaf3d9, 0x2d342e, 1.8));
    const sun = new THREE.DirectionalLight(0xfff1c6, 3.8);
    sun.position.set(-32, 52, -25);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.00018;
    sun.shadow.normalBias = 0.035;
    sun.shadow.camera.left = -55; sun.shadow.camera.right = 55; sun.shadow.camera.top = 55; sun.shadow.camera.bottom = -55;
    this.scene.add(sun);
    this.sunLight = sun;
    const hqGlow = new THREE.PointLight(0xb7d674, 1.35, 42, 2.2);
    hqGlow.position.set(1, 6.5, 5);
    this.scene.add(hqGlow);
    this.hqGlow = hqGlow;
    this.cameraManager = new CameraManager(this);
    this.mapManager = new MapManager(this);
    this.mapManager.build("desert");
    this.economy = new EconomyManager(this);
    this.enemies = new EnemyManager(this);
    this.towerManager = new TowerManager(this);
    this.waves = new WaveManager(this);
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.rangeIndicator = this.createIndicator(0xb7d674, 0.44);
    this.placementRange = this.createIndicator(0xb7d674, 0.16);
    this.abilityIndicator = this.createIndicator(0x74c9e8, 0.42);
    this.placementFootprint = new THREE.Mesh(
      new THREE.RingGeometry(2.2, 2.45, 32),
      new THREE.MeshBasicMaterial({ color: 0xb7d674, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false })
    );
    this.placementFootprint.rotation.x = -Math.PI / 2;
    this.placementFootprint.position.y = 0.08;
    this.placementRange.rotation.x = -Math.PI / 2;
    this.placementRange.position.y = 0.07;
    this.rangeIndicator.rotation.x = -Math.PI / 2;
    this.rangeIndicator.position.y = 0.06;
    this.abilityIndicator.rotation.x = -Math.PI / 2;
    this.abilityIndicator.position.y = 0.1;
    this.rangeIndicator.visible = false;
    this.abilityIndicator.visible = false;
    this.placementRange.visible = false;
    this.placementFootprint.visible = false;
    this.scene.add(this.rangeIndicator, this.placementRange, this.placementFootprint, this.abilityIndicator);
    this.pendingAbility = null;
    this.swipeAttacking = false;
    this.swipeHits = new Set();
    this.makeUI();
    this.bindEvents();
    this.resize();
    this.render();
    requestAnimationFrame(() => this.animate());
  }
  makeUI() {
    for (const [id, map] of Object.entries(CONFIG.maps)) {
      const option = document.createElement("option");
      option.value = id; option.textContent = map.name;
      $("map-select").appendChild(option);
    }
    const list = $("tower-list");
    for (const [id, tower] of Object.entries(CONFIG.towers)) {
      const button = document.createElement("button");
      button.className = "tower-card";
      button.dataset.tower = id;
      button.style.setProperty("--tower-color", tower.color);
      button.innerHTML = `<span class="tower-symbol">${tower.symbol}</span><b>${tower.name}</b><small>${tower.cost} CR · ${tower.range}m</small>`;
      button.addEventListener("click", () => this.selectPlacement(id));
      list.appendChild(button);
    }
    this.fpsDisplay = document.createElement("div");
    this.fpsDisplay.id = "fps-display";
    this.fpsDisplay.textContent = "FPS 60";
    $("battlefield").appendChild(this.fpsDisplay);
    this.renderTechTree();
    $("quality-select").value = this.save.data.settings.quality || "high";
    this.applyQuality($("quality-select").value);
  }
  createIndicator(color, opacity) {
    const indicator = new THREE.Mesh(
      new THREE.RingGeometry(0.94, 1, 64),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false })
    );
    indicator.renderOrder = 1;
    return indicator;
  }
  updateTowerAppearance(tower) {
    if (!tower.appearanceGroup) {
      tower.appearanceGroup = new THREE.Group();
      tower.model.add(tower.appearanceGroup);
    }
    const oldMaterials = new Set();
    for (const part of tower.appearanceGroup.children) {
      part.geometry.dispose();
      if (Array.isArray(part.material)) part.material.forEach((material) => oldMaterials.add(material));
      else oldMaterials.add(part.material);
    }
    oldMaterials.forEach((material) => material.dispose());
    tower.appearanceGroup.clear();
    const armor = new THREE.MeshStandardMaterial({
      color: 0x748269,
      roughness: 0.52,
      metalness: 0.58,
      emissive: new THREE.Color(tower.config.color),
      emissiveIntensity: 0.11
    });
    const trim = new THREE.MeshStandardMaterial({ color: 0x26312a, roughness: 0.62, metalness: 0.48 });
    for (let rank = 0; rank < tower.level - 1; rank++) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.1, 0.24), armor);
      plate.position.set(-0.74 + rank * 0.37, 1.44, -0.58);
      plate.castShadow = true;
      tower.appearanceGroup.add(plate);
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 5), trim);
      rivet.position.set(-0.74 + rank * 0.37, 1.51, -0.58);
      tower.appearanceGroup.add(rivet);
    }
    if (tower.level >= 3) {
      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.055, 0.75, 6), trim);
      antenna.position.set(0.72, 1.95, -0.42);
      tower.appearanceGroup.add(antenna);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.095, 8, 6), new THREE.MeshBasicMaterial({ color: tower.config.color }));
      tip.position.set(0.72, 2.34, -0.42);
      tower.appearanceGroup.add(tip);
    }
    if (tower.level >= 5) {
      const insignia = new THREE.Mesh(new THREE.TorusGeometry(0.83, 0.035, 6, 32), armor);
      insignia.rotation.x = Math.PI / 2;
      insignia.position.y = 0.13;
      tower.appearanceGroup.add(insignia);
    }
  }
  updateIndicators() {
    const tower = this.selected;
    this.rangeIndicator.visible = !!tower && !this.placement;
    if (tower && !this.placement) {
      this.rangeIndicator.position.set(tower.model.position.x, 0.06, tower.model.position.z);
      this.rangeIndicator.scale.setScalar(this.towerRange(tower) * CONFIG.world.scale);
    }
    const placing = !!this.placement && this.placementFootprint.userData.hasPosition;
    this.placementRange.visible = placing;
    this.placementFootprint.visible = placing;
    if (placing) {
      const { x, z } = this.placementFootprint.position;
      this.placementRange.position.set(x, 0.07, z);
      this.placementFootprint.material.color.copy(this.placementRange.material.color);
    }
    this.abilityIndicator.visible = !!this.pendingAbility;
    document.querySelectorAll(".ability-button").forEach((button) => {
      button.classList.toggle("aiming", button.dataset.ability === this.pendingAbility);
    });
  }
  getGroundPoint(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const ground = this.scene.children.find((object) => object.name === "ground");
    return ground ? this.raycaster.intersectObject(ground, false)[0]?.point || null : null;
  }
  updateAbilityPreview(event) {
    if (!this.pendingAbility) return;
    const point = this.getGroundPoint(event);
    if (!point) return;
    this.abilityIndicator.position.set(point.x, 0.1, point.z);
    this.abilityIndicator.scale.setScalar(this.pendingAbility === "air" ? 10 : 14);
  }
  updatePlacementPreview(event) {
    if (!this.placement) {
      this.placementFootprint.userData.hasPosition = false;
      this.updateIndicators();
      return;
    }
    const point = this.getGroundPoint(event);
    if (!point) {
      this.placementFootprint.userData.hasPosition = false;
      this.updateIndicators();
      return;
    }
    this.placementFootprint.position.set(point.x, 0.08, point.z);
    this.placementRange.position.set(point.x, 0.07, point.z);
    this.placementRange.scale.setScalar(CONFIG.towers[this.placement].range * CONFIG.world.scale);
    const valid = this.validBuildPosition(point) &&
      !this.towerManager.items.some((tower) => distanceXZ(tower.model.position, point) < CONFIG.world.spacing);
    const color = valid ? 0xb7d674 : 0xe46f62;
    this.placementRange.material.color.setHex(color);
    this.placementFootprint.material.color.setHex(color);
    this.placementFootprint.userData.hasPosition = true;
    this.updateIndicators();
  }
  bindEvents() {
    $("start-button").addEventListener("click", () => this.newGame());
    $("wave-button").addEventListener("click", () => this.waves.earlyStart());
    $("pause-button").addEventListener("click", () => this.togglePause());
    $("resume-button").addEventListener("click", () => this.togglePause(false));
    $("menu-button").addEventListener("click", () => this.toMenu());
    $("again-button").addEventListener("click", () => this.newGame());
    $("end-menu-button").addEventListener("click", () => this.toMenu());
    $("tech-open").addEventListener("click", () => this.openTech());
    $("tech-open-start").addEventListener("click", () => this.openTech());
    $("tech-close").addEventListener("click", () => $("tech-modal").classList.add("hidden"));
    $("upgrade-button").addEventListener("click", () => this.towerManager.upgrade(this.selected));
    $("sell-button").addEventListener("click", () => this.selected && this.towerManager.sell(this.selected));
    $("target-select").addEventListener("change", (event) => { if (this.selected) this.selected.targetMode = event.target.value; });
    $("power-priority").addEventListener("change", (event) => {
      if (this.selected) this.selected.priority = event.target.value;
    });
    $("branch-damage").addEventListener("click", () => this.setBranch("damage"));
    $("branch-range").addEventListener("click", () => this.setBranch("range"));
    $("branch-speed").addEventListener("click", () => this.setBranch("speed"));
    $("repair-button").addEventListener("click", () => this.repairBase());
    $("generator-button").addEventListener("click", () => this.buildGenerator());
    $("clear-log").addEventListener("click", () => { $("comms-log").replaceChildren(); });
    $("tactical-map-toggle").addEventListener("click", () => {
      const panel = $("tactical-map-panel");
      const collapsed = panel.classList.toggle("collapsed");
      const toggle = $("tactical-map-toggle");
      toggle.setAttribute("aria-expanded", String(!collapsed));
      toggle.setAttribute("aria-label", collapsed ? "Expand tactical map" : "Collapse tactical map");
      toggle.textContent = collapsed ? "+" : "−";
    });
    $("quality-select").addEventListener("change", (event) => {
      this.save.data.settings.quality = event.target.value;
      this.save.save();
      this.applyQuality(event.target.value);
    });
    document.querySelectorAll(".ability-button").forEach((button) => button.addEventListener("click", () => this.useAbility(button.dataset.ability)));
    $("battlefield").addEventListener("pointerdown", (event) => this.onPointerDown(event));
    $("battlefield").addEventListener("contextmenu", (event) => {
      event.preventDefault();
      this.placement = null;
      this.pendingAbility = null;
      this.placementFootprint.userData.hasPosition = false;
      this.updateBuildButtons();
      this.updateIndicators();
    });
    $("battlefield").addEventListener("pointermove", (event) => this.updatePlacementPreview(event));
    $("battlefield").addEventListener("pointermove", (event) => this.updateAbilityPreview(event));
    $("battlefield").addEventListener("pointermove", (event) => this.handleHeroSwipe(event));
    $("battlefield").addEventListener("wheel", (event) => { this.cameraManager.zoom(event.deltaY * 0.045); }, { passive: true });
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("keydown", (event) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
      const key = event.key.toLowerCase();
      this.keys.add(key);
      if (key === "escape" && (this.pendingAbility || this.placement)) {
        this.pendingAbility = null;
        this.placement = null;
        this.placementFootprint.userData.hasPosition = false;
        this.updateBuildButtons();
        this.updateIndicators();
      } else if (key === "p" || key === "escape") this.togglePause();
      if (key === "q") this.cameraManager.rotate(-0.12);
      if (key === "e") this.cameraManager.rotate(0.12);
      if (["1", "2", "3", "4"].includes(key)) this.useAbility(["air", "emp", "repair", "shield"][Number(key) - 1]);
    });
    window.addEventListener("keyup", (event) => this.keys.delete(event.key.toLowerCase()));
    window.addEventListener("blur", () => { this.keys.clear(); if (!this.paused && !$("start-screen").classList.contains("hidden")) return; });
    let dragging = false, previous = { x: 0, y: 0 };
    $("battlefield").addEventListener("pointerdown", (event) => {
      if (event.button === 1) { dragging = true; previous = { x: event.clientX, y: event.clientY }; }
    });
    window.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      this.cameraManager.rotate((event.clientX - previous.x) * 0.006);
      this.cameraManager.zoom((event.clientY - previous.y) * 0.16);
      previous = { x: event.clientX, y: event.clientY };
    });
    window.addEventListener("pointerup", () => { dragging = false; this.swipeAttacking = false; });
  }
  newGame() {
    this.mode = $("mode-select").value;
    this.difficultyKey = $("difficulty-select").value;
    this.difficulty = CONFIG.difficulty[this.difficultyKey];
    this.mapKey = $("map-select").value;
    this.mission = Math.min(20, Math.max(1, this.save.data.missions + 1));
    this.wave = 0; this.research = 0; this.hp = CONFIG.economy.hp;
    this.ended = false; this.paused = false; this.elapsed = 0; this.shieldTimer = 0;
    this.shieldCharges = 2;
    this.pendingAbility = null;
    this.swipeAttacking = false;
    this.swipeHits.clear();
    this.cooldowns = { air: 0, emp: 0, repair: 0, shield: 0 };
    this.selected = null; this.placement = null;
    this.scene.clear();
    this.scene.add(new THREE.HemisphereLight(0xe4eddd, 0x353c32, 1.65));
    const sun = new THREE.DirectionalLight(0xffdfb3, 3.2);
    sun.position.set(-32, 52, -25); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.00018;
    sun.shadow.normalBias = 0.035;
    sun.shadow.camera.left = -55; sun.shadow.camera.right = 55; sun.shadow.camera.top = 55; sun.shadow.camera.bottom = -55;
    this.scene.add(sun);
    this.sunLight = sun;
    this.mapManager.build(this.mapKey);
    this.scene.add(this.rangeIndicator, this.placementRange, this.placementFootprint, this.abilityIndicator);
    this.towerManager.clear(); this.enemies.clear();
    this.economy = new EconomyManager(this);
    this.economy.credits = this.difficulty.credits;
    this.waves = new WaveManager(this);
    this.cameraManager.target.set(0, 0, 0); this.cameraManager.angle = Math.PI / 4; this.cameraManager.distance = 100; this.cameraManager.update();
    $("start-screen").classList.add("hidden"); $("end-screen").classList.add("hidden"); $("pause-screen").classList.add("hidden");
    $("mission-name").textContent = this.mapData.name;
    $("mission-objective").textContent = this.mode === "endless" ? "Survive endless hostile waves. Your best wave is saved automatically." : this.mode === "boss" ? "Defeat the Siege Titan before it reaches the headquarters." : `Mission ${String(this.mission).padStart(2, "0")} • Hold the line through 10 escalating waves.`;
    $("mode-label").textContent = this.mode.toUpperCase();
    $("difficulty-label").textContent = this.difficulty.name.toUpperCase();
    $("comms-log").replaceChildren();
    this.log(`${this.mapData.name} secured. Establish defenses before the first wave.`, "good");
    this.renderTechTree();
    this.updateSelection();
    this.updateBuildButtons();
    this.applyQuality($("quality-select").value);
  }
  toMenu() {
    this.paused = true; this.ended = false;
    $("pause-screen").classList.add("hidden"); $("end-screen").classList.add("hidden");
    $("start-screen").classList.remove("hidden");
  }
  togglePause(force) {
    if (this.ended || !$("start-screen").classList.contains("hidden")) return;
    this.paused = force === undefined ? !this.paused : force;
    $("pause-screen").classList.toggle("hidden", !this.paused);
  }
  endGame(victory) {
    if (this.ended) return;
    this.ended = true; this.paused = true;
    if (this.mode === "endless") {
      this.save.data.endlessBest = Math.max(this.save.data.endlessBest, this.wave);
      this.save.save();
    }
    $("end-eyebrow").textContent = victory ? "OPERATION SUCCESS" : "HEADQUARTERS COMPROMISED";
    $("end-title").textContent = victory ? "MISSION COMPLETE" : "MISSION FAILED";
    $("end-summary").textContent = victory
      ? `${this.mode === "endless" ? `Survived ${this.wave} waves. Best: ${this.save.data.endlessBest}.` : `Operation complete after ${this.wave} wave${this.wave === 1 ? "" : "s"}.`} Hostiles eliminated: ${this.enemies.kills}.`
      : `The headquarters fell during wave ${this.wave}. Hostiles eliminated: ${this.enemies.kills}.`;
    $("end-screen").classList.remove("hidden");
    this.audio.play(victory ? 620 : 110, 0.4, victory ? "triangle" : "sawtooth", 0.05);
  }
  selectPlacement(type) {
    if (this.economy.credits < CONFIG.towers[type].cost) return this.notify("Not enough credits for this structure.");
    this.placement = type;
    this.selected = null;
    this.updateSelection();
    this.updateBuildButtons();
    this.updateIndicators();
    this.notify(`Place ${CONFIG.towers[type].name} on clear ground. Right-click to cancel.`);
  }
  onPointerDown(event) {
    if (event.button !== 0) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    if (this.pendingAbility) {
      const point = this.getGroundPoint(event);
      if (point) this.resolveTargetedAbility(this.pendingAbility, point);
      return;
    }
    this.swipeAttacking = !this.paused && !this.ended && !this.placement;
    this.swipeHits.clear();
    const clickable = [...this.towerManager.items.map((tower) => tower.model), ...this.enemies.items.map((enemy) => enemy.model)];
    const hits = this.raycaster.intersectObjects(clickable, true);
    let entity = null;
    for (const hit of hits) {
      let node = hit.object;
      while (node && !node.userData.entityType) node = node.parent;
      if (node?.userData.entityType) { entity = node; break; }
    }
    if (entity?.userData.entityType === "tower") {
      this.selected = entity.userData.tower; this.placement = null; this.updateSelection(); this.updateBuildButtons(); this.updateIndicators(); return;
    }
    if (entity?.userData.entityType === "enemy") {
      const target = entity.userData.entity;
      $("intel-content").textContent = `${target.config.name} • ${fmt(target.hp)} / ${fmt(target.maxHp)} HP • ${Math.round(target.config.armor * 100)}% armor • ${target.speed.toFixed(1)} m/s`;
      this.hitWithHero(target);
      return;
    }
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const groundHits = this.raycaster.intersectObjects(this.scene.children, true).filter((hit) => hit.object.name === "ground");
    if (!groundHits.length) {
      this.selected = null;
      this.updateSelection();
      this.updateIndicators();
      return;
    }
    const point = groundHits[0].point;
    if (this.placement) {
      const type = this.placement;
      if (!this.validBuildPosition(point)) return this.notify("That position is blocked. Keep towers off the road and HQ perimeter.");
      if (this.towerManager.items.some((tower) => distanceXZ(tower.model.position, point) < CONFIG.world.spacing)) return this.notify("Structures need at least 5 meters of spacing.");
      if (this.towerManager.build(type, point)) {
        this.placementFootprint.userData.hasPosition = false;
        this.updateSelection(); this.updateBuildButtons(); this.updateIndicators();
      }
    } else {
      this.selected = null; this.updateSelection(); this.updateIndicators();
    }
  }
  handleHeroSwipe(event) {
    if (!this.swipeAttacking || this.pendingAbility || this.placement) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.enemies.items.map((enemy) => enemy.model), true);
    for (const hit of hits) {
      let node = hit.object;
      while (node && node.userData.entityType !== "enemy") node = node.parent;
      const enemy = node?.userData.entity;
      if (enemy && this.enemies.isVisible(enemy) && !this.swipeHits.has(enemy)) {
        $("intel-content").textContent = `${enemy.config.name} • ${fmt(enemy.hp)} / ${fmt(enemy.maxHp)} HP • ${Math.round(enemy.config.armor * 100)}% armor • ${enemy.speed.toFixed(1)} m/s`;
        this.hitWithHero(enemy);
        break;
      }
    }
  }
  hitWithHero(enemy) {
    if (this.swipeHits.has(enemy) || !this.enemies.items.includes(enemy)) return;
    this.swipeHits.add(enemy);
    const position = enemy.model.position.clone();
    this.enemies.damage(enemy, 65);
    this.enemies.makeEffect(position, 0xe7d0a1, 0.7);
    this.audio.play(250, 0.045, "triangle", 0.018);
  }
  validBuildPosition(point) {
    if (Math.abs(point.x) > 47 || Math.abs(point.z) > 47 || Math.hypot(point.x, point.z - 4) < 8) return false;
    return !this.isNearRoute(point.x, point.z, 3.2);
  }
  isNearRoute(x, z, margin = 3.5) {
    const point = new THREE.Vector3(x, 0, z);
    for (let i = 0; i < ROUTE.length - 1; i++) {
      const segment = new THREE.Line3(ROUTE[i], ROUTE[i + 1]);
      if (segment.closestPointToPoint(point, true, new THREE.Vector3()).distanceTo(point) < margin) return true;
    }
    return false;
  }
  towerRange(tower) {
    const radar = this.towerManager.items.some((item) => item.type === "radar" && this.economy.canPower(item) && distanceXZ(item.model.position, tower.model.position) <= item.range * CONFIG.world.scale);
    return tower.range * (1 + tower.branchRangeBonus + this.save.rank("ballistics") * 0.1 + (radar ? 0.1 : 0));
  }
  hasRadarCoverage(position) {
    return this.towerManager.items.some((tower) => tower.type === "radar" && this.economy.canPower(tower) && distanceXZ(tower.model.position, position) <= tower.range * CONFIG.world.scale);
  }
  energyCostMultiplier() { return 1 - this.save.rank("power") * 0.1; }
  rewardMultiplier() { return 1 + this.save.rank("logistics") * 0.1; }
  setBranch(branch) {
    if (!this.selected) return;
    this.selected.branch = branch;
    this.selected.level = Math.max(1, this.selected.level);
    this.branchChoice = branch;
    for (const button of document.querySelectorAll(".branch-button")) button.classList.toggle("active", button.id === `branch-${branch}`);
    this.updateSelection();
  }
  updateSelection() {
    const tower = this.selected;
    $("selection-empty").classList.toggle("hidden", !!tower);
    $("selection-details").classList.toggle("hidden", !tower);
    $("selected-badge").textContent = tower ? "ACTIVE" : "NONE";
    if (!tower) {
      this.updateIndicators();
      return;
    }
    $("selected-name").textContent = tower.config.name;
    $("selected-badge").textContent = this.economy.canPower(tower) ? "POWERED" : "OFFLINE";
    $("selected-level").textContent = `LEVEL ${tower.level} / 5`;
    $("selected-range").textContent = `RANGE ${Math.round(this.towerRange(tower))}m`;
    $("target-select").value = tower.targetMode;
    $("power-priority").value = tower.priority;
    const stats = [
      ["DAMAGE", tower.config.kind === "laser" ? `${tower.damage} /s` : Math.round(tower.damage)],
      ["FIRE RATE", tower.config.rate ? `${tower.rate.toFixed(2)} /s` : "Passive"],
      ["ENERGY", `${tower.config.energy} /s`],
      ["ACCURACY", `${Math.round(tower.accuracy * 100)}%`]
    ];
    $("selected-stats").innerHTML = stats.map(([label, value]) => `<div class="stat"><span>${label}</span><b>${value}</b></div>`).join("");
    this.updateIndicators();
    const cost = tower.level >= 5 ? 0 : CONFIG.upgrades[tower.level - 1];
    $("upgrade-button").disabled = tower.level >= 5;
    $("upgrade-button").innerHTML = tower.level >= 5 ? "MAXIMUM LEVEL" : `UPGRADE <span>${cost} CR</span>`;
    $("sell-value").textContent = `${Math.floor(tower.invested * 0.5)} CR`;
    for (const button of document.querySelectorAll(".branch-button")) button.classList.toggle("active", button.id === `branch-${tower.branch}`);
  }
  updateBuildButtons() {
    document.querySelectorAll(".tower-card").forEach((button) => {
      const type = button.dataset.tower;
      button.classList.toggle("selected", type === this.placement);
      button.disabled = this.towerManager.items.length >= CONFIG.world.maxTowers || this.economy.credits < CONFIG.towers[type].cost;
    });
    $("tower-count").textContent = this.towerManager.items.length;
  }
  repairBase() {
    if (this.hp >= CONFIG.economy.hpMax + this.save.rank("fortification") * 250) return this.notify("Headquarters is already at maximum integrity.");
    if (!this.economy.spend(150)) return this.notify("Repair requires 150 credits.");
    this.hp = Math.min(CONFIG.economy.hpMax + this.save.rank("fortification") * 250, this.hp + 250);
    this.log("HQ repair crew restored 250 integrity.", "good");
  }
  buildGenerator() {
    if (!this.economy.addGenerator()) return this.notify(this.economy.generators >= CONFIG.economy.generatorMax ? "Maximum generators already deployed." : "Generator construction requires 300 credits.");
    this.log(`Power generator online. Generation: ${this.economy.generation} energy/s.`, "good");
    $("generator-count").textContent = `${this.economy.generators} / 3`;
  }
  addGeneratorModel() {
    const x = 7 + this.economy.generators * 3, z = 12;
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 2), new THREE.MeshStandardMaterial({ color: 0x59645b, metalness: 0.5 }));
    base.position.y = 0.6;
    const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.8, 8), new THREE.MeshBasicMaterial({ color: 0x70cbd0 }));
    glow.position.set(0, 1.4, 0);
    group.add(base, glow); group.position.set(x, 0, z);
    this.scene.add(group); this.towerManager.generatorModels.push(group);
  }
  useAbility(name) {
    if (this.paused || this.ended) return;
    if (this.cooldowns[name] > 0) return this.notify(`${name.toUpperCase()} recharging.`);
    const cooldowns = { air: 90, emp: 75, repair: 120, shield: 100 };
    if (name === "air" || name === "emp") {
      this.placement = null;
      this.pendingAbility = name;
      this.abilityIndicator.scale.setScalar(name === "air" ? 10 : 14);
      this.updateIndicators();
      this.notify(`Select a battlefield location for ${name === "air" ? "air support" : "the EMP pulse"}. Right-click to cancel.`);
      return;
    }
    if (name === "repair") {
      if (this.hp >= CONFIG.economy.hpMax + this.save.rank("fortification") * 250) return this.notify("Headquarters is already at maximum integrity.");
      this.hp = Math.min(CONFIG.economy.hpMax + this.save.rank("fortification") * 250, this.hp + 300);
      this.log("Emergency repair restored 300 HQ integrity.", "good");
    } else if (name === "shield") {
      if (this.shieldCharges <= 0) return this.notify("No defensive shield charges remain this operation.");
      this.shieldTimer = 8;
      this.shieldCharges--;
      this.baseShield.visible = true;
      this.log(`Emergency shield active. ${this.shieldCharges} charge${this.shieldCharges === 1 ? "" : "s"} remain.`, "good");
    }
    this.cooldowns[name] = cooldowns[name];
    this.audio.play(name === "air" ? 120 : 640, 0.25, "sawtooth", 0.04);
  }
  resolveTargetedAbility(name, point) {
    const radius = name === "air" ? 10 : 14;
    const targets = this.enemies.items.filter((enemy) => distanceXZ(enemy.model.position, point) <= radius);
    if (!targets.length) return this.notify("No hostiles in that area. Choose another location.");
    if (name === "air") {
      const damagePerTarget = 500 / targets.length;
      for (const enemy of targets) this.enemies.damage(enemy, damagePerTarget);
      this.makeAbilityBlast(point, 0xffb05e, radius);
      this.log(`Air support struck ${targets.length} hostile unit${targets.length === 1 ? "" : "s"}.`, "good");
      this.cooldowns.air = 90;
      this.audio.play(120, 0.25, "sawtooth", 0.04);
    } else {
      for (const enemy of targets) enemy.disabledUntil = this.elapsed + 5;
      this.makeAbilityBlast(point, 0x70cbd0, radius);
      this.log(`EMP pulse disabled ${targets.length} hostile unit${targets.length === 1 ? "" : "s"} for 5 seconds.`, "good");
      this.cooldowns.emp = 75;
      this.audio.play(640, 0.25, "sawtooth", 0.04);
    }
    this.pendingAbility = null;
    this.updateIndicators();
  }
  makeAbilityBlast(position, color, scale = 7) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 8), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.75, wireframe: true }));
    mesh.position.copy(position); mesh.position.y += 0.7; this.scene.add(mesh);
    this.enemies.effects.push({ object: mesh, life: 0.6, max: 0.6, grow: scale });
  }
  openTech() {
    $("tech-modal").classList.remove("hidden");
    this.renderTechTree();
  }
  renderTechTree() {
    const holder = $("tech-grid");
    if (!holder) return;
    $("tech-points").textContent = `${this.research} RP`;
    holder.innerHTML = CONFIG.tech.map((tech) => {
      const rank = this.save.rank(tech.id), maxed = rank >= tech.max;
      return `<article class="tech-node"><h3>${tech.title}</h3><p>${tech.description}</p><button data-tech="${tech.id}" ${maxed || this.research < tech.cost ? "disabled" : ""}>${maxed ? `MAX RANK ${rank}` : `UNLOCK RANK ${rank + 1} · ${tech.cost} RP`}</button></article>`;
    }).join("");
    holder.querySelectorAll("[data-tech]").forEach((button) => button.addEventListener("click", () => this.unlockTech(button.dataset.tech)));
  }
  unlockTech(id) {
    const tech = CONFIG.tech.find((item) => item.id === id);
    if (!tech || this.save.rank(id) >= tech.max || this.research < tech.cost) return;
    this.research -= tech.cost;
    this.save.data.tech[id] = this.save.rank(id) + 1;
    if (id === "fortification") this.hp += 250;
    this.save.save();
    this.log(`${tech.title} research completed.`, "good");
    this.renderTechTree();
    this.updateHUD();
  }
  applyQuality(quality) {
    const ratio = { low: 0.8, medium: 1, high: 1.35, ultra: 1.75 }[quality] || 1.35;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ratio));
    this.renderer.shadowMap.enabled = quality !== "low";
    const shadowSize = { low: 512, medium: 1024, high: 2048, ultra: 3072 }[quality] || 2048;
    this.sunLight.shadow.mapSize.set(shadowSize, shadowSize);
    this.sunLight.shadow.map?.dispose();
    this.sunLight.shadow.map = null;
    if (this.mapManager.weather) this.mapManager.weather.visible = quality !== "low";
    this.renderer.shadowMap.needsUpdate = true;
    this.resize();
  }
  resize() {
    if (!this.renderer) return;
    const rect = $("battlefield").getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(rect.width, rect.height, false);
  }
  updateHUD() {
    $("credits").textContent = fmt(this.economy.credits);
    $("energy").textContent = fmt(this.economy.energy);
    $("energy-rate").textContent = `${this.economy.generation - this.economy.energyUse >= 0 ? "+" : ""}${(this.economy.generation - this.economy.energyUse).toFixed(0)}/s`;
    $("research").textContent = fmt(this.research);
    const waveLimit = this.mode === "endless" ? "/ ∞" : this.mode === "boss" ? "/ 1" : "/ 10";
    $("wave").innerHTML = `${this.wave} <span>${waveLimit}</span>`;
    const maxHp = CONFIG.economy.hpMax + this.save.rank("fortification") * 250;
    $("hp-label").textContent = `${fmt(this.hp)} / ${fmt(maxHp)}`;
    $("hp-bar").style.width = `${clamp(this.hp / maxHp * 100, 0, 100)}%`;
    $("hp-bar").style.background = this.hp < maxHp * 0.3 ? "var(--red)" : "var(--green)";
    $("enemy-count").textContent = this.enemies.items.length + Math.max(0, this.waves.total - this.waves.spawned);
    $("kills").textContent = this.enemies.kills;
    const stateText = this.waves.state === "spawning" ? "HOSTILES ENGAGING" : this.waves.state === "break" ? `NEXT WAVE IN ${Math.max(0, Math.ceil(this.waves.timer))}s` : this.waves.state === "ready" ? `PREP PHASE ${Math.max(0, Math.ceil(this.waves.timer))}s` : "AWAITING DEPLOYMENT";
    $("wave-status").textContent = stateText;
    const progress = this.waves.state === "spawning" ? this.waves.spawned / Math.max(this.waves.total, 1) * 100 : this.waves.state === "break" ? (1 - this.waves.timer / CONFIG.world.break) * 100 : 0;
    $("wave-progress").style.width = `${progress}%`;
    $("wave-button").textContent = this.waves.state === "ready" || this.waves.state === "break" ? "START WAVE NOW" : this.waves.state === "spawning" ? "WAVE IN PROGRESS" : "DEPLOY FIRST WAVE";
    $("wave-button").disabled = this.waves.state === "spawning";
    $("generator-count").textContent = `${this.economy.generators} / 3`;
    $("repair-button").disabled = this.economy.credits < 150 || this.hp >= maxHp;
    $("generator-button").disabled = this.economy.credits < CONFIG.economy.generatorCost || this.economy.generators >= CONFIG.economy.generatorMax;
    for (const [name, remaining] of Object.entries(this.cooldowns)) {
      const el = $(`cooldown-${name}`);
      if (el) el.textContent = name === "shield" && this.shieldCharges <= 0
        ? "DEPLETED"
        : remaining > 0 ? `${Math.ceil(remaining)}s` : name === "shield" ? `${this.shieldCharges} LEFT` : "READY";
      const button = document.querySelector(`[data-ability="${name}"]`);
      if (button) button.disabled = this.paused || remaining > 0 || (name === "shield" && this.shieldCharges <= 0);
    }
    this.updateBuildButtons();
    if (this.selected) this.updateSelection();
    this.drawTacticalMap();
  }
  drawTacticalMap() {
    const canvas = $("tactical-map");
    const context = canvas?.getContext("2d");
    if (!context) return;
    const { width, height } = canvas;
    const px = (x) => (x + 50) / 100 * width;
    const py = (z) => height - (z + 50) / 100 * height;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#101711";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "rgba(201, 218, 180, 0.1)";
    context.lineWidth = 1;
    for (let grid = 1; grid < 5; grid++) {
      const x = width * grid / 5;
      const y = height * grid / 5;
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "rgba(199, 186, 145, 0.8)";
    context.lineWidth = 7;
    context.beginPath();
    ROUTE.forEach((point, index) => {
      const x = px(point.x);
      const y = py(point.z);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
    context.strokeStyle = "rgba(49, 45, 37, 0.9)";
    context.lineWidth = 3;
    context.stroke();
    context.fillStyle = "#c7e17b";
    context.fillRect(px(-4), py(11), 16, 11);
    context.strokeStyle = "rgba(199, 225, 123, 0.6)";
    context.lineWidth = 1;
    context.strokeRect(px(-4), py(11), 16, 11);
    const viewX = px(this.cameraManager.target.x);
    const viewY = py(this.cameraManager.target.z);
    const viewAngle = this.cameraManager.angle + Math.PI;
    context.beginPath();
    context.moveTo(viewX, viewY);
    context.arc(viewX, viewY, 18, viewAngle - 0.42, viewAngle + 0.42);
    context.closePath();
    context.fillStyle = "rgba(199, 225, 123, 0.12)";
    context.fill();
    context.strokeStyle = "rgba(199, 225, 123, 0.4)";
    context.stroke();
    for (const tower of this.towerManager.items) {
      const x = px(tower.model.position.x);
      const y = py(tower.model.position.z);
      if (tower.type === "radar") {
        context.beginPath();
        context.arc(x, y, tower.range * width / 100, 0, Math.PI * 2);
        context.strokeStyle = "rgba(116, 201, 232, 0.2)";
        context.lineWidth = 1;
        context.stroke();
      }
      context.fillStyle = tower.config.color;
      context.beginPath();
      context.arc(x, y, tower === this.selected ? 4.5 : 3.2, 0, Math.PI * 2);
      context.fill();
      if (tower === this.selected) {
        context.strokeStyle = "#f4f3d9";
        context.lineWidth = 1;
        context.stroke();
      }
    }
    for (const enemy of this.enemies.items) {
      if (!this.enemies.isVisible(enemy)) continue;
      context.fillStyle = enemy.config.boss ? "#ff6558" : enemy.config.air ? "#edc16e" : "#e77661";
      context.beginPath();
      context.arc(px(enemy.model.position.x), py(enemy.model.position.z), enemy.config.boss ? 4 : 2.5, 0, Math.PI * 2);
      context.fill();
    }
    context.strokeStyle = "rgba(214, 225, 209, 0.4)";
    context.lineWidth = 1;
    context.strokeRect(0.5, 0.5, width - 1, height - 1);
  }
  log(message, style = "") {
    const item = document.createElement("div");
    item.className = `log-entry ${style}`;
    const time = Math.floor(this.elapsed);
    item.innerHTML = `<time>${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}</time>${message}`;
    $("comms-log").prepend(item);
    while ($("comms-log").children.length > 10) $("comms-log").lastElementChild.remove();
  }
  notify(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => toast.classList.remove("show"), 1900);
  }
  update(dt) {
    if (this.paused || this.ended || !$("start-screen").classList.contains("hidden")) return;
    this.delta = dt;
    this.elapsed += dt;
    if (this.keys.has("w")) this.cameraManager.move(0, -dt * 22);
    if (this.keys.has("s")) this.cameraManager.move(0, dt * 22);
    if (this.keys.has("a")) this.cameraManager.move(-dt * 22, 0);
    if (this.keys.has("d")) this.cameraManager.move(dt * 22, 0);
    this.economy.update(dt);
    this.enemies.update(dt);
    this.towerManager.update(dt);
    this.waves.update(dt);
    this.mapManager.updateWeather(dt);
    for (const key of Object.keys(this.cooldowns)) this.cooldowns[key] = Math.max(0, this.cooldowns[key] - dt);
    this.shieldTimer = Math.max(0, this.shieldTimer - dt);
    if (this.baseShield) {
      this.baseShield.visible = this.shieldTimer > 0;
      if (this.baseShield.visible) this.baseShield.material.opacity = 0.04 + Math.sin(this.elapsed * 8) * 0.025;
    }
    if (this.elapsed % 0.18 < dt) this.updateHUD();
  }
  updateFpsDisplay() {
    if (!this.fpsDisplay) return;
    this.fpsDisplay.textContent = `FPS ${this.fps || 0}`;
  }
  render() {
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  }
  animate() {
    const dt = Math.min(this.clock.getDelta(), 0.08);
    this.update(dt);
    this.render();
    this.frameCount += 1;
    this.fpsTimer += dt;
    if (this.fpsTimer >= 0.5) {
      this.fps = Math.round(this.frameCount / this.fpsTimer);
      this.updateFpsDisplay();
      this.frameCount = 0;
      this.fpsTimer = 0;
    }
    requestAnimationFrame(() => this.animate());
  }
}

new Game();
