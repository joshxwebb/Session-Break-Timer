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

function formatTime(time) {
  return time < 10 ? "0"+time+":00" : time+":00"
}

const Timer = ({ handleReset,
                 timeLeft,
                 handleStopStart,
                 timerState,
                 isRunning}) => {
  return (
    <div>
      <h1 className="timer-state">{timerState}</h1>
      <h2 className="time-left">{timeLeft}</h2>
      <div className="btn-wrapper">
        <button className="timer-button" onClick={handleStopStart}>
          {isRunning ? <i class="fa-solid fa-pause"></i> : <i class="fa-solid fa-play"></i>}
        </button>
        <button className="timer-button" onClick={handleReset}>
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
    <div>
      <div className="sb-wrapper">
        <h2 className="sb-header">Session</h2>
        <button className="incdec-button" onClick={handleSessionInc}>+</button>
        <h2 className="sb-length">{formatTime(sessionLength)}</h2>
        <button className="incdec-button" onClick={handleSessionDec}>-</button>
      </div>
      <div className="sb-wrapper">
        <h2 className="sb-header">Break</h2>
        <button className="incdec-button" onClick={handleBreakInc}>+</button>
        <h2 className="sb-length">{formatTime(breakLength)}</h2>
        <button className="incdec-button" onClick={handleBreakDec}>-</button>
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
    if(!isRunning.status){
      if(sessionTime.length+1 <= 60){
        setSessionTime({
          length: sessionTime.length+1
        })
        setTimeLeft({
          time: timeLeft.time+60
        })
      } 
    }
  }
  function handleSessionDec() {
    if(!isRunning.status){
      if(sessionTime.length-1 > 0){
        setSessionTime({
          length: sessionTime.length-1
        })
        setTimeLeft({
          time: timeLeft.time-60
        })
      }
    }
  }
  function handleBreakInc() {
    if(!isRunning.status){
      if(breakTime.length+1 <= 60){
        setBreakTime({
          length: breakTime.length+1
        })
      } 
    }
  }
  function handleBreakDec() {
    if(!isRunning.status){
      if(breakTime.length-1 > 0){
       setBreakTime({
         length: breakTime.length-1
       })
     }
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
      <div className="main-container">
        <div className="button-container">
          <TimerInputs 
            breakLength={breakTime.length}  
            sessionLength={sessionTime.length} 
            handleSessionInc={handleSessionInc}
            handleSessionDec={handleSessionDec}
            handleBreakInc={handleBreakInc}
            handleBreakDec={handleBreakDec}
          />
        </div>
        <div>
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
      </div>
    </div>
  ) 
}

export { App as default };