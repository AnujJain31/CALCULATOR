const display = document.getElementById('num-display');

let current = "0";
let previous = null;
let operator = null;
let resetNext = false;
let gstRate = 18;
let stepCheck = [];
let stepCheckIndex = -1;
let isScrolling = false;

function updateDisplay() {
    display.value = current;
}

function inputDigit(digit){
    isScrolling = false;
    if (resetNext) {
        current = (digit === "00") ? "0" : digit;
        resetNext = false;
    } else if (current === "0") {     
        current = (digit === "00") ? "0" : digit;
    } else {
        current += digit;
    }
    updateDisplay();
}

function inputDecimal(){
    if (resetNext){
        current = "0.";
        resetNext = false;
        updateDisplay();
        return;
    }
  if (!current.includes(".")){
    current += ".";
    updateDisplay();
  }
}
function clearAll(){
    current = "0";
    previous = null;
    operator = null;
    resetNext = false;
    stepCheck = [];
    stepCheckIndex = -1;
    updateDisplay();
}

function clearEntry(){
    current = "0";
    updateDisplay();
}

function toggleSign(){
    if (current === "0") return;
    current = current.startsWith("-")? current.slice(1): "-" + current;
    updateDisplay()
}

function percent(){
    const val = parseFloat(current);
    if (operator && previous!== null){
    current = String((parseFloat(previous)*val)/100);
    }else{
        current = String(val/100);
    }
    resetNext = true;
    updateDisplay();
}

function sqrt(){
    const val = parseFloat(current);
    current = val < 0 ? "Error" : String(Math.sqrt(val));
    resetNext = true;
    updateDisplay(); 
}
 
function gstPlus(){
    const val =parseFloat(current);
    current = String(val + (val * gstRate) / 100);
    resetNext = true;
    updateDisplay();
}

function gstMinus(){
    const val =parseFloat(current);
    current = String((val / (1 + gstRate / 100)).toFixed(2));
    resetNext = true;
    updateDisplay();
}

function setRate(){
    const input = prompt("Enter GST rate (%)", gstRate);
    const num = parseFloat(input);
    if (!isNaN(num)) gstRate = num;
}

function chooseOperator(op){
    if (operator && !resetNext) {
        calculate();
    }else if (!resetNext){
        if(stepCheck.length === 0 || stepCheck[stepCheck.length -1]!== current){
            stepCheck.push(current);
            stepCheckIndex = stepCheck.length;
        }
    }
    previous = current;
    operator = op;
    resetNext = true;
}

function stepCheckup(){
    if (!isScrolling && !resetNext && (stepCheck.length === 0 || stepCheck[stepCheck.length -1]!== current)){
        stepCheck.push(current);
        stepCheckIndex = stepCheck.length;
    }
    isScrolling = true;
    if(stepCheck.length === 0) return;
     if(stepCheckIndex > 0) stepCheckIndex--; 
    display.value = stepCheck[stepCheckIndex];
   
}

function stepCheckdown(){
    if(!isScrolling && !resetNext && (stepCheck.length === 0 || stepCheck[stepCheck.length -1] !== current)){
        stepCheck.push(current);
        stepCheckIndex = stepCheck.length -1;
    }
    isScrolling = true;
    if(stepCheck.length === 0) return;
    if (stepCheckIndex < stepCheck.length - 1) stepCheckIndex++;
    display.value = stepCheck[stepCheckIndex];
}

function backSpace(){
    if (resetNext) return;
    if(current.length === 1 || (current.length === 2 && current.startsWith("-"))){
        current = "0";
    }else{
        current = current.slice(0, -1);
    }
    updateDisplay();
}
function calculate(){
    if (operator === null || previous === null) return;

    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result;

    switch(operator){
        case "+" :
        result = a + b;
        break;
        case "-" :
        result = a - b;
        break;           
        case "×" :
        result = a * b;
        break;
        case "÷" :
        result = b === 0 ? "Error" : a / b;
        break;
        default : return;
    }
    if(stepCheck.length === 0 || stepCheck[stepCheck.length -1] !== current){
        stepCheck.push(current);
        stepCheckIndex = stepCheck.length;
    }
    current = String(result);
    operator = null;
    previous = null;
    resetNext = true;
    updateDisplay();
}
 
document.querySelectorAll(".button").forEach((btn) => {
    btn.addEventListener("click", () => {
        const label = btn.textContent.trim();

        if (btn.classList.contains("number")){
            inputDigit(label);
            return;
        }
        switch(label){
            case "ON/AC":
                clearAll();
                break;
               case "CE":
                clearEntry();
                break;
                case "+/-":
                toggleSign();
                break;
                case ".":
                inputDecimal();
                break;
                case "%":
                percent();
                break;
                case String.fromCharCode(8730):
                sqrt();
                break;
                case "GST+" :
                gstPlus();
                break;
                 case "GST-" :
                gstMinus();
                break;
                case "RATE":
                setRate();
                break;
                case "+":
                case "-":
                case "×":
                case "÷":
                chooseOperator(label);
                break;
                case "=":
                calculate();
                break;
                case String.fromCharCode(9654):
                backSpace();
                break;
                case String.fromCharCode(8659):
                stepCheckdown()
                break;
                case String.fromCharCode(8657):
                stepCheckup()
                break;
            default:
            break;
        }
    })
})

updateDisplay();