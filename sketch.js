
let mFont;
let s0 = "| WaveDynamics |"
// serial variables
let mSerial;
let connectButton;
let readyToReceive;

// project variables
let waves = [];
let waveCount = [0, 0, 0, 0, 0, 0, 0];

let d2, d3, d4, d5, d6, d7, d8;

let mOsc;
let mLfo;
let mEnv;

let FREQS = {
  d2: 220,
  d3: 247,
  d4: 261,
  d5: 294,
  d6: 329,
  d7: 349,
  d8: 392,
};
function preload(){
  mFont = loadFont("./Graphik-Thin.otf")
}

function createWave(_x, _count, _color) {
  let newWave = {
    x: _x,
    y: height / 2,
    diameter: map(_count % 20, 0, 20, 20, 600),
    // opacity: map(_count % 20, 0, 20, 255, 5),
    strokeColor: _color,
    strokeWidth: 1,
    // map(_count % 20, 0, 20, 20, 1),
    lifetime: 255,
  };
  waves.push(newWave);
}

function receiveSerial() {
  let line = mSerial.readUntil("\n");
  trim(line);
  if (!line) return;

  if (line.charAt(0) != "{") {
    print("error: ", line);
    readyToReceive = true;
    return;
  }

  let data = JSON.parse(line).data;
  d2 = data.D2;
  d3 = data.D3;
  d4 = data.D4;
  d5 = data.D5;
  d6 = data.D6;
  d7 = data.D7;
  d8 = data.D8;
  // print(data);

  if (d2.isPressed) {
    waveCount[0] += 1;
    createWave(width / 9,waveCount[0], color(255));
    let mF = FREQS["d2"];
    mOsc.freq(mF);
    mLfo.freq(mF / 3);
    mEnv.triggerAttack();
  } 
  if (d3.isPressed) {
    waveCount[1] += 1;
    createWave(width / 9 * 2, waveCount[1], color(255, 0, 0));
    let mF = FREQS["d3"];
    mOsc.freq(mF);
    mLfo.freq(mF / 3);
    mEnv.triggerAttack();
  } 
  if (d4.isPressed) {
    waveCount[2] += 1;
    createWave(width / 9 * 3, waveCount[2], color(255, 107, 0));
    let mF = FREQS["d4"];
    mOsc.freq(mF);
    mLfo.freq(mF / 3);
    mEnv.triggerAttack();
  } 
  if (d5.isPressed) {
    waveCount[3] += 1;
    createWave(width / 9 * 4, waveCount[3], color(255, 255, 0));
    let mF = FREQS["d5"];
    mOsc.freq(mF);
    mLfo.freq(mF / 3);
    mEnv.triggerAttack();
  } 
  if (d6.isPressed) {
    waveCount[4] += 1;
    createWave(width / 9 * 5, waveCount[4], color(0, 255, 0));
    let mF = FREQS["d6"];
    mOsc.freq(mF);
    mLfo.freq(mF / 3);
    mEnv.triggerAttack();
  } 
  if (d7.isPressed) {
    waveCount[5] += 1;
    createWave(width / 9 * 6, waveCount[5], color(0, 255, 255));
    let mF = FREQS["d7"];
    mOsc.freq(mF);
    mLfo.freq(mF / 3);
    mEnv.triggerAttack();
  } 
  if (d8.isPressed) {
    waveCount[6] += 1;
    createWave(width / 9 * 7, waveCount[6], color(173, 0, 255));
    let mF = FREQS["d8"];
    mOsc.freq(mF);
    mLfo.freq(mF / 3);
    mEnv.triggerAttack();
  }


  if (!d2.isPressed) {
    waveCount[0] = 0;
  } 
  if (!d3.isPressed) {
    waveCount[1] = 0;
  } 
  if (!d4.isPressed) {
    waveCount[2] = 0;
  }
  if (!d5.isPressed) {
    waveCount[3] = 0;
  }
  if (!d6.isPressed) {
    waveCount[4] = 0;
  }
  if (!d7.isPressed) {
    waveCount[5] = 0;
  }
  if (!d8.isPressed) {
    waveCount[6] = 0;
  }

if(!d2.isPressed && !d3.isPressed && !d4.isPressed && !d5.isPressed && !d6.isPressed && !d7.isPressed && !d8.isPressed){
  mEnv.triggerRelease();
}
  readyToReceive = true;
}



function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(57600);
    readyToReceive = true;
    connectButton.hide();
    userStartAudio();
  }
}

function setup() {
  // setup project
  createCanvas(windowWidth, windowHeight);


  // setup serial
  readyToReceive = false;
  mSerial = createSerial();
  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2, height / 2);
  connectButton.mousePressed(connectToSerial);

  mOsc = new p5.Oscillator("sine");
  mOsc.disconnect();
  mOsc.freq(0);
  mOsc.amp(0.0);

  mLfo = new p5.Oscillator("sine");
  mLfo.disconnect();
  mLfo.freq(0);
  mLfo.amp(60);
  mLfo.start();

  mEnv = new p5.Envelope();
  mEnv.setADSR(0.05, 0.1, 0.8, 0.5);

  mOsc.connect(p5.SoundOut);
  mOsc.freq(mLfo);
  mOsc.amp(mEnv);
  mOsc.start();
}

function draw() {
  // project logic
  background(0);

  textFont(mFont);

  textSize(80);
  textAlign(CENTER);
  text(s0, width / 2, 80);

  fill(255)

  drawwave();


  // update serial: request new data
  if (mSerial.opened() && readyToReceive) {
    readyToReceive = false;
    mSerial.clear();
    mSerial.write(0xab);
  }

  // update serial: read new data
  if (mSerial.availableBytes() > 8) {
    receiveSerial();
  }

}

function drawwave() {
  for (let i = waves.length - 1; i >= 0; i--) {
    let wave = waves[i];
    noFill();
    stroke(wave.strokeColor, wave.lifetime);
    strokeWeight(wave.strokeWidth);
    ellipse(wave.x, wave.y, wave.diameter, wave.diameter);

    wave.lifetime -= 5;
    if (wave.lifetime <= 0) {
      waves.splice(i, 1);
    }
  }
}

