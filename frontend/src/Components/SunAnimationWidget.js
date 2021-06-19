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

const Sun = styled.div.attrs(props => ({
    style: {
        backgroundImage:
            `radial-gradient(circle, rgb(255, ${props.greenValue}, ${props.blueValue}) 10%, rgb(255, ${props.greenValue}, ${props.blueValue + 100}))`,
        left: `${props.x}%`,
        bottom: `calc(${props.y}% - 12rem)`
    },
}))`
  position: relative;
  border-radius: 50%;
  box-shadow: 0 0 10rem #ffffff;
  height: 10rem;
  width: 10rem;
  z-index: -1;
`;

const startPoint = 360;
const midPoint = 720;
const endPoint = 1080;

function SunAnimationWidget() {
    const [value, setValue] = useState(0);
    const [x, setX] = useState(new Decimal(0));
    const [y, setY] = useState(new Decimal(0));
    const multiplierRef = useRef(new Decimal(1));

    function updateSunPosition() {
        setX((new Decimal(value).minus(startPoint)).div(8));
        const next = (new Decimal(value).minus(startPoint)).div(2).mul(multiplierRef.current);
        setY(new Decimal(next));
        multiplierRef.current = multiplierRef.current.minus(0.001405);
    }

    const [greenValue, setGreenValue] = useState(100);
    const [blueValue, setBlueValue] = useState(0);
    const stepRef = useRef(0);

    function updateSunColor() {
        if (value % 10 === 0) {
            if (value > startPoint && value < endPoint) {
                if (value < midPoint) {
                    setGreenValue(v => v + stepRef.current);
                    stepRef.current += 2;
                    if (greenValue >= 255) {
                        setBlueValue(v => v + 10);
                    }
                } else if (value >= midPoint) {
                    setGreenValue(v => v - stepRef.current);
                    if (value > midPoint)
                        stepRef.current -= 2;
                    if (blueValue >= 50) {
                        setBlueValue(v => v - 10);
                    }
                }
            }
        }
    }

    useEffect(() => {
        setTimeout(() => {
            if (value >= 1440) {
                setValue(0);
                multiplierRef.current = new Decimal(1);
                return;
            }

            if (value <= startPoint || value >= endPoint) {
                setValue(v => v + 1);
                return;
            }

            updateSunPosition();
            setValue(v => v + 1);
        }, 5)
        updateSunColor();
    }, [value]);

    return (
        <Container>
            <Sun x={x} y={y} greenValue={greenValue} blueValue={blueValue}/>
        </Container>
    )
}

export default SunAnimationWidget;