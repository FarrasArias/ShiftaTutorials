// ============================================================
// WEEK 06: SOUND AS MATERIAL:  ALL P5.JS CODE SNIPPETS
// ============================================================
// Each sketch is a complete, standalone p5.js sketch.
// Copy each one into the p5.js web editor to use it.
// Remember to add the p5.sound library to index.html:
//   <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/addons/p5.sound.min.js"></script>
// ============================================================


// ============================================================
// SKETCH 01:  Basic Oscillator
// Tutorial: Sound Synthesis
// ============================================================

let osc;
let isPlaying = false;

function setup() {
  createCanvas(400, 300);
  osc = new p5.Oscillator('sine');
  osc.freq(440);
  osc.amp(0);
  textAlign(CENTER, CENTER);
  textSize(18);
}

function draw() {
  background(15);
  fill(isPlaying ? '#FF4D1C' : '#555');
  text(isPlaying ? 'click to stop' : 'click to start', width / 2, height / 2);
}

function mousePressed() {
  if (!isPlaying) {
    osc.start();
    osc.amp(0.3, 0.1);
    isPlaying = true;
  } else {
    osc.amp(0, 0.3);
    isPlaying = false;
  }
}


// ============================================================
// SKETCH 02:  Mouse-Controlled Oscillator
// Tutorial: Sound Synthesis
// ============================================================

let osc;

function setup() {
  createCanvas(400, 300);
  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.start();
  textAlign(CENTER);
  textSize(14);
}

function draw() {
  background(15);

  let minFreq = 100;
  let maxFreq = 2000;
  let freq = minFreq * pow(maxFreq / minFreq, mouseX / width);
  let amp = map(mouseY, 0, height, 0.5, 0);
  amp = constrain(amp, 0, 0.5);

  osc.freq(freq, 0.05);
  osc.amp(amp, 0.05);

  fill('#C5F74F');
  noStroke();
  let d = map(amp, 0, 0.5, 5, 150);
  circle(mouseX, mouseY, d);

  fill('#888');
  text(nf(freq, 1, 1) + ' Hz', width / 2, height - 20);
}

function mousePressed() {
  osc.start();
}


// ============================================================
// SKETCH 03:  Two Oscillators (Beating)
// Tutorial: Sound Synthesis
// ============================================================

let osc1, osc2;

function setup() {
  createCanvas(400, 300);
  osc1 = new p5.Oscillator('sine');
  osc2 = new p5.Oscillator('sine');
  osc1.amp(0);
  osc2.amp(0);
  osc1.freq(440);
  osc2.freq(443);
  textAlign(CENTER, CENTER);
  textSize(16);
}

function draw() {
  background(15);
  fill('#f0ece4');
  text('click to hear beating\n440 Hz + 443 Hz', width / 2, height / 2);
}

function mousePressed() {
  osc1.start();
  osc2.start();
  osc1.amp(0.2, 0.1);
  osc2.amp(0.2, 0.1);
}

function mouseReleased() {
  osc1.amp(0, 0.3);
  osc2.amp(0, 0.3);
}


// ============================================================
// SKETCH 04:  ADSR Envelope Demo
// Tutorial: Envelopes & Timbre
// ============================================================

let osc, env;

function setup() {
  createCanvas(400, 300);
  osc = new p5.Oscillator('triangle');
  osc.amp(0);
  osc.start();

  env = new p5.Envelope();
  env.setADSR(0.05, 0.2, 0.3, 0.4);
  env.setRange(0.5, 0);

  textAlign(CENTER, CENTER);
  textSize(16);
}

function draw() {
  background(15);
  fill('#f0ece4');
  text('click to trigger a note', width / 2, height / 2);
}

function mousePressed() {
  osc.freq(random([220, 330, 440, 550, 660]));
  env.play(osc);
}


// ============================================================
// SKETCH 05:  Comparing Envelope Shapes
// Tutorial: Envelopes & Timbre
// ============================================================

let osc, env;
let envelopes = {
  'pluck':   [0.001, 0.15, 0.0, 0.1],
  'pad':     [0.8,   0.3,  0.6, 1.0],
  'bell':    [0.001, 2.0,  0.0, 0.5],
  'swell':   [1.5,   0.1,  0.8, 0.3]
};
let currentType = 'pluck';

function setup() {
  createCanvas(400, 300);
  osc = new p5.Oscillator('triangle');
  osc.amp(0);
  osc.start();

  env = new p5.Envelope();
  env.setRange(0.4, 0);
  setEnvelope(currentType);

  textAlign(CENTER, CENTER);
  textSize(14);
}

function setEnvelope(type) {
  let e = envelopes[type];
  env.setADSR(e[0], e[1], e[2], e[3]);
  currentType = type;
}

function draw() {
  background(15);
  fill('#f0ece4');
  text('press 1-4 to change envelope, click to play', width / 2, 30);
  fill('#FF4D1C');
  text('current: ' + currentType, width / 2, height / 2);

  let labels = ['1: pluck', '2: pad', '3: bell', '4: swell'];
  fill('#888');
  for (let i = 0; i < labels.length; i++) {
    text(labels[i], width / 2, height - 80 + i * 20);
  }
}

function mousePressed() {
  osc.freq(330);
  env.play(osc);
}

function keyPressed() {
  if (key === '1') setEnvelope('pluck');
  if (key === '2') setEnvelope('pad');
  if (key === '3') setEnvelope('bell');
  if (key === '4') setEnvelope('swell');
}


// ============================================================
// SKETCH 06:  Additive Synthesis
// Tutorial: Envelopes & Timbre
// ============================================================

let oscillators = [];
let amplitudes = [0.35, 0.25, 0.15, 0.1, 0.06, 0.04];
let baseFreq = 220;
let env;
let playing = false;

function setup() {
  createCanvas(400, 300);

  for (let i = 0; i < amplitudes.length; i++) {
    let o = new p5.Oscillator('sine');
    o.freq(baseFreq * (i + 1));
    o.amp(0);
    o.start();
    oscillators.push(o);
  }

  env = new p5.Envelope();
  env.setADSR(0.01, 0.3, 0.4, 0.5);
  env.setRange(1.0, 0);

  textAlign(CENTER, CENTER);
  textSize(14);
}

function draw() {
  background(15);

  fill('#f0ece4');
  text('click to play:  6 harmonics stacked', width / 2, 20);

  for (let i = 0; i < amplitudes.length; i++) {
    let x = map(i, 0, amplitudes.length - 1, 60, width - 60);
    let h = amplitudes[i] * 400;
    noStroke();
    fill('#FF4D1C');
    rect(x - 15, height - 40 - h, 30, h);
    fill('#888');
    text('h' + (i + 1), x, height - 20);
  }
}

function mousePressed() {
  for (let i = 0; i < oscillators.length; i++) {
    oscillators[i].amp(amplitudes[i], 0.01);
  }
  env.play(oscillators[0]);

  setTimeout(function () {
    for (let i = 0; i < oscillators.length; i++) {
      oscillators[i].amp(0, 0.5);
    }
  }, 1500);
}


// ============================================================
// SKETCH 07:  Layered Oscillators with Different Envelopes
// Tutorial: Envelopes & Timbre
// ============================================================

let oscLow, oscHigh, envLow, envHigh;

function setup() {
  createCanvas(400, 300);

  oscLow = new p5.Oscillator('sine');
  oscHigh = new p5.Oscillator('sawtooth');
  oscLow.amp(0);
  oscHigh.amp(0);
  oscLow.start();
  oscHigh.start();

  envLow = new p5.Envelope();
  envLow.setADSR(0.3, 0.2, 0.5, 0.8);
  envLow.setRange(0.3, 0);

  envHigh = new p5.Envelope();
  envHigh.setADSR(0.005, 0.1, 0.0, 0.05);
  envHigh.setRange(0.15, 0);

  textAlign(CENTER, CENTER);
  textSize(14);
}

function draw() {
  background(15);
  fill('#f0ece4');
  text('click: percussive high + sustained low', width / 2, height / 2);
}

function mousePressed() {
  let f = random([110, 165, 220, 275, 330]);
  oscLow.freq(f);
  oscHigh.freq(f * 3);
  envLow.play(oscLow);
  envHigh.play(oscHigh);
}


// ============================================================
// SKETCH 08:  Just Intonation Scale Player
// Tutorial: Scales & Frequency
// ============================================================

let osc, env;
let baseFreq = 220;
let justRatios = [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2];

function setup() {
  createCanvas(400, 300);
  osc = new p5.Oscillator('triangle');
  osc.amp(0);
  osc.start();

  env = new p5.Envelope();
  env.setADSR(0.01, 0.2, 0.3, 0.3);
  env.setRange(0.4, 0);

  textAlign(CENTER, CENTER);
  textSize(14);
}

function draw() {
  background(15);
  fill('#f0ece4');
  text('Just Intonation Major Scale', width / 2, 20);
  text('press keys 1-8 to play scale degrees', width / 2, height - 20);

  for (let i = 0; i < justRatios.length; i++) {
    let x = map(i, 0, justRatios.length - 1, 50, width - 50);
    let freq = baseFreq * justRatios[i];
    fill(i === 0 || i === 7 ? '#FF4D1C' : '#C5F74F');
    rect(x - 15, 80, 30, 150, 4);
    fill('#888');
    text(nf(freq, 1, 1), x, 260);
  }
}

function keyPressed() {
  let index = int(key) - 1;
  if (index >= 0 && index < justRatios.length) {
    osc.freq(baseFreq * justRatios[index]);
    env.play(osc);
  }
}


// ============================================================
// SKETCH 09:  12-TET Chromatic Scale
// Tutorial: Scales & Frequency
// ============================================================

let osc, env;
let baseFreq = 261.63;
let noteNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

function setup() {
  createCanvas(500, 300);
  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.start();

  env = new p5.Envelope();
  env.setADSR(0.01, 0.15, 0.2, 0.3);
  env.setRange(0.35, 0);

  textAlign(CENTER, CENTER);
  textSize(12);
}

function draw() {
  background(15);
  fill('#f0ece4');
  text('12-TET Chromatic Scale:  click a key', width / 2, 20);

  for (let i = 0; i < 12; i++) {
    let x = map(i, 0, 11, 40, width - 40);
    let isBlack = [1, 3, 6, 8, 10].includes(i);

    fill(isBlack ? '#333' : '#f0ece4');
    rect(x - 16, 50, 32, 160, 4);

    fill(isBlack ? '#aaa' : '#333');
    text(noteNames[i], x, 230);

    let freq = baseFreq * pow(2, i / 12);
    fill('#888');
    text(nf(freq, 1, 1), x, 250);
  }
}

function mousePressed() {
  for (let i = 0; i < 12; i++) {
    let x = map(i, 0, 11, 40, width - 40);
    if (abs(mouseX - x) < 16 && mouseY > 50 && mouseY < 210) {
      let freq = baseFreq * pow(2, i / 12);
      osc.freq(freq);
      env.play(osc);
      break;
    }
  }
}


// ============================================================
// SKETCH 10:  N-TET Explorer
// Tutorial: Scales & Frequency
// ============================================================

let osc, env;
let baseFreq = 220;
let N = 19;
let scaleSteps = [0, 3, 6, 8, 11, 14, 17, 19];

function setup() {
  createCanvas(500, 350);
  osc = new p5.Oscillator('triangle');
  osc.amp(0);
  osc.start();

  env = new p5.Envelope();
  env.setADSR(0.01, 0.2, 0.3, 0.3);
  env.setRange(0.35, 0);

  textAlign(CENTER, CENTER);
  textSize(12);
}

function draw() {
  background(15);
  fill('#f0ece4');
  text(N + '-TET Scale:  click a bar to play', width / 2, 20);
  text('press UP/DOWN to change N (divisions of octave)', width / 2, height - 15);

  for (let i = 0; i < scaleSteps.length; i++) {
    let x = map(i, 0, scaleSteps.length - 1, 50, width - 50);
    let freq = baseFreq * pow(2, scaleSteps[i] / N);
    let ratio = pow(2, scaleSteps[i] / N);
    let barH = map(freq, baseFreq, baseFreq * 2, 40, 200);

    fill('#FF4D1C');
    rect(x - 18, height - 50 - barH, 36, barH, 3);

    fill('#C5F74F');
    text('step ' + scaleSteps[i], x, height - 50 - barH - 15);

    fill('#888');
    text(nf(freq, 1, 1) + ' Hz', x, height - 38);
  }

  fill('#4FC5F7');
  text('N = ' + N, width / 2, 45);
}

function mousePressed() {
  for (let i = 0; i < scaleSteps.length; i++) {
    let x = map(i, 0, scaleSteps.length - 1, 50, width - 50);
    if (abs(mouseX - x) < 20) {
      let freq = baseFreq * pow(2, scaleSteps[i] / N);
      osc.freq(freq);
      env.play(osc);
      break;
    }
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    N = min(N + 1, 53);
    updateScale();
  }
  if (keyCode === DOWN_ARROW) {
    N = max(N - 1, 5);
    updateScale();
  }
}

function updateScale() {
  scaleSteps = [];
  let numNotes = 8;
  for (let i = 0; i < numNotes; i++) {
    scaleSteps.push(round(i * N / (numNotes - 1)));
  }
}


// ============================================================
// SKETCH 11:  Waveform Visualization
// Tutorial: Spectral Analysis
// ============================================================

let osc, fft;

function setup() {
  createCanvas(500, 300);
  osc = new p5.Oscillator('sawtooth');
  osc.freq(220);
  osc.amp(0);

  fft = new p5.FFT();

  textAlign(CENTER);
  textSize(14);
}

function draw() {
  background(15);

  let wave = fft.waveform();

  noFill();
  stroke(79, 197, 247);
  strokeWeight(1.5);
  beginShape();
  for (let i = 0; i < wave.length; i++) {
    let x = map(i, 0, wave.length, 0, width);
    let y = map(wave[i], -1, 1, height * 0.8, height * 0.2);
    vertex(x, y);
  }
  endShape();

  noStroke();
  fill('#888');
  text('click and hold to play:  move mouse for pitch', width / 2, height - 15);
}

function mousePressed() {
  osc.start();
  osc.amp(0.3, 0.05);
}

function mouseMoved() {
  if (mouseIsPressed) {
    let freq = map(mouseX, 0, width, 80, 800);
    osc.freq(freq);
  }
}

function mouseReleased() {
  osc.amp(0, 0.2);
}


// ============================================================
// SKETCH 12:  Spectrum Visualization
// Tutorial: Spectral Analysis
// ============================================================

let osc, fft;

function setup() {
  createCanvas(500, 300);
  colorMode(HSB, 360, 100, 100);
  osc = new p5.Oscillator('sawtooth');
  osc.freq(220);
  osc.amp(0);

  fft = new p5.FFT(0.8, 256);
  textAlign(CENTER);
  textSize(12);
}

function draw() {
  background(0, 0, 6);

  let spectrum = fft.analyze();
  let barW = width / spectrum.length;

  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let x = i * barW;
    let h = map(spectrum[i], 0, 255, 0, height - 40);
    let hue = map(i, 0, spectrum.length, 0, 260);
    fill(hue, 80, 80);
    rect(x, height - 30 - h, barW - 1, h);
  }

  fill(0, 0, 50);
  text('← bass                    treble →', width / 2, height - 10);
  text('click to play sawtooth at 220 Hz', width / 2, 20);
}

function mousePressed() {
  osc.start();
  osc.amp(0.3, 0.05);
}

function mouseReleased() {
  osc.amp(0, 0.2);
}


// ============================================================
// SKETCH 13:  Frequency Band Visualizer
// Tutorial: Spectral Analysis
// ============================================================

let osc, fft;
let waveTypes = ['sine', 'triangle', 'sawtooth', 'square'];
let currentWave = 0;

function setup() {
  createCanvas(500, 300);
  osc = new p5.Oscillator(waveTypes[currentWave]);
  osc.freq(150);
  osc.amp(0);
  fft = new p5.FFT(0.85);
  textAlign(CENTER, CENTER);
  textSize(12);
}

function draw() {
  background(15);
  fft.analyze();

  let bands = [
    { name: 'bass',    val: fft.getEnergy('bass'),    col: '#FF4D1C' },
    { name: 'lowMid',  val: fft.getEnergy('lowMid'),  col: '#FF8C42' },
    { name: 'mid',     val: fft.getEnergy('mid'),     col: '#C5F74F' },
    { name: 'highMid', val: fft.getEnergy('highMid'), col: '#4FC5F7' },
    { name: 'treble',  val: fft.getEnergy('treble'),  col: '#A77BCA' }
  ];

  let barW = width / bands.length - 20;
  for (let i = 0; i < bands.length; i++) {
    let x = map(i, 0, bands.length, 15, width - barW);
    let h = map(bands[i].val, 0, 255, 0, height - 80);

    noStroke();
    fill(bands[i].col);
    rect(x, height - 40 - h, barW, h, 4);

    fill('#888');
    text(bands[i].name, x + barW / 2, height - 20);
    text(bands[i].val, x + barW / 2, height - 50 - h);
  }

  fill('#f0ece4');
  text('wave: ' + waveTypes[currentWave] + ' | click=play | 1-4=wave type', width / 2, 15);
}

function mousePressed() {
  osc.start();
  osc.amp(0.3, 0.05);
}

function mouseReleased() {
  osc.amp(0, 0.2);
}

function keyPressed() {
  let idx = int(key) - 1;
  if (idx >= 0 && idx < waveTypes.length) {
    currentWave = idx;
    osc.setType(waveTypes[currentWave]);
  }
}


// ============================================================
// SKETCH 14:  Combined Waveform + Spectrum
// Tutorial: Spectral Analysis
// ============================================================

let osc, fft;

function setup() {
  createCanvas(500, 400);
  osc = new p5.Oscillator('sawtooth');
  osc.freq(220);
  osc.amp(0);
  fft = new p5.FFT(0.8, 512);
  textAlign(CENTER);
  textSize(12);
}

function draw() {
  background(15);
  let wave = fft.waveform();
  let spectrum = fft.analyze();

  // Top half: waveform
  noFill();
  stroke(79, 197, 247);
  strokeWeight(1.2);
  beginShape();
  for (let i = 0; i < wave.length; i++) {
    let x = map(i, 0, wave.length, 0, width);
    let y = map(wave[i], -1, 1, height * 0.45, 10);
    vertex(x, y);
  }
  endShape();

  // Bottom half: spectrum
  noStroke();
  let barW = width / spectrum.length;
  for (let i = 0; i < spectrum.length; i++) {
    let h = map(spectrum[i], 0, 255, 0, height * 0.4);
    fill(255, 77, 28, spectrum[i] + 50);
    rect(i * barW, height - 30 - h, barW, h);
  }

  // Labels
  noStroke();
  fill('#555');
  text('waveform (time domain)', width / 2, height * 0.5);
  text('spectrum (frequency domain)', width / 2, height - 15);
  text('click to play', width / 2, height * 0.53);
}

function mousePressed() {
  osc.start();
  osc.amp(0.3, 0.05);
}

function mouseReleased() {
  osc.amp(0, 0.2);
}


// ============================================================
// SKETCH 15:  Filter Sweep
// Tutorial: Filters & Effects
// ============================================================

let osc, filt, fft;

function setup() {
  createCanvas(500, 300);
  osc = new p5.Oscillator('sawtooth');
  osc.freq(110);
  osc.amp(0);

  filt = new p5.Filter('lowpass');

  osc.disconnect();
  osc.connect(filt);

  fft = new p5.FFT(0.8, 256);

  textAlign(CENTER);
  textSize(12);
}

function draw() {
  background(15);

  let cutoff = map(mouseX, 0, width, 80, 10000);
  let res = map(mouseY, 0, height, 30, 0.5);
  filt.freq(cutoff);
  filt.res(res);

  let spectrum = fft.analyze();
  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = map(spectrum[i], 0, 255, 0, height - 60);
    fill(255, 77, 28, spectrum[i] + 30);
    rect(x, height - 40 - h, width / spectrum.length, h);
  }

  fill('#C5F74F');
  noStroke();
  text('cutoff: ' + nf(cutoff, 1, 0) + ' Hz', width / 2, 20);
  text('resonance: ' + nf(res, 1, 1), width / 2, 38);
  text('mouseX → cutoff | mouseY → resonance | click to play', width / 2, height - 15);
}

function mousePressed() {
  osc.start();
  osc.amp(0.4, 0.1);
}

function mouseReleased() {
  osc.amp(0, 0.3);
}


// ============================================================
// SKETCH 16:  Delay Effect
// Tutorial: Filters & Effects
// ============================================================

let osc, env, delay, fft;

function setup() {
  createCanvas(500, 300);
  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.start();

  env = new p5.Envelope();
  env.setADSR(0.001, 0.1, 0.0, 0.1);
  env.setRange(0.4, 0);

  delay = new p5.Delay();
  delay.process(osc, 0.35, 0.5, 3000);

  fft = new p5.FFT(0.9);

  textAlign(CENTER);
  textSize(13);
}

function draw() {
  background(15, 15, 15, 40);

  let wave = fft.waveform();
  noFill();
  stroke(197, 247, 79, 180);
  strokeWeight(1.5);
  beginShape();
  for (let i = 0; i < wave.length; i++) {
    let x = map(i, 0, wave.length, 0, width);
    let y = map(wave[i], -1, 1, height * 0.8, height * 0.2);
    vertex(x, y);
  }
  endShape();

  noStroke();
  fill('#888');
  text('click to trigger notes:  listen to the echoes', width / 2, height - 15);
}

function mousePressed() {
  let freq = map(mouseX, 0, width, 200, 900);
  osc.freq(freq);
  env.play(osc);
}


// ============================================================
// SKETCH 17:  Reverb Effect
// Tutorial: Filters & Effects
// ============================================================

let osc, env, reverb;

function setup() {
  createCanvas(400, 300);
  osc = new p5.Oscillator('triangle');
  osc.amp(0);
  osc.start();

  env = new p5.Envelope();
  env.setADSR(0.001, 0.15, 0.0, 0.1);
  env.setRange(0.3, 0);

  reverb = new p5.Reverb();
  reverb.process(osc, 3, 2);

  textAlign(CENTER, CENTER);
  textSize(14);
}

function draw() {
  background(15);
  fill('#f0ece4');
  text('click to play notes with reverb', width / 2, height / 2);
  fill('#888');
  text('reverb time: 3s | decay rate: 2', width / 2, height / 2 + 25);
}

function mousePressed() {
  let notes = [220, 277.18, 329.63, 369.99, 440];
  osc.freq(random(notes));
  env.play(osc);
}


// ============================================================
// SKETCH 18:  Mic Amplitude Reactive
// Tutorial: Microphone & Reactivity
// ============================================================

let mic, amp;

function setup() {
  createCanvas(400, 400);
  mic = new p5.AudioIn();
  mic.start();
  amp = new p5.Amplitude();
  amp.setInput(mic);
  noStroke();
}

function draw() {
  background(15, 15, 15, 30);

  let level = amp.getLevel();
  let d = map(level, 0, 0.5, 10, width * 0.9);
  let r = map(level, 0, 0.3, 30, 255);
  let g = map(level, 0, 0.3, 30, 77);
  let b = map(level, 0, 0.3, 30, 28);

  fill(r, g, b, 200);
  circle(width / 2, height / 2, d);
}


// ============================================================
// SKETCH 19:  Mic FFT Spectrum
// Tutorial: Microphone & Reactivity
// ============================================================

let mic, fft;

function setup() {
  createCanvas(500, 350);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.85, 256);
  fft.setInput(mic);
  colorMode(HSB, 360, 100, 100);
}

function draw() {
  background(0, 0, 6);
  let spectrum = fft.analyze();

  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = map(spectrum[i], 0, 255, 0, height - 20);
    let hue = map(i, 0, spectrum.length, 0, 300);
    noStroke();
    fill(hue, 80, map(spectrum[i], 0, 255, 20, 100));
    rect(x, height - 10 - h, width / spectrum.length + 1, h);
  }

  noStroke();
  fill(0, 0, 50);
  textAlign(CENTER);
  textSize(12);
  text('live microphone spectrum:  speak, clap, whistle', width / 2, 20);
}


// ============================================================
// SKETCH 20:  Multi-Band Reactive Visuals
// Tutorial: Microphone & Reactivity
// ============================================================

let mic, fft;

function setup() {
  createCanvas(500, 400);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(0.85);
  fft.setInput(mic);
  noStroke();
}

function draw() {
  background(15, 15, 15, 25);
  fft.analyze();

  let bass = fft.getEnergy('bass');
  let mid = fft.getEnergy('mid');
  let treble = fft.getEnergy('treble');

  // Bass → big circle in center
  let bassSize = map(bass, 0, 255, 20, 300);
  fill(255, 77, 28, map(bass, 0, 255, 20, 200));
  circle(width / 2, height / 2, bassSize);

  // Mid → ring of smaller circles
  let midR = map(mid, 0, 255, 50, 180);
  let numDots = floor(map(mid, 0, 255, 4, 20));
  fill(197, 247, 79, map(mid, 0, 255, 20, 200));
  for (let i = 0; i < numDots; i++) {
    let angle = (TWO_PI / numDots) * i + frameCount * 0.01;
    let x = width / 2 + cos(angle) * midR;
    let y = height / 2 + sin(angle) * midR;
    circle(x, y, 12);
  }

  // Treble → small sparkles
  fill(79, 197, 247, map(treble, 0, 255, 0, 200));
  let numSparkles = floor(map(treble, 0, 255, 0, 30));
  for (let i = 0; i < numSparkles; i++) {
    let x = random(width);
    let y = random(height);
    circle(x, y, random(2, 6));
  }
}


// ============================================================
// SKETCH 21:  Random Melody Generator
// Tutorial: Generative Music
// ============================================================

let osc, env;
let baseFreq = 220;
let pentatonic = [0, 2, 4, 7, 9, 12, 14, 16];
let nextNoteTime = 0;
let started = false;
let lastFreq = 0;

function setup() {
  createCanvas(400, 300);
  osc = new p5.Oscillator('triangle');
  osc.amp(0);
  osc.start();

  env = new p5.Envelope();
  env.setADSR(0.01, 0.2, 0.15, 0.3);
  env.setRange(0.3, 0);

  textAlign(CENTER, CENTER);
  textSize(14);
}

function draw() {
  background(15, 15, 15, 30);

  if (started && millis() > nextNoteTime) {
    let step = random(pentatonic);
    lastFreq = baseFreq * pow(2, step / 12);
    osc.freq(lastFreq);
    env.play(osc);
    nextNoteTime = millis() + random(150, 600);
  }

  if (lastFreq > 0) {
    let level = osc.amp().value;
    let d = map(level, 0, 0.3, 5, 150);
    noStroke();
    fill(255, 77, 28, map(level, 0, 0.3, 0, 220));
    circle(width / 2, height / 2, d);

    fill('#888');
    text(nf(lastFreq, 1, 1) + ' Hz', width / 2, height - 20);
  }

  if (!started) {
    fill('#f0ece4');
    text('click to start', width / 2, height / 2);
  }
}

function mousePressed() {
  if (!started) {
    started = true;
    nextNoteTime = millis();
  }
}


// ============================================================
// SKETCH 22:  19-TET Step Sequencer
// Tutorial: Generative Music
// ============================================================

let osc, env;
let baseFreq = 220;
let N = 19;
let scaleSteps = [0, 3, 6, 8, 11, 14, 17];
let sequence = [];
let seqLength = 16;
let currentStep = 0;
let stepInterval = 200;
let nextStepTime = 0;
let started = false;

function setup() {
  createCanvas(500, 300);

  osc = new p5.Oscillator('sine');
  osc.amp(0);
  osc.start();

  env = new p5.Envelope();
  env.setADSR(0.005, 0.12, 0.1, 0.15);
  env.setRange(0.35, 0);

  generateSequence();

  textAlign(CENTER, CENTER);
  textSize(11);
}

function generateSequence() {
  sequence = [];
  for (let i = 0; i < seqLength; i++) {
    if (random() < 0.25) {
      sequence.push(-1);
    } else {
      let step = random(scaleSteps);
      let octave = floor(random(0, 2));
      sequence.push(step + octave * N);
    }
  }
}

function draw() {
  background(15);

  if (started && millis() > nextStepTime) {
    let note = sequence[currentStep];
    if (note >= 0) {
      let freq = baseFreq * pow(2, note / N);
      osc.freq(freq);
      env.play(osc);
    }
    currentStep = (currentStep + 1) % seqLength;
    nextStepTime = millis() + stepInterval;
  }

  let boxW = (width - 40) / seqLength;
  for (let i = 0; i < seqLength; i++) {
    let x = 20 + i * boxW;
    let isActive = (i === currentStep && started);

    if (sequence[i] < 0) {
      fill(isActive ? '#555' : '#222');
    } else {
      let brightness = map(sequence[i], 0, N * 2, 50, 255);
      fill(isActive ? '#FF4D1C' : color(197, 247, 79, brightness));
    }
    rect(x, 80, boxW - 2, 140, 3);

    if (sequence[i] >= 0) {
      fill('#000');
      text(sequence[i], x + boxW / 2 - 1, 150);
    }
  }

  fill('#f0ece4');
  text(started ? '19-TET sequencer running | press R to regenerate'
               : 'click to start | 19-TET step sequencer', width / 2, 40);
  fill('#888');
  text('step ' + currentStep + ' / ' + seqLength, width / 2, height - 20);
}

function mousePressed() {
  if (!started) {
    started = true;
    nextStepTime = millis();
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    generateSequence();
  }
}


// ============================================================
// SKETCH 23:  Ambient Generator (Full System)
// Tutorial: Generative Music
// ============================================================

let osc1, osc2, env1, env2;
let delay, reverb, fft;
let baseFreq = 220;
let N = 19;
let scaleSteps = [0, 3, 6, 8, 11, 14, 17, 19];
let nextNoteTime = 0;
let started = false;
let notes = [];

function setup() {
  createCanvas(500, 400);
  colorMode(HSB, 360, 100, 100, 100);

  osc1 = new p5.Oscillator('sine');
  osc2 = new p5.Oscillator('triangle');
  osc1.amp(0);
  osc2.amp(0);
  osc1.start();
  osc2.start();

  env1 = new p5.Envelope();
  env1.setADSR(0.05, 0.3, 0.2, 0.8);
  env1.setRange(0.2, 0);

  env2 = new p5.Envelope();
  env2.setADSR(0.2, 0.5, 0.15, 1.2);
  env2.setRange(0.1, 0);

  reverb = new p5.Reverb();
  reverb.process(osc1, 4, 3);
  reverb.process(osc2, 4, 3);

  delay = new p5.Delay();
  delay.process(osc1, 0.4, 0.35, 4000);

  fft = new p5.FFT(0.92, 128);

  textAlign(CENTER);
  textSize(13);
}

function draw() {
  background(0, 0, 6, 8);

  if (started && millis() > nextNoteTime) {
    playGenerativeNote();
    nextNoteTime = millis() + random(300, 1200);
  }

  // Draw note trails
  for (let i = notes.length - 1; i >= 0; i--) {
    let n = notes[i];
    n.life -= 0.5;
    if (n.life <= 0) {
      notes.splice(i, 1);
      continue;
    }
    let alpha = map(n.life, 0, 100, 0, 80);
    let size = map(n.life, 0, 100, 2, n.size);
    noStroke();
    fill(n.hue, 70, 80, alpha);
    circle(n.x, n.y, size);
  }

  // Waveform overlay
  let wave = fft.waveform();
  noFill();
  stroke(0, 0, 40, 40);
  strokeWeight(1);
  beginShape();
  for (let i = 0; i < wave.length; i++) {
    let x = map(i, 0, wave.length, 0, width);
    let y = height / 2 + wave[i] * 100;
    vertex(x, y);
  }
  endShape();

  noStroke();
  if (!started) {
    fill(0, 0, 90);
    text('click to start generative ambient', width / 2, height / 2);
  }
}

function playGenerativeNote() {
  let step = random(scaleSteps);
  let octave = floor(random(0, 3));
  let freq = baseFreq * pow(2, (step + octave * N) / N);

  osc1.freq(freq);
  osc2.freq(freq * pow(2, 11 / N));
  env1.play(osc1);
  env2.play(osc2);

  let hue = map(freq, baseFreq, baseFreq * 8, 180, 30);
  notes.push({
    x: map(freq, baseFreq, baseFreq * 8, 40, width - 40),
    y: random(60, height - 60),
    size: map(octave, 0, 2, 40, 15),
    hue: hue,
    life: 100
  });
}

function mousePressed() {
  if (!started) {
    started = true;
    nextNoteTime = millis();
  }
}
