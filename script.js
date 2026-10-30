/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
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
document.body.style.backgroundColor = "hsl(215, 60%, 55%)";

let windowX = 0; // Initalising X value for pointer so that it can be accessed everwhere
let windowY = 0; // Initialisngf Y value for pointer

// Bass and Synth melodies:
let bassNotes = ["C3"];
let highNotes = ["D4"];

// Initializing the object and carving the shapes for the face:

const outsideOutline = createShape();
const insideOutline = createShape();
let outlines = [outsideOutline, insideOutline];

let bassShape = createShape();
let highShape = createShape();
let mouthShape = createShape();

let eyeLeft = createShape();
let eyeRight = createShape();
let eyes = [eyeLeft, eyeRight];

function duetShape() {
  outlines.forEach(function (outline) {
    (outsideOutline.setSize(650),
      insideOutline.setSize(525),
      outsideOutline.setPosition(0.25, 0.19),
      insideOutline.setPosition(0.3, 0.25),
      outsideOutline.setColour(245, 45, 30, 0.65), //223
      insideOutline.setColour(270, 55, 85, 0.65)); // 219
    outline.setRoundedness(0.3);
    outline.setRotation(0);
  });

  bassShape.setSize(300, 180);
  bassShape.setPosition(0.35, 0.45);
  bassShape.setRoundedness(0.25);
  bassShape.setColour(25, 85, 55, 0.9);

  highShape.setSize(150, 300);
  highShape.setPosition(0.55, 0.35);
  highShape.setRoundedness(0.2);
  highShape.setColour(263, 60, 77, 0.9);

  eyes.forEach(function (eye) {
    (eye.setSize(45), eye.setColour(225, 65, 15), eye.setRoundedness(1));
  });
  eyeLeft.setPosition(0.43, 0.5);
  eyeRight.setPosition(0.63, 0.5);

  mouthShape.setSize(50, 10);
  mouthShape.setPosition(0.52, 0.58);
  mouthShape.setColour(225, 65, 15);
  mouthShape.setRoundedness(0.4);
}

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

let bassIndex = 0;
let synthIndex = 0;

// Initiating Pointer and storing its position:
let pointerX = 0;
let pointerY = 0;
let time = 0;
let distanceTravelled = 0;

// Remember the last pointer position:
let lastX = null;
let lastY = null;
let lastTime = null;

// Bass and High energy:
let bassEnergy = 0;
let highEnergy = 0;
let audioStart = false; // Audio only starts when pressed

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
let bassSynth = new Tone.PolySynth(Tone.Synth).toDestination();
let highSynth = new Tone.PolySynth(Tone.Synth).toDestination();
bassSynth.volume.value = -1000; // Default value to mute
highSynth.volume.value = -1000;

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 50); // call update() again in 50 milliseconds

  // Adjusting energy relative to pointer movement:
  bassEnergy -= 10;
  highEnergy -= 10;
  if (bassEnergy < 0) {
    bassEnergy = 0;
  }
  if (highEnergy < 0) {
    highEnergy = 0;
  }
}
// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 25); // call use() again in 50 milliseconds

  // Adusting shape sizes according to the energy:
  bassShape.setSize(300 + bassEnergy / 10, 180 + bassEnergy / 20);
  highShape.setSize(150 + highEnergy / 50, 300 + highEnergy / 10);
  eyeLeft.setSize(45 + bassEnergy / 30);
  eyeRight.setSize(45 + highEnergy / 30);
  mouthShape.setSize(50 + highEnergy / 50, 15 + bassEnergy / 50);
  outsideOutline.setRotation(outsideOutline.rotation + highEnergy / 50);
  insideOutline.setRotation(insideOutline.rotation - bassEnergy / 50);

  // Adjusting volume according to energy:
  if (bassEnergy <= 0) {
    bassSynth.volume.value = -1000;
  } else {
    bassSynth.volume.value = -50 + (bassEnergy / 1000) * 48; // 0 energy, silence || 250 energy, -48db || 500 energy, -36db || 1000 energy, -12db
  }
  if (highEnergy <= 0) {
    highSynth.volume.value = -1000;
  } else {
    highSynth.volume.value = -50 + (highEnergy / 1000) * 48;
  }
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
async function pointerDown(event) {
  // Browser only allows sound after the user has pressed something, Async waits for the audio to be loaded first
  await Tone.start(); // Await is a property of Async
  console.log("Pointer down at", event.clientX, event.clientY);

  /*if (audioStart) {
    return;
  }
  console.log("Starting audio");
  audioStart = true;
  */
}

// Play audio after press
// Click to mute feature still needed?
/*
  if (audioStart == true) {
    audioStart == false;
    bassSynth.volume.value = -1000;
    highSynth.volume.value = -1000;
    return;
  }
    */

function pointerMove(event) {
  // Real time pointer position
  pointerX = event.clientX;
  pointerY = event.clientY;
  time = event.timeStamp;

  // Pointer postion and calculation relative to the window
  //console.log("\n------------\n");
  windowX = Math.floor((pointerX / window.innerWidth) * 1000);
  windowY = Math.floor((pointerY / window.innerHeight) * 1000);

  // Calculate distance between pointers:
  // Making sure the inital position exits before calculating:
  if (lastX != null && lastY != null) {
    distanceTravelled = Math.hypot(pointerX - lastX, pointerY - lastY); // Math.hypot(dx, dy) gives the straight-line distance between two points
    //console.log(`Distance travelled: ${Math.ceil(distanceTravelled)}`); // Math.ceil because we want to incluce micro movements
  }

  //console.log(`Pointer X: ${Math.floor(pointerX)}\nPointer Y: ${Math.floor(pointerY)}`);
  console.log(`TimeStamp: ${Math.floor(time / 1000)}(s)\n`);

  lastX = pointerX;
  lastY = pointerY;

  // Calculating energy relative to where the pointer is:
  if (windowX < 500 && windowY < 500) {
    console.log("Top Left");
    bassEnergy += distanceTravelled;
    //console.log("Bass Energy: " + bassEnergy);
    //console.log("High Energy: " + highEnergy);
  } else if (windowX > 500 && windowY < 500) {
    console.log("Top Right");
    highEnergy += distanceTravelled;
    //console.log("Bass Energy: " + bassEnergy);
    //console.log("High Energy: " + highEnergy);
  } else if (windowX < 500 && windowY > 500) {
    console.log("Bottom Left");
    bassEnergy += distanceTravelled;
    //console.log("Bass Energy: " + bassEnergy);
    //console.log("High Energy: " + highEnergy);
  } else if (windowX > 500 && windowY > 500) {
    console.log("Bottom Right");
    highEnergy += distanceTravelled;
    //console.log("Bass Energy: " + bassEnergy);
    //console.log("High Energy: " + highEnergy);
  }

  // Adjusting energy realtive to pointer movement:
  if (bassEnergy > 1000) {
    bassEnergy = 1000;
  }
  if (highEnergy > 1000) {
    highEnergy = 1000;
  }
  let i = 0;
  if (windowX < 500) {
    for (i = 0; i < bassNotes.length; i++) {
      bassSynth.triggerAttack(bassNotes[i]);
      highSynth.triggerAttack(highNotes[i]);
    }
  } else {
    for (i = 0; i < highNotes.length; i++) {
      bassSynth.triggerAttackRelease(bassNotes[i]);
      highSynth.triggerAttackRelease(highNotes[i]);
    }
  }
}
// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  duetShape(); // Calls the base shape first before updating it with energy:
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.

  // Put your event listener code here
  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointermove", pointerMove);
}

setup(); // Always remember to call setup()!
