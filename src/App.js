import React from 'react';

/*---AccurateInterval.js not my original code---*/
const accurateInterval = function (fn, time) {
  var cancel, nextAt, timeout, wrapper;
  nextAt = new Date().getTime() + time;
  timeout = null;
  wrapper = function () {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };
  cancel = function () {
    return clearTimeout(timeout);
  };
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());
  return {
    cancel: cancel
  };
};
/*---end AccurateInterval.js---*/

const Timer = ({ handleReset,
                 timeLeft,
                 handleStopStart,
                 timerState,
                 isRunning}) => {
  return (
    <div className="timer">
      <h1 className="timer-state">{timerState}</h1>
      <h2 className="timer-label">Time Left: <span className="time-val">{timeLeft}</span></h2>
      <div className="btn-wrapper">
        <button  
        onClick={handleStopStart}>
          {isRunning ? <i class="fa-solid fa-pause"></i> : <i class="fa-solid fa-play"></i>}
        </button>
        <button 
        onClick={handleReset}>
          <i class="fa-solid fa-rotate-right"></i>
        </button>
      </div>
    </div>
  )
}

const TimerInputs = ({ breakLength, 
                       sessionLength, 
                       handleSessionInc,
                       handleSessionDec,
                       handleBreakInc,
                       handleBreakDec }) => {
  return(
    <div className="timer">
      <div id="inputs">
        <div id="break">
          <h2 className="timer-label">Break Length: {breakLength}</h2>
          <div className="btn-wrapper">
            <button 
            onClick={handleBreakDec}>
              <i class="fa-solid fa-arrow-down"></i>
            </button>
            <button 
            onClick={handleBreakInc}>
              <i class="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
        <div id="session">
          <h2 className="timer-label">Session Length: {sessionLength}</h2>
          <div className="btn-wrapper">
            <button 
            onClick={handleSessionDec}>
              <i class="fa-solid fa-arrow-down"></i>
            </button>
            <button
            onClick={handleSessionInc}>
              <i class="fa-solid fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
  )
}

const App = () => {
  let buzzer = document.getElementById('beep');
  /*---states---*/
  const [timerState, setTimerState] = React.useState({
    status: "Session"
  })
  const [breakTime, setBreakTime] = React.useState({
    length: 5
  })
  const [sessionTime, setSessionTime] = React.useState({
    length: 25
  })
  const [timeLeft, setTimeLeft] = React.useState({
    time: 1500
  })
  const [isRunning, setIsRunning] = React.useState({
    status: false
  })
  const [cdInterval, setCdInterval] = React.useState({
    interval: ''
  })
  /*---end states---*/
  
  /*---functions---*/
  function handleSessionInc() {
    if(sessionTime.length+1 <= 60){
      setSessionTime({
        length: sessionTime.length+1
      })
      setTimeLeft({
        time: timeLeft.time+60
      })
    } 
  }
  function handleSessionDec() {
    if(sessionTime.length-1 > 0){
      setSessionTime({
        length: sessionTime.length-1
      })
      setTimeLeft({
        time: timeLeft.time-60
      })
    }
  }
  function handleBreakInc() {
    if(breakTime.length+1 <= 60){
      setBreakTime({
        length: breakTime.length+1
      })
    } 
  }
  function handleBreakDec() {
     if(breakTime.length-1 > 0){
      setBreakTime({
        length: breakTime.length-1
      })
    }
  }
  function handleReset() {
    if(cdInterval.interval){
      cdInterval.interval.cancel()
    }
    setBreakTime({
      length: 5
    })
    setSessionTime({
      length: 25
    })
    setTimeLeft({
      time: 1500
    })
    setIsRunning({
      status: false
    })
    setTimerState({
      status: "Session"
    })
    buzzer.pause();
    buzzer.currentTime = 0;
  }
  function handleStopStart() {
    if(!isRunning.status){
      countDown()
      setIsRunning({
        status: true
      })
    } else {
      setIsRunning({
        status: false
      })
      if(cdInterval.interval){
        cdInterval.interval.cancel()
      }
    }
  }
  function toMinutesSeconds(){
    if (timeLeft.time < 0) {
      if(cdInterval.interval){
        cdInterval.interval.cancel()
      }
      checkTimer();
      buzzer.play();
      return "00:00";
    }
    let minutes = Math.floor(timeLeft.time / 60);
    let seconds = timeLeft.time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds;
  }
  function countDown(){
    setCdInterval({
      interval: accurateInterval(() => {
        tick()
      }, 1000)
    })
  }
  function tick(){
    setTimeLeft(prevTimeLeft => ({
      time: prevTimeLeft.time-1
    }))
  }
  function checkTimer(){
    console.log(timeLeft.time)
    if(timeLeft.time < 0){
      if(cdInterval.interval){
        cdInterval.interval.cancel()
      }
      countDown()
      if(timerState.status === "Session"){
        setTimerState({
          status: "Break"
        })
        setTimeLeft({
          time: breakTime.length*60
        })  
      } else {
        setTimerState({
          status: "Session"
        })
        setTimeLeft({
          time: sessionTime.length*60
        }) 
      }
    }
  }
  /*---end functions---*/
  return(
    <div className="app">
      <h1 className="main-title">Session/Break Timer</h1>
      <TimerInputs 
        breakLength={breakTime.length}  
        sessionLength={sessionTime.length} 
        handleSessionInc={handleSessionInc}
        handleSessionDec={handleSessionDec}
        handleBreakInc={handleBreakInc}
        handleBreakDec={handleBreakDec}
      />
      <Timer 
        handleReset={handleReset} 
        timeLeft={toMinutesSeconds()}
        handleStopStart={handleStopStart}
        timerState={timerState.status}
        isRunning={isRunning.status}
        />
      <audio
        id="beep"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
    </div>
  ) 
}

export { App as default };