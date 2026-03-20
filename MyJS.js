function HideShow(id,show)
{
    var divToShowHide = document.getElementById(id);
    if (divToShowHide != null)
    {
        divToShowHide.style.display = show ? "flex" : "none"
    }
}

function OnAblityScoreChange(ability,score)
{
    //do math
    var mod = 0;
    console.log(ability + ": " + isNaN(score))
    if(isNaN(score) || score == "")
    {
        document.getElementById(ability + "Mod").value = "";
    }
    else
    {
        mod = Math.floor((score - 10) / 2);
        document.getElementById(ability + "Mod").value = mod;
    }   
    //update the boxes
    ability = ability.replace("temp","").toLowerCase();
    console.log(ability)
    var tempMod = document.getElementById("temp" + ability.charAt(0).toUpperCase() + ability.slice(1)+"Mod").value
    var baseMod = document.getElementById(ability + "Mod").value ;
    if(tempMod != "")
    {
        var intTempMod = parseInt(tempMod);
        if(!isNaN(intTempMod) && tempMod != "")
        {
            mod = intTempMod;
        }
    }
    else
    {
        var intMod =parseInt(baseMod)
        if(!isNaN(intMod) && baseMod != "")
        {
            mod = intMod;
        }
    }
    UpdateModBoxes(ability,mod);
}
function UpdateModBoxes(ability,mod)
{
    if(typeof(mod) != "number")
    {
        mod = parseInt(mod);
    }
    if(!isNaN(mod))
    {
        document.querySelectorAll("input[data-mod='" + ability.replace("temp","") +"']").forEach(box =>{
            box.value = mod;
            if(box.onchange != null)
            {
                box.onchange();
            }
        })
    }
}

function CalcTotal(calc)
{
    var total = 0;
    document.querySelectorAll("input[name='"+calc+"Calc']").forEach(part =>{
        var partNum = parseInt(part.value)
        if(!isNaN(partNum))
        {
            total += partNum
        }
    })
    document.getElementById(calc + "Total").value = total
}

function CalcAc()
{
    var acTotal = 10;
    var touch = 10;
    var ff = 10;
    document.querySelectorAll("input[name='acCalc']").forEach(part =>{
        var partNum = parseInt(part.value)
        if(!isNaN(partNum))
        {
            acTotal += partNum
        }
    })
    document.getElementById("acTotal").value = acTotal

    var armor = parseInt(document.getElementById("acArmor").value);
    var dex = parseInt(document.getElementById("acDex").value);
    if(!isNaN(armor))
    {
        document.getElementById("touchAC").value = acTotal - armor;
    }
    else
    {
        document.getElementById("touchAC").value = acTotal;
    }
    if(!isNaN(dex))
    {
        document.getElementById("ffAC").value = acTotal - dex;
    }
    else
    {
        document.getElementById("ffAC").value = acTotal;
    }
}
function Save(usingBroswer)
{
    var inputs = document.querySelectorAll('input');
    var saveString = "{";
    for (var i = 0;i < inputs.length; i++)
    {
        if(inputs[i].type == "checkbox")
        {
            saveString += '"' + inputs[i].id + '":"' +inputs[i].checked + '",';
        }
        else{
            saveString += '"' + inputs[i].id + '":"' +inputs[i].value + '",';
        }
    }
    saveString = saveString.slice(0,-1) + '}'
    if(usingBroswer)
    {
        window.localStorage.setItem("Char",saveString)
    }
    else{
        // 1. Create a Blob object with the file content and type.
        const blob = new Blob([saveString], { type: 'application/json' });
        
        // 2. Create a temporary anchor element.
        const element = document.createElement('a');
        element.style.display = 'none';
        document.body.appendChild(element);

        // 3. Generate a downloadable URL for the Blob.
        element.href = URL.createObjectURL(blob);
        
        // 4. Set the download attribute to specify the default filename.
        var campaignName = document.getElementById("campaign").value;
        var charName = document.getElementById("characterName").value
        var playerName = document.getElementById("playerName").value;
        var filename = (campaignName == "" ? "": campaignName + "_") + (charName == "" ? "" : charName +"_") + playerName;
        element.download = filename;

        // 5. Simulate a click to trigger the download and then clean up the element.
        element.click();
        
        // 6. Revoke the object URL to free up memory.
        URL.revokeObjectURL(element.href);
        document.body.removeChild(element);
    }
}
function LoadUsingBroswer()
{
    var str = "";
    str = window.localStorage.getItem("Char")
    
    if(str == "" || str == null)
    {
        window.alert("No Character Data to Load.")
    }
    else
    {
        PopulateWithJSON(str)
    }
}
function Load()
{
    document.getElementById("fileElem").click();
}
function PopulateWithJSON(str)
{
    try{
        var JsonObj = JSON.parse(str);
        var keys = Object.keys(JsonObj);
        keys.forEach(x => {
            var element = document.getElementById(x);
            if(element.type == "checkbox")
            {
                element.checked = (JsonObj[x] == "true");
                if(element.onchange != null)
                {
                    element.onchange()
                }
            }
            else
            {
                element.value = JsonObj[x];
            }
        });
    }
    catch{
        window.alert("Error in data! Please make sure your data is in JSON format.")
    }
}
function CompleteUpload()
{
    var file = document.getElementById("fileElem").files[0];
    if(file != undefined)
    {
        var reader = new FileReader();
        reader.addEventListener("load", () => {
        // this will then display a text file
        PopulateWithJSON(reader.result);
        });
        reader.readAsText(file)
    }
}

function Clear(usingBroswer)
{
    if(usingBroswer)
    {
        window.localStorage.removeItem("Char");
    }
    else
    {
        document.querySelectorAll('input').forEach(x =>{
            if(x.type == "checkbox")
            {
                x.checked = (x.id == "showSpells" || x.id == "showCharData");
            }
            else
            {
                x.value = "";
            }
        })
    }
}

function UpdateLocal(what, val)
{
    window.localStorage.setItem(what,val)
    if(what.startsWith("auto"))
    {
        document.querySelectorAll('input[data-disableReadonly="' + what + '"]').forEach(element =>{
            element.readonly = val;
            element.disabled = val;
            element.taborder = val ? null : "-1";
        })
        document.querySelectorAll('input[data-update-calc="' + what + '"]').forEach(element =>{
            element.onchange();
        })
    }
}
function CalcBab()
{
    if(document.getElementById("autoBAB").checked)
    {
        console.log("BAB")
    }
}
document.addEventListener("DOMContentLoaded", function() {
    var char = window.localStorage.getItem("Char")
    if(char != "" && char != null)
    {
        LoadUsingBroswer();
    }
    document.getElementById("autoBAB").checked = (window.localStorage.getItem("autoBAB") == 'true')
});