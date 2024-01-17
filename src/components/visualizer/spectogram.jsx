import React, { useEffect, useRef } from 'react';
import '../../assets/styles/components/visualizer/audio-visualizer.scss';
import * as Tone from 'tone';
import p5 from 'p5';

const AudioVisualizer = () => {
  const canvasRef = useRef(null);

  const resizeCanvas = () => {
    const canvasParent = canvasRef.current;
    const canvasWidth = canvasParent.offsetWidth;
    const canvasHeight = canvasParent.offsetHeight;
    p.resizeCanvas(canvasWidth, canvasHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    // Create a new p5 instance
    const sketch = new p5((p) => {
      let analyzer;

      p.setup = () => {
        // Create a canvas and attach it to the canvasRef
        const canvasParent = canvasRef.current;
        const canvasWidth = canvasParent.offsetWidth;
        const canvasHeight = canvasParent.offsetHeight;
        const canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent(canvasParent);

        // Create an audio analyzer
        analyzer = new Tone.Analyser('fft', 1024);
        analyzer.smoothing = 0.8;
        Tone.Destination.connect(analyzer);
      };

      p.draw = () => {
        // Clear the canvas
        p.background(0);

        // Get the FFT (Fast Fourier Transform) data from the analyzer
        const fft = analyzer.getValue();

        // Set the stroke color and weight
        p.stroke(255);
        p.strokeWeight(2);
        p.noFill();

        // Draw the spectrogram
        const binWidth = p.width / fft.length;
        for (let i = 0; i < fft.length; i++) {
          const x = i * binWidth;
          const h = p.map(fft[i], -100, -30, 0, p.height);
          const c = p.map(h, 0, p.height, 0, 255);
          p.stroke(c, c, c);
          p.line(x, p.height, x, p.height - h);
        }
      };
    });

    // Clean up the p5 instance and remove the event listener when the component unmounts
    return () => {
      sketch.remove();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <div className="audio-visualizer" ref={canvasRef}></div>;
};

export default AudioVisualizer;
