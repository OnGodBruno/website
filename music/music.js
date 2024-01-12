/*
  author: Mojtaba Seyedi
  author URI: http://mojtabaseyedi.com
*/

(function() {

  var songs = [
    { src: "music/lookback.mp3", artist: "Bruno Zoller", title: "Look Back", cover: "url('cover/lookback.jpg')" },
    { src: "music/rennen.mp3", artist: "Bruno Zoller", title: "Rennen (Live)", cover: "url('cover/graphics.jpg')" },
  ];
  
  var currentSongIndex = 0;
  
  function changeTrack(index) {
    song.setAttribute('src', songs[index].src);
    document.querySelector('.singer').textContent = songs[index].artist;
    document.querySelector('.title').textContent = songs[index].title;
    document.querySelector('.innerdisk').style.backgroundImage = songs[index].cover;
    song.load();
    song.play();
  }

  document.querySelector('.music-ctrl__next').addEventListener('click', function() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    changeTrack(currentSongIndex);
  });
  
  document.querySelector('.music-ctrl__prev').addEventListener('click', function() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    changeTrack(currentSongIndex);
  });

  
  var SwipeContent = function(element) {
    this.element = element;
    this.delta = [false, false];
    this.dragging = false;
    this.intervalId = false;
    initSwipeContent(this);
  };

  function initSwipeContent(content) {
    content.element.addEventListener('mousedown', handleEvent.bind(content));
    content.element.addEventListener('touchstart', handleEvent.bind(content));
  };

  function initDragging(content) {
    //add event listeners
    content.element.addEventListener('mousemove', handleEvent.bind(content));
    content.element.addEventListener('touchmove', handleEvent.bind(content));
    content.element.addEventListener('mouseup', handleEvent.bind(content));
    content.element.addEventListener('mouseleave', handleEvent.bind(content));
    content.element.addEventListener('touchend', handleEvent.bind(content));
  };

  function cancelDragging(content) {
    //remove event listeners
    if(content.intervalId) {
      (!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
      content.intervalId = false;
    }
    content.element.removeEventListener('mousemove', handleEvent.bind(content));
    content.element.removeEventListener('touchmove', handleEvent.bind(content));
    content.element.removeEventListener('mouseup', handleEvent.bind(content));
    content.element.removeEventListener('mouseleave', handleEvent.bind(content));
    content.element.removeEventListener('touchend', handleEvent.bind(content));
  };

  function handleEvent(event) {
    switch(event.type) {
      case 'mousedown':
      case 'touchstart':
        startDrag(this, event);
        break;
      case 'mousemove':
      case 'touchmove':
        drag(this, event);
        break;
      case 'mouseup':
      case 'mouseleave':
      case 'touchend':
        endDrag(this, event);
        break;
    }
  };

  function startDrag(content, event) {
    content.dragging = true;
    // listen to drag movements
    initDragging(content);
    content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
    // emit drag start event
    emitSwipeEvents(content, 'dragStart', content.delta, event.target);
  };

  function endDrag(content, event) {
    cancelDragging(content);
    // credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
    var dx = parseInt(unify(event).clientX),
      dy = parseInt(unify(event).clientY);

    // check if there was a left/right swipe
    if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
      var s = getSign(dx - content.delta[0]);

      if(Math.abs(dx - content.delta[0]) > 30) {
        (s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);
      }

      content.delta[0] = false;
    }
    // check if there was a top/bottom swipe
    if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
    	var y = getSign(dy - content.delta[1]);

    	if(Math.abs(dy - content.delta[1]) > 30) {
      	(y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
      }

      content.delta[1] = false;
    }

    // emit drag end event
    emitSwipeEvents(content, 'dragEnd', [dx, dy]);
    content.dragging = false;
  };

  function drag(content, event) {
    if(!content.dragging) return;
    // emit dragging event with coordinates
    (!window.requestAnimationFrame)
      ? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250)
      : content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
  };

  function emitDrag(event) {
    emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
  };

  function unify(event) {
    // unify mouse and touch events
    return event.changedTouches ? event.changedTouches[0] : event;
  };

  function emitSwipeEvents(content, eventName, detail, el) {
    var trigger = false;
    if(el) trigger = el;
    // emit event with coordinates
    var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1], origin: trigger}});
    content.element.dispatchEvent(event);
  };

  function getSign(x) {
    if(!Math.sign) {
      return ((x > 0) - (x < 0)) || +x;
    } else {
      return Math.sign(x);
    }
  };

  window.SwipeContent = SwipeContent;

  // Music Player
    var song = document.getElementById("song"),
        disk = document.querySelector(".disk"),
        innerdisk = document.querySelector(".innerdisk"),
        playButton = document.querySelector(".music-ctrl__play"),
        title = document.querySelector(".title"),
        timeChange = document.querySelector(".timechange"),
        currentTime = document.querySelector(".currenttime"),
        duration = document.querySelector(".duration"),
        song = document.querySelector("#song");

  var titleWidth = title.clientWidth - 2;
  var stepLength = 0;

  song.load();
  song.play();
  changeTrack(0);

  function prependZero(n) {
    return n > 9 ? "" + n : "0" + n;
  }

  song.addEventListener("loadedmetadata", function() {
    stepLength = titleWidth / this.duration;
    var second = parseInt(this.duration % 60);
    var minute = parseInt((this.duration / 60) % 60);
    duration.textContent = prependZero(minute) + ":" + prependZero(second);
  });

  playButton.addEventListener("click", function(e) {
    if (!song.paused) {
      song.pause();
      pauseDisk();
      disk.classList.remove("active");
      this.classList.remove("playing");
      return;
    }

    this.classList.add("playing");
    song.play();
    runDisk();
    disk.classList.add('active');
    },
    false
  );

  song.addEventListener("ended", function(e) {
    this.pause();
    pauseDisk();
    disk.classList.remove("active");
    playButton.classList.remove("playing");
    },
    false
  );

  song.addEventListener("timeupdate", function() {
    title.style.setProperty("--offset", parseInt(this.currentTime) * stepLength);

    var second = parseInt(this.currentTime % 60);
    var minute = parseInt((this.currentTime / 60) % 60);
    currentTime.textContent = prependZero(minute) + ":" + prependZero(second);

  });

  function scrubberSong(change) {
    // console.log("change " + change/5);
    // console.log(song.currentTime);
    song.currentTime = song.currentTime + change/5;
  }

  function rotateDisk(deg) {
    innerdisk.style.transform = "rotate(" + deg + "deg)";
  }

  new SwipeContent(disk);

  var diskX1 = 0;
  var diskX2 = 0;
  var diskDX = 0;
  var stop = false;

  disk.addEventListener("dragStart", function(event) {
    // timeChange.textContent = '';
    document.querySelector('.dragme').textContent = "";
    disk.style.transform = "scale(1.1) rotateX(30deg)";
    song.pause();
    pauseDisk();
    playButton.classList.remove('playing');
    diskX1 = event.detail.x;
    flag = true;
  });

  disk.addEventListener("dragging", function(event) {
    timeChange.classList.add('active');
    diskDX = -(event.detail.x - diskX1);
    disk.style.transform = "scale(1.1) rotateX("+parseInt(30 - diskDX/20)+"deg)";
    rotateDisk(rotation + diskDX);
    if (song.currentTime + diskDX/5 <= song.duration && song.currentTime + diskDX/5 > 0) {
      timeChange.textContent = (parseInt(diskDX/5)<=0?"-  ":"+  ") + Math.abs(parseInt(diskDX/5)) + "s";
    }
  });

  disk.addEventListener("dragEnd", function(event) {
    disk.style.transform = "rotateX(60deg)";
    timeChange.classList.remove("active");
    
    playButton.classList.add("playing");
    diskDX = -(event.detail.x - diskX1);
    if (flag) {
      song.play();
      diskX2 = event.detail.x;
      rotation += -(diskX2 - diskX1);
      rotateDisk(rotation);
      if (!song.ended) {
        runDisk();
      }
      scrubberSong(diskDX);
    }
    flag = false;
  });


  var songPlaying = false;
  var diskPaused = true;
  var rotation = 0;

  var countUp = function() {
    // Increase rotation by 1
    rotation++;

    // Update the UI
    rotateDisk(rotation);

    // if the rotation is less than the condition, run it again
    if (!diskPaused) {
      window.requestAnimationFrame(countUp);
    }
  };

  function runDisk() {
    if (!diskPaused) return;
    diskPaused = false;
    window.requestAnimationFrame(countUp);
  }

  function pauseDisk() {
    diskPaused = true;
  }

})();