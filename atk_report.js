// ==UserScript==
// @name         Atk Report
// @namespace    https://github.com/dm67x/tribalwars_scripts
// @version      0.1
// @description  Create a sharable report for your tribe
// @author       dm67x
// @match        https://fr65.guerretribale.fr/game.php?village=*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const templateAttack = (name, coords, troops, losses) => {
        return `
        [table]
            [**]Attacker:[||][player]` + name + `[/player][/**]
            [*]Origin:[|][coord]` + coords + `[/coord]
            [*]Quantity:[|][unit]spear[/unit]` + troops["spear"] + `
            [unit]sword[/unit] ` + troops["sword"] + `
            [unit]axe[/unit] ` + troops["axe"] + `
            [unit]archer[/unit] ` + troops["archer"] + `
            [unit]spy[/unit] ` + troops["spy"] + `
            [unit]light[/unit] ` + troops["light"] + `
            [unit]marcher[/unit] ` + troops["marcher"] + `
            [unit]heavy[/unit] ` + troops["heavy"] + `
            [unit]ram[/unit] ` + troops["ram"] + `
            [unit]catapult[/unit] ` + troops["catapult"] + `
            [unit]knight[/unit] ` + troops["knight"] + `
            [unit]snob[/unit] ` + troops["snob"] + `
            [*]Loss:[|][unit]spear[/unit] ` + losses["spear"] + `
            [unit]sword[/unit] ` + losses["sword"] + `
            [unit]axe[/unit] ` + losses["axe"] + `
            [unit]archer[/unit] ` + losses["archer"] + `
            [unit]spy[/unit] ` + losses["spy"] + `
            [unit]light[/unit] ` + losses["light"] + `
            [unit]marcher[/unit] ` + losses["marcher"] + `
            [unit]heavy[/unit] ` + losses["heavy"] + `
            [unit]ram[/unit] ` + losses["ram"] + `
            [unit]catapult[/unit] ` + losses["catapult"] + `
            [unit]knight[/unit] ` + losses["knight"] + `
            [unit]snob[/unit] ` + losses["snob"] + `
        [/table]
        `
    }
    const templateDefense = (name, coords, troops, losses) => {
        return `
        [table]
            [**]Defender:[||][player]` + name + `[/player][/**]
            [*]Destination:[|][coord]` + coords + `[/coord]
            [*]Quantity:[|][unit]spear[/unit]` + troops["spear"] + `
            [unit]sword[/unit] ` + troops["sword"] + `
            [unit]axe[/unit] ` + troops["axe"] + `
            [unit]archer[/unit] ` + troops["archer"] + `
            [unit]spy[/unit] ` + troops["spy"] + `
            [unit]light[/unit] ` + troops["light"] + `
            [unit]marcher[/unit] ` + troops["marcher"] + `
            [unit]heavy[/unit] ` + troops["heavy"] + `
            [unit]ram[/unit] ` + troops["ram"] + `
            [unit]catapult[/unit] ` + troops["catapult"] + `
            [unit]knight[/unit] ` + troops["knight"] + `
            [unit]snob[/unit] ` + troops["snob"] + `
            [unit]militia[/unit] ` + troops["militia"] + `
            [*]Loss:[|][unit]spear[/unit] ` + losses["spear"] + `
            [unit]sword[/unit] ` + losses["sword"] + `
            [unit]axe[/unit] ` + losses["axe"] + `
            [unit]archer[/unit] ` + losses["archer"] + `
            [unit]spy[/unit] ` + losses["spy"] + `
            [unit]light[/unit] ` + losses["light"] + `
            [unit]marcher[/unit] ` + losses["marcher"] + `
            [unit]heavy[/unit] ` + losses["heavy"] + `
            [unit]ram[/unit] ` + losses["ram"] + `
            [unit]catapult[/unit] ` + losses["catapult"] + `
            [unit]knight[/unit] ` + losses["knight"] + `
            [unit]snob[/unit] ` + losses["snob"] + `
            [unit]militia[/unit] ` + losses["militia"] + `
        [/table]
        `
    }

    const templateBuildings = obj => {
        var result = "[table][**]"
        var buildings_header = []
        obj.forEach(o => {
            buildings_header.push("[building]" + o.id + "[/building]")
        })
        result += buildings_header.join("[||]") + "[/**][*]"
        var buildings = []
        obj.forEach(o => {
            buildings.push(o.level + "")
        })
        result += buildings.join("[|]") + "[/table]"
        return result
    }

    const url = location.href
    if (url.match(/screen=report&mode=all/) !== null) {
        const linkZone = document.querySelector(".no-preview")
        const generatePreviewBtn = document.createElement("a")
        const templateZone = document.createElement("textarea")
        templateZone.textContent = ""
        templateZone.style.display = "none"
        linkZone.appendChild(templateZone)

        linkZone.appendChild(generatePreviewBtn)
        generatePreviewBtn.style.float = "right"
        generatePreviewBtn.innerHTML = "» Publish the report using BBCode"
        generatePreviewBtn.setAttribute("href", "#!")
        generatePreviewBtn.addEventListener("click", () => {
            const attackInfoZone = document.getElementById("attack_info_att")
            const attackerName = attackInfoZone.querySelector("tbody > tr:first-child > th:last-child").textContent
            const coords = attackInfoZone.querySelector("tbody > tr:nth-child(2) > td:last-child > span > a:first-child").textContent.match(/([0-9]+)\|([0-9]+)/)
            const attackInfoUnits = attackInfoZone.querySelector("#attack_info_att_units")
            const quantity = attackInfoUnits.querySelector("tbody > tr:nth-child(2)")
            const attackTroops = {
                "spear": parseInt(quantity.querySelector("td:nth-child(2)").textContent),
                "sword": parseInt(quantity.querySelector("td:nth-child(3)").textContent),
                "axe": parseInt(quantity.querySelector("td:nth-child(4)").textContent),
                "archer": parseInt(quantity.querySelector("td:nth-child(5)").textContent),
                "spy": parseInt(quantity.querySelector("td:nth-child(6)").textContent),
                "light": parseInt(quantity.querySelector("td:nth-child(7)").textContent),
                "marcher": parseInt(quantity.querySelector("td:nth-child(8)").textContent),
                "heavy": parseInt(quantity.querySelector("td:nth-child(9)").textContent),
                "ram": parseInt(quantity.querySelector("td:nth-child(10)").textContent),
                "catapult": parseInt(quantity.querySelector("td:nth-child(11)").textContent),
                "knight": parseInt(quantity.querySelector("td:nth-child(12)").textContent),
                "snob": parseInt(quantity.querySelector("td:nth-child(13)").textContent)
            }
            const loss = attackInfoUnits.querySelector("tbody > tr:nth-child(3)")
            const lossTroops = {
                "spear": parseInt(loss.querySelector("td:nth-child(2)").textContent),
                "sword": parseInt(loss.querySelector("td:nth-child(3)").textContent),
                "axe": parseInt(loss.querySelector("td:nth-child(4)").textContent),
                "archer": parseInt(loss.querySelector("td:nth-child(5)").textContent),
                "spy": parseInt(loss.querySelector("td:nth-child(6)").textContent),
                "light": parseInt(loss.querySelector("td:nth-child(7)").textContent),
                "marcher": parseInt(loss.querySelector("td:nth-child(8)").textContent),
                "heavy": parseInt(loss.querySelector("td:nth-child(9)").textContent),
                "ram": parseInt(loss.querySelector("td:nth-child(10)").textContent),
                "catapult": parseInt(loss.querySelector("td:nth-child(11)").textContent),
                "knight": parseInt(loss.querySelector("td:nth-child(12)").textContent),
                "snob": parseInt(loss.querySelector("td:nth-child(13)").textContent)
            }

            templateZone.textContent += templateAttack(attackerName, [ parseInt(coords[1]), parseInt(coords[2]) ].join('|'), attackTroops, lossTroops)

            const defInfoZone = document.getElementById("attack_info_def")
            const defenderName = defInfoZone.querySelector("tbody > tr:first-child > th:last-child").textContent
            const coordsDef = defInfoZone.querySelector("tbody > tr:nth-child(2) > td:last-child > span > a:first-child").textContent.match(/([0-9]+)\|([0-9]+)/)
            const defInfoUnits = defInfoZone.querySelector("#attack_info_def_units")
            const quantityDef = defInfoUnits.querySelector("tbody > tr:nth-child(2)")
            const defTroops = {
                "spear": parseInt(quantityDef.querySelector("td:nth-child(2)").textContent),
                "sword": parseInt(quantityDef.querySelector("td:nth-child(3)").textContent),
                "axe": parseInt(quantityDef.querySelector("td:nth-child(4)").textContent),
                "archer": parseInt(quantityDef.querySelector("td:nth-child(5)").textContent),
                "spy": parseInt(quantityDef.querySelector("td:nth-child(6)").textContent),
                "light": parseInt(quantityDef.querySelector("td:nth-child(7)").textContent),
                "marcher": parseInt(quantityDef.querySelector("td:nth-child(8)").textContent),
                "heavy": parseInt(quantityDef.querySelector("td:nth-child(9)").textContent),
                "ram": parseInt(quantityDef.querySelector("td:nth-child(10)").textContent),
                "catapult": parseInt(quantityDef.querySelector("td:nth-child(11)").textContent),
                "knight": parseInt(quantityDef.querySelector("td:nth-child(12)").textContent),
                "snob": parseInt(quantityDef.querySelector("td:nth-child(13)").textContent),
                "militia": parseInt(quantityDef.querySelector("td:nth-child(14)").textContent)
            }
            const lossDef = defInfoUnits.querySelector("tbody > tr:nth-child(3)")
            const defLossTroops = {
                "spear": parseInt(lossDef.querySelector("td:nth-child(2)").textContent),
                "sword": parseInt(lossDef.querySelector("td:nth-child(3)").textContent),
                "axe": parseInt(lossDef.querySelector("td:nth-child(4)").textContent),
                "archer": parseInt(lossDef.querySelector("td:nth-child(5)").textContent),
                "spy": parseInt(lossDef.querySelector("td:nth-child(6)").textContent),
                "light": parseInt(lossDef.querySelector("td:nth-child(7)").textContent),
                "marcher": parseInt(lossDef.querySelector("td:nth-child(8)").textContent),
                "heavy": parseInt(lossDef.querySelector("td:nth-child(9)").textContent),
                "ram": parseInt(lossDef.querySelector("td:nth-child(10)").textContent),
                "catapult": parseInt(lossDef.querySelector("td:nth-child(11)").textContent),
                "knight": parseInt(lossDef.querySelector("td:nth-child(12)").textContent),
                "snob": parseInt(lossDef.querySelector("td:nth-child(13)").textContent),
                "militia": parseInt(lossDef.querySelector("td:nth-child(14)").textContent)
            }

            templateZone.textContent += templateDefense(defenderName, [ parseInt(coordsDef[1]), parseInt(coordsDef[2]) ].join('|'), defTroops, defLossTroops)

            const buildings = document.querySelector("#attack_spy_building_data")
            if (buildings !== undefined) {
                const bobj = JSON.parse(buildings.getAttribute("value"))
                templateZone.textContent += templateBuildings(bobj)
            }

            templateZone.style.display = "block"
            templateZone.focus()
            templateZone.select()
            document.execCommand("copy")
            templateZone.style.display = "none"
        })
    }
})()