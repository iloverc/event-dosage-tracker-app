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

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

function renderEvents() {
    const list = document.getElementById('events-list');
    list.innerHTML = '';
    events.forEach((event, index) => {
        const listItem = document.createElement('ons-list-item');
        listItem.innerHTML = `
            <div class="center">
                Event Date: ${event.date}
            </div>
            <div class="right">
                <ons-button onclick="viewEvent(${index})">View</ons-button>
            </div>
        `;
        list.appendChild(listItem);
    });
}

function viewEvent(eventIndex) {
    const event = events[eventIndex];
    const modal = document.getElementById('event-modal');
    const dateElement = document.getElementById('event-date');
    const entriesList = document.getElementById('event-entries');

    dateElement.textContent = `Event Date: ${event.date}`;
    
    entriesList.innerHTML = '';

    event.entries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.innerHTML = `
            ${entry.name}: ${entry.substance} - ${entry.dosage} ${entry.unit}
            <ons-button modifier="quiet" onclick="deleteEntry(${eventIndex}, ${index})">Delete</ons-button>
        `;
        entriesList.appendChild(entryDiv);
    });

    modal.show();
    modal.dataset.eventIndex = eventIndex;
}

function showNewEntryModal() {
    document.getElementById('new-entry-modal').show();
}

function closeNewEntryModal() {
    document.getElementById('new-entry-modal').hide();
    resetNewEntryForm();
}

function closeEventModal() {
    document.getElementById('event-modal').hide();
}

function updateUnit() {
    const substance = document.getElementById('substance-select').value;
    const unitInput = document.getElementById('unit-input');
    
    switch(substance) {
        case 'K':
        case 'M':
        case '2cb':
        case 'Coke':
            unitInput.value = 'mg';
            break;
        case 'G':
            unitInput.value = 'ml';
            break;
        case 'N2O':
            unitInput.value = 'count';
            break;
        default:
            unitInput.value = '';
    }
}

function saveNewEntry() {
    const eventIndex = parseInt(document.getElementById('event-modal').dataset.eventIndex);
    const name = document.getElementById('name-input').value;
    const substance = document.getElementById('substance-select').value;
    const dosage = document.getElementById('dosage-input').value;
    const unit = document.getElementById('unit-input').value;

    if (name && substance && dosage && unit) {
        events[eventIndex].entries.push({ name, substance, dosage, unit });
        saveEvents();
        viewEvent(eventIndex);
        closeNewEntryModal();
    } else {
        alert('Please fill all fields');
    }
}

function resetNewEntryForm() {
    document.getElementById('name-input').value = '';
    document.getElementById('substance-select').value = '';
    document.getElementById('dosage-input').value = '';
    document.getElementById('unit-input').value = '';
}

function deleteEntry(eventIndex, entryIndex) {
    events[eventIndex].entries.splice(entryIndex, 1);
    saveEvents();
    viewEvent(eventIndex);
}

function deleteEvent() {
    const eventIndex = parseInt(document.getElementById('event-modal').dataset.eventIndex);
    events.splice(eventIndex, 1);
    saveEvents();
    renderEvents();
    closeEventModal();
}

function showJSONData() {
    const jsonOutput = document.getElementById('json-output');
    jsonOutput.textContent = JSON.stringify(events, null, 2);
    document.getElementById('json-modal').show();
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderEvents();
});
