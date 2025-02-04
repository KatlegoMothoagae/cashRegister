let price = 3.26;
let cid = [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]];
let changeDueElement = document.getElementById("change-due");

let cash = document.getElementById("cash");
const checkCashRegister = (price, cash, cid) => {
    const UNIT_AMOUNT = {
        "PENNY": 0.01,
        "NICKEL": 0.05,
        "DIME": 0.10,
        "QUARTER": 0.25,
        "ONE": 1.00,
        "FIVE": 5.00,
        "TEN": 10.00,
        "TWENTY": 20.00,
        "ONE HUNDRED": 100.00
    };

    let totalCID = 0;
    if(price > cash){
        alert("Customer does not have enough money to purchase the item");
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    for (let element of cid) {
        totalCID += element[1];
    }
    totalCID = totalCID.toFixed(2);
    let changeToGive = (cash - price).toFixed(2);
    const changeArray = [];

    console.log(changeToGive);
    console.log(totalCID);
    if (Number(changeToGive) > Number(totalCID)) {
        console.log("what");
        return { status: "INSUFFICIENT_FUNDS", change: changeArray };
    } else if (changeToGive === totalCID) {
        return { status: "CLOSED", change: cid };
    } else {
        cid = cid.reverse();
        for (let elem of cid) {
            let temp = [elem[0], 0];
            while (changeToGive >= UNIT_AMOUNT[elem[0]] && elem[1] > 0) {
                temp[1] += UNIT_AMOUNT[elem[0]];
                elem[1] -= UNIT_AMOUNT[elem[0]];
                changeToGive -= UNIT_AMOUNT[elem[0]];
                changeToGive = changeToGive.toFixed(2);
            }
            if (temp[1] > 0) {
                changeArray.push(temp);
            }
        }
    }
    console.log(changeToGive);
    if (changeToGive > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] };
    }

    return { status: "OPEN", change: changeArray };
}

function formString(status, changeList){
    let result ="Status: " + status +" ";
    for (let i = 0; i < changeList.length; i++) {
        if(changeList[i][1] > 0){
            result += changeList[i][0] + ": $" + changeList[i][1].toFixed(2) + " ";
        }
    }
    return result.trim();
}

const purchaseButton = document.getElementById("purchase-btn");
purchaseButton.addEventListener("click", () => {
    let result = checkCashRegister(price, Number(cash.value), cid);
    let changeDueDiv = document.getElementById("change-due");

    if(result.status === "OPEN"){
        if(result.change.length > 0){
            changeDueDiv.innerText = formString(result.status, result.change);
        } else {
            changeDueDiv.innerText = "No change due - customer paid with exact cash";
        }
    } else if (result.status === "INSUFFICIENT_FUNDS") {
        changeDueDiv.innerText = "Status: " + result.status;
    } else if (result.status === "CLOSED") {
        changeDueDiv.innerText = formString(result.status, result.change);
    }
});
