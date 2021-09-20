(function() {
  const playingDuration = 60000;
  let intervalDuration = 3600000;
  let dancingInterval;
  let timerBoardInterval;

  const $audioTag = document.querySelector('#shots');
  const track = new Audio($audioTag.getAttribute('src'));

  const $timerBoard = document.querySelector('#timer');
  const timer = makeWatchedObject({
    value: intervalDuration
  });

  timer.on(
    'valueChanged',
    (prop, value) => {
      if (value && dancingInterval) {
        $timerBoard.innerHTML = (value / 1000).toString();
      } else {
        $timerBoard.innerHTML = '';
      }
    }
  );

  const $userInput = document.querySelector('#interval')

  $userInput.addEventListener(
    'input',
    () => {
      if (track.paused) {
        const value = +$userInput.value * 1000
        intervalDuration = value
        timer.value = value
      }
    }
  )

  const $startBtn = document.querySelector('#start-button');
  const $resetBtn = document.querySelector('#reset-button');
  const $pauseBtn = document.querySelector('#pause-button');

  $startBtn.addEventListener('click', setTimer);
  $pauseBtn.addEventListener('click', pauseTimer);
  $resetBtn.addEventListener('click', stopTimer);

  function stopTimer() {
    if (!track.paused) {
      track.pause();
    }

    clearInterval(dancingInterval);
    clearInterval(timerBoardInterval);
    $startBtn.removeAttribute('disabled');
    $resetBtn.setAttribute('disabled', 'disabled');
    $pauseBtn.setAttribute('disabled', 'disabled');
    timer.value = intervalDuration;
  }

  function pauseTimer() {
    if (!track.paused) {
      track.pause();
    }

    clearInterval(dancingInterval);
    clearInterval(timerBoardInterval);
    $startBtn.removeAttribute('disabled');
    $pauseBtn.setAttribute('disabled', 'disabled');
  }

  function playMinute() {
    track.currentTime = 52;
    track.play().then(() => {
      setTimeout(() => {
        track.pause();
      }, playingDuration);
    })
  }

  function setTimer() {
    $startBtn.setAttribute('disabled', 'disabled');
    $resetBtn.removeAttribute('disabled');
    $pauseBtn.removeAttribute('disabled');

    dancingInterval = setInterval(playMinute, timer.value);
    timerBoardInterval = setInterval(() => {
      if (!timer.value) {
        timer.value = intervalDuration;
      }

      const colorR = (255 / intervalDuration) * Math.random() * timer.value
      const colorG = (255 / intervalDuration) * Math.random() * timer.value
      const colorB = (255 / intervalDuration) * Math.random() * timer.value
      $timerBoard.style.color = `rgb(${colorR}, ${colorG}, ${colorB})`
      timer.value -= 1000;
    }, 1000);
  }
})()

function makeWatchedObject(object) {
  const events = new Map();

  object.on = function (event, handler) {
    events.set(event, handler);
  };

  object.off = function (event) {
    if (events.has(event)) {
      events.delete(event);
    }
  };

  return new Proxy(object, {
    set(target, prop, value) {
      target[prop] = value;

      const handler = events.get(`${prop}Changed`);

      if (handler) {
        handler(prop, value);
      }
    }
  });
}
