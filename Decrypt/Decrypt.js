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
    hideOther(selectElement.value);
}

//Mod function
function mod(a, b){
    if (a >= 0)
        return a%b;
    else
        return -(parseInt(a/b - 1) * b - a);
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

function shiftDecrypt(ciphertext){
    
    let key = document.getElementById("select-key").value;
    key = parseInt(key)
    let plaintext = '';
    ciphertext = ciphertext.toLowerCase();

    for (let i = 0; i < ciphertext.length; i++) {
        // Get the character code of the current character
        let charCode = ''
        if (ciphertext.charCodeAt(i) === 32)
            charCode = ciphertext.charCodeAt(i);
        else
            charCode = ((ciphertext.charCodeAt(i) - 97 + (26 - key)) % 26) + 97;
        // Increment the character code by the specified amount
        // Append the new character to the result string
        plaintext += String.fromCharCode(charCode);
    }
    return plaintext;
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

//ax + by = gcd(a,b) => x = a^-1 (mod b)
function modinv(a, m){
    // Implements the extended Euclidean algorithm
    function extendedEuclidean(a, b) {
        if (a === 0) {
            return [b, 0, 1];
        }

        const [gcd, x1, y1] = extendedEuclidean(b % a, a);
        const x = y1 - Math.floor(b / a) * x1;
        const y = x1;
        return [gcd, x, y];
    }

    const [gcd, x, y] = extendedEuclidean(a, m);
    
    if (gcd !== 1) {
        // Modular inverse does not exist
        return null;
    }

    // Ensure the result is positive
    let result = x % m;
    if (result < 0) {
        result += m;
    }

    return result;
}

function AffineDecrypt(ciphertext){
    let firstkey = parseInt(document.getElementById("first-key").value);
    let secondkey = parseInt(document.getElementById("second-key").value);
    let plaintext = '';
    let keyInv = modinv(firstkey, 26);
    ciphertext = ciphertext.toLowerCase();
    

    for(let i = 0; i < ciphertext.length; i++){
        let charCode = '';
        if (ciphertext.charCodeAt(i) === 32)
            charCode = ciphertext.charCodeAt(i);
        else 
            //x = a^-1(x - b) % 26
            charCode = mod(keyInv * (ciphertext.charCodeAt(i) - 97 - secondkey), 26) + 97;
        plaintext += String.fromCharCode(charCode);
    }
    

    return plaintext;
}

//--------------------------------------------------------------------Vigenère Cipher-----------------------------------------------------------
function VigenereDecrypt(ciphertext){
    let key = document.getElementById("Vig-psw").value;
    let lKey = key.length;
    let plaintext = '';
    ciphertext = ciphertext.toLowerCase();
    
    for(let i = 0; i < ciphertext.length; i++){
        let charCode = '';
        if (ciphertext.charCodeAt(i) === 32)
            charCode = ciphertext.charCodeAt(i);
        else
            //c[i] = p[i] + k[i % len(k)]
            charCode = mod(ciphertext.charCodeAt(i) -  key.charCodeAt(i % lKey), 26) + 97;
        
        plaintext += String.fromCharCode(charCode);
    }
    return plaintext;
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

function RailFenceDecrypt(ciphertext){
    let key = document.getElementById('Rail-psw').value;
    key = parseInt(key);
    let count = []
    ciphertext = ciphertext.toLowerCase()
    let plaintext = '';

    //Declare key rails
    let rail = [];
    for (let i = 0; i < key; i++){
        count[i] = 0;
    }

    //Append letter into rail
    let i = 0;
    let j = 0;
    let state = true; //When state = true: append down, false: append up
    while (i < ciphertext.length){
        if (state == true){
            count[j]++;
            if (j != key - 1)
                j++;
            else 
                j--;
        }
        else{
            count[j]++;
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
    let k = 0;
    let start = 0;
    let end = 0;
    for (let i = 0; i < key; i++){
        end = start + count[i];
        let text = ciphertext.slice(start, end);
        rail.push(text.split(""));
        start += count[i];
    }

    i = 0;
    j = 0;
    state = true; //When state = true: append down, false: append up
    while (i < ciphertext.length){
        if (state == true){
            plaintext += rail[j].slice(0, 1);
            rail[j] = rail[j].slice(1);
            if (j != key - 1)
                j++;
            else 
                j--;
        }
        else{
            plaintext += rail[j].slice(0, 1);
            rail[j] = rail[j].slice(1);
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

    return plaintext;
}

//-------------------------------------------------------------------------Encrypt--------------------------------------------------------------
//Click the button
let button = document.getElementById("decrypt");

// Add an event listener for the "click" event
button.addEventListener("click", function() {
    let type = document.getElementById("type").value;
    let ciphertext = document.getElementById("ciphertext").value
    if (type == "Shift")
        document.getElementById("plaintext").innerHTML = shiftDecrypt(ciphertext);
    else if(type == "Affine")
        document.getElementById("plaintext").innerHTML = AffineDecrypt(ciphertext);
    else if(type == "Vig")
        document.getElementById("plaintext").innerHTML = VigenereDecrypt(ciphertext);
    else
        document.getElementById("plaintext").innerHTML = RailFenceDecrypt(ciphertext);
});

//Copy the ciphertext
function copyText() {
    let textarea = document.getElementById("plaintext");
    textarea.select(); // Select the textarea content
    document.execCommand("copy"); // Copy the selected content to the clipboard
    alert("Text copied to clipboard!");
}

// Add event listener to the copy button
document.getElementById("copy").addEventListener("click", copyText);