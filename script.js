const price = 0; // Update with actual price
const cid = []; // Update with actual cash-in-drawer data

function checkCashRegister(price, cid) {
    let cash = document.getElementById("cash").value;
    cash = parseFloat(cash);

    let changeDue = cash - price;

    // Insufficient funds
    if (changeDue < 0) {
        return { status: "INSUFFICIENT_FUNDS" };
    }

    // Check if exact change can be provided
    let change = cid.reduce((acc, curr) => {
        acc[curr[0]] = curr[1];
        return acc;
    }, {});

    let availableChange = calculateChange(change, changeDue);

    // Check if available change can cover due amount
    if (availableChange === 0) {
        return { status: "CLOSED" };
    } else if (availableChange < changeDue) {
        return { status: "INSUFFICIENT_FUNDS" };
    }

    // Return change details
    return { status: "OPEN", change: availableChange };
}

function calculateChange(change, changeDue) {
    const units = {
        "PENNY": 0.01,
        "NICKEL": 0.05,
        "DIME": 0.1,
        "QUARTER": 0.25,
        "ONE": 1,
        "FIVE": 5,
        "TEN": 10,
        "TWENTY": 20,
        "ONE HUNDRED": 100,
    };

    let changeObj = {};
    for (let unit in units) {
        changeObj[unit] = 0;
        // Loop until changeDue is 0 or available change unit is depleted
        while (changeDue >= units[unit] && change[unit] > 0) {
            changeDue -= units[unit];
            changeObj[unit]++;
            change[unit] -= 1;
        }
    }

    // Check if remaining changeDue can't be fulfilled
    if (changeDue > 0.001) { // Added check for very small remainders due to floating-point precision
        return 0;
    }

    // Format change object to string
    let changeString = "";
    for (let unit in changeObj) {
        if (changeObj[unit] > 0) {
            changeString += `${unit}: $${changeObj[unit].toFixed(2)} `;
        }
    }

    return changeString;
}

const purchaseButton = document.getElementById("purchase-btn");
purchaseButton.addEventListener("click", () => {
    let result = checkCashRegister(price, cid);
    let changeDueDiv = document.getElementById("change-due");
    changeDueDiv.innerText = result.status === "OPEN" ? result.change : result.status;

    if (result.status === "INSUFFICIENT_FUNDS") {
        alert("Customer does not have enough money to purchase the item");
    } else if (result.status === "CLOSED") {
        changeDueDiv.innerText = "No change due - customer paid with exact cash";
    }
});
