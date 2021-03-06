(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

let video = document.querySelector('video')
let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')
let timer
let socket = io.connect(null, {port: 5000, rememberTransport: false});
let img = new Image()

// show loading notice
ctx.fillStyle = '#333'
ctx.fillText('Loading...', canvas.width / 2 - 30, canvas.height / 3)

socket.on('faces', function (data) {
  // console.log(data)
  // Reference: http://stackoverflow.com/questions/24107378/socket-io-began-to-support-binary-stream-from-1-0-is-there-a-complete-example-e/24124966#24124966
  var uint8Arr = new Uint8Array(data.buffer);
  var str = String.fromCharCode.apply(null, uint8Arr);
  var base64String = btoa(str);

  img.onload = function () {
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'data:image/png;base64,' + base64String;
})

function hasUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
}

if (hasUserMedia()) {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
  navigator.getUserMedia(
    // constraints
    {
      video: true,
      audio: false
    },
    // callback
    function (stream) {
      video.src = window.URL.createObjectURL(stream)
    },
    // error
    function (err) {
      console.error('something is fired ' + err)
    }
  )
  timer = setInterval(function () {
    ctx.drawImage(video, 0, 0, 320, 240)
      // console.log(canvas.toDataURL("image/jpeg"))
    socket.emit('frame', canvas.toDataURL("image/jpeg"));
  }, 500)


} else {
  alert("Sorry, your browser does not support getUserMedia.")
}

},{}]},{},[1])