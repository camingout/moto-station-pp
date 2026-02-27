document.addEventListener('DOMContentLoaded', function() {
  const timepicker = document.getElementById('timepicker');
  const datepicker = flatpickr("#datepicker", {
    minDate: "today",
    dateFormat: "Y-m-d",
    onChange: function(selectedDates, dateStr) {
      fetch(`/.netlify/functions/get-available-times?date=${dateStr}`)
        .then(res => res.json())
        .then(data => {
          timepicker.innerHTML = "";
          if (data.available.length === 0) {
            let opt = document.createElement('option');
            opt.textContent = "Немає вільних годин";
            opt.value = "";
            timepicker.appendChild(opt);
          } else {
            let opt = document.createElement('option');
            opt.textContent = "Оберіть час";
            opt.value = "";
            timepicker.appendChild(opt);
            data.available.forEach(time => {
              let option = document.createElement('option');
              option.value = time;
              option.textContent = time;
              timepicker.appendChild(option);
            });
          }
        });
    }
  });

  document.getElementById('submit-booking').onclick = () => {
    const payload = {
      date: document.getElementById('datepicker').value,
      time: timepicker.value,
      name: document.getElementById('name').value,
      contact: document.getElementById('contact').value
    };
    if (!payload.date || !payload.time || !payload.name || !payload.contact) {
      document.getElementById('booking-result').textContent = 'Будь ласка, заповніть всі поля.';
      return;
    }
    fetch('/.netlify/functions/book-lesson', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }).then(res => res.json())
      .then(data => {
        document.getElementById('booking-result').textContent = data.message;
        if (data.success) {
          // Очищаємо поля
          document.getElementById('datepicker').value = "";
          timepicker.innerHTML = "<option>Оберіть час</option>";
          document.getElementById('name').value = "";
          document.getElementById('contact').value = "";
        }
      });
  };
});