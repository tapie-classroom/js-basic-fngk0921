const arrySzie = 4;
const tileSize = 100;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let tiles = [];

function getColor(value) {
  switch (value) {
    case 2: return "#eee4da";
    case 4: return "#ede0c8";
    case 8: return "#f2b179";
    case 16: return "#f59563";
    case 32: return "#f67c5f";
    case 64: return "#f65e3b";
    case 128: return "#edcf72";
    case 256: return "#edcc61";
    case 512: return "#edc850";
    case 1024: return "#edc53f";
    case 2048: return "#edc22e";
    default: return "#3c3a32";
  }
}

class Tile {
  constructor(value, x, y) {
    // x, y는 x,y 좌표
    // 최대값은 3, 3 -> 4x4기에 좌표는 0~3까지
    this.value = value;
    this.x = x;
    this.px = x;
    this.y = y;
    this.py = y;
    this.merged = false;
    this.active = true;
  }
  draw() {
    const dx = this.px * tileSize // 0~3으로 왔기에 크기에 맞춰 좌표 계산
    const dy = this.py * tileSize
    ctx.fillStyle = getColor(this.value);
    ctx.fillRect(dx + 5, dy + 5, tileSize - 10, tileSize - 10); // 붙으면 안이쁘니깐 마진 10px
    ctx.fillText(`${this.value}`, dx + tileSize/2, dy + tileSize/2); // 텍스트 배치

    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center"; // 텍스트 중앙 정렬
    ctx.textBaseline = "middle";
    
  }
  update() {
    this.px += (this.x - this.px) * 0.3;
    this.py += (this.y - this.py) * 0.3;
  }
}

const t = new Tile(256, 1, 1);
t.draw();