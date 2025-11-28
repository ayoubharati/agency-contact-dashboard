const fetch = require('node-fetch');

async function check() {
    try {
        const res = await fetch('https://main.d3jr1rt96xura8.amplifyapp.com/api/dbtest');
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Body:', text);
    } catch (e) {
        console.error(e);
    }
}

check();
