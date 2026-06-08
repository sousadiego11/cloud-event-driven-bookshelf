const FORMS = {
    book: {
        target: '/books', method: 'POST',
        fields: [
            { id: 'b-title', label: 'Title', type: 'text', key: 'Title' },
            { id: 'b-author', label: 'Author', type: 'text', key: 'Author' },
            { id: 'b-isbn', label: 'ISBN', type: 'text', key: 'Isbn' },
            { id: 'b-qty', label: 'Stock', type: 'number', key: 'Stock', value: '1' }
        ]
    },
    loan: {
        target: '/loans', method: 'POST',
        fields: [
            { id: 'l-book', label: 'Book ID', type: 'text', key: 'BookId' },
            { id: 'l-cpf', label: 'CPF', type: 'text', key: 'Cpf' }
        ]
    },
    return: {
        target: '/loans/return', method: 'POST',
        fields: [
            { id: 'r-book', label: 'Book ID', type: 'text', key: 'BookId' },
            { id: 'r-cpf', label: 'CPF', type: 'text', key: 'Cpf' }
        ]
    }
};

const TABLES = {
    books: {
        endpoint: '/books', key: 'Books',
        cols: [
            { label: 'Title', fn: r => r.Title },
            { label: 'Author', fn: r => r.Author },
            { label: 'ISBN', fn: r => r.Isbn },
            { label: 'ID', fn: r => r.Id?.substring(0, 8) + '…' }
        ]
    },
    loans: {
        endpoint: '/loans', key: 'Loans',
        cols: [
            { label: 'CPF', fn: r => r.Cpf },
            { label: 'Book ID', fn: r => r.BookId?.substring(0, 8) + '…' },
            { label: 'Registered at', fn: r => r.RegisteredAt?.substring(0, 10) },
            { label: 'Due date', fn: r => r.DueDate },
            {
                label: 'Returned', fn: r => r.ReturnedAt
                    ? '<span class="badge ok">yes</span>'
                    : '<span class="badge warn">no</span>'
            }
        ]
    }
};

function restUrl() { return document.getElementById('restUrl').value; }

function renderForms() {
    Object.entries(FORMS).forEach(([name, def]) => {
        document.getElementById('f-' + name).innerHTML = def.fields.map(f =>
            `<div class="row">
        <label>${f.label}</label>
        <input id="${f.id}" type="${f.type}" ${f.value ? `value="${f.value}"` : ''}>
      </div>`
        ).join('');
    });
}

function showMsg(name, text, ok) {
    const el = document.getElementById('msg-' + name);
    el.className = 'msg ' + (ok ? 'ok' : 'err');
    el.textContent = text;
    setTimeout(() => el.style.display = 'none', 5000);
}

async function submit(name) {
    const def = FORMS[name];
    const body = {};
    for (const f of def.fields) {
        const v = document.getElementById(f.id).value;
        if (!v) { showMsg(name, 'Please fill in all fields', false); return; }
        body[f.key] = f.type === 'number' ? Number(v) : v;
    }
    try {
        const r = await fetch(restUrl() + def.target, {
            method: def.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || 'Error ' + r.status);
        showMsg(name, 'OK — ID: ' + (data.Id || data.LoanId || '—').substring(0, 8) + '…', true);
        def.fields.forEach(f => { document.getElementById(f.id).value = f.value || ''; });
    } catch (e) { showMsg(name, e.message, false); }
}

async function listData(name) {
    const def = TABLES[name];
    try {
        const r = await fetch(restUrl() + def.endpoint);
        const data = await r.json();
        const rows = data[def.key] || [];
        const tbl = document.getElementById('tbl-' + name);
        if (!rows.length) {
            tbl.innerHTML = '<p style="font-size:12px;color:#999;padding:8px 0">No items found</p>';
            return;
        }
        tbl.innerHTML = `<table>
      <thead><tr>${def.cols.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
      <tbody>${rows.map(r => `<tr>${def.cols.map(c => `<td>${c.fn(r) || '—'}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>`;
    } catch (e) { console.error(e); }
}

let ws = null;
function wsConnect() {
    if (ws) ws.close();

    ws = new WebSocket(document.getElementById('wsUrl').value);

    ws.onopen = () => {
        setWs(true);
        addWsLog('connected');
    };

    ws.onmessage = e => {
        try {
            const d = JSON.parse(e.data);
            addNotif(d.name, d.payload);
        } catch {
            addNotif('message', e.data);
        }
    };

    ws.onerror = () => {
        addWsLog('connection error');
    };

    ws.onclose = () => {
        setWs(false);
        addWsLog('disconnected');
    };
}

function setWs(ok) {
    const b = document.getElementById('wsStatus');
    b.className = 'badge ' + (ok ? 'ok' : 'warn');
    b.textContent = ok ? 'connected' : 'disconnected';
}

function addWsLog(msg) {
    const c = document.getElementById('wsLog');
    const t = new Date().toLocaleTimeString('en');
    const d = document.createElement('div');
    d.className = 'ws-ev';
    d.innerHTML = `<span>${t}</span> - ${msg}`;
    c.insertBefore(d, c.firstChild);
}

function addNotif(name, payload) {
    const c = document.getElementById('notifications');
    const empty = c.querySelector('.notif-empty');
    if (empty) empty.remove();

    const t = new Date().toLocaleTimeString('en');

    const d = document.createElement('div');
    d.className = 'notif';
    d.innerHTML = `<div class="notif-body"><span>${t}</span> - ${payload.Message}</div>`;
    c.insertBefore(d, c.firstChild);
}

renderForms();
setTimeout(wsConnect, 5000);