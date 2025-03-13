var curStep = "whatToCook";
var conversation = "";

conversation = aiSpeaks(conversation, "👩‍🍳 Welcome to the Cooking Recipe Assistant! 👩‍🍳");
conversation = aiSpeaks(conversation, "Type 'exit' at any time to quit.")
conversation = aiSpeaks(conversation, "🍽️ What dish do you want to cook? ")



var dish = ""
const pref = ""

// Sending request to backend api
document.getElementById("myForm").addEventListener("submit", function(event) {

    event.preventDefault()

    conversation = youSpeak(conversation)
    // document.getElementById("conversation").value = conversation

    if (document.getElementById("prompt").value == "exit") {
        conversation = aiSpeaks(conversation, "Goodbye! Happy cooking! 🍴");
        exitProg();
    }

    console.log(`current step: ${curStep}`)

    var contVal = ""
    

    switch (curStep) {
        case "whatToCook":
            dish = document.getElementById("prompt").value;
            contVal = genRecipe(dish);
            break
        case "customization":

            if (document.getElementById("prompt").value == "yes") {
                
                document.getElementById("prompt").value = "";
                conversation = aiSpeaks(conversation, `Please enter your preferencee (e.g., vegetarian, gluten-free, spicy): `);    

            } else if (document.getElementById("prompt").value == "no") {

                document.getElementById("prompt").value = "";
                curStep = "noCustomization";
                conversation = aiSpeaks(conversation, "Do you want more details (e.g., step-by-step instructions)? (yes/no): ")

            } else {
                curStep = "moreDetail";
                contVal = genCustomize(dish, document.getElementById("prompt").value);
            }
            
            break

        case "noCustomization":

            if (document.getElementById("prompt").value == "yes") {
                curStep = "repeatSteps";
                contVal = genDetails(dish);
            } else {
                curStep = "whatToCook";
                conversation = aiSpeaks(conversation, "🍽️ What dish do you want to cook? ");
                document.getElementById("prompt").value = "";
            }

            break;

        case "moreDetail":
            if (document.getElementById("prompt").value == "yes") {
                contVal = genDetails(dish);
                curStep = "repeatSteps";
            } else {
                curStep = "whatToCook";
                conversation = aiSpeaks(conversation, "🍽️ What dish do you want to cook? ")
                document.getElementById("prompt").value = "";
            }
    }

    console.log(curStep)
    console.log(contVal)
    

    if (curStep != "customization" && curStep != "noCustomization") {

    
        const formData = {
            content :  contVal
        }


        if (contVal != '') {

            // API request send out
            // fetch("http://127.0.0.1:5501/submit-form", {
            fetch("https://genaidemo-js-backend.onrender.com/submit-form", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            })
            .then(response => { 
                console.log("Raw resonse receive", response)
                return response.json()
            })
            .then(data => {
                conversation = aiSpeaks(conversation, data.message);
                document.getElementById("prompt").value = ""
                
                // console.log(`Inside api call, curStep: ${curStep}`)
                
                // console.log(conversation)

                switch (curStep) {

                    case "whatToCook":
                        // Moving on to next step
                        conversation = aiSpeaks(conversation, "Would you like to customize this recipe? (yes/no): ");
                        curStep = "customization";

                    // case "customization":
                        break
                    case "moreDetail":
                        conversation = aiSpeaks(conversation, "Do you want more details (e.g., step-by-step instructions)? (yes/no): ");
                        break;

                    case "repeatSteps":
                        curStep = "whatToCook";
                        conversation = aiSpeaks(conversation, "🍽️ What dish do you want to cook? ");


                    
                        

                }

            })

            .catch(error => console.error("Error here: ", error))
        }

    }

});


function aiSpeaks(cvst, sentences) {
    cvst += "GenAI: " + sentences + "\n\n";
    document.getElementById("conversation").value = cvst
    return cvst;
}

function youSpeak(cvst) {
    cvst += "You: " + document.getElementById("prompt").value + "\n\n";
    document.getElementById("conversation").value = cvst
    return cvst;
}

function genRecipe(dish) {
    return `Provide a recipe for ${dish}`
}

function genCustomize(dish, preference) {
    return `Adjust the recipe for ${dish} to meet these preferences: ${preference}`
}

function genDetails(dish) {
    return `Provide detailed step-by-step instructions for cooking ${dish}`
}

function exitProg() {

    document.getElementById("prompt").disabled = true;
    document.getElementById("smbt").disabled = true;
    curStep = "exit"

}