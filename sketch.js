//Env Setup
let pg;
let ivoryMedium, ivoryBold, ivoryItalic, eugenio;
let cnv;
let img;


//Switchers
let useImg = false;
let fillCanvas = false;
let imgWhiteBg = false;

//Preload Text///////////////////////////////////////////////////////////////
function preload() {
  ivoryMedium = loadFont('./Fonts/IvoryDisplayLL-Medium.otf');
  ivoryBold = loadFont('./Fonts/IvoryDisplayTrialTT-Bold.ttf');
  ivoryItalic = loadFont('./Fonts/IvoryDisplayTrialTT-BoldItalic.ttf');
  eugenio = loadFont('./Fonts/EugenioSerifPoster-BlackItalic-Trial.otf');
  img = loadImage('test img.png');
}



//Main Sketch Setup////////////////////////////////////////////////////////////

function setup() {
  cnv = createCanvas(960, int(200), P2D);
  cnv.parent('kinetic-type');
  pg = createGraphics(width, height, P2D);
  frameRate(30);

  
}


function draw() {

  //Global Vars
  let mainAmp = 45;
  let ambAmp = 3;
  let tiles = 150;
  let mouseDist = 120;
  let mainText = document.getElementById("main-text").value;
  let leadingValue = 133;
  let fontSize = 140;
  let fontSelect = document.getElementById("fonts-select").value;
  let alignSelect = document.getElementById("align-select").value;
  let offsetMultiplier = 3;
  let speedMultiplier = 0.1;

  background(255);

  pg.background(255);
  pg.fill(0);

  if (useImg) {

    let scaledWidth = pg.height * (img.width / img.height);
    let scaledHeight = pg.width * (img.height / img.width);
    let xOffset = (pg.width - scaledWidth) / 2;
    let yOffset = (pg.height - scaledHeight) / 2;

    if (fillCanvas) {
      pg.image(img, 0, yOffset, width, width * img.height / img.width);
    } else {
      pg.image(img, xOffset, 0, height * img.width / img.height, height);
    }


  } else {

    let font;
    switch (fontSelect) {
      case 'ivoryMedium': font = ivoryMedium; break;
      case 'ivoryBold': font = ivoryBold; break;
      case 'ivoryItalic': font = ivoryItalic; break;
      case 'eugenio': font = eugenio; break;
      default: font = eugenio; break;
    }

    let align;
    switch (alignSelect) {
      case 'left': align = LEFT; break;
      case 'right': align = RIGHT; break;
      case 'center': align = CENTER; break;
      default: align = CENTER; break;
    }

    let x;
    switch (align) {
      case LEFT:
        x = width / 2 - pg.textWidth(mainText) / 2;
        break;
      case RIGHT:
        x = width / 2 + pg.textWidth(mainText) / 2;
        break;
      case CENTER:
      default:
        x = width / 2;
        break;
    }

    pg.textFont(font);
    pg.textSize(fontSize);
    pg.textAlign(align, CENTER);
    pg.textLeading(leadingValue);
    pg.text(mainText, x, height / 2);
  }

  //Set up tiles
  let tilesX = tiles;
  let tilesY = Math.round((tilesX * height) / width);
  let tileW = (width / tilesX);
  let tileH = (height / tilesY);
  let maxDist = mouseDist + cos(frameCount * speedMultiplier) * (mouseDist / 2);
  let maxAmbDist = mouseDist * 5.5;

  for (let y = 0; y < tilesY; y++) {
    for (let x = 0; x < tilesX; x++) {

      //Define Displacement
      let wave;
      let ambient;

      //Source
      let sx = Math.floor(x * tileW);
      let sy = Math.floor(y * tileH);
      let sw = Math.ceil(tileW);
      let sh = Math.ceil(tileH);

      //Destination
      let dx = sx;
      let dy = sy;
      let dw = sw;
      let dh = sh;

      //Tile Centers
      let cx = sx + tileW / 2;
      let cy = sy + tileH / 2;

      //Mouse Distance
      let distance = dist(pmouseX - 2, pmouseY - 4, cx, cy);
      let ambDist = map(distance, 0, maxAmbDist, 1, 0);

      distance = constrain(distance, 0, maxDist);
      distance = map(distance, 0, maxDist, 1, 0);

      //Assign Displacements

      wave = int(sin(frameCount * speedMultiplier + (x + y) * offsetMultiplier * 0.1) * mainAmp * distance);

      if (useImg && imgWhiteBg === false) {

        ambient = (sin(frameCount * speedMultiplier + floor(x + y) * offsetMultiplier) * ambAmp * distance);

        sx += ambient;

      } else {

        ambient = (sin(frameCount * speedMultiplier * 2 + floor((x + y) / (height / width)) * offsetMultiplier) * ambAmp * ambDist);

        dx += wave;
        sw += ambient;
      }

      // Final Copy //
      copy(pg, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }

  
}