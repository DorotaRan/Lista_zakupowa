let inputList = [];
let inputId = 0;
let totalInput = 0;
let categoryHeading ='';
let measure;
let category;
let inputUl = document.getElementById('inputList');
let inputForm = document.getElementById('inputForm');
let inputTypeError = document.getElementById('inputTypeError');
let inputAmountError = document.getElementById('inputAmountError');
let measures = document.getElementsByName("measures");
let categories = document.getElementsByName("categories");

inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let radioValid = false
    for(let i = 0; i < measures.length; i++) {
        if(measures[i].checked) {
            measure = measures[i].value;
            radioValid = true
        }
    }
    let selectValid = false
    for(let i = 0; i < categories.length; i++){
        if(categories[i].selected) {
            category = categories[i].value;
            selectValid = true
        }
    }
    let inputType = event.target.elements[0];
    let inputAmount = event.target.elements[1];
    let inputMeasure = event.target.elements[2]
    let inputCategory = event.target.elements[3];
    let input = {
        name: inputType.value, 
        amount: inputAmount.value,
        measure: measure,
        category: category,
        id: inputId
    }
    if (inputType.value.length > 2) {
        inputType.classList.remove('input-danger');
        inputTypeError.innerText = '';
    } 
    if (inputAmount.value) {
        inputAmount.classList.remove('input-danger');
        inputAmountError.innerText = '';
    } 
    if (radioValid == true)  {
        inputMeasure.classList.remove('input-danger');
        inputMeasureError.innerText = '';
    }
    if (selectValid == true) {
        inputCategory.classList.remove('input-danger');
        inputCategoryError.innerText = '';
    }
    if (inputType.value.length > 2 && inputAmount.value && radioValid == true && selectValid == true) {
        inputId++;
        inputList.push(input);
        localStorage.setItem('inputList',JSON.stringify(inputList));
        document.getElementById("inputForm").reset();
        updateInputList();
        updateInputCounter()
    } else {
        if (inputType.value.length < 3) {
            inputType.classList.add('input-danger');
            inputTypeError.innerText = 'za krótki opis - min. 3 znaki!';
        } if (!inputAmount.value)  {
            inputAmount.classList.add('input-danger');
            inputAmountError.innerText = 'wprowadź ilość';
        } if (radioValid == false)  {
            inputMeasure.classList.add('input-danger');
            inputMeasureError.innerText = 'wybierz wartość';
        } if (selectValid == false) {
            inputCategory.classList.add('input-danger');
            inputCategoryError.innerText = 'wybierz wartość';
        }
    };
});

function onRemoveInputBtnClicked(event) {
    inputList = inputList.filter(function(elem) {
        return Number(elem.id) !== Number(event.target.id);
    })
    updateInputList();
    updateInputCounter()
    localStorage.setItem('inputList',JSON.stringify(inputList));
}

function onEditInputBtnClicked(currentInput) {
    const inputEditElem = document.getElementById(`inputContainer-${currentInput.id}`);
    inputEditElem.innerHTML = `<input id='saveInputName-${currentInput.id}' value=${currentInput.name}></input>
                                <input id='saveInputAmount-${currentInput.id}' value=${currentInput.amount}></input>
                                <input id='saveInputMeasure-${currentInput.id}' value=${currentInput.measure}></input>
                                <input id='saveInputCategory-${currentInput.id}' value=${currentInput.category}></input>
                                <button onclick='onEditInputDataSave(${currentInput.id})'>Zapisz</button>`;
}

function onEditInputDataSave(id) {
    let newInputNameElem = document.getElementById(`saveInputName-${id}`);
    let newInputName  = newInputNameElem.value;
    let newInputAmountElem = document.getElementById(`saveInputAmount-${id}`);
    let newInputAmount = newInputAmountElem.value;
    let newInputMeasureElem = document.getElementById(`saveInputMeasure-${id}`);
    let newInputMeasure = newInputMeasureElem.value;
    let newInputCategoryElem = document.getElementById(`saveInputCategory-${id}`);
    let newInputCategory = newInputCategoryElem.value;
    inputNew = inputList.find(function(elem) {
        return elem.id === id;
    })
    inputNew.name = newInputName;
    inputNew.amount = newInputAmount;
    inputNew.measure = newInputMeasure;
    inputNew.category = newInputCategory;
    updateInputList();
    updateInputCounter()
    localStorage.setItem('inputList',JSON.stringify(inputList));
}

const updateInputList = () => {
    inputUl.innerHTML = '';
    inputList.forEach((input) => {
        categoryTitle = document.createElement('div')
        inputUl.appendChild(categoryTitle);
        categoryTitle.innerText = input.category; 
        let li = document.createElement('li');
        li.classList.add('list','list-group-item', 'flex-container', 'align-items-center', 'justify-content-between');
        li.id = `inputContainer-${input.id}`;
        let main = document.createElement('main');
        main.classList.add('main');
        let heading = document.createElement('h4');
        let paragraph = document.createElement('p');
        let buttonEdit  = document.createElement('button');
        buttonEdit.classList.add('btn', 'btn-secondary', 'btn-sm', 'button-change');
        buttonEdit.innerText = 'Zmień';
        buttonEdit.id = `buttonEdit-${input.id}`;
        buttonEdit.addEventListener('click', function() {
            onEditInputBtnClicked(input);
        });
        let buttonRemove = document.createElement('button');
        buttonRemove.classList.add('btn', 'btn-danger', 'btn-sm');
        buttonRemove.innerText = 'Usuń';
        buttonRemove.id = input.id;
        buttonRemove.addEventListener('click', onRemoveInputBtnClicked);
        heading.innerText = input.name;
        categoryTitle.appendChild(li);
        paragraph.innerText = input.amount+' '+input.measure;
        main.appendChild(heading);
        main.appendChild(paragraph);
        li.appendChild(main);
        li.appendChild(buttonEdit);
        li.appendChild(buttonRemove);
    })
}

function updateInputCounter(elem) {
    let inputCounter=document.getElementById('inputSummary');
    let sum = 0;
        inputList.forEach(function(elem) { 
            sum = inputList.length;
        })
        inputCounter.innerText  =  'Pozycji na liście: ' + sum;
        totalInput = sum;
}

const getInputList = () => {
    if (localStorage.getItem('inputList')) {
        inputList = JSON.parse(localStorage.getItem('inputList'));
        let maxInputId = 0;
        inputList.map(function(obj){     
            if (obj.id > maxInputId) maxInputId = obj.id;    
        });
        inputId = Number(maxInputId) +1;
        updateInputList();
    } else {
        inputList=[];
    }
}; 
getInputList();
updateInputCounter()