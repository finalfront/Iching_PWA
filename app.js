function consult() {
    const query = document.getElementById('query').value.trim();
    if (!query) {
        alert('請輸入問題');
        return;
    }

    // Generate hexagrams
    const params = [6, 7, 7, 7, 8, 8, 8, 9];
    const output1 = [];
    const output2 = [];
    const pos = [];

    for (let i = 0; i < 6; i++) {
        const choice = params[Math.floor(Math.random() * params.length)];
        switch(choice) {
            case 6:
                output1.push(0);
                output2.push(1);
                pos.push(i);
                break;
            case 7:
                output1.push(1);
                output2.push(1);
                break;
            case 8:
                output1.push(0);
                output2.push(0);
                break;
            case 9:
                output1.push(1);
                output2.push(0);
                pos.push(i);
                break;
        }
    }

    const binaryStr1 = output1.join('');
    const binaryStr2 = output2.join('');

    // Find indices
    const id1 = odict.unicode_6.indexOf(binaryStr1);
    const id2 = odict.unicode_6.indexOf(binaryStr2);

    if (id1 === -1 || id2 === -1) {
        alert('Error: Hexagram not found');
        return;
    }

    // Build result
    let result = [];

    switch(pos.length) {
        case 0:
            result.push(idict[id1].scripture);
            break;
        case 1:
        case 2:
            for (let idx of pos) {
				const lineObj = idict[id1].lines[idx];
				const customStr = `${lineObj.name}: ${lineObj.scripture}`;
				result.push(customStr);
			 }
            result.reverse();
            break;
        case 3:
            result.push(idict[id2].scripture);
            result.push(idict[id1].scripture);
            break;
        case 4:
        case 5:
            for (let i = 0; i < 6; i++) {
                if (!pos.includes(i)) {
                const lineObj = idict[id1].lines[idx];
                const customStr = `${lineObj.name}: ${lineObj.scripture}`;
                result.push(customStr);
                }
            }
            break;
        case 6:
            result.push(idict[id2].scripture);
            // Check all yin or all yang
            if (output1.every(x => x === 1)) {
                result = [idict[0].lines[6]];
            } else if (output1.every(x => x === 0)) {
                result = [idict[1].lines[6]];
            }
            break;
    }

    // Format output
    const now = new Date();
    const timestamp = now.toLocaleString();
    const symbols = `${idict[id1].symbol}  ${idict[id2].symbol}`;
    const hexName = `${idict[id1].name} 之 ${idict[id2].name}`;
    const content = result.join('\n');

    // Display result
    document.getElementById('query-title').textContent = query;
    document.getElementById('result-time').textContent = timestamp;
    document.getElementById('symbols').textContent = symbols;
    document.getElementById('result-content').innerHTML = `<strong>${hexName}</strong><br><br>${content}`;
    document.getElementById('result').classList.add('show');

    // Save to history
    saveToHistory(query, {
        timestamp,
        symbols,
        hexName,
        content,
        id1,
        id2
    });

    // Clear input
    document.getElementById('query').value = '';
}

function saveToHistory(query, result) {
    const history = JSON.parse(localStorage.getItem('iching_history') || '[]');
    history.unshift({
        query,
        ...result
    });
    // // Keep only last 50
    // if (history.length > 50) history.pop();
    localStorage.setItem('iching_history', JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem('iching_history') || '[]');
    const historyList = document.getElementById('history-list');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p style="color: #888; text-align: center;">無記錄</p>';
        return;
    }

    historyList.innerHTML = history.map((item, idx) => `
        <div class="history-item" onclick="loadHistoryItem(${idx})">
            <div class="history-item-query">${item.query}</div>
            <div class="history-item-time">${item.timestamp}</div>
        </div>
    `).join('');
}

function loadHistoryItem(idx) {
    const history = JSON.parse(localStorage.getItem('iching_history') || '[]');
    const item = history[idx];
    
    document.getElementById('query-title').textContent = item.query;
    document.getElementById('result-time').textContent = item.timestamp;
    document.getElementById('symbols').textContent = item.symbols;
    document.getElementById('result-content').innerHTML = `<strong>${item.hexName}</strong><br><br>${item.content}`;
    document.getElementById('result').classList.add('show');
}

function clearHistory() {
    if (confirm('確定要清除所有記錄？')) {
        localStorage.removeItem('iching_history');
        displayHistory();
    }
}

// Load history on page load
window.addEventListener('load', displayHistory);

// Allow Enter to submit
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('query').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) consult();
    });
});
