'use strict';

$(function() {
    browser.runtime.getBackgroundPage().then((global) => {
        browser.tabs.query({ 'active': true, 'currentWindow': true }).then((tabs) => {
            if (tabs.length === 0) {
                return; // For example: only the background devtools or a popup are opened
            }
            
            const tab = tabs[0];
            
            const logins = global.page.tabs[tab.id].loginList;
            const ll = document.getElementById('login-list');
            for (let i = 0; i < logins.length; i++) {
                const a = document.createElement('a');
                a.textContent = logins[i];
                a.setAttribute('class', 'list-group-item');
                a.setAttribute('id', '' + i);
                a.addEventListener('click', (e) => {
                    const id = e.target.id;
                    browser.tabs.sendMessage(tab.id, {
                        action: 'fill_user_pass_with_specific_login',
                        id: Number(id)
                    });
                    close();
                });
                ll.appendChild(a);
            }

            if (logins.length > 1) {
                document.getElementById('filter-block').style = '';
                const filter = document.getElementById('login-filter');
                filter.addEventListener('keyup', (e) => {
                    const val = filter.value;
                    const re = new RegExp(val, 'i');
                    const links = ll.getElementsByTagName('a');
                    let count = 0;
                    for (const i in links) {
                        if (links.hasOwnProperty(i)) {
                            const found = String(links[i].textContent).match(re) !== null;
                            links[i].style = found ? '' : 'display: none;';
                            !found ? count++ : '';
                        }
                    }
                    document.getElementById('filter-result-count').textContent = '当前域名共找到 ' + (logins.length - count) + ' 个密码';
                });
                filter.focus();
            } 
            document.getElementById('filter-result-count').textContent = '当前域名共找到 ' + logins.length + ' 个密码';
        });
    });
});
