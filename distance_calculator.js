// ==UserScript==
// @name         Distance calculator
// @namespace    https://github.com/dm67x/tribalwars_scripts
// @version      0.1
// @description  Calculate the distance between you and your target
// @author       dm67x
// @match        https://fr65.guerretribale.fr/game.php?village=*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/axios-userscript-adapter@0.0.4/dist/axiosGmxhrAdapter.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    var doc = document;
    if (window.frames.length > 0) {
        doc = window.document;
    }

    var village = doc.querySelector("#menu_row2 > td:nth-child(2) > b").textContent
    village = village.match(/([0-9]+)\|([0-9]+)/)
    village = [ parseInt(village[1]), parseInt(village[2]) ]

    const distance = (x, y, xx, yy) => { const fx = xx - x; const fy = yy - y; return Math.sqrt(fx * fx + fy * fy) }
    const unit_distance = (initial, worldSpeed, unitSpeed) => (initial * 60) / worldSpeed / unitSpeed
    const print_distance = (dist) => {
        const hour = Math.floor(dist / 3600)
        const min = Math.floor((dist / 60) % 60)
        const sec = Math.ceil(dist % 60)

        var result = ""
        if (hour > 0) {
            result += ((hour < 10) ? "0" + hour : hour) + "h"
        }
        result += ((min < 10) ? "0" + min : min) + "m" + ((sec < 10) ? "0" + sec : sec) + "s"
        return result
    }

    const url = location.href
    if (url.match(/screen=info_village/) !== null) {
        const table_vis = doc.querySelectorAll("table.vis > tbody")[0]
        var coords = table_vis.querySelector("tr:nth-child(3) > td:nth-child(2)").textContent.split('|')
        coords = [ parseInt(coords[0]), parseInt(coords[1]) ]
        const tr = doc.createElement("tr")
        const dist = distance(village[0], village[1], coords[0], coords[1])
        const worldapi = url.match(/(https:\/\/.+\/)/)[1] + "/interface.php?func=get_config"
        axios.get(worldapi).then(resp => {
            const response = new DOMParser().parseFromString(resp.data, "text/xml")
            const worldSpeed = parseFloat(response.querySelector("speed").textContent)
            const unitSpeed = parseFloat(response.querySelector("unit_speed").textContent)
            const units = [
                unit_distance(10, worldSpeed, unitSpeed) * dist, // knight
                unit_distance(18, worldSpeed, unitSpeed) * dist, // spear
                unit_distance(22, worldSpeed, unitSpeed) * dist, // sword
                unit_distance(18, worldSpeed, unitSpeed) * dist, // axe
                unit_distance(18, worldSpeed, unitSpeed) * dist, // archer
                unit_distance(9, worldSpeed, unitSpeed) * dist, // spy
                unit_distance(10, worldSpeed, unitSpeed) * dist, // light
                unit_distance(10, worldSpeed, unitSpeed) * dist, // marcher
                unit_distance(11, worldSpeed, unitSpeed) * dist, // heavy
                unit_distance(30, worldSpeed, unitSpeed) * dist, // ram
                unit_distance(30, worldSpeed, unitSpeed) * dist, // catapult
                unit_distance(35, worldSpeed, unitSpeed) * dist, // noble
            ]

            const units_img = [
                "unit_knight",
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
                "unit_snob"
            ]

            var inner = ""
            for (var i = 0; i < units.length; i++) {
                inner += `
                    <tr>
                        <td><img src="https://dsfr.innogamescdn.com/asset/d9ba847e/graphic/unit/` + units_img[i] + `.png"></td>
                        <td>` + print_distance(units[i]) + `</td>
                    </tr>
                `
            }

            tr.innerHTML = `
                <td>Distance:</td>
                <td><table><tbody>` + inner + `</tbody></table></td>
            `
            table_vis.appendChild(tr)
        }).catch(err => {
            console.log(err)
        })
    }
})()