const canvas = document.getElementById('noise');
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const noise = new Noise(Math.random()); // здесь мы создаём экземпляр Noise

  let t = 0; // "время", для анимации

  function draw() {
    const imageData = ctx.createImageData(w, h);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        // Координаты шума + время
        const value = noise.perlin3(x / 100, y / 100, t/10);

let color = 255 * value*80; // от 102 до 255, плавно
        const i = (x + y * w) * 4;
        imageData.data[i] = color;
        imageData.data[i + 1] = color;
        imageData.data[i + 2] = color;
        imageData.data[i + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    t += 0.01; // чуть продвигаем "время"

    requestAnimationFrame(draw);
  }

  draw();