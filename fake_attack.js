// ==UserScript==
// @name         Fake attack
// @namespace    https://github.com/dm67x/tribalwars_scripts
// @version      0.1
// @description  Fake attack script
// @author       dm67x
// @match        https://fr65.guerretribale.fr/game.php?village=*
// @grant        none
// ==/UserScript==

// Step 1: Goto the village information of the targetted village
// Step 2: Click on the "Send fake" button
// Step 3: Click on the "Attack" button

(function() {
    'use strict';

    var doc = document;
    if (window.frames.length > 0) {
        doc = window.document;
    }

    const createFake = () => {
        const url = location.href;
        if (url.match(/screen=place/) !== null) {
            const is_fake = url.match(/is_fake=1/) !== null
            const cata = doc.forms[0]["catapult"]
            const ram = doc.forms[0]["ram"]
            const spy = doc.forms[0]["spy"]

            if (is_fake) {
                if (spy.getAttribute("data-all-count") == 0) {
                    alert("no spy for fake")
                }
                else if (cata.getAttribute("data-all-count") == 0 && ram.getAttribute("data-all-count") == 0) {
                    alert("no cata or ram for fake")
                }
                else {
                    insertUnit(spy, 1)
                    if (cata.getAttribute("data-all-count") > 0) {
                        insertUnit(cata, 1)
                    } else {
                        insertUnit(ram, 1)
                    }
                }
            }
        }
    }

    const createFakeLink = () => {
        const url = location.href;
        if (url.match(/screen=info_village/) !== null) {
            const target = document.getElementById("send_troops")
            const target_tr = target.parentNode.parentNode.parentNode
            const tr = document.createElement("tr")
            tr.innerHTML = `
                <td colspan="2">
                    <form method="POST">
                        <a href="`+ target.getAttribute("href") + "&is_fake=1" +`">
                            <span class="action-icon-container">
                                <span class="icon header troops"></span>
                            </span>
                            Send fake
                        </a>
                    </form>
                </td>
            `
            target_tr.parentNode.append(tr)
        }
    }

    const run = () => {
        createFake()
        createFakeLink()
    }

    run()
})();