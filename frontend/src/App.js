import styled from 'styled-components';
import SunAnimationWidget from './Components/SunAnimationWidget';
import {useEffect, useReducer, useRef, useState} from "react";
import cloudsMountainsImageTop from './Images/clouds-mountains-top.png';
import cloudsMountainsImage from './Images/clouds-mountains.jpg';
import StyledToggleSwitch from './Components/ToggleSwitch';
import formattedTimeToMinutesParser from './Utils/utils'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  flex-direction: ${props => props.flexDirection};
  justify-content: center;
  align-items: center;
  background-image: url(${props => props.backgroundImage});
  background-repeat: no-repeat;
  height: ${props => props.height};
  width: ${props => props.width};
`;

const CloudsMountainsImageTop = styled.div`
  background-repeat: no-repeat;
  background-color: ${props => props.minutes > 1080 || props.minutes < 360 ? '#000a21' : ''};
  background-image: url(${cloudsMountainsImageTop});
  height: 32px;
  width: 100%;
`;

function App() {
    const [timezone, setTimezone] = useState(null);
    const [isTimezoneToggled, setIsTimezoneToggled] = useState(false);
    const [timeInMinutes, setTimeInMinutes] = useState(0);

    useEffect(() => {
        let didCancel = false;

        async function fetchTimezone() {
            try {
                const response = await fetch('/timezone');

                if (!didCancel) {
                    setTimezone(await response.json());
                }
            } catch (error) {
                console.log(`${'%c'}An error has occurred: ${error}`, 'color: red;');
            }
        }

        fetchTimezone();
        return () => {
            didCancel = true;
        };
    }, []);

    return (
        <Wrapper>
            <header>
            </header>

            <Container height={'55%'} width={'100%'} flexDirection={'column'}>
                <SunAnimationWidget timezone={timezone} minutes={timeInMinutes}/>
                <CloudsMountainsImageTop minutes={timeInMinutes}/>
            </Container>

            <Container height={'45%'} width={'100%'} backgroundImage={cloudsMountainsImage} flexDirection={'row'}>
                <StyledClock timezone={timezone} isTimezoneToggled={isTimezoneToggled} setTimeInMinutes={setTimeInMinutes}/>
                <StyledToggleSwitch setIsToggled={setIsTimezoneToggled}/>
            </Container>
        </Wrapper>
    );
}

const StyledClock = styled(Clock)`
  color: #f7f7f7;
  text-align: center;
  font-size: 10vh;
  line-height: 12vh;
  font-weight: bold;
  min-width: 42.5vw;
  user-select: none;

  @media only screen and (max-width: 1366px) {
    font-size: 9vh;
    line-height: 10vh;
    min-width: 45rem;
  }
  
  @media only screen and (max-width: 850px) {
    font-size: 8vh;
    line-height: 9vh;
    min-width: 35rem;
  }
`;

function Clock({className, timezone, isTimezoneToggled, setTimeInMinutes}) {
    const localeRef = useRef(navigator.language);
    const timezoneRef = useRef(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [weekDay, setWeekDay] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (isTimezoneToggled) {
            localeRef.current = timezone?.locale || navigator.language;
            timezoneRef.current = timezone?.code || Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
        else {
            localeRef.current = navigator.language;
            timezoneRef.current = Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
    }, [isTimezoneToggled])

    useEffect(() => {
        function updateState() {
            requestAnimationFrame(() => {
                const date = new Date();
                const timeInMinutes = formattedTimeToMinutesParser(date.toLocaleTimeString('default', { hour: 'numeric', minute: 'numeric', timeZone: timezoneRef.current }));
                setTimeInMinutes(timeInMinutes);
                setWeekDay(date.toLocaleDateString(localeRef.current, { weekday: 'long', timeZone: timezoneRef.current }));
                setDate(date.toLocaleDateString(localeRef.current, { day: 'numeric', month: 'long', year: 'numeric', timeZone: timezoneRef.current }));
                setTime(date.toLocaleTimeString(localeRef.current, { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: timezoneRef.current }));
                updateState();
            });
        }

        updateState();
    }, []);

    function reducer(state, action) {
        switch (action.type) {
            case 'increment':
                return {count: state.count + 1};
            case 'reset':
                return {count: 0};
            default:
                throw new Error();
        }
    }

    const [state, dispatch] = useReducer(reducer, {count: 0});

    useEffect(() => {
        setTimeout(() => {
            if (state.count === 1440) {
                dispatch({type: "reset"});
            } else {
                dispatch({type: "increment"});
            }
        }, 5);
    }, [state]);

    return (
        <div className={className}>
            {weekDay} <br/>
            {date} <br/>
            {time}
        </div>
    );
}

export default App;
