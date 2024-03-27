document.getElementById("ciphertext").innerHTML = "";

//----------------------------------------------------------------Choose type of Cipher--------------------------------------------------------
//Hide all
function hideAll(){
    let Shift = document.getElementById("Shift");
    let Affine = document.getElementById("Affine");
    let Vig = document.getElementById("Vig");
    let RailFence = document.getElementById("Rail");


    Shift.classList.add("hidden");
    Affine.classList.add("hidden");
    Vig.classList.add("hidden");
    RailFence.classList.add("hidden");
}

//Hide other type
function hideOther(type){
    hideAll();
    let display = document.getElementById(type);
    
    display.classList.remove("hidden");
}
hideOther("Shift"); //Initially

function handleChange(selectElement) {
    console.log(selectElement.value)
    hideOther(selectElement.value);
}

//---------------------------------------------------------------------Shift Cipher------------------------------------------------------------
// Get the select element
let select = document.getElementById("select-key");
    
// Loop from 0 to 25 to generate options
for (let i = 0; i <= 25; i++) {
    // Create an option element
    let option = document.createElement("option");
    
    // Set the value and text of the option
    option.value = i;
    option.text = i;
    
    // Append the option to the select element
    select.appendChild(option);
}

function shiftEncrypt(plaintext){
    
    let key = document.getElementById("select-key").value;
    key = parseInt(key)
    let ciphertext = '';

    for (let i = 0; i < plaintext.length; i++) {
        // Get the character code of the current character
        let charCode = ''
        if (plaintext.charCodeAt(i) === 32)
            charCode = plaintext.charCodeAt(i);
        else
            charCode = ((plaintext.charCodeAt(i) - 97 + key) % 26) + 97;
        // Increment the character code by the specified amount
        // Append the new character to the result string
        ciphertext += String.fromCharCode(charCode);
    }
    return ciphertext.toUpperCase();
}
//---------------------------------------------------------------------Affine Cipher------------------------------------------------------------
function gcd(a, b) { 
    if (b === 0) { 
        return a; 
    } 
    return gcd(b, a % b); 
} 

// Get the select element
let select1 = document.getElementById("first-key");
let select2 = document.getElementById("second-key");
    
// Loop from 0 to 25 to generate options
for (let i = 0; i <= 25; i++) {
    // Create an option element
    let option1 = document.createElement("option");
    // Set the value and text of the option
    option1.value = i;
    option1.text = i;
    if (gcd(i,26) === 1){
        // Append the option to the select element
        select1.appendChild(option1);
    }   
    // Create an option element
    let option2= document.createElement("option");
    // Set the value and text of the option
    option2.value = i;
    option2.text = i;  
    select2.appendChild(option2);
}

function AffineEncrypt(plaintext){
    let firstkey = document.getElementById("first-key").value;
    let secondkey = document.getElementById("second-key").value;
    let ciphertext = '';

    for(let i = 0; i < plaintext.length; i++){
        let charCode = '';
        if (plaintext.charCodeAt(i) === 32)
            charCode = plaintext.charCodeAt(i);
        else 
            //y = (ax + b) % 26
            charCode = (((plaintext.charCodeAt(i) - 97)*parseInt(firstkey) + parseInt(secondkey)) % 26) + 97;
        //console.log(charCode - 97)
        ciphertext += String.fromCharCode(charCode);
    }

    return ciphertext.toUpperCase();
}

//--------------------------------------------------------------------Vigenère Cipher-----------------------------------------------------------
function VigenereEncrypt(plaintext){
    let key = document.getElementById("Vig-psw").value;
    let lKey = key.length;
    let ciphertext = '';
    
    for(let i = 0; i < plaintext.length; i++){
        let charCode = '';
        if (plaintext.charCodeAt(i) === 32)
            charCode = plaintext.charCodeAt(i);
        else
            //c[i] = p[i] + k[i % len(k)]
            charCode = ((plaintext.charCodeAt(i) + key.charCodeAt(i%lKey) - 97*2) % 26) + 97;
        //console.log(charCode - 97)
        ciphertext += String.fromCharCode(charCode);
    }
    return ciphertext.toUpperCase();
}

//-------------------------------------------------------------------RailFence Cipher-----------------------------------------------------------
function getTextLength() {
    let plaintext = document.getElementById('plaintext').value;

    // Concatenate the string "Enter your key < " with the integer
    let labelText = "Enter your key (an integer &lt " + plaintext.length + ")";

    // Find the label element by its id and set its text content to the concatenated string
    document.getElementById("RailFence").innerHTML = labelText;
}

let plaintext = document.getElementById('plaintext').value;

// Concatenate the string "Enter your key < " with the integer
let labelText = "Enter your key (an integer &lt " + plaintext.length + ")";

// Find the label element by its id and set its text content to the concatenated string
document.getElementById("RailFence").innerHTML = labelText;

function RailFenceEncrypt(plaintext){
    let key = document.getElementById('Rail-psw').value;
    key = parseInt(key);
    let ciphertext = '';

    //Declare key rails
    let rail = [];
    for (let i = 0; i < key; i++)
        rail[i] = [];

    //Append letter into rail
    let i = 0;
    let j = 0;
    let state = true; //When state = true: append down, false: append up
    while (i < plaintext.length){
        if (state == true){
            rail[j].push(plaintext[i]);
            if (j != key - 1)
                j++;
            else 
                j--;
        }
        else{
            rail[j].push(plaintext[i]);
            if (j != 0)
                j--;
            else
                j++;
        }
        if (j == 0 && state == false){
            state = true;
        }
        else if (j==key-1 && state == true){
            state = false;
        }
        i++;
    }
    
    //Get letter from rails to ciphertext
    for (let i = 0; i < key; i++)
        ciphertext += rail[i].join('');

    return ciphertext.toUpperCase();
}

//-------------------------------------------------------------------------Encrypt--------------------------------------------------------------
//Click the button
let button = document.getElementById("encrypt");

// Add an event listener for the "click" event
button.addEventListener("click", function() {
    let type = document.getElementById("type").value;
    let plaintext = document.getElementById("plaintext").value
    if (type == "Shift")
        document.getElementById("ciphertext").innerHTML = shiftEncrypt(plaintext);
    else if(type == "Affine")
        document.getElementById("ciphertext").innerHTML = AffineEncrypt(plaintext);
    else if(type == "Vig")
        document.getElementById("ciphertext").innerHTML = VigenereEncrypt(plaintext);
    else
        document.getElementById("ciphertext").innerHTML = RailFenceEncrypt(plaintext);
});

//Copy the ciphertext
function copyText() {
    let textarea = document.getElementById("ciphertext");
    textarea.select(); // Select the textarea content
    document.execCommand("copy"); // Copy the selected content to the clipboard
    alert("Text copied to clipboard!");
}

// Add event listener to the copy button
document.getElementById("copy").addEventListener("click", copyText);