import styled from 'styled-components';

const Slider = styled.span`
  position: absolute;
  border-radius: 34px;
  background-color: #212121;
  cursor: pointer;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  transition: .4s;

  :before {
    position: absolute;
    background-color: white;
    box-shadow: 0 0 5px black;
    border-radius: 50%;
    content: "";
    bottom: 4px;
    left: 4px;
    height: 26px;
    width: 26px;
    transition: .4s;
  }
`

const StyledToggleSwitch = styled(ToggleSwitch)`
  position: relative;
  display: inline-block;
  height: 60px;
  width: 34px;
`;

const Input = styled.input`
  opacity: 0;
  height: 0;
  width: 0;

  :checked + ${Slider} {
    background-color: #345db5;
  }

  :checked + ${Slider}:before {
    transform: translateY(-26px);
  }

  :focus + ${Slider} {
    box-shadow: 0 0 1px #2196F3;
  }
`;

function ToggleSwitch({className, setIsToggled}) {
    return (
        <label className={className}>
            <Input type="checkbox" onChange={() => setIsToggled(previous => !previous)}/>
            <Slider/>
        </label>
    );
}

export default StyledToggleSwitch;