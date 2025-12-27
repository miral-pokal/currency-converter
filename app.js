const dropdowns = document.querySelectorAll("select");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.innerText = currCode;
    option.value = currCode;

    // default select
    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    }
    if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.append(option); 
  }
}

// flag
const updateFlag = (element) => {       //element ni jgya e gme te name rakhi ski
  let currCode = element.value;         //currently selected value le che  USD INR EUR 
  let countryCode = countryList[currCode];  //currency code ne country code ma convert kre che

  let img = element.closest(".select-container").querySelector("img");  //img select kre che closet select-container nam nu div sodhe che queryslectoer eni ander nu img lave che 
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;  //flag img no url chnage thay che 
};

//event listener
for (let select of dropdowns) {  //bdha select dropdown pr loop 
  select.addEventListener("change", (e) => {  //e parameter name che teni jgya e gme te lkhi skay 
    console.log("changed to", e.target.value); // DEBUG
    updateFlag(e.target); //je element pr event thyo hoy te element user je option select kre te value  
  });
}

const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

//reqired element select kro
const amountInput = document.querySelector(".amount input");  //amount class ane eni ander input element select kre
const fromSelect = document.querySelector("select[name='from']"); //dropdown select kre jya name=from hoy
const toSelect = document.querySelector("select[name='to']");
const msg = document.querySelector(".msg"); //msg class vado element select kre msg show krva mate
const btn = document.querySelector("button"); //button select kre tema click event lgava mate

//button click API call
btn.addEventListener("click", async (e) => {
  e.preventDefault();

  let amount = amountInput.value; //user je input value nakhe te le bydefalut te string hoy
  if (amount === "" || amount <= 0) {
    amount = 1; //null athva 0 hoy to amount 1 aave 
    amountInput.value = "1"; //input filed ma pn 1 btave
  }

  await updateExchangeRate(amount); //await pela api mathi data aave pchi aagd no code chale
});

//currency converter function-main logic 
const updateExchangeRate = async (amount) => { //user je number enter kryo tema API call fetch thy rhi che
  try{
  let fromCurr = fromSelect.value; //selected currnecy code le 
  let toCurr = toSelect.value;

  let response = await fetch(`${BASE_URL}/${fromCurr}`); //API ne request mokle che fromcurr USD hoy to final url bni jay mtlb USD no currency rate mage
  if (!response.ok) {
      throw new Error("API error");
    }
  let data = await response.json(); 

  let rate = data.rates[toCurr]; //user je tocurr select kre te rates object ni ander tocurr name ni key value lelo amaa rates j lkhvanu km k API je data mokle tema currency rate rates nam ni key ander j hoy 
  if (!rate) {
      throw new Error("Rate not found");
    } 
  let finalAmount = (amount * rate).toFixed(2); //final amount = amount * exchnage rate .toFixed result ne clean bnave ane string return kre

  msg.innerText = `${amount} ${fromCurr} = ${finalAmount} ${toCurr}`;
  } catch (error) {
    msg.innerText = "❌ Unable to fetch data. Check internet connection.";
  } 
};

//page load pr defalut value
window.addEventListener("load", () => { //window etle aakho browser window load thay tyare updateExchnagerate 1 j rhe 
  updateExchangeRate(1);
});

//swap icon 
//js ma icon pkd
const swapIcon = document.querySelector(".swap-icon");

swapIcon.addEventListener("click", () => {

  let temp = fromSelect.value; //je currency curently select che te temp ma store kre che 
  fromSelect.value = toSelect.value; //from currency ne tocurrency ni value aapi de che
  toSelect.value = temp; //temp ma je old from currency hti te tocurrency ma aave 

  // update flags
  updateFlag(fromSelect); //select ni value read kre cuontry code finde kre flag chnage kre 
  updateFlag(toSelect);

});


