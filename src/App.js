import { useState } from "react";
import styled, { keyframes } from "styled-components";

function App() {
  const [floors, setFloors] = useState("");
  const [lifts, setLifts] = useState("");

  const [ceilings, setCeilings] = useState([]);
  const [liftsUI, setLiftsUI] = useState([]);

  const [callingFloor, setCallingFloor] = useState(1);

  const [floorsList, setFloorslist] = useState([]);

  const generateUI = () => {
    for (let i = floors; i > 0; i--) {
      setCeilings((ceilings) => [...ceilings, i]);
    }

    for (let i = lifts; i > 0; i--) {
      setLiftsUI((liftsUI) => [...liftsUI, i]);
    }
  };

  const liftDoorAnimation = (leftDoor = []) => {
    leftDoor.forEach((door) => {
      setTimeout(() => {
        door.style.marginRight = "5px";
      }, 2.5 * 1000);

      setTimeout(() => {
        door.style.marginRight = "0px";
      }, 5 * 1000);

      door.style.transition = `margin-right 1s`;
    });
  };

  const moveLift = (floor, e) => {
    const element = document.getElementById("lift-section");
    const getFloor = document.getElementById(`floor-${floor}`);

    const getBaseFloor = document.getElementById(`floor-${callingFloor}`);

    const baseFloorHeight = getBaseFloor.getBoundingClientRect();
    const currentFloorHeight = getFloor.getBoundingClientRect();

    const leftDoor = document.querySelectorAll("#left-door");
    
    // register door animation in callback queue 
    liftDoorAnimation(leftDoor);

    let diff;

    // diff gives the distance which lift has to travel
    if (floor > callingFloor) {
      diff = -(baseFloorHeight.top - currentFloorHeight.top);
    } else {
      diff = currentFloorHeight.top - baseFloorHeight.top;
    }

    // animaiton part
    let start, previousTimeStamp;
    let done = false;

    function step(timestamp) {
      if (start === undefined) {
        start = timestamp;
      }

      const elapsed = timestamp - start;

      if (previousTimeStamp !== timestamp) {
        const count = Math.min(0.1 * elapsed, Math.abs(diff));

        if (count === Math.abs(diff)) {
          done = true;
          element.style.transform = `translateY(0px)`;

          liftDoorAnimation(leftDoor);

          getFloor.appendChild(element);
        } else {
          element.style.transform = `translateY(${
            floor > callingFloor ? `-${count}` : count
          }px)`;
        }
      }

      if (elapsed < 2 * Math.abs(floor - callingFloor) * 1000) {
        previousTimeStamp = timestamp;
        if (!done) {
          window.requestAnimationFrame(step);
        }
      }
    }

    setTimeout(() => {
      window.requestAnimationFrame(step);
    }, 6000);

    setCallingFloor(floor);
  };

  return (
    <MainWrapper>
      <Wrapper>
        <FloorInput>
          <Label> floors </Label>
          <input
            type="text"
            value={floors}
            placeholder="enter floors"
            onChange={(e) => setFloors(() => Number(e.target.value))}
          />
        </FloorInput>
        <LiftInput>
          <Label> lifts </Label>
          <input
            type="text"
            value={lifts}
            placeholder="enter lifts"
            onChange={(e) => setLifts(() => Number(e.target.value))}
          />
        </LiftInput>

        <Button onClick={generateUI}>Save</Button>
      </Wrapper>

      <UIWrapper>
        {ceilings.map((el) => (
          <FloorSection key={el} isFirstFloor={el === 1}>
            <Ceiling />
            <LiftAndButtonWrapper id={`floor-${el}`}>
              <ButtonWrapper>
                {el !== floors && (
                  <UpButton onClick={(e) => moveLift(el, e)}> Up </UpButton>
                )}
                {el !== 1 && (
                  <DownButton onClick={(e) => moveLift(el, e)}>
                    {" "}
                    Down{" "}
                  </DownButton>
                )}
              </ButtonWrapper>
            </LiftAndButtonWrapper>
          </FloorSection>
        ))}
        <LiftSection id="lift-section" floors={floors}>
          {liftsUI.map((lift) => (
            <Lift id="lift" key={lift}>
              <LeftDoor id="left-door" />
              <RightDoor id="right-door" />
            </Lift>
          ))}
        </LiftSection>
      </UIWrapper>
    </MainWrapper>
  );
}

export default App;

const MainWrapper = styled.div`
  padding: 10px;
  min-height: 100vh;
  box-sizing: border-box;
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LiftInput = styled.div`
  margin-top: 10px;
`;
const FloorInput = styled.div``;
const Label = styled.label`
  margin-right: 5px;
`;
const Button = styled.button`
  width: 50px;
  margin-top: 10px;
`;

const UIWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 30px;
  align-items: center;
`;

const Ceiling = styled.div`
  border: 2px solid black;
  margin-bottom: 5px;
`;

const FloorSection = styled.div`
  height: ${({ isFirstFloor }) => (isFirstFloor ? "40px" : "120px")};
  width: 60%;
`;

const UpButton = styled.button`
  background-color: #81c784;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
`;
const DownButton = styled.button`
  background-color: #e57373;
  padding: 5px 10px;
  margin-top: 5px;
  border: none;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50px;
`;

const LiftSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 40px 0 80px;
  width: 500px;
`;

const Lift = styled.div`
  height: 80px;
  width: 80px;
  margin-right: 2px;
  display: flex;
`;

const LiftAndButtonWrapper = styled.div`
  display: flex;
`;

const LeftDoor = styled.div`
  width: 35px;
  background-color: #42a5f5;
`;
const RightDoor = styled.div`
  width: 35px;
  background-color: #42a5f5;
`;
