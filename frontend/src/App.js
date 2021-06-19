import styled from 'styled-components';
import SunAnimationWidget from "./Components/SunAnimationWidget";
import {useEffect, useReducer, useState} from "react";
import cloudsMountainsImageTop from './Images/clouds-mountains-top.png'
import cloudsMountainsImage from './Images/clouds-mountains.jpg'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url(${props => props.backgroundImage});
  background-repeat: no-repeat;
  height: ${props => props.height};
  width: ${props => props.width};
`

const CloudsMountainsImageTop = styled.div`
  background-repeat: no-repeat;
  background-image: url(${cloudsMountainsImageTop});
  height: 32px;
  width: 100%;
`;

function App() {
    return (
        <Wrapper>
            <header>
            </header>

            <Container height={'50%'} width={'100%'}>
                <SunAnimationWidget/>
                <CloudsMountainsImageTop/>
            </Container>

            <Container height={'50%'} width={'100%'} backgroundImage={cloudsMountainsImage}>
                <StyledClock/>
            </Container>
        </Wrapper>
    );
}

const StyledClock = styled(Clock)`
  display: flex;
  align-content: center;
  align-items: center;
`

const ClockDisplay = styled.div`
  color: #f7f7f7;
  font-size: 10rem;
  font-weight: bold;
  min-width: 5rem;
`

function Clock({className, timeZone}) {
    let date = new Date();

    const [hours, setHours] = useState(date.getHours());
    const [minutes, setMinutes] = useState(date.getMinutes());
    const [seconds, setSeconds] = useState(date.getSeconds());

    // useEffect(() => {
    //     function updateState() {
    //         requestAnimationFrame(() => {
    //             date = new Date();
    //             setHours(date.getHours());
    //             setMinutes(date.getMinutes());
    //             setSeconds(date.getSeconds());
    //             updateState();
    //         });
    //     }
    //
    //     updateState();
    // }, []);

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
            <ClockDisplay>
                {
                    // `${hours < 10 ? "0" + hours.toString() : hours}
                    // :
                    // ${minutes < 10 ? "0" + minutes.toString() : minutes}
                    // :
                    // ${seconds < 10 ? "0" + seconds.toString() : seconds}`

                    `${Math.round(state.count / 60) < 10 ? "0" + Math.round(state.count / 60) : Math.round(state.count / 60)} : ${state.count % 60 < 10 ? "0" + state.count % 60 : state.count % 60}`
                }
            </ClockDisplay>
        </div>
    )
}

export default App;
