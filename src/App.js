import React, { useState } from 'react';
import './App.css';

function App() {
  const standardButton = [["Mode"], [1, 2, 3, 'Add (+)'], [4, 5, 6, 'Subtract (-)'], [7, 8, 9, 'Multiply (*)'], ['Clear', 0, '=', 'Divide (/)']];
  const scientificButton = ['Mode', "Sign", "Square", "Square Root"];
  const [calcMode, setCalcMode] = useState({ button: standardButton, standard: true });
  const [operand, setOperand] = useState('');
  const [secondOperand, setSecondOperand] = useState(false);
  const [evalArr, setEvalArr] = useState([]);
  // const [evalStack, setEvalStack] = useState('');
  // const [signed, setSigned] = useState(false)

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


  const calculateResult = (evaluateArr, operator) => {
    if (evaluateArr.length > 1 && evaluateArr[1] === "=") { //&& evalStack.includes("=")
      evaluateArr.length = 0
      evaluateArr.push(operand)
      evaluateArr.push(operator)
      setEvalArr(evaluateArr)
      // setEvalStack(evalStack.substring(0, evalStack.length - 1) + operator)
    } else {
      // setEvalStack(evalStack + operator)
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
        // setEvalStack(evalStack + operator + operand)
      } else if (!evaluateArr.includes("=") &&  evaluateArr[0]) {
        evaluateArr.push(operator)
        setEvalArr(evaluateArr)
      }
    }
  }

  // useEffect(() => {
  //   if (signed && evalStack && evalStack.lastIndexOf(operand) < 0) {
  //     setEvalStack(evalStack.substring(0, evalStack.lastIndexOf(operand.replace("-", ""))) + operand); 
  //   }  else if (signed && evalStack && evalStack.lastIndexOf(operand) >= 0 ) {
  //     setEvalStack(evalStack.substring(0, evalStack.lastIndexOf(operand) - 1) + operand); 
  //   }
  //   setSigned(false);
  // }, [signed, operand])

  const createOperand = e => {
    if (isNaN(parseInt(e.target.value))) {
      let evaluationArr = [...evalArr]
      switch (e.target.value) {
        case "Add (+)": case "+": calculateResult(evaluationArr, "+"); evaluationArr.length > 0 && setSecondOperand(true); break;
        case "Subtract (-)": case "-": calculateResult(evaluationArr, "-"); evaluationArr.length > 0 && setSecondOperand(true); break;
        case "Multiply (*)": case "*": calculateResult(evaluationArr, "*"); evaluationArr.length > 0 && setSecondOperand(true); break;
        case "Divide (/)": case "/": calculateResult(evaluationArr, "/"); evaluationArr.length > 0 && setSecondOperand(true); break;
        case "Sign": setOperand(!operand.includes("-") ? "-" + operand : operand.replace('-', '')); break;  //setSigned(true);
        case "Square": setOperand((operand * operand) + ""); break;
        case "Square Root": setOperand(Math.sqrt(operand) + ""); break;
        case "=": calculateResult(evaluationArr, "="); break;
        case "Clear": 
          setOperand(''); 
          // setEvalStack(''); 
          setEvalArr([]); break;
        default: break;
      }
    } else {
      // setEvalStack(evalStack + e.target.value)
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
    calcMode.button.splice(0, 1, scientificButton)
    calcMode.standard ? setCalcMode({button: calcMode.button, standard: false}) : setCalcMode({ button: standardButton, standard: true })
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>{calcMode.standard ? "Standard" : "Scientific"} Calculator</h2>
        <div id="screen" className="Led-Panel">
          <input className="Input" readOnly value={operand} />
        </div>
        <div className="Operation-Panel">
          {
            calcMode.button.map((element, index) => {
              if (index > 0) {
                return (
                  <div key={element}>
                    {element.map(obj => <ChildButton key={obj} obj={obj} createOperand={createOperand}/>)}
                  </div>
                )
              } else {
                return ( 
                  <div key={element}>
                    {element.map(obj => <ChildButton key={obj} obj={obj} createOperand={obj === "Mode" ? toggleScience : createOperand}/>)}
                  </div>
                )
              }
            })
          } 
        </div>
        <div>
        {/* calcMode.standard &&  */}
          {/* {<p style={{ fontSize: "50%" }}>Evaluation stack: {evalStack}</p>} */}
        </div>
      </header>
    </div>
  );
}

const ChildButton = React.memo(function Button({ obj, createOperand }) {
  return <button className={obj === "Mode" ? "Btn-Comp Mode-btn-style" : "Btn-Comp"} value={obj} onClick={createOperand}>{obj}</button>
})

export default App;
