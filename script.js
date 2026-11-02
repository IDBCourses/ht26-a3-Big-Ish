/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 25ms, if necessary
 *   use      — uses the state to make sound and shapes every 25ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.

// Default background color:
document.body.style.backgroundColor = "hsl(350, 60%, 55%)";

// Bass and High melodies:
const bassNotes = [
  ["F2", "C3", "A3", "E4"], // Fmaj7
  ["C3", "G3", "B3", "E4"], // Cmaj7
  ["A2", "E3", "G3", "C4"], // Am7
  ["G2", "D3", "B3", "E4"], // G6
];

const highNotes = [
  "E4",
  "A4",
  "B4",
  "C5",
  "E5",
  "C5",
  "B4",
  "A4",
  "E4",
  "A4",
  "C5",
  "E5",
  "C5",
  "A4",
  "G4",
  "E4",
  "E4",
  "G4",
  "B4",
  "D5",
  "E5",
  "D5",
  "B4",
  "G4",
  "E4",
  "B4",
  "D5",
  "E5",
  "D5",
  "B4",
  "G4",
  "B4",
];

// Initializing the object and carving the shapes for the face:
const outsideOutline = createShape();
const insideOutline = createShape();
const outlines = [outsideOutline, insideOutline];

const bassShape = createShape();
const highShape = createShape();
const mouthShape = createShape();

const eyeLeft = createShape();
const eyeRight = createShape();
const eyes = [eyeLeft, eyeRight];
const eyeLeftBling = createShape();
const eyeRightBling = createShape();
const eyeBling = [eyeLeftBling, eyeRightBling];

function duetShape() {
  outlines.forEach(function (outline) {
    outline.setRoundedness(0.38);
    outline.setRotation(45);
  });

  outsideOutline.setSize(650);
  outsideOutline.setPosition(0.2839, 0.2733);
  outsideOutline.setColour(200, 50, 35, 0.5);

  insideOutline.setSize(525);
  insideOutline.setPosition(0.3116, 0.318);
  insideOutline.setColour(12, 60, 82, 1);

  bassShape.setSize(300, 180);
  bassShape.setPosition(0.3433, 0.4668);
  bassShape.setRoundedness(0.25);
  bassShape.setColour(12, 100, 60, 0.75);

  highShape.setSize(150, 300);
  highShape.setPosition(0.4185, 0.3924);
  highShape.setRoundedness(0.2);
  highShape.setColour(200, 100, 35, 0.75);

  eyes.forEach(function (eye) {
    eye.setSize(50);
    eye.setColour(220, 25, 15, 1);
    eye.setRoundedness(1);
  });

  eyeLeft.setPosition(0.4264, 0.504);
  eyeRight.setPosition(0.5611, 0.504);

  eyeBling.forEach(function (bling) {
    bling.setSize(0);
    bling.setRoundedness(1);
    bling.setColour(0, 0, 95, 1);
  });

  eyeLeftBling.setPosition(0.4462, 0.5114);
  eyeRightBling.setPosition(0.5809, 0.5114);

  mouthShape.setSize(75, 10);
  mouthShape.setPosition(0.5056, 0.5635);
  mouthShape.setColour(220, 25, 15, 1);
  mouthShape.setRoundedness(0.4);
}

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

// Initalising X value for pointer so that it can be accessed:
let windowX = 0;

// Initiating Pointer and storing its position:
let pointerX = 0;
let pointerY = 0;

// Remember the last pointer position:
let lastX = null;
let lastY = null;
let time = null;
let distanceTravelled = 0;

// Audio only starts when pressed:
let audioStart = false;

// Remember the note index positions:
let bassIndex = 0;
let highIndex = 0;

// Bass and High energy:
let bassEnergy = 0;
let highEnergy = 0;

// Variable to remember the timing for the notes:
let nextBass = 0;
let nextHigh = 0;

// Background timer:
let bgTime = 0;

function changeBG() {
  let randomHue = Math.random() * 300; //Picks a random hue between 1 - 300
  const bgNow = Tone.now(); // Current time
  let bgEnergy = bassEnergy + highEnergy;
  let bgGap = 2 - (bgEnergy / 2000) * 1.35; // Interval between 2s to 0.65s for background transition

  if (bgEnergy <= 400) {
    document.body.style.backgroundColor = "hsl(350, 60%, 55%)";
  } else if (bgNow >= bgTime) {
    document.body.style.backgroundColor = `hsl(${randomHue}, 60%, 55%)`;
    bgTime = bgNow + bgGap; // Next colour change at now + gap
  }
}

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
let bassSynth = new Tone.PolySynth(Tone.Synth).toDestination();
let highSynth = new Tone.PolySynth(Tone.Synth).toDestination();

// Default value set to mute:
bassSynth.volume.value = -1000;
highSynth.volume.value = -1000;

function playAudio() {
  const now = Tone.now(); // Current time
  const bassGap = 2; // 2s gap
  const highGap = 0.25; // 0.25s gap

  // Statement to check audio:
  if (audioStart == false) {
    bassSynth.releaseAll();
    highSynth.releaseAll();
    return;
    // Play if clicked:
  } else {
    if (now >= nextBass) {
      bassSynth.triggerAttackRelease(bassNotes[bassIndex], "1n", now, 0.5);

      bassIndex++;
      if (bassIndex >= bassNotes.length) {
        bassIndex = 0;
      }
      nextBass += bassGap; // Bass plays the next chord every 2 seconds
    }

    if (now >= nextHigh) {
      highSynth.triggerAttackRelease(highNotes[highIndex], "16n", now, 0.5);

      highIndex++;
      if (highIndex >= highNotes.length) {
        highIndex = 0;
      }
      nextHigh += highGap; // High plays a melody every 0.25s
    }
  }
}

// ---------- Update ----------
// Update the state. This is called every 25ms.
function update() {
  setTimeout(update, 25);

  // Adjusting energy relative to pointer movement:
  bassEnergy -= 2.5;
  highEnergy -= 2.5;
  if (bassEnergy < 0) {
    bassEnergy = 0;
  }
  if (highEnergy < 0) {
    highEnergy = 0;
  }
}
// ---------- Use ----------
// Use the state to make sound and move shapes.
function use() {
  setTimeout(use, 25); // Updated every 25ms

  // Adusting shape sizes according to the energy:
  bassShape.setSize(300 + bassEnergy / 10, 180 + bassEnergy / 20);
  highShape.setSize(150 + highEnergy / 40, 300 + highEnergy / 15);

  let eyeEnergy = bassEnergy / 25 + highEnergy / 25;
  eyes.forEach(function (eye) {
    eye.setSize(50 + eyeEnergy);
  });

  let blingEnergy = bassEnergy / 40 + highEnergy / 40;
  eyeBling.forEach(function (bling) {
    bling.setSize(blingEnergy);
  });

  mouthShape.setSize(75 + highEnergy / 50, 15 + bassEnergy / 50);

  outsideOutline.setSize(650 + highEnergy / 10);
  outsideOutline.setRotation(outsideOutline.rotation + highEnergy / 70);

  insideOutline.setSize(525 + bassEnergy / 10);
  insideOutline.setRotation(insideOutline.rotation - bassEnergy / 70);

  // Adjusting volume according to energy:
  if (bassEnergy <= 0) {
    bassSynth.volume.value = -1000; // Mutes audio when there is no energy
  } else {
    bassSynth.volume.value = -45 + (bassEnergy / 1000) * 42;
  }
  if (highEnergy <= 0) {
    highSynth.volume.value = -1000;
  } else {
    highSynth.volume.value = -45 + (highEnergy / 1000) * 42;
  }

  // Call the audio
  playAudio();
  // Change the background
  changeBG();
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.

async function pointerDown(event) {
  // Browser only allows sound after the user has pressed something
  await Tone.start(); // Waits for the audio to be loaded

  //console.log("Pointer down at", event.clientX, event.clientY);

  //Toggle audio when pressed:
  audioStart = !audioStart;
  console.log("Audio Start: " + audioStart);

  if (audioStart == true) {
    // Syncing and resetting audio and timing:
    nextBass = Tone.now();
    nextHigh = Tone.now();
    bassIndex = 0;
    highIndex = 0;
  } else {
    // Disables audio:
    bassSynth.releaseAll();
    highSynth.releaseAll();
  }
}

function pointerMove(event) {
  // Real time pointer position
  pointerX = event.clientX;
  pointerY = event.clientY;
  time = event.timeStamp;

  // Pointer postion and calculation relative to the window
  windowX = Math.floor((pointerX / window.innerWidth) * 1000);

  // Calculate distance between pointers:
  // Prevents a bug where the intital momeumtum creates a burts of energy:
  if (lastX !== null && lastY !== null) {
    distanceTravelled = Math.hypot(pointerX - lastX, pointerY - lastY); // Math.hypot(dx, dy) gives the straight-line distance between two points
  }
  //console.log(`Distance travelled: ${Math.ceil(distanceTravelled)}`);

  //console.log("\n------------\n");
  //console.log(`Pointer X: ${Math.floor(pointerX)}\nPointer Y: ${Math.floor(pointerY)}\n`,);
  console.log(`\n\n\nTimeStamp: ${Math.floor(time / 1000)}(s)`);

  lastX = pointerX;
  lastY = pointerY;

  // Calculating energy relative to where the pointer is:
  if (windowX < 500) {
    console.log("Left");
    bassEnergy += distanceTravelled * 0.15;
    console.log("Bass Energy: " + Math.floor(bassEnergy));
    console.log("High Energy: " + Math.floor(highEnergy));
  } else if (windowX > 500) {
    console.log("Right");
    highEnergy += distanceTravelled * 0.15;
    console.log("Bass Energy: " + Math.floor(bassEnergy));
    console.log("High Energy: " + Math.floor(highEnergy));
  }

  // Adjusting energy realtive to pointer movement:
  if (bassEnergy > 1000) {
    bassEnergy = 1000;
  }
  if (highEnergy > 1000) {
    highEnergy = 1000;
  }
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  duetShape(); // Calls the default shape first before updating it with energy
  update(); // start the update loop
  use(); // start the use loop

  // Put your event listener code here
  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointermove", pointerMove);
}

setup(); // Always remember to call setup()!
