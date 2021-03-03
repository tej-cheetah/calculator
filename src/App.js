import React, { useContext, useState } from 'react';
import './App.css';
import { ThemeContext } from './ThemeContext';

const standardButton = [["Mode", "Sign", "Square", "Square Root"], [1, 2, 3, 'Add (+)'], [4, 5, 6, 'Subtract (-)'], [7, 8, 9, 'Multiply (*)'], ['Clear', 0, '=', 'Divide (/)']];

function addbits(op1, operator, op2) {
  var total = 0;

  switch (operator) {
    case "+": return op1 + op2;
    case "-": return op1 - op2;
    case "*": return op1 * op2;
    case "/": return op1 / op2;
    default: break;
  }
  return total;
}

function App() {
  const [calcMode, setCalcMode] = useState({ button: standardButton, standard: true });
  const [operand, setOperand] = useState('');
  const [secondOperand, setSecondOperand] = useState(false);
  const [evalArr, setEvalArr] = useState([]);

  const calculateResult = (evaluateArr, operator) => {
    if (evaluateArr.length > 1 && evaluateArr[1] === "=") {
      evaluateArr.length = 0
      evaluateArr.push(operand)
      evaluateArr.push(operator)
      setEvalArr(evaluateArr)
    } else {
      operand && evaluateArr.push(operand)
      if (evaluateArr.length >= 3 && !evaluateArr.includes("=")) {
        let result = addbits(parseFloat(evaluateArr[0]), evaluateArr[1], parseFloat(evaluateArr[2]))
        if (result || result === 0) {
          evaluateArr.length = 0
          evaluateArr.push(result + "")
        }
        evaluateArr.push(operator)
        if (result || result === 0) { setOperand(result + "") }
        setEvalArr(evaluateArr)
      } else if (!evaluateArr.includes("=") && evaluateArr[0]) {
        evaluateArr.push(operator)
        setEvalArr(evaluateArr)
      }
    }
  }

  const createOperand = e => {
    if (isNaN(parseInt(e.target.textContent))) {
      let evaluationArr = [...evalArr]
      switch (e.target.textContent) {
        case "Add (+)": case "+": calculateResult(evaluationArr, "+"); evaluationArr.length > 0 && setSecondOperand(true); break;
        case "Subtract (-)": case "-": calculateResult(evaluationArr, "-"); evaluationArr.length > 0 && setSecondOperand(true); break;
        case "Multiply (*)": case "*": calculateResult(evaluationArr, "*"); evaluationArr.length > 0 && setSecondOperand(true); break;
        case "Divide (/)": case "/": calculateResult(evaluationArr, "/"); evaluationArr.length > 0 && setSecondOperand(true); break;
        case "Sign": setOperand(!operand.includes("-") ? "-" + operand : operand.replace('-', '')); break;
        case "Square": setOperand(!isNaN(operand) ? (operand * operand) + "" : "0"); break;
        case "Square Root": setOperand(!isNaN(operand) && !operand.includes("-") ? Math.sqrt(operand) + "" : "0"); break;
        case "=": calculateResult(evaluationArr, "="); break;
        case "Clear":
          setOperand('');
          setEvalArr([]); break;
        default: break;
      }
    } else {
      if (secondOperand) {
        setOperand(e.target.value)
        setSecondOperand(false)
      } else if (operand.length > 0 && !secondOperand) {
        setOperand(operand + e.target.value)
      } else {
        setOperand(e.target.value)
      }
    }
  }

  const toggleScience = (e) => {
    localStorage.setItem("standard", JSON.stringify())
    calcMode.standard ? setCalcMode({ button: calcMode.button, standard: false }) : setCalcMode({ button: standardButton, standard: true })
  }

  const { theme, toggle, dark } = useContext(ThemeContext)

  return (
    <div className="App">
      <header className="App-header" style={theme}>
        <div style={{display: "flex",
                    justifyContent: "space-evenly",
                    width: "600px"}}>
          <Button
            btnType = "checkbox"
            marginTop={"50px"}
            obj={`${!dark ? 'Light' : 'Dark'} theme`}
            createOperand={toggle}
            styleClass={"Btn-Comp Mode-btn-style"}
            theme={theme} />
          <h2>{calcMode.standard ? "Standard" : "Scientific"} Calculator</h2>
        </div>
        <div id="screen" className="Led-Panel">
          <input className="Input" readOnly value={operand} style={{background: theme.inputColor}}/>
        </div>
        <div className="Operation-Panel">
          {
            standardButton.map((element) => {
              return (
                <div key={element}>
                  {element.map(obj => {
                    const operationToPerform = obj === "Mode" ? toggleScience : createOperand;
                    let styleToApply = obj === "Mode" ? "Btn-Comp Mode-btn-style" : "Btn-Comp";
                    styleToApply = (obj === "Sign" || obj === "Square" || obj === "Square Root") && calcMode.standard ? styleToApply + " disable-sci-button" : styleToApply;
                    let disableBtn = (obj === "Sign" || obj === "Square" || obj === "Square Root") && calcMode.standard
                    return (<Button
                      btnType = "button"
                      key={obj}
                      obj={obj}
                      disableBtn={disableBtn}
                      createOperand={operationToPerform}
                      styleClass={styleToApply}
                      theme={theme} />
                    )
                  })}
                </div>
              )
            })
          }
        </div>
        <div>
        </div>
      </header>
    </div>
  );
}

const Button = React.memo(function Button({ obj, createOperand, styleClass, disableBtn, theme, marginTop, btnType }) {
  return <button
    type={btnType}
    className={styleClass}
    value={obj}
    style={{
      marginTop: marginTop,
      backgroundColor: styleClass.includes("Mode") || theme.backgroundColor,
      color: disableBtn || theme.color
    }}
    onClick={createOperand}
    disabled={disableBtn}><strong>{obj}</strong></button>
})

export default App;
