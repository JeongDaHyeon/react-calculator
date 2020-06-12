import * as React from "react";
import styled from "styled-components";

import Panel from "./Panel";
import Display from "./Display";
import ButtonGroup from "./ButtonGroup";
import Button from "./Button";
import History from "./History"


const Container = styled.div`
  margin: 30px auto;
  text-align: center;
`;

// TODO: History 내에서 수식 표시할 때 사용
const Box = styled.div`
  display: inline-block;
  width: 270px;
  height: 65px;
  padding: 10px;
  border: 2px solid #000;
  border-radius: 5px;
  text-align: right;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  cursor: pointer;
  h3 {
    margin: 0px;
  }
`;
// √(√(9x9))
const evalFunc = function(string) {
  // eslint-disable-next-line no-new-func
  return new Function("return (" + string + ")")();
};

const nestedRoute = function(string) {
  if(string.substr(0,1) == "√")
  {
    return Math.sqrt( nestedRoute( string.substring(2, string.length - 1) ) );
  }
  else
  {
    alert("?");
    string = string.replace("×", "*");
    string = string.replace("÷", "/");
    return evalFunc(string);
  }
}

let dot = true; // check dot is available

class Calculator extends React.Component {
  // TODO: history 추가
  state = {
    displayValue: "",
    history: []
  };

  onClickHistory = (event) => {
    let { displayValue = "" } = this.state;
    displayValue = event.target.className;
    if(event.target.tagName === "DIV")
    {
      displayValue = event.target.firstChild.innerText;
      // console.log(event.target.firstChild.innerText);
    }
    else
    {
      displayValue = event.target.className;
    }
    // if(event.target.tagName === "DIV")
    // {
    //   displayValue = event.target.firstChild.innerText;
    //   // console.log(event.target.firstChild.innerText);
    // }
    // if(event.target.className === "equation")
    // {
    //   displayValue = event.target.innerText;
    // }
    // else if(event.target.className === "result")
    // {
    //   displayValue = event.target.previousSibling.innerText;
    // }

    this.setState({ displayValue: displayValue });
  };


  onClickButton = key => {
    let { displayValue = "" } = this.state;
    displayValue = "" + displayValue;
    const lastChar = displayValue.substr(displayValue.length - 1);
    const fisrtChar = displayValue.substr(0, 1);
    const operatorKeys = ["÷", "×", "-", "+"];
    const proc = {
      AC: () => {
        dot = true;
        this.setState({ displayValue: "" });
      },
      BS: () => {
        if (displayValue.length > 0) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        }
        this.setState({ displayValue });
      },
      // TODO: 제곱근 구현
      "√": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          dot = true;
          var eq = displayValue;
          if(displayValue.substr(0,1) == "√")
          {
            displayValue = nestedRoute(displayValue);
          }
          else
          {
            displayValue = displayValue.replace("×", "*");
            displayValue = displayValue.replace("÷", "/");
            displayValue = evalFunc(displayValue);
          }
          displayValue =Math.sqrt(displayValue);
          this.setState({displayValue});
          this.state.history.unshift({equation:"√("+eq+")", result: displayValue});
        }
      },
      // TODO: 사칙연산 구현
      "÷": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) { // handling the lastchar is an operator
          this.setState({ displayValue: displayValue + "÷" });
          dot = true; // can use dot
        }
      },
      "×": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "×" });
          dot = true;
        }
      },
      "-": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "-" });
          dot = true;
        }
      },
      "+": () => {
        // + 연산 참고하여 연산 구현
        if (lastChar !== "" && !operatorKeys.includes(lastChar)) {
          this.setState({ displayValue: displayValue + "+" });
          dot = true;
        }
      },
      "=": () => {
        if (lastChar !== "" && operatorKeys.includes(lastChar)) {
          displayValue = displayValue.substr(0, displayValue.length - 1);
        }
        else if (lastChar !== "") {
          var eq = displayValue;
          if(fisrtChar === "√"){
            displayValue = Math.sqrt(evalFunc(displayValue.substring(2, displayValue.length - 1)));
          }
          else
          {
            displayValue = displayValue.replace("×", "*");
            displayValue = displayValue.replace("÷", "/");

            displayValue = evalFunc(displayValue);
          }
          this.setState({ displayValue });
          this.state.history.unshift({equation: eq, result: displayValue});

          dot = true;
        }
        this.setState({ displayValue });
      },
      ".": () => {
        if (lastChar !== "" && !operatorKeys.includes(lastChar) && dot) {
          this.setState({ displayValue: displayValue + "." });
          dot = false;
        }
      },
      "0": () => {
        if (Number(displayValue) !== 0) {
          displayValue += "0";
          this.setState({ displayValue });
        }
      }
    };

    if (proc[key]) {
      proc[key]();
    } else {
      // 여긴 숫자
      this.setState({ displayValue: displayValue + key });
    }
  };

  render() {
    return (
      <Container>
        <Panel>
          <Display displayValue={this.state.displayValue} />
          <ButtonGroup onClickButton={this.onClickButton}>
            <Button size={1} color="gray">
              AC
            </Button>
            <Button size={1} color="gray">
              BS
            </Button>
            <Button size={1} color="gray">
              √
            </Button>
            <Button size={1} color="gray">
              ÷
            </Button>

            <Button size={1}>7</Button>
            <Button size={1}>8</Button>
            <Button size={1}>9</Button>
            <Button size={1} color="gray">
              ×
            </Button>

            <Button size={1}>4</Button>
            <Button size={1}>5</Button>
            <Button size={1}>6</Button>
            <Button size={1} color="gray">
              -
            </Button>

            <Button size={1}>1</Button>
            <Button size={1}>2</Button>
            <Button size={1}>3</Button>
            <Button size={1} color="gray">
              +
            </Button>

            <Button size={2}>0</Button>
            <Button size={1}>.</Button>
            <Button size={1} color="gray">
              =
            </Button>
          </ButtonGroup>
        </Panel>
        {/* TODO: History componet를 이용해 map 함수와 Box styled div를 이용해 history 표시 */}
        <History>
          {this.state.history.map((history_, index) => {
            return (
              <Box onClick={this.onClickHistory} className={history_.equation}>
                <h3 className={history_.equation}>{history_.equation}</h3>
                <h3 className={history_.equation}>= {history_.result}</h3>
              </Box>
            )
          })}
        </History>
      </Container>
    );
  }
}

export default Calculator;
