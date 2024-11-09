// ==UserScript==
// @name         builders of the world
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       KaTZWorlD
// @match        https://build.tmwstw.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmwstw.io
// @grant        GM_xmlhttpRequest
// @connect      https://play.tmwstw.io/*
// ==/UserScript==

(function () {
    'use strict';

    ////////////////////
    // Builder front page rework
    ///////////////////////

    // Function to handle mutations
    const handleMutations = (entries, observer) => {
        observer.disconnect();
        globalTrot(entries[0].target.childNodes);
    };

    // Setup MutationObserver
    const setupObserver = (targetSelector, config) => {
        const target = document.querySelector(targetSelector);
        if (target) {
            const observer = new MutationObserver((entries) => handleMutations(entries, observer));
            observer.observe(target, config);
        } else {
            console.error(`Target element for ${targetSelector} not found.`);
        }
    };

    // Configuration for MutationObserver
    const configOfPlotas = {
        childList: true,
        subtree: true,
    };

    // Observe the target elements
    setupObserver("#plots_with_builds_cont", configOfPlotas);
    setupObserver("#select_plot_in_ownership_cont", configOfPlotas);

    let names = [];

    // Fetch named plats
    const fetchNamedPlats = () => {
        const url = 'https://play.tmwstw.io/data/names.json';
        GM_xmlhttpRequest({
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            responseType: 'json',
            url: url,
            onload: function (response) {
                names = response.response;
            }
        });
    };

    fetchNamedPlats();

    let housing = `<img src='https://tmwttw.imamkatz.com/building-1062.png'>`
    let globalTrot = (entries)=> {
        document.querySelector('#plots_in_ownership_title').innerHTML = `${housing} Select from plots with buildings in ownership ${housing}`
        for (let i = 1; i < entries.length; i++) {
            let plotas = entries[i].textContent.split('_')[1]

            if (typeof plotas !== "undefined"){
                entries[i].textContent =''
                entries[i].style.backgroundImage = `url('https://meta.tmwstw.io/preview_plots_${plotas}.jpg')`
                entries[i].style.width = '150px';
                entries[i].style.height = '150px';
                entries[i].style.backgroundSize="150px 150px"
                //console.log(entries[i])

            }
            else {
                plotas = entries[i].textContent
                let index = names.indexOf(plotas) + 1
                entries[i].textContent = ''
                entries[i].style.backgroundImage = `url('https://meta.tmwstw.io/preview_plots_${index}.jpg')`
                entries[i].style.width = '150px';
                entries[i].style.height = '150px';
                entries[i].style.backgroundSize="150px 150px"
                //console.log(entries[i])

            }

        }
    }
})();