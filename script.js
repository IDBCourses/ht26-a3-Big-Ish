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
const note = "C4"; // the note played when the pointer goes down

// Creating basic shapes from the object
const shape1 = createShape();
const shape2 = createShape();
const shape3 = createShape();
const shape4 = createShape();
const shape5 = createShape();

// Carving the shapes
function testShape() {
  shape1.setPosition(0.5, 0.2);
  shape1.setSize(50);
  shape1.setColour(255, 100, 25, 0.75);

  shape2.setPosition(0.5, 0.35);
  shape2.setSize(50);
  shape2.setRoundedness(0.4);

  shape3.setPosition(0.5, 0.5);
  shape3.setSize(50);
  shape3.setColour(255, 100, 25, 0.75);
  shape3.setRoundedness(0.2);
  shape3.setRotation(45);

  shape4.setPosition(0.5, 0.65);
  shape4.setSize(50);
  shape4.setRoundedness(0.4);

  shape5.setPosition(0.5, 0.8);
  shape5.setSize(50);
  shape1.setColour(255, 100, 25, 0.75);
}

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.

function pointerEnter(event) {}

function pointerLeave(event) {}

// Rotates the squares
function testRotation() {
  shape2.setRotation(shape2.rotation - 25);
  shape3.setRotation(shape3.rotation + 25);
  shape4.setRotation(shape4.rotation - 25);
}

// Changes size of the circles randomly
function testcircleSize() {
  let size = 50 - Math.random() * (55 - 65);
  shape1.setSize(size);
  shape5.setSize(size);
}

// Changes the background color
function testBackgroundColor() {
  let hue = Math.random() * 360;
  document.body.style.backgroundColor = `hsl(${hue}, 100%, 50%, 0.5)`;
}

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const synth = new Tone.PolySynth(Tone.Synth).toDestination(); // can play several notes at once

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
function use() {
  setTimeout(use, 100); // call use() again in 100 milliseconds
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something

  console.log("Pointer down at", event.clientX, event.clientY);
  synth.triggerAttackRelease(note, "8n"); // play the note for an eighth note
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.
  testShape();
  // Put your event listener code here
  window.addEventListener("pointerdown", pointerDown);
  window.addEventListener("pointerdown", testRotation);
  window.addEventListener("pointerdown", testcircleSize);
  window.addEventListener("pointerdown", testBackgroundColor);
}

setup(); // Always remember to call setup()!
