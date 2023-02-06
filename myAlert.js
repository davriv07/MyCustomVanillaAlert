//* Need to load alert css file

import { bindEventListener } from "./eventHandler.js";

//* This needs fontawesome v5
export function myAlert({ type = 'success', title = 'Test', msg = 'Test', duration_ms = '2000',
    element_to_append, css_properties = {}, mantainInHover = false, performance_log = false }) {

    (typeof css_properties !== 'object')
        ? css_properties = { top: '1em' } : '';
    //* Mesuring performance
    (performance_log) ? performance.now() : '';

    let msg_size = msg.length / 100;
    let div = document.querySelector('.customAlert');
    let alert = '';
    if (div && div !== '') {
        alert = (!div.querySelector('.alert')) ? '' : div.querySelector('.alert');
    }
    if (!element_to_append || element_to_append == '') {
        //* Document body by default
        element_to_append = document.firstElementChild.firstElementChild.nextElementSibling;
    }
    let custom_content = '';
    let icon_class = '';
    //* Just creat the element if its not already created
    if (!div || div === '') {
        div = document.createElement('div');
        div.classList.add('customAlert');
        element_to_append.appendChild(div);
    }
    alert = document.createElement('div');
    alert.className = "";
    switch (type) {
        case 'success':
            icon_class = "fas fa-check-circle";
            alert.classList.add('_alert');
            alert.classList.add('success');
            break;

        case 'error':
            icon_class = "fas fa-exclamation-circle";
            alert.classList.add('_alert');
            alert.classList.add('error');
            break;

        case 'info':
            icon_class = "fas fa-question-circle";
            alert.classList.add('_alert');
            alert.classList.add('info');
            break;

        case 'warning':
            icon_class = "fas fa-exclamation-circle";
            alert.classList.add('_alert');
            alert.classList.add('caution');
            break;

        default:
            icon_class = "fas fa-check-circle";
            alert.classList.add('_alert');
            alert.classList.add('success');
            break;

    }
    custom_content = `<div class="title-section">
            <h4 class="title">${title ?? 'Alerta'}</h4> 
            <button class="button exit" id="btnExit">X</button>
        </div><div class="alert_content">
            <div class="iconAlert">
                <i class="${icon_class}"></i>
            </div>
            <div class="messageAlert">
                <p class="msg">${msg}</p>
            </div>
        </div>`;
    alert.innerHTML = custom_content;
    setStylesProperties({ properties_object: css_properties, element: alert });
    div.appendChild(alert);
    bindEventListener({
        node: div.querySelector('#btnExit'), event: 'click', 
        handler: () => { div.style.display = 'none'; div.removeChild(alert); }
    })
    div.style.display = 'block';
    //* Mesuring performance
    (performance_log) ? performance.now() : '';
    //* Hide alert after some time
    if (mantainInHover) { 
        bindEventListener({
            node: alert, event: 'mouseover', handler: () => clearTimeout()
        });
        bindEventListener({
            node: alert, event: 'mouseleave', handler: () => {
                div.style.display = 'none';
                div.removeChild(alert);
            }
        });
    }
    //* Dismiss when escape key is pressed
    bindEventListener({
        node: document, event: 'keydown', handler: (e) => {
            if (e.keyCode !== 27) return;
            if (!document.querySelector('._alert')) return;
            div.style.display = 'none'; div.removeChild(alert);
        }
    });
    //* Dismiss after duration_ms has passed
    sleep({
        time: duration_ms, calback: () => {
            if (!document.querySelector('._alert')) return;
            div.style.display = 'none'; div.removeChild(alert);
        }
    });
    return div;
}


function setStylesProperties({ properties_object = {}, element }) {
    if (properties_object.length == 0) return;
    for (let key in properties_object) {
        element.style[key] = properties_object[key];
    }
}

function sleep({ calback, time = 2000 }) {
    setTimeout(() => {
        calback(true);
    }, time);
}
