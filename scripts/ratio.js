export default () => {
    const url = location.href
    if (url.match(/screen=farm/) !== null) {
        const table = document.querySelector("table.vis")
        const troops = parseInt(table.querySelector("tbody > tr:nth-child(7) > td:last-child").textContent)
        const troopsInProduction = parseInt(table.querySelector("tbody > tr:nth-child(8) > td:last-child").textContent)
        const pts = parseInt(document.getElementById("rank_points").textContent.split('.').join(''))
        const ratio = document.createElement("tr")
        const ratioTitle = document.createElement("td")
        const ratioValue = document.createElement("td")
        ratioValue.style.textAlign = "right"
        ratio.appendChild(ratioTitle)
        ratio.appendChild(ratioValue)
        table.querySelector("tbody").insertBefore(ratio, table.querySelector("tbody > tr:nth-child(9)"))

        ratioTitle.textContent = "Ratio"
        ratioValue.textContent = ((troops + troopsInProduction) / pts).toFixed(2)
    }
}