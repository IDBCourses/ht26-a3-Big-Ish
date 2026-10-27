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

document.body.style.backgroundColor = "hsl(43, 27%, 90%)"; // Sets the default background color
let hue3 = Math.random() * 360; // Randomizing the hue for shape 3

// the note played when the pointer goes down
let synthNotes = ["C4", "D4", "E4", "G4", "A4"];
let bassNotes = ["C3", "A2", "F2", "G2"];

// Creating basic shapes from the object
const bassShape = createShape();
const highShape = createShape();
const eyeLeft = createShape();
const eyeRight = createShape();
const mouthShape = createShape();

// Carving the shapes for the face
function duetShape() {
  bassShape.setSize(200, 200);
  bassShape.setPosition(0.3, 0.45);
  bassShape.setRoundedness(0.15);
  bassShape.setColour(25, 85, 55);

  highShape.setSize(150, 350);
  highShape.setPosition(0.55, 0.3);
  highShape.setRoundedness(0.2);
  highShape.setColour(263, 60, 77);

  eyeLeft.setSize(40);
  eyeLeft.setPosition(0.4, 0.5);
  eyeLeft.setRoundedness(1);
  eyeLeft.setColour(225, 65, 15);

  eyeRight.setSize(40);
  eyeRight.setPosition(0.62, 0.5);
  eyeRight.setColour(225, 65, 15);
  eyeRight.setRoundedness(1);

  mouthShape.setSize(60, 20);
  mouthShape.setPosition(0.51, 0.6);
  mouthShape.setColour(225, 65, 15);
  mouthShape.setRoundedness(0.4);
}

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

let isHoveringShape3 = false;
let synthIndex = 0;
let bassIndex = 0;

// Initiating Pointer and storing its position
let pointerX = 0;
let pointerY = 0;
let time = 0;

// Changes the background color
function testBackgroundColor() {
  let backgroundHue = Math.random() * 360;
  document.body.style.backgroundColor = `hsl(${backgroundHue}, 100%, 25%, 0.3)`;
}

// Rotates the squares
/*function testRotation() {
  shape2.setRotation(shape2.rotation - 30);
  shape3.setRotation(shape3.rotation + 40);
  shape4.setRotation(shape4.rotation - 30);
}

// Changes size of the circles randomly
function testcircleSize() {
  let size = 40 - Math.random() * (55 - 65);
  shape1.setSize(size);
  shape5.setSize(size);
  shape6.setSize(size);
  shape7.setSize(size);
}*/

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const graphicSynth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once
const bassSynth = new Tone.PolySynth(Tone.Synth).toDestination();

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds

  /*  if (isHoveringShape3 === true) {
    shape2.setRotation(shape2.rotation - 25);
    shape3.setRotation(shape3.rotation + 35);
    shape4.setRotation(shape4.rotation - 25);
    testcircleSize();
  }*/
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
async function pointerDown(event) {
  // Browser only allows sound after the user has pressed something, Async waits for the audio to be loaded first
  await Tone.start(); // Await is a property of Async
  console.log("Pointer down at", event.clientX, event.clientY);

  // Plays bass notes on click
  /*bassSynth.triggerAttackRelease(bassNotes[bassKey], "8n");
  bassKey += 1;
  if (bassKey == bassNotes.length) {
    bassKey = 0;
  }*/
}

function pointerUp() {}

function pointerMove(event) {
  pointerX = event.clientX;
  pointerY = event.clientY;
  time = event.timeStamp;

  console.log("\n--------------");
  console.log(
    `Pointer X: ${Math.floor(pointerX)}\nPointer Y: ${Math.floor(pointerY)}`,
  );
  console.log(`TimeStamp: ${Math.floor(time / 1000)}(s)\n`);

  let windowX = Math.floor((pointerX / window.innerWidth) * 1000);
  let windowY = Math.floor((pointerY / window.innerHeight) * 1000);
  console.log("Window X: " + windowX);
  console.log("Window Y: " + windowY);
  console.log("--------------\n");
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.
  duetShape();

  // Put your event listener code here

  //window.addEventListener("pointerdown", testBackgroundColor);
  //window.addEventListener("pointerdown", testRotation);
  //window.addEventListener("pointerdown", testcircleSize);

  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointerup", pointerUp);
  window.addEventListener("pointermove", pointerMove);

  //shape1.element.addEventListener("pointerenter", pointerEnter1);
  //shape1.element.addEventListener("pointerleave", pointerLeave1);

  //shape2.element.addEventListener("pointerenter", pointerEnter2);
  //shape2.element.addEventListener("pointerleave", pointerLeave2);

  //shape3.element.addEventListener("pointerdown", pointerEnter3);   //Hover
  //shape3.element.addEventListener("pointerup", pointerLeave3);     //Hover

  //shape3.element.addEventListener("pointerenter", pointerEnter3);  //Hold
  //shape3.element.addEventListener("pointerleave", pointerLeave3);  //Hold

  //shape4.element.addEventListener("pointerenter", pointerEnter4);
  //shape4.element.addEventListener("pointerleave", pointerLeave4);

  //shape5.element.addEventListener("pointerenter", pointerEnter5);
  //shape5.element.addEventListener("pointerleave", pointerLeave5);

  //shape6.element.addEventListener("pointerenter", pointerEnter6);
  //shape6.element.addEventListener("pointerleave", pointerLeave6);

  //shape7.element.addEventListener("pointerenter", pointerEnter7);
  //shape7.element.addEventListener("pointerleave", pointerLeave7);
}

setup(); // Always remember to call setup()!
