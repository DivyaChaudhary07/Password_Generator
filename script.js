const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[ data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const exDup=document.querySelector("#Ex-duplicates");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButon")
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

const symbols='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initial
let password="";
let passwordLength=10;
let checkCount=0;
handleslider();
//set circle strength to grey
setIndicator("#ccc");

//password length jo UI pr reflect krwata hai
function handleslider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
    
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max)
{
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber()
{
    return getRndInteger(0,10);
}

function generateLowerCase()
{
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase()
{
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols()
{
    const randIndex=getRndInteger(0,symbols.length);
    return symbols.charAt(randIndex);
}

function calcStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasNumber=false;
    let hasSymbol=false;

    if(uppercaseCheck.checked)  hasUpper=true;
    if(lowercaseCheck.checked)  hasLower=true;
    if(numbersCheck.checked)    hasNumber=true;
    if(symbolsCheck.checked)    hasSymbol=true;

    if(hasUpper&&hasLower&&(hasNumber||hasSymbol)&&passwordLength>=8)
    {
        setIndicator("#0f0");
    }
    else if((hasLower||hasUpper)&&(hasNumber||hasSymbol)&&passwordLength>=6)
    {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}
function handleCheckBoxChange()
{
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        {
            checkCount++;
        }
    })

    //special condition
    if(passwordLength<checkCount)
    {
        passwordLength=checkCount;
        handleslider();
    }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("change",handleCheckBoxChange);
})

async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e)
    {
        copyMsg.innerText="failed";
    }
    // to make copy copy vala span visible
    copyMsg.classList.add("active");

    //removing the copy vala span after 2secs
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000)

}

inputSlider.addEventListener("input",(e)=>{
    passwordLength=e.target.value;
    handleslider();
})

copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
})
function shufflePassword(passArr)
{
    //fisher yates algorithm
    for(let i=passArr.length-1;i>0;i--)
    {
        const j=Math.floor(Math.random()*(i+1));
        const temp=passArr[i];
        passArr[i]=passArr[j];
        passArr[j]=temp;
    }
    let str="";
    passArr.forEach((el)=>{
        str+=el;
    })
    return str;
}
generateBtn.addEventListener("click",()=>{

    if(checkCount==0||(checkCount==1&&exDup.checked)) 
    {
        return;
    }

    if(passwordLength<checkCount)
    {
        if(!exDup.checked)
            passwordLength=checkCount;
        else passwordLength=checkCount-1;
        handleslider();
    }


    // let's start the journey to find the new password

    //remove old password
    password="";

    if(checkCount==2&&numbersCheck.checked&&exDup.checked)
    {
        for(let i=0;i<10;i++)
        {
            let randomChar=generateRandomNumber();
            !password.includes(randomChar)?password+=randomChar:i--;
        }
        passwordLength=10;
        handleslider();
        password=shufflePassword(Array.from(password));
        passwordDisplay.value=password;
        setIndicator("#ccc");
        return;
    }

    // let's put the stuff mentioned by the checkboxes

    // if(uppercaseCheck.checked)
    // {
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked)
    // {
    //     password+=generateLowererCase();
    // }
    // if(numbersCheck.checked)
    // {
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked)
    // {
    //     password+=generateSymbols();
    // }
    
    let funcArr=[];
    if(uppercaseCheck.checked)
     {
        funcArr.push(generateUpperCase);
     }
     if(lowercaseCheck.checked)
     {
        funcArr.push(generateLowerCase);
     }
     if(numbersCheck.checked)
     {
        funcArr.push(generateRandomNumber);
     }
     if(symbolsCheck.checked)
     {
        funcArr.push(generateSymbols);
     }
     //compulory addition
     for(let i=0;i<funcArr.length;i++)
     {
        let randomChar=funcArr[i]();
        if(exDup.checked)
        {
            !password.includes(randomChar)?password+=randomChar:i--;
        }
        else{
            password+=randomChar;
        }
     }
     
     //remaining addition
     for(let i=0;i<(passwordLength-funcArr.length);i++)
     {
        let randIndex=getRndInteger(0,funcArr.length);
        let randomChar=funcArr[randIndex]();
        if(exDup.checked)
        {
            !password.includes(randomChar)?password+=randomChar:i--;
        }
        else{
            password+=randomChar;
        }
       
     }
     
     //shufle the password
     password=shufflePassword(Array.from(password));
    
     //show in UI
     passwordDisplay.value=password;

     //calculate strength
     calcStrength();
})