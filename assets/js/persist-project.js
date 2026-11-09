/* PERSIST video examples and boundary-score playback. */
(() => {
  'use strict';
  if (!document.querySelector('.persist-project')) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Reveal each analysis once; the content remains visible without scripting.
  const analyses = [...document.querySelectorAll('.persist-analysis-module')];
  if (analyses.length && !reduced.matches && 'IntersectionObserver' in window && 'animate' in Element.prototype) {
    const animations = new Set();
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal.unobserve(entry.target);
        if (reduced.matches) continue;
        const index = analyses.indexOf(entry.target);
        const animation = entry.target.animate([
          { opacity: 0, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 560, delay: index === 1 ? 70 : 0, easing: 'cubic-bezier(.2, .65, .3, 1)', fill: 'backwards' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: .08 });
    analyses.forEach(module => reveal.observe(module));
    reduced.addEventListener('change', () => {
      if (!reduced.matches) return;
      reveal.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    });
  }

  // The author's silent presentation excerpt plays only while it is in view.
  const method = document.getElementById('persist-method-video');
  if (method) {
    let visible = false;
    let wanted = !reduced.matches;
    let userChose = false;
    let automaticPlay = false;
    let automaticPause = false;
    method.muted = true;
    const resume = () => {
      if (visible && wanted && !document.hidden) {
        if (method.paused) {
          automaticPlay = true;
          method.play().catch(() => { automaticPlay = false; });
        }
      } else if (!method.paused) {
        automaticPause = true;
        method.pause();
      }
    };
    method.addEventListener('play', () => {
      if (!automaticPlay) userChose = true;
      automaticPlay = false;
      wanted = true;
    });
    method.addEventListener('pause', () => {
      if (automaticPause) { automaticPause = false; return; }
      if (visible && !document.hidden && !method.ended) { wanted = false; userChose = true; }
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .2;
        resume();
      }, { threshold: [0, .2] }).observe(method);
    }
    document.addEventListener('visibilitychange', resume);
    reduced.addEventListener('change', () => {
      if (!userChose) wanted = !reduced.matches;
      resume();
    });
  }

  const explorer = document.getElementById('examples');
  const carousel = document.getElementById('persist-carousel');
  if (!explorer || !carousel) return;
  const track = document.getElementById('persist-carousel-track');
  const scenes = [...track.querySelectorAll('[data-scene]')].map(element => ({
    element, id: element.dataset.scene,
    video: element.querySelector('video'),
    canvas: element.querySelector('canvas'),
    context: element.querySelector('canvas').getContext('2d')
  }));
  const tabs = [...explorer.querySelectorAll('[data-case]')];
  const status = document.getElementById('persist-example-status');
  const play = document.getElementById('persist-play');
  const previous = document.getElementById('persist-previous');
  const next = document.getElementById('persist-next');
  const seek = document.getElementById('persist-seek');
  const frameLabel = document.getElementById('persist-frame');
  const stateLabel = document.getElementById('persist-playback-state');
  let ready = false;
  let activeIndex = 0;
  let inView = false;
  let wanted = !reduced.matches;
  let userChose = false;
  let threshold = .5;
  let raf = 0;
  let advanceTimer = null;
  let transitionTimer = null;
  let transitioning = false;
  let pending = null;
  const current = () => scenes[activeIndex];
  const frameIndex = scene => Math.max(0, Math.min(scene.data.frames.length - 1,
    Math.floor(scene.video.currentTime * scene.data.fps + .0001)));

  function render(scene = current()) {
    if (!ready || !scene?.data || !scene.context) return;
    const { data, video, canvas, context } = scene;
    const index = frameIndex(scene);
    const sourceFrame = data.frames[index];
    if (scene === current()) {
      const progress = index / (data.frames.length - 1);
      seek.value = String(index);
      seek.style.setProperty('--progress', (progress * 100).toFixed(2) + '%');
      seek.setAttribute('aria-valuetext', 'Source frame ' + sourceFrame);
      frameLabel.textContent = 'Frame ' + sourceFrame;
      tabs[activeIndex].querySelector('.persist-case-progress').style.transform = `scaleX(${progress})`;
    }
    canvas.dataset.frame = String(sourceFrame);
    canvas.dataset.case = data.id;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(width * ratio) || canvas.height !== Math.round(height * ratio)) {
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    const left = 28, right = 10, top = 17, bottom = 28;
    const plotWidth = width - left - right, plotHeight = height - top - bottom;
    const x = i => left + i / (data.frames.length - 1) * plotWidth;
    const y = value => top + (1 - value) * plotHeight;
    context.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
    for (const interval of data.groundTruth) {
      const first = Math.max(0, interval.start - data.startFrame);
      const last = Math.min(data.frames.length - 1, interval.end - data.startFrame);
      if (last < first) continue;
      context.fillStyle = '#e1f0ef';
      context.fillRect(x(first), top, Math.max(3, x(last) - x(first)), plotHeight);
    }
    context.textAlign = 'right'; context.textBaseline = 'middle';
    for (const value of [0, threshold, 1]) {
      context.strokeStyle = value === threshold ? '#c9bfc6' : '#ede8ec';
      context.lineWidth = 1;
      context.setLineDash(value === threshold ? [3, 4] : []);
      context.beginPath(); context.moveTo(left, y(value)); context.lineTo(width - right, y(value)); context.stroke();
      context.fillStyle = '#77717b'; context.fillText(String(value), left - 8, y(value));
    }
    context.setLineDash([]); context.textBaseline = 'bottom';
    context.fillStyle = '#88818a'; context.fillText('threshold 0.5', width - right, y(threshold) - 5);
    function line(values, colour, dashed) {
      context.strokeStyle = colour; context.lineWidth = dashed ? 1.7 : 2.4;
      context.setLineDash(dashed ? [5, 4] : []); context.lineJoin = 'round';
      context.beginPath();
      values.forEach((value, i) => i ? context.lineTo(x(i), y(value)) : context.moveTo(x(i), y(value)));
      context.stroke(); context.setLineDash([]);
    }
    line(data.baseline, '#85849f', true); line(data.persist, '#843664', false);
    context.textBaseline = 'top';
    [0, Math.floor((data.frames.length - 1) / 2), data.frames.length - 1].forEach((i, pos) => {
      context.textAlign = ['left', 'center', 'right'][pos];
      context.fillStyle = '#77717b'; context.fillText(String(data.frames[i]), x(i), height - bottom + 10);
    });
    context.strokeStyle = '#b2a8b0'; context.lineWidth = 1;
    context.beginPath(); context.moveTo(x(index), top); context.lineTo(x(index), height - bottom); context.stroke();
    [[data.baseline[index], '#85849f'], [data.persist[index], '#843664']].forEach(([value, colour]) => {
      context.fillStyle = colour;
      context.beginPath(); context.arc(x(index), y(value), 3, 0, Math.PI * 2); context.fill();
    });
    canvas.setAttribute('aria-label', data.label + ', frame ' + sourceFrame + '. PERSIST score ' +
      data.persist[index].toFixed(2) + ', cue-only baseline ' + data.baseline[index].toFixed(2) + '. Threshold 0.5.');
  }
  function syncControls() {
    play.classList.toggle('is-paused', !wanted);
    play.querySelector('.persist-play-label').textContent = wanted ? 'Pause' : 'Play';
    play.setAttribute('aria-label', wanted ? 'Pause automatic playback' : 'Play examples automatically');
    play.setAttribute('aria-pressed', String(wanted));
    carousel.dataset.state = wanted ? (inView && !document.hidden ? 'playing' : 'offscreen') : 'paused';
    stateLabel.textContent = wanted ? 'Auto-playing' : 'Paused';
  }
  function stopAdvance() { clearTimeout(advanceTimer); advanceTimer = null; }
  function queueNext() {
    stopAdvance();
    if (wanted && inView && !document.hidden) {
      // Hold the last frame briefly, so the completed event remains readable.
      advanceTimer = setTimeout(() => selectScene((activeIndex + 1) % scenes.length, 1), 700);
    }
  }
  function animate() {
    render();
    if (!current().video.paused) raf = requestAnimationFrame(animate);
  }
  function updatePlayback() {
    if (!ready) return;
    syncControls();
    const scene = current();
    if (!wanted || !inView || document.hidden) {
      stopAdvance(); scene.video.pause(); return;
    }
    if (scene.video.ended) { queueNext(); return; }
    scene.video.play().then(() => { status.textContent = ''; }).catch(error => {
      if (error.name === 'AbortError' || scene !== current() || !inView || document.hidden) return;
      wanted = false; syncControls();
      status.textContent = 'Press Play to start the examples. The recorded scores remain available.';
    });
  }
  function activate(index) {
    activeIndex = index;
    carousel.dataset.activeCase = current().id;
    scenes.forEach((scene, i) => {
      scene.element.inert = i !== index;
      scene.element.setAttribute('aria-hidden', String(i !== index));
    });
    tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === index);
      tab.setAttribute('aria-pressed', String(i === index));
      tab.querySelector('.persist-case-progress').style.transform = 'scaleX(0)';
    });
    seek.max = String(current().data.frames.length - 1);
    render();
  }
  function finishTransition() {
    clearTimeout(transitionTimer);
    track.style.transition = 'none';
    track.prepend(current().element);
    track.style.transform = 'translate3d(0, 0, 0)';
    void track.offsetWidth;
    track.style.transition = '';
    transitioning = false;
    if (pending) { const target = pending; pending = null; selectScene(target.index, target.direction); }
  }
  function selectScene(index, direction = 1) {
    if (!ready) return;
    if (transitioning) { pending = { index, direction }; return; }
    if (index === activeIndex) return;
    stopAdvance();
    const old = current();
    const target = scenes[index];
    old.video.pause();
    target.video.currentTime = 0;
    // Move only the incoming slide: wrapping from fourth to first is also one smooth step.
    if (reduced.matches) {
      track.prepend(target.element);
      activate(index); updatePlayback(); return;
    }
    transitioning = true;
    if (direction < 0) {
      track.style.transition = 'none';
      track.insertBefore(target.element, old.element);
      track.style.transform = 'translate3d(-100%, 0, 0)';
      void track.offsetWidth;
      track.style.transition = '';
      track.style.transform = 'translate3d(0, 0, 0)';
    } else {
      track.insertBefore(target.element, old.element.nextSibling);
      track.style.transform = 'translate3d(-100%, 0, 0)';
    }
    activate(index);
    updatePlayback();
    transitionTimer = setTimeout(finishTransition, 680);
  }
  play.addEventListener('click', () => {
    userChose = true; wanted = !wanted;
    // A manually requested replay starts immediately if the last frame was reached.
    if (wanted && ready && current().video.ended) current().video.currentTime = 0;
    updatePlayback();
  });
  previous.addEventListener('click', () => selectScene((activeIndex + scenes.length - 1) % scenes.length, -1));
  next.addEventListener('click', () => selectScene((activeIndex + 1) % scenes.length, 1));
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectScene(index, index < activeIndex ? -1 : 1));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const target = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
        (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[target].focus(); selectScene(target, event.key === 'ArrowLeft' ? -1 : 1);
    });
  });
  seek.addEventListener('input', () => {
    if (!ready) return;
    const index = Math.max(0, Math.min(Number(seek.value), current().data.frames.length - 1));
    wanted = false; userChose = true; updatePlayback();
    current().video.currentTime = (index + .05) / current().data.fps;
    render();
  });
  scenes.forEach(scene => {
    const { video } = scene;
    video.muted = true;
    video.loop = false;
    video.addEventListener('play', () => {
      if (!ready || scene !== current()) return;
      cancelAnimationFrame(raf); animate();
    });
    video.addEventListener('pause', () => {
      if (scene === current()) { cancelAnimationFrame(raf); render(); }
    });
    ['loadedmetadata', 'seeked', 'timeupdate'].forEach(event => video.addEventListener(event, () => render(scene)));
    video.addEventListener('ended', () => { if (ready && scene === current()) { render(); queueNext(); } });
    video.addEventListener('error', () => {
      if (ready && scene === current() && video.error) {
        wanted = false; updatePlayback();
        status.textContent = 'This clip could not be loaded. Its recorded scores and the original figure remain available.';
      }
    });
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .18;
      updatePlayback();
    }, { threshold: [0, .18] }).observe(carousel);
  } else inView = true;
  if ('ResizeObserver' in window) new ResizeObserver(() => render()).observe(carousel);
  else window.addEventListener('resize', () => render());
  document.addEventListener('visibilitychange', updatePlayback);
  reduced.addEventListener('change', () => {
    if (!userChose) wanted = !reduced.matches;
    if (transitioning && reduced.matches) finishTransition();
    updatePlayback();
  });

  fetch(explorer.dataset.manifest).then(response => {
    if (!response.ok) throw new Error('Example data unavailable');
    return response.json();
  }).then(data => {
    if (!Array.isArray(data.examples) || data.examples.length !== scenes.length) throw new Error('Invalid example data');
    scenes.forEach(scene => {
      scene.data = data.examples.find(example => example.id === scene.id);
      const example = scene.data;
      if (!scene.context || !example?.frames?.length || example.persist?.length !== example.frames.length ||
        example.baseline?.length !== example.frames.length || !(example.fps > 0)) throw new Error('Incomplete scores');
    });
    threshold = data.threshold;
    scenes.forEach(scene => {
      scene.video.controls = false;
      scene.element.querySelector('.persist-score-panel').hidden = false;
    });
    ready = true;
    carousel.classList.add('is-ready');
    document.getElementById('persist-score-fallback').hidden = true;
    document.getElementById('persist-player-controls').hidden = false;
    explorer.querySelector('.persist-carousel-actions').hidden = false;
    explorer.querySelector('.persist-case-nav').hidden = false;
    activate(0);
    scenes.forEach(scene => render(scene));
    updatePlayback();
  }).catch(() => {
    status.textContent = 'Interactive scores are currently unavailable. You can still play the first clip and view the comparison figure.';
  });
})();
