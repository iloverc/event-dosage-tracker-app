document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
});

let events = JSON.parse(localStorage.getItem('events')) || [];

function createNewEvent() {
    const date = prompt('Enter event date (YYYY-MM-DD):');
    if (date) {
        const event = { date, entries: [] };
        events.push(event);
        saveEvents();
        renderEvents();
    }
}

function addDosage(eventIndex) {
    const modal = document.getElementById('entry-modal');
    modal.show();
    document.getElementById('entry-form').dataset.eventIndex = eventIndex;
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

function loadEvents() {
    renderEvents();
}

function renderEvents() {
    const list = document.getElementById('events-list');
    list.innerHTML = '';
    events.forEach((event, index) => {
        const listItem = document.createElement('ons-list-item');
        listItem.innerHTML = `
            <div class="center">${event.date}</div>
            <div class="right">
                <ons-button modifier="quiet" onclick="viewEvent(${index})">View</ons-button>
                <ons-button modifier="quiet" onclick="exportJson(${index})">Export JSON</ons-button>
                <ons-button modifier="quiet" onclick="deleteEvent(${index})">Delete</ons-button>
                <ons-button modifier="quiet" onclick="openAddDosageModal(${index})">Add Dosage</ons-button>
            </div>
        `;
        list.appendChild(listItem);
    });
}

function openAddDosageModal(index) {
    document.getElementById('entry-form').dataset.eventIndex = index;
    document.getElementById('entry-modal').show();
}

document.getElementById('entry-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addDosageEntry();
});

function addDosageEntry() {
    const name = document.getElementById('entry-name').value;
    const substance = document.getElementById('entry-substance').value;
    const dosage = parseFloat(document.getElementById('entry-dosage').value);
    const eventIndex = document.getElementById('entry-form').dataset.eventIndex;

    let dosageUnit;
    switch(substance) {
        case 'K':
        case 'M':
        case '2cb':
        case 'Coke':
            dosageUnit = 'mg';
            break;
        case 'G':
            dosageUnit = 'ml';
            break;
        case 'N2O':
            dosageUnit = 'count';
            break;
        default:
            alert('Invalid substance.');
            return;
    }

    if (name && substance && !isNaN(dosage)) {
        const entry = { name, substance, dosage, dosageUnit };
        events[eventIndex].entries.push(entry);
        saveEvents();
        closeEntryModal();
        renderEvents();
    }
}

function closeEntryModal() {
    document.getElementById('entry-modal').hide();
}

function viewEvent(index) {
    const event = events[index];
    let details = `Event Date: ${event.date}\n\nEntries:\n`;
    event.entries.forEach(entry => {
        details += `Name: ${entry.name}, Substance: ${entry.substance}, Dosage: ${entry.dosage} ${entry.dosageUnit}\n`;
    });
    document.getElementById('view-entries').textContent = details;
    document.getElementById('view-modal').show();
}

function closeViewModal() {
    document.getElementById('view-modal').hide();
}

function exportJson(index) {
    const event = events[index];
    const summary = event.entries.reduce((acc, entry) => {
        if (!acc[entry.name]) {
            acc[entry.name] = { K: 0, M: 0, "2cb": 0, G: 0, Coke: 0, N2O: 0 };
        }
        acc[entry.name][entry.substance] += entry.dosage;
        return acc;
    }, {});

    const jsonData = {
        event_date: event.date,
        individuals: Object.entries(summary).map(([name, substances]) => ({ name, substances }))
    };

    document.getElementById('json-output').textContent = JSON.stringify(jsonData, null, 2);
    document.getElementById('json-modal').show();
}

function closeJsonModal() {
    document.getElementById('json-modal').hide();
}

function deleteEvent(index) {
    if (confirm('Are you sure you want to delete this event?')) {
        events.splice(index, 1);
        saveEvents();
        renderEvents();
    }
}
