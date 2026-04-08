//state object 
let state = {
    currentStep: 1,
    selectedShapeType: null,
    inputValue: ""
};

//shapeDetails to store all shapes details
const shapesDetails = {
    circle: {
        id: 'circle',
        name: 'Circle',
        className: 'circle',
        promptText: '2. Enter Radius',
        unit: 'r',
        unitName: 'RADIUS',
        areaFormulaText: "πr²",
        perimeterFormulaText: '2πr',
        calculateArea: (val) => Math.PI * val * val,
        calculatePerimeter: (val) => 2 * Math.PI * val
    },
    triangle: {
        id: 'equilateral-triangle',
        name: 'Equilateral Triangle',
        className: 'equilateral-triangle',
        promptText: '2. Enter Side (Base & Height)',
        unit: 's',
        unitName: 'SIDE',
        areaFormulaText: '0.433 * s * s',
        perimeterFormulaText: '3 * s',
        calculateArea: (val) => (Math.sqrt(3) / 4) * val * val,
        calculatePerimeter: (val) => 3 * val
    },
    square: {
        id: 'square',
        name: 'Square',
        className: 'square',
        promptText: '2. Enter Side',
        unit: 's',
        unitName: 'SIDE',
        areaFormulaText: 's * s',
        perimeterFormulaText: '4 * s',
        calculateArea: (val) => val * val,
        calculatePerimeter: (val) => 4 * val
    }
};

//getting dom elements by their id
const stepOne = document.getElementById('stepOne');
const stepTwo = document.getElementById('stepTwo');
const stepThree = document.getElementById('stepThree');
const shapeCards = document.querySelectorAll('.shape-card');
const nextBtn = document.getElementById('nextBtn');
const dynamicInputTitle = document.querySelector('.dynamic-input');
const shapeInput = document.querySelector('.shape-input');
const calculateBtn = document.getElementById('calculateButton');
const resultShapeIcon = document.getElementById('resultShapeIcon');
const resultShapeName = document.getElementById('resultShapeName');
const resultUnitName = document.getElementById('resultUnitName');
const resultUnit = document.getElementById('resultUnit');
const resultInputDisplay = document.getElementById('resultInputDisplay');
const resultAreaFormula = document.getElementById('resultAreaFormula');
const resultAreaDisplay = document.getElementById('resultAreaDisplay');
const resultPerimeterFormula = document.getElementById('resultPerimeterFormula');
const resultPerimeterDisplay = document.getElementById('resultPerimeterDisplay');
const startAgainBtn = document.getElementById('startAgainBtn');

//session storage functions
/**
 * saving state to the session storage
 */
function saveState() {
    state.inputValue = shapeInput.value;
    sessionStorage.setItem("state", JSON.stringify(state));
}

/**
 * get state from session storage
 */
function loadState() {
    const savedData = sessionStorage.getItem("state");
    if (savedData) {
        state = JSON.parse(savedData);
        shapeInput.value = state.inputValue;
        //persist step1 details
        if (state.selectedShapeType) {
            shapeCards.forEach(card => {
                const shape = card.querySelector('.shape-card__shape');
                const type = shape.classList.contains('circle') ? 'circle' :
                    shape.classList.contains('equilateral-triangle') ? 'triangle' : 'square';
                if (type === state.selectedShapeType) {
                    card.classList.add('active');
                    nextBtn.style.display = 'block';
                }
            });
        }
        // persist step2 details
        if (state.currentStep === 2) {
            dynamicInputTitle.textContent = shapesDetails[state.selectedShapeType].promptText;
        } else if (state.currentStep === 3) {
            runCalculation();
        }
        showStep(state.currentStep);
    } else {
        resetState();
    }
}

/**
 * resetState remove the state from session storage and set the state properties to the initial state values
 */
function resetState() {
    sessionStorage.removeItem("state");
    state = { currentStep: 1, selectedShapeType: null, inputValue: "" };
    shapeInput.value = "";
    const currentActiveShape = document.querySelector('.shape-card.active');
    if (currentActiveShape) {
        currentActiveShape.classList.remove('active');
    }
    nextBtn.style.display = 'none';
    showStep(1);
}

/**
 * show step function uses to hide the others steps other than current step
 * @param step 
 */
function showStep(step) {
    stepOne.style.display = step === 1 ? 'flex' : 'none';
    stepTwo.style.display = step === 2 ? 'flex' : 'none';
    stepThree.style.display = step === 3 ? 'flex' : 'none';
}

/**
 * run calculation function perform operations for the shape area and perimeter and update the shape details table
 */
function runCalculation() {
    const val = parseFloat(shapeInput.value);
    if (!isNaN(val) && val > 0) {
        const shape = shapesDetails[state.selectedShapeType];
        resultShapeIcon.className = `shape-icon ${shape.className}`;
        resultShapeName.textContent = shape.name;
        resultUnitName.textContent = shape.unitName;
        resultUnit.textContent = shape.unit;
        resultInputDisplay.textContent = `${val} cm`;
        resultAreaFormula.textContent = shape.areaFormulaText;
        resultAreaDisplay.textContent = `${(Math.trunc(shape.calculateArea(val) * 100) / 100)} sq cm`;
        resultPerimeterFormula.textContent = shape.perimeterFormulaText;
        resultPerimeterDisplay.textContent = `${(Math.trunc(shape.calculatePerimeter(val) * 100) / 100)} cm`;
        showStep(3);
    } else if (state.currentStep !== 1) {
        alert("Please enter a valid positive number.");
        resetState();
    }
}

// eventlistener for every shape to listen the selected shape 
shapeCards.forEach(card => {
    card.addEventListener('click', () => {
        const currentActiveShape = document.querySelector('.shape-card.active');
        if (currentActiveShape) {
            currentActiveShape.classList.remove('active');
        }
        card.classList.add('active');
        const shapeElement = card.querySelector('.shape-card__shape');
        if (shapeElement.classList.contains('circle')) state.selectedShapeType = 'circle';
        if (shapeElement.classList.contains('equilateral-triangle')) state.selectedShapeType = 'triangle';
        if (shapeElement.classList.contains('square')) state.selectedShapeType = 'square';
        nextBtn.style.display = 'block';
        saveState();
    });
});

//event listener for nextStep button
nextBtn.addEventListener('click', () => {
    if (state.selectedShapeType) {
        state.currentStep = 2;
        dynamicInputTitle.textContent = shapesDetails[state.selectedShapeType].promptText;
        saveState();
        showStep(2);
    }
});

//event listener for calculate button
calculateBtn.addEventListener('click', () => {
    state.currentStep = 3;
    saveState();
    runCalculation();
});

//event listener for start again button
startAgainBtn.addEventListener('click', resetState);
//load state 
loadState();