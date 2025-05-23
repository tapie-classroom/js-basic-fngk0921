const arrySzie = 4;
const tileSize = 100;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let tiles = []; // 타일 저장

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

function addRandomTile() {
  let setTileArry = {}; // 타일이 있는 좌표를 저장
  let emptysTile = []; // 비어있는 타일 좌표를 저장

  tiles.forEach(t => { 
    if (t.active) setTileArry[`${t.x},${t.y}`] = true; 
  });
  
  // 4x4 배열 다돌면서 위에 있던 setTileArry에 없으면 비어있는 타일로 간주
  for (let i = 0; i < 4; i++) { 
    for (let j = 0; j < 4; j++) {
      if (!setTileArry[`${i},${j}`]) emptysTile.push([i, j]);
    }
  }

  if (emptysTile.length > 0) { // 비어있는 타일이 있으면
    const randomIndex = Math.floor(Math.random() * emptysTile.length); // 빈칸 리스트의 랜덤 인덱스 가져오기
    const [x, y] = emptysTile[randomIndex]; // 빈칸 리스트의 랜덤 인덱스의 좌표 가져오기
    const value = Math.random() < 0.9 ? 2 : 4; // 2랑 4 중 9:1 확률로 나오기
    
    tiles.push(new Tile(value, x, y)); // 타일 생성
  }
}

document.addEventListener('keydown', e => {
  const keydir = { // 방향키에 맞는 좌표 이동 방향
    ArrowUp:[0,-1],
    ArrowDown:[0,1],
    ArrowLeft:[-1,0],
    ArrowRight:[1,0]
  }[e.key]; // 방향키에 따라 이동
  if (!keydir) return; // 방향키가 아니면 리턴
  if (move(keydir[0], keydir[1])) // 입력한 방향키의 방향 x, y 전달
    setTimeout(addRandomTile, 200); // 0.2초 후에 랜덤 타일 생성 (애니매이션 기다리기)
})

function move(dx, dy) {
  let moved = false; // 이동 여부 (마지막에 리턴)
  tiles.forEach(t => t.merged = false); // 타일 합쳐진 여부 리셋

  // 이동 순서: 방향에 따라 정렬
  tiles.sort((a, b) => (b.y-a.y)*dy + (b.x-a.x)*dx); // 방향에 따라 정렬
  // 화살표키 누른 방향 쪽부터 처리 해야하기에 누른 방향(dx, dy)에 값 부호따라 우선순위 판단


  for (let t of tiles) { // 타일을 하나씩 돌면서
    if (!t.active) continue; // 비활성화된 타일은 건너뜀
    // nx, ny -> 현재 좌표 (0~3)
    let nx = t.x
    let ny = t.y
    while (true) { // 계속하여 화살표 키 누른 방향으로 이동
      let tx = nx + dx
      let ty = ny + dy
      // tx, ty -> 이동할 좌표 (0~3)

      if (tx<0 || tx>=arrySzie || ty<0 || ty>=arrySzie) break; // 좌표 범위가 넘어가면 와일 종료

      let otherTile = tiles.find(u => u.x==tx && u.y==ty && u.active); // 이동할 좌표에 타일 체크
      
      if (!otherTile) { // 이동할 좌표에 타일 없음
        nx=tx // 타일 좌표 변경
        ny=ty
        moved=true // 이동했으니 true
      }
      else if (otherTile.value==t.value && !otherTile.merged) { // 타일이 있는데 값이 같고 합쳐지지 않았으면
        otherTile.value *= 2 // 자리에 있던 타일 2배하기
        otherTile.merged = true // 타일 합쳐짐 처리 (추가 타일 병합 방지)
        t.active = false // 이동한 타일은 비활성화 (삭제)
        moved = true // 이동했으니 true
        nx=tx // 타일 좌표 변경
        ny=ty
        break
      } else {
        break
      }
    }
    t.x = nx // while 안에서 계산한 좌표로 변경
    t.y = ny
  }
  return moved // 이동 여부 리턴
}


function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 싹날림
  tiles.forEach(t => {
    t.update()
    if (t.active) t.draw()
  }); // 활성화 된 얘들 그림
  requestAnimationFrame(loop); // 애니매이션 프레임 요청 (계속 반복)
}

function init() { // 맨처음 시작
  tiles = [];
  addRandomTile() // 처음에 2개 생성하고 시작
  addRandomTile() 
  loop();
}
init();