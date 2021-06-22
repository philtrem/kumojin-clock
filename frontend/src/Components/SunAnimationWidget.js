import styled from 'styled-components';
import {useEffect, useRef, useState} from "react";
import {Decimal} from 'decimal.js';

const Container = styled.div`
  display: flex;
  align-items: flex-end;
  background-image: linear-gradient(#74cbff, white);
  height: 100%;
  min-width: 100%;
  z-index: -1;
`;

// Required for animation to remain consistent on mobile (the size of the sun changes and we need to retain the same trajectory)
const SunContainer = styled.div.attrs(props => ({
    style: {
        backgroundImage:
            `radial-gradient(circle, rgb(255, ${props.greenValue}, ${props.blueValue}) 10%, rgb(255, ${props.greenValue}, ${props.blueValue + 100}))`,
        left: `${props.x}%`,
        bottom: `calc(${props.y}% - 11rem)`
    },
}))`
  position: relative;
  border-radius: 50%;
  height: 10rem;
  width: 10rem;
`;

const Sun = styled.div.attrs(props => ({
    style: {
        backgroundImage:
            `radial-gradient(circle, rgb(255, ${props.greenValue}, ${props.blueValue}) 10%, rgb(255, ${props.greenValue}, ${props.blueValue + 100}))`
    },
}))`
  margin: 0 auto;
  border-radius: 50%;
  box-shadow: 0 0 10rem #ffffff;
  height: 10rem;
  width: 10rem;
  z-index: -1;
  @media only screen and (max-width: 850px) {
    height: 5rem;
    width: 5rem;
  }
`;

const startPoint = 360;
const midPoint = 720;
const endPoint = 1080;

function generateCoordinates() {
    const coordinates = {};

    let x = new Decimal(0);
    let y = new Decimal(0);
    let multiplier = new Decimal(1);

    for (let i = 0; i <= 720; i++) {
        x = new Decimal(i).div(8);
        y = new Decimal(new Decimal(i).div(2).mul(multiplier));
        multiplier = multiplier.minus(0.001405);
        coordinates[i + startPoint] = [x, y];
    }

    return coordinates;
}

function generateColorValues() {
    const colorValues = {};
    let step = 0;
    colorValues[startPoint] = {};
    colorValues[startPoint].green = 100;
    colorValues[startPoint].blue = 0;

    for (let i = startPoint + 1; i < endPoint; i++) {
        const previousGreenValue = colorValues[i - 1].green;
        const previousBlueValue = colorValues[i - 1].blue;

        colorValues[i] = {};

        if (i % 10 !== 0) {
            colorValues[i].green = previousGreenValue;
            colorValues[i].blue = previousBlueValue;
            continue;
        }

        if (i <= midPoint) {
            colorValues[i].green = previousGreenValue + step;
            if (i !== midPoint) {
                step += 2;
            }
            if (previousGreenValue >= 255) {
                colorValues[i].blue = previousBlueValue + 10;
            } else {
                colorValues[i].blue = previousBlueValue;
            }
        } else if (i > midPoint) {
            colorValues[i].green = previousGreenValue - step;
            step -= 2;
            if (previousBlueValue >= 50) {
                colorValues[i].blue = previousBlueValue - 10;
            } else {
                colorValues[i].blue = previousBlueValue;
            }
        }
    }

    return colorValues;
}

function SunAnimationWidget({timezone}) {
    const coordinatesRef = useRef(null);
    const colorValuesRef = useRef(null);

    const [minutes, setMinutes] = useState(0);
    const [x, setX] = useState(new Decimal(0));
    const [y, setY] = useState(new Decimal(0));
    const multiplierRef = useRef(new Decimal(1));

    function updateSunPosition() {
        setX(coordinatesRef.current[minutes][0]);
        setY(coordinatesRef.current[minutes][1]);
    }

    const [greenValue, setGreenValue] = useState(0);
    const [blueValue, setBlueValue] = useState(0);

    function updateSunColor() {
        if (minutes > startPoint && minutes < endPoint) {
            setGreenValue(colorValuesRef.current[minutes].green);
            setBlueValue(colorValuesRef.current[minutes].blue);
        }
    }

    useEffect(() => {
        coordinatesRef.current = generateCoordinates();
        colorValuesRef.current = generateColorValues();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (minutes >= 1440) {
                setMinutes(0);
                multiplierRef.current = new Decimal(1);
                return;
            }

            if (minutes <= startPoint || minutes >= endPoint) {
                setMinutes(v => v + 1);
                return;
            }

            updateSunPosition();
            setMinutes(v => v + 1);
        }, 1000);
        updateSunColor();
    }, [minutes]);

    return (
        <Container>
            <SunContainer x={x} y={y}>
                <Sun x={x} y={y} greenValue={greenValue} blueValue={blueValue}/>
            </SunContainer>
        </Container>
    );
}

export default SunAnimationWidget;