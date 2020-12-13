import axios from 'axios'

export default () => {
    const distance = (x, y, xx, yy) => { const fx = xx - x; const fy = yy - y; return Math.sqrt(fx * fx + fy * fy) }
    const unit_distance = (initial, worldSpeed, unitSpeed) => (initial * 60) / worldSpeed / unitSpeed
    const print_distance = (dist) => {
        const hour = Math.floor(dist / 3600)
        const min = Math.floor((dist / 60) % 60)
        const sec = Math.ceil(dist % 60)

        var result = ((hour < 10) ? "0" + hour : hour) + ":" + ((min < 10) ? "0" + min : min) + ":" + ((sec < 10) ? "0" + sec : sec)
        return result
    }

    var village = document.querySelector("#menu_row2 > td:nth-child(2) > b").textContent
    village = village.match(/([0-9]+)\|([0-9]+)/)
    village = [ parseInt(village[1]), parseInt(village[2]) ]

    var units = []
    const map = document.getElementById("map")

    const updatePopup = (_, __) => {
        const isOpen = map.getAttribute("href") !== "#"

        if (isOpen) {
            const mapInfoContent = document.getElementById("info_content")
            const exist = mapInfoContent.querySelector("#distanceCalculator")
            const barbareBonus = mapInfoContent.querySelector("#info_bonus_image_row")
            var coords = null
            if (barbareBonus !== null) {
                coords = mapInfoContent.querySelector("tbody > tr:nth-child(2) > th").textContent
            } else {
                coords = mapInfoContent.querySelector("tbody > tr:first-child > th").textContent
            }

            coords = coords.match(/([0-9]{3})\|([0-9]{3})/)
            coords = [ parseInt(coords[1]), parseInt(coords[2]) ]
            if (coords[0] == village[0] && coords[1] == village[1]) {
                return; // don't show for your own village
            }
            
            const dist = distance(village[0], village[1], coords[0], coords[1])
            if (units.length > 0) {
                const newUnits = units.map(x => x * dist)
                const units_img = [
                    "unit_spear",
                    "unit_sword",
                    "unit_axe",
                    "unit_archer",
                    "unit_spy",
                    "unit_light",
                    "unit_marcher",
                    "unit_heavy",
                    "unit_ram",
                    "unit_catapult",
                    "unit_knight",
                    "unit_snob"
                ]

                var distanceHTML = "<table><tbody>"
                var distanceUnitIcon = "<tr>"
                var distanceUnitTime = "<tr>"
                for (var i = 0; i < newUnits.length; i++) {
                    var classUnit = ""
                    if (i % 2 == 0) {
                        classUnit = "background-color: white;"
                    }
                    distanceUnitIcon += "<td style=\"text-align:center;" + classUnit + "\"><img src=\"https://dsfr.innogamescdn.com/asset/d9ba847e/graphic/unit/" + units_img[i] + ".png\"></td>"
                    distanceUnitTime += "<td style=\"" + classUnit + "\">" + print_distance(newUnits[i]) + "</td>"
                }
                distanceUnitTime += "</tr>"
                distanceUnitIcon += "</tr>"
                distanceHTML += distanceUnitIcon + distanceUnitTime + "</tbody></table>"

                if (exist !== null) {
                    const distanceTdValue = exist.querySelector("td:last-child")
                    distanceTdValue.innerHTML = distanceHTML
                } else {
                    const distanceContent = document.createElement("tr")
                    distanceContent.setAttribute("id", "distanceCalculator")
                    const distanceTdLabel = document.createElement("td")
                    const distanceTdValue = document.createElement("td")
                    distanceTdLabel.textContent = "Distance:"
                    distanceContent.appendChild(distanceTdLabel)
                    distanceContent.appendChild(distanceTdValue)

                    distanceTdValue.innerHTML = distanceHTML
                    mapInfoContent.querySelector("tbody").appendChild(distanceContent)
                }
            }
        }
    }

    const observer = new MutationObserver(updatePopup);

    const url = location.href
    if (url.match(/screen=map/) !== null) {
        const worldapi = url.match(/(https:\/\/.+\/)/)[1] + "/interface.php?func=get_config"
        axios.get(worldapi).then(resp => {
            const response = new DOMParser().parseFromString(resp.data, "text/xml")
            const worldSpeed = parseFloat(response.querySelector("speed").textContent)
            const unitSpeed = parseFloat(response.querySelector("unit_speed").textContent)
            units = [
                unit_distance(18, worldSpeed, unitSpeed), // spear
                unit_distance(22, worldSpeed, unitSpeed), // sword
                unit_distance(18, worldSpeed, unitSpeed), // axe
                unit_distance(18, worldSpeed, unitSpeed), // archer
                unit_distance(9, worldSpeed, unitSpeed), // spy
                unit_distance(10, worldSpeed, unitSpeed), // light
                unit_distance(10, worldSpeed, unitSpeed), // marcher
                unit_distance(11, worldSpeed, unitSpeed), // heavy
                unit_distance(30, worldSpeed, unitSpeed), // ram
                unit_distance(30, worldSpeed, unitSpeed), // catapult
                unit_distance(10, worldSpeed, unitSpeed), // knight
                unit_distance(35, worldSpeed, unitSpeed), // noble
            ]
        }).catch(err => {
            console.log(err)
            return
        })

        observer.observe(map, { attributes: true })
    } else {
        observer.disconnect()
    }
}